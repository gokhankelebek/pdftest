import { Router, Request, Response } from 'express';
import { optionalAuth } from '../middleware/auth';
import prisma from '../prisma';

const router = Router();

// Create new test session
router.post('/', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { testId, studentName } = req.body;

    if (!testId) {
      return res.status(400).json({ error: 'testId is required' });
    }

    // Get test to count questions
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: true
      }
    });

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const session = await prisma.testSession.create({
      data: {
        testId,
        studentName: studentName || (req.user ? req.user.name : null),
        totalQuestions: test.questions.length,
        ...(req.user && { studentId: req.user.id })
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get session by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const session = await prisma.testSession.findUnique({
      where: { id },
      include: {
        answers: true,
        test: {
          include: {
            questions: {
              include: {
                regions: true
              }
            }
          }
        }
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Submit test session
router.post('/:id/submit', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'answers array is required' });
    }

    // Get session and test
    const session = await prisma.testSession.findUnique({
      where: { id },
      include: {
        test: {
          include: {
            questions: true
          }
        }
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Create a map of correct answers
    const correctAnswers = new Map(
      session.test.questions.map(q => [q.id, q.correctAnswer])
    );

    // Process and save answers
    let correctCount = 0;
    const answerRecords = answers.map((answer: any) => {
      const isCorrect = correctAnswers.get(answer.questionId) === answer.selectedAnswer;
      if (isCorrect) correctCount++;

      return {
        sessionId: id,
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect
      };
    });

    // Save all answers
    await prisma.answer.createMany({
      data: answerRecords
    });

    // Update session with score and end time
    const updatedSession = await prisma.testSession.update({
      where: { id },
      data: {
        score: correctCount,
        endTime: new Date()
      },
      include: {
        answers: true
      }
    });

    res.json(updatedSession);
  } catch (error) {
    console.error('Error submitting session:', error);
    res.status(500).json({ error: 'Failed to submit session' });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { validate, createQuestionSchema, updateQuestionSchema, deleteQuestionSchema } from '../middleware/validation';
import prisma from '../prisma';

const router = Router();

// Create question for a test
router.post('/tests/:testId/questions', requireAuth, validate(createQuestionSchema), async (req: Request, res: Response) => {
  try {
    const { testId } = req.params;
    const { questionNumber, pageNumber, correctAnswer } = req.body;

    if (!questionNumber || !pageNumber || !correctAnswer) {
      return res.status(400).json({
        error: 'questionNumber, pageNumber, and correctAnswer are required'
      });
    }

    // Check if test exists and user has permission
    const test = await prisma.test.findUnique({
      where: { id: testId },
      select: { id: true, createdById: true }
    });

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Only creator or ADMIN can add questions
    if (test.createdById !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to add questions to this test' });
    }

    const question = await prisma.question.create({
      data: {
        testId,
        questionNumber: parseInt(questionNumber),
        pageNumber: parseInt(pageNumber),
        correctAnswer
      },
      include: {
        regions: true
      }
    });

    res.status(201).json(question);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// Get question by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        regions: true
      }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// Update question
router.put('/:id', requireAuth, validate(updateQuestionSchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { questionNumber, pageNumber, correctAnswer } = req.body;

    // Check if question exists and get associated test
    const existingQuestion = await prisma.question.findUnique({
      where: { id },
      include: {
        test: {
          select: { createdById: true }
        }
      }
    });

    if (!existingQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Only test creator or ADMIN can update
    if (existingQuestion.test.createdById !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to update this question' });
    }

    const question = await prisma.question.update({
      where: { id },
      data: {
        ...(questionNumber !== undefined && { questionNumber: parseInt(questionNumber) }),
        ...(pageNumber !== undefined && { pageNumber: parseInt(pageNumber) }),
        ...(correctAnswer !== undefined && { correctAnswer })
      },
      include: {
        regions: true
      }
    });

    res.json(question);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// Delete question
router.delete('/:id', requireAuth, validate(deleteQuestionSchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if question exists and get associated test
    const existingQuestion = await prisma.question.findUnique({
      where: { id },
      include: {
        test: {
          select: { createdById: true }
        }
      }
    });

    if (!existingQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Only test creator or ADMIN can delete
    if (existingQuestion.test.createdById !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to delete this question' });
    }

    await prisma.question.delete({
      where: { id }
    });

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

export default router;

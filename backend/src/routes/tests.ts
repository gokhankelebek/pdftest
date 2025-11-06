import { Router, Request, Response } from 'express';
import { upload, getFileUrl } from '../middleware/upload';
import prisma from '../prisma';

const router = Router();

// Get all tests
router.get('/', async (req: Request, res: Response) => {
  try {
    const tests = await prisma.test.findMany({
      include: {
        questions: {
          include: {
            regions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
});

// Get single test
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            regions: true
          },
          orderBy: {
            questionNumber: 'asc'
          }
        }
      }
    });

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.json(test);
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({ error: 'Failed to fetch test' });
  }
});

// Create new test with PDF upload
router.post('/', upload.single('pdf'), async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Generate file URL
    const pdfUrl = getFileUrl(file.filename, req);

    // Create test in database
    const test = await prisma.test.create({
      data: {
        title,
        description: description || null,
        pdfUrl
      }
    });

    res.status(201).json(test);
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ error: 'Failed to create test' });
  }
});

// Update test
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const test = await prisma.test.update({
      where: { id },
      data: {
        title,
        description
      }
    });

    res.json(test);
  } catch (error) {
    console.error('Error updating test:', error);
    res.status(500).json({ error: 'Failed to update test' });
  }
});

// Delete test
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.test.delete({
      where: { id }
    });

    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error('Error deleting test:', error);
    res.status(500).json({ error: 'Failed to delete test' });
  }
});

// Get test sessions
router.get('/:id/sessions', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const sessions = await prisma.testSession.findMany({
      where: { testId: id },
      include: {
        answers: true
      },
      orderBy: {
        startTime: 'desc'
      }
    });

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

export default router;

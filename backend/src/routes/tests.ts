import { Router, Request, Response } from 'express';
import { upload, getFileUrl } from '../middleware/upload';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate, updateTestSchema, deleteTestSchema, getTestSchema } from '../middleware/validation';
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
router.get('/:id', validate(getTestSchema), async (req: Request, res: Response) => {
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
router.post('/', requireAuth, requireRole('TEACHER', 'ADMIN'), upload.single('pdf'), async (req: Request, res: Response) => {
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

    // Create test in database (user is guaranteed to exist due to requireAuth)
    const test = await prisma.test.create({
      data: {
        title,
        description: description || null,
        pdfUrl,
        createdById: req.user!.id
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(test);
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ error: 'Failed to create test' });
  }
});

// Update test
router.put('/:id', requireAuth, validate(updateTestSchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Check if test exists and user has permission
    const existingTest = await prisma.test.findUnique({
      where: { id },
      select: { id: true, createdById: true }
    });

    if (!existingTest) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Only creator or ADMIN can update
    if (existingTest.createdById !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to update this test' });
    }

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
router.delete('/:id', requireAuth, validate(deleteTestSchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if test exists and user has permission
    const existingTest = await prisma.test.findUnique({
      where: { id },
      select: { id: true, createdById: true }
    });

    if (!existingTest) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Only creator or ADMIN can delete
    if (existingTest.createdById !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to delete this test' });
    }

    await prisma.test.delete({
      where: { id }
    });

    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error('Error deleting test:', error);
    res.status(500).json({ error: 'Failed to delete test' });
  }
});

// Get test sessions (requires authentication - teachers/admins only)
router.get('/:id/sessions', requireAuth, requireRole('TEACHER', 'ADMIN'), validate(getTestSchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if test exists and user has permission
    const test = await prisma.test.findUnique({
      where: { id },
      select: { id: true, createdById: true }
    });

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Only creator or ADMIN can view sessions
    if (test.createdById !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to view sessions for this test' });
    }

    const sessions = await prisma.testSession.findMany({
      where: { testId: id },
      include: {
        answers: true,
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
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

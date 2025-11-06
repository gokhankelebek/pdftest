import { Router, Request, Response } from 'express';
import prisma from '../prisma';

const router = Router();

// Create region for a question
router.post('/questions/:questionId/regions', async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;
    const { answerId, x, y, width, height } = req.body;

    if (!answerId || x === undefined || y === undefined || width === undefined || height === undefined) {
      return res.status(400).json({
        error: 'answerId, x, y, width, and height are required'
      });
    }

    const region = await prisma.region.create({
      data: {
        questionId,
        answerId,
        x: parseFloat(x),
        y: parseFloat(y),
        width: parseFloat(width),
        height: parseFloat(height)
      }
    });

    res.status(201).json(region);
  } catch (error) {
    console.error('Error creating region:', error);
    res.status(500).json({ error: 'Failed to create region' });
  }
});

// Get region by ID
router.get('/regions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const region = await prisma.region.findUnique({
      where: { id }
    });

    if (!region) {
      return res.status(404).json({ error: 'Region not found' });
    }

    res.json(region);
  } catch (error) {
    console.error('Error fetching region:', error);
    res.status(500).json({ error: 'Failed to fetch region' });
  }
});

// Update region
router.put('/regions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { answerId, x, y, width, height } = req.body;

    const region = await prisma.region.update({
      where: { id },
      data: {
        ...(answerId !== undefined && { answerId }),
        ...(x !== undefined && { x: parseFloat(x) }),
        ...(y !== undefined && { y: parseFloat(y) }),
        ...(width !== undefined && { width: parseFloat(width) }),
        ...(height !== undefined && { height: parseFloat(height) })
      }
    });

    res.json(region);
  } catch (error) {
    console.error('Error updating region:', error);
    res.status(500).json({ error: 'Failed to update region' });
  }
});

// Delete region
router.delete('/regions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.region.delete({
      where: { id }
    });

    res.json({ message: 'Region deleted successfully' });
  } catch (error) {
    console.error('Error deleting region:', error);
    res.status(500).json({ error: 'Failed to delete region' });
  }
});

export default router;

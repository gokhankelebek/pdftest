import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodIssue } from 'zod';

// Validation middleware factory
export const validate = (schema: z.ZodObject<any, any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: ZodIssue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }));
        return res.status(400).json({
          error: 'Validation failed',
          details: errorMessages
        });
      }
      next(error);
    }
  };
};

// Validation schemas

// Auth schemas
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(1, 'Name is required'),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']).optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

// Test schemas
export const createTestSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
    description: z.string().max(1000, 'Description is too long').optional()
  })
});

export const updateTestSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long').optional(),
    description: z.string().max(1000, 'Description is too long').optional()
  }),
  params: z.object({
    id: z.string().uuid('Invalid test ID')
  })
});

export const deleteTestSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid test ID')
  })
});

export const getTestSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid test ID')
  })
});

// Question schemas
export const createQuestionSchema = z.object({
  body: z.object({
    questionNumber: z.number().int().positive('Question number must be positive').or(
      z.string().transform((val) => parseInt(val, 10))
    ),
    pageNumber: z.number().int().positive('Page number must be positive').or(
      z.string().transform((val) => parseInt(val, 10))
    ),
    correctAnswer: z.string().min(1, 'Correct answer is required').max(10, 'Correct answer is too long')
  }),
  params: z.object({
    testId: z.string().uuid('Invalid test ID')
  })
});

export const updateQuestionSchema = z.object({
  body: z.object({
    questionNumber: z.number().int().positive('Question number must be positive').or(
      z.string().transform((val) => parseInt(val, 10))
    ).optional(),
    pageNumber: z.number().int().positive('Page number must be positive').or(
      z.string().transform((val) => parseInt(val, 10))
    ).optional(),
    correctAnswer: z.string().min(1, 'Correct answer is required').max(10, 'Correct answer is too long').optional()
  }),
  params: z.object({
    id: z.string().uuid('Invalid question ID')
  })
});

export const deleteQuestionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid question ID')
  })
});

// Region schemas
export const createRegionSchema = z.object({
  body: z.object({
    answerId: z.string().min(1, 'Answer ID is required').max(10, 'Answer ID is too long'),
    x: z.number().min(0, 'X coordinate must be non-negative').max(100, 'X coordinate must be <= 100').or(
      z.string().transform((val) => parseFloat(val))
    ),
    y: z.number().min(0, 'Y coordinate must be non-negative').max(100, 'Y coordinate must be <= 100').or(
      z.string().transform((val) => parseFloat(val))
    ),
    width: z.number().min(0, 'Width must be non-negative').max(100, 'Width must be <= 100').or(
      z.string().transform((val) => parseFloat(val))
    ),
    height: z.number().min(0, 'Height must be non-negative').max(100, 'Height must be <= 100').or(
      z.string().transform((val) => parseFloat(val))
    )
  }),
  params: z.object({
    questionId: z.string().uuid('Invalid question ID')
  })
});

export const updateRegionSchema = z.object({
  body: z.object({
    answerId: z.string().min(1, 'Answer ID is required').max(10, 'Answer ID is too long').optional(),
    x: z.number().min(0, 'X coordinate must be non-negative').max(100, 'X coordinate must be <= 100').or(
      z.string().transform((val) => parseFloat(val))
    ).optional(),
    y: z.number().min(0, 'Y coordinate must be non-negative').max(100, 'Y coordinate must be <= 100').or(
      z.string().transform((val) => parseFloat(val))
    ).optional(),
    width: z.number().min(0, 'Width must be non-negative').max(100, 'Width must be <= 100').or(
      z.string().transform((val) => parseFloat(val))
    ).optional(),
    height: z.number().min(0, 'Height must be non-negative').max(100, 'Height must be <= 100').or(
      z.string().transform((val) => parseFloat(val))
    ).optional()
  }),
  params: z.object({
    id: z.string().uuid('Invalid region ID')
  })
});

export const deleteRegionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid region ID')
  })
});

// Session schemas
export const createSessionSchema = z.object({
  body: z.object({
    testId: z.string().uuid('Invalid test ID'),
    studentName: z.string().min(1, 'Student name is required').max(255, 'Student name is too long').optional()
  })
});

export const submitSessionSchema = z.object({
  body: z.object({
    answers: z.array(
      z.object({
        questionId: z.string().uuid('Invalid question ID'),
        selectedAnswer: z.string().min(1, 'Selected answer is required').max(10, 'Selected answer is too long')
      })
    ).min(1, 'At least one answer is required')
  }),
  params: z.object({
    id: z.string().uuid('Invalid session ID')
  })
});

export const getSessionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid session ID')
  })
});


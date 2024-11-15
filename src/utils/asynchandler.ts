import { Request, Response, NextFunction } from 'express';

interface AsyncHandler {
    <T = {}, U = {}, P = {}, Q = {}>(
        fn: (req: Request<T, U, P, Q>, res: Response, next: NextFunction) => Promise<void>
    ): (req: Request<T, U, P, Q>, res: Response, next: NextFunction) => Promise<void>;
}


const asyncHandler: AsyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error: any) {
        console.log(error);

        if (error.code === 11000) {
            // Handle MongoDB duplicate key error
            const duplicateKey = Object.keys(error.keyValue).join(', ');
            res.status(400).json({
                success: false,
                message: `Duplicate value for unique field(s): ${duplicateKey}. Please use a different value.`,
            });
        } else if (error.name === 'ValidationError') {
            const missingFields = Object.keys(error.errors);
            res.status(400).json({
                success: false,
                message: `Missing or invalid fields: ${missingFields.join(', ')}`,
            });
        } else {
            res.status(error.code || 500).json({
                message: error.message || `Internal Server Error`,
                success: false,
            });
        }
    }
};


export default asyncHandler;
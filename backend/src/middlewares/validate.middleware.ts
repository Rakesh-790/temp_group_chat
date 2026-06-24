import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const validate = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query
        });

        if (!result.success) {
            return res.status(400).json({
                success: false,
                errors: result.error.issues
            });
        };

        next();
    };
};

export default validate;
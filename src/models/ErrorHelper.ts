import { Request, Response } from "express";

export class ErrorHelper {
    errorMessage?: string;
    emmitError ( error: string, res?: Response, status?: number) {
        res.status(404).send({
            response: error
        });
    }
}

export const errorHelper = new ErrorHelper();
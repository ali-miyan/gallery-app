import { Request, Response,NextFunction } from "express"

export const pageNotFound = (req:Request,res:Response,next:NextFunction) => {
    const error = new Error(`Page Not Found = ${req.originalUrl}`)
    res.status(400)
    next(error)
}

export const errorHandler = (err:Error, req:Request,res:Response,next:NextFunction) => {
    console.log(err);
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if(err.name === 'CastError'){
        const CastError = err as any
        if(CastError.kind === 'ObjectId'){  
            statusCode = 404;
            message = 'data not found'
        }
    }

    res.status(statusCode).send({
        message,
        stack:process.env.NODE_ENV === 'production' ? null : err.stack
    })
}
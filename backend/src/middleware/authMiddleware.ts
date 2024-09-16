import { NextFunction, Request, Response } from "express";
import { config } from 'dotenv';
config();
import jwt from 'jsonwebtoken';

export const authenticateUser = (req: any, res: any, next: NextFunction) => {

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({status:false,message:'not token availale'})
    }

    jwt.verify(token, process.env.WEB_TOKEN as string, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({status:false, message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};
export const authenticateAdmin = (req: any, res: any, next: NextFunction) => {
    console.log('cccccccccccccccccccccccccccccc');
    
    const token = req.cookies.adminToken;

    if(!token){
        return res.json({status:false,message:'not token availale'})
    }

    jwt.verify(token, process.env.WEB_TOKEN as string, (err: any, decoded: any) => {
        if (err) {
            return res.json({status:false, message: 'Unauthorized' });
        }
        req.admin = decoded;
        next();
    });
};

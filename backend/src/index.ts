import express, { Express } from 'express';
import userRoute from './routes/userRoute';
import { pageNotFound, errorHandler } from './middleware/errorMiddleware';
import connectDB from './config/config';
const app: Express = express();
import cors from 'cors';
import cookie from 'cookie-parser';
connectDB()

const port = process.env.PORT || 5000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(cookie())

app.use('/api/user', userRoute)

app.use(pageNotFound)
app.use(errorHandler)


app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import "./db";
import authRouter from "./routers/auth";
import audioRouter from "./routers/audio"
import favoriteRouter from "./routers/favorite"
import playlistRouter from "./routers/playlist"
import profileRouter from "./routers/profile"
import historyRouter from "./routers/history"
import"./util/schedule"
import { errorHandler } from "./middleware/error";
import { Request, Response, NextFunction } from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));
app.use('/auth', authRouter);
app.use('/audio', audioRouter);
app.use('/favorite', favoriteRouter);
app.use('/playlist',playlistRouter);
app.use('/profile',profileRouter);
app.use('/history',historyRouter);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});
const Port = process.env.port || 8989;

app.listen(Port, () => {
    console.log("listening on port " + Port);
});
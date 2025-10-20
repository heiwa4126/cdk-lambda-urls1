import express, { type Express, type Request, type Response } from "express";

const app: Express = express();

app.get("/hello", (req: Request, res: Response) => {
	res.json({ message: "Hello from lambda1!" });
});

export default app;

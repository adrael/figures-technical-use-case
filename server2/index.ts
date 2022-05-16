import express, { Express, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import cors from "cors";
import { Job } from "../queries/useJobQuery";
import { computeStats } from "../utils/stats";

const app: Express = express();
const port = 3001;

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/jobs", async (req: Request, res: Response) => {
  res.send(await prisma.job.findMany());
});

app.get("/employees", async (req: Request, res: Response) => {
  res.send(await prisma.employee.findMany());
});

app.get("/employees/:jobId", async (req: Request<{ jobId: Job["id"] }, any>, res: Response) => {
  const employees = await prisma.employee.findMany({ where: { jobId: +req.params.jobId } });
  res.send(computeStats(employees));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

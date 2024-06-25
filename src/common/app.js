import express from "express";

const app = express();

app.use(express.json({ limit: "10mb" }));

export default app;

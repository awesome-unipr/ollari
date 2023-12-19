import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

const HTTP_PORT = process.env.HTTP_PORT || 8888;

app.listen(HTTP_PORT, () => {
  console.log(`Server is listening on port ${HTTP_PORT}`);
});

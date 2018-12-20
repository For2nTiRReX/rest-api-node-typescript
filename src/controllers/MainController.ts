import { Request, Response } from "express";

export class MainController {
  public root(req: Request, res: Response) {
    res.status(200).send({
      response: "Api works ok"
    });
  }
}

export const mainController = new MainController();

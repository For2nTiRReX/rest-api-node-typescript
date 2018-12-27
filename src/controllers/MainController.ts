import { Request, Response } from "express";

export class MainController {
  public root(req: Request, res: Response) {
    res.status(200).send({
      response: "Api works ok"
    });
  }

  public path404(req: Request, res: Response) {
    res.status(404).send({
      response: "Wrong request"
    });
  }
}

export const mainController = new MainController();

import * as express from "express";
import { usersController } from "../controllers/UsersController";

class UsersRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router
        .get("/users", (req: express.Request, res: express.Response) =>
            usersController.getUsers(req, res)
        )
        .get("/users/:userId", (req: express.Request, res: express.Response) =>
            usersController.getUsers(req, res)
        )
        .get("/users/:userId/posts", (req: express.Request, res: express.Response) =>
            usersController.getUserPosts(req, res)
        )
        .post("/users/add", (req: express.Request, res: express.Response) =>
            usersController.addUser(req, res)
        )
        .put("/users/:userId", (req: express.Request, res: express.Response) =>
            usersController.editUser(req, res)
        )
        .delete("/users/:userId", (req: express.Request, res: express.Response) =>
            usersController.deleteUser(req, res)
        )
  }
}

export const usersRoutes = new UsersRoutes().router;
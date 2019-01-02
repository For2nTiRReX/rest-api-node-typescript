import * as express from "express";
import { usersController } from "../controllers/UsersController";

class UsersRoutes {
    public router: express.Router = express.Router();

    constructor() {
        this.config();
    }

    private config(): void {
        this.router
            .get("", (req: express.Request, res: express.Response) =>
                usersController.getUsers(req, res)
            )
            // To get post comments add "user_posts=1" to url arg.
            .get("", (req: express.Request, res: express.Response) =>
                usersController.getUsersPosts(req, res)
            )
            .get("/:userId", (req: express.Request, res: express.Response) =>
                usersController.getUser(req, res)
            )
            // To get post comments add "user_posts=1" to url arg.
            .get("/:userId", (req: express.Request, res: express.Response) =>
                usersController.getUserPosts(req, res)
            )
            .post("/add", (req: express.Request, res: express.Response) =>
                usersController.addUser(req, res)
            )
            .put("/:userId", (req: express.Request, res: express.Response) =>
                usersController.editUser(req, res)
            )
            .delete("/:userId", (req: express.Request, res: express.Response) =>
                usersController.deleteUser(req, res)
            )
    }
}

export const usersRoutes = new UsersRoutes().router;
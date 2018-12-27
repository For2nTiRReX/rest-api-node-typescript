import * as express from "express";
import { postsController } from "../controllers/PostsController";

class PostsRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router
        .get("/posts", (req: express.Request, res: express.Response) =>
            postsController.getPosts(req, res)
        )
        .get("/posts/:postId", (req: express.Request, res: express.Response) =>
            postsController.getPost(req, res)
        )
        .get("/posts/:postId/comments", (req: express.Request, res: express.Response) =>
            postsController.getPostComments(req, res)
        )
        .post("/posts/add", (req: express.Request, res: express.Response) =>
            postsController.addPost(req, res)
        )
        .put("/posts/:postId", (req: express.Request, res: express.Response) =>
            postsController.editPost(req, res)
        )
        .delete("/posts/:postId", (req: express.Request, res: express.Response) =>
            postsController.deletePost(req, res)
        )
  }
}

export const postsRoutes = new PostsRoutes().router;
import * as express from "express";
import { postsController } from "../controllers/PostsController";

class PostsRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router
        .get("", (req: express.Request, res: express.Response) =>
            postsController.getPosts(req, res)
        )
        // To get post comments add "post_comments=1" to url arg.
        .get("/:postId", (req: express.Request, res: express.Response) =>
            postsController.getPost(req, res)
        )
        // .get("/posts/:postId/comments", (req: express.Request, res: express.Response) =>
        //     postsController.getPostComments(req, res)
        // )
        .post("/add", (req: express.Request, res: express.Response) =>
            postsController.addPost(req, res)
        )
        .put("/:postId", (req: express.Request, res: express.Response) =>
            postsController.editPost(req, res)
        )
        .delete("/:postId", (req: express.Request, res: express.Response) =>
            postsController.deletePost(req, res)
        )
  }
}

export const postsRoutes = new PostsRoutes().router;
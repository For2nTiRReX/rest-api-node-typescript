import * as express from "express";
import * as bodyParser from "body-parser";
import { mainRoutes } from "./routes/MainRoutes";
import { postsRoutes } from "./routes/PostsRoutes";
import { usersRoutes } from "./routes/UsersRoutes";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    // support application/json
    this.app.use(bodyParser.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.static('public'));
    // Routing
    this.app.use("/posts",postsRoutes);
    this.app.use("/users",usersRoutes);
    this.app.use(mainRoutes);
  }
}

export default new App().app;
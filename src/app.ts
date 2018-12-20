import * as express from "express";
import * as bodyParser from "body-parser";
import { mainRoutes } from "./routes/MainRoutes";
import { postsRoutes } from "./routes/PostsRoutes";

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
    this.app.use(mainRoutes,postsRoutes);
  }
}

export default new App().app;
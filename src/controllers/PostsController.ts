import { Request, Response } from "express";
import axios, {AxiosResponse} from "axios";
import { Observable, from, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { config as apiConfig }  from "../config/api-config"
import { Post, Comment, User  } from '../models';

export class PostsController {
  public getPosts(req: Request, res: Response) {  
    let posts: Post[];
    let comments: Comment[];
    let getPostsRequest: Observable<AxiosResponse> = from(axios.get(`${apiConfig.root}/posts`));
    let commentsRequest: Observable<AxiosResponse>;
    let apiCall: Observable<any> = getPostsRequest;
    if (req.query["post_comments"]) {
      commentsRequest = from(axios.get(`${apiConfig.root}/comments`));
      apiCall = forkJoin([ getPostsRequest, commentsRequest ]);
      apiCall
        .subscribe(response => {
          [{data: posts}, {data: comments}] = response;
          res.status(200).send({
            response: this.fillPostComments(posts,comments)
          });
        });
    } else {
      apiCall
        .subscribe(response => {
          posts = response.data;
          res.status(response.status).send({
            response: posts
          });
        });
    }
    return apiCall;
  }

  public getPost(req: Request, res: Response) {
    let post: Post;
    let apiCall: Observable<AxiosResponse> = from(axios.get(`${apiConfig.root}/posts/${req.params.postId}`));
    apiCall
      .subscribe(response => {
        post = response.data;
        res.status(response.status).send({
          response: post
        });
      });
    return apiCall;
  }

  public getPostComments(req: Request, res: Response) {
    let postWithComments: Post;
    let apiCall: Observable<any>;
    let postComments: Observable<Array<Comment>> = from(axios.get(`${apiConfig.root}/comments`))
      .pipe( 
        map( apiResponse => apiResponse.data ),
        map( comments => comments.filter(comment => comment.postId == req.params.postId ))
      );

    let post: Observable<Post> = from(axios.get(`${apiConfig.root}/posts/${req.params.postId}`))
      .pipe(
        map( apiResponse => apiResponse.data )
      );
    apiCall = forkJoin([ post, postComments ]);
    apiCall
      .subscribe( results => {
        postWithComments = {
          ...results[0],
          comments: results[1]};
        res.status(200).send({
          response: postWithComments
        });
      });
    return apiCall;  
  }

  public addPost(req: Request, res: Response) {
    let createdPost: Post;
    let postParams = {...req.body};
    postParams.userId = +postParams.userId;
    let apiCall: Observable<AxiosResponse> = from(axios.post(`${apiConfig.root}/posts`, postParams));
    apiCall
      .subscribe(response => {
        createdPost = {...response.data}
        res.status(response.status).send({
          response: createdPost
        });
      });
    return apiCall;
  }

  public editPost(req: Request, res: Response) {
    let updatedPost: Post;
    let postParams: Post = { id: +req.params.postId, ...req.body };
    postParams.userId = +postParams.userId;
    let apiCall: Observable<AxiosResponse> = from(axios.put(`${apiConfig.root}/posts/${req.params.postId}`, postParams));
    apiCall
      .subscribe(response => {
        updatedPost = response.data;
        res.status(response.status).send({
          response: updatedPost
        });
      });
    return apiCall;
  }
  
  public deletePost(req: Request, res: Response) {
    let apiCall: Observable<AxiosResponse> = from(axios.delete(`${apiConfig.root}/posts/${req.params.postId}`));
    apiCall
      .subscribe(response => {
        res.status(response.status).send({
          response: response.data
        });
      });
    return apiCall;
  }

  private fillPostComments(post: Post[], comments: Comment[]): Post[] {
    return post.map(post => {
      return {...post, comments: comments.filter(comment => comment.postId == post.id)};
    });
    
  }
}

export const postsController = new PostsController();

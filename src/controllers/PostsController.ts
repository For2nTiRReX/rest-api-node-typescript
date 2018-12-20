import { Request, Response } from "express";
import axios, {AxiosResponse} from "axios";
import { Observable, from, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { config as apiConfig }  from "../config/api-config"
import { Post, Comment, User  } from '../models';

export class PostsController {

  public getPosts(req: Request, res: Response) {  
    let posts: Post[];
    let apiCall: Observable<AxiosResponse> = from(axios.get(`${apiConfig.root}/posts`));
    apiCall
      .subscribe(response => {
        posts = response.data;
        res.status(200).send({
          response: posts
        });
      });
    return apiCall;
  }

  public getPost(req: Request, res: Response) {
    let post: Post;
    axios.get(`${apiConfig.root}/posts/${req.params.postId}`)
    .then(response => {
      post = response.data;
      res.status(200).send({
        response: post
      });
    });
  }

  public getUserPosts(req: Request, res: Response) {
    let userWithPosts: User;
    let userPosts: Observable<Array<Post>> = from(axios.get(`${apiConfig.root}/posts`))
      .pipe( 
        map( apiResponse => apiResponse.data ),
        map( posts => posts.filter(post => post.userId == req.params.userId ))
      );

    let user: Observable<User> = from(axios.get(`${apiConfig.root}/users/${req.params.userId}`))
      .pipe(
        map( apiResponse => apiResponse.data )
      );
      
    forkJoin([ user, userPosts ])
      .subscribe( results => {
        userWithPosts = {
          ...results[0],
          posts: results[1]};
        res.status(200).send({
          response: userWithPosts
        });
      });
  }

  public getPostComments(req: Request, res: Response) {

    let postWithComments: Post;
    let postComments: Observable<Array<Comment>> = from(axios.get(`${apiConfig.root}/comments`))
      .pipe( 
        map( apiResponse => apiResponse.data ),
        map( comments => comments.filter(comment => comment.postId == req.params.postId ))
      );

    let post: Observable<Post> = from(axios.get(`${apiConfig.root}/posts/${req.params.postId}`))
      .pipe(
        map( apiResponse => apiResponse.data )
      );
      
    forkJoin([ post, postComments ])
      .subscribe( results => {
        postWithComments = {
          ...results[0],
          comments: results[1]};
        res.status(200).send({
          response: postWithComments
        });
      });
  }

  public addPost(req: Request, res: Response) {
    let createdPost: Post;
    let postParams = {...req.body};
    postParams.userId = +postParams.userId;
    axios.post(`${apiConfig.root}/posts`, postParams)
    .then(response => {
      createdPost = {...response.data}
      res.status(200).send({
        response: createdPost
      });
    });

  }

  public editPost(req: Request, res: Response) {
    let updatedPost: Post;
    let postParams: Post = { id: +req.params.postId, ...req.body };
    postParams.userId = +postParams.userId;
    axios.put(`${apiConfig.root}/posts/${req.params.postId}`, postParams)
    .then(response => {
      updatedPost = response.data;
      res.status(200).send({
        response: updatedPost
      });
    });
  }
  
  public deletePost(req: Request, res: Response) {
    axios.delete(`${apiConfig.root}/posts/${req.params.postId}`)
    .then(response => {
      res.status(200).send({
        response: response.data
      });
    });
  }

}

export const postsController = new PostsController();

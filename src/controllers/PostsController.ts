import { Request, Response } from "express";
import axios, { AxiosResponse, AxiosError } from "axios";
import { Observable, from, forkJoin } from 'rxjs';
import { config as apiConfig } from "../config/api-config"
import { Post, Comment } from '../models';
import { errorHelper } from "../models/ErrorHelper";
import { map } from 'rxjs/operators';

export class PostsController {

  public getPosts(req: Request, res: Response): void {
    let getPostsRequest: Observable<AxiosResponse>;
    let apiCall: Observable<any>;
    if (req.query["post_comments"]) {
      req.next();
      return;
    }
    getPostsRequest = from(axios.get(`${apiConfig.root}/posts`));
    apiCall = getPostsRequest
      .pipe(map(response => response.data));
    apiCall.subscribe(posts => {
      res.status(200).send({
        response: posts
      });
    });
  }

  public getPostsComments(req: Request, res: Response): void {
    let posts: Post[];
    let comments: Comment[];
    let getPostsRequest: Observable<AxiosResponse>;
    let commentsRequest: Observable<AxiosResponse>;
    let apiCall: Observable<any>;
    getPostsRequest = from(axios.get(`${apiConfig.root}/posts`));
    commentsRequest = from(axios.get(`${apiConfig.root}/comments`));
    apiCall = forkJoin([getPostsRequest, commentsRequest])
      .pipe(map(data => {
        [{ data: posts }, { data: comments }] = data;
        posts = this.fillPostComments(posts, comments);
        return posts;
      }));
    apiCall.subscribe(posts => {
      res.status(200).send({
        response: posts
      });
    });
  }

  public getPost(req: Request, res: Response): void {
    let post: Post;
    if (req.query["post_comments"]) {
      req.next();
      return;
    }
    let apiCall: Observable<AxiosResponse> = from(axios.get(`${apiConfig.root}/posts/${req.params.postId}`));
    apiCall.subscribe(
      (response) => {
        post = response.data;
        res.status(response.status).send({
          response: post
        });
      },
      (err) => {
        console.log(err.response.status);
        errorHelper.emmitError('Post with the ID isn\'t exist', res);
      }
    );
  }

  public getPostComments(req: Request, res: Response): void {
    let post: Post;
    let comments: Comment[];
    let getPostsRequest: Observable<AxiosResponse>;
    let commentsRequest: Observable<AxiosResponse>;
    let apiCall: Observable<any>;
    getPostsRequest = from(axios.get(`${apiConfig.root}/posts/${req.params.postId}`));
    commentsRequest = from(axios.get(`${apiConfig.root}/posts/${req.params.postId}/comments`));
    apiCall = forkJoin([getPostsRequest, commentsRequest])
      .pipe(map(data => {
        [{ data: post }, { data: comments }] = data;
        return this.fillPostComments([post], comments);
      }));
    apiCall.subscribe(posts => {
      res.status(200).send({
        response: posts[0]
      });
    });
  }

  public addPost(req: Request, res: Response): void {
    let createdPost: Post;
    let postParams = { ...req.body };
    postParams.userId = +postParams.userId;
    if (!postParams.hasOwnProperty('userId') && !postParams.hasOwnProperty('title') && !postParams.hasOwnProperty('body')) {
      errorHelper.emmitError(`Have missed one of required params`, res);
      return;
    }
    let apiCall: Observable<AxiosResponse> = from(axios.post(`${apiConfig.root}/posts`, postParams));
    apiCall.subscribe(
      (response) => {
        createdPost = { ...response.data }
        res.status(response.status).send({
          response: createdPost
        });
      },
      (err) => {
        console.log(err.response.status);
        errorHelper.emmitError('Post with the ID isn\'t exist', res);
      }
    );
  }

  public editPost(req: Request, res: Response): void {
    let updatedPost: Post;
    let postParams: Post = { id: +req.params.postId, ...req.body };
    postParams.userId = +postParams.userId;
    let apiCall: Observable<AxiosResponse> = from(axios.put(`${apiConfig.root}/posts/${req.params.postId}`, postParams));
    apiCall.subscribe(
      (response) => {
        updatedPost = response.data;
        res.status(response.status).send({
          response: updatedPost
        });
      },
      (err) => {
        console.log(err.response.status);
        errorHelper.emmitError(`Post wasn't update: "Post with the ID isn't exist"`, res);
      }
    );
  }

  public deletePost(req: Request, res: Response): void {
    let apiCall: Observable<AxiosResponse> = from(axios.delete(`${apiConfig.root}/posts/${req.params.postId}`));
    apiCall.subscribe(
      (response) => {
        res.status(response.status).send({
          response: response.data
        });
      },
      (err) => {
        console.log(err.response.status);
        errorHelper.emmitError(`Post wasn't update: "Post with the ID isn't exist"`, res);
      });
  }

  private fillPostComments(post: Post[], comments: Comment[]): Post[] {
    return post.map(post => {
      return { ...post, comments: comments.filter(comment => comment.postId == post.id) };
    });
  }
}

export const postsController = new PostsController();

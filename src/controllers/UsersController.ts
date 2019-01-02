import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import { Observable, from, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { errorHelper } from "../models/ErrorHelper";

import { config as apiConfig } from "../config/api-config"
import { Post, User } from '../models';

export class UsersController {

  public getUsers(req: Request, res: Response): void {
    let getUsersRequest: Observable<AxiosResponse>;
    let apiCall: Observable<any>;
    console.log(Object.keys(req),req.params);
    console.log(`<----------------------------->`);
    console.log(Object.keys(res));
    if (req.query["user_posts"]) {
      req.next();
      return;
    }
    getUsersRequest = from(axios.get(`${apiConfig.root}/users`));
    apiCall = getUsersRequest
      .pipe(map(response => response.data));
    apiCall.subscribe(users => {
      res.status(200).send({
        response: users
      });
    });
  }

  public getUsersPosts(req: Request, res: Response): void {
    let posts: Post[];
    let users: User[];
    let getPostsRequest: Observable<AxiosResponse>;
    let usersRequest: Observable<AxiosResponse>;
    let apiCall: Observable<any>;
    getPostsRequest = from(axios.get(`${apiConfig.root}/posts`));
    usersRequest = from(axios.get(`${apiConfig.root}/users`));
    apiCall = forkJoin([getPostsRequest, usersRequest])
      .pipe(map(data => {
        [{ data: posts }, { data: users }] = data;
        users = this.fillUserPosts(users, posts);
        return users;
      }));
    apiCall.subscribe(posts => {
      res.status(200).send({
        response: posts
      });
    });
  }

  public getUser(req: Request, res: Response) {
    let user: User;
    if (req.query["user_posts"]) {
      req.next();
      return;
    }
    let apiCall: Observable<AxiosResponse> = from(axios.get(`${apiConfig.root}/users/${req.params.userId}`));
    apiCall.subscribe(
      (response) => {
        user = response.data;
        res.status(response.status).send({
          response: user
        });
      },
      (err) => {
        console.log(err.response.status);
        errorHelper.emmitError('User with the ID isn\'t exist', res);
      }
    );
  }

  public getUserPosts(req: Request, res: Response) {
    let posts: Post[];
    let user: User;
    let getPostsRequest: Observable<AxiosResponse>;
    let userRequest: Observable<AxiosResponse>;
    let apiCall: Observable<any>;
    getPostsRequest = from(axios.get(`${apiConfig.root}/posts`));
    userRequest = from(axios.get(`${apiConfig.root}/users/${req.params.userId}`));
    apiCall = forkJoin([getPostsRequest, userRequest])
      .pipe(map(data => {
        [{ data: posts }, { data: user }] = data;
        return this.fillUserPosts([user], posts);
      }));
    apiCall.subscribe(users => {
      res.status(200).send({
        response: users[0]
      });
    });
  }

  public addUser(req: Request, res: Response): void {
    let createdUser: User;
    let userParams = { ...req.body };
    if (!userParams.hasOwnProperty('name') && !userParams.hasOwnProperty('username') && !userParams.hasOwnProperty('email')) {
      errorHelper.emmitError(`Have missed one of required params`, res);
      return;
    }
    let apiCall: Observable<AxiosResponse> = from(axios.post(`${apiConfig.root}/users`, userParams));
    apiCall.subscribe(
      (response) => {
        createdUser = { ...response.data }
        res.status(response.status).send({
          response: createdUser
        });
      },
      (err) => {
        console.log(err.response.status);
        errorHelper.emmitError('Api isn\'t able to create user', res);
      }
    );
  }

  public editUser(req: Request, res: Response): void {
    let updatedUser: User;
    let userParams: User = { id: +req.params.userId, ...req.body };
    let apiCall: Observable<AxiosResponse> = from(axios.put(`${apiConfig.root}/users/${req.params.userId}`, userParams));
    apiCall.subscribe(
      (response) => {
        updatedUser = response.data;
        res.status(response.status).send({
          response: updatedUser
        });
      },
      (err) => {
        console.log(err.response.status);
        errorHelper.emmitError(`User wasn't update: "User with the ID isn't exist"`, res);
      }
    );
  }

  public deleteUser(req: Request, res: Response): void {
    let apiCall: Observable<AxiosResponse> = from(axios.delete(`${apiConfig.root}/users/${req.params.userId}`));
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

  private fillUserPosts(users: User[], posts: Post[]): User[] {
    return users.map(user => {
      return { ...user, posts: posts.filter(post => post.userId == user.id) };
    });
  }

}

export const usersController = new UsersController();

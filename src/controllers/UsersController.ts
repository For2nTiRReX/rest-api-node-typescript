import { Request, Response } from "express";
import axios, {AxiosResponse} from "axios";
import { Observable, from, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { config as apiConfig }  from "../config/api-config"
import { Post, User  } from '../models';

export class UsersController {
  public getUsers(req: Request, res: Response) {  
    let users: User[];
    let apiCall: Observable<AxiosResponse> = from(axios.get(`${apiConfig.root}/users`));
    apiCall
      .subscribe(response => {
        users = response.data;
        res.status(response.status).send({
          response: users
        });
      });
    return apiCall;
  }

  public getUser(req: Request, res: Response) {
    let post: User;
    let apiCall: Observable<AxiosResponse> = from(axios.get(`${apiConfig.root}/users/${req.params.postId}`));
    apiCall
      .subscribe(response => {
        post = response.data;
        res.status(response.status).send({
          response: post
        });
      });
    return apiCall;
  }

  public getUserPosts(req: Request, res: Response) {
    let userWithPosts: User;
    let apiCall: Observable<any>;
    let userPosts: Observable<Array<Post>> = from(axios.get(`${apiConfig.root}/posts`))
      .pipe( 
        map( apiResponse => apiResponse.data ),
        map( posts => posts.filter(post => post.userId == req.params.userId ))
      );

    let user: Observable<User> = from(axios.get(`${apiConfig.root}/users/${req.params.userId}`))
      .pipe(
        map( apiResponse => apiResponse.data )
      );
    
    apiCall = forkJoin([ user, userPosts ]);
    apiCall
      .subscribe( results => {
        userWithPosts = {
          ...results[0],
          posts: results[1]};
        res.status(200).send({
          response: userWithPosts
        });
      });
    return apiCall;
  }

  public addUser(req: Request, res: Response) {
    let createdUser: User;
    let postParams = {...req.body};
    let apiCall: Observable<AxiosResponse> = from(axios.post(`${apiConfig.root}/users`, postParams));
    apiCall
      .subscribe(response => {
        createdUser = {...response.data}
        res.status(response.status).send({
          response: createdUser
        });
      });
    return apiCall;
  }

  public editUser(req: Request, res: Response) {
    let updatedUser: User;
    let postParams: User = { ...req.body };
    let apiCall: Observable<AxiosResponse> = from(axios.put(`${apiConfig.root}/users/${req.params.postId}`, postParams));
    apiCall
      .subscribe(response => {
        updatedUser = response.data;
        res.status(response.status).send({
          response: updatedUser
        });
      });
    return apiCall;
  }
  
  public deleteUser(req: Request, res: Response) {
    let apiCall: Observable<AxiosResponse> = from(axios.delete(`${apiConfig.root}/users/${req.params.postId}`));
    apiCall
      .subscribe(response => {
        res.status(response.status).send({
          response: response.data
        });
      });
    return apiCall;
  }

}

export const usersController = new UsersController();

import { expect, assert } from 'chai';
import { createRequest, createResponse } from "node-mocks-http";
import { postsController } from '../../controllers/PostsController';
import { Observable } from 'rxjs';
import { AxiosResponse } from "axios";

describe('Post Route "/posts"', function() {
    describe('getPosts() function', function() {
        it('Should return type Observable<AxiosResponse>', function() {
            const mockRequest = createRequest({
                method: "GET",
                url: "/posts"
            });
            const mockResponse = createResponse();
            const actualResponseBody = postsController.getPosts(mockRequest, mockResponse);
            assert.typeOf(actualResponseBody, 'Object');
            console.log(213);
            //actualResponseBody.subscribe(res => console.log(res));
            console.log(413);
            // const expectedResponseBody = "hello world!";
            // assert(actualResponseBody, expectedResponseBody);
        });
    })
});
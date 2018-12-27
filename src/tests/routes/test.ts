import { expect, assert } from 'chai';
import { createRequest, createResponse } from "node-mocks-http";
import { postsController } from '../../controllers/PostsController';
import { Observable } from 'rxjs';
import { AxiosResponse } from "axios";

const mockResponse = createResponse();
describe('Post Route "/posts"', function() {
    describe('getPosts() function', function() {
        const mockRequest = createRequest({
            method: "GET",
            url: "/posts"
        });
        const actualResponseBody = postsController.getPosts(mockRequest, mockResponse);
        it('Should return 200 "api available"', function() {
            actualResponseBody.subscribe(res => {
                assert.equal(res.status, 200);
            });
        });
        it('Is posts exist?', function() {
            actualResponseBody.subscribe(res => {
                expect(res.data).to.have.length.above(1)
            });
        });
    })
});
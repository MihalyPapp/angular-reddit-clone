import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentPayload } from './comment.payload';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  postComment(commentPayload: CommentPayload): Observable<any> {
    return this.http.post<any>('http://localhost:8844/api/comment', commentPayload)
  }

  getAllCommentsForPost(postId: number): Observable<Array<CommentPayload>> {
    return this.http.get<Array<CommentPayload>>('http://localhost:8844/api/comment/by-post/' + postId)
  }

  getAllCommentsByUser(name: string): Observable<Array<CommentPayload>>{
    return this.http.get<Array<CommentPayload>>('http://localhost:8844/api/comment/by-user/' + name)
  }
}

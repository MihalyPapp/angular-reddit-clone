import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { CommentService } from 'src/app/comment/comment.service';
import { PostModel } from 'src/app/shared/post-model';
import { PostService } from 'src/app/shared/post.service';
import { CommentPayload } from '../../comment/comment.payload';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {

  postId!: number
  post!: PostModel
  commentForm!: FormGroup
  commentPayload: CommentPayload
  comments!: Array<CommentPayload>

  constructor(private activatedRoute: ActivatedRoute, private postService: PostService, private commentService: CommentService) {
    this.postId = this.activatedRoute.snapshot.params.id
    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required)
    })
    this.commentPayload = {
      text: '',
      postId: this.postId
    }
  }

  ngOnInit(): void {
    this.getPostById()
    this.getCommentsForPost()
  }

  getCommentsForPost() {
    this.commentService.getAllCommentsForPost(this.postId).subscribe(data => {
      this.comments = data
    })
  }

  getPostById() {
    this.postService.getPost(this.postId).subscribe(data => {
      this.post = data
    }, error => {
      throwError(error)
    })
  }

  postComment() {
    this.commentPayload.text = this.commentForm.get('text')?.value
    this.commentService.postComment(this.commentPayload).subscribe(() => {
      this.commentForm.get('text')?.setValue('')
      this.getCommentsForPost()
    }, error => {
      throwError(error)
    })
  }

}

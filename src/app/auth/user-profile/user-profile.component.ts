import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentPayload } from 'src/app/comment/comment.payload';
import { CommentService } from 'src/app/comment/comment.service';
import { PostModel } from 'src/app/shared/post-model';
import { PostService } from 'src/app/shared/post.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  name: string;
  posts!: Array<PostModel>
  comments!: Array<CommentPayload>
  postLength!: number
  commentsLength!: number

  constructor(private activatedRoute: ActivatedRoute, private postService: PostService, private commentService: CommentService) {
    this.name = this.activatedRoute.snapshot.params.name
    console.log(this.name)
    this.postService.getAllPostsByUser(this.name).subscribe(posts => {
      this.posts = posts
      this.postLength = posts.length
    })
    this.commentService.getAllCommentsByUser(this.name).subscribe(comments => {
      this.comments = comments
      this.commentsLength = comments.length
    })
  }

  ngOnInit(): void {
  }

}

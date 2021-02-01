import { Component, Input, OnInit } from '@angular/core';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { PostModel } from '../post-model';

@Component({
  selector: 'app-vote-button',
  templateUrl: './vote-button.component.html',
  styleUrls: ['./vote-button.component.css']
})
export class VoteButtonComponent implements OnInit {

  faArrowUp = faArrowUp
  faArrowDown = faArrowDown
  upvoteColor = 'black'
  downvoteColor = 'black'

  @Input() post!: PostModel

  constructor() { }

  ngOnInit(): void {
  }

  upvotePost() {

  }

  downvotePost() {

  }

}

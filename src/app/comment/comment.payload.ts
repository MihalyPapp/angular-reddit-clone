import { NumberValueAccessor } from "@angular/forms"

export class CommentPayload {
    text!: string
    postId!: number
    userName?: string
    createdDate?: string
}
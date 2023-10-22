import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface CommentDoc extends BaseDoc {
  author: ObjectId;
  post: ObjectId;
  date: Date;
  image: string;
  text: string;
}

export default class CommentConcept {
  public readonly comments = new DocCollection<CommentDoc>("comments");

  async create(author: ObjectId, post: ObjectId, image: string, text: string) {
    this.canCreate(image, text);
    const date = new Date();
    const _id = await this.comments.createOne({ author, post, date, image, text });
    return { msg: "Comment successfully created!", comment: await this.comments.readOne({ _id }) };
  }

  async getComments(query: Filter<CommentDoc>) {
    const comments = await this.comments.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return comments;
  }

  async getByAuthor(author: ObjectId) {
    return await this.getComments({ author });
  }

  async update(_id: ObjectId, update: Partial<CommentDoc>) {
    this.sanitizeUpdate(update);
    if (update.image !== undefined || update.text !== undefined) {
      this.canCreate(update.image, update.text);
    }
    await this.comments.updateOne({ _id }, update);
    return { msg: "Comment successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.comments.deleteOne({ _id });
    return { msg: "Comment deleted successfully!" };
  }

  async isAuthor(user: ObjectId, _id: ObjectId) {
    const comment = await this.comments.readOne({ _id });
    if (!comment) {
      throw new NotFoundError(`Comment ${_id} does not exist!`);
    }
    if (comment.author.toString() !== user.toString()) {
      throw new CommentAuthorNotMatchError(user, _id);
    }
  }

  private canCreate(image: string | undefined, text: string | undefined) {
    if (!image && !text) {
      throw new BadValuesError("Comment must have some form of content.");
    }
  }

  private sanitizeUpdate(update: Partial<CommentDoc>) {
    const allowedUpdates = ["image", "text"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }
}

export class CommentAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of comment {1}!", author, _id);
  }
}

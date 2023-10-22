import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface PostDoc extends BaseDoc {
  author: ObjectId;
  images: string;
  text: string;
}

export default class PostConcept {
  public readonly posts = new DocCollection<PostDoc>("posts");

  async create(author: ObjectId, images: string, text: string) {
    this.canCreate(images, text);
    const _id = await this.posts.createOne({ author, images, text });
    return { msg: "Post successfully created!", post: await this.posts.readOne({ _id }) };
  }

  async getPosts(query: Filter<PostDoc>) {
    const posts = await this.posts.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return posts;
  }

  async getByAuthor(author: ObjectId) {
    return await this.getPosts({ author });
  }

  async update(_id: ObjectId, update: Partial<PostDoc>) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    this.sanitizeUpdate(update);
    if (update.images !== undefined || update.text !== undefined) {
      this.canCreate(update.images, update.text);
    }
    await this.posts.updateOne({ _id }, update);
    return { msg: "Post successfully updated!" };
  }

  async delete(_id: ObjectId) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    await this.posts.deleteOne({ _id });
    return { msg: "Post deleted successfully!" };
  }

  async isAuthor(user: ObjectId, _id: ObjectId) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    if (post.author.toString() !== user.toString()) {
      throw new PostAuthorNotMatchError(user, _id);
    }
  }

  private canCreate(images: string | undefined, text: string | undefined) {
    if (!images && !text) {
      throw new BadValuesError("Post must have some form of content.");
    }
  }

  private sanitizeUpdate(update: Partial<PostDoc>) {
    const allowedUpdates = ["images", "text"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }
}

export class PostAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of post {1}!", author, _id);
  }
}

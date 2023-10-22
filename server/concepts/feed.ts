import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface FeedDoc extends BaseDoc {
  user: ObjectId;
  displayFrom: Date;
  content: ObjectId[];
}

export default class FeedConcept {
  public readonly feeds = new DocCollection<FeedDoc>("feeds");

  async create(user: ObjectId, displayFrom: Date, content: ObjectId[]) {
    const _id = await this.feeds.createOne({ user, displayFrom, content });
    return { msg: "Feed successfully created!", feed: await this.feeds.readOne({ _id }) };
  }

  async getFeeds(query: Filter<FeedDoc>) {
    const feeds = await this.feeds.readMany(query, {
      sort: { displayFrom: -1 },
    });
    return feeds;
  }

  async getByUser(user: ObjectId) {
    return await this.getFeeds({ user });
  }
}

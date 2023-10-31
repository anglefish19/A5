import { ObjectId } from "mongodb";

import { BadValuesError } from "./concepts/errors";
import { Router, getExpressRouter } from "./framework/router";

import { Comment, Feed, Friend, Post, Tier, User, WebSession } from "./app";
import { CommentDoc } from "./concepts/comment";
import { PostDoc } from "./concepts/post";
import { TierDoc } from "./concepts/tier";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  // SESSION
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  // USER
  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.get("/users/:userID")
  async getUsername(userID: ObjectId) {
    return await User.getUserById(userID);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const posts = await Post.getByAuthor(user);
    for (const post of posts) {
      await Post.delete(post._id);
    }
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  // POST
  @Router.get("/posts")
  async getPosts(author?: string, _id?: ObjectId) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else if (_id) {
      posts = await Post.getPosts({ _id: _id });
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, images: string, text: string) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, images, text);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  // COMMENT
  @Router.get("/posts/:postId/comments")
  async getComments(postId?: ObjectId) {
    let comments;
    if (postId) {
      comments = await Comment.getComments({ post: postId });
    } else {
      throw new BadValuesError("No postId given.");
    }
    return Responses.comments(comments);
  }

  @Router.post("/posts/:post/comments")
  async createComment(session: WebSessionDoc, post: ObjectId, image: string, text: string) {
    if (!post) {
      throw new BadValuesError("No post given.");
    }
    const user = WebSession.getUser(session);
    const created = await Comment.create(user, post, image, text);
    return { msg: created.msg, comment: await Responses.comment(created.comment) };
  }

  @Router.patch("/posts/:post/comments/:_id")
  async updateComment(session: WebSessionDoc, post: ObjectId, _id: ObjectId, update: Partial<CommentDoc>) {
    const user = WebSession.getUser(session);
    await Comment.isAuthor(user, _id);
    return await Comment.update(_id, update);
  }

  @Router.delete("/posts/:post/comments/:_id")
  async deleteComment(session: WebSessionDoc, post: ObjectId, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Comment.isAuthor(user, _id);
    return Comment.delete(_id);
  }

  // TIER
  @Router.get("/tiers")
  async getTiers(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Tier.getByOwner(user);
  }

  @Router.post("/tiers")
  async createTier(session: WebSessionDoc, name: string, priority: number) {
    const user = WebSession.getUser(session);
    const created = await Tier.create(user, name, priority);
    return { msg: created.msg, tier: await Responses.tier(created.tier) };
  }

  @Router.patch("/tiers/:_id")
  async updateTier(session: WebSessionDoc, _id: ObjectId, update: Partial<TierDoc>) {
    const user = WebSession.getUser(session);
    await Tier.isOwner(user, _id);
    return await Tier.update(_id, update);
  }

  @Router.delete("/tiers/:_id")
  async deleteTier(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Tier.isOwner(user, _id);
    return Tier.delete(_id);
  }

  @Router.patch("/tiers/:_id/:item")
  async updateItem(session: WebSessionDoc, _id: ObjectId, item: string, fxn: string) {
    if (_id === undefined || item === undefined || fxn === undefined) {
      throw new BadValuesError("Please fill out all fields.");
    }
    const user = WebSession.getUser(session);
    await Tier.isOwner(user, _id);
    return Tier.updateItem(_id, item, fxn);
  }

  // FEED
  @Router.get("/feed")
  async getFeed(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Feed.getByUser(user);
  }

  @Router.post("/feed")
  async createFeed(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const lastAuth = await User.getLastAuth(user);
    const feeds = await Feed.getByUser(user);

    let time = new Date();

    if (feeds.length === 0 || feeds[0].displayFrom.getTime() < lastAuth.getTime()) {
      if (feeds.length === 0) {
        time.setTime(time.getDate() - 3);
      } else {
        time = feeds[0].displayFrom;
        // const created = await Feed.create(null, new Date(), []);
        // return { msg: time, feed: created.feed };
      }
    }

    const tiers = await Tier.getByOwner(user);
    const posts = [];
    const friends: string[] = [];

    for (const tier of tiers) {
      for (const friend of tier.items) {
        if (!friends.includes(friend)) {
          const friendID = (await User.getUserByUsername(friend))._id;
          const friendPosts = await Post.getPosts({ author: friendID, dateCreated: { $gt: time } });
          for (const post of friendPosts) {
            posts.push(post);
          }
          friends.push(friend);
        }
      }
    }
    if (posts.length === 0) {
      const created = await Feed.create(null, new Date(), posts);
      // return { msg: "Feed: " + feeds[0].displayFrom.getTime() + "\n Auth: " + lastAuth.getTime(), feed: created.feed };
      return { msg: "No new posts in feed.", feed: created.feed };
    }
    const postsWithUsernames = await Responses.posts(posts);
    return await Feed.create(user, new Date(), postsWithUsernames);
  }

  // FOLLOW
  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }
}

export default getExpressRouter(new Routes());

import CommentConcept from "./concepts/comment";
import FeedConcept from "./concepts/feed";
import FriendConcept from "./concepts/friend";
import PostConcept from "./concepts/post";
import TierConcept from "./concepts/tier";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const Friend = new FriendConcept();
export const Comment = new CommentConcept();
export const Feed = new FeedConcept();
export const Tier = new TierConcept();

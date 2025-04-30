import { Media } from "../post/Post";
import { UserEssentials } from "../user/UserEssentials";

export interface Comment {
  id: string;
  content: string;
  parent: string;
  createdBy: UserEssentials;
  agreeCount: number;
  media: Media[];
  isAgreed: boolean;
  isDisagreed: boolean;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Comment } from "@/types/responses/data/comment/Comment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formDataFrom(data: any) {
  const formData = new FormData();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      data[key].forEach((item: any) => {
        formData.append(key, item);
      });
    } else {
      formData.append(key, data[key]);
    }
  }
  return formData;
}

export function getCustomAvatar(firstName: string, lastName: string) {
  return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`;
}

export const findCommentAndPerformAction = (
  comments: Comment[],
  parentId: string,
  data: Comment[],
  action: 'add' | 'replace' = "replace"
): Comment[] | null => {

  let updatedTree: Comment[] | null = null;

  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    if (comment.id === parentId) {
      let newRepliesArray: Comment[];
      if (action === 'replace') {
        newRepliesArray = data;
      } else {
        const newReply = data[0];
        const existingReplies = comment.replies || [];
        if (existingReplies.some(reply => reply.id === newReply.id)) {
          console.warn(`Reply with ID ${newReply.id} already exists for parent ${parentId}. Skipping add.`);
          return null;
        }
        newRepliesArray = [...existingReplies, newReply];
      }
      if (updatedTree === null) {
        updatedTree = [...comments];
      }
      updatedTree[i] = {
        ...comment,
        replies: newRepliesArray,
      };
      return updatedTree;
    }

    if (comment.replies && comment.replies.length > 0) {
      const updatedReplies = findCommentAndPerformAction(
        comment.replies,
        parentId,
        data,
        action
      );

      if (updatedReplies !== null) {
        if (updatedTree === null) {
          updatedTree = [...comments];
        }
        updatedTree[i] = {
          ...comment,
          replies: updatedReplies,
        };
        return updatedTree;
      }
    }
  }
  return null;
};
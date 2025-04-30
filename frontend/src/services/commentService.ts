import httpClient from "@/httpClient/axios";
import { formDataFrom } from "@/lib/utils";
import { CommentCreate } from "@/types/requests/comment/CommentCreate";
import { Comment } from "@/types/responses/data/comment/Comment";
import { Page } from "@/types/responses/system/Page";
import { Result } from "@/types/responses/system/Result";

export class CommentService {
  static async create(postId: string, item: CommentCreate) {
    const response = await httpClient.post<Result<Comment>>(`/posts/${postId}/comments`, formDataFrom(item));
    return response.data;
  }

  static async createReply(postId: string, commentId: string, item: CommentCreate) {
    const response = await httpClient.post<Result<Comment>>(`/posts/${postId}/comments/${commentId}/replies`, formDataFrom(item));
    return response.data;
  }

  static async agree(postId: string, commentId: string) {
    const response = await httpClient.post<Result<null>>(`/posts/${postId}/comments/${commentId}/agree`);
    return response.data;
  }

  static async cancelAgree(postId: string, commentId: string) {
    const response = await httpClient.delete<Result<null>>(`/posts/${postId}/comments/${commentId}/agree`);
    return response.data;
  }

  static async disagree(postId: string, commentId: string) {
    const response = await httpClient.post<Result<null>>(`/posts/${postId}/comments/${commentId}/disagree`);
    return response.data;
  }

  static async cancelDisagree(postId: string, commentId: string) {
    const response = await httpClient.delete<Result<null>>(`/posts/${postId}/comments/${commentId}/disagree`);
    return response.data;
  }

  static async findByPostId(postId: string, params = { page: 0, size: 5, sort: "createdAt,desc" }) {
    const response = await httpClient.get<Result<Page<Comment>>>(`/posts/${postId}/comments`, { params });
    return response.data;
  }

  static async findCommentReplies(postId: string, commentId: string, params = { page: 0, size: 20, sort: "createdAt,desc" }) {
    const response = await httpClient.get<Result<Page<Comment>>>(`/posts/${postId}/comments/${commentId}/replies`, { params });
    return response.data;
  }
}
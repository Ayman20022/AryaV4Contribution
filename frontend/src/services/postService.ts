import httpClient from "@/httpClient/axios";
import { formDataFrom } from "@/lib/utils";
import { PostCreate } from "@/types/requests/post/PostCreate";
import { PostUpdate } from "@/types/requests/post/PostUpdate";
import { Post } from "@/types/responses/data/post/Post";
import { Page } from "@/types/responses/system/Page";
import { Result } from "@/types/responses/system/Result";

export class PostService {

    static async findAll(params = { page: 0, size: 20, sort: "createdAt,desc" }) {
        const response = await httpClient.get<Result<Page<Post>>>("/posts", { params });
        return response.data;
    }

    static async create(item: PostCreate) {
        const response = await httpClient.post<Result<Post>>("/posts", formDataFrom(item));
        return response.data;
    }

    static async update(id: string, item: PostUpdate) {
        const response = await httpClient.post<Result<Post>>(`/posts/${id}`, formDataFrom(item));
        return response.data;
    }

    static async delete(id: string, item: PostUpdate) {
        const response = await httpClient.delete<Result<null>>(`/posts/${id}`);
        return response.data;
    }

    static async findByUserId(userId: string, params = { page: 0, size: 20, sort: "createdAt,desc" }) {
        const response = await httpClient.get<Result<Page<Post>>>(`/posts/user/${userId}`, { params });
        return response.data;
    }

    static async agree(postId: string) {
        const response = await httpClient.post<Result<null>>(`/posts/${postId}/agree`);
        return response.data;
    }

    static async cancelAgree(postId: string) {
        const response = await httpClient.delete<Result<null>>(`/posts/${postId}/agree`);
        return response.data;
    }

    static async disagree(postId: string) {
        const response = await httpClient.post<Result<null>>(`/posts/${postId}/disagree`);
        return response.data;
    }

    static async cancelDisagree(postId: string) {
        const response = await httpClient.delete<Result<null>>(`/posts/${postId}/disagree`);
        return response.data;
    }
}
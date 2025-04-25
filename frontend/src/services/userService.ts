import httpClient from "@/httpClient/axios";
import { User } from "@/types/responses/data/user/User";
import { UserEssentials } from "@/types/responses/data/user/UserEssentials";
import { UserProfile } from "@/types/responses/data/user/UserProfile";
import { Page } from "@/types/responses/system/Page";
import { Result } from "@/types/responses/system/Result";

export interface UserSearchCriteria {
  username?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

export class UserService {
  static async getMe() {
    const response = await httpClient.get<Result<User>>('/users/me');
    return response.data;
  }

  static async getProfile(username: string) {
    const response = await httpClient.get<Result<UserProfile>>(`/users/profile/${username}`);
    return response.data;
  }

  static async update(body) {
    const response = await httpClient.patch<Result<UserProfile>>(`/users/update`, body);
    return response.data;
  }

  static async updateAvatar(body: FormData) {
    const response = await httpClient.put<Result<{ avatarUrl: string }>>(`/users/update/avatar`, body);
    return response.data;
  }

  static async connect(userId: string) {
    const response = await httpClient.post<Result<User>>(`/users/networks/${userId}`);
    return response.data;
  }

  static async disconnect(userId: string) {
    const response = await httpClient.delete<Result<User>>(`/users/networks/${userId}`);
    return response.data;
  }

  static async getNetworked(userId: string) {
    const response = await httpClient.get<Result<Page<UserEssentials>>>(`/users/${userId}/networked`);
    return response.data;
  }

  static async getNetworking(userId: string) {
    const response = await httpClient.get<Result<Page<UserEssentials>>>(`/users/${userId}/networking`);
    return response.data;
  }

  static async search(body: UserSearchCriteria) {
    const response = await httpClient.post<Result<Page<UserProfile>>>('/users/search', body);
    return response.data;
  }
}
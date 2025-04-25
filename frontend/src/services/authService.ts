import httpClient from "@/httpClient/axios";
import { AuthResponse } from "@/types/responses/data/auth/AuthResponse";
import { Result } from "@/types/responses/system/Result";

export class AuthService {
  static async login(email: string, password: string) {
    const response = await httpClient.post<Result<AuthResponse>>('/users/auth/login', { email, password });
    return response.data;
  }
}
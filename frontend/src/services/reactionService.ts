import httpClient from "@/httpClient/axios";
import { Result } from "@/types/responses/system/Result";

type ItemType = "post" | "comment";

export class ReactionService {
  static async createAgree(itemId: string, type: ItemType) {
    const response = await httpClient.post<Result<null>>("/agrees", null, {
      params: {
        itemId,
        type
      }
    });
    return response.data;
  }

  static async cancelAgree(itemId: string) {
    const response = await httpClient.delete<Result<null>>(`/agrees/${itemId}`);
    return response.data;
  }

  static async createDisagree(itemId: string, type: ItemType) {
    const response = await httpClient.post<Result<null>>("/disagres", null, {
      params: {
        itemId,
        type
      }
    });
    return response.data;
  }

  static async cancelDisagree(itemId: string) {
    const response = await httpClient.delete<Result<null>>(`/disagres/${itemId}`);
    return response.data;
  }
}
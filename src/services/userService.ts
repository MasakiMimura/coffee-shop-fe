import { apiClient } from './api';
import type { Member } from '../types';

export interface UserResponse {
  user: {
    userId: number;
    lastName: string;
    firstName: string;
    cardNo: string;
    email: string;
    pointBalance: number;
    isDeleted: boolean;
  };
}

export class UserService {
  /**
   * 会員カード番号で会員を検索
   * モック: '/mock/users/{cardNo}'
   * 実API: '/api/v1/users/{cardNo}'
   */
  async getUserByCardNo(cardNo: string): Promise<Member> {
    return await apiClient.get<Member>(`/mock/users/${cardNo}`);
  }
}

export const userService = new UserService();

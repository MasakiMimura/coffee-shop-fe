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
   */
  async getUserByCardNo(cardNo: string): Promise<Member> {
    const response = await apiClient.get<UserResponse>(`/api/v1/users/${cardNo}`);
    return {
      memberId: response.user.cardNo,
      memberCardNo: response.user.cardNo,
      firstName: response.user.firstName,
      lastName: response.user.lastName,
      pointBalance: response.user.pointBalance,
    };
  }
}

export const userService = new UserService();

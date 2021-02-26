import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async serviceValidation(
    accessToken: string,
  ): Promise<ChulaSSOSuccessResponse> {
    return new Promise((resolve, _) => {
      setTimeout(() => {
        resolve({
          uid: '0001',
          username: 'test',
          gecos: 'Test Account',
          email: 'test@onepass.app',
          roles: ['faculty', 'student'],
          ouid: '1234567890',
        });
      }, 400);
    });
  }
}

interface ChulaSSOSuccessResponse {
  uid: string;
  username: string;
  gecos: string;
  email: string;
  roles: string[];
  ouid: string;
}

interface ChulaSSOFailureResponse {
  type: string;
  content: string;
}

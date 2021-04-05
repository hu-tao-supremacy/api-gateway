import { User } from '@entities/user.entity';
import { ProxyAccountService } from '@hu-tao-supremacy:account/proxy-account.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express'
import { decode } from 'js-base64'
import { AccessTokenPayload } from '@gql/account/service';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService, private readonly proxyAccountService: ProxyAccountService) { }

  async use(req: Request, res: any, next: () => void) {
    try {
      const accessToken = req.headers.authorization?.split('Bearer ')[1];
      if (accessToken) {
        const isAuthenticated = await this.authService.isAuthenticated(accessToken).toPromise();
        if (isAuthenticated) {
          const encodedPayload = accessToken.split('.')[1]
          const decodedPayload = decode(encodedPayload)
          const payload = JSON.parse(decodedPayload) as AccessTokenPayload
          const user = await this.proxyAccountService.getUserById(payload.userId).toPromise();
          req.user = user
        }
      }
    } catch (_) { }
    next();
  }
}

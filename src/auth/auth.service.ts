import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ProxyAccountService } from 'src/proxy-account/proxy-account.service';
import { AuthenticateOutput } from './auth.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly proxyAccountService: ProxyAccountService,
  ) {}

  serviceValidation(ticket: string): Observable<ChulaSSOSuccessResponse> {
    return this.httpService
      .post<ChulaSSOSuccessResponse>(
        'https://account.it.chula.ac.th/serviceValidation',
        null,
        {
          headers: {
            DeeAppId: process.env.CHULA_SSO_APP_ID,
            DeeAppSecret: process.env.CHULA_SSO_APP_SECRET,
            DeeTicket: ticket,
          },
        },
      )
      .pipe(map((project) => project.data));
  }

  authenticate(ticket: string): Observable<AuthenticateOutput> {
    return this.serviceValidation(ticket).pipe(
      switchMap((project) =>
        this.proxyAccountService.getUserByChulaId(Number(project.ouid)),
      ),
      switchMap((account) =>
        this.proxyAccountService.generateAccessToken(account.id),
      ),
      map((accessToken) => ({ accessToken })),
    );
  }

  isAuthenticated(accessToken: string): Observable<boolean> {
    return this.proxyAccountService.isAuthenticated(accessToken);
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

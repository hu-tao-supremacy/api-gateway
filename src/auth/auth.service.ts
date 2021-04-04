import { HttpService, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ProxyAccountService } from 'src/proxy-account/proxy-account.service';
import { AuthenticateOutput } from './auth.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly proxyAccountService: ProxyAccountService,
  ) { }

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

  async authenticate(ticket: string): Promise<AuthenticateOutput> {
    const serviceAccount = await this.serviceValidation(ticket).toPromise();
    console.log(serviceAccount)

    if (serviceAccount) {
      try {
        const user = await this.proxyAccountService.getUserByChulaId(Number(serviceAccount.ouid)).pipe(catchError(error => {
          console.log(error)
          const firstName = serviceAccount.gecos.split(' ')[0]
          const lastName = serviceAccount.gecos.split(' ')[1]
          return this.proxyAccountService.createUser(firstName, lastName, serviceAccount.ouid)
        })).toPromise()
        const accessToken = await this.proxyAccountService.generateAccessToken(user.id).toPromise();
        return { accessToken }
      } catch (e) {
        console.log(e)
        throw new InternalServerErrorException();
      }
    }

    throw new UnauthorizedException()
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

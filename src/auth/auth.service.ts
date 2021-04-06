import { HttpService, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AccountService } from '@onepass/account'
import { AuthenticateOutput } from './auth.model';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService, private readonly accountService: AccountService) { }

  serviceValidation(ticket: string): Observable<ChulaSSOServiceAccount> {
    return this.httpService
      .post<ChulaSSOServiceAccount>('https://account.it.chula.ac.th/serviceValidation', null, {
        headers: {
          DeeAppId: process.env.CHULA_SSO_APP_ID,
          DeeAppSecret: process.env.CHULA_SSO_APP_SECRET,
          DeeTicket: ticket,
        },
      })
      .pipe(map((project) => project.data));
  }

  authenticate(ticket: string): Observable<AuthenticateOutput> {
    return this.serviceValidation(ticket).pipe(
      catchError((_) => {
        throw new UnauthorizedException();
      }),
      switchMap((serviceAccount) => this.signInWithServiceAccount(serviceAccount)),
    );
  }

  signInWithServiceAccount(serviceAccount: ChulaSSOServiceAccount): Observable<AuthenticateOutput> {
    return this.accountService.getUserByChulaId(serviceAccount.ouid).pipe(
      catchError((error) => {
        console.log(error)
        const firstName = serviceAccount.firstname;
        const lastName = serviceAccount.lastname;
        const email = serviceAccount.email;
        const isChulaStudent = serviceAccount.roles.includes('student');
        return this.accountService.createUser(firstName, lastName, serviceAccount.ouid, email, isChulaStudent)
      }),
      switchMap(user => this.accountService.generateAccessToken(user.id)),
      catchError(_ => {
        throw new InternalServerErrorException()
      }),
      map(accessToken => ({ accessToken }))
    )
  }

  // async authenticate(ticket: string): Promise<AuthenticateOutput> {
  //   const serviceAccount = await this.serviceValidation(ticket).toPromise();
  //   console.log(serviceAccount);

  //   if (serviceAccount.uid !== '') {
  //     return this.signInWithServiceAccount(serviceAccount);
  //   }

  //   throw new UnauthorizedException();
  // }

  // async signInWithServiceAccount(serviceAccount: ChulaSSOServiceAccount): Promise<AuthenticateOutput> {
  //   try {
  //     const user = await this.accountService
  //       .getUserByChulaId(serviceAccount.ouid)
  //       .pipe(
  //         catchError((error) => {
  //           console.log(error);
  //           const firstName = serviceAccount.firstname;
  //           const lastName = serviceAccount.lastname;
  //           const email = serviceAccount.email;
  //           const isChulaStudent = serviceAccount.roles.includes('student');
  //           return this.accountService.createUser(firstName, lastName, serviceAccount.ouid, email, isChulaStudent);
  //         }),
  //       )
  //       .toPromise();
  //     const accessToken = await this.accountService.generateAccessToken(user.id).toPromise();
  //     return { accessToken };
  //   } catch (e) {
  //     console.log(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  isAuthenticated(accessToken: string): Observable<boolean> {
    return this.accountService.isAuthenticated(accessToken);
  }
}

interface ChulaSSOServiceAccount {
  uid: string;
  username: string;
  gecos: string;
  email: string;
  roles: string[];
  ouid: string;
  firstname: string;
  lastname: string;
}

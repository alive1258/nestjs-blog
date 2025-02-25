import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/user.service';
import { SignInDto } from '../dtos/signin.dtos';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dtos';
import { RefreshTokensProvider } from './refresh-tokens.provider';

@Injectable()
export class AuthService {
  constructor(
    // ??inject userServcie
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    //inject signinprovider
    // @Inject(forwardRef(() => SignInProvider))
    private readonly signInProvider: SignInProvider,

    //inject refreshTokensProvider
    // @Inject(forwardRef(() => RefreshTokensProvider))
    private readonly refreshTokensProvider: RefreshTokensProvider,
  ) {}
  public login(email: string, password: string, id: string) {
    //Check user exists database
    const user = this.usersService.findOneById(1234);
    // login
    //token
    return 'SIMPLE_TOKEN';
  }

  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }
}

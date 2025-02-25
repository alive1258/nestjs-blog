import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dtos';
import { UsersService } from 'src/users/providers/user.service';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';

import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    // inject userService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    // inject hashingProvider
    private readonly hashingProvider: HashingProvider,

    // inject generateTokenProvider
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    //throw an exception user not found
    let user = await this.usersService.findOneByEmail(signInDto.email);

    //compare password to the hash
    let isEqual: boolean = false;
    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not comparing passwords',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect password');
    }

    return await this.generateTokensProvider.generateTokens(user);
  }
}

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import jwtConfig from 'src/auth/config/jwt.config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    // inject jwtService'
    private readonly jwtService: JwtService,

    //inject jwtConfigurations
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //extract the request from execution context
    const request = context.switchToHttp().getRequest();
    if (request.path === '/auth/sign-in') {
      return true;
    }
    //extract the authorization header from the request
    const token = this.extractRequestTokenFromHeader(request);
    //  validate the token
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      // verify the token
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
  private extractRequestTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}

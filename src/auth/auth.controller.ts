import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signin.dtos';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dtos/refresh-token.dtos';

@Controller('auth')
export class AuthController {
  // Implement authentication logic here
  constructor(
    //inject auth service
    private readonly authService: AuthService,
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public async SignIn(@Body() signInDto: SignInDto) {
    //sign in
    return await this.authService.signIn(signInDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    //sign in
    return await this.authService.refreshTokens(refreshTokenDto);
  }
}

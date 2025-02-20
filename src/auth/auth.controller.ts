import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signin.dtos';

@Controller('auth')
export class AuthController {
  // Implement authentication logic here
  constructor(
    //inject auth service
    private readonly authService: AuthService,
  ) {}

  @Post('sign-in')
  public async SignIn(@Body() signIn: SignInDto) {}
}

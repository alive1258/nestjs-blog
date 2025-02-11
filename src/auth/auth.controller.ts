import { Controller } from '@nestjs/common';
import { AuthService } from './providers/auth.service';

@Controller('auth')
export class AuthController {
  // Implement authentication logic here
  constructor(private readonly authService: AuthService) {}
}

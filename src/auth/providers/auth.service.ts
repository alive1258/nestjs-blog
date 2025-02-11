import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/user.service';

@Injectable()
export class AuthService {
  constructor(
    // ??inject userServcie
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  public login(email: string, password: string, id: string) {
    //Check user exists database
    const user = this.usersService.findOneById('1234');
    // login
    //token
    return 'SIMPLE_TOKEN'; // For simplicity, let's return a string token here. In a real-world application, you would typically use a JWT (JSON Web Tokens) library to generate and validate tokens.
  }

  public isAuth() {
    return true;
  }
}

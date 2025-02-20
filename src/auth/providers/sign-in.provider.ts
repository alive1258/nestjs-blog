import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dtos';
import { UsersService } from 'src/users/providers/user.service';

@Injectable()
export class SignInProvider {
  constructor(
    // inject userService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  public async signIn(signInDto: SignInDto) {
    //throw an exception user not found
    let user = await this.usersService.findOneByEmail(signInDto.email);
  }
}

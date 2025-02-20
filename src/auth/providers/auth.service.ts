import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/user.service';
import { SignInDto } from '../dtos/signin.dtos';

@Injectable()
export class AuthService {
  constructor(
    // ??inject userServcie
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  public login(email: string, password: string, id: string) {
    //Check user exists database
    const user = this.usersService.findOneById(1234);
    // login
    //token
    return 'SIMPLE_TOKEN'; // For simplicity, let's return a string token here. In a real-world application, you would typically use a JWT (JSON Web Tokens) library to generate and validate tokens.
  }

  public signIn(signIn: SignInDto) {
    // find the user using the email ID
    // const user = this.usersService.findOneByEmail(signIn.email);
    // // throw an exception user not found
    // if(!user){
    //   throw new Error('User not found');
    // }
    // // check password
    // if(user.password!== signIn.password){
    //   throw new Error('Incorrect password');
    // }
    // // login
    // //token
    // return 'SIMPLE_TOKEN';
  }
  public isAuth() {
    return true;
  }
}

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/providers/auth.service';
import { GetUsersParamsDto } from '../dtos/get-users-params.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public findAll(
    getUsersParamsDto: GetUsersParamsDto,
    limit: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);
    return [
      {
        firstName: 'John Doe',
        email: 'john.doe@example.com',
      },
      {
        firstName: 'Jane Smith',
        email: 'jane.smith@example.com',
      },
    ];
  }
  //   Post Module
  // Create a user
  //   Find a user by Id
  public findOneById(id: string) {
    return {
      id: 1234,
      firstName: 'John Doe',
      email: 'john.doe@example.com',
    };
  }

  // Update a user
}

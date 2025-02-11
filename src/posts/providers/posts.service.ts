import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/user.service';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}
  public finAll(userId: string) {
    // logic to fetch posts for a given user

    const user = this.usersService.findOneById(userId);
    return [
      { user: user, title: 'Post 1', content: 'This is the content of post 1' },
      { user: user, title: 'Post 2', content: 'This is the content of post 2' },
    ];
  }
}

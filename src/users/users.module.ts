import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@nestjs/config';
import profileConfig from './config/profile.config';
import { User } from './user.entity';
import { UsersCreateManyProvider } from './providers/users-create-many.provider';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersCreateManyProvider],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    // ConfigModule.forFeature(profileConfig),
  ],
})
export class UsersModule {}

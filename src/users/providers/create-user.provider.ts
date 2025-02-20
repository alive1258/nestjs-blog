import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';

import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateUserProvider {
  constructor(
    // inject user repository
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    //inject hashingProvider
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}
  public async createUser(createUserDto: CreateUserDto) {
    let existingUser = undefined as User | null | undefined;

    // check if user already exists
    try {
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        `We are currently experiencing a temporary issue processing your request. Please try again later.`,
        {
          description: `Request timed out while verifying the existence of a user with email ${createUserDto.email}. This may be due to a network issue or server delay.`,
        },
      );
    }

    // Handle exception if user already exists
    if (existingUser) {
      throw new BadRequestException(
        `A user with the email ${createUserDto.email} already exists. Please use a different email or log in.`,
      );
    }

    // create user
    let newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });
    try {
      newUser = await this.userRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        `We are currently experiencing a temporary issue processing your request. Please try again later.`,
        {
          description:
            'Error connecting to the Database. Please try again later',
        },
      );
    }

    return newUser;
  }
}

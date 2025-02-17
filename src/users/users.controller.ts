import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  Post,
  Body,
  Header,
  Headers,
  Ip,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamsDto } from './dtos/get-users-params.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/user.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    //inject Users Service
    private readonly usersService: UsersService,
  ) {}

  @Get('/:id')
  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully based on the query',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    description: 'The  number of entries returned per query',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    description:
      'The  position of the number that you want to the API to return',
    required: false,
    example: 1,
  })
  public getUsers(
    @Param() getUsersParamsDto: GetUsersParamsDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(getUsersParamsDto, limit, page);
  }

  @Post()
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch()
  public updateUsers(@Body() patchUserDto: PatchUserDto) {
    console.log(patchUserDto);
    return `You sent a patch request to users endpoint ${patchUserDto}`;
  }
}

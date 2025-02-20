import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dtos';
import { PatchPostDto } from './dtos/patch-post.dto';
import { GetPostsDto } from './dtos/get-post.dto';

@Controller('posts')
/**
 * Create a new post
 */
@ApiTags('Posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService, // inject PostsService
  ) {}

  @Get()
  public getAllPosts(@Query() postQuery: GetPostsDto) {
    return this.postsService.finAll(postQuery);
  }
  /**
   * Create a new post
   */
  @Get('/:userId')
  public getPosts(@Param('userId') userId: string) {
    return this.postsService.finOne(userId);
  }

  @ApiOperation({
    summary: 'Create a new post',
    description: 'Create a new post for a given user',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a post',
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @ApiOperation({
    summary: 'Updated an existing blog post',
    description: 'Updated a  post for by user',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully Updated blog post',
  })
  @Patch()
  public updatePost(@Body() patchPostDto: PatchPostDto) {
    return this.postsService.update(patchPostDto);
  }
  // delete
  @Delete()
  public deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}

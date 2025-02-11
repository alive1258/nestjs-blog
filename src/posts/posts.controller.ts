import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dtos';
import { PatchPostDto } from './dtos/patch-post.dto';

@Controller('posts')
/**
 * Create a new post
 */
@ApiTags('Posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService, // inject PostsService
  ) {}

  /**
   * Create a new post
   */
  @Get('/:userId')
  public getPosts(@Param('userId') userId: string) {
    return this.postsService.finAll(userId); // call the finAll method from PostsService with userId parameter
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
    console.log(createPostDto);
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
    console.log(patchPostDto);
    return `You sent a patch request to posts endpoint ${patchPostDto}`;
  }
}

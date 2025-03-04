import {
  BadRequestException,
  Body,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/user.service';
import { CreatePostDto } from '../dtos/create-post.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { TagsService } from 'src/tags/providers/tags.service';
import { GetPostsDto } from '../dtos/get-post.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.service';
import { Paginated } from 'src/common/pagination/interface/paginated.interface';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUserData } from 'src/auth/interface/active-user-data.interface';
import { Tag } from 'src/tags/tag.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    // inject post repository
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    // inject meta options repository
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,

    private readonly tagsService: TagsService,

    //pagination provider
    private readonly paginationProvider: PaginationProvider,

    // inject createPostProvider
    private readonly createPostProvider: CreatePostProvider,
  ) {}

  public async create(
    @Body() createPostDto: CreatePostDto,
    user: ActiveUserData,
  ) {
    // return this.postsService.create(createPostDto, user);
    return await this.createPostProvider.create(createPostDto, user);
  }

  public async finAll(postQuery: GetPostsDto): Promise<Paginated<Post>> {
    // logic to fetch posts for a given user

    const posts = await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postRepository,
    );
    return posts;
  }

  public async finOne(userId: string) {
    // logic to fetch posts for a given user
    let posts = await this.postRepository.find();
    return posts;
  }

  public async update(patchPostDto: PatchPostDto) {
    // declare the tags and post variables
    let tags: Tag[] | undefined = [];
    let post: Post | null;

    try {
      tags = patchPostDto?.tags
        ? await this.tagsService.findMultipleTags(patchPostDto.tags)
        : [];
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to connect to the database. Please try again later.',
      );
    }

    // number of tags need to be equal
    if (!tags || tags.length !== patchPostDto?.tags?.length) {
      throw new BadRequestException(
        'Please check your tags IDs and ensure they are correct',
      );
    }

    // find the post
    try {
      post = await this.postRepository.findOneBy({ id: patchPostDto.id });
    } catch (error) {
      throw new BadRequestException(
        'Unable to connect to the database. Please try again later.',
      );
    }

    // check if post is null
    if (!post) {
      throw new BadRequestException('The Post ID does not exist');
    }

    // update the post
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.content =
      patchPostDto.content !== undefined ? patchPostDto.content : post.content;

    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishedOn = patchPostDto.publishedOn
      ? new Date(patchPostDto.publishedOn)
      : post.publishedOn;

    // assign the new tags
    post.tags = tags;

    // save the updated post and return
    try {
      await this.postRepository.save(post);
    } catch (error) {
      throw new BadRequestException(
        'Unable to connect to the database. Please try again later.',
      );
    }
    return post;
  }

  // delete
  public async delete(id: number) {
    // Delete the post
    await this.postRepository.delete(id);

    // Confirmation
    return { deleted: true, id };
  }
}

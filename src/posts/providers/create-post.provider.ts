import {
  BadRequestException,
  Body,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dtos';
import { UsersService } from 'src/users/providers/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { ActiveUserData } from 'src/auth/interface/active-user-data.interface';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tag.entity';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UsersService,

    // inject post repository
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    // inject meta options repository
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,

    private readonly tagsService: TagsService,
  ) {}
  public async create(
    @Body() createPostDto: CreatePostDto,
    user: ActiveUserData,
  ) {
    let author: User | undefined;
    let tags: Tag[] | undefined;
    try {
      // Find author from database based on authorId
      author = await this.usersService.findOneById(user.sub);

      // find tags
      tags = createPostDto.tags
        ? await this.tagsService.findMultipleTags(createPostDto.tags)
        : [];
    } catch (error) {
      throw new ConflictException(error);
    }
    console.log(tags);

    if (createPostDto.tags?.length !== tags?.length) {
      throw new BadRequestException('Please check your tags IDs');
    }

    const { metaOptions: opMt, ...postDto } = createPostDto;

    let post = this.postRepository.create({
      ...postDto,
      author,
      tags: tags,
    });

    try {
      return await this.postRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure post slug is unique and not a duplicate.',
      });
    }
  }
}

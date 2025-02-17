import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/user.service';
import { CreatePostDto } from '../dtos/create-post.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { TagsService } from 'src/tags/providers/tags.service';

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
  ) {}

  public async create(@Body() createPostDto: CreatePostDto) {
    // Find author from database based on authorId
    const author = await this.usersService.findOneById(createPostDto.authorId);
    // find tags
    // const tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    const tags = createPostDto.tags
      ? await this.tagsService.findMultipleTags(createPostDto.tags)
      : [];

    if (!author) {
      throw new Error('Author not found'); // Handle case where author is not found
    }

    let metaOptions = createPostDto.metaOptions
      ? this.metaOptionRepository.create(createPostDto.metaOptions)
      : undefined; // Change null to undefined for type compatibility

    if (metaOptions) {
      metaOptions = await this.metaOptionRepository.save(metaOptions);
    }

    const { metaOptions: opMt, ...postDto } = createPostDto;

    let post = this.postRepository.create({
      ...postDto,
      author,
      tags: tags,
    });

    if (metaOptions) {
      post.metaOptions = metaOptions;
    }

    return await this.postRepository.save(post);
  }

  public async finAll() {
    // logic to fetch posts for a given user

    let posts = await this.postRepository.find({
      relations: {
        metaOptions: true,
        // author: true,
        // tags: true,
      },
    });
    return posts;
  }
  public async finOne(userId: string) {
    // logic to fetch posts for a given user

    let posts = await this.postRepository.find();
    return posts;
  }

  public async update(patchPostDto: PatchPostDto) {
    // find ths tags
    // let tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    let tags = patchPostDto.tags
      ? await this.tagsService.findMultipleTags(patchPostDto.tags)
      : [];

    // find the post
    let post = await this.postRepository.findOneBy({ id: patchPostDto.id });

    // update the post

    if (!post) {
      throw new Error(`Post with id ${patchPostDto.id} not found`);
    }
    post.title = patchPostDto.title ?? post.title;
    // post.content = patchPostDto.content ?? post.content;
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

    //assign the new tags
    post.tags = tags;

    // save the updated post and return
    return await this.postRepository.save(post);
  }

  // delete
  public async delete(id: number) {
    // Delete the post
    await this.postRepository.delete(id);

    // Confirmation
    return { deleted: true, id };
  }
}

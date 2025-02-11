import {
  IsAlpha,
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';
import { postStatus } from '../enums/postStatus.enum';
import { postType } from '../enums/postType.enum';
import { CreatePostMetaOptionsDto } from './create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description:
      'The title of the blog post. Must be at least 4 characters long.',
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: postType,
    description:
      'Type of the post. Possible values: "post", "page", "story", "series".',
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    description:
      'Unique slug for the blog post. Must be lowercase, use only hyphens (-), and have no spaces.',
    example: 'my-blog-post',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and users only "-"  and without spaces. for example "my-url"',
  })
  slug: string;

  @ApiProperty({
    enum: postStatus,
    description:
      'Status of the post. Possible values: "draft", "scheduled", "published", "review", "archived".',
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;

  @ApiPropertyOptional({
    description: 'The content of the Blog post',
    example: '<h1>Hello World!</h1>',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'SEO metadata for the blog post in JSON format.',
    example:
      '{"title": "My Blog Post", "description": "This is a blog post about my life."}',
  })
  @IsOptional()
  @IsJSON()
  schemas?: string;

  @ApiPropertyOptional({
    description: 'URL of the featured image for the blog post.',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsUrl()
  featuredImageUrl?: string;
  @ApiProperty({
    description: 'Date and time when the blog post was published.',
    example: '2022-01-01T12:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  publishedOn: Date;

  @ApiPropertyOptional({
    description:
      'Tags associated with the blog post. Each tag must be at least 3 characters long.',
    example: ['tech', 'nestjs', 'development'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[];

  @ApiPropertyOptional({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'Meta key of the blog post.',
          example: 'author',
        },
        value: {
          type: 'any',
          description: 'Meta value of the blog post.',
          example: 'John Doe',
        },
      },
      required: ['key', 'value'],
    },
    description: 'Metadata options for the blog post.',
  })
  @IsOptional()
  @IsArray()
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto[];
}

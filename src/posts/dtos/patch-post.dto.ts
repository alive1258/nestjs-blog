import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreatePostDto } from './create-post.dtos';

export class PatchPostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: 'Ths ID of the post that needs to be updated',
    example: '607f191e81a8642011000000',
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}

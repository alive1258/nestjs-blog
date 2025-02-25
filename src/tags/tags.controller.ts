import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { TagsService } from './providers/tags.service';

@Controller('tags')
export class TagsController {
  constructor(
    // Inject TagService here
    private readonly tagsService: TagsService,
  ) {}

  // Implement CRUD operations for tags here
  @Post()
  public create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }
  @Get()
  public async findAll() {
    return this.tagsService.finAll();
  }

  @Delete()
  public async delete(@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.delete(id);
  }

  //  /tags/soft-delete
  @Delete('soft-delete')
  public async softDelete(@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.softRemove(id);
  }
}

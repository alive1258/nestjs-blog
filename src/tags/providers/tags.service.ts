import { Injectable } from '@nestjs/common';
import { Tag } from '../tag.entity';
import { In, IsNull, Repository } from 'typeorm';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>, // Corrected injection
  ) {}

  public async create(createTagDto: CreateTagDto) {
    const tag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tag);
  }

  public async findMultipleTags(tags: number[]) {
    console.log(tags);
    let results = await this.tagsRepository.find({
      where: { id: In(tags) }, // Added In operator
    });

    return results;
  }
  public async finAll() {
    let results = await this.tagsRepository.find({
      where: { deletedAt: new Date('2025-02-17 11:11:14.281278') },
    });

    return results;
  }

  public async delete(id: number) {
    await this.tagsRepository.delete(id);
    return { deleted: true, id };
  }

  public async softRemove(id: number) {
    await this.tagsRepository.softDelete(id);
    return { deleted: true, id };
  }
}

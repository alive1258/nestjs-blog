import { Module } from '@nestjs/common';
import { PaginationProvider } from './providers/pagination.service';

@Module({
  controllers: [],
  providers: [PaginationProvider],
  exports: [PaginationProvider],
})
export class PaginationModule {}

import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from './search.dto';

@Controller('users')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async searchUsers(@Query() query: SearchDto) {
    return this.searchService.search(query.email, query.number);
  }
}

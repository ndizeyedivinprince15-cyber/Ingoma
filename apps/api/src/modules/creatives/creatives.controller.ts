import { Controller, Get, Param, Query } from '@nestjs/common';
import { CreativesService } from './creatives.service';

@Controller('creatives')
export class CreativesController {
  constructor(private readonly creativesService: CreativesService) {}

  @Get()
  findAll(@Query('domain') domain?: string) {
    return this.creativesService.findAll(domain);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.creativesService.findOne(slug);
  }
}
import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() body: {
    creativeId: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    message: string;
  }) {
    return this.contactService.create(body);
  }
}
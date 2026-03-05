import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    creativeId: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    message: string;
  }) {
    return this.prisma.contactRequest.create({ data });
  }
}
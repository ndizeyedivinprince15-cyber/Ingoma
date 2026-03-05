import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreativesService {
  constructor(private prisma: PrismaService) {}

  async findAll(domain?: string) {
    return this.prisma.creative.findMany({
      where: {
        isActive: true,
        ...(domain ? { domain } : {}),
      },
      include: { portfolio: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(slug: string) {
    return this.prisma.creative.findUnique({
      where: { slug },
      include: { portfolio: true },
    });
  }
}
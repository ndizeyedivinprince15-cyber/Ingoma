// apps/api/src/modules/profile/profile.controller.ts

import { Controller, Get, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

/**
 * Contrôleur Profile - version temporaire pour build
 * Toutes les méthodes retournent des placeholders.
 */
@Controller('profile')
export class ProfileController {
  constructor() {}

  @Post()
  async createOrUpdateProfile(
    @Body() dto: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    // Placeholder pour le build
    const profile = null;
    const created = false;

    res.status(created ? HttpStatus.CREATED : HttpStatus.OK);
    return { profile };
  }

  @Get()
  async getProfile(): Promise<any> {
    // Placeholder pour le build
    const profile = null;
    return { profile };
  }
}
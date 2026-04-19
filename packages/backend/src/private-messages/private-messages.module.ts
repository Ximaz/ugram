import { Module } from '@nestjs/common';
import { PrivateMessagesController } from './private-messages.controller.js';
import { PrivateMessagesService } from './private-messages.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PrivateMessagesController],
  providers: [PrivateMessagesService],
})
export class PrivateMessagesModule {}

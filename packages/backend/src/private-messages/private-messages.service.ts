import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserTokenDataDto } from '../auth/entities/user-token-data.js';
import { PrivateMessageCreateDto } from './dto/create-private-message.dto.js';
import { CreatedPrivateMessageDto } from './entities/created-private-message.js';
import { PrivateMessageList } from './schemas/private-message-list.schema.js';

@Injectable()
export class PrivateMessagesService {
  constructor(private readonly prismaService: PrismaService) {}

  async list(me: string, userId: string): Promise<PrivateMessageList> {
    const mySentMessages = await this.prismaService.privateMessage.findMany({
      select: {
        fromUserId: true,
        content: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      where: {
        fromUserId: me,
        toUserId: userId,
      },
    });

    const theirSentMessage = await this.prismaService.privateMessage.findMany({
      select: {
        fromUserId: true,
        content: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      where: {
        fromUserId: userId,
        toUserId: me,
      },
    });

    return [...mySentMessages, ...theirSentMessage]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((msg) => ({
        from: msg.fromUserId,
        content: msg.content,
        createdAt: msg.createdAt.toISOString(),
      }));
  }

  async create(
    token: UserTokenDataDto,
    dto: PrivateMessageCreateDto,
  ): Promise<CreatedPrivateMessageDto> {
    return this.prismaService.privateMessage.create({
      data: {
        fromUserId: token.id,
        toUserId: dto.to,
        content: dto.content,
      },
      select: { id: true },
    });
  }
}

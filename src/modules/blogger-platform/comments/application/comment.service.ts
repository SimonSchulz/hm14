import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WithId } from 'mongodb';
import { CommentEntity } from '../domain/entities/comment.entity';
import { CommentsRepository } from '../infrastructure/repositories/comments.repository';
import { CommentsQueryRepository } from '../infrastructure/repositories/comments.query.repository';
import { CommentInputDto } from '../dto/comment.input.dto';
import { RequestDataEntity } from '../../../../core/dto/request.data.entity';

@Injectable()
export class CommentsService {
  constructor(
    @Inject() private readonly commentsRepository: CommentsRepository,
    @Inject() private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  async create(
    dto: CommentInputDto,
    info: RequestDataEntity,
    postId: string,
  ): Promise<WithId<CommentEntity>> {
    const userInfo: RequestDataEntity = {
      userId: info.userId,
      userLogin: info.userLogin,
    };

    const newComment = new CommentEntity({
      content: dto.content,
      commentatorInfo: userInfo,
      postId,
    });

    return this.commentsRepository.create(newComment);
  }

  async update(id: string, dto: CommentInputDto): Promise<void> {
    const comment = await this.commentsQueryRepository.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    await this.commentsRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.commentsRepository.delete(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { LikesInputDto } from '../../likes/dto/likes.input.dto';
import { CommentsService } from '../application/comment.service';
import { CommentsQueryRepository } from '../infrastructure/repositories/comments.query.repository';
import { CommentInputDto } from '../dto/comment.input.dto';
import { LikesService } from '../../likes/application/likes.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly likesService: LikesService,
  ) {}

  @Get(':id')
  async getComment(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsQueryRepository.findById(id);
  }

  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: CommentInputDto,
  ) {
    return this.commentsService.update(commentId, updateCommentDto);
  }

  @Put(':commentId/like-status')
  async updateLikeStatus(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() likeStatusDto: LikesInputDto,
  ) {
    return this.likesService.updateLikeStatus(
      commentId,
      commentId,
      likeStatusDto.likeStatus,
    );
  }

  @Delete(':commentId')
  async deleteComment(@Param('commentId', ParseUUIDPipe) commentId: string) {
    return this.commentsService.delete(commentId);
  }
}

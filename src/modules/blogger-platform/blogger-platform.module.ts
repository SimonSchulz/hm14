import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './blogs/controllers/blogs.controller';
import { BlogService } from './blogs/application/blog.service';
import { BlogsQueryRepository } from './blogs/infrastructure/repositories/blogs.query.repository';
import { BlogsRepository } from './blogs/infrastructure/repositories/blog.repository';
import {
  BlogModel,
  BlogSchema,
} from './blogs/infrastructure/schemas/blog.schema';
import {
  PostModel,
  PostSchema,
} from './posts/infrastructure/schemas/post.schema';
import {
  CommentModel,
  CommentSchema,
} from './comments/infrastructure/schemas/comment.schema';
import {
  LikeModel,
  LikeSchema,
} from './likes/infrasructure/schemas/likes.schema';
import { PostService } from './posts/application/post.service';
import { PostsQueryRepository } from './posts/infrastructure/repositories/posts.query.repository';
import { PostsRepository } from './posts/infrastructure/repositories/post.repository';
import { UsersModule } from '../users/users.module';
import { CommentsController } from './comments/controllers/comment.controller';
import { PostsController } from './posts/controllers/posts.controller';
import { CommentsService } from './comments/application/comment.service';
import { CommentsQueryRepository } from './comments/infrastructure/repositories/comments.query.repository';
import { CommentsRepository } from './comments/infrastructure/repositories/comments.repository';
import { LikesRepository } from './likes/infrasructure/repositories/likes.repository';
import { LikesService } from './likes/application/likes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BlogModel.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: PostModel.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: LikeModel.name, schema: LikeSchema }]),
    MongooseModule.forFeature([
      { name: CommentModel.name, schema: CommentSchema },
    ]),
    UsersModule,
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogService,
    BlogsQueryRepository,
    BlogsRepository,
    PostService,
    PostsQueryRepository,
    PostsRepository,
    CommentsService,
    CommentsQueryRepository,
    CommentsRepository,
    LikesService,
    LikesRepository,
  ],
  exports: [BlogService, BlogsQueryRepository],
})
export class BloggerPlatformModule {}

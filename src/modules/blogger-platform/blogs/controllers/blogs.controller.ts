import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { BlogService } from '../application/blog.service';
import { BlogsQueryRepository } from '../infrastructure/repositories/blogs.query.repository';
import { BlogsQueryParams } from '../dto/blogs-query-params.input-dto';
import { BlogInputDto } from '../dto/blog.input-dto';
import { PostsQueryParams } from '../../posts/dto/posts-query-params.input-dto';
import { PostsQueryRepository } from '../../posts/infrastructure/repositories/posts.query.repository';
import { PostService } from '../../posts/application/post.service';
import { PostInputWithoutBlogIdDto } from '../../posts/dto/post.input-without-blogId.dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogService: BlogService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postService: PostService,
  ) {}

  @Get()
  getBlogs(@Query() query: BlogsQueryParams) {
    return this.blogsQueryRepository.findAllBlogs(query);
  }

  @Get(':id')
  getBlog(@Param('id') id: string) {
    return this.blogsQueryRepository.findById(id);
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: PostsQueryParams,
  ) {
    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return this.postsQueryRepository.findPostsByBlogId(blogId, query);
  }

  @Post()
  createBlog(@Body() dto: BlogInputDto) {
    return this.blogService.create(dto);
  }

  @Post(':blogId/posts')
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() dto: PostInputWithoutBlogIdDto,
  ) {
    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return this.postService.createByBlogId(dto, blogId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateBlog(@Param('id') id: string, @Body() dto: BlogInputDto) {
    return this.blogService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBlog(@Param('id') id: string) {
    return this.blogService.delete(id);
  }
}

import { Controller, ForbiddenException, Get, NotFoundException, Param, Query, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { ClientAuthGuard } from 'src/auth/client-auth.guard'
import { ResponseBody } from 'src/interfaces/ResponseBody'
import { Require } from 'src/permissions/permissions.decorator'
import { PermissionsGuard } from 'src/permissions/permissions.guard'
import { PermissionsService } from 'src/permissions/permissions.service'
import { QueryPostsDto } from './dto/QueryPosts.dto'
import { Posts } from './posts.entity'
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
  private postsService: PostsService
  private permsService: PermissionsService

  constructor (postsService: PostsService, permsService: PermissionsService) {
    this.postsService = postsService
    this.permsService = permsService
  }

  @Get('@me')
  @UseGuards(ClientAuthGuard)
  async queryMyRequests (
    @Res({ passthrough: true }) res: Response,
    @Query('per_pages') perPages: number,
    @Query() query: QueryPostsDto
  ): Promise<ResponseBody<{ posts: Posts[] }>> {
    const posts = await this.postsService.queryPosts(
      query.page,
      perPages,
      {
        closed: query.closed,
        userId: res.locals.userId
      }
    )

    return {
      success: true,
      data: {
        posts
      }
    }
  }

  @Get()
  @Require('VIEW_REQUESTS')
  @UseGuards(PermissionsGuard)
  async queryRequests (
    @Query('per_pages') perPages: number,
    @Query() query: QueryPostsDto
  ): Promise<ResponseBody<{ posts: Posts[] }>> {
    const posts = await this.postsService.queryPosts(
      query.page,
      perPages,
      {
        closed: query.closed
      }
    )

    return {
      success: true,
      data: {
        posts
      }
    }
  }

  @Get(':id')
  @Require('VIEW_REQUESTS')
  @UseGuards(PermissionsGuard)
  async getRequest (@Param('id') postId: number, @Res() res: Response):
    Promise<ResponseBody<{ post: Posts }>> {
    const post = await this.postsService.getPost(postId)
    if (!post) {
      throw new NotFoundException()
    }

    const permmited =
      this.permsService.hasPermission(res.locals.userId, `CATEGORY:${post.subId}:READ`)

    if (!permmited) {
      throw new ForbiddenException()
    }

    return {
      success: true,
      data: {
        post
      }
    }
  }

  @Get(':id/@me')
  @UseGuards(ClientAuthGuard)
  async getMyRequest (@Res() res: Response, @Param('id') postId: number):
    Promise<ResponseBody<{ post: Posts }>> {
    const post = await this.postsService.getPost(postId)
    if (post.userId !== res.locals.userId) {
      throw new ForbiddenException()
    }

    return {
      success: true,
      data: {
        post
      }
    }
  }
}

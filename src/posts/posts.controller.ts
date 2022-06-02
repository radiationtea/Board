import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { ClientAuthGuard } from 'src/auth/client-auth.guard'
import { ResponseBody } from 'src/interfaces/ResponseBody'
import { Require } from 'src/permissions/permissions.decorator'
import { PermissionsGuard } from 'src/permissions/permissions.guard'
import { QueryPostsDto } from './dto/QueryPosts.dto'
import { Posts } from './posts.entity'
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
  private postsService: PostsService

  constructor (postsService: PostsService) {
    this.postsService = postsService
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
}

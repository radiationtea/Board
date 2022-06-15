import { Body, Controller, Delete, ForbiddenException, Get, NotAcceptableException, NotFoundException, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { ClientAuthGuard } from 'src/auth/client-auth.guard'
import { CategoriesService } from 'src/categories/categories.service'
import { ResponseBody } from 'src/interfaces/ResponseBody'
import { Require } from 'src/permissions/permissions.decorator'
import { PermissionsGuard } from 'src/permissions/permissions.guard'
import { PermissionsService } from 'src/permissions/permissions.service'
import { CreatePostDto } from './dto/CreatePost.dto'
import { PostActionDto } from './dto/PostAction.dto'
import { QueryPostsDto } from './dto/QueryPosts.dto'
import { Posts } from './posts.entity'
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
  private postsService: PostsService
  private permsService: PermissionsService
  private categoriesService: CategoriesService

  constructor (postsService: PostsService, permsService: PermissionsService, categoriesService: CategoriesService) {
    this.postsService = postsService
    this.permsService = permsService
    this.categoriesService = categoriesService
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
  async getRequest (@Param('id') postId: number, @Res({ passthrough: true }) res: Response):
    Promise<ResponseBody<{ post: Posts }>> {
    const post = await this.postsService.getPost(postId)
    if (!post) {
      throw new NotFoundException()
    }

    const permmited =
      await this.permsService.hasPermission(res.locals.userId, `CATEGORY:${post.subId}:READ`)

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
  async getMyRequest (@Res({ passthrough: true }) res: Response, @Param('id') postId: number):
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

  @Post()
  @UseGuards(ClientAuthGuard)
  async createPosts (@Res({ passthrough: true }) res: Response, @Body() body: CreatePostDto):
    Promise<ResponseBody<{ postId: number }>> {
    const isEvalable = await this.categoriesService.checkEvalable(body.subcategoryId)
    if (!isEvalable) throw new NotAcceptableException({ message: 'NOT_EVALABLE_YET' })

    const postId = await this.postsService.createPost(res.locals.userId, body)

    return {
      success: true,
      data: {
        postId
      }
    }
  }

  @Delete(':id/@me')
  @UseGuards(ClientAuthGuard)
  async deleteMyPosts (@Res({ passthrough: true }) res: Response, @Param('id') postId: number):
    Promise<ResponseBody<undefined>> {
    const post = await this.postsService.getPost(postId)
    if (res.locals.userId !== post?.userId) throw new ForbiddenException()

    await this.postsService.deletePost(postId)

    return {
      success: true
    }
  }

  @Delete(':id')
  @Require('MANAGE_POSTS')
  @UseGuards(PermissionsGuard)
  async deletePosts (@Param('id') postId: number):
   Promise<ResponseBody<undefined>> {
    await this.postsService.deletePost(postId)
    return {
      success: true
    }
  }

  @Put(':id/@me')
  @UseGuards(ClientAuthGuard)
  async editPosts
  (@Res({ passthrough: true }) res: Response, @Body() body: CreatePostDto, @Param('id') postId: number):
    Promise<ResponseBody<undefined>> {
    const post = await this.postsService.getPost(postId)
    if (res.locals.userId !== post?.userId) throw new ForbiddenException()

    await this.postsService.editPost(postId, body)
    return {
      success: true
    }
  }

  @Post(':id/@action')
  @UseGuards(ClientAuthGuard)
  async postAction (@Res({ passthrough: true }) res: Response, @Body() body: PostActionDto, @Param('id') postId: number): Promise<ResponseBody<undefined>> {
    const post = await this.postsService.getPost(postId)
    if (!post) throw new NotFoundException()

    const isPermitted =
      await this.permsService.hasPermission(
        res.locals.userId,
        `CATEGORY:${post.subCategory.parentId}:WRITE`)

    if (!isPermitted) {
      throw new Error()
    }

    await this.postsService.actionPost(post, body.action, res.locals.uerId)

    return {
      success: true
    }
  }
}

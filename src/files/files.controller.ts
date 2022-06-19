import { Body, Controller, ForbiddenException, NotFoundException, Post, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { ClientAuthGuard } from 'src/auth/client-auth.guard'
import { ResponseBody } from 'src/interfaces/ResponseBody'
import { PermissionsService } from 'src/permissions/permissions.service'
import { PostsService } from 'src/posts/posts.service'
import { UploadFileDto } from './dto/UploadFile.dto'
import { FilesService } from './files.service'

@Controller('files')
export class FilesController {
  private readonly filesService: FilesService
  private readonly postsService: PostsService
  private readonly permsService: PermissionsService

  constructor (filesService: FilesService, postsService: PostsService, permsService: PermissionsService) {
    this.filesService = filesService
    this.postsService = postsService
    this.permsService = permsService
  }

  @Post()
  @UseGuards(ClientAuthGuard)
  async uploadFile (
    @Res({ passthrough: true }) res: Response,
    @Body() body: UploadFileDto): Promise<ResponseBody<{ url: string }>> {
    const post = await this.postsService.getPost(body.postId)
    if (!post) throw new NotFoundException()

    const isPermitted =
      await this.permsService.hasPermission(
        res.locals.userId,
        `CATEGORY:${post.subCategory.parentId}:WRITE`)

    if (!isPermitted) {
      throw new ForbiddenException()
    }

    const url = await this.filesService.createUploadLink(body.postId, body.fileName)

    return {
      success: true,
      data: {
        url
      }
    }
  }

  @Post('@me')
  @UseGuards(ClientAuthGuard)
  async uploadMyFile (
    @Res({ passthrough: true }) res: Response,
    @Body() body: UploadFileDto): Promise<ResponseBody<{ url: string }>> {
    const post = await this.postsService.getPost(body.postId)
    if (!post) throw new NotFoundException()
    if (post.userId !== res.locals.userId) throw new ForbiddenException()

    const url = await this.filesService.createUploadLink(body.postId, body.fileName)

    return {
      success: true,
      data: {
        url
      }
    }
  }
}

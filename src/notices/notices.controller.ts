import { Body, Controller, Delete, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { ResponseBody } from 'src/interfaces/ResponseBody'
import { Require } from 'src/permissions/permissions.decorator'
import { PermissionsGuard } from 'src/permissions/permissions.guard'
import { CreateNoticeDto } from './dto/CreateNotice.dto'
import { QueryNoticeDto } from './dto/QueryNotice.dto'
import { Notices } from './notices.entity'
import { NoticesService } from './notices.service'

@Controller('notices')
export class NoticesController {
  private readonly noticesService: NoticesService

  constructor (noticesService: NoticesService) {
    this.noticesService = noticesService
  }

  @Get()
  async queryNotice (@Query() query: QueryNoticeDto, @Query('per_pages') perPages: number): Promise<ResponseBody<{ notices: Notices[] }>> {
    const notices = await this.noticesService.queryNotice(query.page, perPages)

    return {
      success: true,
      data: {
        notices
      }
    }
  }

  @Get(':boardId')
  async getNotice (@Param('boardId') boardId: number): Promise<ResponseBody<{ notice: Notices }>> {
    const notice = await this.noticesService.getNotice(boardId)
    return {
      success: true,
      data: {
        notice
      }
    }
  }

  @Post()
  @Require('VIEW_REQUESTS')
  @UseGuards(PermissionsGuard)
  async createNotice (@Body() body: CreateNoticeDto, @Res({ passthrough: true }) res: Response): Promise<ResponseBody<undefined>> {
    await this.noticesService.createNotice(res.locals.userId, body.title, body.content)

    return {
      success: true
    }
  }

  @Delete(':boardId')
  @Require('VIEW_REQUESTS')
  @UseGuards(PermissionsGuard)
  async deleteNotice (@Param('boardId') boardId: number): Promise<ResponseBody<undefined>> {
    await this.noticesService.deleteNotice(boardId)

    return {
      success: true
    }
  }
}

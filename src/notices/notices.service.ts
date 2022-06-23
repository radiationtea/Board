import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Notices } from './notices.entity'

@Injectable()
export class NoticesService {
  private readonly notices: Repository<Notices>

  constructor (@InjectRepository(Notices) notices: Repository<Notices>) {
    this.notices = notices
  }

  getNotice (boardId: number): Promise<Notices> {
    return this.notices.findOne(boardId)
  }

  queryNotice (page = 0, perPage = 10): Promise<Notices[]> {
    return this.notices.find({
      skip: page * perPage,
      take: perPage,
      select: ['boardId', 'userId', 'author', 'title', 'createdAt']
    })
  }

  async createNotice (userId: string, title: string, content: string) {
    await this.notices.insert({
      userId,
      title,
      content
    })
  }

  async deleteNotice (boardId: number) {
    await this.notices.delete({
      boardId
    })
  }
}

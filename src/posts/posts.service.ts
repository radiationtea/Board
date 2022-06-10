import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Posts } from './posts.entity'

@Injectable()
export class PostsService {
  private posts: Repository<Posts>

  constructor (
    @InjectRepository(Posts)
      posts: Repository<Posts>
  ) {
    this.posts = posts
  }

  queryPosts (page = 0, perPage = 10, filter?: {
    closed?: boolean,
    userId?: string
  }): Promise<Posts[]> {
    return this.posts.find({
      skip: page * perPage,
      take: perPage,
      where: filter || undefined,
      select: ['user', 'closed', 'postId', 'subCategory', 'createdAt']
    })
  }

  getPost (postId: number): Promise<Posts> {
    return this.posts.findOne(postId)
  }
}

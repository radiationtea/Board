import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreatePostDto } from './dto/CreatePost.dto'
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

  async createPost (userId: string, data: CreatePostDto) {
    const result = await this.posts.insert({
      userId,
      subId: data.subcategoryId,
      content: data.content
    })

    return result.generatedMaps[0].postId
  }

  async deletePost (postId: number) {
    await this.posts.delete(postId)
  }
}

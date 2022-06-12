import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreatePostDto } from './dto/CreatePost.dto'
import { ActionType } from './dto/PostAction.dto'
import { History, Posts } from './posts.entity'

@Injectable()
export class PostsService {
  private posts: Repository<Posts>
  private history: Repository<History>

  constructor (
    @InjectRepository(Posts)
      posts: Repository<Posts>,
    @InjectRepository(History)
      history: Repository<History>
  ) {
    this.posts = posts
    this.history = history
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

  async editPost (postId: number, body: CreatePostDto) {
    await this.posts.update(postId, body)
  }

  async actionPost (postId: number, type: ActionType, userId: string) {
    await this.posts.update(postId, { closed: true })

    if (type === 'RESOLVE') {
      const post = await this.getPost(postId)
      await this.history.insert({
        subcategoryId: post.subId,
        teacherId: userId,
        userId: post.userId
      })
    }
  }
}

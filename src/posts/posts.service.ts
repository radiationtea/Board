import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IntegrationsService } from 'src/integrations/intergrations.service'
import { Repository } from 'typeorm'
import { CreatePostDto } from './dto/CreatePost.dto'
import { ActionType } from './dto/PostAction.dto'
import { History, Posts } from './posts.entity'

@Injectable()
export class PostsService {
  private posts: Repository<Posts>
  private history: Repository<History>
  private integrations: IntegrationsService

  constructor (
    @InjectRepository(Posts)
      posts: Repository<Posts>,
    @InjectRepository(History)
      history: Repository<History>,
      integrations: IntegrationsService
  ) {
    this.posts = posts
    this.history = history
    this.integrations = integrations
  }

  queryPosts (page = 0, perPage = 10, filter?: {
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

    this.integrations.sendNotice(
      'submitted', data.subcategoryId, userId)

    return result.generatedMaps[0].postId
  }

  async deletePost (postId: number) {
    await this.posts.delete(postId)
  }

  async editPost (postId: number, body: CreatePostDto) {
    await this.posts.update(postId, {
      subId: body.subcategoryId,
      content: body.content
    })
  }

  async actionPost (post: Posts, type: ActionType, userId: string) {
    await this.posts.update(post.postId, { closed: true })

    if (type === 'RESOLVE') {
      await this.history.insert({
        subcategoryId: post.subId,
        teacherId: userId,
        userId: post.userId
      })
    }

    this.integrations.sendNotice(
      type === 'RESOLVE' ? 'accepted' : 'rejected',
      post.subId,
      post.userId)
  }
}

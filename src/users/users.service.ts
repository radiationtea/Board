import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Users } from './users.entity'

@Injectable()
export class UsersService {
  private users: Repository<Users>

  constructor (
    @InjectRepository(Users)
      users: Repository<Users>
  ) {
    this.users = users
  }

  public getUser (userId: string) {
    return this.users.findOne(userId)
  }
}

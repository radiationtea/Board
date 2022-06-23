import { Users } from 'src/users/users.entity'
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'boards' })
export class Notices {
  @PrimaryGeneratedColumn({ name: 'boardid' })
  readonly boardId: number

  @Column({ name: 'userid' })
  readonly userId: string

  @Column()
  readonly content: string

  @Column({ name: 'createdat', type: 'timestamp' })
  readonly createdAt: Date

  @Column()
  readonly title: string

  @OneToMany(() => Users, (u) => u.userId)
  @JoinColumn({ name: 'userid' })
  readonly author: Users
}

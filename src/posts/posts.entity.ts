import { Subcategories } from '../categories/categories.entities'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Users } from '../users/users.entity'

@Entity()
export class Posts {
  @PrimaryGeneratedColumn({ name: 'postid' })
  readonly postId: number

  @Column({ name: 'subid' })
  readonly subId: number

  @ManyToOne(() => Subcategories, (sub) => sub.subcategoryId, { eager: true })
  @JoinColumn({ name: 'subid' })
  readonly subCategory: Subcategories

  @Column({ name: 'userid' })
  readonly userId: string

  @ManyToOne(() => Users, (user) => user.userId, { eager: true })
  @JoinColumn({ name: 'userid' })
  readonly user: Users

  @Column()
  readonly content: string

  @Column({ name: 'createdat', type: 'timestamp' })
  readonly createdAt: Date

  @Column()
  readonly closed: boolean
}

@Entity()
export class History {
  @PrimaryGeneratedColumn({ name: 'hisid' })
  readonly historyId: number

  @Column({ name: 'subid' })
  readonly subcategoryId: number

  @Column({ name: 'teacherid' })
  readonly teacherId: string

  @Column({ name: 'userid' })
  readonly userId: string
}

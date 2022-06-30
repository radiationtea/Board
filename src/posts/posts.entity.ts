import { Subcategories } from '../categories/categories.entities'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Users } from '../users/users.entity'
import { Files } from 'src/files/files.entity'

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

  @Column({ type: 'bool', width: 1 })
  readonly closed!: boolean

  @OneToMany(() => Files, (file) => file.post, { eager: true })
  readonly files: Files[]
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

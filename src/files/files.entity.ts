import { Posts } from 'src/posts/posts.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

@Entity()
export class Files {
  @PrimaryColumn({ name: 'fileid' })
  readonly fileId: string

  @Column({ name: 'postid' })
  readonly postId: number

  @Column()
  readonly url: string

  @ManyToOne(() => Posts, (post) => post.postId)
  @JoinColumn({ name: 'postid' })
  readonly post: Posts
}

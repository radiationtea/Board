import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Permissions {
  @PrimaryGeneratedColumn('increment', { name: 'permid' })
  readonly permId: number

  @Column({ name: 'roleid' })
  readonly roleId: number

  @Column()
  readonly label: string
}

@Entity()
export class Roles {
  @PrimaryGeneratedColumn('increment', { name: 'roleid' })
  readonly roleId: number

  @Column({ name: 'userid' })
  readonly userId: string

  @Column()
  readonly label: string
}

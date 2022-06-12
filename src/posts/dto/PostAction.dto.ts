import { IsIn } from 'class-validator'

export type ActionType = 'RESOLVE' | 'REJECT'

export class PostActionDto {
  @IsIn(['RESOLVE', 'REJECT'])
  readonly action: ActionType
}

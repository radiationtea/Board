import { Response } from 'express'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class ClientAuthGuard implements CanActivate {
  public canActivate (context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp()
    const res = http.getResponse()

    return this.verify(res)
  }

  private async verify (res: Response) {
    return res.locals.userId !== undefined
  }
}

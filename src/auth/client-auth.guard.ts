import { Request } from 'express'
import { AuthService } from './auth.service'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class ClientAuthGuard implements CanActivate {
  private authService: AuthService

  constructor (authService: AuthService) {
    this.authService = authService
  }

  public canActivate (context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp()
    const req = http.getRequest()

    return this.verify(req)
  }

  private async verify (req: Request) {
    const sessionToken = req.cookies.SESSION_TOKEN

    if (!sessionToken) return false

    return !!await this.authService.verifyClientToken(sessionToken)
  }
}

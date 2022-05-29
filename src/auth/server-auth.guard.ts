import { Request } from 'express'
import { AuthService } from './auth.service'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class ServerAuthGuard implements CanActivate {
  private authService: AuthService

  constructor (authService: AuthService) {
    this.authService = authService
  }

  public canActivate (context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    return this.verify(request)
  }

  private verify (request: Request): boolean {
    const serverToken = request.headers.authorization

    if (!serverToken) return false

    return this.authService.verifyServerToken(serverToken)
  }
}

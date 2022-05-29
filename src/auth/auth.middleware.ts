import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { AuthService } from './auth.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private authService: AuthService

  constructor (authService: AuthService) {
    this.authService = authService
  }

  use (req: Request, res: Response, next: NextFunction) {
    const sessionToken = req.cookies.SESSION_TOKEN
    if (!sessionToken) return next()

    const userId = this.authService.verifyClientToken(sessionToken)
    if (!userId) return next()

    res.locals.userId = userId
    next()
  }
}

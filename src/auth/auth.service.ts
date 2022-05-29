import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  private jwtService: JwtService
  private serverToken: string

  constructor (configService: ConfigService, jwtService: JwtService) {
    this.jwtService = jwtService
    this.serverToken =
      configService.get<string>('SERVER_TOKEN', '')
  }

  public verifyServerToken (token: string) {
    return token === `token ${this.serverToken}`
  }

  public verifyClientToken (token: string) {
    try {
      const data = this.jwtService.verify(token)
      return data?.sub
    } catch {
      return undefined
    }
  }
}

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
    console.log(token)
    try {
      const data = this.jwtService.verify(token)
      console.log(data)
      return data?.Userid
    } catch (e) {
      console.log(e)
      return undefined
    }
  }
}

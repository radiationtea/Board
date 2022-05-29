import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { ClientAuthGuard } from './client-auth.guard'
import { ServerAuthGuard } from './server-auth.guard'

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        ({ secret: configService.get<string>('CLIENT_SECRET', '') })
    })
  ],
  providers: [AuthService, ClientAuthGuard, ServerAuthGuard],
  exports: [AuthService, ClientAuthGuard, ServerAuthGuard]
})
export class AuthModule {}

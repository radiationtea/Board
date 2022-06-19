import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

import { AuthMiddleware } from './auth/auth.middleware'
import { AuthModule } from './auth/auth.module'
import { HealthModule } from './health/health.module'
import { PostsModule } from './posts/posts.module'
import { CategoriesModule } from './categories/categories.module'
import { FilesModule } from './files/files.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: ['env']
    }),
    TypeOrmModule.forRoot(),
    AuthModule,
    HealthModule,
    PostsModule,
    CategoriesModule,
    FilesModule
  ]
})
export class AppModule implements NestModule {
  configure (consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('/')
  }
}

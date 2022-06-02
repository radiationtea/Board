import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'

import { AppModule } from './app.module'

(async () => {
  const app = await NestFactory.create(AppModule)
  const port = parseInt(process.env.PORT ?? '8080')

  app.use(cookieParser())
  app.setGlobalPrefix('api/board/v1')
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    whitelist: true,
    always: true
  }))

  app.listen(port)

  console.log(`Server is now on http://localhost:${port}`)
})()

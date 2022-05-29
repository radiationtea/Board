import { Controller, Get } from '@nestjs/common'

import { HealthDto } from './dto/health.dto'
import { HealthService } from './health.service'
import { ResponseBody } from '../interfaces/ResponseBody'

@Controller('health')
export class HealthController {
  private healthService: HealthService

  constructor (healthService: HealthService) {
    this.healthService = healthService
  }

  @Get()
  async getHealth (): Promise<ResponseBody<HealthDto>> {
    return {
      success: true,
      data: await this.healthService.getHealth()
    }
  }
}

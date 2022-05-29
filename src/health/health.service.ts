import { Injectable } from '@nestjs/common'
import { HealthDto } from './dto/health.dto'

@Injectable()
export class HealthService {
  async getHealth (): Promise<HealthDto> {
    return {
      subject: '3C-Board',
      uptime: Math.round(process.uptime() * 1000),
      timestamp: Date.now()
    }
  }
}

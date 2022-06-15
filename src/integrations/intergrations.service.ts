import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { request } from 'undici'

type NOTICE_TYPE = 'submitted' | 'accepted' | 'rejected'

@Injectable()
export class IntegrationsService {
  private readonly NOTIFICATION_ENDPOINT: string
  private readonly SERVER_TOKEN: string

  constructor (configService: ConfigService) {
    this.NOTIFICATION_ENDPOINT =
      configService.get<string>(
        'NOTIFICATION_ENDPOINT',
        'https://3c.gbsw.hs.kr/api/noti/v1')

    this.SERVER_TOKEN =
      configService.get<string>(
        'SERVER_TOKEN', '')
  }

  public async sendNotice (type: NOTICE_TYPE, subcategoryId: number, userId: string) {
    const url = `${this.NOTIFICATION_ENDPOINT}/messages`
    const res = await request(url, {
      method: 'POST',
      headers: {
        authorization: `token ${this.SERVER_TOKEN}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        type,
        subcategory: subcategoryId,
        user: userId
      })
    }).then((res) => res.body.json())
      .catch(() => ({ success: false }))

    return res.success
  }
}

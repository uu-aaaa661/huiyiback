import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('ccc')
  @SetMetadata('require-login', true)
  @SetMetadata('require-permission', ['ccc'])
  aaaa() {
      return 'ccc';
  }

  @Get('ddd')
  bbb() {
      return 'ddd';
}
}

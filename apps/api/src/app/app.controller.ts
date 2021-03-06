import { Controller, Get } from '@nestjs/common';

import { Message } from '@poc-nx-deploy/api-interfaces';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getData(): Message {
    return this.appService.getData();
  }

  @Get('hello2')
  getData2(): Message {
    return {
      message: `Hello from getData2, it's ${new Date()}`
    }
  }
}

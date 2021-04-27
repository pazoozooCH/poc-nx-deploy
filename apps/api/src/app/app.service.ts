import { Injectable } from '@nestjs/common';
import { Message } from '@poc-nx-deploy/api-interfaces';

@Injectable()
export class AppService {
  getData(): Message {
    return { message: 'Welcome to api!' };
  }
}

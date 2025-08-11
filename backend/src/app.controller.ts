import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date() };
  }
}


import { Controller, Get } from '@nestjs/common';
import { InitDbService } from './init-db.service';

@Controller('')
export class InitDbController {
  constructor(private initDbService: InitDbService) {}
  @Get()
  init() {
    return new Promise((resolve) => {
      this.initDbService.initAll().then((msg) => {
        resolve({
          msg,
        });
      });
    });
  }
}

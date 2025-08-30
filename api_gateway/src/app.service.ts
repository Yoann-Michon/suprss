import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
   private readonly logger = new Logger(AppService.name);
  constructor(
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
  ) {}

  async login(login: {email: string,password: string}) {
    this.logger.log(`Login attempt for email: ${login}`);
    return await firstValueFrom(this.authServiceClient.send('login', login));
  }

  async register(register:{username:string, email: string, password: string}) {
    this.logger.log(`Register attempt for email: ${register}`);
    return await firstValueFrom(this.authServiceClient.send('register', register));
  }
}

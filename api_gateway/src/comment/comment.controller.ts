import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('comment')
export class CommentController {
    constructor(
            @Inject('MESSENGER_SERVICE') private readonly messengerClient: ClientProxy
        ) { }

}

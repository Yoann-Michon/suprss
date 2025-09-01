import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('feed')
export class FeedController {
    constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy,
        @Inject('FEED_SERVICE') private readonly feedClient: ClientProxy) { }

        // === FEED ===
    @Post()
    async createFeed(@Body() data: { name: string, frequency: string, description: string, tags: string }, @Req() req) {
        const user = await firstValueFrom(this.userClient.send('findUserById', { id: req.user.id }));
        if (!user) {
            throw new Error("User not found");
        }
        data['userId'] = user.id;
        return await firstValueFrom(this.feedClient.send('createFeed', data));
    }

    @Get()
    async getFeeds(@Req() req) {
        const user = await firstValueFrom(this.userClient.send('findUserById', { id: req.user.id }));
        if (!user) {
            throw new Error("User not found");
        }
        return await firstValueFrom(this.feedClient.send('getFeeds', { userId: user.id }));
    }

    @Delete(':feedId')
    async deleteFeed(@Param('feedId') feedId: string, @Req() req: any) {
        const user = await firstValueFrom(this.userClient.send('findUserById', { id: req.user.id }));
        if (!user) {
            throw new Error("User not found");
        }
        return await firstValueFrom(this.feedClient.send('deleteFeed', { feedId: feedId, userId: user.id }));
    }

    @Put()
    async updateFeed(@Body() data: { feedId: string, name?: string, frequency?: string, description?: string, tags?: string }, @Req() req) {
        const user = await firstValueFrom(this.userClient.send('findUserById', { id: req.user.id }));
        if (!user) {
            throw new Error("User not found");
        }
        return await firstValueFrom(this.feedClient.send('updateFeed', { update: data ,userId: user.id}));
    }

    // === ARTICLES ===
    @Get('/articles')
    async getArticlesByFeed(@Body() feedIds: string[]) {
        return await firstValueFrom(this.feedClient.send('getArticlesByFeed', { feedIds }));
    }

    @Put('/articles/read')
    async markArticleAsRead(@Body() articleId: string , @Req() req) {
        const user = await firstValueFrom(this.userClient.send('findUserById', { id: req.user.id }));
        if (!user) {
            throw new Error("User not found");
        }
        return await firstValueFrom(this.feedClient.send('markArticleAsRead', { articleId, userId: req.user.id }));
    }
}

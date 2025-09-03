import { BadRequestException, Body, Controller, Delete, Get, Inject, Logger, Param, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { firstValueFrom } from 'rxjs';
import { CurrentUser, JwtAuthGuard, RolesGuard } from 'utils/utils';
import { UserOwnerGuard } from 'utils/utils/guards/owner.guard';

@Controller('feed')
@UseGuards(JwtAuthGuard, UserOwnerGuard, RolesGuard)
export class FeedController {
    private readonly logger = new Logger(FeedController.name);
    constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy,
        @Inject('FEED_SERVICE') private readonly feedClient: ClientProxy) { }

    // === FEED ===
    @Post()
    async createFeed(@Body() data: { name: string, frequency: string, description: string, tags: string[] }, @CurrentUser('id') userId: string) {
        const user = await firstValueFrom(this.userClient.send('findUserById', userId));
        if (!user) {
            throw new Error("User not found");
        }
        const feedData = {
            ...data,
            userId: user.id
        };
        return await firstValueFrom(this.feedClient.send('createFeed', feedData));
    }

    @Get()
    async getFeeds(@CurrentUser('id') userId: string) {
        const user = await firstValueFrom(this.userClient.send('findUserById', userId));
        if (!user) {
            throw new Error("User not found");
        }
        return await firstValueFrom(this.feedClient.send('getFeeds', user.id));
    }

    @Delete(':feedId')
    async deleteFeed(@Param('feedId') feedId: string, @CurrentUser('id') userId: string) {
        const user = await firstValueFrom(this.userClient.send('findUserById', userId));
        if (!user) {
            throw new Error("User not found");
        }
        return await firstValueFrom(this.feedClient.send('deleteFeed', { feedId, userId: user.id }));
    }

    @Patch(":id")
    async updateFeed(@Param('id') id: string, @Body() data: { name?: string, frequency?: string, description?: string, tags?: string[] }, @CurrentUser('id') userId: string) {
        const user = await firstValueFrom(this.userClient.send('findUserById', userId));
        if (!user) {
            throw new Error("User not found");
        }
        data['id'] = id
        this.logger.log(`updateFeed - Data transmis: ${JSON.stringify(data)}`);
        return await firstValueFrom(this.feedClient.send('updateFeed', { update: data, userId: user.id }));
    }
    @Post('import')
    @UseInterceptors(FileInterceptor('file', {
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            const fileExtRegex = /\.(json|csv|opml|xml)$/i;
            if (fileExtRegex.exec(file.originalname)) {
                cb(null, true);
            } else {
                cb(new BadRequestException('Only JSON, CSV, and OPML files are allowed'), false);
            }
        }
    }))

    async importFeeds(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser('id') userId: string
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const user = await firstValueFrom(this.userClient.send('findUserById', userId));
        if (!user) {
            throw new Error("User not found");
        }

        this.logger.log(`Importing feeds from ${file.originalname} for user ${userId}`);

        try {
            const result = await firstValueFrom(
                this.feedClient.send('importFeeds', {
                    fileBuffer: file.buffer,
                    fileName: file.originalname,
                    userId: user.id
                })
            );

            this.logger.log(`Import completed: ${result.imported}/${result.total} feeds imported`);
            return result;

        } catch (error) {
            this.logger.error(`Import failed: ${error.message}`);
            throw new BadRequestException(`Import failed: ${error.message}`);
        }
    }
    // === ARTICLES ===
    @Post('/articles')
    async getArticlesByFeed(@CurrentUser('id') userId: string) {
        let feedIds = await this.getFeeds(userId);
        if (!feedIds) {
            throw new Error("Feeds not found");
        }
        feedIds = feedIds.map(feed => feed.id);
        return await firstValueFrom(this.feedClient.send('getArticlesByFeed', feedIds));
    }

    @Put('/articles/read')
    async markArticleAsRead(@Body() articleId: string, @CurrentUser('id') userId: string) {
        const user = await firstValueFrom(this.userClient.send('findUserById', userId));
        if (!user) {
            throw new Error("User not found");
        }
        return await firstValueFrom(this.feedClient.send('markArticleAsRead', { articleId, userId: userId }));
    }
}

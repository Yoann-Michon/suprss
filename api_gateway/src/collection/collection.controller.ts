import { Body, Controller, Delete, Get, Inject, Logger, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CurrentUser, JwtAuthGuard, RolesGuard } from 'utils/utils';
import { UserOwnerGuard } from 'utils/utils/guards/owner.guard';
import { CollectionRole } from 'utils/src';

@Controller('collection')
@UseGuards(JwtAuthGuard, UserOwnerGuard, RolesGuard)
export class CollectionController {
    private readonly logger = new Logger(CollectionController.name);

    constructor(
        @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
        @Inject('COLLECTION_SERVICE') private readonly collectionClient: ClientProxy,
    ) { }

    @Post()
    async createCollection(
        @Body() data: {
            name: string;
            articleIds?: string[];
            collaborators?: { userId: string; role: CollectionRole }[];
            description?: string;
            isPrivate?: boolean;
        },
        @CurrentUser('id') userId: string,
    ) {
        const user = await firstValueFrom(
            this.userClient.send('findUserById', userId),
        );

        if (!user) {
            throw new Error('User not found');
        }

        const collectionData = {
            ...data,
            ownerId: user.id,
        };

        return await firstValueFrom(
            this.collectionClient.send('createCollection', collectionData),
        );
    }

    @Get()
    async getAllCollections(@CurrentUser('id') userId: string) {
        const user = await firstValueFrom(this.userClient.send('findUserById', userId));
        if (!user) {
            throw new Error("User not found");
        }

        return await firstValueFrom(this.collectionClient.send('findAllCollection', user.id));
    }

    @Get('owned')
    async getOwnedCollections(@CurrentUser('id') userId: string) {
        const user = await firstValueFrom(this.userClient.send('findUserById', userId));
        if (!user) {
            throw new Error("User not found");
        }

        return await firstValueFrom(this.collectionClient.send('findOwnedCollection', user.id));
    }

    @Get('collaborated')
    async getCollaboratedCollections(@CurrentUser('id') userId: string) {
        const user = await firstValueFrom(this.userClient.send('findUserById', userId));
        if (!user) {
            throw new Error("User not found");
        }

        return await firstValueFrom(this.collectionClient.send('findCollaboratedCollection', user.id));
    }

    @Get(':collectionId')
    async getCollectionById(@Param('collectionId') collectionId: string, @CurrentUser('id') userId: string) {
        const user = await firstValueFrom(this.userClient.send('findUserById', userId));
        if (!user) {
            throw new Error("User not found");
        }

        return await firstValueFrom(this.collectionClient.send('getCollectionById', {
            collectionId,
            userId: user.id
        }));
    }

    @Patch(':collectionId')
    async updateCollection(
        @Param('collectionId') collectionId: string,
        @Body() data: {
            name?: string;
            articleIds?: string[];
            collaborators?: { userId: string; role: CollectionRole }[];
            description?: string;
            isPrivate?: boolean;
        },
        @CurrentUser('id') userId: string,
    ) {
        const user = await firstValueFrom(
            this.userClient.send('findUserById', userId),
        );
        if (!user) {
            throw new Error('User not found');
        }
        this.logger.log(`updateCollection - collectionId: ${collectionId}, body: ${JSON.stringify(data)}`);
        const updateData = {
            ...data,
            id: collectionId
        };

        this.logger.log(
            `updateCollection - Payload transmis: ${JSON.stringify(updateData)}`,
        );

        return await firstValueFrom(
            this.collectionClient.send('updateCollection', {updateData, userId: user.id}),
        );
    }

    @Delete(':collectionId')
    async deleteCollection(@Param('collectionId') collectionId: string, @CurrentUser('id') userId: string) {
        const user = await firstValueFrom(this.userClient.send('findUserById', userId));
        if (!user) {
            throw new Error("User not found");
        }

        return await firstValueFrom(this.collectionClient.send('deleteCollection', {
            collectionId,
            userId: user.id
        }));
    }

    @Post(':collectionId/articles/:articleId')
    async addArticleToCollection(
        @Param('collectionId') collectionId: string,
        @Param('articleId') articleId: string,
        @CurrentUser('id') userId: string
    ) {
        const user = await firstValueFrom(this.userClient.send('findUserById', userId));
        if (!user) {
            throw new Error("User not found");
        }
        this.logger.log(`addArticleToCollection - collectionId: ${collectionId}, articleId: ${articleId}, userId: ${user.id}`);
        return await firstValueFrom(this.collectionClient.send('addArticleCollection', {
            collectionId,
            articleId,
            userId: user.id
        }));
    }

    @Delete(':collectionId/articles/:articleId')
    async removeArticleFromCollection(
        @Param('collectionId') collectionId: string,
        @Param('articleId') articleId: string,
        @CurrentUser('id') userId: string
    ) {
        const user = await firstValueFrom(this.userClient.send('findUserById', userId));
        if (!user) {
            throw new Error("User not found");
        }

        return await firstValueFrom(this.collectionClient.send('removeArticleCollection', {
            collectionId,
            articleId,
            userId: user.id
        }));
    }

    @Post(':collectionId/collaborators')
    async addCollaborator(
        @Param('collectionId') collectionId: string,
        @Body() data: { collaboratorUserId: string; role: CollectionRole },
        @CurrentUser('id') userId: string
    ) {
        const user = await firstValueFrom(this.userClient.send('findUserById', userId));
        if (!user) {
            throw new Error("User not found");
        }

        return await firstValueFrom(this.collectionClient.send('addCollaboratorCollection', {
            collectionId,
            collaboratorUserId: data.collaboratorUserId,
            role: data.role,
            userId: user.id
        }));
    }

    @Delete(':collectionId/collaborators/:collaboratorUserId')
    async removeCollaborator(
        @Param('collectionId') collectionId: string,
        @Param('collaboratorUserId') collaboratorUserId: string,
        @CurrentUser('id') userId: string
    ) {
        const user = await firstValueFrom(this.userClient.send('findUserById', userId));
        if (!user) {
            throw new Error("User not found");
        }

        return await firstValueFrom(this.collectionClient.send('removeCollaboratorCollection', {
            collectionId,
            collaboratorUserId,
            userId: user.id
        }));
    }

    @Get(':collectionId/access')
    async checkCollectionAccess(@Param('collectionId') collectionId: string, @CurrentUser('id') userId: string) {
        const user = await firstValueFrom(this.userClient.send('findUserById', userId));
        if (!user) {
            throw new Error("User not found");
        }

        return await firstValueFrom(this.collectionClient.send('checkAccessCollection', {
            collectionId,
            userId: user.id
        }));
    }
}
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionRole } from 'utils/src';
import { firstValueFrom } from 'rxjs';


@Controller()
export class CollectionController {
  constructor(private readonly collectionService: CollectionService,
    @Inject('MESSENGER_SERVICE') private readonly messengerClient: ClientProxy
  ) {}

  @MessagePattern('createCollection')
  async createCollection(@Payload() createCollectionDto: CreateCollectionDto) {
    try {
      const collection = await this.collectionService.createCollection(createCollectionDto);
      await firstValueFrom(this.messengerClient.emit("createChatroom",collection));
      return collection
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @MessagePattern('findAllCollection')
  async getAllCollections(@Payload() userId:string) {
    try {
      return await this.collectionService.getAllCollections(userId);
    } catch (error) {
      return {
        success: false,
        message: error.message
        
      };
    }
  }

  @MessagePattern('getCollectionById')
  async getCollectionById(@Payload() data:{ collectionId: string; userId: string }) {
    try {
      return await this.collectionService.getCollectionById(data.collectionId, data.userId);
    } catch (error) {
      return {
        success: false,
        message: error.message
        
      };
    }
  }

  @MessagePattern('updateCollection')
  async updateCollection(@Payload() data: { updateData: UpdateCollectionDto; userId: string }) {
    try {
      return await this.collectionService.updateCollection(data.updateData, data.userId);
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @MessagePattern('deleteCollection')
  async deleteCollection(@Payload() data:{ collectionId: string; userId: string }) {
    try {
      await this.collectionService.deleteCollection(data.collectionId, data.userId);
      return {
        success: true,
        message: 'collection.success.deleted'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @MessagePattern('addArticleCollection')
  async addArticleToCollection(@Payload() data:{ collectionId: string; articleId: string; userId: string }) {
    try {
      return await this.collectionService.addArticleToCollection(data.collectionId, data.articleId, data.userId);
    } catch (error) {
      return {
        success: false,
        message: error.message
        
      };
    }
  }

  @MessagePattern('removeArticleCollection')
  async removeArticleFromCollection(@Payload() data:{ collectionId: string; articleId: string; userId: string }) {
    try {
      return await this.collectionService.removeArticleFromCollection(data.collectionId, data.articleId, data.userId);
    } catch (error) {
      return {
        success: false,
        message: error.message
        
      };
    }
  }

  @MessagePattern('addCollaboratorCollection')
  async addCollaborator(@Payload() data:{ collectionId: string; collaboratorUserId: string; role: CollectionRole; userId: string }) {
    try {      
      if (!data.role) {
        return {
          success: false,
          message: 'collection.errors.role_required',
          error: 'BadRequest'
        };
      }

       return await this.collectionService.addCollaborator(
        data.collectionId, 
        data.collaboratorUserId, 
        data.role, 
        data.userId
      );
      
    } catch (error) {
      return {
        success: false,
        message: error.message
        
      };
    }
  }

    @MessagePattern('removeCollaboratorCollection')
  async removeCollaborator(@Payload() payload: { collectionId: string; collaboratorUserId: string; userId: string }) {
    try {
      const { collectionId, collaboratorUserId, userId } = payload;
      const collection = await this.collectionService.removeCollaborator(
        collectionId, 
        collaboratorUserId, 
        userId
      );
      return {
        success: true,
        message: 'collection.success.collaborator_removed',
        data: collection
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @MessagePattern('findOwnedCollection')
  async getOwnedCollections(@Payload() userId: string) {
    try {
      const collections = await this.collectionService.getAllCollections(userId);
      return collections.filter(collection => collection.ownerId === userId);
    } catch (error) {
      return {
        success: false,
        message: error.message
        
      };
    }
  }

  @MessagePattern('findCollaboratedCollection')
  async getCollaboratedCollections(@Payload() userId: string) {
    try {
      const collections = await this.collectionService.getAllCollections(userId);
      return collections.filter(collection => 
        collection.ownerId !== userId && 
        collection.collaborators?.some(collab => collab.userId === userId)
      );
    } catch (error) {
      return {
        success: false,
        message: error.message
        
      };
    }
  }

  @MessagePattern('checkAccessCollection')
  async checkCollectionAccess(@Payload() data:{ collectionId: string; userId: string }) {
    try {
      const collection = await this.collectionService.getCollectionById(data.collectionId, data.userId);
      
      const isOwner = collection.ownerId === data.userId;
      const collaborator = collection.collaborators?.find(collab => collab.userId === data.userId);
      const role = isOwner ? 'OWNER' : collaborator?.role || null;

      return {
        success: true,
        message: 'collection.success.access_checked',
        data: {
          hasAccess: true,
          role: role,
          isOwner: isOwner,
          canWrite: isOwner || collaborator?.role === CollectionRole.MODERATOR,
          canRead: true
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}
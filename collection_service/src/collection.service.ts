import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Collection } from './entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionRole } from 'utils/src';

@Injectable()
export class CollectionService {
  private readonly logger = new Logger(CollectionService.name)
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: MongoRepository<Collection>,
  ) {}

  async createCollection(createCollectionDto: CreateCollectionDto){
    try {
      const existingCollection = await this.collectionRepository.findOne({
        where: { 
          name: createCollectionDto.name, 
          ownerId: createCollectionDto.ownerId 
        }
      });

      if (existingCollection) {
        throw new BadRequestException('collection.errors.name_already_exists');
      }

      const newCollection = this.collectionRepository.create({
        ...createCollectionDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return await this.collectionRepository.save(newCollection);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('collection.errors.creation_failed');
    }
  }
async getAllCollections(userId: string): Promise<Collection[]> {
  if (!userId) {
    throw new BadRequestException('collection.errors.user_id_required');
  }

  try {
    return await this.collectionRepository.find({
      $or: [
        { ownerId: userId },
        { 'collaborators.userId': userId }
      ]
    } as any);
  } catch (error) {
    this.logger.error(`getAllCollections failed: ${error.message}`, error.stack);
    throw new BadRequestException('collection.errors.fetch_failed');
  }
}

async getCollectionById(id: string, userId: string) {
  try {
    const collection = await this.collectionRepository.findOne({
      where: { _id: new ObjectId(id) }
    });

    if (!collection) {
      throw new NotFoundException('collection.errors.not_found');
    }

    if (!this.hasReadAccess(collection, userId)) {
      throw new ForbiddenException('collection.errors.no_read_permission');
    }

    return collection;
  } catch (error) {
    this.logger.error(`getCollectionById failed: ${error.message}`, error.stack);
    throw error instanceof BadRequestException ||
          error instanceof NotFoundException ||
          error instanceof ForbiddenException
      ? error
      : new BadRequestException('collection.errors.fetch_failed');
  }
}

async updateCollection(updateCollectionDto: UpdateCollectionDto, userId: string) {
  try {
    this.logger.log(`Updating collection: ${JSON.stringify(updateCollectionDto)}`);

    const collection = await this.collectionRepository.findOne({
      where: { _id: new ObjectId(updateCollectionDto.id) }
    });

    if (!collection) {
      throw new NotFoundException('collection.errors.not_found');
    }

    if (!this.hasWriteAccess(collection, userId)) {
      throw new ForbiddenException('collection.errors.no_write_permission');
    }

    if (updateCollectionDto.name && updateCollectionDto.name !== collection.name) {
      const existingCollection = await this.collectionRepository.findOne({
        where: {
          name: updateCollectionDto.name,
          ownerId: collection.ownerId,
          id: { $ne: new ObjectId(updateCollectionDto.id) }
        } as any
      });

      if (existingCollection) {
        throw new BadRequestException('collection.errors.name_already_exists');
      }
    }

    const { id, ...updateData } = updateCollectionDto;

    await this.collectionRepository.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );

    return await this.getCollectionById(id, userId);
  } catch (error) {
    this.logger.error(`updateCollection failed: ${error.message}`, error.stack);
    throw error instanceof BadRequestException ||
          error instanceof NotFoundException ||
          error instanceof ForbiddenException
      ? error
      : new BadRequestException('collection.errors.update_failed');
  }
}

async deleteCollection(id: string, userId: string): Promise<void> {
  try {
    const collection = await this.collectionRepository.findOne({
      where: { _id: new ObjectId(id) }
    });

    if (!collection) {
      throw new NotFoundException('collection.errors.not_found');
    }

    if (collection.ownerId !== userId) {
      throw new ForbiddenException('collection.errors.owner_only_delete');
    }

    await this.collectionRepository.deleteOne({ _id: new ObjectId(id) });
  } catch (error) {
    this.logger.error(`deleteCollection failed: ${error.message}`, error.stack);
    throw error instanceof BadRequestException ||
          error instanceof NotFoundException ||
          error instanceof ForbiddenException
      ? error
      : new BadRequestException('collection.errors.delete_failed');
  }
}
async addArticleToCollection(collectionId: string, articleId: string, userId: string) {
  try {
    const collection = await this.collectionRepository.findOne({
      where: { _id: new ObjectId(collectionId) }
    });

    if (!collection) {
      throw new NotFoundException('collection.errors.not_found');
    }

    if (!this.hasWriteAccess(collection, userId)) {
      throw new ForbiddenException('collection.errors.no_write_permission');
    }

    if (collection?.articleIds?.includes(articleId)) {
      throw new BadRequestException('collection.errors.article_already_exists');
    }

    const updatedArticleIds = [...(collection.articleIds || []), articleId];

    await this.collectionRepository.updateOne(
      { _id: new ObjectId(collectionId) },
      { 
        $set: {
          articleIds: updatedArticleIds,
          updatedAt: new Date()
        }
      }
    );

    return await this.getCollectionById(collectionId, userId);
  } catch (error) {
    this.logger.error(`addArticleToCollection failed: ${error.message}`, error.stack);
    throw error;
  }
}

async removeArticleFromCollection(collectionId: string, articleId: string, userId: string) {
  try {
    const collection = await this.collectionRepository.findOne({
      where: { _id: new ObjectId(collectionId) }
    });

    if (!collection) {
      throw new NotFoundException('collection.errors.not_found');
    }

    if (!this.hasWriteAccess(collection, userId)) {
      throw new ForbiddenException('collection.errors.no_write_permission');
    }

    if (!collection?.articleIds?.includes(articleId)) {
      throw new BadRequestException('collection.errors.article_not_found');
    }

    const updatedArticleIds = collection.articleIds.filter(id => id !== articleId);

    await this.collectionRepository.updateOne(
      { _id: new ObjectId(collectionId) },
      { 
        $set: {
          articleIds: updatedArticleIds,
          updatedAt: new Date()
        }
      }
    );

    return await this.getCollectionById(collectionId, userId);
  } catch (error) {
    this.logger.error(`removeArticleFromCollection failed: ${error.message}`, error.stack);
    throw error;
  }
}

async addCollaborator(collectionId: string, collaboratorUserId: string, role: CollectionRole, userId: string) {
  try {
    this.logger.log(`addCollaborator - collectionId: ${collectionId}, collaboratorUserId: ${collaboratorUserId}, role: ${role}, userId: ${userId}`);
    const collection = await this.collectionRepository.findOne({
      where: { _id: new ObjectId(collectionId) }
    });
    if (!collection) {
      throw new NotFoundException('collection.errors.not_found');
    }

    if (collection.ownerId !== userId) {
      throw new ForbiddenException('collection.errors.owner_only_add_collaborator');
    }

    if (collection.collaborators?.some(collab => collab.userId === collaboratorUserId)) {
      throw new BadRequestException('collection.errors.user_already_collaborator');
    }

    if (collaboratorUserId === collection.ownerId) {
      throw new BadRequestException('collection.errors.owner_cannot_be_collaborator');
    }

    const updatedCollaborators = [
      ...(collection.collaborators || []),
      { userId: collaboratorUserId, role }
    ];

    await this.collectionRepository.updateOne(
      { _id: new ObjectId(collectionId) },
      { 
        $set: {
          collaborators: updatedCollaborators,
          updatedAt: new Date()
        }
      }
    );

    return await this.getCollectionById(collectionId, userId);
  } catch (error) {
    this.logger.error(`addCollaborator failed: ${error.message}`, error.stack);
    throw error;
  }
}

async removeCollaborator(collectionId: string, collaboratorUserId: string, userId: string) {
  try {
    const collection = await this.collectionRepository.findOne({
      where: { _id: new ObjectId(collectionId) }
    });

    if (!collection) {
      throw new NotFoundException('collection.errors.not_found');
    }

    if (collection.ownerId !== userId) {
      throw new ForbiddenException('collection.errors.owner_only_remove_collaborator');
    }

    if (!collection.collaborators?.some(collab => collab.userId === collaboratorUserId)) {
      throw new BadRequestException('collection.errors.user_not_collaborator');
    }

    const updatedCollaborators = collection.collaborators.filter(
      collab => collab.userId !== collaboratorUserId
    );

    await this.collectionRepository.updateOne(
      { _id: new ObjectId(collectionId) },
      { 
        $set: {
          collaborators: updatedCollaborators,
          updatedAt: new Date()
        }
      }
    );

    return await this.getCollectionById(collectionId, userId);
  } catch (error) {
    this.logger.error(`removeCollaborator failed: ${error.message}`, error.stack);
    throw error;
  }
}

  private hasReadAccess(collection: Collection, userId: string): boolean {
    return collection.ownerId === userId || 
           (collection.collaborators?.some(collab => collab.userId === userId) ?? false);
  }

  private hasWriteAccess(collection: Collection, userId: string): boolean {
    if (collection.ownerId === userId) {
      return true;
    }

    const collaborator = collection.collaborators?.find(collab => collab.userId === userId);
    return collaborator?.role === CollectionRole.MODERATOR;
  }
}
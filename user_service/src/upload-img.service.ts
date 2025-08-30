import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as FormData from 'form-data';
import fetch from 'node-fetch';

@Injectable()
export class UploadImgService {
  async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
    try {
      
      if (!files || files.length === 0) {
        throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
      }
  
      const uploadedUrls: string[] = [];
  
      for (const file of files) {
        
        const formData = new FormData();
        formData.append('image', file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype
        });
  
        
        const response = await fetch(`${process.env.IMGBB_URL}?key=${process.env.IMGBB_KEY}`, {
          method: 'POST',
          body: formData,
          headers: {
            ...formData.getHeaders()
          }
        });
  
        const data = await response.json() as {
          success: boolean;
          data?: { url: string };
          error?: { message?: string };
        };

        if (!response.ok || !data.success) {
          throw new HttpException(
            data.error?.message || 'Failed to upload image to ImgBB',
            response.status || HttpStatus.BAD_REQUEST
          );
        }

        if (data.data?.url) {
          uploadedUrls.push(data.data.url);
        } else {
          throw new HttpException(
            'No URL returned from ImgBB',
            HttpStatus.BAD_REQUEST
          );
        }
      }
  
      return uploadedUrls;
  
    } catch (error) {
      throw new HttpException(
        error.message || 'Error uploading images',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  
}

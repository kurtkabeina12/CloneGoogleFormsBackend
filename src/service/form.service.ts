/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from 'src/DTO/card.dto';
import { Form } from 'src/DTO/form.dto';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FormsService {
   constructor(
      @InjectRepository(Form)
      private formRepository: Repository<Form>,
      @InjectRepository(Card)
      private cardRepository: Repository<Card>,
   ) { }

   async saveForm(formHead: string, cards: Card[], isMandatoryAuth: boolean, selectedColor:string): Promise<{ formId: string }> {
      console.log(formHead, cards, isMandatoryAuth, 'бекенд');
      const form = new Form();
      form.formHeader = formHead;
      form.isMandatoryAuth = isMandatoryAuth;
      form.selectedColor = selectedColor;
      const savedForm = await this.formRepository.save(form);

      for (const card of cards) {
         card.form = savedForm;
         console.log(card, 'card')
         if (card.addImg) {
            // Сохраняем изображение и получаем путь к нему
            const imagePath = await this.saveImage(card.imageUrl, savedForm.id);
            // Обновляем card.imageUrl с путем к изображению
            card.imageUrl = imagePath;
         }
         await this.cardRepository.save(card);
      }
      return { formId: String(savedForm.id) };
   }

   // Функция для удаления префикса
   async extractBase64String(imageBase64: string) {
      const base64Index = imageBase64.indexOf(';base64,') + 8;
      return imageBase64.substring(base64Index);
   }

   async saveImage(imageBase64: string, formId: string): Promise<string> {
      if (!imageBase64) {
         console.error('Image data is undefined');
         return '';
      }
      const base64String = await this.extractBase64String(imageBase64);
      const imageBuffer = Buffer.from(base64String, 'base64');
      const projectRoot = path.resolve(__dirname, '../../'); 
      const imagePath = path.join(projectRoot, 'UsersImage', `${formId}.png`);
      
      const dir = path.dirname(imagePath);
      if (!fs.existsSync(dir)) {
         fs.mkdirSync(dir, { recursive: true });
      }
   
      try {
         await fs.promises.writeFile(imagePath, imageBuffer);
         return imagePath;
      } catch (error) {
         console.error('Error saving image:', error);
         return '';
      }
   }

   async getFormWithCards(formId: string): Promise<Form> {
      return this.formRepository
         .createQueryBuilder('form')
         .leftJoinAndSelect('form.cards', 'card')
         .where('form.id = :formId', { formId })
         .getOne();
   }
}
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from 'src/DTO/form.dto';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Section } from 'src/DTO/section.dto';
import { Card } from 'src/DTO/card.dto';
import { v4 as uuidv4 } from 'uuid';
import { subQuestions } from 'src/DTO/subQuestion.dto';

@Injectable()
export class FormsService {
   constructor(
      @InjectRepository(Form)
      private formRepository: Repository<Form>,
      @InjectRepository(Section)
      private sectionRepository: Repository<Section>,
      @InjectRepository(Card)
      private cardRepository: Repository<Card>,
      @InjectRepository(subQuestions)
      private subQuestionRepository: Repository<subQuestions>,
   ) { }

   async saveForm(formTitle: string, formOverview: string, formEndText: string, formEndDate: string, formBody: Section[], isMandatoryAuth: boolean, selectedColor: string): Promise<{ formId: string }> {
      const form = new Form();
      form.formTitle = formTitle;
      form.formOverview = formOverview;
      form.formEndText = formEndText;
      form.formEndDate = formEndDate;
      form.isMandatoryAuth = isMandatoryAuth;
      form.selectedColor = selectedColor;
      const savedForm = await this.formRepository.save(form);

      for (const sectionData of formBody) {
         const section = new Section();
         section.title = sectionData.title;
         section.form = savedForm;
         const savedSection = await this.sectionRepository.save(section);
         let currentOrder = 1;

         for (const card of sectionData.cards) {
            card.section = savedSection;
            card.order = currentOrder++;
            if (card.addImg) {
               let imagePaths = [];
               if (Array.isArray(card.imageUrl)) {
                  const imagePathsForCard = await Promise.all(card.imageUrl.map(async (imageBase64) => {
                     return await this.saveImage(imageBase64, savedForm.id);
                  }));
                  imagePaths = imagePathsForCard;
               } else {
                  const imagePath = await this.saveImage(card.imageUrl, savedForm.id);
                  imagePaths.push(imagePath);
               }
               card.imageUrl = imagePaths.join(',');
            }

            const savedCard = await this.cardRepository.save(card);
            let currentSubOrder = 1;

            if (card.subQuestions && card.subQuestions.length > 0) {
               for (const subQuestion of card.subQuestions) {
                  subQuestion.card = savedCard;
                  card.order = currentSubOrder++;
                  if (subQuestion.addImg) {
                     let imagePaths = [];
                     if (Array.isArray(subQuestion.imageUrl)) {
                        const imagePathsForCard = await Promise.all(subQuestion.imageUrl.map(async (imageBase64) => {
                           return await this.saveImage(imageBase64, savedForm.id);
                        }));
                        imagePaths = imagePathsForCard;
                     } else {
                        const imagePath = await this.saveImage(subQuestion.imageUrl, savedForm.id);
                        imagePaths.push(imagePath);
                     }
                     subQuestion.imageUrl = imagePaths.join(',');
                  }
                  await this.subQuestionRepository.save(subQuestion);
               }
            }
         }
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
      const uniqueId = uuidv4();
      const imagePath = path.join(projectRoot, 'UsersImage', `${formId}_${uniqueId}.png`);

      const dir = path.dirname(imagePath);
      console.log('Saving image to:', imagePath);
      if (!fs.existsSync(dir)) {
         console.log('Creating directory:', dir);
         fs.mkdirSync(dir, { recursive: true });
      }
      try {
         await fs.promises.writeFile(imagePath, imageBuffer);
         console.log('Image saved successfully:', imagePath);
         return imagePath;
      } catch (error) {
         console.error('Error saving image:', error);
         return '';
      }

   }


   async getFormWithCards(formId: string): Promise<Form> {
      const form = await this.formRepository
         .createQueryBuilder('form')
         .leftJoinAndSelect('form.sections', 'section')
         .leftJoinAndSelect('section.cards', 'card')
         .leftJoinAndSelect('card.subQuestions', 'subQuestion')
         .where('form.id = :formId', { formId })
         .orderBy('card.order', 'ASC')
         .orderBy('subQuestion.order', 'ASC')
         .getOne();

      if (!form) {
         throw new Error('Form not found');
      }

      return form;
   }


}
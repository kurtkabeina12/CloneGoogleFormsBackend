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
   async saveForm(
      formTitle: string,
      formOverview: string,
      formEndText: string,
      formEndDate: string,
      formBody: Section[],
      isMandatoryAuth: boolean,
      selectedColor: string
   ): Promise<{ formId: string }> {
      const form = new Form();
      form.formTitle = this.escapeCommas(formTitle);
      form.formOverview = this.escapeCommas(formOverview);
      form.formEndText = this.escapeCommas(formEndText);
      form.formEndDate = formEndDate; // Assuming this doesn't need escaping
      form.isMandatoryAuth = isMandatoryAuth;
      form.selectedColor = selectedColor;

      const savedForm = await this.formRepository.save(form);
      let currentSectionOrder = 1;

      for (const sectionData of formBody) {
         const section = new Section();
         section.title = this.escapeCommas(sectionData.title);
         section.form = savedForm;
         section.order = currentSectionOrder++;
         const savedSection = await this.sectionRepository.save(section);
         let currentOrder = 1;

         for (const card of sectionData.cards) {
            card.section = savedSection;
            card.order = currentOrder++;
            console.log(card)
            if (card.selectedComponent !== "Slider") {
               if (Array.isArray(card.answer)) {
                  card.answer = card.answer.map(answer => this.escapeCommas(answer.trim())).filter(answer => answer !== '');
               } else if (typeof card.answer === 'string') {
                  card.answer = this.escapeCommas(card.answer).split(',').map(answer => answer.trim()).filter(answer => answer !== '');
               }
            }
            // Handle images
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
                  subQuestion.order = currentSubOrder++;

                  if (subQuestion.selectedComponent !== "Slider") {
                     if (Array.isArray(subQuestion.answer)) {
                        subQuestion.answer = subQuestion.answer.map(answer => this.escapeCommas(answer.trim())).filter(answer => answer !== '');
                     } else if (typeof subQuestion.answer === 'string') {
                        subQuestion.answer = this.escapeCommas(subQuestion.answer).split(',').map(answer => answer.trim()).filter(answer => answer !== '');
                     }
                  }

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

   // Helper method to escape commas
   private escapeCommas(value: string): string {
      return value.replace(/,/g, '{comma}');
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
         .getMany();

      if (!form || !form.length) {
         throw new Error('Form not found');
      }

      // Sort sections, cards, and subQuestions
      form[0].sections.sort((a, b) => a.order - b.order);
      form[0].sections.forEach(section => {
         section.cards.sort((a, b) => a.order - b.order);
         section.cards.forEach(card => {
            card.subQuestions.sort((a, b) => a.order - b.order);

            // Unescape answers for the main card
            if (Array.isArray(card.answer)) {
               card.answer = card.answer.map(answer => this.unescapeCommas(answer));
            } else if (typeof card.answer === 'string') {
               card.answer = this.unescapeCommas(card.answer);
            }

            // Unescape answers for subQuestions
            card.subQuestions.forEach(subQuestion => {
               if (Array.isArray(subQuestion.answer)) {
                  subQuestion.answer = subQuestion.answer.map(answer => this.unescapeCommas(answer));
               } else if (typeof subQuestion.answer === 'string') {
                  subQuestion.answer = this.unescapeCommas(subQuestion.answer);
               }
            });
         });
      });

      // Unescape other fields
      form[0].formTitle = this.unescapeCommas(form[0].formTitle);
      form[0].formOverview = this.unescapeCommas(form[0].formOverview);
      form[0].formEndText = this.unescapeCommas(form[0].formEndText);
      console.log(form[0]);
      return form[0];
   }

   // Helper method to unescape commas
   private unescapeCommas(value: string): string {
      return value.replace(/{comma}/g, ',');
   }

}
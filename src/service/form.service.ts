/* eslint-disable prettier/prettier */
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from 'src/DTO/card.dto';
import { Form } from 'src/DTO/form.dto';
import { Repository } from 'typeorm';
import { QuestionsService } from './question.service';
import { Questions } from 'src/DTO/questions.dto';

@Injectable()
export class FormsService {
   constructor(
      @InjectRepository(Form)
      private formRepository: Repository<Form>,
      @InjectRepository(Card)
      private cardRepository: Repository<Card>,
      @Inject(forwardRef(() => QuestionsService))
      private questionsService: QuestionsService,
   ) { }

   async saveForm(formHead: string, cards: Card[], isMandatoryAuth: boolean,): Promise<{ formId: number }> {
      const form = new Form();
      form.formHeader = formHead;
      form.isMandatoryAuth = isMandatoryAuth;
      const savedForm = await this.formRepository.save(form);

      for (const card of cards) {
         card.form = savedForm;
         await this.cardRepository.save(card);
      }
      
      const questions = cards.map(card => {
         const question = new Questions(); 
         question.question = card.question;
         question.idForm = String(savedForm.id);
         return question;
      });

      // Сохранение вопросов
      await this.questionsService.saveQuestions(questions);

      return { formId: savedForm.id };
   }

   async getFormWithCards(formId: number): Promise<Form> {
      return this.formRepository
         .createQueryBuilder('form')
         .leftJoinAndSelect('form.cards', 'card')
         .where('form.id = :formId', { formId })
         .getOne();
   }
}

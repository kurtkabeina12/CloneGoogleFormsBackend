/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from 'src/DTO/card.dto';
import { Form } from 'src/DTO/form.dto';
import { Repository } from 'typeorm';

@Injectable()
export class FormsService {
   constructor(
      @InjectRepository(Form)
      private formRepository: Repository<Form>,
      @InjectRepository(Card)
      private cardRepository: Repository<Card>,
   ) { }

   async saveForm(formHead: string, cards: Card[], isMandatoryAuth:boolean,): Promise<{ formId: string }> {
      const form = new Form();
      form.formHeader = formHead;
      form.isMandatoryAuth = isMandatoryAuth;
      const savedForm = await this.formRepository.save(form);

      for (const card of cards) {
         card.form = savedForm;
         await this.cardRepository.save(card);
      }
      return { formId: String(savedForm.id) };
   }

   async getFormWithCards(formId: string): Promise<Form> {
      return this.formRepository
         .createQueryBuilder('form')
         .leftJoinAndSelect('form.cards', 'card')
         .where('form.id = :formId', { formId })
         .getOne();
   }
}

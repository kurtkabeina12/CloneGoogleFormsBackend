/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Card } from 'src/DTO/card.dto';
import { Form } from 'src/DTO/form.dto';
import { FormsService } from 'src/service/form.service';

@ApiTags('forms')
@Controller('forms')
export class FormsController {
   constructor(private readonly formsService: FormsService) { }

   @Post()
   @ApiBody({ type: [Card] })
   async saveForm(@Body() body: { formHead: string, formBody: Card[] }): Promise<any> {
      const { formHead, formBody } = body;
      const formId = await this.formsService.saveForm(formHead, formBody);
      return { formId };
   }

   @Get(':id')
   async getForm(@Param('id') formId: number): Promise<Form> {
      return this.formsService.getFormWithCards(formId);
   }

}

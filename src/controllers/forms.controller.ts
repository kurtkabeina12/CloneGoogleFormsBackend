/* eslint-disable prettier/prettier */
import { Controller, Post, Body, } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Card } from 'src/DTO/card.dto';
import { Section } from 'src/DTO/section.dto';
import { FormsService } from 'src/service/form.service';

@ApiTags('forms')
@Controller('forms')
export class FormsController {
   constructor(private readonly formsService: FormsService) { }

   @Post()
   @ApiBody({ type: [Card] })
   async saveForm(@Body() body: { formTitle: string, formOverview: string, formEndText: string, formEndDate:string, formBody: Section[], isMandatoryAuth: boolean, selectedColor:string }): Promise<any> {
      const { formTitle, formOverview, formEndText, formEndDate, formBody, isMandatoryAuth, selectedColor } = body;
      console.log(body)
      const formId = await this.formsService.saveForm( formTitle, formOverview, formEndText, formEndDate, formBody, isMandatoryAuth, selectedColor );
      return { formId };
   }

   // @Get(':id')
   // async getForm(@Param('id') formId: string): Promise<Form> {
   //    return this.formsService.getFormWithCards(formId);
   // }

}

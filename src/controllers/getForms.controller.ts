/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FormReportDTO } from "src/DTO/formReport.dto";
import { getFormsService } from "src/service/getForms.service";

@ApiTags('getForms')
@Controller('getForms')
export class getFormsController{
    constructor(private readonly formsService: getFormsService) { }

    @Post()
    async getAllForms(){
        return this.formsService.getAllForms();
    }

    @Get(':id')
    async getForm(@Param('id') formId: string): Promise<FormReportDTO> {
       return this.formsService.getFormReport(formId);
    }
}
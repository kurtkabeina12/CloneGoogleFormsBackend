/* eslint-disable prettier/prettier */

import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FormReportDTO } from "src/DTO/formReport.dto";
import { getFormReportService } from "src/service/getFormReport.service";

@ApiTags('getFormReport')
@Controller('getFormReport')

export class getFormReportController{
    constructor(private readonly formReportService: getFormReportService) { }
    @Get(':id')
    async getForm(@Param('id') formId: string): Promise<FormReportDTO> {
       return this.formReportService.getFormReport(formId);
    }
}
/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Form } from "src/DTO/form.dto";
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
    async getFormInfo(@Param('id') formId: string): Promise<Form>{
        return this.formsService.getFormInfo(formId);
    }
}


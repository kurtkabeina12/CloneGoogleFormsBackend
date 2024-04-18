/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { getFormsDataService } from "src/service/getFormData.service";

@ApiTags('FormData')
@Controller('FormData')
export class getFormDataController {
    constructor(private readonly formsDataService: getFormsDataService) { }

    @Post()
    async handleFormData(@Body() body: any) {
        console.log(body, 'Received form data');
        const formData = body.formData;
        const { registerPhone } = formData;
        const formId = body.formId;
        await this.formsDataService.savePhoneNumber(registerPhone);
        await this.formsDataService.saveAnswers(formData, formId);
        return { message: 'Data received successfully' };
    }
 
}

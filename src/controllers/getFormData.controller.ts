/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { Form } from "src/DTO/form.dto";
import { getFormsDataService } from "src/service/getFormData.service";

@ApiTags('FormData')
@Controller('FormData')
export class getFormDataController {
    constructor(private readonly formsDataService: getFormsDataService) { }

    @Post()
    @ApiBody({type: [Form]})
    async handleFormData(@Body() body: any) {
        console.log(body, 'Received form data');
        const formData = body.formData;
        const formId = body.formId;
        await this.formsDataService.saveAnswers(formData, formId);
        // await this.formsDataService.getUserQuestionsAndAnswers(1);
        return { message: 'Data received successfully' };
    }
}

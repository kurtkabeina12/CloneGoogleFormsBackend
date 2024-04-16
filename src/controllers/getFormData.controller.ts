/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('FormData')
@Controller('FormData')
export class getFormDataController {
    @Post()
    async handleFormData(@Body() formData: any) {
        console.log(formData, 'Received form data');
        return { message: 'Data received successfully' };
    }
    
}

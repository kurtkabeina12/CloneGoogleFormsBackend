/* eslint-disable prettier/prettier */
import { Controller, Get, Param} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Test } from "src/DTO/test.dto";
import { getTestsService } from "src/service/getTests.service";

@ApiTags('getTests')
@Controller('getTests')
export class getTestsController{
    constructor(private readonly testsService: getTestsService) { }

    // @Post()
    // async getAllForms(){
    //     return this.formsService.getAllForms();
    // }

    @Get(':id')
    async getTestInfo(@Param('id') testId: string): Promise<Test>{
        return this.testsService.getTestInfo(testId);
    }
}


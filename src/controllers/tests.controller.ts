/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CardTest } from 'src/DTO/cardTest.dto';
import { SectionTest } from 'src/DTO/sectionTest.dto';
import { Test } from 'src/DTO/test.dto';
import { TestsService } from 'src/service/test.service';

@ApiTags('tests')
@Controller('tests')
export class TestsController {
   constructor(private readonly testsService: TestsService) { }

   @Post()
   @ApiBody({ type: [CardTest] })
   async saveTest(@Body() body: { testTitle: string, testOverview: string, testEndText: string, testEndDate:string, testBody: SectionTest[], isMandatoryAuth: boolean, selectedColor:string }): Promise<any> {
      const { testTitle, testOverview, testEndText, testEndDate, testBody, isMandatoryAuth, selectedColor } = body;
      console.log(body)
      const testId = await this.testsService.saveTest(testTitle, testOverview, testEndText, testEndDate, testBody, isMandatoryAuth, selectedColor );
      return { testId };
   }

   @Get(':id')
   async getTest(@Param('id') testId: string): Promise<Test> {
      return this.testsService.getTest(testId);
   }

}

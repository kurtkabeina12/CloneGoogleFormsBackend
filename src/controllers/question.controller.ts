/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { Questions } from 'src/DTO/questions.dto';
import { QuestionsService } from 'src/service/question.service';

@Controller('questions')
export class QuestionsController {
 constructor(private readonly questionsService: QuestionsService) {}

 @Post()
 async saveQuestions(@Body() questions: Questions[]): Promise<void> {
    await this.questionsService.saveQuestions(questions);
 }
}

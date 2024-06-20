/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsService } from './service/form.service';
import { Card } from './DTO/card.dto';
import { FormsController } from './controllers/forms.controller';
import { Form } from './DTO/form.dto';
import { Answers } from './DTO/answers.dto';
import { Users } from './DTO/users.dto';
import { getFormDataController } from './controllers/getFormData.controller';
import { getFormsDataService } from './service/getFormData.service';
import { getFormsController } from './controllers/getForms.controller';
import { getFormsService } from './service/getForms.service';
import { Section } from './DTO/section.dto';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { subQuestions } from './DTO/subQuestion.dto';
import { getFormReportService } from './service/getFormReport.service';
import { getFormReportController } from './controllers/getFormReport.controller';
import { FormReportDTO } from './DTO/formReport.dto';
import { Test } from './DTO/test.dto';
import { SectionTest } from './DTO/sectionTest.dto';
import { CardTest } from './DTO/cardTest.dto';
import { subQuestionsTest } from './DTO/subQuestionTest.dto';
import { AnswersTest } from './DTO/answertsTest.dto';
import { TestsController } from './controllers/tests.controller';
import { TestsService } from './service/test.service';

@Module({
 imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5000,
      password: '122712',
      username: 'postgres',
      entities: [Card, Section, subQuestions, Form, Answers, Users, FormReportDTO, Test, SectionTest, CardTest, subQuestionsTest, AnswersTest], 
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Card, Section, subQuestions, Form, Answers, Users, FormReportDTO, Test, SectionTest, CardTest, subQuestionsTest, AnswersTest]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'UsersImage'),
      serveRoot: '/UsersImage',
    }),
 ],
 controllers: [FormsController, getFormDataController, getFormsController, getFormReportController, TestsController],
 providers: [FormsService, getFormsDataService, getFormsService, getFormReportService, TestsService],
})
export class AppModule {}

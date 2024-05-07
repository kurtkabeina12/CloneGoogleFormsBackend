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

@Module({
 imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5000,
      password: '122712',
      username: 'postgres',
      entities: [Card, Section, subQuestions, Form, Answers, Users], 
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Card, Section, subQuestions, Form, Answers, Users]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'UsersImage'),
      serveRoot: '/UsersImage',
    }),
 ],
 controllers: [FormsController, getFormDataController, getFormsController],
 providers: [FormsService, getFormsDataService, getFormsService],
})
export class AppModule {}

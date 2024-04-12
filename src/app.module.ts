/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsService } from './service/form.service';
import { Card } from './DTO/card.dto';
import { FormsController } from './controllers/forms.controller';
import { Form } from './DTO/form.dto';
import { Questions } from './DTO/questions.dto';
import { Answers } from './DTO/answers.dto';
import { Users } from './DTO/users.dto';
import { QuestionsController } from './controllers/question.controller';
import { QuestionsService } from './service/question.service';

@Module({
 imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5000,
      password: '122712',
      username: 'postgres',
      entities: [Card, Form, Questions, Answers, Users], 
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Card, Form, Questions, Answers, Users]), 
 ],
 controllers: [FormsController, QuestionsController],
 providers: [FormsService, QuestionsService],
})
export class AppModule {}

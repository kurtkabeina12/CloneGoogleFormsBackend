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

@Module({
 imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5000,
      password: '122712',
      username: 'postgres',
      entities: [Card, Form, Answers, Users], 
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Card, Form, Answers, Users]), 
 ],
 controllers: [FormsController, getFormDataController, getFormsController],
 providers: [FormsService, getFormsDataService, getFormsService],
})
export class AppModule {}

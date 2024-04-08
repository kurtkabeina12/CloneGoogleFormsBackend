/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsService } from './service/form.service';
import { Card } from './DTO/card.dto';
import { FormsController } from './controllers/forms.controller';
import { Form } from './DTO/form.dto';

@Module({
 imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5000,
      password: '122712',
      username: 'postgres',
      entities: [Card, Form], 
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Card, Form]), 
 ],
 controllers: [FormsController],
 providers: [FormsService],
})
export class AppModule {}

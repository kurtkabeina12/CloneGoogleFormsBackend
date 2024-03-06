import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsService } from './service/card.service';
import { Card } from './DTO/card.dto';
import { CardsController } from './controllers/cards.controller';

@Module({
 imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5000, 
      password: '122712',
      username: 'postgres',
      entities: [Card],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Card]),
 ],
 controllers: [CardsController],
 providers: [CardsService], 
})
export class AppModule {}

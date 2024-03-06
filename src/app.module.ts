import { Module } from '@nestjs/common';
import { CardsController } from './controllers/cards.controller';

@Module({
 imports: [],
 controllers: [CardsController],
 providers: [],
})
export class AppModule {}

import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Card } from '../DTO/card.dto';
import { CardsService } from 'src/service/card.service';

@Controller('cards')
export class CardsController {
 constructor(private readonly cardsService: CardsService) {}

 @Post()
 @ApiBody({ type: [Card] })
 async sendCards(@Body() cards: Card[]): Promise<any> {
    const savedCards = await this.cardsService.saveCards(cards);
    return { cards: savedCards };
 }
}

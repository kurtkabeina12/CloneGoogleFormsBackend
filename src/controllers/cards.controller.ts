import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Card } from '../DTO/card.dto';

@Controller('cards')
export class CardsController {
 @Post()
 @ApiBody({ type: [Card] })
 async sendCards(@Body() cards: Card[]): Promise<any> {
    console.log(cards);
    return { cards };
 }
}


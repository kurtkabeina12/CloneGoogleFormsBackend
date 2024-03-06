import { Controller, Post, Body } from '@nestjs/common';
import { Card } from '../DTO/card.dto';

@Controller('cards')
export class CardsController {
 @Post()
 async sendCards(@Body() cards: Card[]): Promise<any> {
    console.log(cards);
    return { message: `${cards}` };
 }
}

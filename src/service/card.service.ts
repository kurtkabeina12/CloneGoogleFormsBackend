import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from 'src/DTO/card.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CardsService {
 constructor(
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
 ) {}

 async saveCards(cards: Card[]): Promise<Card[]> {
    return this.cardsRepository.save(cards);
 }
}

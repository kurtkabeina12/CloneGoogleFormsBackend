/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Card } from './card.dto';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Form {
 @PrimaryGeneratedColumn('uuid')
 id: number;

 @Column()
 @ApiProperty()
 formHeader: string;

 @OneToMany(() => Card, card => card.form)
 @ApiProperty()
 cards: Card[];
}

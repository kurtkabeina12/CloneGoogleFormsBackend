/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Card } from './card.dto';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Form {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 @ApiProperty()
 formHeader: string;

 @Column()
 @ApiProperty()
 isMandatoryAuth: boolean;

 @OneToMany(() => Card, card => card.form)
 @ApiProperty()
 cards: Card[];
}

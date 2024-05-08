/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Answers } from './answers.dto';
import { Card } from './card.dto';

export enum ComponentType {
   Input = 'Input',
   Radio = 'Radio',
   Textarea = 'Textarea',
   Checkbox = 'Checkbox',
   Slider = 'Slider',
   Data = 'Data',
}

@Entity()
export class subQuestions {

   @PrimaryGeneratedColumn('uuid')
   idSubQuestion: string

   @Column({
      type: 'enum',
      enum: ComponentType,
   })
   @ApiProperty({
      enum: ComponentType,
      enumName: 'ComponentType',
      example: Object.values(ComponentType),
   })
   selectedComponent: ComponentType;

   @Column()
   @ApiProperty()
   question: string;

   @Column({
      type: 'simple-array',
   })
   @ApiProperty({ oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] })
   answer: string | string[];

   @Column({ default: false })
   @ApiProperty()
   isRequired: boolean;

   @Column({ default: false })
   @ApiProperty()
   addLogic: boolean;

   @Column({
      type: 'simple-array',
   })
   @ApiProperty({ oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] })
   Logic: string | string[];

   @Column({ default: false})
   @ApiProperty()
   addImg: boolean;

   @Column('json', { nullable: true })
   imageUrl: string | string[];

   @Column({ default: false})
   @ApiProperty()
   addChangeCardsLogic: boolean;
   
   @Column({ type: 'int', nullable: true })
   order: number;

   @Column()
   @ApiProperty()
   subQuestions: string;

   @ManyToOne(() => Card, card => card.subQuestions)
   card: Card;

   // In Card entity
   @OneToMany(() => Answers, answers => answers.subQuestion)
   answers: Answers[];

}

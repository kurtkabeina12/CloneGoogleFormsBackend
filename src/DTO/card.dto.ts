/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Form } from './form.dto';
import { Answers } from './answers.dto';

export enum ComponentType {
   Input = 'Input',
   Radio = 'Radio',
   Textarea = 'Textarea',
   Checkbox = 'Checkbox',
   Slider = 'Slider',
   Data = 'Data',
}

@Entity()
export class Card {

   @PrimaryGeneratedColumn('uuid')
   idQuestion: string

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

   @Column()
   @ApiProperty({ oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] })
   imageUrl: string ;

   @ManyToOne(() => Form, form => form.cards)
   @ApiProperty()
   form: Form;

   // In Card entity
   @OneToMany(() => Answers, answers => answers.card)
   answers: Answers[];

}

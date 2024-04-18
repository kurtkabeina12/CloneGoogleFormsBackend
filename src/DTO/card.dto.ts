/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Form } from './form.dto';

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

   @ManyToOne(() => Form, form => form.cards)
   @ApiProperty()
   form: Form;

}

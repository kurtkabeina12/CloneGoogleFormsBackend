/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CardTest } from './cardTest.dto';
import { AnswersTest } from './answertsTest.dto';

export enum ComponentType {
   Input = 'Input',
   Radio = 'Radio',
   Textarea = 'Textarea',
   Checkbox = 'Checkbox',
   Slider = 'Slider',
   Data = 'Data',
}

@Entity()
export class subQuestionsTest {

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

   @Column({ default: false})
   @ApiProperty()
   addImg: boolean;

   @Column('json', { nullable: true })
   imageUrl: string | string[];

   @Column({ default: false})
   @ApiProperty()
   addChangeCardsLogic: boolean;
   
   @Column({ type: 'integer', nullable: true })
   @ApiProperty({ type: 'integer' })
   points: number;

   @Column({
       type: 'simple-array',
   })
   @ApiProperty({ oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] })
   correctAnswer: string | string[];
   
   @Column({ type: 'int', nullable: true })
   order: number;

   @Column()
   @ApiProperty()
   subQuestions: string;

   @ManyToOne(() => CardTest, card => card.subQuestions)
   card: CardTest;

   @OneToMany(() => AnswersTest, answers => answers.subQuestion)
   answers: AnswersTest[];

}

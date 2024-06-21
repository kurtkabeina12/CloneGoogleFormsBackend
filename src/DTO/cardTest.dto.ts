/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SectionTest } from './sectionTest.dto';
import { subQuestionsTest } from './subQuestionTest.dto';
import { AnswersTest } from './answertsTest.dto';
import { checkPointsTest } from './checkPointsTest.dto';

export enum ComponentType {
    Input = 'Input',
    Radio = 'Radio',
    Textarea = 'Textarea',
    Checkbox = 'Checkbox',
    Slider = 'Slider',
    Data = 'Data',
}

@Entity()
export class CardTest {

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
    addImg: boolean;

    @Column('json', { nullable: true })
    imageUrl: string | string[];

    @Column({ default: false })
    @ApiProperty()
    addChangeCardsLogic: boolean;

    @Column({
        type: 'simple-array',
    })
    @ApiProperty({ oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] })
    changeCardsLogic: string | string[];

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

    @ManyToOne(() => SectionTest, section => section.cards)
    section: SectionTest;

    @OneToMany(() => subQuestionsTest, subQuestion => subQuestion.card)
    subQuestions: subQuestionsTest[];

    // In Card entity
    @OneToMany(() => AnswersTest, answers => answers.card)
    answers: AnswersTest[];

    // In Card entity
    @OneToMany(() => checkPointsTest, checkPointTest => checkPointTest.card)
    checkpointTest: checkPointsTest[];

}

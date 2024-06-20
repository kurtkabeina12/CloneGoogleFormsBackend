/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Users } from "./users.dto";
import { CardTest } from "./cardTest.dto";
import { subQuestionsTest } from "./subQuestionTest.dto";

@Entity()
export class AnswersTest {

    @PrimaryGeneratedColumn()
    idAnswer: number;

    @Column({ nullable: true })
    @ApiProperty()
    phoneNumber: string;

    @Column()
    @ApiProperty()
    idTest: string;

    @Column({nullable: true})
    @ApiProperty()
    idQuestion: string;

    @Column({nullable: true})
    @ApiProperty()
    idSubQuestion: string;

    // Отношение к Users
    @ManyToOne(() => Users, user => user.answers, {
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: Users;

    // In Answers entity
    @ManyToOne(() => CardTest, card => card.answers)
    @JoinColumn({ name: 'idQuestion' }) 
    card: CardTest;

    // In subQuestion entity
    @ManyToOne(() => subQuestionsTest, subQuestion => subQuestion.answers)
    @JoinColumn({ name: 'idSubQuestion' }) 
    subQuestion: subQuestionsTest;

    @Column('simple-array')
    @ApiProperty({ type: () => [String] })
    answers: string | string[];
}

/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Users } from "./users.dto";
import { CardTest } from "./cardTest.dto";
import { subQuestionsTest } from "./subQuestionTest.dto";

@Entity()
export class checkPointsTest {

    @PrimaryGeneratedColumn()
    order: number;

    @Column({ nullable: true })
    @ApiProperty()
    userEmail: string;

    @Column()
    @ApiProperty()
    idTest: string;

    @Column({ nullable: true })
    @ApiProperty()
    idQuestion: string;

    @Column({ nullable: true })
    @ApiProperty()
    idSubQuestion: string;

    @Column('simple-array')
    @ApiProperty({ type: () => [String] })
    answers: string | string[];

    @Column()
    @ApiProperty()
    totalPoints: number;

    // Отношение к Users
    @ManyToOne(() => Users, user => user.answers, {
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: Users;

    // In Answers entity
    @ManyToOne(() => CardTest, card => card.checkpointTest)
    @JoinColumn({ name: 'idQuestion' })
    card: CardTest;

    // In subQuestion entity
    @ManyToOne(() => subQuestionsTest, subQuestion => subQuestion.checkpointTest)
    @JoinColumn({ name: 'idSubQuestion' })
    subQuestion: subQuestionsTest;
}

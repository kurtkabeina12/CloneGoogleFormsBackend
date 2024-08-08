/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Users } from "./users.dto";
import { CardTest } from "./cardTest.dto";
import { subQuestionsTest } from "./subQuestionTest.dto";
import { UsersEmails } from "./usersEmail.dto";

@Entity()
export class checkPointsTest {

    @PrimaryGeneratedColumn()
    order: number;

    @Column({})
    @ApiProperty()
    userId: string;

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
    correctAnswers: string | string[];
    
    @Column('simple-array')
    @ApiProperty({ type: () => [String] })
    UserAnswers: string | string[];

    @Column()
    @ApiProperty()
    correctPoints: number;

    @Column()
    @ApiProperty()
    UserPoints: number;
    
    // Отношение к Users
    @ManyToOne(() => Users, user => user.answers, {
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: Users;

    // Отношение к UsersEmail
    @ManyToOne(() => UsersEmails, user => user.id, {
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    UserId: Users;

    // In Answers entity
    @ManyToOne(() => CardTest, card => card.checkpointTest)
    @JoinColumn({ name: 'idQuestion' })
    card: CardTest;

    // In subQuestion entity
    @ManyToOne(() => subQuestionsTest, subQuestion => subQuestion.checkpointTest)
    @JoinColumn({ name: 'idSubQuestion' })
    subQuestion: subQuestionsTest;
}

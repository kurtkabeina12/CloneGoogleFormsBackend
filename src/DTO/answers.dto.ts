/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Users } from "./users.dto";
import { Card } from "./card.dto";
import { subQuestions } from "./subQuestion.dto";

@Entity()
export class Answers {

    @PrimaryGeneratedColumn()
    idAnswer: number;

    @Column({ nullable: true })
    @ApiProperty()
    phoneNumber: string;

    @Column()
    @ApiProperty()
    idForm: string;

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
    @ManyToOne(() => Card, card => card.answers)
    @JoinColumn({ name: 'idQuestion' }) 
    card: Card;

    // In subQuestion entity
    @ManyToOne(() => subQuestions, subQuestion => subQuestion.answers)
    @JoinColumn({ name: 'idSubQuestion' }) 
    subQuestion: subQuestions;

    @Column('simple-array')
    @ApiProperty({ type: () => [String] })
    answers: string | string[];
}

/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Users } from "./users.dto";
import { Questions } from "./questions.dto";

@Entity()
export class Answers {

    @PrimaryGeneratedColumn()
    idAnswer: number;

    @Column()
    @ApiProperty()
    phoneNumber: string;

    @Column()
    @ApiProperty()
    idQuestion: string;

    @Column()
    @ApiProperty()
    idForm: string;

    // Отношение к Users
    @ManyToOne(() => Users, user => user.answers)
    user: Users;

    // Отношение к Questions
    @ManyToOne(() => Questions, question => question.answers)
    question: Questions;

    @Column('simple-array')
    @ApiProperty({ type: () => [String] })
    answers: string | string[];
}

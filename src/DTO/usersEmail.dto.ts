/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AnswersTest } from "./answertsTest.dto";

@Entity()
export class UsersEmails {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @ApiProperty()
    registerEmail: string;

    // Отношение к ответам
    @OneToMany(() => AnswersTest, answer => answer.userEmail)
    answers: AnswersTest[];


}
/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AnswersTest } from "./answertsTest.dto";
import { checkPointsTest } from "./checkPointsTest.dto";

@Entity()
export class UsersEmails {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @ApiProperty()
    registerEmail: string;

    // Отношение к ответам
    @OneToMany(() => AnswersTest, answer => answer.userEmail)
    answers: AnswersTest[];

    // Отношение к ответам
    @OneToMany(() => checkPointsTest, users => users.userId)
    userId: UsersEmails[];
    

}
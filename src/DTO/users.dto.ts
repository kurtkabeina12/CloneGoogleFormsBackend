/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Answers } from "./answers.dto";

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @ApiProperty()
    phoneNumber: string;

    // Отношение к ответам
    @OneToMany(() => Answers, answer => answer.user)
    answers: Answers[];

}
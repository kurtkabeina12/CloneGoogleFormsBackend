/* eslint-disable prettier/prettier */
import { Entity,   PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Answers {

    @PrimaryGeneratedColumn()
    idAnswer: number;
}

/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Answers } from "./answers.dto";

@Entity()
export class Questions {
  @PrimaryGeneratedColumn('uuid')
  idQuestion: string;

  @Column()
  question: string;

  @Column()
  idForm: string;

  // Отношение к ответам
  @OneToMany(() => Answers, answer => answer.question)
  answers: Answers[];
}

/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Questions {
 @PrimaryGeneratedColumn('uuid')
 idQuestion: string;

 @Column()
 question: string;

 @Column()
 idForm: string;
}

/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Form } from "./form.dto";
import { Questions } from "./questions.dto";


@Entity()
export class Answers {

    @PrimaryGeneratedColumn()
    idAnswer: number;

    @Column()
    @OneToMany(() => Questions, quest => quest.idQuestion)
    @ApiProperty()
    idQuestion: Questions

    @Column()
    @OneToMany(() => Form, form => form.id)
    @ApiProperty()
    formId: Form

    @Column()
    @ApiProperty()
    Answer: string;

}

/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Form } from "./form.dto";


@Entity()
export class Questions{

    @PrimaryGeneratedColumn('uuid')
    idQuestion: number;

    @Column()
    @ApiProperty()
    Question: string;

    @Column()
    @OneToMany(() => Form, form => form.id)
    @ApiProperty()
    formId: Form
}

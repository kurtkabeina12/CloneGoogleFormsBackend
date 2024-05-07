/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Card } from "./card.dto";
import { Form } from "./form.dto";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Section {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 title: string;

 @ManyToOne(() => Form, form => form.sections)
 @ApiProperty()
 form: Form;

 @OneToMany(() => Card, card => card.section)
 cards: Card[];

}

/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @ApiProperty()
    phoneNumber: string;

}
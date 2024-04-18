/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Users } from "./users.dto";

@Entity()
export class Answers {

    @PrimaryGeneratedColumn()
    idAnswer: number;

    @Column()
    @ApiProperty()
    phoneNumber: string;

    @Column()
    @ApiProperty()
    idForm: string;

    @Column()
    @ApiProperty()
    idQuestion: string;

    // Отношение к Users
    @ManyToOne(() => Users, user => user.answers, {
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: Users;

    @Column('simple-array')
    @ApiProperty({ type: () => [String] })
    answers: string | string[];
}

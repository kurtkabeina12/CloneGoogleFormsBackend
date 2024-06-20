/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Test } from "./test.dto";
import { CardTest } from "./cardTest.dto";

@Entity()
export class SectionTest {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 title: string;

 @ManyToOne(() => Test, test => test.sections)
 @ApiProperty()
 test: Test;

 @OneToMany(() => CardTest, card => card.section)
 cards: CardTest[];

 @Column({ type: 'int', nullable: true })
 order: number;

}

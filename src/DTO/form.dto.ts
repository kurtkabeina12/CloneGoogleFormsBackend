/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Section } from './section.dto';

@Entity()
export class Form {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 @ApiProperty()
 formTitle: string;

 @Column()
 @ApiProperty()
 formOverview: string;
 
 @Column()
 @ApiProperty()
 formEndText: string;

 @Column()
 @ApiProperty()
 formEndDate: string;

 @Column()
 @ApiProperty()
 isMandatoryAuth: boolean;

 @Column()
 @ApiProperty()
 selectedColor: string;

 @OneToMany(() => Section, section => section.form)
 @ApiProperty()
 sections: Section[];
}

/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SectionTest } from './sectionTest.dto';

@Entity()
export class Test {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 @ApiProperty()
 testTitle: string;

 @Column()
 @ApiProperty()
 testOverview: string;
 
 @Column()
 @ApiProperty()
 testEndText: string;

 @Column()
 @ApiProperty()
 testEndDate: string;

 @Column()
 @ApiProperty()
 selectedColor: string;

 @OneToMany(() => SectionTest, section => section.test)
 @ApiProperty()
 sections: SectionTest[];
}

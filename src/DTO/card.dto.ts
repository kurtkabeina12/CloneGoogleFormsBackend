import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ComponentType {
 Input = 'Input',
 Radio = 'Radio',
 Textarea = 'Textarea',
 Checkbox = 'Checkbox',
 Slider = 'Slider',
 Data = 'Data',
}

@Entity()
export class Card {
 @PrimaryGeneratedColumn() 
 id: number;

 @Column({
    type: 'enum',
    enum: ComponentType,
 })
 @ApiProperty({
    enum: ComponentType,
    enumName: 'ComponentType',
    example: Object.values(ComponentType),
 })
 selectedComponent: ComponentType;

 @Column()
 @ApiProperty()
 question: string;

 @Column({
    type: 'simple-array', 
 })
 @ApiProperty({ oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] })
 answer: string | string[];

 @Column({ default: false })
 @ApiProperty()
 isRequired: boolean;
}

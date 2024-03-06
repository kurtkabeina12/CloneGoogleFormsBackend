import { ApiProperty } from '@nestjs/swagger';

export enum ComponentType {
 Input = 'Input',
 Radio = 'Radio',
 Textarea = 'Textarea',
 Checkbox = 'Checkbox',
 Slider = 'Slider',
 Data = 'Data',
}

export class Card {
 @ApiProperty({
    enum: ComponentType,
    enumName: 'ComponentType',
    example: Object.values(ComponentType),
 })
 selectedComponent: ComponentType;

 @ApiProperty()
 question: string;

 @ApiProperty()
 isRequired: boolean;

 @ApiProperty({ oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] })
 answer: string | string[];
}

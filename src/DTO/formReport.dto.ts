/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { Answers } from "./answers.dto";
import { Card } from "./card.dto";
import { Form } from "./form.dto";

export class FormReportDTO {

    @ApiProperty()
    form: Form;

    @ApiProperty()
    questions: Card[];

    @ApiProperty()
    answers: Answers[];
}

/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Answers } from "src/DTO/answers.dto";
import { Card } from "src/DTO/card.dto";
import { Form } from "src/DTO/form.dto";
import { FormReportDTO } from "src/DTO/formReport.dto";
import { Repository } from "typeorm";

@Injectable()
export class getFormsService {
    constructor(
        @InjectRepository(Form)
        private formsRepository: Repository<Form>,

        @InjectRepository(Card)
        private cardsRepository: Repository<Card>,

        @InjectRepository(Answers)
        private answersRepository: Repository<Answers>,

    ) { }

    async getAllForms() {
        const forms = await this.formsRepository.find({
            select: ["id", "formHeader"]
        });
        console.log(forms);
        return forms;
    }

    async getFormReport(formId: string): Promise<FormReportDTO> {
        console.log(formId)
        // поиск формы
        const form = await this.formsRepository.findOne({
            where: { id: formId },
            select: ["id", "isMandatoryAuth"]
        });
        console.log(form)
        // находим все вопросы формы
        const questions = await this.cardsRepository.find({
            where: { form: { id: formId } },
            select: ["idQuestion", "question"]
        });
        console.log(questions)
        // находим все ответы формы
        const answers = await this.answersRepository.find({
            where: { idForm: formId },
            select: ["idQuestion", "answers"]
        });
        console.log(answers)
    
        return {
            form,
            questions,
            answers
        };
    }
    
}

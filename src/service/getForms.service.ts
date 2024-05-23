/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Form } from "src/DTO/form.dto";
import { Repository } from "typeorm";

@Injectable()
export class getFormsService {

    constructor(
        @InjectRepository(Form)
        private formsRepository: Repository<Form>,
    ) { }

    async getAllForms() {
        const forms = await this.formsRepository.find({
            select: ["id", "formTitle", "formEndDate"]
        });
        console.log(forms);
        return forms;
    }

    async getFormInfo(formId: string) {
        const formInfo = await this.formsRepository.findOne({
            where: { id: formId },
            select: ["formEndText", "selectedColor"]
        });
        return formInfo;
    }

}

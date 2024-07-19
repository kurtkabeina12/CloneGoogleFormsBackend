/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Test } from "src/DTO/test.dto";
import { Repository } from "typeorm";

@Injectable()
export class getTestsService {

    constructor(
        @InjectRepository(Test)
        private testsRepository: Repository<Test>,
    ) { }

    // async getAllForms() {
    //     const forms = await this.testsRepository.find({
    //         select: ["id", "formTitle", "formEndDate"]
    //     });
    //     console.log(forms);
    //     return forms;
    // }

    async getTestInfo(testId: string) {
        const testInfo = await this.testsRepository.findOne({
            where: { id: testId },
            select: ["testEndText", "selectedColor"]
        });
        return testInfo;
    }

}

/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Answers } from "src/DTO/answers.dto";
import { Users } from "src/DTO/users.dto";
import { Repository } from "typeorm";

@Injectable()
export class getFormsDataService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,

        @InjectRepository(Answers)
        private answersRepository: Repository<Answers>,
    ) { }

    async savePhoneNumber(phoneNumber: string): Promise<Users> {
        const user = this.usersRepository.create({ phoneNumber });
        return this.usersRepository.save(user);
    }

    async saveAnswers(formData: any, formId: string): Promise<void> {
        const { registerPhone } = formData;
        let user = await this.usersRepository.findOne({ where: { phoneNumber: registerPhone } });

        if (!user) {
            user = this.usersRepository.create({ phoneNumber: registerPhone });
            await this.usersRepository.save(user);
        }

        for (const [idQuestion, answer] of Object.entries(formData)) {
            if (idQuestion !== 'registerPhone') {
                const answerEntity = this.answersRepository.create({
                    phoneNumber: registerPhone,
                    idForm: formId,
                    user: user,
                    idQuestion: idQuestion,
                    answers: Array.isArray(answer) ? answer : [answer] 
                });

                await this.answersRepository.save(answerEntity);
            }
        }
    }
}


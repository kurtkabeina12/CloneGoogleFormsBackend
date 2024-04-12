/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questions } from 'src/DTO/questions.dto';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(Questions)
        private questionsRepository: Repository<Questions>,
    ) { }

    async saveQuestions(questions: Questions[]): Promise<void> {
        await this.questionsRepository.save(questions);
    }

}

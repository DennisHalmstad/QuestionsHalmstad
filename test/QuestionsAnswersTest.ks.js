import {Questions} from "../modules/Questions.js";
import {CorrectAnswers} from "../modules/Answers.js";

describe('Questions and Answers', function () {
    describe('Test questions', function () {

        const nrQuestions = Object.entries(Questions).length;
        const MoreThanZeroQuestions = nrQuestions > 0;

        it('Nr Questions need to be greater then 0', function () {
            assert.equal(true, MoreThanZeroQuestions);
        });
    });

    describe('Test answers', function () {

        const nrAnswers = Object.entries(CorrectAnswers).length;
        const MoreThanZeroAnswers = nrAnswers > 0;

        it('Nr correctAnswers need to be greater then 0', function () {
            assert.equal(true, MoreThanZeroAnswers);
        });
    });

    describe('Compare Questions and Answers', function () {

        const nrAnswers = Object.entries(CorrectAnswers).length;
        const nrQuestions = Object.entries(Questions).length;

        it('Nr Questions needs to be equal to answers', function () {
            assert.equal(nrAnswers, nrQuestions);
        });
    });
});

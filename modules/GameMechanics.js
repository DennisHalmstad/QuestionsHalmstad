import {Questions} from "./Questions.js";
import {CorrectAnswers} from "./Answers.js";

export class GameMechanics {

    /**
     * init game, make shure we have the same document
     */
    initGame = function (doc) {
        this.d = doc;
    }

    /**
     * Big Green startbutton here
     */
    startNewGame = function () {

        // hide container
        this.sendEvent('changeDisplayStyle', {id: 'statsContainer', style: 'none'});
        this.sendEvent('changeDisplayStyle', {id: 'questionContainer', style: 'none'});
        this.sendEvent('changeDisplayStyle', {id: 'introContainer', style: 'none'});

        // Reset variables
        this.questionsInGame = [];
        this.currentQuestionId = false;
        this.currentQuestion = false;
        this.questionDoneTimes = {};

        this.currentQuestionStartTime = false;
        this.maxTimeToAnswer = 15;

        this.timer = false;

        this.hintFiftyFifty = false;
        this.hintTimeAdd = false;

        this.stats = {
            correctAnswers: 0,
            incorrectAnswers: 0,
            unanswered: 0,
        };

        // enable hints
        this.sendEvent('hintfiftyfifty.toggle', false);
        this.sendEvent('hinttime.toggle', false);

        // handle all Questions via keys so Questions can be removed without need for refactor all Questions
        const allKeys = Object.entries(Questions);
        let questionToAdd, questionIdToAdd;
        for (let i = 9; i >= 0; i--) {
            questionIdToAdd = allKeys.splice(Math.floor(Math.random() * allKeys.length), 1);
            questionToAdd = Questions[questionIdToAdd[0][0]];
            questionToAdd.originalId = questionIdToAdd[0][0];
            this.questionsInGame.push(questionToAdd);
        }

        // start ticker
        this.timer = setInterval(() => {
            this.updateTimer()
        }, 200);

        // show first question
        this.showNextQuestion();
    }

    /**
     * Show Questions
     */
    showNextQuestion = function () {
        let infoToSend = {};

        // is it the first question
        if (this.currentQuestionId === false) {
            this.currentQuestionId = 0;
        } else {
            this.currentQuestionId += 1;
        }

        // hide question
        this.sendEvent('changeDisplayStyle', {id: 'questionContainer', style: 'none'});


        // if all Questions are answered
        if (this.currentQuestionId === this.questionsInGame.length) {
            clearInterval(this.timer);
            this.updateStats();

            // show stats
            this.sendEvent('changeDisplayStyle', {id: 'statsContainer', style: 'block'});


        } else {
            // reset timeout hint
            this.maxTimeToAnswer = 15;

            //set current question
            this.currentQuestion = this.questionsInGame[this.currentQuestionId];
            this.currentQuestionStartTime = Date.now();

            // update question specific texts
            infoToSend.question = this.currentQuestion.question;
            infoToSend.answers = this.currentQuestion.answers;
            infoToSend.currentQuestionNr = this.currentQuestionId + 1;
            infoToSend.nrQuestionsInGame = this.questionsInGame.length

            // show question.
            this.sendEvent('questionUpdated', infoToSend);
            this.sendEvent('changeDisplayStyle', {id: 'questionContainer', style: 'block'});
        }
    }

    /**
     * Answer current question
     * @param answerId
     */
    answerQuestion = function (answerId = -1) {
        if (!Number.isNaN(this.currentQuestionId)) {
            this.questionsInGame[this.currentQuestionId].givenAnswer = answerId;

            this.questionDoneTimes[this.currentQuestionId] = Date.now();
            this.showNextQuestion();
        }
    }

    /**
     * Update timer and check if time to answer question is up
     */
    updateTimer = function () {
        let secondsSinceLastQuestionStart = Math.floor((Date.now() - this.currentQuestionStartTime) / 1000);
        let times = {
            secondsElapsed: secondsSinceLastQuestionStart,
            secondsLeft: this.maxTimeToAnswer - secondsSinceLastQuestionStart,
            maxTime: this.maxTimeToAnswer,
        }

        if (secondsSinceLastQuestionStart > this.maxTimeToAnswer) {
            this.answerQuestion();
        }

        this.sendEvent('time', times);
    }

    /**
     * remove 2 of 3 faulty answers
     * @returns {{answerToKeep: *, correctAnswer: *}}
     */
    hintUseFiftyFifty = function () {
        if (!this.hintFiftyFifty) {
            this.sendEvent('hintfiftyfifty.toggle', true);
            this.hintFiftyFifty = true;

            // hämta rätt svar
            let correctAnswer = CorrectAnswers[this.questionsInGame[this.currentQuestionId].originalId];
            let answerToKeep = Math.floor(Math.random() * 3);
            if (answerToKeep === correctAnswer) {
                if (correctAnswer === 3) {
                    answerToKeep = 0;
                } else {
                    answerToKeep += 1;
                }
            }

            this.sendEvent('hideFaultyAnswers', {correctAnswer, answerToKeep});
            return [correctAnswer, answerToKeep];
        }
        return false;
    }

    /**
     * add 10 seconds to max time
     */
    hintUseTime = function () {
        if (!this.hintTimeAdd) {
            this.sendEvent('hinttime.toggle', true);
            this.hintTimeAdd = true;
            this.maxTimeToAnswer = 25;
        }
        return false;
    }

    /**
     * Calculate and show stats
     */
    updateStats = function () {
        for (let qID in this.questionsInGame) {

            if (this.questionsInGame[qID].givenAnswer === -1) {
                this.stats.unanswered += 1;
            } else {
                if (this.questionsInGame[qID].givenAnswer === CorrectAnswers[this.questionsInGame[qID].originalId]) {
                    this.stats.correctAnswers += 1;
                } else {
                    this.stats.incorrectAnswers += 1;
                }
            }
        }


        this.sendEvent('statsUpdated', this.stats);
    }

    /**
     * Return stats
     * @returns {*}
     */
    getStats = function () {
        return this.stats;
    }

    /**
     * get current step used for test
     * @returns {boolean|number|*}
     */
    getCurrentStep = function () {
        return this.currentQuestionId
    }

    /**
     * helper function to dispatch events
     * @param evtName
     * @param info
     */
    sendEvent = function (evtName, info) {
        if (typeof CustomEvent !== "undefined") {
            this.d.dispatchEvent(new CustomEvent('game.' + evtName, {detail: info}));
        } else {
            //console.log('CustomEvent dosen´t exists', evtName, info);
        }

    }

}



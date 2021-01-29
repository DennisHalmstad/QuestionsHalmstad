import {GameMechanics} from "../modules/GameMechanics.js";

describe('GameMechanics', function () {
    describe('Init and start Game', function () {

        let game = new GameMechanics();
        game.initGame(global.document);
        game.startNewGame();

        let first = game.getCurrentStep();
        it('should be 0', function () {
            assert.equal(0, first);
        });
    });

    describe('try stepping questions', function () {
        let game = new GameMechanics();
        game.initGame(global.document);
        game.startNewGame();

        let first = game.getCurrentStep();
        game.answerQuestion();
        game.answerQuestion();
        game.answerQuestion();
        let second = game.getCurrentStep();

        it('should be 0', function () {
            assert.equal(0, first);
        });
        it('should be 3', function () {
            assert.equal(3, second);
        });

    });

    describe('don´t answer any questions (force timeout)', function () {
        let game = new GameMechanics();
        game.initGame(global.document);
        game.startNewGame();
        game.answerQuestion();
        game.answerQuestion();
        game.answerQuestion();
        game.answerQuestion();
        game.answerQuestion();
        game.answerQuestion();
        game.answerQuestion();
        game.answerQuestion();
        game.answerQuestion();
        game.answerQuestion();

        let stats = game.getStats();

        it('should be 10 unaswered', function () {
            assert.equal(10, stats.unanswered);
        });

        it('should be 0 correct', function () {
            assert.equal(0, stats.correctAnswers);
        });

        it('should be 0 incorrect', function () {
            assert.equal(0, stats.incorrectAnswers);
        });
    });

    describe('answer all questions', function () {
        let game = new GameMechanics();
        game.initGame(global.document);
        game.startNewGame();
        game.answerQuestion(0);
        game.answerQuestion(0);
        game.answerQuestion(0);
        game.answerQuestion(0);
        game.answerQuestion(0);
        game.answerQuestion(0);
        game.answerQuestion(0);
        game.answerQuestion(0);
        game.answerQuestion(0);
        game.answerQuestion(0);
        let stats = game.getStats();

        it('should be 0 unaswered', function () {
            assert.equal(0, stats.unanswered);
        });

        it('should be 10 correct and incorrect', function () {
            assert.equal(10, stats.correctAnswers + stats.incorrectAnswers);
        });

    });

    describe('try timeout', function () {
        let game = new GameMechanics();
        game.initGame(global.document);
        game.startNewGame();

        let first = game.getCurrentStep();
        game.answerQuestion();

        this.timeout(16e3);

        let second = game.getCurrentStep();

        it('should be 0', function () {
            assert.equal(0, first);
        });
        it('should be 1 since time has passed', function () {
            assert.equal(1, second);
        });

    });

    describe('try timeout after hint', function () {
        let game = new GameMechanics();
        game.initGame(global.document);
        game.startNewGame();

        let first = game.getCurrentStep();
        game.hintUseTime();

        this.timeout(16e3);

        let second = game.getCurrentStep();

        it('should be 0', function () {
            assert.equal(0, first);
        });
        it('should still be 0 since time shouldent have passed', function () {
            assert.equal(0, second);
        });

    });

    describe('try fiftyfifty', function () {
        let game = new GameMechanics();
        game.initGame(global.document);
        game.startNewGame();

        let answersToSave1 = Array.from(game.hintUseFiftyFifty());
        it('first try should return 2 answers to keep', function () {
            assert.equal(2, answersToSave1.length);
        });

        let answersToSave2 = game.hintUseFiftyFifty();
        it('second try should return false', function () {
            assert.equal(false, answersToSave2);
        });

    });

})

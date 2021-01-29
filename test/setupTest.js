const assert = require('assert').strict;
global.assert = assert;
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const {document} = new JSDOM(`
<!DOCTYPE html>
<html>
  <body>
    <div class="wrapper">
    <div id="introContainer">
        testhtml
        <div class="hover restart">Starta Spelet</div>
    </div>

    <div id="questionContainer">
        <div id="questionscounter"></div>
        <div id="question"></div>
        <div class="answerButton hover" id="answer0"></div>
        <div class="answerButton hover" id="answer1"></div>
        <div class="answerButton hover" id="answer2"></div>
        <div class="answerButton hover" id="answer3"></div>
        <div class="hints">
            <div class="hintButton hover" id="hintfiftyfifty">Dölj 2 felaktiga svar</div>
            <div class="hintButton hover" id="hinttime">Tio extra sekunder.</div>
        </div>

        <div class="currentTimerWrapper">
            <progress id="currentTimerProgress" max="15" value="0"></progress>
            <div id="currentTimer"></div>
        </div>

    </div>

    <div id="statsContainer">
        Du besvarade:
        <div class="statsText" id="correctAnswered"></div>
        <div class="statsText" id="incorrectAnswered"></div>
        <div class="statsText" id="unanswered"></div>
        <div class="hover restart">Spela igen</div>
    </div>
</div>
  </body>
</html>
`).window;
global.document = document;
global.window = document.defaultView;

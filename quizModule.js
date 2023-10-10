import chalk from "chalk";
import lodash from "lodash";

import { question, inputAnswerCount } from "./questionModule.js";

// 通しで出題か、ランダムで出題か(問題数選択可)
export const startQuizFlow = async (count, events) => {
  const sequenceAnswer = await question(
    "sequence",
    "クイズの順番を選んでね\n",
    ["最初から順番に", "回数を決めてランダムに"]
  );
  console.log(""); // 見やすさのために空行を入れる

  let decidedCount, decidedEvents;
  if (sequenceAnswer.sequence === "最初から順番に") {
    decidedCount = count;
    decidedEvents = events;
  } else if (sequenceAnswer.sequence === "回数を決めてランダムに") {
    const inputAnswer = await inputAnswerCount(count);
    decidedCount = inputAnswer.input;
    decidedEvents = lodash.shuffle(events);
  }

  processQuiz(decidedCount, decidedEvents);
};

const processQuiz = async (count, events) => {
  console.log("日本史クイズ スタート！！\n");
  let correct = 0;

  for (let i = 0; i < count; i++) {
    const questionYearEvent = events[i];
    const questionYear = questionYearEvent.year;
    const questionEvent = questionYearEvent.event;

    // 出題に対する回答の選択肢を、同じ時代の中から取得する
    const applicableEvents = events.filter(
      (item) => item.period === questionYearEvent.period
    );
    const choices = [];
    choices.push(questionEvent);
    const other = applicableEvents.filter(
      (item) => item.event !== questionEvent
    );
    choices.push(...lodash.sampleSize(other, 3).map((item) => item.event));

    const shuffledChoices = lodash.shuffle(choices); // 正解が選択肢の１番目にきてるので、シャッフル
    const answeredEvent = await question(
      "event",
      ` ${questionYear} の出来事は？ ( ${i + 1} / ${count} 問目)\n`,
      shuffledChoices
    );

    if (answeredEvent.event === questionEvent) {
      correct += 1;
      console.log("\n正解 ♪ (´▽｀)\n\n");
    } else {
      console.log(
        `\n残念 (´△｀)  正解は ${chalk.red(questionEvent)} でした！\n\n`
      );
    }
  }

  const correctRate = Math.floor((correct / count) * 100);
  console.log(
    `正解数は ${chalk.green(count)} 問中 ${chalk.green(
      correct
    )} 問！  正解率は ${chalk.green(correctRate)} %！\nまた挑戦してね ♪`
  );
};

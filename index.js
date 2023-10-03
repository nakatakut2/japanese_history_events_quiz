#!/usr/bin/env node

import fs from "fs";
import { question } from "./questionModule.js";
import { startQuizFlow } from "./quizModule.js";

const main = async () => {
  const json = fs.readFileSync("./chronology.json", "utf8");
  const periodsArray = JSON.parse(json);

  const answeredMode = await question("mode", "モードを選んでね\n", [
    "クイズに挑戦する",
    "年表を見る",
  ]);
  console.log(""); // 見やすさのために空行を入れる

  let totalCount = 0;
  const periodNamesArray = [];
  for (const period of periodsArray) {
    totalCount += period.events.length;
    periodNamesArray.push(`${period.name} ( ${period.events.length} 項目)`);
  }
  periodNamesArray.push(`全部 ( ${totalCount} 項目)`);

  // 【４択クイズ】
  if (answeredMode.mode === "クイズに挑戦する") {
    const answeredPeriod = await question(
      "period",
      "どの時代に挑戦する？\n",
      periodNamesArray,
    );
    console.log(""); // 見やすさのために空行を入れる

    if (answeredPeriod.period === `全部 ( ${totalCount} 項目)`) {
      const allEvents = [];
      for (const period of periodsArray) {
        allEvents.push(...period.events);
      }
      startQuizFlow(totalCount, allEvents);
      return;
    }

    const selectedPeriod = periodsArray.find(
      (item) => item.name === answeredPeriod.period.split(" (")[0],
    );
    startQuizFlow(selectedPeriod.events.length, selectedPeriod.events);
  }

  // 【年表】
  if (answeredMode.mode === "年表を見る") {
    const answeredPeriod = await question(
      "period",
      "どの時代の年表を見る？\n",
      periodNamesArray,
    );

    if (answeredPeriod.period === `全部 ( ${totalCount} 項目)`) {
      for (const period of periodsArray) {
        console.log(`\n【${period.name}】`);
        for (const event of period.events) {
          console.log(`${event.year}  ${event.event}`);
        }
      }
      return;
    }

    const selectedPeriod = periodsArray.find(
      (item) => item.name === answeredPeriod.period.split(" (")[0],
    );
    console.log(`\n【${selectedPeriod.name}】`);
    for (const event of selectedPeriod.events) {
      console.log(`${event.year}  ${event.event}`);
    }
  }
};

main();

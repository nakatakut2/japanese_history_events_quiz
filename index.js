#!/usr/bin/env node

import fs from "fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { question } from "./questionModule.js";
import { tryQuiz } from "./quizModule.js";
import { displayChronology } from "./displayChronologyModule.js";

const readChronology = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const json = fs.readFileSync(`${__dirname}/chronology.json`, "utf8");
  return JSON.parse(json);
};

const main = async () => {
  const periodsArray = readChronology();
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

  tryQuiz(answeredMode, periodNamesArray, totalCount, periodsArray);
  displayChronology(answeredMode, periodNamesArray, totalCount, periodsArray);
};

main();

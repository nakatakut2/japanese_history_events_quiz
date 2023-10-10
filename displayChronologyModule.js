import { question } from "./questionModule.js";

export const displayChronology = async (
  answeredMode,
  periodNamesArray,
  totalCount,
  periodsArray
) => {
  if (answeredMode.mode === "年表を見る") {
    const answeredPeriod = await question(
      "period",
      "どの時代の年表を見る？\n",
      periodNamesArray
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
      (item) => item.name === answeredPeriod.period.split(" (")[0]
    );
    console.log(`\n【${selectedPeriod.name}】`);
    for (const event of selectedPeriod.events) {
      console.log(`${event.year}  ${event.event}`);
    }
  }
};

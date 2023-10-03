import inquirer from "inquirer";

export const question = async (name, message, choices) => {
  try {
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: `${name}`,
        message: `${message}`,
        choices: choices,
        loop: false,
      },
    ]);
    return answer;
  } catch (error) {
    if (error.isTtyError) {
      console.error("お使いの環境ではプロンプトを表示できません。");
    } else {
      throw error;
    }
  }
};

export const inputAnswerCount = async (max) => {
  try {
    const answer = await inquirer.prompt([
      {
        type: "number",
        name: "input",
        message: `1 〜 ${max} の間で回数を入力してね`,
        validate: (input) => {
          if (input > 0 && input <= max) {
            return true;
          } else {
            return `1 〜 ${max} の間で入力してください`;
          }
        },
      },
    ]);
    return answer;
  } catch (error) {
    if (error.isTtyError) {
      console.error("お使いの環境ではプロンプトを表示できません。");
    } else {
      throw error;
    }
  }
};

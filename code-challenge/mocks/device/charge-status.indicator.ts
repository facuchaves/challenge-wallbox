import chalk from "chalk";

export function createUpdateChargeStatusIndicatorFn(): UpdateChargeStatusIndicatorFn {
  return function update(status: string): void {
    console.clear();
    if (status === "charging") {
      console.log(chalk.white.bgRed(formatMessage("Charging")));
    } else if (status === "charging80") {
      console.log(chalk.black.bgYellow(formatMessage("Charging >80%")));
    } else if (status === "charged") {
      console.log(chalk.black.bgGreen(formatMessage("Charged")));
    } else {
      console.log("Not recognized Status update", status);
    }
  };
}

function formatMessage(message: string): string {
  return `         ${message}       
         ${message}       
         ${message}       `;
}

export type UpdateChargeStatusIndicatorFn = (status: string) => void;

import enquirer from "enquirer";

import * as Rx from "rxjs";

export class SoCPrompter {
  protected subject: Rx.Subject<number>;
  constructor({ socsSubject }: { socsSubject: Rx.Subject<number> }) {
    this.subject = socsSubject;
  }

  public async startPrompting(): Promise<void> {
    while (true) {
      const { soc } = await promptSoC();
      if (soc !== undefined) {
        this.subject.next(parseInt(soc));
      } else {
        break;
      }
    }
  }
}

async function promptSoC(): Promise<{ soc: string }> {
  try {
    return await enquirer.prompt({
      name: "soc",
      type: "select",
      message: "Pick a State of Charge",
      format: (option: string) => `${option}%`,
      choices: ["5", "10", "40", "80", "100"],
    });
  } catch (error) {
    process.exit();
  }
}

export function createSoCPrompter({
  socsSubject,
}: {
  socsSubject: Rx.Subject<number>;
}): SoCPrompter {
  return new SoCPrompter({ socsSubject });
}

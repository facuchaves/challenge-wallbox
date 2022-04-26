import {
  ConnectionToServer,
  createConnectionToServer,
} from "./connection-to-server";

import * as Rx from "rxjs";

export class ChargerMock {
  protected socsSubject: Rx.Subject<number>;
  protected connectionToServer: ConnectionToServer;

  protected id: string;
  protected url: string;

  constructor({ id, url }: { id: string; url: string }) {
    this.socsSubject = new Rx.Subject<number>();
    this.id = id;
    this.url = url;
  }

  public async start(): Promise<void> {
    this.connectionToServer = createConnectionToServer({
      url: this.url,
      id: this.id,
    });

    await this.connectionToServer.connect();

    console.log(`[Connected to Server] chargerId: ${this.id}`);

    this.socsSubject.subscribe((value) =>
      this.connectionToServer.getSendSoCFn()(value)
    );
  }

  public getSocSubject(): Rx.Subject<number> {
    return this.socsSubject;
  }

  public setSoc(soc: number): number {
    this.socsSubject.next(soc);
    return soc;
  }
}

export function createChargerMock({
  id,
  url,
}: {
  id: string;
  url: string;
}): ChargerMock {
  return new ChargerMock({ id, url });
}

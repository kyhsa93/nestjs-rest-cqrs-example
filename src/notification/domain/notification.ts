export type NotificationProperties = Readonly<{
  id: string;
  accountId: string;
  to: string;
  subject: string;
  content: string;
  createdAt: Date;
}>;

export class Notification {
  private readonly id: string;
  private readonly accountId: string;
  private readonly to: string;
  private readonly subject: string;
  private readonly content: string;
  private readonly createdAt: Date;
  private readonly _events: object[] = [];

  constructor(properties: NotificationProperties) {
    Object.assign(this, properties);
  }

  get domainEvents(): ReadonlyArray<object> {
    return [...this._events];
  }

  clearEvents(): void {
    this._events.length = 0;
  }
}

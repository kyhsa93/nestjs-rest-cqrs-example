export interface Event {
  readonly subject: string;
  readonly data: Record<string, string>;
}

export interface Publisher {
  publish: (event: Event) => Promise<void>;
}

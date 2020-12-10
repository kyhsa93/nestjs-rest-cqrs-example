export interface Event {
  readonly key: string;
  readonly data: Record<string, any>;
}

export interface Publisher {
  publish(event: Event): Promise<void>;
}

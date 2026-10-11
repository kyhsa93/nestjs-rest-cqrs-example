type EventuallyOptions = {
  /** Give up after this many milliseconds. The outbox needs two 5 s poll/consume rounds. */
  timeout?: number;
  interval?: number;
  description?: string;
};

/**
 * Retries `check` until it returns without throwing, then returns its result.
 * Use it for anything that goes through the outbox and SQS: delivery is driven by
 * 5 s timers, so a fixed sleep is either flaky or slow.
 */
export async function eventually<T>(
  check: () => Promise<T>,
  { timeout = 45_000, interval = 500, description }: EventuallyOptions = {},
): Promise<T> {
  const deadline = Date.now() + timeout;
  let lastError: unknown;
  for (;;) {
    try {
      return await check();
    } catch (error) {
      lastError = error;
    }
    if (Date.now() >= deadline) break;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  const reason =
    lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(
    `${description ?? 'condition'} not met within ${timeout} ms: ${reason}`,
  );
}

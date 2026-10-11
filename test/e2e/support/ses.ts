export type SentEmail = {
  to: string[];
  subject: string;
  text: string;
};

type LocalStackSesMessage = {
  Destination?: { ToAddresses?: string[] };
  Subject?: string;
  Body?: { text_part?: string | null };
};

/**
 * Emails that the app sent through SES, read from LocalStack's SES inspection endpoint
 * (`GET /_aws/ses`). Only messages addressed to `to` are returned.
 */
export async function sentEmails(to: string): Promise<SentEmail[]> {
  const response = await fetch(`${process.env.AWS_ENDPOINT}/_aws/ses`);
  if (!response.ok)
    throw new Error(`LocalStack SES endpoint answered ${response.status}`);

  const { messages = [] } = (await response.json()) as {
    messages?: LocalStackSesMessage[];
  };
  return messages
    .map((message) => ({
      to: message.Destination?.ToAddresses ?? [],
      subject: message.Subject ?? '',
      text: message.Body?.text_part ?? '',
    }))
    .filter((email) => email.to.includes(to));
}

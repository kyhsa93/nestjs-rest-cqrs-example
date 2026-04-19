import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

import { Config } from 'src/config';

import { EmailAdaptor } from 'src/notification/application/adaptor/email-adaptor';

export class EmailAdaptorImplement extends EmailAdaptor {
  private readonly sesClient = new SESClient({
    region: Config.AWS_REGION,
    endpoint: Config.AWS_ENDPOINT,
  });

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    await this.sesClient.send(
      new SendEmailCommand({
        Destination: { ToAddresses: [to] },
        Source: Config.EMAIL,
        Message: {
          Subject: { Data: subject, Charset: 'UTF-8' },
          Body: { Text: { Data: text, Charset: 'UTF-8' } },
        },
      }),
    );
  }
}

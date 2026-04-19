export abstract class EmailAdaptor {
  abstract sendEmail(
    email: string,
    subject: string,
    text: string,
  ): Promise<void>;
}

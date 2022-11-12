export interface EmailAdaptor {
  sendEmail: (email: string, subject: string, text: string) => Promise<void>;
}

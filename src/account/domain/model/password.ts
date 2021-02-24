import bcrypt from 'bcrypt';

export interface PasswordAttributes {
  readonly encrypted: string;
  readonly salt: string;
  readonly createdAt: Date;
  readonly comparedAt: Date;
}

export default class Password {
  private readonly encrypted: string;

  private readonly salt: string;

  private readonly createdAt: Date;

  private readonly comparedAt: Date;

  constructor(attributes: { encrypted: string; salt: string; createdAt: Date; comparedAt: Date }) {
    this.encrypted = attributes.encrypted;
    this.salt = attributes.salt;
    this.createdAt = attributes.createdAt;
    this.comparedAt = attributes.comparedAt;
  }

  public attributes(): PasswordAttributes {
    return {
      encrypted: this.encrypted,
      salt: this.salt,
      createdAt: this.createdAt,
      comparedAt: this.comparedAt,
    };
  }

  public compare(password: string): boolean {
    return bcrypt.compareSync(password, this.encrypted)
  }
}

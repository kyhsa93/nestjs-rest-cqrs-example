import bcrypt from 'bcrypt';

export interface AnemicPassword {
  readonly encrypted: string;
  readonly salt: string;
  readonly createdAt: Date;
  readonly comparedAt: Date;
}

export default class Password {
  constructor(
    private readonly encrypted: string,
    private readonly salt: string,
    private readonly createdAt: Date,
    private readonly comparedAt: Date,
  ) {}

  public toAnemic(): AnemicPassword {
    return {
      encrypted: this.encrypted,
      salt: this.salt,
      createdAt: this.createdAt,
      comparedAt: this.comparedAt,
    };
  }

  public async compare(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.encrypted);
  }
}

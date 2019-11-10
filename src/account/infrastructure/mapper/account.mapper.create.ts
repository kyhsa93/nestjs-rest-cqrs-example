export default class CreateAccountMapper {
  public readonly name: string;

  public readonly email: string;

  public readonly password: string;

  public readonly active: boolean;

  public readonly createdAt: Date;

  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.active = true;
    this.createdAt = new Date();
  }
}

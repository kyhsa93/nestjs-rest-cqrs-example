import bcrypt from 'bcrypt';

export default class Password {
  constructor(
    private _encrypted: string, 
    private _salt: string,
    private readonly _createdAt: Date,
    private _comparedAt: Date,
  ){};

  get encrypted(): string {
    return this._encrypted
  }

  public compare(password: string): boolean {
    if (!bcrypt.compareSync(password, this._encrypted)) return false;

    this._comparedAt = new Date();
    return true;
  }
}

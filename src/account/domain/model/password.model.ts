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
}

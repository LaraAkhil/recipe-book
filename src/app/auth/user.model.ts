export class User {
  public get tokenExpDate(): Date {
    return this._tokenExpDate;
  }
  public get token(): string {
    if (!this.tokenExpDate || new Date() > this.tokenExpDate) {
      return null;
    } else {
      return this._token;
    }
  }
  constructor(
    public email: string,
    public id: string,
    // tslint:disable-next-line:variable-name
    private _token: string,
    // tslint:disable-next-line:variable-name
    private _tokenExpDate: Date
  ) {}
}

import bcrypt from 'bcrypt';

import Password, { AnemicPassword } from '@src/account/domain/model/password';

export default class PasswordFactory {
  public create = (password: string): Password => {
    const salt = bcrypt.genSaltSync();
    const encrypted = bcrypt.hashSync(password, salt);
    return new Password({
      encrypted, salt, createdAt: new Date(), comparedAt: new Date(),
    });
  };

  public reconstitute = (anemic: AnemicPassword): Password => {
    const {
      encrypted, salt, createdAt, comparedAt,
    } = anemic;
    return new Password({
      encrypted, salt, createdAt, comparedAt,
    });
  };
}

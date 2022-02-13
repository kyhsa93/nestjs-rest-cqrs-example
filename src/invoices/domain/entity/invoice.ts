import {
  UnprocessableEntityException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';

import { ErrorMessage } from 'src/invoices/domain/error/error';
import { InvoiceClosedEvent } from 'src/invoices/domain/events/invoice-closed.event';
import { InvoiceOpenedEvent } from 'src/invoices/domain/events/invoice-opened.event';
import { DepositedEvent } from 'src/invoices/domain/events/deposited.event';
import { PasswordUpdatedEvent } from 'src/invoices/domain/events/password-updated.event';
import { WithdrawnEvent } from 'src/invoices/domain/events/withdrawn.event';

export type InvoiceEssentialProperties = Required<{
  readonly id: string;
  readonly name: string;
}>;

export type InvoiceOptionalProperties = Partial<{
  readonly password: string;
  readonly status: number;
  readonly openedAt: Date;
  readonly updatedAt: Date;
  readonly closedAt: Date | null;
  readonly version: number;
}>;

export type InvoiceProperties = InvoiceEssentialProperties &
  Required<InvoiceOptionalProperties>;

export interface Invoice {
  properties: () => InvoiceProperties;
  compareId: (id: string) => boolean;
  open: (password: string) => void;
  updatePassword: (password: string, data: string) => void;
  withdraw: (amount: number, password: string) => void;
  deposit: (amount: number) => void;
  close: (password: string) => void;
  commit: () => void;
}

export class InvoiceImplement extends AggregateRoot implements Invoice {
  private readonly id: string;
  private readonly name: string;
  private password = '';
  private status = 0;
  private readonly openedAt: Date = new Date();
  private updatedAt: Date = new Date();
  private closedAt: Date | null = null;
  private version = 0;

  constructor(
    properties: InvoiceEssentialProperties & InvoiceOptionalProperties,
  ) {
    super();
    Object.assign(this, properties);
  }

  properties(): InvoiceProperties {
    return {
      id: this.id,
      name: this.name,
      password: this.password,
      status: this.status,
      openedAt: this.openedAt,
      updatedAt: this.updatedAt,
      closedAt: this.closedAt,
      version: this.version,
    };
  }

  compareId(id: string): boolean {
    return id === this.id;
  }

  open(password: string): void {
    this.setPassword(password);
    this.apply(Object.assign(new InvoiceOpenedEvent(), this));
  }

  private setPassword(password: string): void {
    if (this.password !== '' || password === '')
      throw new InternalServerErrorException(ErrorMessage.CAN_NOT_SET_PASSWORD);
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(password, salt);
    this.updatedAt = new Date();
  }

  updatePassword(password: string, data: string): void {
    if (!this.comparePassword(password)) throw new UnauthorizedException();

    this.updatedAt = new Date();
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(data, salt);
    this.apply(Object.assign(new PasswordUpdatedEvent(), this));
  }

  withdraw(amount: number, password: string): void {
    if (!this.comparePassword(password)) throw new UnauthorizedException();
    if (amount < 1)
      throw new InternalServerErrorException(
        ErrorMessage.CAN_NOT_WITHDRAW_UNDER_1,
      );
    if (this.status < amount)
      throw new UnprocessableEntityException(
        ErrorMessage.REQUESTED_AMOUNT_EXCEEDS_YOUR_WITHDRAWAL_LIMIT,
      );
    this.status -= amount;
    this.updatedAt = new Date();
    this.apply(Object.assign(new WithdrawnEvent(), this));
  }

  deposit(amount: number): void {
    if (amount < 1)
      throw new InternalServerErrorException(
        ErrorMessage.CAN_NOT_DEPOSIT_UNDER_1,
      );
    this.status += amount;
    this.updatedAt = new Date();
    this.apply(Object.assign(new DepositedEvent(), this));
  }

  close(password: string): void {
    if (!this.comparePassword(password)) throw new UnauthorizedException();
    if (this.status > 0)
      throw new UnprocessableEntityException(
        ErrorMessage.INVOICE_STATUS_IS_REMAINED,
      );
    this.closedAt = new Date();
    this.updatedAt = new Date();
    this.apply(Object.assign(new InvoiceClosedEvent(), this));
  }

  private comparePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}

import { IQueryResult } from '@nestjs/cqrs';

export class FindAccountsResult extends Array<{ readonly id: string }> implements IQueryResult {}

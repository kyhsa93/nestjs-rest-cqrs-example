import { TestingModule, Test } from "@nestjs/testing";
import { CqrsModule } from "@nestjs/cqrs";
import { ComparePasswordEventHandler } from './account.handler.event.compare-password';
import { ComparePasswordEvent } from "../implements/account.event.compare-password";

describe('ComparePasswordEventHandler', () => {
  let module: TestingModule;
  let comparePasswordEventHandler: ComparePasswordEventHandler;
  let comparePasswordEvent: ComparePasswordEvent;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [ComparePasswordEventHandler],
    }).compile();
    comparePasswordEventHandler = module.get(ComparePasswordEventHandler);
  });

  afterAll(async () => close());

  describe('handle', () => {
    comparePasswordEvent = new ComparePasswordEvent('accountId');
    it('run event handler', () => {
      const result = comparePasswordEventHandler.handle(comparePasswordEvent);
      expect(result).toBe(undefined);
    });
  });
});

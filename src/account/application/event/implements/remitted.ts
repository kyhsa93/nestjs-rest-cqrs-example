import { Event } from "@src/account/application/event/publisher";

export default class RemittedIntegrationEvent implements Event {
  constructor(
    public readonly key: string,
    public readonly data: { readonly senderId: string; readonly receiverId: string; },
  ){}
}

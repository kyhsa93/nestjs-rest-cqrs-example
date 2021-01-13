import { IEvent } from "@nestjs/cqrs";

export default class RemittedDomainEvent implements IEvent {
  constructor(public readonly senderId: string, public readonly receiverId: string){}
}

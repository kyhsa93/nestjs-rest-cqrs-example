import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { FindNotificationQuery } from 'src/notification/application/query/find-notification-query';
import { FindNotificationResult } from 'src/notification/application/query/find-notification-result';

import { FindAccountNotificationRequestParam } from 'src/notification/interface/dto/find-account-notification-request-param';
import { FindNotificationRequestQueryString } from 'src/notification/interface/dto/find-notification-request-query-string';
import { FindNotificationResponseDto } from 'src/notification/interface/dto/find-notification-response-dto';

@ApiTags('Notifications')
@Controller()
export class NotificationController {
  @Inject() private readonly queryBus: QueryBus;

  @Get('notifications')
  @ApiOkResponse({ type: FindNotificationResponseDto })
  @UseInterceptors(CacheInterceptor)
  find(
    @Query() querystring: FindNotificationRequestQueryString,
  ): Promise<FindNotificationResponseDto> {
    return this.queryBus.execute<FindNotificationQuery, FindNotificationResult>(
      new FindNotificationQuery(querystring),
    );
  }

  @Get('accounts/:accountId/notifications')
  @ApiOkResponse({ type: FindNotificationResponseDto })
  @UseInterceptors(CacheInterceptor)
  findByAccount(
    @Param() param: FindAccountNotificationRequestParam,
    @Query() querystring: FindNotificationRequestQueryString,
  ): Promise<FindNotificationResponseDto> {
    return this.queryBus.execute<FindNotificationQuery, FindNotificationResult>(
      new FindNotificationQuery({ ...param, ...querystring }),
    );
  }
}

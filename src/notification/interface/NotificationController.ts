import {
  CacheInterceptor,
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { FindNotificationQuery } from 'src/notification/application/query/FindNotificationQuery';
import { FindNotificationResult } from 'src/notification/application/query/FindNotificationResult';

import { FindAccountNotificationRequestParam } from 'src/notification/interface/dto/FindAccountNotificationRequestParam';
import { FindNotificationRequestQueryString } from 'src/notification/interface/dto/FindNotificationRequestQueryString';
import { FindNotificationResponseDto } from 'src/notification/interface/dto/FindNotificationResponseDto';

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

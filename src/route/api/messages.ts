import { Context } from 'koa';
import { validatePermission, Permission } from '@src/route/core/auth';

import { getUserMessages, sendMessage, markMessageAsRead, deleteMessage } from '@src/model/message';
import type { SendMessageParams, MessageQueryParams } from '@src/types/message';
import { logger } from 'alemonjs';

// 获取用户站内信列表
export const GET = async (ctx: Context) => {
  try {
    const res = await validatePermission(ctx, [Permission.MESSAGE_MANAGE]);

    if (!res) {
      return;
    }

    const { userId } = ctx.request.query;

    if (!userId || typeof userId !== 'string') {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '用户ID不能为空',
        data: null
      };

      return;
    }

    // 解析查询参数
    const queryParams: MessageQueryParams = {};
    const page = parseInt(ctx.request.query.page as string);
    const pageSize = parseInt(ctx.request.query.pageSize as string);
    const type = ctx.request.query.type as string;
    const status = parseInt(ctx.request.query.status as string);
    const priority = parseInt(ctx.request.query.priority as string);
    const keyword = ctx.request.query.keyword as string;

    if (!isNaN(page)) {
      queryParams.page = page;
    }
    if (!isNaN(pageSize)) {
      queryParams.pageSize = pageSize;
    }
    if (type) {
      queryParams.type = type as any;
    }
    if (!isNaN(status)) {
      queryParams.status = status;
    }
    if (!isNaN(priority)) {
      queryParams.priority = priority;
    }
    if (keyword) {
      queryParams.keyword = keyword;
    }

    const result = await getUserMessages(userId, queryParams);

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '获取用户站内信成功',
      data: result
    };
  } catch (error) {
    logger.error('获取用户站内信失败:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 发送站内信
export const POST = async (ctx: Context) => {
  try {
    const res = await validatePermission(ctx, [Permission.MESSAGE_MANAGE]);

    if (!res) {
      return;
    }

    const body = ctx.request.body;
    const { title, content, type, priority, receivers, expireTime } = body as SendMessageParams;

    // 验证必填字段
    if (!title || !content || !type) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '标题、内容和类型不能为空',
        data: null
      };

      return;
    }

    const result = await sendMessage({
      title,
      content,
      type,
      priority,
      receivers: receivers || [],
      expireTime
    });

    if (result.success) {
      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: result.message,
        data: result.data
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: result.message,
        data: null
      };
    }
  } catch (error) {
    logger.error('发送站内信失败:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 标记消息为已读
export const PUT = async (ctx: Context) => {
  try {
    const res = await validatePermission(ctx, [Permission.MESSAGE_MANAGE]);

    if (!res) {
      return;
    }

    const body = ctx.request.body;
    const { userId, messageId } = body as { userId: string; messageId: string };

    if (!userId || !messageId) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '用户ID和消息ID不能为空',
        data: null
      };

      return;
    }

    const result = await markMessageAsRead(userId, messageId);

    if (result.success) {
      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: result.message,
        data: null
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: result.message,
        data: null
      };
    }
  } catch (error) {
    logger.error('标记消息为已读失败:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 删除消息
export const DELETE = async (ctx: Context) => {
  try {
    const res = await validatePermission(ctx, [Permission.MESSAGE_MANAGE]);

    if (!res) {
      return;
    }

    const body = ctx.request.body;
    const { userId, messageId } = body as { userId: string; messageId: string };

    if (!userId || !messageId) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '用户ID和消息ID不能为空',
        data: null
      };

      return;
    }

    const result = await deleteMessage(userId, messageId);

    if (result.success) {
      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: result.message,
        data: null
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: result.message,
        data: null
      };
    }
  } catch (error) {
    logger.error('删除消息失败:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

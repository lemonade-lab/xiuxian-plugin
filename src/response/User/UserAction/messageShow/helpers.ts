import { MESSAGE_TYPE_MAP, PRIORITY_MAP, STATUS_MAP } from './constants';
import type { Message } from '@src/types/message';

/**
 * 获取消息类型显示名称
 */
export const getMessageTypeName = (type: string): string => {
  return MESSAGE_TYPE_MAP[type as keyof typeof MESSAGE_TYPE_MAP] || '未知类型';
};

/**
 * 获取优先级显示名称
 */
export const getPriorityName = (priority: number): string => {
  return PRIORITY_MAP[priority] || '普通';
};

/**
 * 获取状态显示名称
 */
export const getStatusName = (status: number): string => {
  return STATUS_MAP[status] || '未知';
};

/**
 * 格式化消息内容（截断过长内容）
 */
export const formatMessageContent = (content: string, maxLength = 50): string => {
  return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
};

/**
 * 格式化时间显示
 */
export const formatCreateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('zh-CN');
};

/**
 * 准备图片数据
 */
export const prepareImageData = (
  userId: string,
  stats: { total: number; unread: number; read: number },
  messages: Message[],
  pagination: { page: number; totalPages: number; total: number }
) => {
  return {
    userId,
    stats: {
      total: stats.total,
      unread: stats.unread,
      read: stats.read
    },
    messages: messages.map(msg => ({
      id: msg.id,
      title: msg.title,
      content: formatMessageContent(msg.content),
      type: getMessageTypeName(msg.type),
      priority: getPriorityName(msg.priority),
      status: getStatusName(msg.status),
      createTime: formatCreateTime(msg.createTime),
      sender: msg.senderName || '系统'
    })),
    pagination: {
      current: pagination.page,
      total: pagination.totalPages,
      totalMessages: pagination.total
    }
  };
};

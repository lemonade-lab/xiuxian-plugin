import { readExchange, writeExchange } from '@src/model/trade';
import { addNajieThing } from '@src/model/najie';
import { ExchangeRecord } from '@src/types';
import { keysLock } from '@src/model';
import { withLock } from '@src/model/locks';

interface LegacyExchangeRecord {
  now_time: number;
  qq: string;
  thing: {
    name: string;
    class: string;
    pinji: string | number;
  };
  aconut: number;
}

interface ProcessResult {
  success: boolean;
  processedCount: number;
  errorCount: number;
  message: string;
}

/**
 * 基础配置常量
 */
const BASE_CONFIG = {
  EXCHANGE_EXPIRY_DAYS: 3,
  MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000
} as const;

/**
 * 检查是否为旧格式记录
 * @param record 兑换记录
 * @returns 是否为旧格式
 */
const isLegacyRecord = (record: any): record is LegacyExchangeRecord => {
  return record && typeof record === 'object' && 'now_time' in record;
};

/**
 * 计算记录的天数差
 * @param recordTime 记录时间
 * @param currentTime 当前时间
 * @returns 天数差
 */
const calculateDaysDifference = (recordTime: number, currentTime: number): number => {
  const timeDifference = currentTime - recordTime;

  return timeDifference / BASE_CONFIG.MILLISECONDS_PER_DAY;
};

/**
 * 处理单个旧格式记录
 * @param record 旧格式记录
 * @param currentTime 当前时间
 * @returns 是否处理成功
 */
const processLegacyRecord = async (record: LegacyExchangeRecord, currentTime: number): Promise<boolean> => {
  try {
    const daysDifference = calculateDaysDifference(record.now_time, currentTime);

    // 如果未超过3天，跳过处理
    if (daysDifference < BASE_CONFIG.EXCHANGE_EXPIRY_DAYS) {
      return false;
    }

    const userId = record.qq;
    const item = record.thing;
    const quantity = record.aconut;

    // 发放物品到用户纳戒
    await addNajieThing(userId, item.name, item.class, quantity, Number(item.pinji));

    return true;
  } catch (error) {
    logger.error(error);

    return false;
  }
};

/**
 * 处理旧格式兑换记录
 * @param records 兑换记录列表
 * @param currentTime 当前时间
 * @returns 处理结果
 */
const processLegacyRecords = async (records: LegacyExchangeRecord[], currentTime: number): Promise<ProcessResult> => {
  let processedCount = 0;
  let errorCount = 0;
  const validRecords: LegacyExchangeRecord[] = [];

  for (const record of records) {
    try {
      const success = await processLegacyRecord(record, currentTime);

      if (success) {
        processedCount++;
      } else {
        // 如果处理失败或未过期，保留记录
        validRecords.push(record);
      }
    } catch (error) {
      logger.error(error);
      errorCount++;
      // 处理出错时保留记录，避免数据丢失
      validRecords.push(record);
    }
  }

  return {
    success: processedCount > 0 || errorCount === 0,
    processedCount,
    errorCount,
    message: `处理了 ${processedCount} 条过期记录，${errorCount} 条记录处理失败`
  };
};

/**
 * 验证记录格式
 * @param records 兑换记录列表
 * @returns 是否为旧格式记录列表
 */
const validateLegacyFormat = (records: any[]): records is LegacyExchangeRecord[] => {
  if (!records || records.length === 0) {
    return false;
  }

  // 检查第一条记录是否包含旧格式字段
  return isLegacyRecord(records[0]);
};

const startTask = async () => {
  try {
    // 读取兑换记录
    const exchangeRecords: ExchangeRecord[] = await readExchange();
    const currentTime = Date.now();

    // 检查是否为旧格式记录
    if (!validateLegacyFormat(exchangeRecords)) {
      return {
        success: true,
        processedCount: 0,
        errorCount: 0,
        message: '没有需要处理的旧格式兑换记录'
      };
    }

    // 处理旧格式记录
    await processLegacyRecords(exchangeRecords, currentTime);

    // 过滤出未过期的记录
    const validRecords = exchangeRecords.filter(record => {
      if (!isLegacyRecord(record)) {
        return true; // 保留非旧格式记录
      }

      const daysDifference = calculateDaysDifference(record.now_time, currentTime);

      return daysDifference < BASE_CONFIG.EXCHANGE_EXPIRY_DAYS;
    });

    // 写回更新后的记录
    await writeExchange(validRecords);
  } catch (error) {
    logger.error(error);
  }
};

// 使用锁
const executeBossBattleWithLock = async () => {
  const lockKey = keysLock.task('ExchangeTask');

  const result = await withLock(
    lockKey,
    async () => {
      await startTask();
    },
    {
      timeout: 1000 * 25, // 25秒超时
      retryDelay: 100, // 100ms重试间隔
      maxRetries: 0, // 不重试
      enableRenewal: true, // 启用锁续期
      renewalInterval: 1000 * 10 // 10秒续期间隔
    }
  );

  if (!result.success) {
    logger.warn('ExchangeTask lock failed:', result.error);
  }
};

/**
 * 兑换任务 - 处理兑换记录
 * 读取兑换记录，检查过期记录并发放物品到用户纳戒
 * 多个机器人使用一个数据，
 * 需要锁来保持数据一致性
 */
export const ExchangeTask = () => {
  // 随机 延迟 [5,35] 秒再执行。
  const delay = Math.floor(Math.random() * (35 - 5 + 1)) + 5;

  setTimeout(() => {
    void executeBossBattleWithLock();
  }, delay * 1000);
};

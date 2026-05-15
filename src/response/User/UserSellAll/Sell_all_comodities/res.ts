import { Text, useMessage, useSubscribe, format, onResponse, logger } from 'alemonjs';

import { existplayer, addCoin, sleep, keys } from '@src/model/index';
import { batchAddNajieThings } from '@src/model/najie';

import { selects } from '@src/response/mw-captcha';
import type { NajieCategory } from '@src/types/model';
export const regular = /^(#|＃|\/)?一键出售(.*)$/;

/**
 * 根据实际出售成功的物品计算总灵石价格
 * @param soldItems 实际出售成功的物品数组
 * @param originalNajie 原始纳戒数据，用于获取物品的出售价
 * @returns 总灵石价格
 */
function calculateSoldItemsPrice(
  soldItems: Array<{
    name: string;
    count: number;
    category: string;
    pinji?: number;
  }>,
  originalNajie: any
): number {
  let totalPrice = 0;

  for (const soldItem of soldItems) {
    const category = soldItem.category;
    const list = originalNajie[category];

    if (!Array.isArray(list)) {
      continue;
    }

    // 查找对应的物品获取出售价
    // 对于装备类物品，需要同时匹配名称和品阶才能确定唯一物品
    let item: any;

    if (category === '装备' && soldItem.pinji !== undefined) {
      // 装备类物品：同时匹配名称和品阶
      item = list.find((l: any) => l?.name === soldItem.name && l.pinji === soldItem.pinji);
    } else {
      // 非装备类物品：仅匹配名称
      item = list.find((l: any) => l?.name === soldItem.name);
    }

    if (item && typeof item.出售价 === 'number') {
      // soldItem.count是负数，表示减少的数量
      const soldQuantity = Math.abs(soldItem.count);

      totalPrice += item.出售价 * soldQuantity;
    }
  }

  return totalPrice;
}

const res = onResponse(selects, async e => {
  const [message] = useMessage(e);
  const userId = e.UserId;
  // 有无存档
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  const najie = await getDataJSONParseByKey(keys.najie(userId));

  if (!najie) {
    return false;
  }
  let wupin: NajieCategory[] = ['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮'];
  const wupin1: NajieCategory[] = [];

  if (e.MessageText !== '#一键出售') {
    let thing = e.MessageText.replace(/^(#|＃|\/)?/, '');

    for (const i of wupin) {
      if (thing === i) {
        wupin1.push(i);
        thing = thing.replace(i, '');
      }
    }
    if (thing.length === 0) {
      wupin = wupin1;
    } else {
      return false;
    }

    // 收集所有要出售的物品
    const itemsToSell: Array<{
      name: string;
      count: number;
      category: NajieCategory;
      pinji?: number;
    }> = [];

    for (const i of wupin) {
      const list = najie[i];

      if (!Array.isArray(list)) {
        continue;
      }
      for (const l of list as Array<{
        name: string;
        islockd?: number;
        数量?: number;
        出售价?: number;
        class?: string;
        pinji?: number;
      }>) {
        if (l && (l.islockd ?? 0) === 0) {
          const quantity = typeof l.数量 === 'number' ? l.数量 : 0;
          const cls = (l.class as NajieCategory) || i;

          if (quantity > 0) {
            itemsToSell.push({
              name: l.name,
              count: -quantity, // 负数表示减少
              category: cls,
              pinji: l.pinji
            });
            // 价格计算将基于实际出售成功的物品进行
          }
        }
      }
    }

    // 批量处理物品出售，获取实际出售成功的物品
    let actualSoldItems: Array<{
      name: string;
      count: number;
      category: string;
      pinji?: number;
    }> = [];

    if (itemsToSell.length > 0) {
      actualSoldItems = await batchAddNajieThings(userId, itemsToSell);
    }

    // 根据实际出售成功的物品计算灵石价格
    const actualPrice = calculateSoldItemsPrice(actualSoldItems, najie);

    await addCoin(userId, actualPrice);
    void message.send(format(Text(`出售成功!  获得${actualPrice}灵石 `)));

    return false;
  }
  let goodsNum = 0;
  const goods: string[] = [];

  goods.push('正在出售:');
  for (const i of wupin) {
    const list = najie[i];

    if (!Array.isArray(list)) {
      continue;
    }
    for (const l of list as Array<{
      name: string;
      islockd?: number;
      数量?: number;
      pinji?: number;
    }>) {
      if (l && (l.islockd ?? 0) === 0) {
        const quantity = typeof l.数量 === 'number' ? l.数量 : 0;

        // 对于装备类物品，显示品阶信息以便区分同名不同品阶的装备
        let displayName = l.name;

        if (i === '装备' && l.pinji !== undefined) {
          displayName += `(${l.pinji}品)`;
        }

        goods.push('\n' + displayName + '*' + quantity);
        goodsNum++;
      }
    }
  }
  if (goodsNum === 0) {
    void message.send(format(Text('没有东西可以出售')));

    return false;
  }
  goods.push('\n回复[1]出售,回复[0]取消出售');
  /** 设置上下文 */
  for (let i = 0; i < goods.length; i += 8) {
    void message.send(format(Text(goods.slice(i, i + 8).join(''))));
    await sleep(500);
  }
  const [subscribe] = useSubscribe(e, selects);
  const sub = subscribe.mount(
    async event => {
      clearTimeout(timeout);
      const [message] = useMessage(event);
      const new_msg = event.MessageText;
      const confirm = new_msg === '1';

      if (!confirm) {
        void message.send(format(Text('已取消出售')));

        return;
      }
      const userId = event.UserId;
      const najie2 = await getDataJSONParseByKey(keys.najie(userId));

      if (!najie2) {
        void message.send(format(Text('数据缺失，出售失败')));

        return;
      }
      const wupin: NajieCategory[] = ['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮'];

      // 收集所有要出售的物品
      const itemsToSell: Array<{
        name: string;
        count: number;
        category: NajieCategory;
        pinji?: number;
      }> = [];

      for (const i of wupin) {
        const list = najie2[i];

        if (!Array.isArray(list)) {
          continue;
        }
        for (const l of list as Array<{
          name: string;
          islockd?: number;
          数量?: number;
          出售价?: number;
          class?: string;
          pinji?: number;
        }>) {
          if (l && (l.islockd ?? 0) === 0) {
            const quantity = typeof l.数量 === 'number' ? l.数量 : 0;
            const cls = (l.class as NajieCategory) || i;

            if (quantity > 0) {
              itemsToSell.push({
                name: l.name,
                count: -quantity, // 负数表示减少
                category: cls,
                pinji: l.pinji
              });
              // 价格计算将基于实际出售成功的物品进行
            }
          }
        }
      }

      // 批量处理物品出售，获取实际出售成功的物品
      let actualSoldItems: Array<{
        name: string;
        count: number;
        category: string;
        pinji?: number;
      }> = [];

      if (itemsToSell.length > 0) {
        actualSoldItems = await batchAddNajieThings(userId, itemsToSell);
      }

      // 根据实际出售成功的物品计算灵石价格
      const actualPrice = calculateSoldItemsPrice(actualSoldItems, najie2);

      await addCoin(userId, actualPrice);
      void message.send(format(Text(`出售成功!  获得${actualPrice}灵石 `)));
    },
    ['UserId']
  );
  const timeout = setTimeout(
    () => {
      try {
        subscribe.cancel(sub);
        void message.send(format(Text('超时自动取消出售')));
      } catch (e) {
        logger.error('取消订阅失败', e);
      }
    },
    1000 * 60 * 1
  );
});

import mw from '@src/response/mw-captcha';
import { getDataJSONParseByKey } from '@src/model/DataControl';
export default onResponse(selects, [mw.current, res.current]);

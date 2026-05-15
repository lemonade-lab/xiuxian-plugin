import { Text, useSend } from 'alemonjs';

import { readShop, writeShop } from '@src/model/index';
import type { ShopData } from '@src/types';

import mw, { selects } from '@src/response/mw-captcha';
import { getDataList } from '@src/model/DataList';
export const regular = /^(#|＃|\/)?重置.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (!e.IsMaster) {
    return false;
  }

  const didian = e.MessageText.replace(/^(#|＃|\/)?重置/, '').trim();

  if (!didian) {
    void Send(Text('请在指令后填写要重置的商店名称'));

    return false;
  }

  let shop: ShopData;

  try {
    shop = await readShop();
  } catch {
    const shopList = await getDataList('Shop');

    await writeShop(shopList);
    shop = await readShop();
  }

  const idx = shop.findIndex(s => s.name === didian);

  if (idx === -1) {
    return false;
  }

  type ShopSlot = ShopData[number];
  type ShopSlotWithState = ShopSlot & { state?: number };
  const slot = shop[idx] as ShopSlotWithState;

  slot.state = 0;
  await writeShop(shop);
  void Send(Text(`重置成功: ${didian}`));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);

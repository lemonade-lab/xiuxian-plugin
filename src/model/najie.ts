import { writeNajie, readNajie } from './xiuxiandata.js';
import * as _ from 'lodash-es';
import type { Najie, NajieItem, Equipment, EquipmentItem } from '../types/player.js';
import type { EquipmentLike, XianchongLike, XianchongSource, NajieCategory } from '../types/model';
import { getDataList } from './DataList.js';
import { readEquipment, writeEquipment } from './equipment.js';

/**
 * 将数量规范化为整数
 * - 非有限数字返回 0
 * - 浮点数向零截断为整数（Math.trunc）
 * - 负数原样保留，用于扣减
 */
function normalizeCount(count: number): number {
  if (typeof count !== 'number' || !Number.isFinite(count)) {
    return 0;
  }

  return Math.trunc(count);
}

/**
 * 更新纳戒物品
 * @param userId 玩家QQ
 * @param thingName 物品名称
 * @param thingClass 物品类型
 * @param thingPinji 物品等级
 * @param lock 物品是否锁定
 * @returns
 */
export async function updateBagThing(
  userId: string,
  thingName: string,
  thingClass: NajieCategory,
  thingPinji: number | undefined,
  lock: number
): Promise<boolean> {
  const najie: Najie | null = await readNajie(userId);

  if (!najie) {
    return false;
  }

  // 确保 thingClass 对应的数组存在
  if (!Array.isArray(najie[thingClass])) {
    najie[thingClass] = [];
  }

  if (thingClass === '装备' && (thingPinji || thingPinji === 0)) {
    for (const i of najie['装备']) {
      if (i.name === thingName && i.pinji === thingPinji) {
        i.islockd = lock;
      }
    }
  } else {
    for (const i of najie[thingClass]) {
      if (i.name === thingName) {
        i.islockd = lock;
      }
    }
  }
  await writeNajie(userId, najie);

  return true;
}

/**
 * 检查物品是否存在于纳戒中
 * @param userId 玩家QQ
 * @param thingName 物品名称
 * @param thingClass 物品类型
 * @param thingPinji 物品等级
 * @returns
 */
export async function existNajieThing(userId: string, thingName: string, thingClass: NajieCategory, thingPinji = 0): Promise<number | false> {
  const najie: Najie | null = await readNajie(userId);

  if (!najie) {
    return false;
  }
  let ifexist: NajieItem | undefined;

  if (thingClass === '装备' && (thingPinji || thingPinji === 0)) {
    const equipList = Array.isArray(najie.装备) ? najie.装备 : [];

    ifexist = equipList.find(item => item.name === thingName && item.pinji === thingPinji);
  } else {
    const type: NajieCategory[] = ['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮'];

    for (const cat of type) {
      const list = najie[cat];

      if (!Array.isArray(list)) {
        continue;
      }
      ifexist = list.find(item => item.name === thingName);
      if (ifexist) {
        break;
      }
    }
  }
  if (ifexist) {
    return ifexist.数量 ?? 0;
  }

  return false;
}

/**
 * 添加物品到Najie
 * @param userId 玩家QQ
 * @param name 物品名称
 * @param thingClass 物品类型
 * @param x 物品数量
 * @param pinji 物品等级
 * @returns
 */
export async function addNajieThing(
  userId: string,
  name: string | EquipmentLike | XianchongLike,
  category: NajieCategory,
  count: number,
  pinji?: number
): Promise<void> {
  /**
   * 数量必须为整数（内部统一截断为整数）
   */
  count = normalizeCount(count);

  if (count === 0) {
    return;
  }

  // 处理对象类型的输入
  if (typeof name === 'object') {
    const najie: Najie | null = await readNajie(userId);

    if (!najie) {
      return;
    }

    // 判断“同名同品级”是否已存在
    let existItem: NajieItem | undefined;

    if (category === '装备') {
      const eqPinji = (name as EquipmentLike).pinji ?? pinji ?? 0;

      existItem = najie[category].find(item => item.name === (name).name && item.pinji === eqPinji);
    } else {
      existItem = najie[category].find(item => item.name === (name).name);
    }

    if (existItem) {
      // 已有则叠加数量
      existItem.数量 = normalizeCount((existItem.数量 ?? 0) + count);
      if (existItem.数量 < 0) {
        existItem.数量 = 0;
      }
    } else {
      // 没有则插入
      const obj = { ...name };

      obj.数量 = count;
      obj.islockd = 0;
      if (category === '装备') {
        // 如果有品阶就添加品阶，否则随机生成一个品阶
        obj.pinji = (name as EquipmentLike).pinji ?? pinji ?? Math.floor(Math.random() * 7);
      }
      najie[category].push(obj);
    }

    // 清理数量为0的
    najie[category] = najie[category].filter(item => (item.数量 ?? 0) > 0);

    //
    await writeNajie(userId, najie);

    return;
  }

  // 处理字符串类型的输入
  await batchAddNajieThings(userId, [
    {
      name: name,
      count: count,
      category: category,
      pinji
    }
  ]);
}

/**
 * 替换装备
 * @param usrId 玩家QQ
 * @param equipmentData 装备数据
 * @returns
 */
export async function insteadEquipment(usrId: string, equipmentData: EquipmentLike) {
  await addNajieThing(usrId, equipmentData, '装备', -1, equipmentData.pinji);
  const equipment: Equipment | null = await readEquipment(usrId);

  if (!equipment) {
    return;
  }
  if (equipmentData.type === '武器') {
    await addNajieThing(
      usrId,
      {
        ...equipment.武器,
        name: equipment.武器.name ?? '武器',
        class: '装备',
        数量: 1,
        出售价: (equipment.武器 as any).出售价 || 0
      },
      '装备',
      1,
      equipment.武器.pinji
    );
    equipment.武器 = equipmentData as EquipmentItem;
    await writeEquipment(usrId, equipment);

    return;
  }
  if (equipmentData.type === '护具') {
    await addNajieThing(
      usrId,
      {
        ...equipment.护具,
        name: equipment.护具.name ?? '护具',
        class: '装备',
        数量: 1,
        出售价: (equipment.护具 as any).出售价 || 0
      },
      '装备',
      1,
      equipment.护具.pinji
    );
    equipment.护具 = equipmentData as EquipmentItem;
    await writeEquipment(usrId, equipment);

    return;
  }
  if (equipmentData.type === '法宝') {
    await addNajieThing(
      usrId,
      {
        ...equipment.法宝,
        name: equipment.法宝.name ?? '法宝',
        class: '装备',
        数量: 1,
        出售价: (equipment.法宝 as any).出售价 || 0
      },
      '装备',
      1,
      equipment.法宝.pinji
    );
    equipment.法宝 = equipmentData as EquipmentItem;
    await writeEquipment(usrId, equipment);
  }
}

/**
 * 批量添加物品到纳戒
 * @param userId 玩家QQ
 * @param items 物品数组，每个物品包含 name、count、category 属性
 * @returns Promise<Array<{name: string; count: number; category: NajieCategory; pinji?: number}>> 返回操作成功的items数组
 */
export async function batchAddNajieThings(
  userId: string,
  items: Array<{
    name: string;
    count: number;
    category: NajieCategory;
    pinji?: number;
  }>
): Promise<
  Array<{
    name: string;
    count: number;
    category: NajieCategory;
    pinji?: number;
  }>
> {
  if (!items || items.length === 0) {
    return [];
  }

  const najie: Najie | null = await readNajie(userId);

  if (!najie) {
    return [];
  }

  // 跟踪操作成功的items
  const successfulItems: Array<{
    name: string;
    count: number;
    category: NajieCategory;
    pinji?: number;
  }> = [];

  // 按分类分组处理，减少数据库写入次数
  const categoryGroups = new Map<
    NajieCategory,
    Array<{
      name: string;
      count: number;
      pinji?: number;
    }>
  >();

  // 分组物品（数量截断为整数，0 则跳过）
  for (const item of items) {
    const normalized = normalizeCount(item.count);

    if (normalized === 0) {
      continue;
    }

    if (!categoryGroups.has(item.category)) {
      categoryGroups.set(item.category, []);
    }
    categoryGroups.get(item.category)!.push({
      name: item.name,
      count: normalized,
      pinji: item.pinji
    });
  }

  // 从数据源查找物品信息（仅用于添加新物品时验证）
  const data: any[] = [];

  data[0] = await getDataList('Danyao');
  data[1] = await getDataList('NewDanyao');
  data[2] = await getDataList('TimeDanyao');
  data[3] = await getDataList('Daoju');
  data[4] = await getDataList('Gongfa');
  data[5] = await getDataList('TimeGongfa');
  data[6] = await getDataList('Caoyao');
  data[7] = await getDataList('Xianchonkouliang');
  data[8] = await getDataList('Duanzhaocailiao');

  const equipmentData: any[] = [];

  equipmentData[0] = await getDataList('Equipment');
  equipmentData[1] = await getDataList('TimeEquipment');
  equipmentData[2] = await getDataList('Duanzhaowuqi');
  equipmentData[3] = await getDataList('Duanzhaohuju');
  equipmentData[4] = await getDataList('Duanzhaobaowu');
  equipmentData[5] = await getDataList('Xuanwu');

  const xianchonData = await getDataList('Xianchon');

  // 按分类批量处理
  for (const [category, categoryItems] of categoryGroups) {
    // 确保分类数组存在
    if (!Array.isArray(najie[category])) {
      najie[category] = [];
    }

    for (const item of categoryItems) {
      const { name, count, pinji } = item;
      let success = false;

      if (category === '装备') {
        success = processEquipmentItem(equipmentData, najie, name, count, pinji);
      } else if (category === '仙宠') {
        success = processPetItem(xianchonData, najie, name, count);
      } else {
        success = processNormalItem(data, najie, name, count, category);
      }

      // 如果操作成功，添加到成功列表中
      if (success) {
        successfulItems.push({
          name,
          count,
          category,
          pinji
        });
      }
    }
  }

  // 清理数量为0的物品
  for (const category of Object.keys(najie)) {
    if (Array.isArray(najie[category as NajieCategory])) {
      najie[category as NajieCategory] = najie[category as NajieCategory].filter((item: NajieItem) => (item.数量 ?? 0) > 0);
    }
  }

  // 一次性写入数据库
  await writeNajie(userId, najie);

  // 返回操作成功的items数组
  return successfulItems;
}

/**
 * 处理装备类物品
 * 备注：数量必须为整数，内部统一截断为整数
 * @returns boolean 返回操作是否成功
 */
function processEquipmentItem(data: any[], najie: Najie, name: string, count: number, pinji?: number): boolean {
  count = normalizeCount(count);
  if (!pinji && pinji !== 0) {
    pinji = Math.trunc(Math.random() * 6);
  }
  const z = [0.8, 1, 1.1, 1.2, 1.3, 1.5, 2];

  // 检查纳戒中是否已存在
  const existing = najie.装备.find(item => item.name === name && item.pinji === pinji);

  if (existing) {
    // 如果装备已存在，直接更新数量（支持增减）
    existing.数量 = Math.max(0, normalizeCount((existing.数量 ?? 0) + count));

    return true;
  } else if (count > 0) {
    // 如果装备不存在且count > 0，需要从数据表中验证并创建新装备条目
    for (const i of data) {
      if (!Array.isArray(i)) {
        continue;
      }
      const thing = (i as NajieItem[]).find(item => item.name === name);

      if (thing) {
        const equ = _.cloneDeep(thing) as EquipmentLike;

        equ.pinji = pinji;

        if (typeof equ.atk === 'number') {
          equ.atk *= z[pinji];
        }
        if (typeof equ.def === 'number') {
          equ.def *= z[pinji];
        }
        if (typeof equ.HP === 'number') {
          equ.HP *= z[pinji];
        }

        equ.数量 = count;
        equ.islockd = 0;
        najie.装备.push(equ);

        return true;
      }
    }
  }

  return false;
}

/**
 * 处理仙宠类物品
 * 备注：数量必须为整数，内部统一截断为整数
 * @returns boolean 返回操作是否成功
 */
/**
 * 处理仙宠类物品
 * 备注：数量必须为整数，内部统一截断为整数；
 * 补全必需字段：等级、每级增加、加成、数量、islockd、class、name。
 * @param xianchonData 仙宠配置数据源（`Xianchon`）
 * @param najie 玩家纳戒对象
 * @param name 仙宠名称
 * @param count 数量（正负皆可，内部取整）
 * @returns boolean 返回操作是否成功
 */
function processPetItem(xianchonData: any[], najie: Najie, name: string, count: number): boolean {
  count = normalizeCount(count);
  // 检查纳戒中是否已存在
  const existing = najie.仙宠.find(item => item.name === name);

  if (existing) {
    // 如果仙宠已存在，直接更新数量（支持增减）
    existing.数量 = normalizeCount((existing.数量 ?? 0) + count);

    return true;
  } else if (count > 0) {
    // 如果仙宠不存在且 count > 0，需要从数据表中验证并创建新仙宠条目
    const thing = xianchonData.find((item: XianchongSource) => item.name === name);

    if (thing) {
      const copied = _.cloneDeep(thing) as XianchongSource;
      // 等级默认 1；每级增加优先使用 `每级增加`，其次 `初始加成`
      const level = typeof copied.等级 === 'number' ? Math.trunc(copied.等级) : 1;
      const per = typeof copied.每级增加 === 'number' ? copied.每级增加 : typeof (copied as any).初始加成 === 'number' ? (copied as any).初始加成 : 0;
      const bonus = level * (per || 0);

      const petItem: XianchongLike = {
        ...copied,
        等级: level,
        每级增加: per,
        加成: bonus,
        数量: count,
        islockd: 0,
        class: copied.class ?? '仙宠',
        name: copied.name
      };

      najie.仙宠.push(petItem);

      return true;
    }
  }

  return false;
}

/**
 * 处理普通物品（丹药、道具、功法、草药、材料、仙宠口粮）
 * 备注：数量必须为整数，内部统一截断为整数
 * @returns boolean 返回操作是否成功
 */
function processNormalItem(data: any[], najie: Najie, name: string, count: number, category: NajieCategory): boolean {
  count = normalizeCount(count);
  // 检查纳戒中是否已存在
  const existing = najie[category].find(item => item.name === name);

  if (existing) {
    // 如果物品已存在，直接更新数量（支持增减）
    existing.数量 = normalizeCount((existing.数量 ?? 0) + count);

    return true;
  } else if (count > 0) {
    // 如果物品不存在且count > 0，需要从数据表中验证并创建新物品条目
    for (const i of data) {
      if (!Array.isArray(i)) {
        continue;
      }
      const thing = (i as NajieItem[]).find(item => item.name === name);

      if (thing) {
        const newItem = { ...thing };

        newItem.数量 = count;
        newItem.islockd = 0;
        najie[category].push(newItem);

        return true;
      }
    }
  }

  return false;
}

export default {
  updateBagThing,
  existNajieThing,
  addNajieThing,
  insteadEquipment,
  batchAddNajieThings
};

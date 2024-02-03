import { data } from '../base/data'
import { Read_najie, Read_player, Read_qinmidu, Read_shitu } from './read'
import { Write_najie, Write_player, Write_qinmidu, Write_shitu } from './write'
import { isNotNull } from '../utils'

export async function Add_najie_灵石(usr_qq, lingshi) {
  let najie = await Read_najie(usr_qq)
  najie.灵石 += Math.trunc(lingshi)
  await Write_najie(usr_qq, najie)
  return
}

//now_exp数量和灵石数量正增加,负减少
//使用时记得加await
export async function Add_money(usr_qq, 灵石数量 = 0) {
  let player = await Read_player(usr_qq)
  player.灵石 += Math.trunc(灵石数量)
  await Write_player(usr_qq, player)
  return
}

export async function Add_now_exp(usr_qq, now_exp数量 = 0) {
  let player = await Read_player(usr_qq)
  player.now_exp += Math.trunc(now_exp数量)
  await Write_player(usr_qq, player)
  return
}
export async function Add_魔道值(usr_qq, 魔道值 = 0) {
  let player = await Read_player(usr_qq)
  player.魔道值 += Math.trunc(魔道值)
  await Write_player(usr_qq, player)
  return
}
export async function Add_血气(usr_qq, 血气 = 0) {
  let player = await Read_player(usr_qq)
  player.血气 += Math.trunc(血气)
  await Write_player(usr_qq, player)
  return
}
export async function Add_HP(usr_qq, blood = 0) {
  let player = await Read_player(usr_qq)
  player.now_bool += Math.trunc(blood)
  if (player.now_bool > player.血量上限) {
    player.now_bool = player.血量上限
  }
  if (player.now_bool < 0) {
    player.now_bool = 0
  }
  await Write_player(usr_qq, player)
  return
}
/**
 *
 * @param {*} usr_qq 用户qq
 * @param {*} exp 经验值
 * @returns
 */
export async function Add_职业经验(usr_qq, exp = 0) {
  let player = await Read_player(usr_qq)
  if (exp == 0) {
    return
  }
  exp = player.occupation_exp + exp
  let level = player.occupation_level
  while (true) {
    let need_exp = data.occupation_exp_list.find(
      (item) => item.id == level
    ).experience
    if (need_exp > exp) {
      break
    } else {
      exp -= need_exp
      level++
    }
  }
  player.occupation_exp = exp
  player.occupation_level = level
  await Write_player(usr_qq, player)
  return
}

/**
 * 增加减少纳戒内物品
 * @param usr_qq 操作存档theqq号
 * @param thing_name  仙宠名称
 * @param n  操作the数量,取+增加,取 -减少
 * @param thing_level  仙宠等级
 * @returns 无
 */
export async function Add_仙宠(usr_qq, thing_name, n, thing_level = null) {
  let x = Number(n)
  if (x == 0) {
    return
  }
  let najie = await Read_najie(usr_qq)
  let trr = najie.仙宠.find(
    (item) => item.name == thing_name && item.等级 == thing_level
  )
  let name = thing_name
  if (x > 0 && !isNotNull(trr)) {
    //无中生有
    let newthing = data.xianchon.find((item) => item.name == name)
    if (!isNotNull(newthing)) {
      console.log('没有这个东西')
      return
    }
    if (thing_level != null) {
      newthing.等级 = thing_level
    }
    najie.仙宠.push(newthing)
    najie.仙宠.find(
      (item) => item.name == name && item.等级 == newthing.等级
    ).数量 = x
    let xianchon = najie.仙宠.find(
      (item) => item.name == name && item.等级 == newthing.等级
    )
    najie.仙宠.find(
      (item) => item.name == name && item.等级 == newthing.等级
    ).加成 = xianchon.等级 * xianchon.每级增加
    najie.仙宠.find(
      (item) => item.name == name && item.等级 == newthing.等级
    ).islockd = 0
    await Write_najie(usr_qq, najie)
    return
  }
  najie.仙宠.find((item) => item.name == name && item.等级 == trr.等级).数量 +=
    x
  if (
    najie.仙宠.find((item) => item.name == name && item.等级 == trr.等级).数量 <
    1
  ) {
    //假如用完了,需要删掉数组中the元素,用.filter()把!=该元素the过滤出来
    najie.仙宠 = najie.仙宠.filter(
      (item) => item.name != thing_name || item.等级 != trr.等级
    )
  }
  await Write_najie(usr_qq, najie)
  return
}

export async function fstadd_qinmidu(A, B) {
  let qinmidu
  try {
    qinmidu = await Read_qinmidu()
  } catch {
    //没有表要先建立一个！
    await Write_qinmidu([])
    qinmidu = await Read_qinmidu()
  }
  let player = {
    QQ_A: A,
    QQ_B: B,
    亲密度: 0,
    婚姻: 0
  }
  qinmidu.push(player)
  await Write_qinmidu(qinmidu)
  return
}

export async function add_qinmidu(A, B, qinmi) {
  let qinmidu
  try {
    qinmidu = await Read_qinmidu()
  } catch {
    //没有表要先建立一个！
    await Write_qinmidu([])
    qinmidu = await Read_qinmidu()
  }
  let i
  for (i = 0; i < qinmidu.length; i++) {
    if (
      (qinmidu[i].QQ_A == A && qinmidu[i].QQ_B == B) ||
      (qinmidu[i].QQ_A == B && qinmidu[i].QQ_B == A)
    ) {
      break
    }
  }
  if (i == qinmidu.length) {
    await fstadd_qinmidu(A, B)
    qinmidu = await Read_qinmidu()
  }
  qinmidu[i].亲密度 += qinmi
  await Write_qinmidu(qinmidu)
  return
}

export async function add_shitu(A, num) {
  let shitu
  try {
    shitu = await Read_shitu()
  } catch {
    //没有表要先建立一个！
    await Write_shitu([])
    shitu = await Read_shitu()
  }
  let i
  for (i = 0; i < shitu.length; i++) {
    if (shitu[i].A == A) {
      break
    }
  }
  if (i == shitu.length) {
    await fstadd_shitu(A)
    shitu = await Read_shitu()
  }
  shitu[i].收徒 += num
  await Write_shitu(shitu)
  return
}

export async function fstadd_shitu(A) {
  let shitu
  try {
    shitu = await Read_shitu()
  } catch {
    //没有表要先建立一个！
    await Write_shitu([])
    shitu = await Read_shitu()
  }
  let player = {
    师傅: A,
    收徒: 0,
    未出师徒弟: 0,
    任务阶段: 0,
    renwu1: 0,
    renwu2: 0,
    renwu3: 0,
    师徒BOOS剩余血量: 100000000,
    已出师徒弟: []
  }
  shitu.push(player)
  await Write_shitu(shitu)
  return
}

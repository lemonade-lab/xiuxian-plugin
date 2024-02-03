import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import data from './XiuxianData.js'
import { Write_player } from './xiuxian.js'
import { __PATH } from './PATH.js'

export function settripod(qq) {
  let tripod1
  try {
    tripod1 = Read_tripod()
  } catch {
    Write_duanlu([])
    tripod1 = Read_tripod()
  }
  const A = looktripod(qq)
  if (A != 1) {
    const newtripod = {
      qq: qq,
      煅炉: 0,
      容纳量: 10,
      材料: [],
      数量: [],
      TIME: 0,
      时长: 30000,
      状态: 0,
      预计时长: 0
    }
    tripod1.push(newtripod)
    Write_duanlu(tripod1)
  }
  //增加锻造天赋
  const player = data.getData('player', qq)
  let tianfu = Math.floor(40 * Math.random() + 80)
  player.锻造天赋 = tianfu
  //增加隐藏灵根
  const a = readall('隐藏灵根')
  const newa = Math.floor(Math.random() * a.length)
  player.隐藏灵根 = a[newa]
  Write_player(qq, player)
  return `获得煅炉，天赋[${player.锻造天赋}],隐藏灵根为[${player.隐藏灵根.name}]`
}

export function looktripod(qq) {
  let tripod
  try {
    tripod = Read_tripod()
  } catch {
    Write_duanlu([])
    tripod = Read_tripod()
  }
  for (let item of tripod) {
    if (qq == item.qq) {
      return 1
    }
  }
  return 0
}

export function Read_mytripod(qq) {
  let tripod
  try {
    tripod = Read_tripod()
  } catch {
    Write_duanlu([])
    tripod = Read_tripod()
  }
  for (let item of tripod) {
    if (qq == item.qq) {
      return item
    }
  }
}

export function Read_tripod() {
  return JSON.parse(readFileSync(join(`${__PATH.duanlu}/duanlu.json`), 'utf8'))
}

export function Write_duanlu(duanlu) {
  writeFileSync(
    join(__PATH.duanlu, `duanlu.json`),
    JSON.stringify(duanlu),
    'utf8'
  )
  return
}

//数量矫正, 违规数量改成1
export function jiaozheng(value) {
  let size = value
  if (isNaN(parseFloat(size)) && !isFinite(size)) {
    return Number(1)
  }
  size = Number(Math.trunc(size))
  if (size == null || size == undefined || size < 1 || isNaN(size)) {
    return Number(1)
  }
  return Number(size)
}

//读取item 中某个json文件中的属性
export function readthat(thing_name, weizhi) {
  const weizhi1 = JSON.parse(
    readFileSync(join(`${__PATH.lib_path}/${weizhi}.json`), 'utf8')
  )
  for (const item of weizhi1) {
    if (item.name == thing_name) {
      return item
    }
  }
  return
}

export function readall(weizhi) {
  return JSON.parse(
    readFileSync(join(`${__PATH.lib_path}/${weizhi}.json`), 'utf8')
  )
}

export function getxuanze(shuju, linggentype) {
  let i
  const shuzu = [1, 2, 3, 4, 5]
  const wuxing = ['金', '木', '土', '水', '火', '金', '木', '土', '水', '火']
  const b = ['金', '木', '土', '水', '火']
  let a
  let c = []
  for (let item in shuzu) {
    if (shuzu[item] == linggentype) {
      for (i = item; i < item + 5; i++) {
        for (let item1 of shuju) {
          if (item1 == wuxing[i]) {
            a = item1
            c.push(a)
          }
        }
      }
    }
  }
  for (let item2 in b) {
    if (b[item2] == a) {
      return [c[0], shuzu[item2]]
    }
  }
  return false
}

export function mainyuansu(shuju) {
  const B = ['金', '木', '土', '水', '火']
  for (let item in shuju) {
    if (shuju[item] != 0) {
      return B[item]
    }
  }
}

export function Restraint(shuju, main) {
  let newshuzu = []
  let shuju2 = []
  const shuzu = ['金', '木', '土', '水', '火', '金', '木', '土', '水', '火']
  for (let item in shuju) {
    if (shuju[item] != 0) {
      newshuzu.push(shuzu[item])
      shuju2.push(shuju[item])
    }
  }
  let houzui = ''
  let jiaceng
  //[ '木', '水']
  for (let item in shuzu) {
    if (
      (shuzu[item] == newshuzu[0] && shuzu[Number(item) + 1] == newshuzu[1]) ||
      (shuzu[item] == newshuzu[1] && shuzu[Number(item) + 1] == newshuzu[0])
    ) {
      houzui = `毁${main}灭灵`
      jiaceng = 0.5
      return [houzui, jiaceng]
    }

    if (
      (shuzu[item] == newshuzu[0] && shuzu[Number(item) + 2] == newshuzu[1]) ||
      (shuzu[item] == newshuzu[1] && shuzu[Number(item) + 2] == newshuzu[0])
    ) {
      if (main == newshuzu[0]) {
        houzui = `神${main}相生`
        jiaceng = 0.3
        return [houzui, jiaceng]
      } else if (main == newshuzu[1]) {
        houzui = `供${main}相生`
        jiaceng = 0.2
        return [houzui, jiaceng]
      }
    }
  }
  houzui = `地${main}双生`
  jiaceng = 0.08
  return [houzui, jiaceng]
}

export function Writeit(custom) {
  writeFileSync(
    join(__PATH.custom, `custom.json`),
    JSON.stringify(custom),
    'utf8'
  )
  return
}

export function Read_it() {
  return JSON.parse(readFileSync(join(`${__PATH.custom}/custom.json`), 'utf8'))
}

export async function alluser() {
  let B = []
  let A = readdirSync(__PATH.player_path).filter((file) =>
    file.endsWith('.json')
  )
  for (let item of A) B.push(item.substring(0, item.lastIndexOf('.')))
  return B
}

import { parse } from 'yaml'
import { readFileSync } from 'fs'
import { cwd } from '../../../config.js'

/**
 *
 * @param app
 * @param name
 * @returns
 */
export function getConfig(app: string, name: string) {
  return parse(readFileSync(`${cwd}/config/${app}/${name}.yaml`, 'utf8'))
}

/**
 * 判断对象是否不为undefined且不为null
 * @param obj 对象
 * @returns
 */
export function isNotNull(obj) {
  if (obj == undefined || obj == null) return false
  return true
}

/**
 * 对象数组排序
 * @param field
 * @returns
 */
export function sortBy(field) {
  //从大到小,b和a反一下就是从小到大
  return function (b, a) {
    return a[field] - b[field]
  }
}

/**
 * sleep
 * @param time
 * @returns
 */
export async function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

/**
 * 格式化时间显示
 * @param timeStamp
 * @returns
 */
export function getTimeStr(timeStamp) {
  return new Intl.DateTimeFormat('zh-CN', {
    second: '2-digit',
    minute: '2-digit',
    hour: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(timeStamp)
}

/**
 * 输入数组随机返回其中一个
 * @param ARR 输入the数组
 * @returns 随机返回一个元素
 */
export function get_random_fromARR(ARR) {
  return ARR[Math.trunc(Math.random() * ARR.length)]
}

/**
 * 时间转换
 * @param timestamp
 * @returns
 */
export function timestampToTime(timestamp) {
  const data = shijianc(timestamp)
  return `${data.Y}${data.M}${data.D}${data.h}${data.m}${data.s}`
}

/**
 * 根据时间戳获取年月日时分秒
 * @param time
 * @returns
 */
export function shijianc(time) {
  const date = new Date(time)
  return {
    Y: date.getFullYear(),
    M: date.getMonth() + 1,
    D: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  }
}

/**
 * 输入概率随机返回布尔类型数据
 * @param P 概率
 * @returns 随机返回 false or true
 */
export function get_random_res(P: number) {
  if (P > 1) P = 1
  if (P < 0) P = 0
  if (Math.random() < P) return true
  return false
}

/**
 *
 * @param value
 * @returns
 */
export function isNotBlank(value) {
  if (value ?? '' !== '') return true
  return false
}

import { writeArchiveData } from '../model/data.js'
import { getUserMessageByUid } from '../model/message.js'
import { ReverseEquipmentNameMap, ReverseSkillNameMap } from '../model/base.js'
import { getSkillById } from '../model/skills.js'
import { getEquipmentById } from '../model/equipment.js'
import component from '../image/index.js'
import { getUserName } from '../model/utils.js'
import { Messages } from '../import'
const message = new Messages()
message.response(/^(#|\/)?万宝楼$/, async (e) => {
  // 获取账号
  const uid = e.user_id
  // 尝试读取数据，如果没有数据将自动创建
  const data = getUserMessageByUid(uid)
  data.name = getUserName(data.name, e.sender.nickname)
  // 数据植入组件
  component.shopping(data, uid).then((img) => {
    // 获取到图片后发送
    if (typeof img !== 'boolean') e.reply(segment.image(img))
  })
  return false
})
message.response(/^(#|\/)?购买武器/, async (e) => {
  const uid = e.user_id
  const name = e.msg
    .replace(/^(#|\/)?购买武器/, '')
    .replace(/[^\u4e00-\u9fa5]/g, '')
  const ID = ReverseEquipmentNameMap[name]
  if (!ID) {
    e.reply(`此方世界没有《${name}》`)
    return
  }
  const data = getUserMessageByUid(uid)
  // 看看money
  const sData = getEquipmentById(Number(ID))
  if (data.money < sData.price) {
    e.reply(`灵石不足${sData.price}`)
    return
  }
  data.money -= sData.price
  const count = data.bags.equipments[ID]
  if (!count || count <= 0) {
    data.bags.equipments[ID] = 1
  } else {
    data.bags.equipments[ID] += 1
  }
  // 保存
  writeArchiveData('player', uid, data)
  e.reply(`购得${name}`)
  return false
})
message.response(/^(#|\/)?购买功法/, async (e) => {
  const uid = e.user_id
  const name = e.msg
    .replace(/^(#|\/)?购买功法/, '')
    .replace(/[^\u4e00-\u9fa5]/g, '')
  const ID = ReverseSkillNameMap[name]
  if (!ID) {
    e.reply(`此方世界没有《${name}》`)
    return
  }
  const data = getUserMessageByUid(uid)
  // 看看money
  const sData = getSkillById(Number(ID))
  if (data.money < sData.price) {
    e.reply(`灵石不足${sData.price}`)
    return
  }
  data.money -= sData.price
  const count = data.bags.kills[ID]
  if (!count || count <= 0) {
    data.bags.kills[ID] = 1
  } else {
    data.bags.kills[ID] += 1
  }
  // 保存
  writeArchiveData('player', uid, data)
  e.reply(`购得${name}`)
  return false
})
export default message

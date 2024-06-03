import { BaseEquipment, BaseSkill, UserMessageBase } from './base'
import { ResourcesPath } from './path'
export type UserMessageType = typeof UserMessageBase
export type DataType = {
  player: UserMessageType
}
export type ResourcesType = typeof ResourcesPath
export type SkillType = typeof BaseSkill
export type EquipmentType = typeof BaseEquipment

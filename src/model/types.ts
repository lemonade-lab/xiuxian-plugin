import { BaseEquipment, BaseSkill, UserMessageBase } from '@src/model/base'
export type UserMessageType = typeof UserMessageBase
export type DataType = {
  player: UserMessageType
}
export type SkillType = typeof BaseSkill
export type EquipmentType = typeof BaseEquipment

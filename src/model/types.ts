import { BaseEquipment, BaseSkill, UserMessageBase } from './base'
import { ArchivePath, ResourcesPath } from './path'
export type UserMessageType = typeof UserMessageBase
export type DataType = {
  player: UserMessageType
}
export type ArchiveType = typeof ArchivePath
export type ResourcesType = typeof ResourcesPath
export type SkillType = typeof BaseSkill
export type EquipmentType = typeof BaseEquipment

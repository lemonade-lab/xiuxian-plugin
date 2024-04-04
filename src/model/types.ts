import { BaseEquipment, BaseKill, UserMessageBase } from './base'
import { ArchivePath, ResourcesPath } from './path'
export type UserMessageType = typeof UserMessageBase
export type DataType = {
  player: UserMessageType
}
export type ArchiveType = typeof ArchivePath
export type ResourcesType = typeof ResourcesPath
export type KillTyle = typeof BaseKill
export type EuitmentType = typeof BaseEquipment

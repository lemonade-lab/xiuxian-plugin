export const BaseEquipment = {
  attack: 23, // 攻击
  defense: 9, // 防御
  blood: 3, // 血量
  agile: 0, // 敏捷
  critical_hit_rate: 0, // 暴击率
  critical_damage: 0 // 暴击伤害
}

// 基础境界 不会影响 双暴
export const BaseLevel = {
  attack: 200,
  defense: 100,
  blood: 300
}

// 基础修炼经验
export const BaseExperience = {
  attack: 0,
  defense: 0,
  blood: 0
}

export const UserMessageBase = {
  uid: 17377405173,
  name: '柠檬冲水',
  blood: 100,
  autograph: '无',
  money: 200,
  theme: 'dark',
  experience: 0,
  level_id: 0,
  base: BaseExperience,
  level: BaseLevel,
  equipment: BaseEquipment
}

// 淡黑，分红
export const Themes = ['dark', 'red', 'purple', 'blue']

export const ThemesColor = {
  dark: {
    left: '#f3d109a6',
    right: '#ff0000ba'
  },
  red: {
    left: '#f7da2fa6',
    right: '#ff6800ba'
  },
  purple: {
    left: '#83e139ba',
    right: '#f72020cc'
  },
  blue: {
    left: '#aadb03ba',
    right: '#f72020ba'
  }
}

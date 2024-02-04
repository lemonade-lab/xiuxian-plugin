// 体质概率
export const physical_probability = 0.2
// 伪talent概率
export const Pseudo_talent_probability = 0.37
// 真talent概率
export const True_Talent_Probability = 0.29
// 天talent概率
export const 天talent概率 = 0.08
// 圣体概率
export const 圣体概率 = 0.01
// 变异talent概率
export const 变异talent概率 =
  1 -
  physical_probability -
  Pseudo_talent_probability -
  True_Talent_Probability -
  天talent概率 -
  圣体概率
// 宗门人数上限
export const 宗门人数上限 = [6, 9, 12, 15, 18, 21, 24, 27]
//宗门money池上限
export const 宗门money池上限 = [
  2000000, 5000000, 8000000, 11000000, 15000000, 20000000, 25000000, 30000000
]
// 副宗主人数上限
export const Maximum_number_of_secondary_masters = [1, 1, 1, 1, 2, 2, 3, 3]
// 长老人数上限
export const Maximum_number_of_elders = [1, 2, 3, 4, 5, 7, 8, 9]
// 内门弟子上限
export const Upper_limit_of_inner_disciples = [2, 3, 4, 5, 6, 8, 10, 12]
export const A_QQ = []
export const B_QQ = []
export const helpData = {
  md5: '',
  img: ''
}
export const gane_key_user = [] //怡红院限制
export const yazhu = [] //投入
export const gametime = [] //临时游戏CD

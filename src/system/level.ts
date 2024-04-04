import { writeArchiveData } from '../model/data'
import { getUserMessageByUid } from '../model/message'

class Level {
  /**
   * 升级
   */
  up(uid: number, id = 1) {
    // 读取数据
    const data = getUserMessageByUid(uid)
    data.level_id = data.level_id + id
    writeArchiveData('player', uid, data)
    return data
  }

  /**
   * 降级
   */
  down() {}
}

export default new Level()

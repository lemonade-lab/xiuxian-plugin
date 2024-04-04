import { writeArchiveData } from '../model/data'
import { getUserMessageByUid } from '../model/message'

class Level {
  /**
   * 升级
   */
  up(uid: number, id = 1) {
    return
  }

  /**
   * 降级
   */
  down() {}
}

export default new Level()

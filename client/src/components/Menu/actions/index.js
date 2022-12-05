import BaseActions from '@components/BaseActions'

import { API_CONFIG } from '@constants'
import store from '../store'

class Actions extends BaseActions {
  getMenus = async() => {
    const config = await this.get(API_CONFIG)
    const groups = {}
    const ret = []

    config.forEach(item => {
      const group = item.admin.group
      if (group) {
        if (!groups[group]) {
          groups[group] = []
          ret.push({
            name: group,
            children: groups[group]
          })
        }

        groups[group].push(item)
      } else {
        ret.push(item)
      }
    })

    return ret
  }
}

export default new Actions(store)

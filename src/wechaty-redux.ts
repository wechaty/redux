/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import {
  Wechaty,
  log,
}             from 'wechaty'

import type {
  Store,
}             from 'redux'
import * as instances from './manager.js'

import { puppet$ } from './puppet$.js'

interface WechatyReduxOptions {
  store: Store,
}

function WechatyRedux (options: WechatyReduxOptions) {
  log.verbose('WechatyRedux', '(%s)', JSON.stringify(options))

  return function WechatyReduxPlugin (wechaty: Wechaty) {
    log.verbose('WechatyRedux', 'WechatyReduxPlugin(%s)', wechaty)

    install(
      options.store,
      wechaty,
    )
  }
}

function install (
  store: Store,
  wechaty: Wechaty,
): void {
  log.verbose('WechatyRedux', 'install(store, %s)', wechaty)

  /**
   * Huan(202005):
   *  the wechaty.puppet will be initialized after the wechaty.start()
   *  so here might be no puppet yet.
   */
  let hasPuppet: any
  try {
    hasPuppet = wechaty.puppet
  } catch (e) {
    log.verbose('WechatyRedux', 'install() wechaty.puppet not ready yet. retry on puppet event later')
  }

  if (!hasPuppet) {
    wechaty.once('puppet', () => install(store, wechaty))
    log.verbose('WechatyRedux', 'install() wechaty.once(puppet) event listener added')
    return
  }

  /**
   * Save wechaty id with the instance for the future usage
   */
  instances.setWechaty(wechaty)
  log.silly('WechatyRedux', 'install() added wechaty<%s> to manager instances')

  /**
   * Actually, we are not installing to the Wechaty,
   *  but the Puppet for convenience
   */
  puppet$(wechaty.puppet)
    .subscribe(store.dispatch)
}

export type {
  WechatyReduxOptions,
}
export {
  WechatyRedux,
}

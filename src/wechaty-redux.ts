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
import { log } from 'wechaty-puppet'
import type * as WECHATY from 'wechaty'
import type {
  Store,
}             from 'redux'

import {
  registerWechaty,
  // type WechatyLike,
}                   from './registry/mod.js'

import { puppet$ }  from './puppet$.js'

type VoidFunction = () => void

interface WechatyReduxOptions {
  store: Store,
}

function WechatyRedux (options: WechatyReduxOptions) {
  log.verbose('WechatyRedux', '(%s)', JSON.stringify(options))

  const store = options.store

  const uninstallerList: VoidFunction[] = []

  return function WechatyReduxPlugin (wechaty: WECHATY.impls.WechatyInterface): VoidFunction {
    log.verbose('WechatyRedux', 'WechatyReduxPlugin(%s)', wechaty)

    /**
     * Register Wechaty to the Registry
     *  to support `getWechaty(id)` usage in the future
     */
    const deregister = registerWechaty(wechaty, store)
    uninstallerList.push(() => deregister())

    subscribePuppetEvents(
      wechaty,
      store,
      uninstallerList,
    )

    return () => {
      uninstallerList.forEach(setImmediate)
      uninstallerList.length = 0
    }
  }
}

function subscribePuppetEvents (
  wechaty         : WECHATY.impls.WechatyInterface,
  store           : Store,
  uninstallerList : VoidFunction[],
): void {
  log.verbose('WechatyRedux', 'subscribePuppetEvents(store, %s)', wechaty)

  /**
   * Huan(202005):
   *  the wechaty.puppet will be initialized after the wechaty.start()
   *  so here might be no puppet yet.
   */
  let puppet
  try {
    puppet = wechaty.puppet
  } catch (e) {
    log.verbose('WechatyRedux', 'install() wechaty.puppet not ready yet. retry on puppet event later')

    const onPuppet = () => subscribePuppetEvents(wechaty, store, uninstallerList)

    wechaty.once('puppet', onPuppet)
    uninstallerList.push(
      () => wechaty.off('puppet', onPuppet),
    )

    log.verbose('WechatyRedux', 'install() wechaty.once(puppet) event listener added')
    return
  }

  const sub = puppet$(puppet, {
    store,
    wechaty,
  }).subscribe(store.dispatch)

  uninstallerList.push(() => {
    sub.unsubscribe()
  })
}

export {
  type WechatyReduxOptions,
  WechatyRedux,
}

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
  WechatyPluginUninstaller,
  log,
}                             from 'wechaty'

import type {
  Store,
}             from 'redux'

import { puppet$ }  from './puppet$.js'

interface WechatyReduxOptions {
  store: Store,
}

function WechatyRedux (options: WechatyReduxOptions) {
  log.verbose('WechatyRedux', '(%s)', JSON.stringify(options))

  const uninstallerList: WechatyPluginUninstaller[] = []

  return function WechatyReduxPlugin (wechaty: Wechaty): WechatyPluginUninstaller {
    log.verbose('WechatyRedux', 'WechatyReduxPlugin(%s)', wechaty)

    installWechaty(
      options.store,
      wechaty,
      uninstallerList,
    )

    return () => uninstallerList.forEach(fn => fn())
  }
}

function installWechaty (
  store           : Store,
  wechaty         : Wechaty,
  uninstallerList : WechatyPluginUninstaller[],
): void {
  log.verbose('WechatyRedux', 'installWechaty(store, %s)', wechaty)

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
  }

  if (!puppet) {
    const onPuppet = () => installWechaty(store, wechaty, uninstallerList)
    wechaty.once('puppet', onPuppet)
    uninstallerList.push(
      () => wechaty.off('puppet', onPuppet),
    )
    log.verbose('WechatyRedux', 'install() wechaty.once(puppet) event listener added')
    return
  }

  const sub = puppet$(puppet)
    .subscribe(store.dispatch)

  uninstallerList.push(
    () => sub.unsubscribe(),
  )
}

export type {
  WechatyReduxOptions,
}
export {
  WechatyRedux,
}

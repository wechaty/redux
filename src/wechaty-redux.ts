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
import type * as PUPPET   from 'wechaty-puppet'
import {
  Wechaty,
  log,
}             from 'wechaty'

import {
  fromEvent as rxFromEvent,
  merge,
}                             from 'rxjs'
import type { FromEvent }     from 'typed-emitter/rxjs'
import type { StateSwitch }   from 'state-switch'
import {
  map,
}             from 'rxjs/operators'

import type {
  Store,
}             from 'redux'

import * as duck  from './duck/mod.js'

import * as instances from './manager.js'

const fromEvent: FromEvent = rxFromEvent

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

const puppet$ = (puppetInterface: PUPPET.impl.PuppetInterface) => {
  const puppet = puppetInterface as PUPPET.impl.PuppetAbstract

  const state = puppet.state as StateSwitch
  const stateActive$   = fromEvent(state, 'active')
  const stateInactive$ = fromEvent(state, 'inactive')

  const dong$       = fromEvent(puppet, 'dong')
  const error$      = fromEvent(puppet, 'error')
  const friendship$ = fromEvent(puppet, 'friendship')
  const heartbeat$  = fromEvent(puppet, 'heartbeat')
  const login$      = fromEvent(puppet, 'login')
  const logout$     = fromEvent(puppet, 'logout')
  const message$    = fromEvent(puppet, 'message')
  const ready$      = fromEvent(puppet, 'ready')
  const reset$      = fromEvent(puppet, 'reset')
  const roomInvite$ = fromEvent(puppet, 'room-invite')
  const roomJoin$   = fromEvent(puppet, 'room-join')
  const roomLeave$  = fromEvent(puppet, 'room-leave')
  const roomTopic$  = fromEvent(puppet, 'room-topic')
  const scan$       = fromEvent(puppet, 'scan')

  /* eslint-disable func-call-spacing */
  /* eslint-disable no-whitespace-before-property */
  return merge(
    stateActive$   .pipe(map(status  => duck.actions.activeState    (puppet.id, status))),
    stateInactive$ .pipe(map(status  => duck.actions.inactiveState  (puppet.id, status))),

    dong$       .pipe(map(payload => duck.actions.dongEvent       (puppet.id, payload))),
    error$      .pipe(map(payload => duck.actions.errorEvent      (puppet.id, payload))),
    friendship$ .pipe(map(payload => duck.actions.friendshipEvent (puppet.id, payload))),
    heartbeat$  .pipe(map(payload => duck.actions.heartbeatEvent  (puppet.id, payload))),
    login$      .pipe(map(payload => duck.actions.loginEvent      (puppet.id, payload))),
    logout$     .pipe(map(payload => duck.actions.logoutEvent     (puppet.id, payload))),
    message$    .pipe(map(payload => duck.actions.messageEvent    (puppet.id, payload))),
    ready$      .pipe(map(payload => duck.actions.readyEvent      (puppet.id, payload))),
    reset$      .pipe(map(payload => duck.actions.resetEvent      (puppet.id, payload))),
    roomInvite$ .pipe(map(payload => duck.actions.roomInviteEvent (puppet.id, payload))),
    roomJoin$   .pipe(map(payload => duck.actions.roomJoinEvent   (puppet.id, payload))),
    roomLeave$  .pipe(map(payload => duck.actions.roomLeaveEvent  (puppet.id, payload))),
    roomTopic$  .pipe(map(payload => duck.actions.roomTopicEvent  (puppet.id, payload))),
    scan$       .pipe(map(payload => duck.actions.scanEvent       (puppet.id, payload))),
  )
}

export type {
  WechatyReduxOptions,
}
export {
  WechatyRedux,
  puppet$,
}

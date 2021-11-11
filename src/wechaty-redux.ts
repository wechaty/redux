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

/* eslint-disable func-call-spacing */

import type * as PUPPET   from 'wechaty-puppet'
import {
  Wechaty,
  log,
}             from 'wechaty'

import {
  fromEvent,
  merge,
}             from 'rxjs'
import {
  map,
}             from 'rxjs/operators'

import type {
  Store,
}             from 'redux'

import * as duck  from './duck/mod.js'

import * as instances from './manager.js'

export interface WechatyReduxOptions {
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

  // TODO: find a better way to remove `any` with StateSwitch interface
  const switchActive$   = fromEvent<true | 'pending'>(wechaty.puppet.state as any, 'active')
  const switchInactive$ = fromEvent<true | 'pending'>(wechaty.puppet.state as any, 'inactive')

  /**
   * FIXME: Huan(20200312) remove the specified explicit types
   *  https://github.com/wechaty/wechaty-redux/issues/4
   */
  const puppet = wechaty.puppet

  const dong$       = fromEvent<PUPPET.payload.EventDong>       (puppet, 'dong')
  const error$      = fromEvent<PUPPET.payload.EventError>      (puppet, 'error')
  const friendship$ = fromEvent<PUPPET.payload.EventFriendship> (puppet, 'friendship')
  const heartbeat$  = fromEvent<PUPPET.payload.EventHeartbeat>  (puppet, 'heartbeat')
  const login$      = fromEvent<PUPPET.payload.EventLogin>      (puppet, 'login')
  const logout$     = fromEvent<PUPPET.payload.EventLogout>     (puppet, 'logout')
  const message$    = fromEvent<PUPPET.payload.EventMessage>    (puppet, 'message')
  const ready$      = fromEvent<PUPPET.payload.EventReady>      (puppet, 'ready')
  const reset$      = fromEvent<PUPPET.payload.EventReset>      (puppet, 'reset')
  const roomInvite$ = fromEvent<PUPPET.payload.EventRoomInvite> (puppet, 'room-invite')
  const roomJoin$   = fromEvent<PUPPET.payload.EventRoomJoin>   (puppet, 'room-join')
  const roomLeave$  = fromEvent<PUPPET.payload.EventRoomLeave>  (puppet, 'room-leave')
  const roomTopic$  = fromEvent<PUPPET.payload.EventRoomTopic>  (puppet, 'room-topic')
  const scan$       = fromEvent<PUPPET.payload.EventScan>       (puppet, 'scan')

  merge(
    /* eslint-disable no-whitespace-before-property */
    switchActive$   .pipe(map(status  => duck.actions.activeSwitch    (wechaty.id, status))),
    switchInactive$ .pipe(map(status  => duck.actions.inactiveSwitch  (wechaty.id, status))),

    dong$       .pipe(map(payload => duck.actions.dongEvent       (wechaty.id, payload))),
    error$      .pipe(map(payload => duck.actions.errorEvent      (wechaty.id, payload))),
    friendship$ .pipe(map(payload => duck.actions.friendshipEvent (wechaty.id, payload))),
    heartbeat$  .pipe(map(payload => duck.actions.heartbeatEvent  (wechaty.id, payload))),
    login$      .pipe(map(payload => duck.actions.loginEvent      (wechaty.id, payload))),
    logout$     .pipe(map(payload => duck.actions.logoutEvent     (wechaty.id, payload))),
    message$    .pipe(map(payload => duck.actions.messageEvent    (wechaty.id, payload))),
    ready$      .pipe(map(payload => duck.actions.readyEvent      (wechaty.id, payload))),
    reset$      .pipe(map(payload => duck.actions.resetEvent      (wechaty.id, payload))),
    roomInvite$ .pipe(map(payload => duck.actions.roomInviteEvent (wechaty.id, payload))),
    roomJoin$   .pipe(map(payload => duck.actions.roomJoinEvent   (wechaty.id, payload))),
    roomLeave$  .pipe(map(payload => duck.actions.roomLeaveEvent  (wechaty.id, payload))),
    roomTopic$  .pipe(map(payload => duck.actions.roomTopicEvent  (wechaty.id, payload))),
    scan$       .pipe(map(payload => duck.actions.scanEvent       (wechaty.id, payload))),
  ).subscribe(store.dispatch)
}

export {
  WechatyRedux,
}

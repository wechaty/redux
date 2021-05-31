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

import {
  fromEvent,
  merge,
}             from 'rxjs'
import {
  map,
}             from 'rxjs/operators'

import {
  Store,
}             from 'redux'

import * as duck  from './duck/mod'

import * as instances from './manager'

import {
  EventDongPayload,
  EventErrorPayload,
  EventScanPayload,
  EventRoomTopicPayload,
  EventRoomLeavePayload,
  EventRoomJoinPayload,
  EventRoomInvitePayload,
  EventReadyPayload,
  EventMessagePayload,
  EventLogoutPayload,
  EventLoginPayload,
  EventHeartbeatPayload,
  EventFriendshipPayload,
  EventResetPayload,
}                             from 'wechaty-puppet'

export interface WechatyReduxOptions {
  store: Store,
}

function WechatyRedux (options: WechatyReduxOptions) {
  log.verbose('WechatyRedux', '(%s)', options ? JSON.stringify(options) : '')

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
    return
  }

  /**
   * Save wechaty id with the instance for the future usage
   */
  instances.setWechaty(wechaty)

  /**
   * Actually, we are not installing to the Wechaty,
   *  but the Puppet for convenience
   */

  /* eslint-disable func-call-spacing */
  const switchOn$  = fromEvent(wechaty.puppet.state, 'on')
  const switchOff$ = fromEvent(wechaty.puppet.state, 'off')

  /**
   * FIXME: Huan(20200312) remove the specified explicit types
   *  https://github.com/wechaty/wechaty-redux/issues/4
   */
  const puppet = wechaty.puppet

  const dong$       = fromEvent<EventDongPayload>       (puppet, 'dong')
  const error$      = fromEvent<EventErrorPayload>      (puppet, 'error')
  const friendship$ = fromEvent<EventFriendshipPayload> (puppet, 'friendship')
  const heartbeat$  = fromEvent<EventHeartbeatPayload>  (puppet, 'heartbeat')
  const login$      = fromEvent<EventLoginPayload>      (puppet, 'login')
  const logout$     = fromEvent<EventLogoutPayload>     (puppet, 'logout')
  const message$    = fromEvent<EventMessagePayload>    (puppet, 'message')
  const ready$      = fromEvent<EventReadyPayload>      (puppet, 'ready')
  const reset$      = fromEvent<EventResetPayload>      (puppet, 'reset')
  const roomInvite$ = fromEvent<EventRoomInvitePayload> (puppet, 'room-invite')
  const roomJoin$   = fromEvent<EventRoomJoinPayload>   (puppet, 'room-join')
  const roomLeave$  = fromEvent<EventRoomLeavePayload>  (puppet, 'room-leave')
  const roomTopic$  = fromEvent<EventRoomTopicPayload>  (puppet, 'room-topic')
  const scan$       = fromEvent<EventScanPayload>       (puppet, 'scan')

  merge(
    /* eslint-disable no-whitespace-before-property */
    switchOn$   .pipe(map(status  => duck.actions.turnOnSwitch    (wechaty.id, status))),
    switchOff$  .pipe(map(status  => duck.actions.turnOffSwitch   (wechaty.id, status))),

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

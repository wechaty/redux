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

import * as api  from './api'
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

function install (store: Store, wechaty: Wechaty): void {
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

  const dong$       = fromEvent<EventDongPayload>       (wechaty.puppet, 'dong')
  const error$      = fromEvent<EventErrorPayload>      (wechaty.puppet, 'error')
  const friendship$ = fromEvent<EventFriendshipPayload> (wechaty.puppet, 'friendship')
  const heartbeat$  = fromEvent<EventHeartbeatPayload>  (wechaty.puppet, 'heartbeat')
  const login$      = fromEvent<EventLoginPayload>      (wechaty.puppet, 'login')
  const logout$     = fromEvent<EventLogoutPayload>     (wechaty.puppet, 'logout')
  const message$    = fromEvent<EventMessagePayload>    (wechaty.puppet, 'message')
  const ready$      = fromEvent<EventReadyPayload>      (wechaty.puppet, 'ready')
  const reset$      = fromEvent<EventResetPayload>      (wechaty.puppet, 'reset')
  const roomInvite$ = fromEvent<EventRoomInvitePayload> (wechaty.puppet, 'room-invite')
  const roomJoin$   = fromEvent<EventRoomJoinPayload>   (wechaty.puppet, 'room-join')
  const roomLeave$  = fromEvent<EventRoomLeavePayload>  (wechaty.puppet, 'room-leave')
  const roomTopic$  = fromEvent<EventRoomTopicPayload>  (wechaty.puppet, 'room-topic')
  const scan$       = fromEvent<EventScanPayload>       (wechaty.puppet, 'scan')

  merge(
    /**
     * Huan(202004):
     *  We are using `merge` inside `merge` because the typing system for the arguments of `merge()`
     *  only support maximum 6 arguments at the same time.
     */

    /*  eslint-disable no-whitespace-before-property */
    merge(
      switchOn$   .pipe(map(status => api.actions.turnOnSwitch (wechaty.id, status))),
      switchOff$  .pipe(map(status => api.actions.turnOffSwitch(wechaty.id, status))),
    ),
    merge(
      dong$       .pipe(map(payload => api.actions.dongEvent       (wechaty.id, payload))),
      error$      .pipe(map(payload => api.actions.errorEvent      (wechaty.id, payload))),
      friendship$ .pipe(map(payload => api.actions.friendshipEvent (wechaty.id, payload))),
      heartbeat$  .pipe(map(payload => api.actions.heartbeatEvent  (wechaty.id, payload))),
      login$      .pipe(map(payload => api.actions.loginEvent      (wechaty.id, payload))),
      logout$     .pipe(map(payload => api.actions.logoutEvent     (wechaty.id, payload))),
    ),
    merge(
      message$    .pipe(map(payload => api.actions.messageEvent(wechaty.id, payload))),
      ready$      .pipe(map(payload => api.actions.readyEvent  (wechaty.id, payload))),
      reset$      .pipe(map(payload => api.actions.resetEvent  (wechaty.id, payload))),
    ),
    merge(
      roomInvite$ .pipe(map(payload => api.actions.roomInviteEvent (wechaty.id, payload))),
      roomJoin$   .pipe(map(payload => api.actions.roomJoinEvent   (wechaty.id, payload))),
      roomLeave$  .pipe(map(payload => api.actions.roomLeaveEvent  (wechaty.id, payload))),
      roomTopic$  .pipe(map(payload => api.actions.roomTopicEvent  (wechaty.id, payload))),
    ),
    scan$         .pipe(map(payload => api.actions.scanEvent(wechaty.id, payload))),
  ).subscribe(store.dispatch)

}

export {
  WechatyRedux,
}

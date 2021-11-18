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
  fromEvent as rxFromEvent,
  merge,
}                             from 'rxjs'
import type { FromEvent }     from 'typed-emitter/rxjs'
import type { StateSwitch }   from 'state-switch'
import {
  map,
  share,
}             from 'rxjs/operators'

import { rememberPuppet } from './operator/remember-puppet.js'
import * as duck          from './duck/mod.js'

import { puppetRegistry } from './puppet-registry.js'

const fromEvent: FromEvent = rxFromEvent

/**
 * Ducks operations need to get Puppet instance by id
 *   this map is used to store the Puppet instances
 */

const puppet$ = (puppetInterface: PUPPET.impl.PuppetInterface) => {
  const puppet = puppetInterface as PUPPET.impl.PuppetAbstract

  /**
   * active/inactive state change
   */
  const state = puppet.state as StateSwitch
  const stateActive$   = fromEvent(state, 'active')
  const stateInactive$ = fromEvent(state, 'inactive')

  /**
   * events
   */
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

  /**
   * Merge everything to one stream$
   */
  return merge(
    /* eslint-disable func-call-spacing */
    /* eslint-disable no-whitespace-before-property */
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
  ).pipe(
    /**
     * share() === multicast(() => new Subject()).refCount()
     *  @see https://itnext.io/the-magic-of-rxjs-sharing-operators-and-their-differences-3a03d699d255
     */
    share(),
    /**
     * Save the puppet instance to the map when there's any subscription
     *  and automatically remove the puppet instance from the map when there's no subscription
     *
     *  - Huan(202111): put it below the `share()`
     *    because we want to count the ref numbers internally
     */
    rememberPuppet(puppetRegistry)(puppet),
  )
}

export {
  puppet$,
}

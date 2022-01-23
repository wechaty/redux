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
/* eslint-disable sort-keys */
import {
  createAction,
  createAsyncAction,
}                         from 'typesafe-actions'

import type * as PUPPET   from 'wechaty-puppet'
import * as UUID          from 'uuid'

import * as types from './types.js'

// interface ContactIdOptions  { contactId: string }
interface ErrorOptions            { gerror: string }
interface IdOptions               { id: string }
interface MessageIdOptions        { messageId: string }
interface ConversationIdOptions   { conversationId: string }
// interface TextOptions             { text: string }
interface SayableOptions          { sayable: PUPPET.payloads.Sayable }

interface PuppetIdOptions  { puppetId: string }

/**
 * Register Actions
 */
const preparePuppetId   = (puppetId: string)  => ({ puppetId })
const prepareWechatyId  = (wechatyId: string) => ({ wechatyId })

const prepareWechatyPuppetId = (options: { wechatyId: string, puppetId: string }) => options

/**
 * Event Actions' Payloads
 */
const prepareStateActive   = (puppetId: string, status: true | 'pending') => ({ status, puppetId })
const prepareStateInactive = (puppetId: string, status: true | 'pending') => ({ status, puppetId })

const prepareEventDong           = (puppetId: string, payload: PUPPET.payloads.EventDong)       => ({ ...payload, puppetId })
const prepareEventError          = (puppetId: string, payload: PUPPET.payloads.EventError)      => ({ ...payload, puppetId })
const prepareEventHeartbeat      = (puppetId: string, payload: PUPPET.payloads.EventHeartbeat)  => ({ ...payload, puppetId })
const prepareEventReady          = (puppetId: string, payload: PUPPET.payloads.EventReady)      => ({ ...payload, puppetId })
const prepareEventReset          = (puppetId: string, payload: PUPPET.payloads.EventReset)      => ({ ...payload, puppetId })
const prepareEventFriendship     = (puppetId: string, payload: PUPPET.payloads.EventFriendship) => ({ ...payload, puppetId })
const prepareEventLogin          = (puppetId: string, payload: PUPPET.payloads.EventLogin)      => ({ ...payload, puppetId })
const prepareEventLogout         = (puppetId: string, payload: PUPPET.payloads.EventLogout)     => ({ ...payload, puppetId })
const prepareEventMessage        = (puppetId: string, payload: PUPPET.payloads.EventMessage)    => ({ ...payload, puppetId })
const prepareEventRoomInvitation = (puppetId: string, payload: PUPPET.payloads.EventRoomInvite) => ({ ...payload, puppetId })
const prepareEventRoomJoin       = (puppetId: string, payload: PUPPET.payloads.EventRoomJoin)   => ({ ...payload, puppetId })
const prepareEventRoomLeave      = (puppetId: string, payload: PUPPET.payloads.EventRoomLeave)  => ({ ...payload, puppetId })
const prepareEventRoomTopic      = (puppetId: string, payload: PUPPET.payloads.EventRoomTopic)  => ({ ...payload, puppetId })
const prepareEventScan           = (puppetId: string, payload: PUPPET.payloads.EventScan)       => ({ ...payload, puppetId })

/**
 * Actions: Registry
 */
const registerPuppet    = createAction(types.PUPPET_REGISTER,   preparePuppetId)()
const deregisterPuppet  = createAction(types.PUPPET_DEREGISTER, preparePuppetId)()

const registerWechaty    = createAction(types.WECHATY_REGISTER,   prepareWechatyId)()
const deregisterWechaty  = createAction(types.WECHATY_DEREGISTER, prepareWechatyId)()

const bindWechatyPuppet   = createAction(types.WECHATY_PUPPET_BIND,   prepareWechatyPuppetId)()
const unbindWechatyPuppet = createAction(types.WECHATY_PUPPET_UNBIND, prepareWechatyPuppetId)()

/**
 * Actions: StateState
 */
const activeState    = createAction(types.STATE_ACTIVE,   prepareStateActive)()
const inactiveState  = createAction(types.STATE_INACTIVE, prepareStateInactive)()

/**
 * Actions: Events
 */
const dongEvent       = createAction(types.EVENT_DONG,        prepareEventDong)()
const errorEvent      = createAction(types.EVENT_ERROR,       prepareEventError)()
const friendshipEvent = createAction(types.EVENT_FRIENDSHIP,  prepareEventFriendship)()
const heartbeatEvent  = createAction(types.EVENT_HEARTBEAT,   prepareEventHeartbeat)()
const loginEvent      = createAction(types.EVENT_LOGIN,       prepareEventLogin)()
const logoutEvent     = createAction(types.EVENT_LOGOUT,      prepareEventLogout)()
const messageEvent    = createAction(types.EVENT_MESSAGE,     prepareEventMessage)()
const readyEvent      = createAction(types.EVENT_READY,       prepareEventReady)()
const resetEvent      = createAction(types.EVENT_RESET,       prepareEventReset)()
const roomInviteEvent = createAction(types.EVENT_ROOM_INVITE, prepareEventRoomInvitation)()
const roomJoinEvent   = createAction(types.EVENT_ROOM_JOIN,   prepareEventRoomJoin)()
const roomLeaveEvent  = createAction(types.EVENT_ROOM_LEAVE,  prepareEventRoomLeave)()
const roomTopicEvent  = createAction(types.EVENT_ROOM_TOPIC,  prepareEventRoomTopic)()
const scanEvent       = createAction(types.EVENT_SCAN,        prepareEventScan)()

const startEvent      = createAction(types.EVENT_START,       preparePuppetId)()
const stopEvent       = createAction(types.EVENT_STOP,        preparePuppetId)()

/**
 * Actions: Void APIs
 */
const prepareData = (puppetId: string, data: string)  => ({ data, puppetId })
const prepareLogin  = (payload: PuppetIdOptions & PUPPET.payloads.Contact) => payload

const ding  = createAction(types.DING,  prepareData)()
const reset = createAction(types.RESET, prepareData)()
const login = createAction(types.LOGIN, prepareLogin)()

/**
 * Actions: Non-Void APIs
 */
const prepareSayRequest = ({ puppetId, conversationId, sayable } : PuppetIdOptions & ConversationIdOptions & SayableOptions)  => ({ id: UUID.v4(),  puppetId, conversationId, sayable })
const prepareSaySuccess = ({ id, puppetId, messageId }           : PuppetIdOptions & IdOptions & Partial<MessageIdOptions>)   => ({ id,             puppetId, messageId })
const prepareSayFailure = ({ id, puppetId, gerror }              : PuppetIdOptions & IdOptions & ErrorOptions)                => ({ id,             puppetId, gerror })

const sayAsync = createAsyncAction(
  [types.SAY_REQUEST, prepareSayRequest],
  [types.SAY_SUCCESS, prepareSaySuccess],
  [types.SAY_FAILURE, prepareSayFailure],
)()
const say = sayAsync.request

/**
 * Bug compatible & workaround for Ducks API
 *  https://github.com/huan/ducks/issues/2
 */
const nop = createAction(types.NOP)()

export {
  type PuppetIdOptions,
  registerPuppet,
  deregisterPuppet,

  registerWechaty,
  deregisterWechaty,

  bindWechatyPuppet,
  unbindWechatyPuppet,

  inactiveState,
  activeState,

  dongEvent,
  errorEvent,
  friendshipEvent,
  heartbeatEvent,
  loginEvent,
  logoutEvent,
  messageEvent,
  readyEvent,
  resetEvent,
  roomInviteEvent,
  roomJoinEvent,
  roomLeaveEvent,
  roomTopicEvent,
  scanEvent,

  startEvent,
  stopEvent,

  ding,
  reset,
  say,

  sayAsync,

  login,

  nop,
}

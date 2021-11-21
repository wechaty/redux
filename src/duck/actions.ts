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
interface TextOptions             { text: string }
export interface PuppetIdOptions  { puppetId: string }

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

const prepareDong           = (puppetId: string, payload: PUPPET.payload.EventDong)       => ({ ...payload, puppetId })
const prepareError          = (puppetId: string, payload: PUPPET.payload.EventError)      => ({ ...payload, puppetId })
const prepareHeartbeat      = (puppetId: string, payload: PUPPET.payload.EventHeartbeat)  => ({ ...payload, puppetId })
const prepareReady          = (puppetId: string, payload: PUPPET.payload.EventReady)      => ({ ...payload, puppetId })
const prepareReset          = (puppetId: string, payload: PUPPET.payload.EventReset)      => ({ ...payload, puppetId })
const prepareFriendship     = (puppetId: string, payload: PUPPET.payload.EventFriendship) => ({ ...payload, puppetId })
const prepareLogin          = (puppetId: string, payload: PUPPET.payload.EventLogin)      => ({ ...payload, puppetId })
const prepareLogout         = (puppetId: string, payload: PUPPET.payload.EventLogout)     => ({ ...payload, puppetId })
const prepareMessage        = (puppetId: string, payload: PUPPET.payload.EventMessage)    => ({ ...payload, puppetId })
const prepareRoomInvitation = (puppetId: string, payload: PUPPET.payload.EventRoomInvite) => ({ ...payload, puppetId })
const prepareRoomJoin       = (puppetId: string, payload: PUPPET.payload.EventRoomJoin)   => ({ ...payload, puppetId })
const prepareRoomLeave      = (puppetId: string, payload: PUPPET.payload.EventRoomLeave)  => ({ ...payload, puppetId })
const prepareRoomTopic      = (puppetId: string, payload: PUPPET.payload.EventRoomTopic)  => ({ ...payload, puppetId })
const prepareScan           = (puppetId: string, payload: PUPPET.payload.EventScan)       => ({ ...payload, puppetId })

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
const dongEvent       = createAction(types.EVENT_DONG,        prepareDong)()
const errorEvent      = createAction(types.EVENT_ERROR,       prepareError)()
const friendshipEvent = createAction(types.EVENT_FRIENDSHIP,  prepareFriendship)()
const heartbeatEvent  = createAction(types.EVENT_HEARTBEAT,   prepareHeartbeat)()
const loginEvent      = createAction(types.EVENT_LOGIN,       prepareLogin)()
const logoutEvent     = createAction(types.EVENT_LOGOUT,      prepareLogout)()
const messageEvent    = createAction(types.EVENT_MESSAGE,     prepareMessage)()
const readyEvent      = createAction(types.EVENT_READY,       prepareReady)()
const resetEvent      = createAction(types.EVENT_RESET,       prepareReset)()
const roomInviteEvent = createAction(types.EVENT_ROOM_INVITE, prepareRoomInvitation)()
const roomJoinEvent   = createAction(types.EVENT_ROOM_JOIN,   prepareRoomJoin)()
const roomLeaveEvent  = createAction(types.EVENT_ROOM_LEAVE,  prepareRoomLeave)()
const roomTopicEvent  = createAction(types.EVENT_ROOM_TOPIC,  prepareRoomTopic)()
const scanEvent       = createAction(types.EVENT_SCAN,        prepareScan)()

const startEvent      = createAction(types.EVENT_START,       preparePuppetId)()
const stopEvent       = createAction(types.EVENT_STOP,        preparePuppetId)()

/**
 * Actions: Void APIs
 */
const prepareData = (puppetId: string, data: string)  => ({ data, puppetId })

const ding  = createAction(types.DING,  prepareData)()
const reset = createAction(types.RESET, prepareData)()

/**
 * Actions: Non-Void APIs
 */
const prepareSayRequest = ({ puppetId, conversationId, text }: PuppetIdOptions & ConversationIdOptions & TextOptions)   => ({ id: UUID.v4(),  puppetId, conversationId, text })
const prepareSaySuccess = ({ id, puppetId, messageId }       : PuppetIdOptions & IdOptions & Partial<MessageIdOptions>) => ({ id,             puppetId, messageId })
const prepareSayFailure = ({ id, puppetId, gerror }          : PuppetIdOptions & IdOptions & ErrorOptions)              => ({ id,             puppetId, gerror })

const sayAsync = createAsyncAction(
  [types.SAY_REQUEST, prepareSayRequest],
  [types.SAY_SUCCESS, prepareSaySuccess],
  [types.SAY_FAILURE, prepareSayFailure],
)()

/**
 * Other Actions
 */
const prepareCurrentUser  = (payload: PuppetIdOptions & PUPPET.payload.Contact) => payload
const loginCurrentUser    = createAction(types.LOGIN_CURRENT_USER, prepareCurrentUser)()

/**
 * Bug compatible & workaround for Ducks API
 *  https://github.com/huan/ducks/issues/2
 */
const noop = createAction(types.NOOP)()

export {
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

  sayAsync,

  loginCurrentUser,

  noop,
}

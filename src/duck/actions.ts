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
export interface WechatyIdOptions  { wechatyId: string }

/**
 * Event Actions' Payloads
 */
const prepareSwitchActive   = (wechatyId: string, status: true | 'pending') => ({ status, wechatyId })
const prepareSwitchInactive = (wechatyId: string, status: true | 'pending') => ({ status, wechatyId })

const prepareDong           = (wechatyId: string, payload: PUPPET.payload.EventDong)       => ({ ...payload, wechatyId })
const prepareError          = (wechatyId: string, payload: PUPPET.payload.EventError)      => ({ ...payload, wechatyId })
const prepareHeartbeat      = (wechatyId: string, payload: PUPPET.payload.EventHeartbeat)  => ({ ...payload, wechatyId })
const prepareReady          = (wechatyId: string, payload: PUPPET.payload.EventReady)      => ({ ...payload, wechatyId })
const prepareReset          = (wechatyId: string, payload: PUPPET.payload.EventReset)      => ({ ...payload, wechatyId })
const prepareFriendship     = (wechatyId: string, payload: PUPPET.payload.EventFriendship) => ({ ...payload, wechatyId })
const prepareLogin          = (wechatyId: string, payload: PUPPET.payload.EventLogin)      => ({ ...payload, wechatyId })
const prepareLogout         = (wechatyId: string, payload: PUPPET.payload.EventLogout)     => ({ ...payload, wechatyId })
const prepareMessage        = (wechatyId: string, payload: PUPPET.payload.EventMessage)    => ({ ...payload, wechatyId })
const prepareRoomInvitation = (wechatyId: string, payload: PUPPET.payload.EventRoomInvite) => ({ ...payload, wechatyId })
const prepareRoomJoin       = (wechatyId: string, payload: PUPPET.payload.EventRoomJoin)   => ({ ...payload, wechatyId })
const prepareRoomLeave      = (wechatyId: string, payload: PUPPET.payload.EventRoomLeave)  => ({ ...payload, wechatyId })
const prepareRoomTopic      = (wechatyId: string, payload: PUPPET.payload.EventRoomTopic)  => ({ ...payload, wechatyId })
const prepareScan           = (wechatyId: string, payload: PUPPET.payload.EventScan)       => ({ ...payload, wechatyId })

/**
 * Actions: StateSwitch
 */
const activeSwitch    = createAction(types.SWITCH_ACTIVE,   prepareSwitchActive)()
const inactiveSwitch  = createAction(types.SWITCH_INACTIVE, prepareSwitchInactive)()

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

/**
 * Actions: Void APIs
 */
const prepareData = (wechatyId: string, data: string)  => ({ data, wechatyId })

const ding  = createAction(types.DING,  prepareData)()
const reset = createAction(types.RESET, prepareData)()

/**
 * Actions: Non-Void APIs
 */
const prepareSayRequest = ({ wechatyId, conversationId, text }: WechatyIdOptions & ConversationIdOptions & TextOptions)   => ({ id: UUID.v4(),  wechatyId, conversationId, text })
const prepareSaySuccess = ({ id, wechatyId, messageId }       : WechatyIdOptions & IdOptions & Partial<MessageIdOptions>) => ({ id,             wechatyId, messageId })
const prepareSayFailure = ({ id, wechatyId, gerror }          : WechatyIdOptions & IdOptions & ErrorOptions)              => ({ id,             wechatyId, gerror })

const sayAsync = createAsyncAction(
  [types.SAY_REQUEST, prepareSayRequest],
  [types.SAY_SUCCESS, prepareSaySuccess],
  [types.SAY_FAILURE, prepareSayFailure],
)()

/**
 * Other Actions
 */
const prepareCurrentUser  = (payload: WechatyIdOptions & PUPPET.payload.Contact) => payload
const loginCurrentUser    = createAction(types.LOGIN_CURRENT_USER, prepareCurrentUser)()

/**
 * Bug compatible & workaround for Ducks API
 *  https://github.com/huan/ducks/issues/2
 */
const noop = createAction(types.NOOP)()

export {
  inactiveSwitch,
  activeSwitch,

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

  ding,
  reset,

  sayAsync,

  loginCurrentUser,

  noop,
}

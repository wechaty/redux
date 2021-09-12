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
}                       from 'typesafe-actions'

import type {
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

  ContactPayload,
}                             from 'wechaty-puppet'

import cuid from 'cuid'

import * as types from './types.js'

// interface ContactIdOptions  { contactId: string }
interface ErrorOptions            { error: Error }
interface IdOptions               { id: string }
interface MessageIdOptions        { messageId: string }
interface ConversationIdOptions   { conversationId: string }
interface TextOptions             { text: string }
export interface WechatyIdOptions  { wechatyId: string }

/**
 * Event Actions' Payloads
 */
const prepareTurnOnSwitch  = (wechatyId: string, status: true | 'pending') => ({ status, wechatyId })
const prepareTurnOffSwitch = (wechatyId: string, status: true | 'pending') => ({ status, wechatyId })

const prepareDong           = (wechatyId: string, payload: EventDongPayload)       => ({ ...payload, wechatyId })
const prepareError          = (wechatyId: string, payload: EventErrorPayload)      => ({ ...payload, wechatyId })
const prepareHeartbeat      = (wechatyId: string, payload: EventHeartbeatPayload)  => ({ ...payload, wechatyId })
const prepareReady          = (wechatyId: string, payload: EventReadyPayload)      => ({ ...payload, wechatyId })
const prepareReset          = (wechatyId: string, payload: EventResetPayload)      => ({ ...payload, wechatyId })
const prepareFriendship     = (wechatyId: string, payload: EventFriendshipPayload) => ({ ...payload, wechatyId })
const prepareLogin          = (wechatyId: string, payload: EventLoginPayload)      => ({ ...payload, wechatyId })
const prepareLogout         = (wechatyId: string, payload: EventLogoutPayload)     => ({ ...payload, wechatyId })
const prepareMessage        = (wechatyId: string, payload: EventMessagePayload)    => ({ ...payload, wechatyId })
const prepareRoomInvitation = (wechatyId: string, payload: EventRoomInvitePayload) => ({ ...payload, wechatyId })
const prepareRoomJoin       = (wechatyId: string, payload: EventRoomJoinPayload)   => ({ ...payload, wechatyId })
const prepareRoomLeave      = (wechatyId: string, payload: EventRoomLeavePayload)  => ({ ...payload, wechatyId })
const prepareRoomTopic      = (wechatyId: string, payload: EventRoomTopicPayload)  => ({ ...payload, wechatyId })
const prepareScan           = (wechatyId: string, payload: EventScanPayload)       => ({ ...payload, wechatyId })

/**
 * Actions: StateSwitch
 */
const turnOnSwitch  = createAction(types.SWITCH_ON,  prepareTurnOnSwitch)()
const turnOffSwitch = createAction(types.SWITCH_OFF, prepareTurnOffSwitch)()

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
const prepareSayRequest = ({ wechatyId, conversationId, text }: WechatyIdOptions & ConversationIdOptions & TextOptions) => ({ id: cuid(), wechatyId, conversationId, text })
const prepareSaySuccess = ({ id, wechatyId, messageId }: WechatyIdOptions & IdOptions & Partial<MessageIdOptions>)      => ({ id,         wechatyId, messageId })
const prepareSayFailure = ({ id, wechatyId, error }: WechatyIdOptions & IdOptions & ErrorOptions)                       => ({ id,         wechatyId, error: error.toString() })

const sayAsync = createAsyncAction(
  [types.SAY_REQUEST, prepareSayRequest],
  [types.SAY_SUCCESS, prepareSaySuccess],
  [types.SAY_FAILURE, prepareSayFailure],
)()

/**
 * Other Actions
 */
const prepareSaveUser = (payload: WechatyIdOptions & ContactPayload) => payload
const saveUser = createAction(types.SAVE_USER, prepareSaveUser)()

/**
 * Bug compatible & workaround for Ducks API
 *  https://github.com/huan/ducks/issues/2
 */
const noop = createAction(types.NOOP)()

export {
  turnOffSwitch,
  turnOnSwitch,

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

  saveUser,

  noop,
}

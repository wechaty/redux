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
export interface ErrorOptions            { gerror: string }
export interface IdOptions               { id: string }
export interface MessageIdOptions        { messageId: string }
export interface ConversationIdOptions   { conversationId: string }
// export interface TextOptions             { text: string }
export interface SayableOptions          { sayable: PUPPET.payloads.Sayable }

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
 * Actions: Wechaty & Puppet Registry
 */
export const registerPuppetCommand    = createAction(types.REGISTER_PUPPET_COMMAND,   preparePuppetId)()
export const deregisterPuppetCommand  = createAction(types.DEREGISTER_PUPPET_COMMAND, preparePuppetId)()

export const registerWechatyCommand    = createAction(types.REGISTER_WECHATY_COMMAND,   prepareWechatyId)()
export const deregisterWechatyCommand  = createAction(types.DEREGISTER_WECHATY_COMMAND, prepareWechatyId)()

export const bindWechatyPuppetCommand   = createAction(types.BIND_WECHATY_PUPPET_COMMAND,   prepareWechatyPuppetId)()
export const unbindWechatyPuppetCommand = createAction(types.UNBIND_WECHATY_PUPPET_COMMAND, prepareWechatyPuppetId)()

/**
 * Actions: StateState
 */
export const stateActivatedEvent    = createAction(types.STATE_ACTIVATED_EVENT,   prepareStateActive)()
export const stateInactivatedEvent  = createAction(types.STATE_INACTIVATED_EVENT, prepareStateInactive)()

/**
 * Actions: Pure Events
 */
export const dongReceivedEvent       = createAction(types.DONG_RECEIVED_EVENT,        prepareEventDong)()
export const errorReceivedEvent      = createAction(types.ERROR_RECEIVED_EVENT,       prepareEventError)()
export const friendshipReceivedEvent = createAction(types.FRIENDSHIP_RECEIVED_EVENT,  prepareEventFriendship)()
export const heartbeatReceivedEvent  = createAction(types.HEARTBEAT_RECEIVED_EVENT,   prepareEventHeartbeat)()
export const loginReceivedEvent      = createAction(types.LOGIN_RECEIVED_EVENT,       prepareEventLogin)()
export const logoutReceivedEvent     = createAction(types.LOGOUT_RECEIVED_EVENT,      prepareEventLogout)()
export const messageReceivedEvent    = createAction(types.MESSAGE_RECEIVED_EVENT,     prepareEventMessage)()
export const readyReceivedEvent      = createAction(types.READY_RECEIVED_EVENT,       prepareEventReady)()
export const resetReceivedEvent      = createAction(types.RESET_RECEIVED_EVENT,       prepareEventReset)()
export const roomInviteReceivedEvent = createAction(types.ROOM_INVITE_RECEIVED_EVENT, prepareEventRoomInvitation)()
export const roomJoinReceivedEvent   = createAction(types.ROOM_JOIN_RECEIVED_EVENT,   prepareEventRoomJoin)()
export const roomLeaveReceivedEvent  = createAction(types.ROOM_LEAVE_RECEIVED_EVENT,  prepareEventRoomLeave)()
export const roomTopicReceivedEvent  = createAction(types.ROOM_TOPIC_RECEIVED_EVENT,  prepareEventRoomTopic)()
export const scanReceivedEvent       = createAction(types.SCAN_RECEIVED_EVENT,        prepareEventScan)()

export const startedEvent      = createAction(types.STARTED_EVENT,        preparePuppetId)()
export const stoppedEvent       = createAction(types.STOPPED_EVENT,        preparePuppetId)()

/**
 * Actions: Void APIs
 */
const prepareData = (puppetId: string, data: string)  => ({ data, puppetId })
const prepareLoginContact  = (payload: PuppetIdOptions & PUPPET.payloads.Contact) => payload

export const dingCommand  = createAction(types.DING_COMMAND,  prepareData)()
export const resetCommand = createAction(types.RESET_COMMAND, prepareData)()

/**
 * Actions: Non-Void APIs
 */
const prepareSayRequest = ({ puppetId, conversationId, sayable } : PuppetIdOptions & ConversationIdOptions & SayableOptions)  => ({ id: UUID.v4(),  puppetId, conversationId, sayable })
const prepareSaySuccess = ({ id, puppetId, messageId }           : PuppetIdOptions & IdOptions & Partial<MessageIdOptions>)   => ({ id,             puppetId, messageId })
const prepareSayFailure = ({ id, puppetId, gerror }              : PuppetIdOptions & IdOptions & ErrorOptions)                => ({ id,             puppetId, gerror })

/**
 * Huan(202203): TODO: remove sayAsync in the future
 *  use CQRS Wechaty instead
 */
export const sayAsync = createAsyncAction(
  [types.SAY_REQUEST, prepareSayRequest],
  [types.SAY_SUCCESS, prepareSaySuccess],
  [types.SAY_FAILURE, prepareSayFailure],
)()
export const sayCommand = sayAsync.request

/**
 * Helper Events
 */
export const loginContactEvent = createAction(types.LOGIN_CONTACT_EVENT, prepareLoginContact)()

/**
 * Bug compatible & workaround for Ducks API
 *  https://github.com/huan/ducks/issues/2
 */
export const nopCommand = createAction(types.NOP_COMMAND)()

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
}                         from 'typesafe-actions'
import type * as PUPPET   from 'wechaty-puppet'

import * as types from './types.js'

/**
 * We put `puppetId` in the meta property
 */
const metaPuppetId = (puppetId: string, ..._: any)  => ({ puppetId })

// interface ContactIdOptions  { contactId: string }
// interface ErrorOptions            { gerror: string }
// interface IdOptions               { id: string }
// interface MessageIdOptions        { messageId: string }
// interface ConversationIdOptions   { conversationId: string }
// export interface TextOptions             { text: string }
// interface SayableOptions          { sayable: PUPPET.payloads.Sayable }

// interface PuppetIdOptions  { puppetId: string }

/**
 * @private Registery Actions Payload
 */
const payloadPuppetId         = (puppetId:  string) => ({ puppetId })
const payloadWechatyId        = (wechatyId: string) => ({ wechatyId })
const payloadWechatyPuppetId  = (options: { wechatyId: string, puppetId: string })  => options

/**
 * @private Registry Actions Creators
 */
export const registerPuppetCommand    = createAction(types.REGISTER_PUPPET_COMMAND,   payloadPuppetId)()
export const deregisterPuppetCommand  = createAction(types.DEREGISTER_PUPPET_COMMAND, payloadPuppetId)()

export const registerWechatyCommand    = createAction(types.REGISTER_WECHATY_COMMAND,   payloadWechatyId)()
export const deregisterWechatyCommand  = createAction(types.DEREGISTER_WECHATY_COMMAND, payloadWechatyId)()

export const bindWechatyPuppetCommand   = createAction(types.BIND_WECHATY_PUPPET_COMMAND,   payloadWechatyPuppetId)()
export const unbindWechatyPuppetCommand = createAction(types.UNBIND_WECHATY_PUPPET_COMMAND, payloadWechatyPuppetId)()

/**
 * Event Actions' Payloads
 */
const payloadStateActive   = (_puppetId: string, state: true | 'pending') => ({ state })
const payloadStateInactive = (_puppetId: string, state: true | 'pending') => ({ state })

const payloadEventDong           = (_puppetId: string, payload: PUPPET.payloads.EventDong)       => payload
const payloadEventError          = (_puppetId: string, payload: PUPPET.payloads.EventError)      => payload
const payloadEventHeartbeat      = (_puppetId: string, payload: PUPPET.payloads.EventHeartbeat)  => payload
const payloadEventReady          = (_puppetId: string, payload: PUPPET.payloads.EventReady)      => payload
const payloadEventReset          = (_puppetId: string, payload: PUPPET.payloads.EventReset)      => payload
const payloadEventFriendship     = (_puppetId: string, payload: PUPPET.payloads.EventFriendship) => payload
const payloadEventLogin          = (_puppetId: string, payload: PUPPET.payloads.EventLogin)      => payload
const payloadEventLogout         = (_puppetId: string, payload: PUPPET.payloads.EventLogout)     => payload
const payloadEventMessage        = (_puppetId: string, payload: PUPPET.payloads.EventMessage)    => payload
const payloadEventRoomInvitation = (_puppetId: string, payload: PUPPET.payloads.EventRoomInvite) => payload
const payloadEventRoomJoin       = (_puppetId: string, payload: PUPPET.payloads.EventRoomJoin)   => payload
const payloadEventRoomLeave      = (_puppetId: string, payload: PUPPET.payloads.EventRoomLeave)  => payload
const payloadEventRoomTopic      = (_puppetId: string, payload: PUPPET.payloads.EventRoomTopic)  => payload
const payloadEventScan           = (_puppetId: string, payload: PUPPET.payloads.EventScan)       => payload

/**
 * Actions: StateState
 */
export const stateActivatedEvent    = createAction(types.STATE_ACTIVATED_EVENT,   payloadStateActive,   metaPuppetId)()
export const stateInactivatedEvent  = createAction(types.STATE_INACTIVATED_EVENT, payloadStateInactive, metaPuppetId)()

export const startedEvent = createAction(types.STARTED_EVENT, payloadPuppetId, metaPuppetId)()
export const stoppedEvent = createAction(types.STOPPED_EVENT, payloadPuppetId, metaPuppetId)()

/**
 * Actions: Pure Events
 */
export const dongReceivedEvent       = createAction(types.DONG_RECEIVED_EVENT,        payloadEventDong,           metaPuppetId)()
export const errorReceivedEvent      = createAction(types.ERROR_RECEIVED_EVENT,       payloadEventError,          metaPuppetId)()
export const friendshipReceivedEvent = createAction(types.FRIENDSHIP_RECEIVED_EVENT,  payloadEventFriendship,     metaPuppetId)()
export const heartbeatReceivedEvent  = createAction(types.HEARTBEAT_RECEIVED_EVENT,   payloadEventHeartbeat,      metaPuppetId)()
export const loginReceivedEvent      = createAction(types.LOGIN_RECEIVED_EVENT,       payloadEventLogin,          metaPuppetId)()
export const logoutReceivedEvent     = createAction(types.LOGOUT_RECEIVED_EVENT,      payloadEventLogout,         metaPuppetId)()
export const messageReceivedEvent    = createAction(types.MESSAGE_RECEIVED_EVENT,     payloadEventMessage,        metaPuppetId)()
export const readyReceivedEvent      = createAction(types.READY_RECEIVED_EVENT,       payloadEventReady,          metaPuppetId)()
export const resetReceivedEvent      = createAction(types.RESET_RECEIVED_EVENT,       payloadEventReset,          metaPuppetId)()
export const roomInviteReceivedEvent = createAction(types.ROOM_INVITE_RECEIVED_EVENT, payloadEventRoomInvitation, metaPuppetId)()
export const roomJoinReceivedEvent   = createAction(types.ROOM_JOIN_RECEIVED_EVENT,   payloadEventRoomJoin,       metaPuppetId)()
export const roomLeaveReceivedEvent  = createAction(types.ROOM_LEAVE_RECEIVED_EVENT,  payloadEventRoomLeave,      metaPuppetId)()
export const roomTopicReceivedEvent  = createAction(types.ROOM_TOPIC_RECEIVED_EVENT,  payloadEventRoomTopic,      metaPuppetId)()
export const scanReceivedEvent       = createAction(types.SCAN_RECEIVED_EVENT,        payloadEventScan,           metaPuppetId)()

/**
 * Bug compatible & workaround for Ducks API
 *  https://github.com/huan/ducks/issues/2
 */
export const nopCommand = createAction(types.NOP_COMMAND)()

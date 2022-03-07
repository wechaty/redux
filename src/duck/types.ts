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

/**
 * @private Commands - Redux
 */
export const REGISTER_PUPPET_COMMAND   = 'wechaty-redux/REGISTER_PUPPET_COMMAND'
export const DEREGISTER_PUPPET_COMMAND = 'wechaty-redux/DEREGISTER_PUPPET_COMMAND'

export const REGISTER_WECHATY_COMMAND   = 'wechaty-redux/REGISTER_WECHATY_COMMAND'
export const DEREGISTER_WECHATY_COMMAND = 'wechaty-redux/DEREGISTER_WECHATY_COMMAND'

export const BIND_WECHATY_PUPPET_COMMAND   = 'wechaty-redux/BIND_WECHATY_PUPPET_COMMAND'
export const UNBIND_WECHATY_PUPPET_COMMAND = 'wechaty-redux/UNBIND_WECHATY_PUPPET_COMMAND'

export const NOP_COMMAND = 'wechaty-redux/NOP_COMMAND'

/**
 * Pure Events
 */
export const STARTED_EVENT = 'wechaty-redux/STARTED_EVENT'
export const STOPPED_EVENT = 'wechaty-redux/STOPPED_EVENT'

export const STATE_ACTIVATED_EVENT   = 'wechaty-redux/STATE_ACTIVATED_EVENT'
export const STATE_INACTIVATED_EVENT = 'wechaty-redux/STATE_INACTIVATED_EVENT'

export const DONG_RECEIVED_EVENT        = 'wechaty-redux/DONG_RECEIVED_EVENT'
export const ERROR_RECEIVED_EVENT       = 'wechaty-redux/ERROR_RECEIVED_EVENT'
export const FRIENDSHIP_RECEIVED_EVENT  = 'wechaty-redux/FRIENDSHIP_RECEIVED_EVENT'
export const HEARTBEAT_RECEIVED_EVENT   = 'wechaty-redux/HEARTBEAT_RECEIVED_EVENT'
export const LOGIN_RECEIVED_EVENT       = 'wechaty-redux/LOGIN_RECEIVED_EVENT'
export const LOGOUT_RECEIVED_EVENT      = 'wechaty-redux/LOGOUT_RECEIVED_EVENT'
export const MESSAGE_RECEIVED_EVENT     = 'wechaty-redux/MESSAGE_RECEIVED_EVENT'
export const READY_RECEIVED_EVENT       = 'wechaty-redux/READY_RECEIVED_EVENT'
export const RESET_RECEIVED_EVENT       = 'wechaty-redux/RESET_RECEIVED_EVENT'
export const ROOM_INVITE_RECEIVED_EVENT = 'wechaty-redux/ROOM_INVITE_RECEIVED_EVENT'
export const ROOM_JOIN_RECEIVED_EVENT   = 'wechaty-redux/ROOM_JOIN_RECEIVED_EVENT'
export const ROOM_LEAVE_RECEIVED_EVENT  = 'wechaty-redux/ROOM_LEAVE_RECEIVED_EVENT'
export const ROOM_TOPIC_RECEIVED_EVENT  = 'wechaty-redux/ROOM_TOPIC_RECEIVED_EVENT'
export const SCAN_RECEIVED_EVENT        = 'wechaty-redux/SCAN_RECEIVED_EVENT'

/**
* Commands & their Events - Wechaty Puppet
*/
// export const DING_COMMAND  = 'wechaty-redux/DING_COMMAND'
// export const DINGED_EVENT  = 'wechaty-redux/DINGED_EVENT'

// export const RESET_COMMAND = 'wechaty-redux/RESET_COMMAND'
// export const RESETED_EVENT = 'wechaty-redux/RESETED_EVENT'

// export const LOGOUT_COMMAND = 'wechaty-redux/LOGOUT_COMMAND'
// export const LOGOUTED_EVENT = 'wechaty-redux/LOGOUTED_EVENT'

// export const SEND_MESSAGE_COMMAND = 'wechaty-redux/SEND_MESSAGE_COMMAND'
// export const MESSAGE_SENT_EVENT   = 'wechaty-redux/MESSAGE_SENT_EVENT'

/**
 * Wechaty Events
 */
// export const LOGIN_CONTACT_EVENT = 'wechaty-redux/LOGIN_CONTACT_EVENT'

/**
 * Huan(202203): TODO: remove SAY_XXX in the future
 *  use CQRS Wechaty instead.
 *
 * Wechaty Async APIs
 */
// export const SAY_REQUEST = 'wechaty-redux/SAY_REQUEST'
// export const SAY_SUCCESS = 'wechaty-redux/SAY_SUCCESS'
// export const SAY_FAILURE = 'wechaty-redux/SAY_FAILURE'

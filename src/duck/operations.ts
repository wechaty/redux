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
import type { Dispatch }  from 'redux'
// import type * as PUPPET   from 'wechaty-puppet'

import * as actions from './actions.js'

// const ding  = (dispatch: Dispatch) => (puppetId: string, data: string)  => dispatch(actions.dingCommand(puppetId, data))
// const reset = (dispatch: Dispatch) => (puppetId: string, data: string)  => dispatch(actions.resetCommand(puppetId, data))

// const say   = (dispatch: Dispatch) => (
//   puppetId       : string,
//   conversationId : string,
//   sayable        : PUPPET.payloads.Sayable,
// ) => dispatch(actions.sayAsync.request({ conversationId, puppetId, sayable }))

/**
 * Remove the puppet from registry
 *  caution: all actions will failed if the specified puppet id is not in the registry
 */
const deregisterPuppet = (dispatch: Dispatch) => (puppetId: string) => dispatch(actions.deregisterPuppetCommand(puppetId))

const nop = (dispatch: Dispatch) => () => dispatch(actions.nopCommand())

export {
  // ding,
  // reset,
  // say,

  deregisterPuppet,

  nop,
}

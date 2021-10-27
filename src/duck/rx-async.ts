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
  from,
  of,
}                 from 'rxjs'
import {
  ignoreElements,
  catchError,
  mapTo,
  // eslint-disable-next-line import/extensions
}                 from 'rxjs/operators'

import {
  getWechaty,
}                 from '../manager.js'

import * as actions from './actions.js'

const ding$ = (action: ReturnType<typeof actions.ding>) => of(  // void
  getWechaty(action.payload.wechatyId)
    .ding(action.payload.data),
).pipe(
  ignoreElements(),
  catchError(e => of(
    actions.errorEvent(
      action.payload.wechatyId,
      { ...e },
    ),
  )),
)

/**
 * Huan(202109): the return type of wechaty.reset() is void
 *  which means we will not get any response from wechaty.reset()
 */
const reset$ = (action: ReturnType<typeof actions.reset>) => of(
  getWechaty(action.payload.wechatyId)
    .reset(action.payload.data),
).pipe(
  ignoreElements(),
  catchError((e: Error) => of(
    actions.errorEvent(
      action.payload.wechatyId,
      { data: String(e) }, // { ...e },
    ),
  )),
)

const say$ = (action: ReturnType<typeof actions.sayAsync.request>) => from( // promise
  getWechaty(action.payload.wechatyId)
    .puppet.messageSendText(
      action.payload.conversationId,
      action.payload.text,
    ),
).pipe(
  mapTo(actions.sayAsync.success({
    id        : action.payload.id,
    wechatyId : action.payload.wechatyId,
  })),
  catchError(e => of(
    actions.sayAsync.failure({
      error     : e,
      id        : action.payload.id,
      wechatyId : action.payload.wechatyId,
    }),
  )),
)

export {
  ding$,
  reset$,
  say$,
}

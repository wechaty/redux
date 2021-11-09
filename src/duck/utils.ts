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
  EMPTY,
  from,
  of,
  mergeMap,
  Observable,
}                 from 'rxjs'
import {
  mapTo,
  filter,
  map,
}                 from 'rxjs/operators'

import { getWechaty } from '../manager.js'

import type * as actions from './actions.js'
import type { Message } from 'wechaty'
import { type } from 'wechaty'

const throwUndefined = <T> (value?: T): T => {
  if (value) return value
  throw new Error('throwUndefined() value is undefined')
}

const skipUndefined$ = <T> (value?: T): typeof EMPTY | Observable<T> => {
  if (value) return of(value)
  return EMPTY
}

/**
 * Example: `pipe(mergeMap(toMessage$))`
 */
const toMessage$ = (action: ReturnType<typeof actions.messageEvent>) => {
  const wechaty = getWechaty(action.payload.wechatyId)
  return from(
    wechaty.Message.find({ id: action.payload.messageId }),
  ).pipe(
    map(throwUndefined),
  )
}

const toContact$ = (action: ReturnType<typeof actions.loginEvent>) => {
  const wechaty = getWechaty(action.payload.wechatyId)
  return from(
    wechaty.Contact.find({ id: action.payload.contactId }),
  ).pipe(
    map(throwUndefined),
  )
}

const toContactPayload$ = (action: ReturnType<typeof actions.loginEvent>) => from(
  getWechaty(action.payload.wechatyId)
    .puppet.contactPayload(action.payload.contactId),
).pipe(
  map(payload => ({
    ...payload,
    wechatyId: action.payload.wechatyId,
  })),
)

const isTextMessage = (text?: string) => (message: Message) => (
  message.type() === type.Message.Text
) && (
  text
    ? text === message.text()
    : true
)
const isWechaty = (wechatyId: string) => (action: ReturnType<typeof actions.messageEvent>) => action.payload.wechatyId === wechatyId

const skipSelfMessage$ = (action: ReturnType<typeof actions.messageEvent>) => {
  const wechaty = getWechaty(action.payload.wechatyId)

  return from(
    wechaty.Message.find({ id: action.payload.messageId }),
  ).pipe(
    mergeMap(skipUndefined$),
    filter(message => !message.self()),
    mapTo(action),
  )
}

export {
  toMessage$,
  toContact$,
  toContactPayload$,
  isTextMessage,
  isWechaty,
  skipSelfMessage$,
}

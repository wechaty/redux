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
  createReducer,
  ActionType,
}                     from 'typesafe-actions'
import type {
  DeepReadonly,
}                     from 'utility-types'

import type * as PUPPET from 'wechaty-puppet'

import * as actions from './actions.js'

// type DeepWritable<T> = T extends ((...args: any[]) => any) | Primitive ? T : T extends _DeepReadonlyArray<infer U> ? _DeepReadonlyArray<U> : T extends _DeepReadonlyObject<infer V> ? _DeepReadonlyObject<V> : T;

// interface _DeepWritableArray<T> extends WritableArray<DeepWritable<T>> {
// }

// type _DeepWritableObject<T> = {
//   -readonly [P in keyof T]: DeepReadonly<T[P]>;
// };

type State = DeepReadonly<{
  puppet: {
    [puppetId: string]: undefined | {
      currentUser? : PUPPET.payloads.Contact,
      qrcode?      : string,
      wechatyId?   : string
    }
  }
  wechaty: {
    [wechatyId: string]: undefined | {
      puppetId?: string
    }
  },
}>

const initialState: State = {
  puppet  : {},
  wechaty : {},
}

const reducer = createReducer<typeof initialState, ActionType<typeof actions>>(initialState)
  .handleAction(actions.scanEvent, (state, action) => {
    const newState: State = {
      ...state,
      puppet: {
        ...state.puppet,
        [action.payload.puppetId]: {
          ...state.puppet[action.payload.puppetId],
          currentUser: undefined,
          qrcode: action.payload.qrcode,
        },
      },
    }
    return newState
  })
  .handleAction(actions.login, (state, action) => {
    const newState: State = {
      ...state,
      puppet: {
        ...state.puppet,
        [action.payload.puppetId]: {
          ...state.puppet[action.payload.puppetId],
          currentUser: action.payload,
          qrcode: undefined,
        },
      },
    }
    return newState
  })
  .handleAction([
    actions.logoutEvent,
    actions.stopEvent,
  ], (state, action) => {
    const newState: State = {
      ...state,
      puppet: {
        ...state.puppet,
        [action.payload.puppetId]: {
          ...state.puppet[action.payload.puppetId],
          currentUser : undefined,
          qrcode      : undefined,
        },
      },
    }
    return newState
  })
  /**
   * Register & Deregister Puppet
   */
  .handleAction(actions.registerPuppet, (state, action) => {
    const newState: State = {
      ...state,
      puppet: {
        ...state.puppet,
        [action.payload.puppetId]: {
          ...state.puppet[action.payload.puppetId],
        },
      },
    }
    return newState
  })
  .handleAction(actions.deregisterPuppet, (state, action) => {
    const newState: State = {
      ...state,
      puppet: {
        ...state.puppet,
        [action.payload.puppetId]: undefined,
      },
    }
    return newState
  })
  /**
   * Register & Deregister Wechaty
   */
  .handleAction(actions.registerWechaty, (state, action) => {
    const newState: State = {
      ...state,
      wechaty: {
        ...state.wechaty,
        [action.payload.wechatyId]: {
          ...state.wechaty[action.payload.wechatyId],
        },
      },
    }
    return newState
  })
  .handleAction(actions.deregisterWechaty, (state, action) => {
    const newState: State = {
      ...state,
      wechaty: {
        ...state.wechaty,
        [action.payload.wechatyId]: undefined,
      },
    }
    return newState
  })
  /**
   * Bind & Unbind Wechaty <> Puppet
   */
  .handleAction(actions.bindWechatyPuppet, (state, action) => {
    const newState: State = {
      ...state,
      puppet: {
        ...state.puppet,
        [action.payload.puppetId]: {
          ...state.puppet[action.payload.puppetId],
          wechatyId: action.payload.wechatyId,
        },
      },
      wechaty: {
        ...state.wechaty,
        [action.payload.wechatyId]: {
          ...state.wechaty[action.payload.wechatyId],
          puppetId: action.payload.puppetId,
        },
      },
    }
    return newState
  })
  .handleAction(actions.unbindWechatyPuppet, (state, action) => {
    const newState: State = {
      ...state,
      puppet: {
        ...state.puppet,
        [action.payload.puppetId]: {
          ...state.puppet[action.payload.puppetId],
          wechatyId: undefined,
        },
      },
      wechaty: {
        ...state.wechaty,
        [action.payload.wechatyId]: {
          ...state.wechaty[action.payload.wechatyId],
          puppetId: undefined,
        },
      },
    }
    return newState
  })

export type {
  State,
}
export default reducer

import { Dispatch } from 'redux'

import * as actions from './actions'

const ding = (dispatch: Dispatch) => (wechatyId: string, data: string)  => dispatch(actions.ding(wechatyId, data))
const say  = (dispatch: Dispatch) => (wechatyId: string, conversationId: string, text: string)  => dispatch(actions.sayAsync.request({ conversationId, text, wechatyId }))

const noop = (dispatch: Dispatch) => ()  => dispatch(actions.noop())

export {
  ding,
  say,

  noop,
}

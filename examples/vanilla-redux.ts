import {
  createStore,
  applyMiddleware,
}                         from 'redux'
import {
  createEpicMiddleware,
  combineEpics,
}                         from 'redux-observable'
import { Wechaty }        from 'wechaty'
import {
  WechatyRedux,
  Api,
}                         from '../src/'  // 'wechaty-redux'

/**
 * 1. Configure Store with RxJS Epic Middleware for Wechaty Ducks API
 */
const epicMiddleware = createEpicMiddleware()

const store = createStore(
  Api.default,
  applyMiddleware(epicMiddleware),
)

const rootEpic = combineEpics(...Object.values(Api.epics))
epicMiddleware.run(rootEpic)

/**
 * 2. Instanciate Wechaty and Install Redux Plugin
 */
const bot = Wechaty.instance({ puppet: 'wechaty-puppet-mock' })
bot.use(WechatyRedux({ store }))

/**
 * 3. Using Redux Store with Wechaty Ducks API!
 */
store.subscribe(() => console.info(store.getState()))

store.dispatch(Api.actions.ding(bot.id, 'dispatch a ding action'))
// The above code 👆 is exactly do the same thing with the following code 👇 :
Api.operations.ding(store.dispatch)(bot.id, 'call ding from operations')

import { Wechaty } from 'wechaty'
import { Ducks }   from 'ducks'
import {
  WechatyRedux,
  Api,
}                 from '../src/' // 'wechaty-redux'

/**
 * 1. Ducksify Wechaty Redux API
 */
const ducks = new Ducks({ wechaty: Api })
const store = ducks.configureStore()

/**
 * 2. Instanciate Wechaty with Redux Plugin
 */
const bot = Wechaty.instance({ puppet: 'wechaty-puppet-mock' })
bot.use(WechatyRedux({ store }))

/**
 * 3. Using Redux Store with Wechaty Ducks API!
 *  (With the Power of Ducks / Ducksify)
 */
const wechatyDuck = ducks.ducksify('wechaty')

store.subscribe(() => console.info(store.getState()))
wechatyDuck.operations.ding(bot.id, 'Ducksify Style ding!')

#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

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
  test,
  sinon,
}             from 'tstest'

import {
  WechatyBuilder,
  Message,
}                   from 'wechaty'
import * as PUPPET  from 'wechaty-puppet'

import {
  createStore,
  compose,
}                               from 'redux'
import { composeWithDevTools }  from 'remote-redux-devtools'
import {
  Ducks,
  noopReducer,
}                               from 'ducks'

import {
  mock,
  PuppetMock,
}                 from 'wechaty-puppet-mock'

import {
  getPuppet,
  getWechaty,
}                 from './registry/mod.js'
import * as Duck  from './duck/mod.js'

import {
  WechatyRedux,
}                 from './wechaty-redux.js'

async function * wechatyFixtures () {
  const ducks = new Ducks({
    wechaty : Duck,
  })

  let devCompose = compose

  if (process.env['REDUX_DEVTOOLS']) {
    devCompose = composeWithDevTools({
      hostname : 'localhost',
      port     : 8000,
      realtime : true,
      stopOn   : Duck.types.NOOP,
    }) as any
  }

  const ducksEnhancer = ducks.enhancer()

  const store = createStore(
    noopReducer,
    devCompose(
      ducksEnhancer,
    ) as typeof ducksEnhancer,
  )

  const mocker = new mock.Mocker()
  const puppet = new PuppetMock({ mocker })
  const bot = WechatyBuilder.build({ puppet })

  const duck = ducks.ducksify('wechaty')

  bot.use(WechatyRedux({ store }))

  // store.subscribe(() => console.info(store.getState()))

  await bot.start()

  yield {
    bot,
    duck,
    ducks,
    mocker,
    store,
  }

  // Stop the Redux Remote DevTools Server Connection
  duck.operations.noop()

  await bot.stop()
}

test('WechatyRedux: selectors.{isLoggedIn,getQrCode,getUserPayload}()', async t => {
  for await (const {
    bot,
    mocker,
    duck,
  } of wechatyFixtures()) {

    t.equal(duck.selectors.isLoggedIn(bot.puppet.id), false, 'should not logged in at start')
    t.notOk(duck.selectors.getQrCode(bot.puppet.id), 'should no QR Code at start')
    t.notOk(duck.selectors.getCurrentUser(bot.puppet.id), 'should no user payload at start')

    const QR_CODE = 'qrcode'
    mocker.scan(QR_CODE)
    t.equal(duck.selectors.getQrCode(bot.puppet.id), QR_CODE, 'should get QR Code right')

    const user = mocker.createContact()
    mocker.login(user)

    // Let the bullets fly
    await new Promise(resolve => setImmediate(resolve))

    t.ok(duck.selectors.isLoggedIn(bot.puppet.id), 'should logged in after login(user)')
    t.notOk(duck.selectors.getQrCode(bot.puppet.id), 'should no QR Code after user login')
    t.same(duck.selectors.getCurrentUser(bot.puppet.id), { ...user.payload, puppetId: bot.puppet.id }, 'should login user with payload')

    await bot.logout()
    t.notOk(duck.selectors.isLoggedIn(bot.puppet.id), 'should logged out after call bot.logout')
  }
})

test('WechatyRedux: operations.ding()', async t => {
  for await (const {
    bot,
    duck,
  } of wechatyFixtures()) {

    const DATA = 'test'

    const sandbox = sinon.createSandbox()
    const spy = sandbox.spy(bot.puppet, 'ding')

    duck.operations.ding(bot.puppet.id, DATA)

    // Let the bullets fly
    await new Promise(setImmediate)

    t.ok(spy.calledOnce, 'should call bot.ding()')
    t.ok(spy.calledWith(DATA), 'should called with DATA')
  }
})

test('WechatyRedux: operations.say()', async t => {
  for await (const {
    bot,
    duck,
    mocker,
  } of wechatyFixtures()) {

    const TEXT = 'Hello, world.'

    const [user, mary] = mocker.createContacts(2) as [mock.ContactMock, mock.ContactMock]
    mocker.login(user)

    const sandbox = sinon.createSandbox()
    const spy = sandbox.spy(bot.puppet, 'messageSendText')

    const EXPECTED_ARGS = [
      mary.id,
      TEXT,
    ]
    duck.operations.say(bot.puppet.id, mary.id, TEXT)

    // Let the bullets fly
    await new Promise(resolve => setImmediate(resolve))

    t.ok(spy.calledOnce, 'should call bot.say()')
    t.ok(spy.calledWith(...EXPECTED_ARGS), 'should call say() with expected args')
  }
})

test('WechatyRedux: Puppet `message` event', async t => {
  for await (const {
    bot,
    mocker,
  } of wechatyFixtures()) {

    const TEXT = 'Hello, world.'

    const [user, mary] = mocker.createContacts(2) as [mock.ContactMock, mock.ContactMock]
    mocker.login(user)

    const future = new Promise<Message>(resolve => bot.once('message', resolve))

    mary.say(TEXT).to(user)

    const msg = await future

    const EXPECTED_PAYLOAD: PUPPET.payload.Message = {
      fromId        : mary.id,
      id            : msg.id,
      mentionIdList : [],
      text          : TEXT,
      timestamp     : msg.date().getTime(),
      toId          : user.id,
      type          : PUPPET.type.Message.Text,

    }

    // Huan(202006) Workaround for puppet payload mismatch
    delete (EXPECTED_PAYLOAD as any).mentionIdList

    t.same((msg as any)._payload, EXPECTED_PAYLOAD, 'should receive message with expected payload')
  }
})

test.only('WechatyRedux: getPuppet() & getWechaty()', async t => {
  // const ducks = new Ducks({
  //   wechaty : Duck,
  // })

  // const store = createStore(
  //   noopReducer,
  //   ducks.enhancer(),
  // )

  const puppet = new PuppetMock()
  const wechaty = WechatyBuilder.build({ puppet })

  const spy = sinon.spy()
  const store = {
    dispatch: spy,
  }

  t.notOk(getWechaty(wechaty.id), 'should has no wechaty registered')
  t.notOk(getPuppet(puppet.id), 'should has no puppet registered')

  wechaty.use(WechatyRedux({ store } as any))

  t.equal(getWechaty(wechaty.id), wechaty, 'should has wechaty registered after use plugin')
  t.notOk(getPuppet(puppet.id), 'should has no puppet registered after use plugin')

  await wechaty.start()
  t.equal(getPuppet(puppet.id), puppet, 'should has puppet registered after wechaty start')

  t.same(spy.args[0]![0], Duck.actions.registerWechaty(wechaty.id), 'should emit register wechaty action')
  t.same(spy.args[1]![0], Duck.actions.registerPuppet(puppet.id), 'should emit register puppet action')
  t.same(spy.args[2]![0], Duck.actions.bindWechatyPuppet({ puppetId: puppet.id, wechatyId: wechaty.id }), 'should emit bind wechaty puppet action')

  spy.resetHistory()
  await wechaty.stop()

  console.info(spy.args)
})

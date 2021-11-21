#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  sinon,
}                           from 'tstest'
import { PuppetMock }       from 'wechaty-puppet-mock'
import type {
  Store,
}                           from 'redux'

import * as duck    from './duck/mod.js'
import {
  getPuppet,
}                   from './registry/mod.js'

import {
  puppet$,
}                           from './puppet$.js'

test('puppet$()', async t => {
  const spy = sinon.spy()
  const puppet = new PuppetMock()

  const store = {
    dispatch: spy,
  } as any as Store

  t.notOk(getPuppet(puppet.id), 'should not have puppet in registry')

  const $ = puppet$(puppet, { store })

  const sub = $.subscribe(store.dispatch)
  t.ok(spy.calledOnce, 'should have one action after subscribe')
  t.same(spy.args[0]![0], duck.actions.registerPuppet(puppet.id), 'should get puppet register action')
  t.equal(getPuppet(puppet.id), puppet, 'should have puppet in registry')

  spy.resetHistory()
  sub.unsubscribe()
  t.ok(spy.calledOnce, 'should have one action after unsubscribe')
  t.same(spy.args[0]![0], duck.actions.deregisterPuppet(puppet.id), 'should get puppet deregister action')
  t.notOk(getPuppet(puppet.id), 'should not have puppet in registry')
})

#!/usr/bin/env ts-node

import {
  test,
}             from 'tstest'

import {
  WechatyRedux,
}                 from '../src/'

test('integration testing', async (t) => {
  const name = WechatyRedux({ store: {} as any }).name
  t.ok(name, 'should be set: ' + WechatyRedux.name + ' -> ' + name)
  t.equal(WechatyRedux.name + 'Plugin', name, 'should follow the naming style: Name -> NamePlugin')
})

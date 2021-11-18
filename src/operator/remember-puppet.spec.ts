#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  sinon,
}                       from 'tstest'
import { Subject }      from 'rxjs'
import { PuppetMock }   from 'wechaty-puppet-mock'

import {
  rememberPuppet,
  refForget,
  refRemember,
  puppetRef,
}                   from './remember-puppet.js'

test('refRemember() & refForget()', async t => {
  const puppet = new PuppetMock()
  const pool   = new Map()

  t.equal(pool.size, 0, 'should be 0 puppet in pool at initial')
  t.equal(puppetRef.size, 0, 'should be 0 puppet in ref at initial')

  let counter

  counter = refRemember(pool)(puppet)
  t.equal(counter, 1, 'should be 1 ref after remember once')
  t.equal(pool.size, 1, 'should be 1 puppet in pool after remember once')
  t.equal(puppetRef.size, 1, 'should be 1 puppet in ref after remember once')
  t.equal(pool.get(puppet.id), puppet, 'should get puppet from pool after remember once')
  t.equal(puppetRef.get(puppet.id), 1, 'should get 1 puppet ref after remember once')

  counter = refRemember(pool)(puppet)
  t.equal(counter, 2, 'should be 2 ref after remember twice')
  t.equal(pool.size, 1, 'should be 1 puppet in pool after remember twice')
  t.equal(puppetRef.size, 1, 'should be 1 puppet in ref after remember twice')
  t.equal(pool.get(puppet.id), puppet, 'should get puppet from pool after remember twice')
  t.equal(puppetRef.get(puppet.id), 2, 'should get 2 puppet ref after remember twice')

  counter = refForget(pool)(puppet)
  t.equal(counter, 1, 'should be 1 ref after forget once')
  t.equal(pool.size, 1, 'should be 1 puppet in pool after forget once')
  t.equal(puppetRef.size, 1, 'should be 1 puppet in ref after forget once')
  t.equal(pool.get(puppet.id), puppet, 'should get puppet from pool after forget once')
  t.equal(puppetRef.get(puppet.id), 1, 'should get 1 puppet ref after forget once')

  counter = refForget(pool)(puppet)
  t.equal(counter, 0, 'should be 1 ref after forget twice')
  t.equal(pool.size, 0, 'should be 1 puppet in pool after forget twice')
  t.equal(puppetRef.size, 0, 'should be 1 puppet in ref after forget twice')
})

test('rememberPuppet()', async t => {
  const spy    = sinon.spy()
  const puppet = new PuppetMock()
  const pool   = new Map()

  const $ = new Subject().pipe(
    rememberPuppet(pool)(puppet),
  )

  t.equal(pool.size, 0, 'should be 0 puppet in pool at initial')
  t.equal(puppetRef.size, 0, 'should be 0 puppet in ref at initial')

  const sub1 = $.subscribe(spy)
  t.equal(pool.size, 1, 'should be 1 puppet in pool after subscribe once')
  t.equal(puppetRef.size, 1, 'should be 1 puppet in ref after subscribe once')
  t.equal(pool.get(puppet.id), puppet, 'should get puppet from pool after subscribe once')
  t.equal(puppetRef.get(puppet.id), 1, 'should get 1 puppet ref after subscribe once')

  const sub2 = $.subscribe(spy)
  t.equal(pool.size, 1, 'should be 1 puppet in pool after subscribe twice')
  t.equal(puppetRef.size, 1, 'should be 1 puppet in ref after subscribe twice')
  t.equal(pool.get(puppet.id), puppet, 'should get puppet from pool after subscribe twice')
  t.equal(puppetRef.get(puppet.id), 2, 'should get 1 puppet ref after subscribe twice')

  sub1.unsubscribe()
  t.equal(pool.size, 1, 'should be 1 puppet in pool after unsubscribe once')
  t.equal(puppetRef.size, 1, 'should be 1 puppet in ref after unsubscribe once')
  t.equal(pool.get(puppet.id), puppet, 'should get puppet from pool after unsubscribe once')
  t.equal(puppetRef.get(puppet.id), 1, 'should get 1 puppet ref after unsubscribe once')

  sub2.unsubscribe()
  t.equal(pool.size, 0, 'should be 1 puppet in pool after unsubscribe twice')
  t.equal(puppetRef.size, 0, 'should be 1 puppet in ref after unsubscribe twice')
})

#!/usr/bin/env ts-node
import {
  Api,
  WechatyRedux,
  VERSION,
}                 from 'wechaty-redux'
import { Ducks }  from 'ducks'
import { Wechaty } from 'wechaty'

async function main () {
  if (VERSION === '0.0.0') {
    throw new Error('version should be set before publishing')
  }

  const ducks = new Ducks({ wechaty: Api })
  const store = ducks.configureStore()

  const wechaty = Wechaty.instance({ puppet: 'wechaty-puppet-mock' })

  wechaty.use(
    WechatyRedux({ store })
  )

  return 0
}

main()
  .then(process.exit)
  .catch(e => {
    console.error(e)
    process.exit(1)
  })

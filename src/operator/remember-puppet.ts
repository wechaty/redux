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
import type * as PUPPET from 'wechaty-puppet'

import {
  Observable,
}               from 'rxjs'

import type { puppetPool } from '../puppet-pool.js'

const puppetRef = new Map<string, number>()

const refRemember = (pool: typeof puppetPool) => (puppet: PUPPET.impl.PuppetInterface) => {
  const counter = puppetRef.get(puppet.id) ?? 0

  if (counter === 0) {
    pool.set(puppet.id, puppet)
  }

  puppetRef.set(puppet.id, counter + 1)
}

const refForget = (pool: typeof puppetPool) => (puppet: PUPPET.impl.PuppetInterface) => {
  const counter = puppetRef.get(puppet.id) ?? 0

  if (counter > 1) {
    puppetRef.set(puppet.id, counter - 1)
  } else {
    pool.delete(puppet.id)
    puppetRef.delete(puppet.id)
  }
}

/**
* Creating new operators from scratch
*  @see https://rxjs.dev/guide/operators
*/
const rememberPuppet = (pool: typeof puppetPool) => <T> (puppet: PUPPET.impl.PuppetInterface) =>
  (observable: Observable<T>) => new Observable<T>((subscriber) => {
    refRemember(pool)(puppet)
    subscriber.add(() => refForget(pool)(puppet))
    return observable.subscribe(subscriber)
  })

export {
  rememberPuppet,
  refRemember,
  refForget,
  puppetRef,
}

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
import type { Wechaty } from 'wechaty'

const instanceStore = new Map<string, Wechaty>()

const getWechaty = (puppetId: string): Wechaty => {
  const wechaty = instanceStore.get(puppetId)
  if (!wechaty) {
    throw new Error('no wechaty found for puppet id ' + puppetId)
  }
  return wechaty
}

const setWechaty = (wechaty: Wechaty): void => {
  const id = wechaty.puppet.id
  if (instanceStore.get(id)) {
    throw new Error('wechaty puppet id ' + id + ' has already been set before! it can not be set twice.')
  }
  instanceStore.set(id, wechaty)
}

const removeWechaty = (wechaty: Wechaty): void => {
  const id = wechaty.puppet.id
  if (!instanceStore.get(id)) {
    throw new Error('wechaty puppet id ' + id + ' does not exist!')
  }
  instanceStore.delete(id)

}

const getMessage = async (puppetId: string, messageId: string) => getWechaty(puppetId).Message.find({ id: messageId })
const getRoom    = async (puppetId: string, roomId: string)    => getWechaty(puppetId).Room.find({ id: roomId })
const getContact = async (puppetId: string, contactId: string) => getWechaty(puppetId).Contact.find({ id: contactId })

export {
  getWechaty,
  setWechaty,
  removeWechaty,

  getMessage,
  getRoom,
  getContact,
}

// reactive 响应式是通过Proxy来实现的, 通过proxy可以监听到对象getter和setter, 从而实现响应式

import { track } from "./effect"

// raw为原始对象 let raw = { age: 1 }
export function reactive(raw: any) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key)
      track(target, key)
      return res
    },
    set(target, key, newValue) {
      // 
      return true
    }
  })
}

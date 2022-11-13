// reactive 响应式是通过Proxy来实现的, 通过proxy可以监听到对象getter和setter, 从而实现响应式

import { track, trigger } from "./effect"

// raw为原始对象 let raw = { age: 1 }
// raw会通过 reactive 或 ref 对原始数据做一层代理，借助 effect 收集依赖，在原始数据改变的时候，去触发依赖，也就是自动执行一遍 effect 的函数
export function reactive(raw: any) {
  return new Proxy(raw, {
    get(target, key) {
      const value = Reflect.get(target, key)
      // 收集依赖
      track(target, key)
      return value 
    },
    set(target, key, newValue) {
      const res = Reflect.set(target, key, newValue)
      trigger(target, key)
      return res
    }
  })
}

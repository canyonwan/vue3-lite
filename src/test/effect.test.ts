import { describe, expect, test, vitest } from 'vitest'
import { effect } from '../reactivity/effect'
import { reactive } from '../reactivity/reactive'

describe('test effect', () => {
  // 这里说要测试 当响应式对象触发getter或settter的时候, effect里的函数会call
  test('effect fn should self-executing ', () => {
    const user = reactive({ name: 'canyonwan', age: 1 })
    let nextAge: number = 0
    expect(nextAge).toBe(0)

    // 依赖
    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(2)

    // update
    // 当我们修改响应式值的时候会触发更新依赖的操作
    user.age++ // (响应式数据的setter会触发effect里的函数)
    expect(nextAge).toBe(3)
  })

  test('should return runner when call effect', () => {
    // 当执行effect的时候, 会返回一个runner函数, 当再次执行runner的时候会再次调用effect的函数
    let foo = 1
    const runner = effect(() => {
      foo++
      return 'runner foo'
    })

    // 我希望第一次会执行到effect里的函数
    //  一开始我们希望foo是2
    expect(foo).toBe(2)

    // 执行runner
    const run = runner()
    expect(foo).toBe(3)

    // 主动调用runner会拿到返回值
    expect(run).toBe('runner foo')
  })

  test('effect fn should not be called when it has scheduler option', () => {
    // effect 会默认执行一次, 但是如果传入了scheduler, 当响应式对象变化时不会再次执行effect fn, 只会执行scheduler
    let dummy: number = 0
    let run: any
    const user = reactive({ name: 'canyonwan', age: 1 })
    const scheduler = vitest.fn(() => {
      run = runner
    })

    const runner = effect(
      () => {
        dummy = user.age + 1
      },
      {
        scheduler,
      }
    )

    // 一开始scheduler不会执行
    expect(scheduler).not.toBeCalled()
    // 一开始只会执行effect fn一次
    expect(dummy).toBe(2)
    // 当更新响应式对象的时候不会执行effect fn , 只会执行scheduler
    user.age++
    // 当有了scheduler的时候, effect fn不会再次执行
    expect(scheduler).toBeCalledTimes(1)
    expect(dummy).toBe(2)
    // 当主动调用runner的时候执行scheduler里被赋值的run
    run() // 执行run之所以下面的dummy会变成3, 是因为run里执行了runner, runner里执行了effect fn
    expect(dummy).toBe(3)
  })

  test('stop fn', () => {
    let dummy: number = 0
    const obj = reactive({ foo: 1 })
    const runner = effect(() => {
      dummy = obj.foo + 1
    })
    // 首次进入执行一次effect
    expect(dummy).toBe(2)

    obj.foo++
    // 执行stop, 会停止effect
    // 添加stop方法
    stop(runner)
    // - dummy不会增加
    expect(dummy).toBe(2)
    // 执行runner 会再次执行effect
    runner()
    expect(dummy).toBe(3)
  })
})

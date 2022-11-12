import { describe, expect, test } from "vitest";
import { reactive } from "../reactive";
import { effect } from "../reactivity/effect";

describe("test", () => {
  test("test", () => {
    const user = reactive({ name: 'canyonwan', age: 1 })
    let nextAge: number = 0

    // 依赖
    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(2)

    // update
    // 当我们修改响应式值的时候会触发更新依赖的操作
    user.age++
    expect(nextAge).toBe(3)
  })
});

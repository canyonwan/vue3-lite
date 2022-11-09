import { describe, expect, test } from "vitest";
import { reactive } from "../reactive";

describe('reactive', () => {
  test('happy path', () => {
    const original = { name: 'canyonwan', age: 1 }
    const observed = reactive(original)
    expect(original).not.toBe(observed)
    expect(observed.age).toBe(1)
  })
})

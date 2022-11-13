class ReactiveEffect {
  private _fn: Function
  constructor(fn: Function) {
    this._fn = fn
  }
  // 类的方法
  run() {
    currentEffect = this;
    this._fn()
  }
}

let currentEffect: ReactiveEffect | null = null

// 收集依赖, 自动执行
// 我们希望当调用effect里的方法的时候调用effect里的fn
export function effect(fn: Function) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

// target收集用户创建的所有reactive包裹的对象({} | [])
// targetsMap的结构是: targetsMap = { target: { key: [effect1, effect2] } }, targetsMap: WeakMap<object, Map<string, ReactiveEffect[]>>
// targetsMap: {
//   // key 是对象，value 是 depsMap
//   {age: 25} : {
//     // key 是对象里边的 key， value 是 dep
//     age: [ ...此处存储一个个依赖 ]
//   }
// }
// - 通俗的来讲: targetsMap是一个对象, 里面有一个key(属性)是target -> 值是一个Map, 里面有一个属性key(用户访问的对象属性,如{age: 18}的age) -> 值是一个数组, 数组里面收集的所有依赖
// -- 如effect1和effect2
// WeakMap 对象是一组键/值对的集合，其中的键是弱引用的。其键必须是对象，而值可以是任意的。
// - 这意味着在没有其他引用存在时垃圾回收能正确进行
const targetsMap = new WeakMap() 
export function track(target: Object, key: string | symbol) {
  // targetsMap通过key获取到所有的depsMap
  let depsMap = targetsMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetsMap.set(target, depsMap)
  }
  // depsMap存储的是所有的{ dep -> [effect1, effect2] }
  // depsMap通过key获取到所有的deps
  let deps = depsMap.get(key)
  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }
  deps.add(currentEffect)
}

// 触发依赖
// 基于target和key, 取出对应的deps集合, 然后遍历集合, 依次执行effect
export function trigger(target: Object, key: string | symbol) {
  let depsMap = targetsMap.get(target)
  let deps = depsMap.get(key)
  for (const dep of deps) {
    dep.run()
  }
}

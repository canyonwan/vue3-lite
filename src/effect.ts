class ReactiveEffect {
  private _fn: Function
  constructor(fn: Function) {
    this._fn = fn
  }
  // 类的方法
  run() {
    this._fn()
  }
}

// 收集依赖, 自动执行
// 我们希望当调用effect里的方法的时候调用effect里的fn
export function effect(fn: Function) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}


const targetMap = new Map()
export function track(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep  = new Set()
  }
  // let dep = depsMap.get(key)
  // if (!dep) {
  //   dep = new Map()
  // }
}

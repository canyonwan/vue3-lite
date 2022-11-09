class createReactiveEffect {
  private _fn: Function
  constructor(fn: Function) {
    this._fn = fn
  }

  run() {
    this._fn()
  }

}
export function effect(fn: Function) {
  // 这里是一个自执行函数
  const _effect = new createReactiveEffect(fn)
  _effect.run()
}

/**
 * @Author: Pacific_D
 * @Date: 2022-04-02 11:16:12
 * @LastEditTime: 2022-04-08 16:47:05
 * @LastEditors: Pacific_D
 * @Description: 
 * @FilePath: \Promise\MyPromise.js
 */
const PENDING = 'PENDING',
    FULFILLED = 'FULFILLED',
    REJECTED = 'REJECTED'

class MyPromise {
    constructor(executor) {
        this.status = PENDING
        this.value
        this.reason
        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []

        const resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULFILLED
                this.value = value
                //发布
                this.onFulfilledCallbacks.forEach(fn => fn())
            }
        }

        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED
                this.reason = reason
                //发布
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }

        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }

    then(onFulfilled, onRejected) {
        //then方法没有传入参数时，往下传递value/reason
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason}

        let promise2 = new MyPromise((resolve, reject) => {
            //x为普通值或Promise
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            }

            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            }

            if (this.status === PENDING) {
                //订阅
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
            }
        })

        return promise2
    }

    catch(errorCallback){
        return this.then(null, errorCallback)
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Changing cycle detected for promise #<MyPromise>'))
    }

    let called = false

    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        try {
            //then可能被Object.defineProperty拦截
            let then = x.then
            if (typeof then === 'function') {
                //x为promisse
                then.call(x, (y) => {
                    if(called) return
                    called = true
                    //递归调用（嵌套resolve(Promise)的情况）
                    resolvePromise(promise2, y, resolve, reject)
                }, (r) => {
                    if(called) return
                    called = true
                    reject(r)
                })
            } else {
                resolve(x)
            }
        } catch (e) {
            if(called) return
                    called = true
            reject(e)
        }
    }else{
        resolve(x)
    }
}

module.exports = MyPromise
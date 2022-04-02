/**
 * @Author: Pacific_D
 * @Date: 2022-04-02 11:16:12
 * @LastEditTime: 2022-04-02 16:31:54
 * @LastEditors: Pacific_D
 * @Description: 
 * @FilePath: \Promise\MyPromise.js
 */
const PENDING = 'PENDING',
    FULFILLED = 'FULFILLED',
    REJECTED = 'REJECTED'

class MyPromise {
    constructor (executor){
        this.status = PENDING
        this.value
        this.reason
        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []

        const resolve = (value) => {
            if(this.status === PENDING){
                this.status = FULFILLED
                this.value = value
                //发布
                this.onFulfilledCallbacks.forEach(fn => fn())
            }
        }

        const reject = (reason) => {
            if(this.status === PENDING) {
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

    then(onFulfilled, onRejected){
        if(this.status === FULFILLED){
            onFulfilled(this.value)
        }

        if(this.status === REJECTED){
            onRejected(this.reason)
        }

        if(this.status === PENDING){
            //订阅
            this.onFulfilledCallbacks.push(() => {
                onFulfilled(this.value)
            })
            this.onRejectedCallbacks.push(() => {
                onRejected(this.reason)
            })
        }
    }
}

module.exports = MyPromise
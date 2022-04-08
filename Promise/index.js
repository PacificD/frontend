/**
 * @Author: Pacific_D
 * @Date: 2022-04-02 10:38:37
 * @LastEditTime: 2022-04-08 11:10:51
 * @LastEditors: Pacific_D
 * @Description: 
 * @FilePath: \Promise\index.js
 */
const MyPromise = require('./MyPromise')

let promise1 = new MyPromise((resolve, reject) => {
    // resolve("success")
    // throw new Error('Exception: Error')
    //异步宏任务
    setTimeout(() => {
        // resolve("success")
        reject('error')
    });
})

promise1.then((value) => {
    console.log('FulFilled1: ' + value)
    return 1
}, (reason) => {
    console.log('Rejected1: ' + reason)
    return reason
})

let promise2 = promise1.then((value) => {
    console.log('FulFilled2: ' + value)
}, (reason) => {
    console.log('Rejected2: ' + reason)
})

console.log(promise2);
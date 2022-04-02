/**
 * @Author: Pacific_D
 * @Date: 2022-04-02 10:38:37
 * @LastEditTime: 2022-04-02 17:06:15
 * @LastEditors: Pacific_D
 * @Description: 
 * @FilePath: \Promise\index.js
 */
const MyPromise = require('./MyPromise')

let promise = new MyPromise((resolve, reject) => {
    // resolve("success")
    // throw new Error('Exception: Error')
    //异步宏任务
    setTimeout(() => {
        resolve("success")
    });
})

promise.then((value) => {
    console.log('FulFilled1: ' + value)
}, (reason) => {
    console.log('22')
    console.log('Rejected1: ' + reason);
})

promise.then((value) => {
    console.log('FulFilled2: ' + value)
}, (reason) => {
    console.log('22')
    console.log('Rejected2: ' + reason);
})
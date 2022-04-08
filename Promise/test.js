/**
 * @Author: Pacific_D
 * @Date: 2022-04-04 14:33:55
 * @LastEditTime: 2022-04-04 14:33:55
 * @LastEditors: Pacific_D
 * @Description: 
 * @FilePath: \Promise\test.js
 */
let promise = new Promise((resovle, reject) => {
    setTimeout(() => {
        resovle('success')   
    });
})

promise.then(res => console.log(res))
/**
 * @Author: Pacific_D
 * @Date: 2022-07-19 20:00:36
 * @LastEditTime: 2022-07-20 15:46:14
 * @LastEditors: Pacific_D
 * @Description: 
 * @FilePath: \lessImg\lessImg-server\test.js
 */
const fs = require('fs'),
    path = require('path')

const FILE_DIR = path.join(__dirname, '/uploads')

const token = 1658302445000

const bufferList = fs.readdirSync(FILE_DIR).map((hash, index) => {
    const buffer = fs.readFileSync(FILE_DIR + '\\' + index + '-' + token)
    return buffer
})

console.log(bufferList)
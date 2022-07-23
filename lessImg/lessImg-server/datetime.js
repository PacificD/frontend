/**
 * @Author: Pacific_D
 * @Date: 2022-07-15 20:04:55
 * @LastEditTime: 2022-07-16 09:57:52
 * @LastEditors: Pacific_D
 * @Description: 
 * @FilePath: \lessImg\lessImg-server\datetime.js
 */
const { v4: uuidv4 } = require('uuid')

module.exports = function () {
    const date = new Date(),
        year = date.getFullYear(),
        month = (date.getMonth() + 1).toString().padStart(2, '0'),
        day = date.getDate()
    return year + "-" + month + "-" + day + '-' + uuidv4()
}
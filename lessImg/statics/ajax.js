/**
 * @Author: Pacific_D
 * @Date: 2022-07-15 20:40:48
 * @LastEditTime: 2022-07-19 16:05:17
 * @LastEditors: Pacific_D
 * @Description: 
 * @FilePath: \lessImg\statics\ajax.js
 */
// "application/x-www-form-urlencoded"
const ajax = (url, method = 'GET', data, preViewData) => {
    return new Promise((resolve, reject) => {
        const XHR = new XMLHttpRequest()
        XHR.open(method, url, true)
        //设置请求头
        // XHR.setRequestHeader("Content-type", contentType)
        //打印后端返回结果的对象
        XHR.onreadystatechange = function () {
            if (XHR.readyState === 4) {
                if (XHR.status === 200) {
                    try {
                        resolve(XHR.responseText)
                    } catch (e) {
                        reject(e)
                    }
                } else {
                    reject(new Error(XHR.responseText))
                }
            }
        }
        // 图片预览
        if (data && preViewData) {
            preView.src = window.URL.createObjectURL(preViewData)
        }
        // 上传进度
        XHR.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                const percentCompleted = Math.floor(e.loaded / e.total * 100) + "%"
                loaded.style.width = percentCompleted
                loadedInfo.innerText = percentCompleted
                console.log("Upload: ", percentCompleted, "completed")
            }
        }
        // 取消上传
        const cancelUpload = function () {
            if (XHR.readyState !== 4) {
                XHR.abort()
                console.log("取消上传！")
            }
        }
        cancel.removeEventListener('click', cancelUpload)
        cancel.addEventListener('click', cancelUpload)
        //用'&’隔开参数
        XHR.send(data)
    })
}
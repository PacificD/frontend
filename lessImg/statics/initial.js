/**
 * @Author: Pacific_D
 * @Date: 2022-07-16 10:40:13
 * @LastEditTime: 2022-07-19 11:05:06
 * @LastEditors: Pacific_D
 * @Description: 
 * @FilePath: \lessImg\statics\initial.js
 */
const doc = document,
    fileUploader = doc.getElementById('fileUploader'),
    multipleUploader = doc.getElementById('multipleUploader'),
    sumbitBtn = doc.getElementById('sumbit'),
    loaded = doc.querySelector('.loaded'),
    loadedInfo = doc.querySelector('.loaded-info > p'),
    preView = doc.querySelector('.pre-view > img'),
    cancel = doc.querySelector('#cancel'),
    drag = doc.querySelector('.drag'),
    paste = doc.querySelector('.paste')

const BASE_URL = 'http://localhost:4000',
    MAX_MULTIPLE_FILES = 4, //最大多文件上传的数量
    CHUNK_SIZE = 2 * 1024 * 1024 // 分片大小：2MB
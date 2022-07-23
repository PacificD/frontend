/**
 * @Author: Pacific_D
 * @Date: 2022-07-15 16:42:12
 * @LastEditTime: 2022-07-20 16:43:03
 * @LastEditors: Pacific_D
 * @Description:
 * @FilePath: \lessImg\statics\index.js
 */

// 单个文件上传
const singleUpload = (singleFile, e) => {
    const file = singleFile ?? e.target.files[0],
        formData = new FormData()

    if (!file) return

    // 大文件上传
    if (file.size > CHUNK_SIZE) {
        uploadSliceFiles(file)
        return
    }

    formData.append("file", file)
    formData.append("token", Date.parse(new Date()))
    formData.append("index", 0)
    ajax(BASE_URL + "/upload/single", "POST", formData, file).then(res => console.log(res))
}

// 多个文件上传
const multipleUpload = (multipleFiles) => {
    const files = multipleUploader.files
    if (files.length > MAX_MULTIPLE_FILES) {
        alert("最大只能上传的文件上传个数为：" + MAX_MULTIPLE_FILES)
        return
    }

    const formData = new FormData()
    Array.from(multipleFiles ?? files).forEach((file) => {
        formData.append("files", file)
    })

    ajax(BASE_URL + "/upload/multiple", "POST", formData).then(res => console.log(res))
}

// 拖拽上传
function dragEvent() {
    drag.addEventListener("dragover", function (e) {
        drag.classList.add("over")
        e.preventDefault()
    })

    drag.addEventListener("dragleave", function (e) {
        drag.classList.remove("over")
        e.preventDefault()
    })

    drag.addEventListener("drop", function (e) {
        e.preventDefault()
        const files = e.dataTransfer.files
        files.length > 1 ? multipleUpload(files) : singleUpload(files[0])
    })
}

// 粘贴上传
function pasteEvent() {
    paste.addEventListener("paste", function (e) {
        const files = e.clipboardData.files
        files.length > 1 ? multipleUpload(files) : singleUpload(files[0])
    })
}

// 大文件分片上传
const uploadSliceFiles = (file) => {
    let start = 0,
        end = 0,
        index = 0,
        sendChunkCount = 0,
        chunkCount = 0
    const chunks = [], // 保存分片的数据
        token = Date.parse(new Date())
    while (true) {
        end += CHUNK_SIZE
        const blob = file.slice(start, end)
        start += CHUNK_SIZE

        if (!blob.size) break
        chunkCount++
        chunks.push(blob)
    }
    // 当文件较大导致并发过多时tcp链接被占光，防止浏览器内存溢出。需要做并发控制
    const MAX_CONCURRENCY = 4

    const startUpload = () => {
        const chunk = chunks.shift(),
            formData = new FormData()

        if (!chunk) return
        formData.append("token", token)
        formData.append("file", chunk)
        formData.append("index", index++)
        ajax(BASE_URL + "/upload/single", "POST", formData, file)
            .then(() => {
                sendChunkCount++
                if (sendChunkCount === chunkCount) {
                    // 上传完成，发送合并请求
                    const formData = new FormData()
                    formData.append("type", "merge")
                    formData.append("token", token)
                    formData.append("chunkCount", chunkCount)
                    formData.append("filename", file.name)
                    ajax(BASE_URL + "/upload/merge", "POST", formData).then(res => console.log(res))
                }
            }).catch(err => console.log(err))
            .finally(() => {
                if (sendChunkCount < chunkCount) {
                    startUpload()
                }
            })
    }

    Array.from({ length: MAX_CONCURRENCY }, () => startUpload())
}

const bindEvent = () => {
    fileUploader.addEventListener("change", (e) => singleUpload(null, e))
    sumbitBtn.addEventListener("click", () => multipleUpload())
    dragEvent()
    pasteEvent()
}

bindEvent()

/**
 * @Author: Pacific_D
 * @Date: 2022-07-15 16:44:03
 * @LastEditTime: 2022-07-20 17:12:28
 * @LastEditors: Pacific_D
 * @Description:
 * @FilePath: \lessImg\lessImg-server\app.js
 */
const express = require("express"),
    fs = require("fs"),
    path = require("path"),
    multiparty = require("multiparty"),
    datetime = require("./datetime")

const PORT = 4000,
    FILE_DIR = path.join(__dirname, "/uploads"),
    MAX_MULTIPLE_FILES = 4

const server = express(),
    resData = (code = 200, msg = "ok", data = null) => {
        return {
            code,
            msg,
            data
        }
    }
// upload = multer({ dest: './uploads' })

server.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS")
    next()
})

server.get("/", (req, res) => {
    res.send("hello")
})

// 单个文件上传
server.post("/upload/single", (req, res) => {
    const form = new multiparty.Form()
    form.parse(req, function (err, fields, files) {
        const file = files.file[0]
        if (!file) {
            res.send(resData(400, "null file"))
            return
        }
        try {
            const buffer = fs.readFileSync(file.path),
                extname = path.extname(file.originalFilename),
                index = fields?.index[0] ?? 0,
                token = fields?.token[0]
            if (!token) {
                res.send(resData(400, "null token"))
            }
            const filename = FILE_DIR + "/" + index + "-" + token + extname,
                ws = fs.createWriteStream(filename)
            ws.write(buffer)
            ws.close()
            res.send(resData())
        } catch (err) {
            console.log(err)
            res.send(resData(500, err))
        }
    })
})

// 大文件合并
server.post('/upload/merge', (req, res) => {
    const form = new multiparty.Form()

    form.parse(req, async function (err, fields, files) {
        const token = fields.token[0]
        let len = 0
        if (!fields?.type[0] || fields.type[0] !== 'merge' || !token) {
            res.send(resData(400, 'formData type error!'))
            return
        }

        try {
            const bufferList = [],
                dirFiles = fs.readdirSync(FILE_DIR)
            for (let i = 0; i < dirFiles.length; i++) {
                const data = await fs.promises.readFile(FILE_DIR + '\\' + i + '-' + token).catch(e => console.log("no such file"))
                if (data) {
                    len += data.length
                    bufferList.push(data)
                }
            }
            const buffer = Buffer.concat(bufferList, len),
                filename = FILE_DIR + "/" + fields.filename[0],
                ws = fs.createWriteStream(filename)
            ws.write(buffer)
            ws.close()
            res.send(resData(200, "ok"))
        } catch (err) {
            console.log(err)
            res.send(resData(500, err))
        }
    })
})

// 多个文件上传，最大文件上传个数为4
server.post('/upload/multiple', (req, res) => {
    const form = new multiparty.Form()
    form.parse(req, function (err, fields, files) {
        if (files.files.length > MAX_MULTIPLE_FILES) {
            res.send(resData(400, "超出最大文件限制！"))
        }

        const saveFile = (file) => {
            return new Promise((resolve, reject) => {
                try {
                    const buffer = fs.readFileSync(file.path),
                        extname = path.extname(file.originalFilename)
                    const filename = FILE_DIR + "/" + datetime() + extname,
                        ws = fs.createWriteStream(filename)
                    ws.write(buffer)
                    ws.close()
                    resolve()
                } catch (err) { reject(err) }
            })
        }

        const saveFileTasks = files.files.map(file => saveFile(file))
        Promise.all(saveFileTasks).then(_ => res.send(resData())).catch(err => res.send(resData(500, err)))
    })
})

server.listen(PORT, () => console.log(`server is listening on port ${PORT}`))

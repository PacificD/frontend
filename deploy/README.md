# 前端自动化部署
## 流程
- 前端工程文件中编写Dockerfile和nginx文件
- 服务器搭建node.js服务，通过webhook监听github-dev分支的代码变更
- github上配置webhook，url为node服务的地址
- github-dev分支上的代码有变更 -> 通过webhook通知服务器node程序
- node程序收到通知，git pull代码。执行shell脚本 —> 打镜像，跑容器
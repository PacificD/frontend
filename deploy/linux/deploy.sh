#!/bin/bash

# 项目名称
WEB_NAME="lesschat-frontend"
# 端口号
PORT="3000"
# 服务器上的项目代码库路径
PROJECT_PATH="/data/project/${WEB_NAME}/"


echo '部署开始.....'

cd $PROJECT_PATH

git pull

echo '更新代码'

# 创建镜像
docker build . -t ${WEB_NAME}-image:latest
echo '创建镜像'

# 我们每次生成镜像是都未指定标签，从而重名导致有空悬镜像，删除一下
docker rmi $(docker images -f "dangling=true" -q)
echo '删除空悬镜像dangling image'

# 查找docker容器，停止并销毁他
docker ps -a -f "name=^${WEB_NAME}-container" --format="{{.Names}}" | xargs -r docker stop | xargs -r docker rm
echo '销毁旧容器'

docker run -p ${PORT}:80 -d --name ${WEB_NAME}-container ${WEB_NAME}-image:latest
echo '以新镜像创建的容器运行!'
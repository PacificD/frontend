FROM node:16.14.2 as build-stage

MAINTAINER Pacific_D

WORKDIR /app

COPY . .

RUN npm install --registry https://registry.npm.taobao.org && npm run build



FROM nginx:1.12.2

# 修改/usr/share/nginx/html里面的内容为前端需要部署的静态文件，这样前端就跑在nginx上了
WORKDIR /usr/share/nginx/html

RUN rm -f *

COPY --from=build-stage /app/build .

# 替换default.conf文件，解决单页面部署后刷新404问题
COPY --from=build-stage /app/default.conf /etc/nginx/conf.d/default.conf

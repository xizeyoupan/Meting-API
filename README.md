# Meting-API

https://meting-api-omega.vercel.app/test

## Feature

- js实现
- 插件系统，易于编写新接口及音源

## 进度

|               | server参数名称 | 图片 | 歌词 | url | 单曲/song | 歌单/playlist | 歌手/artist | 搜索/search |
| ------------- | -------------- | ---- | ---- | --- | --------- | ------------- | ----------- |--------- |
| 网易云        | netease        | √    | √    | √   | √         | √             | √           |√         |
| qq音乐        | tencent        | √    | √    | √   | √         | √             | ×           |×         |

## 地区限制

### 部署在国外

| 客户端/浏览器访问地区 | 国内 | 国外 |
| --------------------- | ---- | ---- |
| 网易云                | √    | √    |
| qq音乐                | √¹   | ×    |


### 部署在国内

| 客户端/浏览器访问地区 | 国内 | 国外 |
| --------------------- | ---- | ---- |
| 网易云                | √    | √    |
| qq音乐                | √    | ×    |


¹使用jsonp，**需要替换前端插件**， https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js => https://cdn.jsdelivr.net/npm/@xizeyoupan/meting@latest/dist/Meting.min.js , or 
https://unpkg.com/meting@2.0.1/dist/Meting.min.js => https://unpkg.com/@xizeyoupan/meting@latest/dist/Meting.min.js

More info https://github.com/xizeyoupan/MetingJS

## 参数配置
以下参数均由环境变量配置

- OVERSEAS
  用于判断是否部署于国外。设为1会启用qq音乐的jsonp返回，同时需要替换[前端插件](https://github.com/xizeyoupan/MetingJS)，能实现国内访问国外api服务解析qq音乐。部署在国内不用设置这个选项。当部署到vercel上时，此选项自动设为1。
- PORT
  api监听端口，也是docker需要映射的端口。默认3000
- UID
  用于docker，默认1010
- GID
  用于docker，默认1010

## 部署

部署 Meting-API 需要基本的计算机编程常识，如果您在部署过程中遇到无法解决的问题请到 issues 向我们提问，我们会尽快给您答复。

如果部署成功，在你的域名后拼接上`/test`，理论上出现类似下图数据：

![](assets/test.png)

### 手动部署

需要克隆项目到本地，node版本>=18。

```
npm i
```

#### Node

`node node.js`

<details>

<summary>Deprecated</summary>

#### Deno

`deno run --allow-net --allow-env dist/deno.js`

或者直接下载action中的文件运行。

</details>

### Docker部署

运行下面的命令下载 Meting-API 镜像

```
docker pull intemd/meting-api:latest
```

然后运行 Meting-API 即可

```
docker run -d --name meting -p 3000:3000 intemd/meting-api:latest
```

### 部署到vercel

比较出名，提供的域名被阻断，使用自有域名后速度尚可。冷启动速度一般。

<a href="https://vercel.com/import/project?template=https://github.com/xizeyoupan/Meting-API"><img src="https://vercel.com/button" height="36"></a>

一直下一步即可。

<details>

<summary>Deprecated</summary>

### Deno Deploy

类似Cloudflare Workers，但提供的域名未被阻断，使用Deno为runtime。

fork本项目后新建一个[project](https://dash.deno.com/projects)，首先在设置中加一个Environment Variable，名称是OVERSEAS，值为1。接着link到你自己的项目，部署方式选action，Deno Deploy 的 project 的 name 需要与你自己的yml中设置的吻合。

```yml
        uses: denoland/deployctl@v1
        with:
          project: meting #这里要改成你的Deno Deploy的project的name
          entrypoint: deno.js
```

接着在actions/publish/run workflow中勾选Deno即可。

</details>

## 杂项

### 反向代理

使用用nginx，让请求 `http://localhost:8099/meting` 的流量全部转发到 `http://localhost:3000` ，不能这么写：

```
   server {
      listen       8099;
      server_name  localhost;

      location /meting/ {
         proxy_pass http://localhost:3000/;
      }
   }
```

正确写法：

- nginx

   ```
   server {
      listen       8099;
      server_name  localhost;

      location /meting/ {
         proxy_pass http://localhost:3000/;
         proxy_set_header X-Forwarded-Host $scheme://$host:$server_port/meting;
      }
   }
   ```

- caddy
  
  ```
   http://localhost:8099 {
         handle_path /meting* {
                  reverse_proxy http://localhost:3000 {
                        header_up X-Forwarded-Host {scheme}://{host}:{port}/meting
                  }
         }
   }
  ```

### SSL证书

在上面基础上改动即可。

- nginx
  ```
      server {
        listen       8099 ssl;
        server_name  localhost;

        ssl_certificate     ../server.crt;  # pem文件的路径
        ssl_certificate_key  ../server.key; # key文件的路径
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;

        location /meting/ {
            proxy_pass http://localhost:3000/;
            proxy_set_header X-Forwarded-Host $scheme://$host:$server_port/meting;
        }
      }
  ```

- caddy
  ```
   https://localhost:8099 {
      tls ./server.crt ./server.key
      handle_path /meting* {
         reverse_proxy http://localhost:3000 {
            header_up X-Forwarded-Host {scheme}://{host}:{port}/meting
         }
      }
   }
  ```

## 使用

在导入[前端插件](https://github.com/xizeyoupan/MetingJS)前，加入

```
<script>
var meting_api='http://example.com/api?server=:server&type=:type&id=:id&auth=:auth&r=:r';
</script>
```

比如

```
<script>
var meting_api='http://localhost:3000/api?server=:server&type=:type&id=:id&auth=:auth&r=:r';
</script>
```

即可。就这样吧，那我去看vtb了，88

### 相关项目

https://github.com/metowolf/MetingJS

https://github.com/metowolf/Meting-API

https://github.com/honojs/hono

https://github.com/honojs/node-server

https://github.com/camsong/fetch-jsonp

https://github.com/Binaryify/NeteaseCloudMusicApi

https://github.com/jsososo/QQMusicApi

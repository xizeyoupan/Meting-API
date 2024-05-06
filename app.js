import api from './src/service/api.js'
import { handler, docs } from './src/template.js'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import config from './src/config.js'
import { get_runtime, get_url } from './src/util.js'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())
app.get('/api', api)
app.get('/test', handler)
app.get('/docs', docs)
app.get('/', (c) => {

    return c.html(`
    <!doctype html>
    <html lang="zh-CN" id="htmlid">
    
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>[在线]小关のMeting...</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/zui@3.0.0-alpha.4/dist/zui.css">
    </head>
    
    <body>
      <style>
        .tag { padding: 5px; margin: 5px; }
        .v-card { padding: 5px; margin: 5px; display: flex; }
        .panel { padding: 5px; margin: 10px; height: 100px; width: 550px; }
        .style-group { position: fixed; right: 30px; top: 30px }
        @media (max-width: 629px) { .style-group { position: fixed; right: auto; top: auto; bottom: 20px; left: 45vw; justify-content: center; } }
      </style>
      
      <h1 style="padding: 30px;">Meting API</h1>
      <div class="btn-group style-group">
        <button class="btn" type="button" onclick="style_light()"><i class="icon icon-sun"></i></button>
        <button class="btn" type="button" onclick="style_dark()"><i class="icon icon-moon"></i></button>
        <button class="btn active" type="button" onclick="style_auto()"><i class="icon icon-desktop"></i></button>
      </div>
      <div style="margin: 20px;">
        <div style="display: flex;">
          <a href="https://github.com/xizeyoupan/Meting-API" style="text-decoration: none;"><img alt="Static Badge"
              src="https://img.shields.io/badge/Github-Meting-green" class="tag"></a>
          <a href="https://github.com/xizeyoupan/Meting-API" style="text-decoration: none;"><img alt="GitHub forks"
              src="https://img.shields.io/github/forks/xizeyoupan/Meting-API" class="tag"></a>
          <a href="https://github.com/xizeyoupan/Meting-API" style="text-decoration: none;"><img alt="GitHub Repo stars"
              src="https://img.shields.io/github/stars/xizeyoupan/Meting-API" class="tag"></a>
        </div>
    
        <div class="v-card">
          <div class="panel">
            <div class="panel-heading">
              <div class="panel-title">当前版本</div>
            </div>
            <div class="panel-body">
              <p>1.0.8</p>
            </div>
          </div>
          <div class="panel">
            <div class="panel-heading">
              <div class="panel-title">当前运行环境</div>
            </div>
            <div class="panel-body">
              <p>${get_runtime()}</p>
            </div>
          </div>
          <div class="panel">
            <div class="panel-heading">
              <div class="panel-title">当前时间</div>
            </div>
            <div class="panel-body">
              <p>${new Date()}</p>
            </div>
          </div>
        </div>
        <div class="v-card">
          <div class="panel">
            <div class="panel-heading">
              <div class="panel-title">内部端口</div>
            </div>
            <div class="panel-body">
              <p>${config.PORT}</p>
            </div>
          </div>
          <div class="panel">
            <div class="panel-heading">
              <div class="panel-title">部署在大陆</div>
            </div>
            <div class="panel-body">
              <p>${config.OVERSEAS ? 'N O' : 'Y E S'}</p>
            </div>
          </div>
          <div class="panel">
            <div class="panel-heading">
              <div class="panel-title">当前地址  /  实际地址</div>
            </div>
            <div class="panel-body">
              <a href="${c.req.url}">当前地址 ${c.req.url}</a>
              <br>
              <a href="${get_url(c)}">实际地址 ${get_url(c)}</a>
            </div>
          </div>
        </div>
        <div class="v-card">
          <div class="panel">
            <div class="panel-heading">
              <div class="panel-title">文档地址</div>
            </div>
            <div class="panel-body">
            <a href="${get_url(c) + 'docs'}">${get_url(c) + 'docs'}</a>
            </div>
          </div>
          <div class="panel">
            <div class="panel-heading">
              <div class="panel-title">测试地址</div>
            </div>
            <div class="panel-body">
              <a href="${get_url(c) + 'test'}">${get_url(c) + 'test'}</a>
            </div>
          </div>
          <div class="panel">
            <div class="panel-heading">
              <div class="panel-title">api地址</div>
            </div>
            <div class="panel-body">
              <a href="${get_url(c) + 'api'}">${get_url(c) + 'api'}</a>
            </div>
          </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/zui@3.0.0-alpha.4/dist/zui.js"></script>
    </body>
    <!-- 暗色主题判断 -->
    <script>let isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; let element = document.getElementById('htmlid'); element.classList.toggle('dark', isDarkMode); element.classList.toggle('light', !isDarkMode);</script>
    <!-- 主题设置 -->
    <script>
      // 自动
      function style_auto() {let isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; let element = document.getElementById('htmlid'); element.classList.toggle('dark', isDarkMode); element.classList.toggle('light', !isDarkMode);}
      // 暗色
      function style_dark() {let element = document.getElementById('htmlid').className = "dark";}
      // 亮色
      function style_light(){let element = document.getElementById('htmlid').className = "light";}
    </script>
    </html>`
    )
})

export default app

import example from "./example.js"

let html = `
<!DOCTYPE html>
<html lang="zh-CN" id="htmlid">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>小关のMeting | 测试页面</title>
    <link rel="stylesheet" href="https://unpkg.com/zui@3.0.0/dist/zui.css">
    <link rel="stylesheet" href="https://unpkg.com/aplayer/dist/APlayer.min.css">
</head>

<body>
    <style>
        .audiolist {
            padding: 20px;
            margin: 30px;
        }

        .style-group {
            position: fixed;
            right: 30px;
            top: 30px;
        }

        @media (max-width: 629px) {
            .style-group {
                position: fixed;
                right: auto;
                top: auto;
                bottom: 20px;
                left: 45vw;
                justify-content: center;
            }
        }

        #htmlid.dark {
            .aplayer {
                background: #1e293b;
                /* box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 1px 5px 0 rgba(0, 0, 0, 0.1); */
            }

            .aplayer .aplayer-lrc:before {
                background: linear-gradient(to bottom, rgb(30, 41, 59) 0%, rgba(255, 255, 255, 0) 100%);
            }

            .aplayer .aplayer-lrc:after {
                background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(30, 41, 59, 0.726) 100%);
            }
        }
    </style>
    <div class="btn-group style-group">
        <button class="btn" type="button" onclick="style_light()" id="style_light"><i
                class="icon icon-sun"></i></button>
        <button class="btn" type="button" onclick="style_dark()" id="style_dark"><i class="icon icon-moon"></i></button>
        <button class="btn active" type="button" onclick="style_auto()" id="style_auto"><i
                class="icon icon-desktop"></i></button>
    </div>
    <script src="https://unpkg.com/zui@3.0.0/dist/zui.js"></script>
    <script src="https://unpkg.com/aplayer/dist/APlayer.min.js"></script>
    <script>
        var meting_api = 'api?server=:server&type=:type&id=:id&auth=:auth&r=:r';
    </script>
    <script src="https://unpkg.com/@xizeyoupan/meting@latest/dist/Meting.min.js"></script>
    <br>
    <div class="audiolist">
        `
        Object.keys(example).map(provider => {
        Object.keys(example[provider]).map(type => {
        if (!example[provider][type].show) return

        html += `
        <div>
            <p>${provider} ${type}</p>
            <meting-js server="${provider}" type="${type}" id="${example[provider][type].value}" list-folded=true />
        </div>
        <br />
        `
        })
        })
        html += `
    </div>
</body>

<script>
    // 主题设置

    // 暗色主题判断
    let isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; let element = document.getElementById('htmlid'); element.classList.toggle('dark', isDarkMode); element.classList.toggle('light', !isDarkMode);
    // 自动  
    function style_auto() { let click = document.getElementById('style_auto'); click.classList.add("active"); let rd = document.getElementById('style_dark'); rd.classList.remove("active"); let rl = document.getElementById('style_light'); rl.classList.remove("active"); let isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; let element = document.getElementById('htmlid'); element.classList.toggle('dark', isDarkMode); element.classList.toggle('light', !isDarkMode); }
    // 暗色  
    function style_dark() { let click = document.getElementById('style_dark'); click.classList.add("active"); let rl = document.getElementById('style_light'); rl.classList.remove("active"); let ra = document.getElementById('style_auto'); ra.classList.remove("active"); let element = document.getElementById('htmlid'); element.className = "dark"; }
    // 亮色  
    function style_light() { let click = document.getElementById('style_light'); click.classList.add("active"); let rd = document.getElementById('style_dark'); rd.classList.remove("active"); let ra = document.getElementById('style_auto'); ra.classList.remove("active"); let element = document.getElementById('htmlid'); element.className = "light"; }
</script>
</script>

</html>
`
export const docs = (c) => {
    return c.html(`
    <!doctype html>
<html lang="zh-CN" id="htmlid">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>小关のMeting | Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/zui@3.0.0/dist/zui.css">
</head>

<body>
  <style>
    .v-card {
      margin: 5px;
      display: flex;
    }

    .panel {
      padding: 5px;
      margin: 10px;
      height: 100px;
      width: 550px;
    }

    .style-group {
      position: fixed;
      right: 30px;
      top: 30px
    }

    @media (max-width: 629px) {
      .style-group {
        position: fixed;
        right: auto;
        top: auto;
        bottom: 20px;
        left: 45vw;
        justify-content: center;
      }
    }
  </style>

  <h1 style="padding: 30px;">小关のMeting Docs</h1>
  <div class="btn-group style-group">
    <button class="btn" type="button" onclick="style_light()" id="style_light"><i class="icon icon-sun"></i></button>
    <button class="btn" type="button" onclick="style_dark()" id="style_dark"><i class="icon icon-moon"></i></button>
    <button class="btn active" type="button" onclick="style_auto()" id="style_auto"><i
        class="icon icon-desktop"></i></button>
  </div>
  <div style="margin: 20px;padding: 10px;">
    <div>
      <h3>参数说明</h3>
      <h4>server / 数据源</h4>
      <div class="v-card">
        <div class="panel">
          <div class="panel-heading">
            <div class="panel-title">网易云音乐</div>
          </div>
          <div class="panel-body">
            <p>netease</p>
          </div>
        </div>
        <div class="panel">
          <div class="panel-heading">
            <div class="panel-title">QQ 音乐</div>
          </div>
          <div class="panel-body">
            <p>tencent</p>
          </div>
        </div>
      </div>
      <div class="v-card">
        <div class="panel">
          <div class="panel-heading">
            <div class="panel-title">Youtube Music</div>
          </div>
          <div class="panel-body">
            <p>ytmusic</p>
          </div>
        </div>
        <div class="panel">
          <div class="panel-heading">
            <div class="panel-title">Spotify</div>
          </div>
          <div class="panel-body">
            <p>spotify</p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h4>type / 类型</h4>
      <div class="v-card">
        <div class="panel">
          <div class="panel-heading">
            <div class="panel-title">歌单</div>
          </div>
          <div class="panel-body">
            <p>playlist</p>
            <a href="/api?type=playlist&id=9564899591">/api?type=playlist&id=9564899591</a>
          </div>
        </div>
        <div class="panel">
          <div class="panel-heading">
            <div class="panel-title">音乐</div>
          </div>
          <div class="panel-body">
            <p>song</p>
            <a href="/api?type=song&id=537787665">api?type=song&id=537787665</a>
          </div>
        </div>
        <div class="panel">
          <div class="panel-heading">
            <div class="panel-title">歌手</div>
          </div>
          <div class="panel-body">
            <p>artist</p>
            <a href="/api?type=artist&id=1049179">/api?type=artist&id=1049179</a>
          </div>
        </div>
      </div>
      <div class="v-card">
        <div class="panel">
          <div class="panel-heading">
            <div class="panel-title">歌词</div>
          </div>
          <div class="panel-body">
            <p>lrc</p>
            <a href="/api?type=lrc&id=537787665">/api?type=lrc&id=537787665</a>
          </div>
        </div>
        <div class="panel">
          <div class="panel-heading">
            <div class="panel-title">歌曲的音频文件</div>
          </div>
          <div class="panel-body">
            <p>url</p>
            <a href="/api?type=url&id=537787665">/api?type=url&id=537787665</a>
          </div>
        </div>
        <div class="panel">
          <div class="panel-heading">
            <div class="panel-title">搜索音乐的音乐列表</div>
          </div>
          <div class="panel-body">
            <p>search</p>
            <a href="/api?type=search&id=Not%20Found%20-%20平行四界Quadimension">/api?type=search&id=Not%20Found%20-%20平行四界Quadimension</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script src="https://unpkg.com/zui@3.0.0/dist/zui.js"></script>
</body>
<script>
  // 主题设置

  // 暗色主题判断
  let isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; let element = document.getElementById('htmlid'); element.classList.toggle('dark', isDarkMode); element.classList.toggle('light', !isDarkMode);
  // 自动  
  function style_auto() { let click = document.getElementById('style_auto'); click.classList.add("active"); let rd = document.getElementById('style_dark'); rd.classList.remove("active"); let rl = document.getElementById('style_light'); rl.classList.remove("active"); let isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; let element = document.getElementById('htmlid'); element.classList.toggle('dark', isDarkMode); element.classList.toggle('light', !isDarkMode); }
  // 暗色  
  function style_dark() { let click = document.getElementById('style_dark'); click.classList.add("active"); let rl = document.getElementById('style_light'); rl.classList.remove("active"); let ra = document.getElementById('style_auto'); ra.classList.remove("active"); let element = document.getElementById('htmlid'); element.className = "dark"; }
  // 亮色  
  function style_light() { let click = document.getElementById('style_light'); click.classList.add("active"); let rd = document.getElementById('style_dark'); rd.classList.remove("active"); let ra = document.getElementById('style_auto'); ra.classList.remove("active"); let element = document.getElementById('htmlid'); element.className = "light"; }
</script>

</html>`)
}
export const handler = (c) => {
    return c.html(html)
}


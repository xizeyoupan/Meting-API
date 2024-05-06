# 事情是这样的
我的博客使用了 Meting 这个项目作为网易云音乐的 API 调用，但介于那个 API 调用的是别人的网站，每次调用都会把请求发送给其他的网站，就非常的不爽...＞﹏＜
在我的几番周折后，经过是这样的:
找到了纯供 PHP 调用的无api版本 ==> 找到了可供于api调用的PHP版本 (在vercel部署仅能获取歌词,vercel不支持更老版本的PHP) ==> 找到了用于阿里云FC调用的PHP版本 ==> 最终 找到这个nodejs的现代版本 ==> 用ZUI3重写了前端的测试页面，状态页面，将原版的歌替换为自己的歌单(除了国外的音乐平台)

## 部署方法，调用方法？
如果你想直接使用这个具有 ZUI3 重写的前端界面的话，请直接Fork
另外一提，原作者在这里：(Github@xizeyoupan/Meting-API)[https://github.com/xizeyoupan/Meting-API]
同时感谢(Github@xizeyoupan)[https://github.com/xizeyoupan] 使用 nodejs 重写了 Meting

## 调用方法
目前支持两类调用 歌单调用与资源调用
1. 歌单调用
以下为我提到的歌单调用:
* 歌单
* 音乐
* 歌手
* 搜索
以这种形式调用会返回一个json格式，这个json格式包括了三个主要的键值对
这三个主要的键分别为：
* pic (封面)
* url (歌曲的音频url)
* lrc (歌词)
值分别为对应的url

2. 资源调用
资源调用，可以获取一个指定id的资源，如：音频链接、歌词链接
在只需要获取单文件的情况下，这种调用方式非常实用

(看起来说的很麻烦，实际看案例就很简单)

请求链接 (歌单): `https://met.api.xiaoguan.fit/api?type=playlist&id=9564899591`
```json
[
...
    {
        "title": "关于梦想",
        "author": "LKs",
        "pic": "https://p2.music.126.net/ffXiAOBO7EAIIdiSd2Wa0w==/16578436324210904.jpg",
        "url": "https://met.api.xiaoguan.fit/api?server=netease&type=url&id=406892255",
        "lrc": "https://met.api.xiaoguan.fit/api?server=netease&type=lrc&id=406892255"
    },
...
]
```
请求链接 (歌曲): `https://met.api.xiaoguan.fit/api?type=song&id=537787665`
```json
[
    {
        "title": "室内系的TrackMaker(YUNOMI)（翻自 nicamoq）",
        "author": "Hanser",
        "pic": "https://p2.music.126.net/9GAbSb_hlXPu66HWInJOww==/109951162846052486.jpg",
        "url": "https://met.api.xiaoguan.fit/api?server=netease&type=url&id=537787665",
        "lrc": "https://met.api.xiaoguan.fit/api?server=netease&type=lrc&id=537787665"
    }
]
```
请求链接 (歌手): `https://met.api.xiaoguan.fit/api?type=artist&id=1049179`
```json
[
    {
        "title": "Moon Halo",
        "author": "茶理理 / TetraCalyx / Hanser / HOYO-MiX",
        "pic": "https://p1.music.126.net/ciLKATqflV2YWSV3ltE2Kw==/109951166159281275.jpg",
        "url": "https://met.api.xiaoguan.fit/api?server=netease&type=url&id=1859652717",
        "lrc": "https://met.api.xiaoguan.fit/api?server=netease&type=lrc&id=1859652717"
    },
...
]
```
请求资源(歌曲的url): `https://met.api.xiaoguan.fit/api?type=url&id=537787665`
返回内容: 跳转到歌曲的音乐商的url

请求资源(歌曲的lrc): `https://met.api.xiaoguan.fit/api?type=lrc&id=537787665`
返回内容: 歌词

import got from 'got'
import hashjs from 'hash.js'
import config from '../config.js'
import { format as lyricFormat } from '../utils/lyric.js'
import LRU from 'lru-cache'

const cache = new LRU({
  max: 1000,
  ttl: 1000 * 30
})

export default async (ctx) => {
  // 1. 初始化参数
  const query = ctx.request.query
  const server = query.server || 'netease'
  const type = query.type || 'search'
  const id = query.id || 'hello'
  const token = query.token || query.auth || 'token'
  const origin = ctx.request.origin

  // 2. 校验参数
  if (!['netease', 'tencent', 'kugou', 'xiami', 'baidu', 'kuwo'].includes(server)) {
    ctx.throw(400, 'server 参数不合法')
  }
  if (!['song', 'album', 'search', 'artist', 'playlist', 'lrc', 'url', 'pic'].includes(type)) {
    ctx.throw(400, 'type 参数不合法')
  }

  // 3. 鉴权
  if (['lrc', 'url', 'pic'].includes(type)) {
    if (auth(server, type, id) !== token) {
      ctx.throw(401, '鉴权失败，非法调用')
    }
  }

  // 4. 调用 API
  let data = cache.get(`${server}/${type}/${id}`)
  if (data === undefined) {
    ctx.set('x-cache', 'miss')

    let url;
    if (config.meting.api) {
      url = `${config.meting.api}/?server=${server}&type=${type}&id=${id}`
    } else {
      url = `${origin}/api/Meting.php/?server=${server}&type=${type}&id=${id}`
    }

    data = await got(url).json()
      .then(res => {
        if (!res.success) {
          ctx.throw(500, '上游 API 调用失败')
        }
        return res.message
      })
    cache.set(`${server}/${type}/${id}`, data, {
      ttl: type === 'url' ? 1000 * 60 * 10 : 1000 * 60 * 60
    })
  }

  // 5. 组装结果
  if (type === 'url') {
    let url = data.url
    // 空结果返回 404
    if (!url) {
      ctx.status = 404
      return
    }
    // 链接转换
    if (server === 'netease') {
      url = url
        .replace('://m7c.', '://m7.')
        .replace('://m8c.', '://m8.')
        .replace('http://', 'https://')
    }
    if (server === 'tencent') {
      url = url
        .replace('http://', 'https://')
        .replace('://ws.stream.qqmusic.qq.com', '://dl.stream.qqmusic.qq.com')
    }
    if (server === 'baidu') {
      url = url
        .replace('http://zhangmenshiting.qianqian.com', 'https://gss3.baidu.com/y0s1hSulBw92lNKgpU_Z2jR7b2w6buu')
    }
    ctx.redirect(url)
    return
  }

  if (type === 'pic') {
    const url = data.url
    // 空结果返回 404
    if (!url) {
      ctx.status = 404
      return
    }
    ctx.redirect(url)
    return
  }

  if (type === 'lrc') {
    ctx.body = lyricFormat(data.lyric, data.tlyric || '')
    return
  }

  ctx.body = data.map(x => {
    return {
      title: x.name,
      author: x.artist.join(' / '),
      url: `${origin}/api?server=${server}&type=url&id=${x.url_id}&auth=${auth(server, 'url', x.url_id)}`,
      pic: `${origin}/api?server=${server}&type=pic&id=${x.pic_id}&auth=${auth(server, 'pic', x.pic_id)}`,
      lrc: `${origin}/api?server=${server}&type=lrc&id=${x.lyric_id}&auth=${auth(server, 'lrc', x.lyric_id)}`
    }
  })
}

const auth = (server, type, id) => {
  return hashjs.hmac(hashjs.sha1, config.meting.token).update(`${server}${type}${id}`).digest('hex')
}

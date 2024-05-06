import Providers from "../providers/index.js"
import { format as lyricFormat, get_url } from "../util.js"

export default async (ctx) => {

    const p = new Providers()

    const query = ctx.req.query()
    const server = query.server || 'netease'
    const type = query.type || 'playlist'
    const id = query.id || '9564899591'

    if (!p.get_provider_list().includes(server) || !p.get(server).support_type.includes(type)) {
        ctx.status(400)
        return ctx.json({ status: 400, message: '参数不合法，请检查参数名以及参数是否正确', param: { server, type, id } })
    }

    let data = await p.get(server).handle(type, id)

    if (type === 'url') {
        let url = data

        if (!url) {
            ctx.status(403)
            return ctx.json({ error: 'no url' })
        }
        if (url.startsWith('@'))
            return ctx.text(url)

        return ctx.redirect(url)
    }

    if (type === 'pic') {
        return ctx.redirect(data)
    }

    if (type === 'lrc') {
        return ctx.text(lyricFormat(data.lyric, data.tlyric || ''))
    }


    // json 类型数据填充api
    return ctx.json(data.map(x => {
        for (let i of ['url', 'pic', 'lrc']) {
            const _ = String(x[i])
            // 正常对象_均为id，以下例外不用填充：1.@开头/size为0=>qq音乐jsonp 2.已存在完整链接
            if (!_.startsWith('@') && !_.startsWith('http') && _.length > 0) {
                x[i] = `${get_url(ctx)}?server=${server}&type=${i}&id=${_}`
            }
        }
        return x
    }))
}

import { request } from "./util.js"

export const get_song_url = async (id, cookie = '') => {

    const data = {
        ids: '[' + id + ']',
        level: 'standard',
        encodeType: 'flac',
    }

    const res = await request(
        'POST',
        `https://interface.music.163.com/eapi/song/enhance/player/url/v1`,
        data,
        {
            crypto: 'eapi',
            url: '/api/song/enhance/player/url/v1',
            cookie: {}
        },
    )
    // console.log(res)
    const url = res.data[0]?.url?.replace('http://', 'https://')

    return url || `https://music.163.com/song/media/outer/url?id=${id}.mp3`

}

export const get_song_info = async (id, cookie = '') => {
    const ids = [id]
    const data = {
        c: '[' + ids.map((id) => '{"id":' + id + '}').join(',') + ']',
    }
    let res = await request('POST', `https://music.163.com/api/v3/song/detail`, data, {
        crypto: 'weapi',
    })

    // console.log(res)

    if (!res.songs) {
        throw res
    }

    res = {
        title: res.songs[0].name,
        author: res.songs[0].ar.reduce((i, v) => ((i ? i + " / " : i) + v.name), ''),
        pic: res.songs[0].al.picUrl,
        url: res.songs[0].id,
        lrc: res.songs[0].id
    }
    return [res]
}


// const res = await get_song_info('1874976923');
// console.log(res)


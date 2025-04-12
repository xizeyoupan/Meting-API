import Providers from "../src/providers/index.js"
import examples from "../src/example.js"
import api from '../src/service/api.js'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { test, expect } from 'vitest'

const app = new Hono()
app.use('*', cors())
app.get('/api', api)

// test('examples match providers', () => {
//     const p = new Providers()
//     const provider_list = p.get_provider_list()
//     expect(new Set(provider_list)).toEqual(new Set(Object.keys(examples)))
// })

test('test provider support_type', () => {
    const p = new Providers()
    Object.keys(examples).map(provider_name => {
        const provider = p.get(provider_name)
        Object.keys(examples[provider_name]).map(type => {
            expect(provider.support_type).toContain(type)
        })
    })
})

const YT_API = globalThis?.Deno?.env?.get("YT_API") || globalThis?.process?.env?.YT_API

test('test api', async () => {
    for (const provider_name in examples) {
        if (["ytmusic", "spotify"].includes(provider_name) && !YT_API) {
            console.log("external api not found, skipping...")
            continue
        }
        for (const type in examples[provider_name]) {

            const url = `http://localhost:3000/api?server=${provider_name}&type=${type}&id=${examples[provider_name][type].value}`
            let res, count = 0
            while (count < 5) {
                res = await app.request(url)
                console.log("testing " + url)
                console.log(res.status)
                if (200 <= res.status && res.status < 400) {
                    break
                } else {
                    count++
                    console.log("retrying " + count)
                    await new Promise(resolve => setTimeout(resolve, 1000))
                }
            }

            expect(res).toBeDefined()
            expect(res.status).toBeGreaterThanOrEqual(200)
            expect(res.status).toBeLessThan(400)
        }

    }
}, 10 * 60 * 1000)

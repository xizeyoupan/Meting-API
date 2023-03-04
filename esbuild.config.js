import esbuild from 'esbuild';
import resolve from 'esbuild-plugin-resolve';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import textReplace from 'esbuild-plugin-text-replace'

await esbuild.build({
    entryPoints: ['./app.js'],
    bundle: true,
    format: 'esm',
    outfile: './dist/cloudflare-workers-min.js',
    external: [],
    plugins: [
        resolve({
            crypto: 'crypto-browserify'
        }),
        NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
    ],
    minify: true,
});

await esbuild.build({
    entryPoints: ['./app.js'],
    bundle: true,
    format: 'esm',
    outfile: './dist/cloudflare-workers.js',
    external: [],
    plugins: [
        resolve({
            crypto: 'crypto-browserify'
        }),
        NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
    ],
});

await esbuild.build({
    entryPoints: ['./deno.js'],
    bundle: true,
    format: 'esm',
    outfile: './dist/deno.js',
    external: [],
    plugins: [
        textReplace({
            include: new RegExp("src/providers/netease/crypto\.js"),
            pattern: [
                ["import crypto from 'crypto-browserify'", "import crypto from 'https://esm.sh/crypto-browserify@3.12.0'"],
                ["import { Buffer } from 'buffer/index.js'","import { Buffer } from 'https://esm.sh/buffer@6.0.3'"]
            ]
        }),
        resolve({
            crypto: 'crypto-browserify'
        }),
        NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
        }),
        NodeModulesPolyfillPlugin(),

    ],
    // minify: true,
});

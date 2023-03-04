import example from "./example.js"

let html = `
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>测试页面</title>
    <link rel="stylesheet" href="https://unpkg.com/aplayer/dist/APlayer.min.css">
</head>

<body>
    <script src="https://unpkg.com/aplayer/dist/APlayer.min.js"></script>
    <script>
        var meting_api = 'api?server=:server&type=:type&id=:id&auth=:auth&r=:r';
    </script>
    <script src="https://unpkg.com/@xizeyoupan/meting@latest/dist/Meting.min.js"></script>
`

Object.keys(example).map(provider => {
    Object.keys(example[provider]).map(type => {
        if (!example[provider][type].show) return

        html += `
    <div>
        <p>${provider} ${type}</p>
        <meting-js server="${provider}" type="${type}" id="${example[provider][type].value}" list-folded=true />
    </div>
    <br/>
`
    })
})

html += `
</body>

</html>
`

export const handler = (c) => {
    return c.html(html)
}

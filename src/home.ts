import { uptime } from './utilities/uptime'

const formatTime: (number) => string = (time: number) => {
    var ms = time % 1000;
    time = (time - ms) / 1000;
    var secs = time % 60;
    time = (time - secs) / 60;
    var mins = time % 60;
    var hrs = (time - mins) / 60;
    return `${hrs} hours, ${mins} minutes, and ${secs} seconds`
}

const renderLogs = (logs: string[]) => {
    let html = ''
    for (let i = logs.length - 1; i >= 0; i--) {
        html += `<li>${logs[i]}</li>`
    }
    return html
}

export default async (offline: boolean, logs: string[]) => {
    const time = await uptime()
    const total = Date.now() - new Date(time).getTime()
    const formattedTime = formatTime(total)

    return `<!doctype html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>GRUNTWORK</title>
            <link rel="stylesheet" href="/styles/main.css">
        </head>
        <script>
            setInterval(() => location.reload(), 1000 * 60 * 1)
        </script>
        <body>
            <div class="container">
                <h1>GRUNT WORK</h1>
                <h2>Been up for ${formattedTime}</h2>
                <h3>Last check was ${offline ? 'Bad :(': 'Good!'}</h3>
                <ul>
                    ${renderLogs(logs)}
                </ul>
            </div>
        </body>
    </html>`
}

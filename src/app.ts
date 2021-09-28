import path from 'path'
import process from 'process'
import express from 'express'
import { checkInternetConnection } from './utilities/uptime'
import renderHome from './home'

process.env.TZ = 'America/Los_Angeles'

const app = express()
const port = 3000

let offline = false
let logs: string[] = []

app.use(express.static(path.join(__dirname, "public")))

app.get('/', async (req, res) => {
    const html = await renderHome(offline, logs)
    res.send(html)
})

app.listen(port, "", () => { console.log(`Running on ${port}`) })

const checkInternetInterval = async () => {
    let now = new Date()
    try {
        let result = await checkInternetConnection()
        if (!result && !offline) {
            logs.push(`We lost connection at ${now.toLocaleString()}`)
            offline = true
        } else if (offline) {
            logs.push(`We are back up at ${now.toLocaleString()}`)
            offline = false
        }
    } catch(error) {
        if (!offline) {
            logs.push(`We lost connection at ${now.toLocaleString()}`)
        }
        offline = true
    }
}

setInterval(checkInternetInterval, 1000 * 60 * 5)

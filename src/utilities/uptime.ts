import { spawn } from 'child_process'

const uptime: () => Promise<string> = () => {
    return new Promise((resolve, reject) => {
        let stderr = undefined
        let stdout = ""
        let uptime = null

        if (process.platform === 'darwin') {
            uptime = spawn('uptime')
        } else {
            uptime = spawn('uptime', ['-s'])
        }
        
        uptime.stderr.on('data', data => {
            stderr += data
        })

        uptime.stdout.on('data', data => {
            stdout += data
        })

        uptime.on('close', code => {
            console.log(`Process ended with code ${code}`)
            if (stderr) {
                reject(new Error(stderr))
            } else {
                resolve(stdout)
            }
        })
    })
}

const checkInternetConnection: () => Promise<Boolean> = () => {
    return new Promise((resolve, reject) => {
        let stderr = undefined
        let stdout = ""
        const ping = spawn('ping', ['-c', '1', 'google.com'])

        ping.stderr.on('data', data => {
            stderr += data
        })

        ping.stdout.on('data', data => {
            stdout += data
        })

        ping.on('close', code => {
            console.log(`Process ended with code ${code}`)
            if (stderr) {
                reject(new Error(stderr))
            } else {
                resolve(stdout.includes('1 received'))
            }
        })
    })
}

export {
    uptime,
    checkInternetConnection,
}

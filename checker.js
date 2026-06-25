import fs from 'node:fs'
import https from 'node:https'
import http from 'node:http'

const urls = fs.readFileSync('links.txt', 'utf8')
    .split('\n').map(L => L.trim()).filter(Boolean)
console.log('Verificando ' + urls.length + ' links...\n')

function verificar(url) {
    return new Promise((resolve) => {
        const mod = url.startsWith('https') ? https : http
        const req = mod.request(url, { method: 'HEAD', timeout: 5000}, (res) => {
            resolve({ url, status: res.statusCode, ok: res.statusCode < 400 })
        })
        req.on('timeout', () => req.destroy())
        req.on('error', () => resolve({ url, status:0, ok: false}))
        req.end()
    })
}

async function main() {
    const resultados = await Promise.all(urls.map(verificar))

    resultados.forEach(r => {
        console.log((r.ok ? '[OK] ': '[FALHA]') + ' ' + r.status + ' ' + r.url)
    })

    const relatorio = {
        data: new Date().toISOString(),
        total: resultados.length,
        ok: resultados.filter(r => r.ok).length,
        links: resultados
    }
     fs.writeFileSync('resultados.json', JSON.stringify(relatorio, null, 2))
    console.log('\nSalvo em resultados.json')
}

main()
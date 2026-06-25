import express from 'express'
import fs from 'node:fs'
import {spawn}from 'node:child_process'

const app = express()
const PORT = 3000
app.use(express.json('public'))
app.use(express.static('public'))

app.post('/verificar', (req, res) => {
    const proc = spawn('node', ['checker.js'], {cwd: process.cwd()})
    let saida = ''
    proc.stderr.on('data', chunk => {
        saida += chunk.toString() })
    
    proc.on('close', code => {
        res.json({ ok: code === 0, log:saida})
    })
})

app.get('/resultados', (req, res) => {
    try {
        const dados = JSON.parse(fs.readFileSync('resultados.json', 'utf8'))
        res.json(dados)
    } catch {
        res.status(404).json({ erro: 'Execute o verificador primeiro! '})
    }
})

app.listen(PORT, () => {
    console.log('Servidor aberto em http://localhost:' + PORTA)
})
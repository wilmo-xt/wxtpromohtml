const fs = require('fs');
const express = require('express');
const multer = require('multer');
const path = require('path');
const AssemblyAI = require('assemblyai');
const { RsnChat } = require('rsnchat');
const Wxt_key =  "rsnai_Pks30sJqtk1s1us3mN25hm1m";
const wxt_assemblyai = "11d7fb1a4e8f4e4fac85d3b9be844b4a";

const app = express();
const port = 3000;

// Configuração das APIs
const rsnchat = new RsnChat(Wxt_key);
const client = new AssemblyAI({
apiKey: wxt_assemblyai,
});

// Verifica se a pasta "uploads" existe e a cria, se necessário
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
fs.mkdirSync(uploadsDir);
console.log('Pasta "uploads" criada.')
}

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, './uploads')},
filename: (req, file, cb) => {
cb(null, file.originalname)},});
const upload = multer({ storage });

//permitir  no corpo das requisições
app.use(express.json())

// Servir os arquivos estáticos (HTML, CSS, JS)
app.use(express.static('.'))

// Rota para interagir com o bot RsnChat
app.post('/api/bot', async (req, res) => {
const { prompt } = req.body;

try {
const opx = await rsnchat.gemini(prompt);
const respostaBard = opx.message;
res.json({ resposta: respostaBard });
} catch (error) {
console.error('Erro ao chamar a API do bot:', error);
res.status(500).json({ error: 'Erro ao processar a solicitação do bot' })}});

// Rota para upload de arquivos e transcrição
app.post('/api/transcribe', upload.single('file'), async (req, res) => {
const filePath = path.join(__dirname, 'uploads', req.file.filename);

try {
// Cria a transcrição especificando o idioma como português (pt)
const transcript = await client.transcripts.create({
audio_url: filePath,
language_code: 'pt',  
});

// Envia a transcrição como resposta
res.json({ transcript: transcript.text });

fs.unlink(filePath, (err) => {
if (err) {
console.error('Erro ao deletar o arquivo:', err);
} else {
console.log('Arquivo deletado com sucesso:', filePath)
}})} catch (error) {
console.error('Erro ao transcrever o arquivo:', error);
res.status(500).json({ error: 'Erro ao processar a transcrição' })}});

// Rota para suporte IA
app.post('/api/support', async (req, res) => {
const { prompt } = req.body;
try {
const opx2 = await rsnchat.gpt4(prompt);
const respostaGpt4 = opx2.message;
res.json({ resposta: respostaGpt4 });
} catch (error) {
console.error('Erro ao chamar a IA:', error);
res.status(500).json({ error: 'Erro ao processar a solicitação de suporte' })}});

// Iniciar o servidor
app.listen(port, () => {
console.log(`Server listening at http://localhost:${port}`)
})

/*
esse arquivo é a script fundamental lê os cliks dos botões e realiza as funções de ia etc
*/

// Função para alternar o menu
function toggleMenu() {
const menu = document.getElementById('menu');
if (menu.style.display === 'none' || menu.style.display === '') {
menu.style.display = 'block';
} else {
menu.style.display = 'none';
}
}

// Função para mostrar uma seção específica e ocultar outras
function navigateTo(sectionId) {
document.getElementById('main-screen').style.display = 'none';
document.getElementById('menu').style.display = 'none';
document.getElementById('bot-section').style.display = 'none';
document.getElementById('transcription-section').style.display = 'none';
document.getElementById('video-transcription-section').style.display = 'none';
document.getElementById('support-ia-section').style.display = 'none';

// Mostrar a seção correspondente
document.getElementById(sectionId).style.display = 'block';
}

// Função para exibir a tela inicial
function showMainScreen() {
document.getElementById('main-screen').style.display = 'flex'; 
document.getElementById('menu').style.display = 'none'; 
document.getElementById('bot-section').style.display = 'none'; 
document.getElementById('transcription-section').style.display = 'none'; 
document.getElementById('video-transcription-section').style.display = 'none'; 
document.getElementById('support-ia-section').style.display = 'none'; 
}

// Lógica para interação com o Bot
document.getElementById('sendButton').addEventListener('click', async function() {
const userPrompt = document.getElementById('userPrompt').value;
if (userPrompt.trim() === "") {
alert("Vamos conversar, escreva algo...");
return;
}
document.getElementById('loadingBot').style.display = 'block'; 
try {
const response = await fetch('/api/bot', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({ prompt: userPrompt })});

if (response.ok) {
const data = await response.json();
document.getElementById('responseContainer').innerText = `${data.resposta}`; //resposta bot
} else {
document.getElementById('responseContainer').innerText = 'Desculpe o bot não respondeu!!.';
} } catch (error) {
console.error('Erro ao enviar o prompt para o bot:', error);
document.getElementById('responseContainer').innerText = 'O bot não consegui ler volte mais tarde!!.';
} finally {
document.getElementById('loadingBot').style.display = 'none'; 
}});

// Lógica para transcrição de áudio
document.getElementById('uploadButton').addEventListener('click', async function() {
const audioFile = document.getElementById('audioFile').files[0];
if (!audioFile) {
alert("Por favor, selecione um arquivo de áudio.");
return  }
document.getElementById('loadingAudio').style.display = 'block'; 
const formData = new FormData();
formData.append('file', audioFile);

try {
const response = await fetch('/api/transcribe', {
method: 'POST',
body: formData });
if (response.ok) {
const data = await response.json();
document.getElementById('transcriptionContainer').innerText = `${data.transcript}`;
} else {
document.getElementById('transcriptionContainer').innerText = 'Erro ao transcrever o áudio tente mais tarde.';
}} catch (error) {
console.error('Erro ao enviar o arquivo de áudio para transcrição:', error);
document.getElementById('transcriptionContainer').innerText = 'Erro ao enviar o arquivo de áudio para transcrição tente mais tarde';
} finally {
document.getElementById('loadingAudio').style.display = 'none'; 
}});

// Lógica para transcrição de vídeo
document.getElementById('videoUploadButton').addEventListener('click', async function() {
const videoFile = document.getElementById('videoFile').files[0];
if (!videoFile) {
alert("Por favor, selecione um arquivo de vídeo.");
return }
document.getElementById('loadingVideo').style.display = 'block'; 
const formData = new FormData();
formData.append('file', videoFile);

try {
const response = await fetch('/api/transcribe', {
method: 'POST',
body: formData});
if (response.ok) {
const data = await response.json();
document.getElementById('videoTranscriptionContainer').innerText = `${data.transcript}`;
} else {
document.getElementById('videoTranscriptionContainer').innerText = 'Erro ao transcrever o vídeo volte mais tarde.' }
} catch (error) {
console.error('Erro ao enviar o arquivo de vídeo para transcrição:', error);
document.getElementById('videoTranscriptionContainer').innerText = 'Erro ao enviar o arquivo de vídeo para transcrição volte mais tarde.';
} finally {
document.getElementById('loadingVideo').style.display = 'none' }});

// Lógica para interagir com a IA de Suporte
document.getElementById('supportSendButton').addEventListener('click', async function() {
const supportPrompt = document.getElementById('supportPrompt').value;
if (supportPrompt.trim() === "") {
alert("Por favor, insira um prompt.");
return }
document.getElementById('loadingSupport').style.display = 'block'; 
try {
const response = await fetch('/api/support', {
method: 'POST',
headers: {
'Content-Type': 'application/json' },
body: JSON.stringify({ prompt: supportPrompt })});
if (response.ok) {
const data = await response.json();
document.getElementById('supportResponseContainer').innerText = `${data.resposta}`;
} else {
document.getElementById('supportResponseContainer').innerText = 'Erro ao obter resposta da IA volte mais tarde.'}
} catch (error) {
console.error('Erro ao enviar o prompt para a IA de suporte:', error);
document.getElementById('supportResponseContainer').innerText = 'Erro ao enviar o prompt para a IA de suporte volte mais tarde.';
} finally {
document.getElementById('loadingSupport').style.display = 'none' }});

// Lógica para copiar texto
document.getElementById('copyButton').addEventListener('click', function() {
const supportResponse = document.getElementById('supportResponseContainer').innerText;
if (supportResponse.trim() === "") {
alert("Nenhum texto para copiar.");
return }
navigator.clipboard.writeText(supportResponse).then(() => {
alert("Texto copiado para a área de transferência.");
}).catch(err => {
console.error('Erro ao copiar o texto:', err);
alert("Erro ao copiar o texto.")})})

//alternar entre as seções
document.getElementById('openMenuButton').addEventListener('click', toggleMenu)
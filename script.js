const fileSelector = document.querySelector('input')
const start = document.querySelector('button')
//const img = document.querySelector('img')
const progress = document.querySelector('.progress') 
const textarea = document.querySelector('textarea')

// first show image on upload
fileSelector.onchange = () => {
    if (fileSelector.files[0] == null)
    {
        start.disabled = true
    }
    else
    {
        start.disabled = false
    }
    //var file = fileSelector.files[0]
    //var imgUrl = window.URL.createObjectURL(new Blob([file], { type: 'image/jpg' }))
    //img.src = imgUrl // mudando o src da imagem no html
}


start.onclick = async() => {
    textarea.innerHTML = ''
    const worker = await Tesseract.createWorker('por',1, {
        logger: (m) => {
            progress.innerHTML= traduzirStatus(m.status)+"; Progresso:   " +  Math.round(m.progress*100) + "%"
        },
      });
    const ret = await worker.recognize(fileSelector.files[0]);
    console.log(ret.data.text);
    progress.innerHTML = 'Pronto:'
    NovoTexto(ret.data.text)
    await worker.terminate();
};
function NovoTexto(novotexto)
{
    textofinal = novotexto.replaceAll("\n", " ")
    document.getElementById("falar").disabled = false
    textarea.innerHTML = textofinal
}
function falar()
{
    ut = new SpeechSynthesisUtterance(textofinal)
    console.log(textofinal)
    window.speechSynthesis.speak(ut)
    const worked = speechSynthesis.speaking || speechSynthesis.pending;
    console.log(worked);
    document.getElementById("falar").disabled = true
    document.getElementById("pausar").disabled = false
    document.getElementById("parar").disabled = false
}
function pausecontinue()
{
    if (speechSynthesis.paused == true)
    {
        speechSynthesis.resume()
        document.getElementById("falar").disabled = true
    }
    else
    {
        speechSynthesis.pause();
        document.getElementById("falar").disabled = true
    }
}
function stop()
{
    speechSynthesis.cancel();
    document.getElementById("parar").disabled = true
    document.getElementById("pausar").disabled = true
    document.getElementById("falar").disabled = false
}
function traduzirStatus(frase)
{
    if (frase == "loading tesseract core")
    {
        return "Carregando Reconhecedor de textos"
    }
    else if (frase == "initializing tesseract")
    {
        return "Inicializando Reconhecedor de textos"
    }
    else if (frase == "loading language traineddata")
    {
        return "Carregando Linguagem"
    }
    else if (frase == "initializing api")
    {
        return "Inicializando API"
    }
    else if (frase == "recognizing text")
    {
        return "Reconhecendo o texto"
    }
}

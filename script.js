//Informações sobre o estado atual do jogo
var rodando = false;
var xfruta;
var yfruta;
var relogio;
var intervalo;
var proxDirec = new Array();
proxDirec.length = 0;
var rotacao = 0;

function pausa(){
    rodando =!rodando;
    if(rodando){
        btPausa.innerHTML = "Pausar";
        relogio = setInterval("loopPrincipal()", intervalo);
    }
    else{
        clearInterval(relogio);
        btPausa.innerHTML = "Continuar";
    }
}

//referencias dos objetos
var canvas = document.getElementById("tela");
var context = canvas.getContext("2d");
var btPausa = document.getElementById("btPausa");
var sdncomer1 = document.getElementById("comer1");
var sdncomer2 = document.getElementById("comer2");
var sdngameover = document.getElementById("gameover");


//informações do tabuleiro
var nx = 0;//n de quadrados em x
var ny = 0;//n de quadrados em y
var largura = 20;// largura dos quadrados
var distancia = 5;//distancia entre os quadrados
var borda_x, borda_y;//posição das bordas




function criarTabuleiro(){
    nx = Math.floor((canvas.width-distancia)/(largura+distancia));
    ny = Math.floor((canvas.height - distancia)/(largura+distancia));
    borda_x = nx * (distancia+largura)+distancia;
    borda_y = ny *(distancia+largura)+distancia;   
}



function desenhar(){
    //variáveis auxiliares para desenhar
    var xi, yi;
    
    //limpar tela
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    //desenhar bordas
    context.fillStyle = "#888888";
    context.fillRect(borda_x, 0, canvas.width-1, canvas.height-1);
    context.fillRect(0, borda_y, canvas.width-1, canvas.height-1);
    
    //desenhar a snake
    context.fillStyle = "#00FF00";
    for(i=0; i < nodos.length; i++){
        xi = distancia + nodos[i].x*(largura+distancia);
        yi = distancia + nodos[i].y*(largura+distancia);
        context.fillRect(xi, yi, largura, largura);
    }
    
    //desenhar a fruta
    context.fillStyle = "#FF0000";
    xi = distancia + (xfruta*(largura+distancia)) + Math.floor(largura/2);
    yi = distancia + (yfruta*(largura+distancia)) + Math.floor(largura/2);
    rotacao += Math.PI*0.1;
    if (rotacao > Math.PI*2)
        rotacao -= Math.PI*2;
    var r = rotacao + (Math.PI * 1.5);
    context.beginPath();
    context.arc(xi, yi, distancia, r, rotacao, true);
    context.closePath();
    context.fill();
}

//Array contendo todos os nodos da snake
var nodos = new Array();
nodos.length = 0;

function novoJogo(){
    if(rodando)
        pausa();
    intervalo = 200
    xfruta = nx-1;
    yfruta = ny-1;
    var xcenter = Math.floor(nx/2);
    var ycenter = Math.floor(ny/2);
    nodos.length = 0;
    nodos.push(new Nodo(xcenter, ycenter + 2, dbaixo));
    nodos.push(new Nodo(xcenter, ycenter + 1, dbaixo));
    nodos.push(new Nodo(xcenter, ycenter, dbaixo));
    nodos.push(new Nodo(xcenter, ycenter - 1, dbaixo));
    nodos.push(new Nodo(xcenter, ycenter - 2, dbaixo));
    btPausa.innerHTML = "Iniciar";
    btPausa.disable = false;
    desenhar();
}


function loopPrincipal(){
    //atualizar valores
    moverSnake();
    detectarColisoes();
    desenhar();
}

function detectarColisoes(){
    //colisão da cabeça com alguma parede
    if ((nodos[0].x<0) || (nodos[0].x >=nx) || (nodos[0].y<0) || (nodos[0].y >=ny)){
        executarGameOver();//game over
        sdngameover.play();
    }
    //Colisão da cabeça com o corpo
    for (i=1; i<nodos.length; i++){
        if ((nodos[0].x ==nodos[i].x) && (nodos[0].y == nodos[i].y)){
            executarGameOver();
            sdngameover.play();
        }
    }
    //Comer a fruta
    if ((nodos[0].x == xfruta) && (nodos[0].y == yfruta)) {
        sndComer();
        var ultimo = nodos.length - 1;
        nodos.push(new Nodo(nodos[ultimo].x, nodos[ultimo].y, nodos[ultimo].direc));
        var novoultimo = ultimo + 1;
        switch (nodos[ultimo].direc) {
            case dbaixo:
                nodos[novoultimo].y -= 1;
                break;
        case ddireita:
            nodos[novoultimo].x -= 1;
            break;
        case dcima:
            nodos[novoultimo].y += 1;
            break;
        case desquerda:
            nodos[novoultimo].x += 1;
            break;
        }
        novaPosFruta();
        
    }
}

function executarGameOver(){
    btPausa.disabled = true;
    if(rodando)
        pausa()
}

function moverSnake(){
    //Mover todos os nodos, exceto cabeça
    for (i = nodos.length - 1; i > 0; i--) {
        nodos[i].x = nodos[i-1].x;
        nodos[i].y = nodos[i-1].y;
        nodos[i].direc = nodos[i-1].direc;
}
//se lista de comandos não estiver vazia
if (proxDirec.length>0)
    //se há uma direção diferente da atual
    if (nodos[0].direc != proxDirec[0])
        //alterar a direção
        nodos[0].direc = proxDirec[0];
//executar movimento da cabeça
nodos[0].Mover();

//enquanto houverem comandos na lista
while (proxDirec.length>0){
    //se o comando é redundante
    if (proxDirec[0] == nodos[0].direc)
        //remove o comando do inicio da lista
        proxDirec.shift();
    else   
        //se não for para a repetição
        break
    }
}

//eventos
document.onkeydown = onKD;

function onKD(evt){
    switch(evt.keyCode){
    case 37: //esquerda
        proxDirec.push(desquerda);
        break;
    case 38: //cima
        proxDirec.push(dcima);
        break;
    case 39: // direita
        proxDirec.push(ddireita);
        break;
    case 40: // baixo
        proxDirec.push(dbaixo);
        break;
    }
}

function sndComer(){
    if (Math.random()<0.8)
        sdncomer1.play();
    else
        sdncomer2.play();
}

//determinar nova posição da fruta
function novaPosFruta(){
    do{
        xfruta = Math.floor(Math.random()*nx);
        yfruta = Math.floor(Math.random()*ny);
    }while(colisaoFruta()==true);
}

//verificar se posição da fruta colide com corpo da snake
function colisaoFruta(){
    for(i=0; i<nodos.length; i++){
        if((xfruta == nodos[i].x) && (yfruta == nodos[i].y))
            return true;
    }
    return false;


}

//inicializações
criarTabuleiro();
novoJogo();




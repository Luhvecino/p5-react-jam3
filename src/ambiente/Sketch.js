import React, { useRef, useEffect } from 'react';
import 'p5/lib/addons/p5.sound';
import p5 from 'p5';

//Telas
class Menu {
  constructor(p, mudarTela) {
    this.p = p;
    this.fundo = new Fundo(p,150);
    this.botoes = [
      new Botao(p, p.width /2 - 100, p.height /2 , 200, 40, 'Iniciar', () => mudarTela('iniciar')),
      new Botao(p,  p.width /2 - 100, p.height /2 * 1.2, 200, 40, 'Sobre', () => mudarTela('sobre')),
    ];
  }

  draw() {       
    this.fundo.desenhar();
    this.p.fill(255);
    this.p.textSize(24);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.text('Menu Inicial', this.p.width / 2, 60);

    for (let botao of this.botoes) {
      botao.desenhar();  
    }
  }

  mousePressed() {
    for (let botao of this.botoes) {
      botao.checarClique();
    }
  }
}

class TelaSobre {
  constructor(p, mudarTela) {
    this.p = p;
    this.fundo = new Fundo(p, 150);
    this.botaoVoltar = new Botao(p, p.width - 100, 0, 100, 40, 'Voltar', () => mudarTela('menu'));
    this.texto = [
      'Desenvolvedores',
      '',
      'João',
      'Lucas Vecino Rodrigues',
      'Matheus',      
    ];

    this.posY = p.height; 
    this.velocidade = 1; 
  }

  draw() {
    this.fundo.desenhar();
    const p = this.p;
    p.fill(255);
    p.textSize(50);
    p.textAlign(p.CENTER, p.CENTER);
    for (let i = 0; i < this.texto.length; i++) {
      let y = this.posY + i * 100;
      p.text(this.texto[i], p.width / 2, y);
    }

    this.posY -= this.velocidade;

    this.botaoVoltar.desenhar();
  }

  mousePressed() {
    this.botaoVoltar.checarClique();
  }
}

class Upgrade {
  constructor(p, mudarTela, jogador, inimigo, botaoUpgrade, moeda) {
    this.p = p;
    this.jogador = jogador;
    this.inimigo = inimigo;
    this.fundo = new Fundo(p, 150);
    this.bg = new Imagem(p,'/img/bgUpdate.gif',p.width/2,p.height/2,p.width,p.height);
    this.botaoUpgrade = botaoUpgrade;
    this.moeda = moeda;  
    this.frases = null;  
    this.size = 500; // tamanho inicial da letra
    this.fraseX = this.p.width / 2;
    this.fraseY = this.p.height;

    this.botaoIniciar = new Botao(p,5, 5, 100, 40, 'Play', () => {mudarTela(
      'iniciar');
      velocidadeInimigoGlobal = velocidadeInimigoBase + upgradesAplicados.inimigoVel;
      this.jogador.vidaAtual = this.jogador.vidaMax; 
      this.jogador.xpAtual = 0;    
    });     

    this.posY = p.height; 
    this.velocidade = 1; 
    this.frasesTutorial = [
      "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< \n Quer tentar de novo? aperta no play ",
      "Nesta tela você encontra os UPGRADES \n para te ajudar",
      "\n \n \n <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< \n O dinheiro vc ganha com o tempo",
      "Você tem que sobreviver por 1 minuto",
      "Movimente o personagem com o mouse",
      "Então, o esquema é você \n desviar das bolhinhas vermelhas"

    ]

    this.frasesAte30 = [
      "Péssimo",
      "Muito ruim...",
      "Melhor desistir...",
      "Já vi bebês jogando melhor",
      "Você realmente está tentando ?",
      "Parabéns nota 1/10",
      "Incrivel! Uma estrela",
      "Patético",
      "Está pra nascer alguém tão ruim..."
    ];
    this.frases30 = [
      "Médio",
      "Mediano",
      "Mediocre",
      "Sabia que existia um potencial. \n Pra ser ruim, é claro",
      "Você é muito bom, \n já pensou em se aposentar ? ",
    ];
    this.frasesMais30 = [
      "Porque me descepcionas ?",
      "Está tão perto, ao mesmo tempo tão longe...",
      "Mais uminha ?",
      "Essa aqui é saideira né ?",
      "SAIDEIRA É SÓ COM VITÓRIA",
      "Está com medo de vercer ?",
    ];
    this.frasesFinais = [
      "Sempre acreditei em você !",
      "Quer um bolo ?",
      "Está satisfeito ?",
      "Era isso que você queria ?",
      "Que bela conquista hein !"     
    ];
    this.iTutorial = this.p.floor(this.p.random(0, this.frasesTutorial.length));
    this.iAte30 = this.p.floor(this.p.random(0, this.frasesAte30.length));
    this.i30 = this.p.floor(this.p.random(0, this.frases30.length));
    this.iMais30 = this.p.floor(this.p.random(0, this.frasesMais30.length));
    this.iFinais = this.p.floor(this.p.random(0, this.frasesFinais.length));
  }

  draw() {
    const p = this.p; 
    this.fundo.desenhar();
    this.bg.desenhar();
    this.botaoIniciar.desenhar();  
    for (let botaoUpgrade of botoesUpgradeGlobais) {
      botaoUpgrade.desenhar();
    }
     
    p.push()
    p.stroke(5)
    p.fill(255,200,200);    
    p.textSize(this.size);
    if (this.size > 50) {
      this.size -= 5; 
    }
    p.textAlign(p.CENTER, p.CENTER);
    
    if (this.fraseY > 60) {
      this.fraseY -= 5; 
    }

    //Logica para as frases
    if(this.jogador.xpAtual < 10 ){
      this.frases = this.frasesTutorial; 
      p.text(`${this.frases[this.iTutorial]}`,this.p.width / 2, this.fraseY);
    }
    if(this.jogador.xpAtual >= 10 && this.jogador.xpAtual < 30){
      this.frases = this.frasesAte30; 
      p.text(`${this.frases[this.iAte30]}`,this.p.width / 2, this.fraseY); 
    }
    if(this.jogador.xpAtual >= 30 && this.jogador.xpAtual < 40){
      this.frases = this.frases30;
      p.text(`${this.frases[this.i30]}`,this.p.width / 2, this.fraseY); 
    }   
    if(this.jogador.xpAtual >= 40 && this.jogador.xpAtual < 60){
      this.frases = this.frasesMais30;
      p.text(`${this.frases[this.iMais30]}`,this.p.width / 2, this.fraseY); 
    }
    if(this.jogador.xpAtual >= 60){
      this.frases = this.frasesFinais;
      p.text(`${this.frases[this.iFinais]}`,this.p.width / 2, this.fraseY); 
    }
    p.pop()

    

    this.moeda.atualizar();
    this.moeda.desenhar(); 
  }

  mousePressed() {
    this.botaoIniciar.checarClique();
    for (let botaoUpgrade of botoesUpgradeGlobais) {
      botaoUpgrade.checarClique(this.moeda);
    }
  }
}

class Interface {
  constructor(p, jogador, mostrar = false) {
    this.p = p;
    this.mostrar = mostrar;
    this.jogador = jogador;
    this.barraXpFundo = new Imagem(p, 'img/XpFundo.png', 0, 0, 1000, 6);
    this.barraXpFrente = new Imagem(p, 'img/XpFrente.png', 0, 0, 0, 6);  
    this.posX = p.width / 2;
    this.posY = 20;    
  }

  desenhar() {
    const p = this.p;
    if (this.mostrar){
      this.barraXpFundo.desenhar();
      this.barraXpFrente.desenhar();  
      if( this.jogador.xpAtual <= 60){
        const proporcao = this.jogador.xpAtual / this.jogador.xpMax;              
        this.barraXpFrente.w = 1000 * proporcao + 1;
        this.barraXpFundo.x = this.posX;
        this.barraXpFundo.y = this.posY;
        this.barraXpFrente.x = this.posX;
        this.barraXpFrente.y = this.posY;         
      }
    }
  }  
}

class TelaFinal {
  constructor(p, mudarTela, jogador ) {
    this.p = p;
    this.jogador = jogador;
    this.fundo = new Fundo(p, 150);
    this.bgUpdate = new Imagem(p,'/img/gamebg.png',p.width/2,p.height/2,p.width,p.height);
    
    this.frases = null;  
    this.size = 500; // tamanho inicial da letra
    this.fraseX = this.p.width / 2;
    this.fraseY = this.p.height / 2;

    this.botaoUpgrade = new Botao(p,5, 5, 100, 40, 'upgrade', () => {mudarTela('upgrade'); 
    });     

    this.posY = p.height; 
    this.velocidade = 1; 
    
    this.frasesFinais = [
      "Sempre acreditei em você",      
      "Quer um bolo ?",
      "Está satisfeito ?",
      "Era isso que você queria ?"      
    ];
    this.iFinais = this.p.floor(this.p.random(0, this.frasesFinais.length));
  }

  draw() {
    const p = this.p; 
    this.fundo.desenhar();
    this.bgUpdate.desenhar();
    this.botaoUpgrade.desenhar();     
     
    p.push()
    p.stroke(5)
    p.fill(255,200,200);    
    p.textSize(this.size);
    if (this.size > 50) {
      this.size -= 5; 
    }
    p.textAlign(p.CENTER, p.CENTER);
    
    if (this.fraseY > 60) {
      this.fraseY -= 5; 
    }
    
    if(this.jogador.xpAtual > 60){
      this.frases = this.frasesFinais;
      p.text(`${this.frases[this.iFinais]}`,this.p.width / 2, this.p.height / 2); 
    }  
    p.pop()
  }

  mousePressed() {
    this.botaoUpgrade.checarClique();    
  }
}

class TelaIniciar {
  constructor(p, mudarTela, jogador, botaoUpgrade, moeda, interfaceG, area) {
    this.p = p;
    this.mudarTela = mudarTela;
    this.fundo = new Fundo(p, 150);   
    this.bgUpdate = new Imagem(p,'/img/gamebg.png',p.width/2,p.height/2,p.width,p.height);
    this.jogador = jogador;

    this.botaoUpgrade = botaoUpgrade;
    this.moeda = moeda;
    
    this.inimigos = [];
    
    this.arena = area;
    
    let intervaloSpawn1 = 1000;
    let intervaloSpawn2 = 2000;
    this.spawnInimigo = new SpawnInimigo(
      p,
      1 * 60 * 1000,       
      intervaloSpawn1,          
      () => {
        if (this.jogador && this.jogador.pos) {    
             
          //alvo = jogado      
          //const destino = p.createVector(this.jogador.pos.x, this.jogador.pos.y);
          //alvo = arena
          const destino = p.createVector(
            p.random(this.arena.x, this.arena.x + this.arena.largura),
            p.random(this.arena.y, this.arena.y + this.arena.altura)
          );
          const novoInimigo = new Inimigo(p, destino,"esquerda"); // cria um novo inimigo com velocidade nova
          this.inimigos.push(novoInimigo);
        }        
      }
    );
    this.spawnInimigo2 = new SpawnInimigo(
      p,
      1 * 60 * 1000, // duração total
      intervaloSpawn1,          // intervalo
      () => {         
        if (this.jogador && this.jogador.pos) { 
                   
          //alvo = arena
          const destino = p.createVector(
            p.random(this.arena.x, this.arena.x + this.arena.largura),
            p.random(this.arena.y, this.arena.y + this.arena.altura)
          );
          const novoInimigo = new Inimigo(p, destino, "direita"); // cria um novo inimigo com velocidade nova
          this.inimigos.push(novoInimigo);
        }        
      }
    );
    this.spawnInimigo3 = new SpawnInimigo(
      p,
      1 * 60 * 1000, // duração total
      intervaloSpawn2,          // intervalo
      () => {         
        if (this.jogador && this.jogador.pos) { 
                   
          //alvo = arena
          const destino = p.createVector(
            p.random(this.arena.x, this.arena.x + this.arena.largura),
            p.random(this.arena.y, this.arena.y + this.arena.altura)
          );
          const novoInimigo = new Inimigo(p, destino, "cima"); // cria um novo inimigo com velocidade nova
          this.inimigos.push(novoInimigo);
        }        
      }
    );
    this.spawnInimigo4 = new SpawnInimigo(
      p,
      1 * 60 * 1000, // duração total
      intervaloSpawn2,          // intervalo
      () => {         
        if (this.jogador && this.jogador.pos) { 
                   
          //alvo = arena
          const destino = p.createVector(
            p.random(this.arena.x, this.arena.x + this.arena.largura),
            p.random(this.arena.y, this.arena.y + this.arena.altura)
          );
          const novoInimigo = new Inimigo(p, destino, "baixo"); // cria um novo inimigo com velocidade nova
          this.inimigos.push(novoInimigo);
        }        
      }
    );
    this.interfaceG = interfaceG;    
  }   
  

  draw() {
    const p = this.p; 
    this.fundo.desenhar();
    this.bgUpdate.desenhar();
    this.arena.desenhar();
    this.arena.limitar(this.jogador.pos);     

    this.jogador.atualizar();
    this.jogador.desenhar();

    this.moeda.atualizar();   
    this.moeda.desenhar();    

    this.spawnInimigo.atualizar();
    this.spawnInimigo2.atualizar();
    this.spawnInimigo3.atualizar();
    this.spawnInimigo4.atualizar();
    this.interfaceG.desenhar();
    
    for (let i = this.inimigos.length - 1; i >= 0; i--) {
      let inimigo = this.inimigos[i];

      if (colisaoRetangular(this.jogador, inimigo)) {
        this.inimigos.splice(i, 1);
        this.jogador.vidaAtual -= 20;        
      }
      inimigo.atualizar(this.jogador.pos);
      inimigo.desenhar();
    }   
    
    if (this.jogador.vidaAtual <= 0) {   
        this.mudarTela('upgrade', this.botaoUpgrade);
      }
    
    if(this.jogador.xpAtual >= 65 ){
      this.mudarTela('final'); 
    } 
  }
}


//Elementos do jogo
class Jogador {
  constructor(p) {
    this.p = p;
    this.img = new Imagem(p, 'img/player.png', p.width / 2, p.height / 2, 50, 50);
    this.playerLife = new Imagem(p, 'img/playerLife.png', p.width / 2, p.height / 2, 50, 50);
    this.pos = p.createVector(p.width / 2, p.height / 2);  
    this.vel = p.createVector(0, 0);
    this.acel = p.createVector(0, 0);
    this.velMax = 1.0;
    this.acelMax = 10;
    this.xpAtual = 0;
    this.xpMax = 60;

    this.vidaMax = 100;
    this.vidaAtual = 100;
  }

  atualizar() {
    const alvo = this.p.createVector(this.p.mouseX, this.p.mouseY);
    const direcao = p5.Vector.sub(alvo, this.pos);
    
    if (direcao.mag() > 1) {
      direcao.normalize();
      direcao.mult(this.acelMax);
      this.acel = direcao;
      this.vel.add(this.acel);
      this.vel.limit(this.velMax);
      this.pos.add(this.vel);
    }

    this.img.x = this.pos.x;
    this.img.y = this.pos.y;

    this.playerLife.x = this.pos.x;
    this.playerLife.y = this.pos.y;
  }  

  desenhar() {
    this.img.desenhar();

    const proporcao = this.vidaAtual / this.vidaMax;
    this.playerLife.h = 50 * proporcao ; 
    this.playerLife.w = 50 * proporcao; 
    this.playerLife.desenhar();
  }
}

class Inimigo {
  constructor(p, destino, setLado = null) {
    this.p = p;
    this.img = new Imagem(p, 'img/enemy.png', p.width / 2, p.height / 2, 25, 25);
    this.setLado = setLado
    if(setLado != null){
    // posição do spawn
    if (setLado === 'esquerda') {
      this.pos = p.createVector(0, p.random(p.height));
    } else if (setLado === 'direita') {
      this.pos = p.createVector(p.width, p.random(p.height));
    } else if (setLado === 'cima') {
      this.pos = p.createVector(p.random(p.width), 0);
    } else if (setLado === 'baixo') {
      this.pos = p.createVector(p.random(p.width), p.height);
    }
    }else{
      let lado = p.random([ 'esquerda', 'direita', 'cima', 'baixo' ]);  
    // posição do spawn
    if (lado === 'esquerda') {
      this.pos = p.createVector(0, p.random(p.height));
    } else if (lado === 'direita') {
      this.pos = p.createVector(p.width, p.random(p.height));
    } else if (lado === 'cima') {
      this.pos = p.createVector(p.random(p.width), 0);
    } else if (lado === 'baixo') {
      this.pos = p.createVector(p.random(p.width), p.height);
    }
    }
    this.destino = destino;
    this.vel = p5.Vector.sub(destino, this.pos).normalize().mult(velocidadeInimigoGlobal);
    
  }

 atualizar() {
  this.pos.add(this.vel);
  this.img.x = this.pos.x;
  this.img.y = this.pos.y;  
}

  desenhar() {
    this.img.desenhar();
    // desenha o inimigo
  }
}

class Arena {
  constructor(p, x, y, largura, altura) {
    this.p = p;

    // Calcula posição para centralizar a arena
    this.x = (p.width - largura) / 2;
    this.y = (p.height - altura) / 2;
    this.largura = largura;
    this.altura = altura;
  }

  desenhar() {
    const p = this.p;
    p.noFill();
    p.stroke(255);
    p.strokeWeight(5);
    p.rect(this.x, this.y, this.largura, this.altura);
  }

  limitar(pos) {
    // Limita a posição recebida para ficar dentro da arena
    pos.x = this.p.constrain(pos.x, this.x + 27, this.x + this.largura - 27);
    pos.y = this.p.constrain(pos.y, this.y + 27, this.y + this.altura - 27);
  }

   expandir(delta) {
    // Expande a arena proporcionalmente e recentraliza
    this.largura += delta;
    this.altura += delta;
    this.x = (this.p.width - this.largura) / 2;
    this.y = (this.p.height - this.altura) / 2;
  }
}

class Moeda {  
  constructor(p, jogador) {
    this.p = p;
    this.jogador = jogador;
    this.x = 30;
    this.y = 115;
    this.quantidade = 0;
    this.tempoUltima = p.millis();
    this.imagem = new Imagem(p, 'img/moeda.gif', this.x, this.y, 50, 50); 
  }

  atualizar() {
    if (this.jogador.vidaAtual > 0) {
      const agora = this.p.millis();
      if (agora - this.tempoUltima >= 1000) {
        this.jogador.xpAtual++;
        this.quantidade++;
        this.tempoUltima = agora;
      }
    }
  }

  desenhar() {
    this.imagem.desenhar();
    this.p.fill(255,255,200);
    this.p.textSize(30);
    this.p.noStroke();
    this.p.textAlign(this.p.LEFT, this.p.TOP);
    this.p.text(`x ${this.quantidade}`, this.x + 30, this.y - 10 ); 
  }
}

class botaoUpgrade {
  constructor(p, nome, x, y, largura, altura, maxCliques, custo, aoClicar) {
    this.p = p;
    this.nome = nome;
    this.cor = 100
    this.x = x;
    this.y = y;
    this.custo = custo;
    this.largura = largura;
    this.altura = altura;
    this.maxCliques = maxCliques;
    this.cliques = 0;
    this.aoClicar = aoClicar;
    this.moeda = new Imagem(p, 'img/moeda.gif', this.x + 160, this.y + 70, 25, 25);
    this.somCompra = new Som(p, 'sons/nota1.wav');
    this.somCompra.volume(1); // volume mais baixo
  }

  desenhar() {
    const p = this.p;
    
    p.push()
    p.stroke(2);
    p.fill(100,this.cor,100);
    const hovering = this.estaMouseSobre();
    p.fill(hovering ? 180 : 200);
    p.rect(this.x, this.y, this.largura, this.altura, 10);
    
    p.fill(255,100,100);
    p.textAlign(p.CENTER, p.CENTER);    
    p.textSize(16);
    p.text(`${this.nome} (${this.cliques}/${this.maxCliques})`, this.x + this.largura / 2, this.y + this.altura / 2 - 20);
    this.moeda.desenhar();
    
    if(this.cliques < this.maxCliques){
      p.fill(100,150,100);
      p.text(`CUSTO: ${this.custo}`, this.x + this.largura / 2, this.y + this.altura / 2 + 20);
    }
    
    if (this.cliques === this.maxCliques){
      p.text(`✔`, this.x + this.largura / 2, this.y + this.altura / 2 + 20);
      this.cor = 150;
    }
    p.pop()
    
  
  }
  estaMouseSobre() {
    const p = this.p;
    return (
      p.mouseX > this.x &&
      p.mouseX < this.x + this.largura &&
      p.mouseY > this.y &&
      p.mouseY < this.y + this.altura
    );
  }

  checarClique(moeda) {
    const p = this.p;
    if (
     this.estaMouseSobre() &&
      this.cliques < this.maxCliques && 
      moeda.quantidade >= this.custo
    ) {
      this.somCompra.tocar();
      moeda.quantidade -= this.custo;
      this.cliques++;
      this.custo *= 5;
      this.aoClicar(); 
    }
  }
    

}


//Classes auxiliares
class Fundo {
  constructor(p, cor) {
    this.p = p;
    this.cor = cor;
    //colocar imagens de background
  }

  desenhar() {
    const p = this.p;
    p.background(this.cor,this.cor,this.cor);
  }
}

class Botao {
  constructor(p, x, y, w, h, label, onClick) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.onClick = onClick;
  }

  desenhar() {
    const p = this.p;
    const hovering = this.estaMouseSobre();
    p.fill(hovering ? 180 : 200);
    p.rect(this.x, this.y, this.w, this.h, 10);
    p.fill(0);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }

  estaMouseSobre() {
    const p = this.p;
    return (
      p.mouseX > this.x &&
      p.mouseX < this.x + this.w &&
      p.mouseY > this.y &&
      p.mouseY < this.y + this.h
    );
  }

  checarClique() {
    if (this.estaMouseSobre() && this.onClick) {
      this.onClick();
    }
  }
}

class SpawnInimigo {
  constructor(p, duracao, intervalo, criarInimigoCallback) {
    this.p = p;
    this.duracao = duracao; 
    this.intervalo = intervalo; 
    this.criarInimigo = criarInimigoCallback;

    this.tempoInicio = p.millis();
    this.ultimoSpawn = p.millis();
  }  
  

  atualizar() {
    let agora = this.p.millis();
    let tempoDecorrido = agora - this.tempoInicio;

    
    if (tempoDecorrido < this.duracao) {
      if (agora - this.ultimoSpawn >= this.intervalo) {        
        //velocidadeInimigoGlobal += 0.1;        
        this.criarInimigo();
        this.ultimoSpawn = agora;        
      }
    }
  }

  progresso() {
    let agora = this.p.millis();
    return this.p.constrain((agora - this.tempoInicio) / this.duracao, 0, 1);
  }

  finalizado() {
    return this.p.millis() - this.tempoInicio >= this.duracao;
  }
}

class Imagem {
  constructor(p, caminho, x, y, largura, altura) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.w = largura;
    this.h = altura;
    this.img = null;
    this.carregado = false;

    p.loadImage(caminho, (img) => {
      this.img = img;
      this.carregado = true;
    });
  }

  desenhar() {
    if (this.carregado && this.img) {
      // Centraliza a imagem no ponto (x, y)
      this.p.image(this.img, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }
  }
}

class Som {
  constructor(p, caminho, loop = false) {    
    this.p = p;
    this.audio = p.loadSound(caminho);
    this.audio.setLoop(loop);
  }

  tocar() {
    if (this.audio && this.audio.isLoaded()) {
      this.audio.play();
    }
  }

  parar() {
    if (this.audio.isPlaying()) {
      this.audio.stop();
    }
  }

  estaTocando() {
    return this.audio.isPlaying();
  }

  volume(v) {
    this.audio.setVolume(v);
  }
}

function colisaoRetangular(jogador, inimigo) {
  return !(
    jogador.pos.x + jogador.img.w / 2 < inimigo.pos.x - inimigo.img.w / 2 ||
    jogador.pos.x - jogador.img.w / 2 > inimigo.pos.x + inimigo.img.w / 2 ||
    jogador.pos.y + jogador.img.h / 2 < inimigo.pos.y - inimigo.img.h / 2 ||
    jogador.pos.y - jogador.img.h / 2 > inimigo.pos.y + inimigo.img.h / 2
  );
}

let botoesUpgradeGlobais = [];
let velocidadeInimigoBase = 5;
let velocidadeInimigoGlobal = velocidadeInimigoBase;
let upgradesAplicados = {
  inimigoVel: 0
};
const Sketch = () => {
   useEffect(() => {
    let myP5;
    let telaAtual = 'menu';
    let telaObj = null;    
    let jogadorGlobal = null;
    let moedaGlobal = null;
    let interfaceGlobal = null;
    let areaGlobal = null;
    let inimigoGlobal = null;
    let musicaFundo;
    const sketch = (p) => {
      myP5 = p;    
      p.setup = () => {
        p.createCanvas(1200, 800);
        musicaFundo = new Som(p, 'sons/music.wav', true);     
        musicaFundo.volume(0.05);   
        mudarTela(telaAtual);

        //variáveis globais para não serem resetadas quando trocar de tela.
        jogadorGlobal = new Jogador(p); 
        moedaGlobal = new Moeda(p, jogadorGlobal);
        interfaceGlobal = new Interface(p,jogadorGlobal);
        areaGlobal = new Arena(p, p.width/2, p.height/2, 100, 100);  
        
        botoesUpgradeGlobais.push(          
          new botaoUpgrade(p, "+ Vida Max", p.width / 2 + 100 , p.height / 2 -100 , 200, 100, 3, 10,() =>{jogadorGlobal.vidaMax += 100;} ),
          new botaoUpgrade(p, "+ Velocidade", p.width / 2 - 100, p.height / 2 - 100, 200, 100, 3, 10,() =>{jogadorGlobal.velMax += 0.5;} ),
          new botaoUpgrade(p, "+ Tamanho da área", p.width / 2 - 100, p.height / 2, 200, 100, 3, 5,() => {areaGlobal.largura += 50; areaGlobal.altura += 50; areaGlobal.x -= 25; areaGlobal.y -= 25}),
          new botaoUpgrade(p, "- Velocidade dos \n inimigos", p.width / 2 - 100, p.height / 2 + 100, 200, 100, 3, 5,() => {upgradesAplicados.inimigoVel -= 0.5; velocidadeInimigoGlobal = velocidadeInimigoBase + upgradesAplicados.inimigoVel;}),
          new botaoUpgrade(p, "Barra de tempo", p.width / 2 - 100, p.height / 2 + 200, 200, 100, 1, 10,() => {interfaceGlobal.mostrar = true}),
        );         
        
       };
       
      const mudarTela = (novaTela) => {        
        telaAtual = novaTela;       
        
        if (novaTela === 'menu') {
          telaObj = new Menu(myP5, mudarTela);
        } else if (novaTela === 'sobre') {
          telaObj = new TelaSobre(myP5, mudarTela);
        }else if (novaTela === 'iniciar') {
          telaObj = new TelaIniciar(myP5, mudarTela, jogadorGlobal, botoesUpgradeGlobais, moedaGlobal, interfaceGlobal, areaGlobal);          
          musicaFundo.volume(0.05);  
          if (!musicaFundo.estaTocando()) {
            musicaFundo.tocar();  
          }                    
        }else if (novaTela === 'upgrade') {          
          musicaFundo.volume(0.00); 
          telaObj = new Upgrade(p, mudarTela, jogadorGlobal, inimigoGlobal, botoesUpgradeGlobais, moedaGlobal);          
        }else if (novaTela === 'final') {          
          musicaFundo.volume(0.00); 
          telaObj = new TelaFinal(p, mudarTela, jogadorGlobal);          
        }
      };

      p.draw = () => {           
        if (telaObj && telaObj.draw) {
          telaObj.draw();
        }         
      };

      p.mousePressed = () => {
        if (telaObj && telaObj.mousePressed) {
          telaObj.mousePressed();
        }
      };
    };

    const p5Instance = new window.p5(sketch, document.getElementById('p5-container'));

    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div id="p5-container"></div>;
};

export default Sketch;
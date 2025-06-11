import React, { useRef, useEffect } from 'react';
import 'p5/lib/addons/p5.sound';
import p5 from 'p5';

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

    this.posY = p.height; // começa fora da tela (embaixo)
    this.velocidade = 1;  // pixels por frame
  }

  draw() {
    this.fundo.desenhar();
    const p = this.p;
    p.fill(255);
    p.textSize(50);
    p.textAlign(p.CENTER, p.CENTER);
    // Desenha cada linha com espaçamento
    for (let i = 0; i < this.texto.length; i++) {
      let y = this.posY + i * 100;
      p.text(this.texto[i], p.width / 2, y);
    }

    this.posY -= this.velocidade; // faz o texto subir

    this.botaoVoltar.desenhar();
  }

  mousePressed() {
    this.botaoVoltar.checarClique();
  }
}

class Upgrade {
  constructor(p, mudarTela) {
    this.p = p;
    this.fundo = new Fundo(p, 150);
    this.botaoVoltar = new Botao(p, p.width - 100, 0, 100, 40, 'Voltar', () => mudarTela('iniciar'));    
    this.posY = p.height; // começa fora da tela (embaixo)
    this.velocidade = 1;  // pixels por frame
  }

  draw() {
    const p = this.p;  
    this.fundo.desenhar();
    p.fill(255);
    p.textSize(50);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("aaaaaaaaaaaa");
    this.botaoVoltar.desenhar();    
  }

  mousePressed() {
    this.botaoVoltar.checarClique();
  }
}

class TelaIniciar {
  constructor(p, mudarTela) {
    this.p = p;
    this.mudarTela = mudarTela;
    this.fundo = new Fundo(p, 150);   
    this.jogador = new Jogador(p);

    let destinoInicial = this.p.createVector(this.jogador.pos.x, this.jogador.pos.y);
    this.inimigos = [new Inimigo(p, destinoInicial)];
    
    this.arena = new Arena(p, p.width/2, p.height/2, 100, 100);
    this.interface = new Interface(p, this.jogador);

    this.spawnInimigo = new SpawnInimigo(
      p,
      5 * 60 * 1000, // duração total: 5 minutos
      2000,          // intervalo: a cada 2 segundos
      () => {
        if (this.jogador && this.jogador.pos) {
          // Cria um novo vetor com as mesmas coordenadas do jogador
          let destino = p.createVector(this.jogador.pos.x, this.jogador.pos.y);
          let inimigo = new Inimigo(p, destino);
          this.inimigos.push(inimigo);
        }
      }
    );    
  }    

  draw() {
    const p = this.p; 
    this.fundo.desenhar();
    this.arena.desenhar();
    this.arena.limitar(this.jogador.pos);     

    this.jogador.atualizar();
    this.jogador.desenhar();

    this.spawnInimigo.atualizar();
    this.interface.desenhar();
    
    // Atualiza e desenha os inimigos
    for (let i = this.inimigos.length - 1; i >= 0; i--) {
      let inimigo = this.inimigos[i];

      if (colisaoRetangular(this.jogador, inimigo)) {
        this.jogador.vidaAtual -= 20; // Dano por colisão
        // Colidiu, então remove o inimigo
        this.inimigos.splice(i, 1);
      }

      inimigo.atualizar(this.jogador.pos);
      inimigo.desenhar();
    }     
    if (this.jogador.vidaAtual <= 0) {
      this.mudarTela('upgrade'); // ou qualquer nome da tela inicial
    }
  }
}

class Jogador {
  constructor(p) {
    this.p = p;
    this.img = new Imagem(p, 'img/player.png', p.width / 2, p.height / 2, 45, 50);
    this.playerLife = new Imagem(p, 'img/playerLife.png', p.width / 2, p.height / 2, 45, 50);
    this.pos = p.createVector(p.width / 2, p.height / 2);  
    this.vel = p.createVector(0, 0);
    this.acel = p.createVector(0, 0);
    this.velMax = 1;
    this.acelMax = 10;
    this.xpAtual = 0;

    this.vidaMax = 50;
    this.vidaAtual = 50;
  }

  atualizar() {
    const alvo = this.p.createVector(this.p.mouseX, this.p.mouseY);
    const direcao = p5.Vector.sub(alvo, this.pos);
    
    // só acelera se estiver longe do mouse (evita tremedeira)
    if (direcao.mag() > 1) {
      direcao.normalize();
      direcao.mult(this.acelMax);
      this.acel = direcao;
      this.vel.add(this.acel);
      this.vel.limit(this.velMax);
      this.pos.add(this.vel);
    }

    // Atualiza posição da imagem
    this.img.x = this.pos.x;
    this.img.y = this.pos.y;

    this.playerLife.x = this.pos.x;
    this.playerLife.y = this.pos.y;
  }  

  desenhar() {
    this.img.desenhar();

    const proporcao = this.vidaAtual / this.vidaMax;
    this.playerLife.h = 50 * proporcao; // <-- ESSENCIAL
    this.playerLife.desenhar();
  }
}

class Interface {
  constructor(p, jogador) {
    this.p = p;
    this.jogador = jogador;

    this.barraXpFundo = new Imagem(p, 'img/XpFundo.png', 0, 0, 1000, 6);
    this.barraXpFrente = new Imagem(p, 'img/XpFrente.png', 0, 0, 0, 6); // largura inicial pequena

    this.posX = p.width / 2;
    this.posY = 20;
  }

  desenhar() {
    const p = this.p;

    // Desenha fundo
    this.barraXpFundo.x = this.posX;
    this.barraXpFundo.y = this.posY;
    this.barraXpFundo.desenhar();

    // Atualiza proporção e aplica na largura da frente
    const proporcao = this.jogador.xpAtual / this.jogador.xpMax;
    this.barraXpFrente.x = this.posX;
    this.barraXpFrente.y = this.posY;
    this.barraXpFrente.w = 1000 * proporcao + 1; // <-- ESSENCIAL
    this.barraXpFrente.desenhar();
  }
}

class Inimigo {
  constructor(p, destino) {
    this.p = p;
    this.img = new Imagem(p, 'img/enemy.png', p.width / 2, p.height / 2, 25, 25);let lado = p.random([ 'esquerda', 'direita' ]);

    //posição do spawn
    if (lado === 'esquerda') {
      this.pos = p.createVector(0, p.random(p.height));
    } else {
      this.pos = p.createVector(p.width, p.random(p.height));
    }
    this.destino = destino; // posição antiga do jogador
    this.vel = p5.Vector.sub(destino, this.pos).normalize().mult(3); // velocidade fixa em direção
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

class SpawnInimigo {
  constructor(p, duracao, intervalo, criarInimigoCallback) {
    this.p = p;
    this.duracao = duracao; // em milissegundos
    this.intervalo = intervalo; // em milissegundos
    this.criarInimigo = criarInimigoCallback;

    this.tempoInicio = p.millis();
    this.ultimoSpawn = p.millis();
  }  

  atualizar() {
    let agora = this.p.millis();
    let tempoDecorrido = agora - this.tempoInicio;

    if (tempoDecorrido < this.duracao) {
      if (agora - this.ultimoSpawn >= this.intervalo) {
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

  volume(v) {
    this.audio.setVolume(v);
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
    pos.x = this.p.constrain(pos.x, this.x + 23, this.x + this.largura - 23);
    pos.y = this.p.constrain(pos.y, this.y + 25, this.y + this.altura - 25);
  }

   expandir(delta) {
    // Expande a arena proporcionalmente e recentraliza
    this.largura += delta;
    this.altura += delta;
    this.x = (this.p.width - this.largura) / 2;
    this.y = (this.p.height - this.altura) / 2;
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

const Sketch = () => {
   useEffect(() => {
    let myP5;
    let telaAtual = 'menu';
    let telaObj = null;    

    const sketch = (p) => {
      myP5 = p;

      const mudarTela = (novaTela) => {
      telaAtual = novaTela;
      if (novaTela === 'menu') {
        telaObj = new Menu(myP5, mudarTela);
      } else if (novaTela === 'sobre') {
        telaObj = new TelaSobre(myP5, mudarTela);
      }else if (novaTela === 'iniciar') {
        telaObj = new TelaIniciar(myP5, mudarTela);
      }else if (novaTela === 'upgrade') {
        telaObj = new Upgrade(myP5, mudarTela);
      }
    };

      p.setup = () => {
        p.createCanvas(1250, 720);
        mudarTela(telaAtual); // inicia com a tela atual
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
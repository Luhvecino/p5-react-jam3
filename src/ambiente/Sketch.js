import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

class Fundo {
  constructor(p, cor) {
    this.p = p;
    this.cor = cor;
  }

  desenhar() {
    const p = this.p;
    // Exemplo: fundo com gradiente vertical
    for (let y = 0; y < p.height; y++) {
      let inter = p.map(y, 0, p.height, 0, 1);
      let c = p.lerpColor(p.color(30, 30, 80), p.color(50, this.cor, 150), inter);
      p.stroke(c);
      p.line(0, y, p.width, y);
    }
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
    this.fundo = new Fundo(p, 100);
    this.botaoVoltar = new Botao(p, p.width - 100, 0, 100, 40, 'Voltar', () => mudarTela('menu'));
    this.texto = [
      'Desenvolvedores',
      '',
      'Lucas Vecino Rodrigues',
      'aluno 2',
      'aluno 3',
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

class TelaIniciar {
  constructor(p, mudarTela) {
    this.p = p;
    this.fundo = new Fundo(p, 200);
    this.mudarTela = mudarTela;

    this.jogador = new Jogador(p);
    this.inimigos = [new Inimigo(p)]; // lista (para futuro)
    this.projeteis = [];

    this.tempoUltimoDisparo = 0;
    this.intervaloDisparo = 1000; // 10 segundos
    this.tempoInicio = p.millis();

    this.spawnInimigo = new SpawnInimigo(
      p,
      5 * 60 * 1000, // 5 minutos
      5000,          // a cada 5 segundos
      () => {
        this.inimigos.push(new Inimigo(p));
      }
    );
  }  

  draw() {
    const p = this.p;

    this.fundo.desenhar();
    this.jogador.desenhar();
    this.spawnInimigo.atualizar();

    // Atualiza e desenha os inimigos
    for (let inimigo of this.inimigos) {
      if (inimigo.estaVivo()) {
        inimigo.atualizar(this.jogador.pos);
        inimigo.desenhar();        
      }
    }    

    //encontra inimigo mais próximo
    if (this.inimigos.length > 0) {
      let alvo = encontrarInimigoMaisProximo(this.jogador, this.inimigos);
      this.jogador.disparar(alvo);
    }

    this.jogador.atualizarProjetis();  

    this.jogador.projeteis = this.jogador.projeteis.filter(p => !p.morto);

    this.inimigos = this.inimigos.filter(inimigo => inimigo.estaVivo());

    // Verifica colisões entre projeteis e inimigos
    for (let proj of this.jogador.projeteis) {            
      proj.verificarColisao(this.inimigos); 
      for (let inimigo of this.inimigos) {
        if (inimigo.estaVivo() && proj.pos.dist(inimigo.pos) < 20) {
          inimigo.tomarDano(25);
          proj.morto = true;
        }
      }
    }
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

class Jogador {
  constructor(p) {
    this.p = p;
    this.img = new Imagem(p, 'img/player.png', p.width / 2, p.height / 2, 45, 50);  
    this.pos = p.createVector(p.width / 2, p.height / 2);  
    this.intervaloDisparo = 1000; // 10 segundos
    this.tempoUltimoDisparo = p.millis();
    this.projeteis = []; // se quiser que o jogador carregue os projéteis
  }

  podeDisparar() {
    return this.p.millis() - this.tempoUltimoDisparo >= this.intervaloDisparo;
  }

  disparar(alvo) {
    if (this.podeDisparar() && alvo) {
      let proj = new ProjetilAteAlvo(this.p, this.pos.x, this.pos.y, alvo);
      this.projeteis.push(proj);
      this.tempoUltimoDisparo = this.p.millis();
    }
  }

  atualizarProjetis() {
    for (let proj of this.projeteis) {
      proj.atualizar();
      proj.desenhar();
    }
    this.projeteis = this.projeteis.filter(p => !p.morto);
  }

  desenhar() {
    this.img.desenhar();         
  }
}

class Inimigo {
  constructor(p) {
    this.p = p;
    this.pos = p.createVector(p.random(p.width), p.random(p.height));
    this.vel = p.createVector(0, 0);
    this.velMax = 0.1;
    this.vivo = true;

    this.vidaMax = 100;
    this.vida = 100;
    this.larguraBarra = 40;

    this.img = new Imagem(p, 'img/enemyG.gif', this.pos.x, this.pos.y, 45, 50); 
    this.barraFundo = new Imagem(p, 'img/barraFundo.png', this.pos.x, this.pos.y, 40, 5);
    this.barraFrente = new Imagem(p, 'img/barraFrente.png', this.pos.x, this.pos.y, 40, 5);
  }

  atualizar(alvo) {
    let direcao = p5.Vector.sub(alvo, this.pos);
    direcao.normalize();
    direcao.mult(0.5);
    this.vel.add(direcao);
    this.vel.limit(this.velMax);
    this.pos.add(this.vel);
     // Atualiza posição das barras
    this.barraFundo.x = this.pos.x;
    this.barraFundo.y = this.pos.y - 30;

    this.barraFrente.x = this.pos.x ;
    this.barraFrente.y = this.pos.y - 30;
  }

  desenhar() {
    // Atualiza a posição da imagem para seguir o vetor pos
    this.img.x = this.pos.x;
    this.img.y = this.pos.y;
    this.img.desenhar(); 
      
    this.barraFundo.x = this.pos.x;
    this.barraFundo.y = this.pos.y - 25;
    this.barraFundo.desenhar(); 
    
    this.barraFrente.x = this.pos.x;
    this.barraFrente.y = this.pos.y - 25;
    
    // Redimensiona barraFrente conforme a vida
    if (this.vida > 0){
       this.barraFrente.w = this.larguraBarra * (this.vida / this.vidaMax);
    }
   
    this.barraFrente.desenhar();
    
  }  
  tomarDano(valor) {
    this.vida -= valor;
    if (this.vida <= 0) {
      this.vida = 0;
      this.vivo = false;
    }
  }

  estaVivo() {
    return this.vida > 0;
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
    if (!this.audio.isPlaying()) {
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

class ProjetilAteAlvo {
  constructor(p, x, y, alvo) {
    this.p = p;
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(0, 0);
    this.velMax = 5;
    this.tamanho = 2;
    this.cor = [255, 255, 0];
    this.morto = false;
    this.alvo = alvo;
    this.rastro = [];

    // calcula direção inicial
    this.direcao = p.createVector(0, 0);
    if (alvo) {
      this.direcao = p5.Vector.sub(alvo.pos, this.pos);
      this.direcao.normalize();
    }
  }

  atualizar() {
    if (this.morto) return;

    // manter a direção mesmo que alvo morra
    this.vel = this.direcao.copy().mult(this.velMax);
    this.pos.add(this.vel);

    // adicionar ao rastro
    this.rastro.push(this.pos.copy());
    if (this.rastro.length > 10) {
      this.rastro.shift();
    }

    // se sair da tela, marcar como morto
    if (
      this.pos.x < 0 || this.pos.x > this.p.width ||
      this.pos.y < 0 || this.pos.y > this.p.height
    ) {
      this.morto = true;
    }
  }

  verificarColisao(inimigos) {
    for (let inimigo of inimigos) {
      if (inimigo.estaVivo() && this.pos.dist(inimigo.pos) < 20) {
        inimigo.tomarDano(25);
        this.morto = true;
        break;
      }
    }
  }

  desenhar() {
    // desenha rastro
    for (let i = 0; i < this.rastro.length; i++) {
      let alpha = this.p.map(i, 0, this.rastro.length, 50, 150);
      this.p.fill(this.cor[0], this.cor[1], this.cor[2], alpha);
      this.p.noStroke();
      this.p.rect(this.rastro[i].x, this.rastro[i].y, this.tamanho, this.tamanho);
    }

    // desenha o projétil
    this.p.fill(this.cor);
    this.p.noStroke();
    this.p.rect(this.pos.x, this.pos.y, this.tamanho, this.tamanho);
  }
}


function encontrarInimigoMaisProximo(jogador, inimigos) {
  let maisProximo = null;
  let menorDist = Infinity;

  for (let inimigo of inimigos) {
    let dist = jogador.pos.dist(inimigo.pos);
    if (dist < menorDist) {
      menorDist = dist;
      maisProximo = inimigo;
    }
  }

  return maisProximo;
}

export default function MenuComponent() {
  const sketchRef = useRef();

  useEffect(() => {
    let myP5;
    let telaAtual = 'menu';
    let telaObj;

    const mudarTela = (novaTela) => {
      telaAtual = novaTela;
      if (novaTela === 'menu') {
        telaObj = new Menu(myP5, mudarTela);
      } else if (novaTela === 'sobre') {
        telaObj = new TelaSobre(myP5, mudarTela);
      }else if (novaTela === 'iniciar') {
        telaObj = new TelaIniciar(myP5, mudarTela);
      }
    };

    const sketch = (p) => {
      myP5 = p;

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

    new p5(sketch, sketchRef.current);
    return () => {
      myP5.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
}

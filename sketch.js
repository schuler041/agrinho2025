//usei o chat gpt
let gameState = 'start'; // Pode ser 'start', 'game', ou 'end'
let player;
let obstacles = [];
let items = [];
let score = 0;
let timeLeft = 30;
let timer;
let startButton;

function setup() {
  createCanvas(800, 600);
  player = new Player();

  // Iniciar o botão de "Iniciar"
  startButton = createButton('Iniciar');
  startButton.position(width / 2 - 50, height / 2 + 100);
  startButton.mousePressed(startGame);
  
  // Criar obstáculos e itens
  for (let i = 0; i < 5; i++) {
    obstacles.push(new Obstacle());
    items.push(new Item());
  }
}

function draw() {
  if (gameState === 'start') {
    drawStartScreen();
  } else if (gameState === 'game') {
    drawGameScreen();
  } else if (gameState === 'end') {
    drawEndScreen();
  }
}

// Tela Inicial
function drawStartScreen() {
  background(135, 206, 250); // Céu
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("Campo e Cidade", width / 2, height / 3);

  textSize(24);
  text("Ajude o personagem a atravessar o campo e chegar à cidade.", width / 2, height / 2);
  text("Evite obstáculos e colete itens para ganhar pontos.", width / 2, height / 2 + 40);
  
  textSize(20);
  text("Pressione o botão abaixo para começar.", width / 2, height / 2 + 80);
}

// Tela de Jogo
function drawGameScreen() {
  background(120, 200, 80); // Cor do campo (verde)

  // Desenho do campo
  drawField();

  player.update();
  player.display();

  // Desenho dos obstáculos
  for (let obstacle of obstacles) {
    obstacle.update();
    obstacle.display();
    if (player.collidesWith(obstacle)) {
      endGame(); // Se colidir com um obstáculo, o jogo acaba
    }
  }

  // Desenho dos itens
  for (let item of items) {
    item.update();
    item.display();
    if (player.collects(item)) {
      score++;
      item.respawn();
    }
  }

  // Exibir a pontuação
  fill(0);
  textSize(32);
  text("Pontuação: " + score, 10, 30);
  text("Tempo: " + timeLeft, width - 100, 30);

  // Atualizar o tempo
  if (frameCount % 60 === 0 && timeLeft > 0) {
    timeLeft--;
  }
  
  if (timeLeft <= 0) {
    endGame(); // Fim do jogo
  }
}

// Tela Final
function drawEndScreen() {
  background(255, 0, 0); // Cor do fim de jogo (vermelho)
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("Fim de Jogo!", width / 2, height / 3);

  textSize(32);
  text("Sua Pontuação: " + score, width / 2, height / 2);
  textSize(24);
  text("Clique em qualquer lugar para reiniciar", width / 2, height / 2 + 40);
}

// Função para desenhar o campo
function drawField() {
  // Céu
  fill(135, 206, 250);
  rect(0, 0, width, height / 2); // Céu

  // Cidade
  fill(169, 169, 169); // Cor da cidade
  rect(0, 0, width, height / 2); // Cidade

  // Campo
  fill(34, 139, 34); // Cor do campo
  rect(0, height / 2, width, height / 2); // Campo
}

// Classe do jogador
class Player {
  constructor() {
    this.x = 50;
    this.y = height / 2 + 50;
    this.size = 30;
    this.speed = 5;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.speed;
    }

    // Limitar o movimento dentro da tela
    this.x = constrain(this.x, 0, width - this.size);
    this.y = constrain(this.y, height / 2, height - this.size);
  }

  display() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.size);
  }

  collidesWith(obstacle) {
    let d = dist(this.x, this.y, obstacle.x, obstacle.y);
    return d < (this.size / 2 + obstacle.size / 2);
  }

  collects(item) {
    let d = dist(this.x, this.y, item.x, item.y);
    return d < (this.size / 2 + item.size / 2);
  }
}

// Classe dos obstáculos
class Obstacle {
  constructor() {
    this.x = random(width / 2, width - 20);
    this.y = random(height / 2, height - 20);
    this.size = random(20, 50);
    this.speed = random(1, 3);
  }

  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = 0;
      this.x = random(width / 2, width - 20);
    }
  }

  display() {
    fill(0);
    ellipse(this.x, this.y, this.size);
  }
}

// Classe dos itens
class Item {
  constructor() {
    this.x = random(width / 2, width - 20);
    this.y = random(height / 2, height - 20);
    this.size = 20;
  }

  update() {
    // Os itens são estáticos por enquanto
  }

  display() {
    fill(255, 215, 0); // Cor do item (amarelo)
    ellipse(this.x, this.y, this.size);
  }

  respawn() {
    this.x = random(width / 2, width - 20);
    this.y = random(height / 2, height - 20);
  }
}

// Função para iniciar o jogo
function startGame() {
  gameState = 'game';
  startButton.hide();
  timeLeft = 30;
  score = 0;
}

// Função para encerrar o jogo
function endGame() {
  gameState = 'end';
  startButton.show();
  startButton.position(width / 2 - 50, height / 2 + 100);
  startButton.html('Reiniciar');
}

// Função para reiniciar o jogo
function mousePressed() {
  if (gameState === 'end') {
    startGame();
  }
}

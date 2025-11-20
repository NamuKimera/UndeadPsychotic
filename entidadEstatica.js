class EntidadEstatica extends GameObject {
  constructor(x, y, juego) {
    super(x, y, juego);
    this.radio = 20;
    this.sprite = null;
    this.render();
    this.body = null; // Cuerpo de Matter.js (inicialmente nulo)
    this.options = {};
    this.crearCuerpo();
  }

  calcularRadio() {
    this.radio = (this.sprite.width + Math.sqrt(this.sprite.height)) * 0.25;
  }

  crearCuerpo() {
    this.body = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, {
      isStatic: true, // Las entidades estáticas son estáticas
      ...this.options
    });
  }

  tick() { }
}
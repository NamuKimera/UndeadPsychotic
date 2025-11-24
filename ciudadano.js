class Ciudadano extends Persona {
  constructor(textureData, x, y, juego) {
    super(x, y, juego);
    this.cargarSpritesAnimados(textureData, 15);
    this.cambiarAnimacion("idleAbajo")
    this.ancho = 9;
    this.alto = 25;
    /*this.sprite.width = this.ancho;
    this.sprite.height = this.alto;*/
    this.crearCajitaDeMatterJS();
    this.asignarTarget({ posicion: { x: Math.random() * this.juego.width, y: Math.random() * this.juego.height } }); // Al usar el ancho y alto del juego los ciudadanos se mueven al azar
    console.log("Los Ciudadanos fueron insertados correctamente", textureData, x, y, juego)
  }

  tick() {
    super.tick()
    this.moverseUnaVezLlegadoAlObjetivo()
    this.noChocarConNingunaPared()
    this.retrocederSiChocoConAlgunaPared()
  }
}
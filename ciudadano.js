class Ciudadano extends Persona {
  constructor(textureData, x, y, juego) {
    super(x, y, juego);
    this.cargarSpritesAnimados(textureData, 15);
    this.cambiarAnimacion("idleAbajo")
    // console.log("Los Ciudadanos fueron insertados correctamente", textureData, x, y, juego)
    this.asignarTarget({ posicion: { x: Math.random() * this.juego.width, y: Math.random() * this.juego.height } }); // Al usar el ancho y alto del juego los ciudadanos se mueven al azar
  }

  tick() {
    super.tick()
    this.moverseUnaVezLlegadoAlObjetivo()
    this.noChocarConNingunaPared()
    this.aceleracion.x = 0;
    this.aceleracion.y = 0;
  }
}
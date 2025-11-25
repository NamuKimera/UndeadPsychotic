class Persona extends GameObject {
  spritesAnimados = {};
  keysPressed = {};
  constructor(x, y, juego) {
    super(x, y, juego);
    this.container.label = "persona - " + this.id;
    this.muerto = false;
    this.nombre = generateName();
    this.rateOfFire = 600; //medido en milisegundos
    this.ultimoGolpe = 0;
    this.vision = Math.random() * 400 + 400;
    this.fuerzaDeAtaque = 0.05 + Math.random() * 0.05;
    this.radio = 7 + Math.random() * 3;
    this.rangoDeAtaque = this.radio * 3;
    this.ancho = 9;
    this.alto = 25;
    this.crearCajitaDeMatterJS();
  }
  crearCajitaDeMatterJS() {
    this.persona = Matter.Bodies.rectangle(
      this.posicion.x,
      this.posicion.y,
      this.ancho * 0.8,
      this.alto * 0.8,
      { restitution: 0.1, friction: 0.1, frictionAir: 0.01 }
    );
    this.persona.angle = Math.random() * 3;
    Matter.Composite.add(this.juego.engine.world, [this.persona]);
  }
  // Método para mover la persona
  moverse(direction) {
    const speed = 5;
    let velocity = { x: 0, y: 0 };
    switch(direction) {
      case 'up': velocity.y = -speed; break;
      case 'down': velocity.y = speed; break;
      case 'left': velocity.x = -speed; break;
      case 'right': velocity.x = speed; break;
    }
    Matter.Body.setVelocity(this.persona, velocity);
  }

  // Método para retroceder (se llamará en el evento de colisión)
  retroceder(direction) {
    if (!this.body) return;
    const velocidadRetroceso = 5;
    switch (direction) {
      case 'left':
        Matter.Body.setVelocity(this.body, { x: velocidadRetroceso, y: 0 }); // Retroceder a la derecha
        break;
      case 'right':
        Matter.Body.setVelocity(this.body, { x: -velocidadRetroceso, y: 0 }); // Retroceder a la izquierda
        break;
      case 'up':
        Matter.Body.setVelocity(this.body, { x: 0, y: velocidadRetroceso }); // Retroceder hacia abajo
        break;
      case 'down':
        Matter.Body.setVelocity(this.body, { x: 0, y: -velocidadRetroceso }); // Retroceder hacia arriba
        break;
      default:
        Matter.Body.setVelocity(this.body, { x: 0, y: 0 }); // Detener si no hay dirección
    }
  }

  cambiarAnimacion(cual) {
    //hacemos todos invisibles
    for (let key of Object.keys(this.spritesAnimados)) {
      this.spritesAnimados[key].visible = false;
    }
    //y despues hacemos visible el q queremos
    this.spritesAnimados[cual].visible = true;
  }
  cargarSpritesAnimados(textureData, escala) {
    for (let key of Object.keys(textureData.animations)) {
      this.spritesAnimados[key] = new PIXI.AnimatedSprite(textureData.animations[key]);
      this.spritesAnimados[key].play();
      this.spritesAnimados[key].loop = true;
      this.spritesAnimados[key].animationSpeed = 0.1;
      this.spritesAnimados[key].scale.set(escala);
      this.spritesAnimados[key].anchor.set(1, 1);
      this.container.addChild(this.spritesAnimados[key]);
    }
  }
  cambiarDeSpriteAnimadoSegunAngulo() {
    //0 grados es a la izq, abre en sentido horario, por lo cual 180 es a la derecha
    //90 es para arriba
    //270 abajo
    if ((this.angulo > 315 && this.angulo < 360) || this.angulo < 45) {
      this.cambiarAnimacion("caminarDerecha");
      this.spritesAnimados.caminarDerecha.scale.x = -15;
    } else if (this.angulo > 135 && this.angulo < 225) {
      this.cambiarAnimacion("caminarDerecha");
      this.spritesAnimados.caminarDerecha.scale.x = 15;
    } else if (this.angulo < 135 && this.angulo > 45) {
      this.cambiarAnimacion("caminarArriba");
    } else {
      this.cambiarAnimacion("caminarAbajo");
    }
  }
  cambiarVelocidadDeAnimacionSegunVelocidadLineal() {
    const keys = Object.keys(this.spritesAnimados);
    for (let key of keys) {
      this.spritesAnimados[key].animationSpeed = this.velocidadLineal * 0.05 * this.juego.pixiApp.ticker.deltaTime;
    }
  }

  moverseUnaVezLlegadoAlObjetivo() {
    /*
      Con esto, los ciudadanos se mueven al azar por medio de un target, y con chanceDeCambiarAntesDeLlegar se calcula el porcentaje de cambiar de Target 
    */
    const chanceDeCambiarAntesDeLlegar = Math.random() < 0.01
    if (calcularDistancia(this.posicion, this.target.posicion) < 100 || chanceDeCambiarAntesDeLlegar) {
      this.asignarTarget({ posicion: { x: Math.random() * this.juego.width, y: Math.random() * this.juego.height } });
      // console.log("El Ciudadano llego al Target")
    }
  }

  meEstoyChocandoContraLaParedIzquierda1() {
    return intersectaLineaCirculo(this.posicion.x, this.posicion.y, 50, 510, 450, 100, 1080)
  }
  meEstoyChocandoContraLaParedIzquierda2() {
    return intersectaLineaCirculo(this.posicion.x, this.posicion.y, 50, 2410, 450, 2000, 1080)
  }
  meEstoyChocandoContraLaParedDerecha1() {
    return intersectaLineaCirculo(this.posicion.x, this.posicion.y, 50, 1400, 450, 1900, 1080)
  }
  meEstoyChocandoContraLaParedDerecha2() {
    return intersectaLineaCirculo(this.posicion.x, this.posicion.y, 50, 3300, 450, 3800, 1080)
  }
  meEstoyChocandoContraLaParedArriba1() {
    return intersectaLineaCirculo(this.posicion.x, this.posicion.y, 50, 510, 450, 1410, 450)
  }
  meEstoyChocandoContraLaParedArriba2() {
    return intersectaLineaCirculo(this.posicion.x, this.posicion.y, 50, 2410, 450, 3300, 450)
  }
  meEstoyChocandoContraLaParedAbajo1() {
    return intersectaLineaCirculo(this.posicion.x, this.posicion.y, 50, 0, 1080, 100, 1080)
  }
  meEstoyChocandoContraLaParedAbajo2() {
    return intersectaLineaCirculo(this.posicion.x, this.posicion.y, 50, 1900, 1080, 2010, 1080)
  }
  meEstoyChocandoContraLaParedAbajo3() {
    return intersectaLineaCirculo(this.posicion.x, this.posicion.y, 50, 3800, 1080, 3840, 1080)
  }
  meEstoyChocandoConAlgunaPared() {
    return this.meEstoyChocandoContraLaParedIzquierda1() || 
    this.meEstoyChocandoContraLaParedIzquierda2() || 
    this.meEstoyChocandoContraLaParedDerecha1() ||
    this.meEstoyChocandoContraLaParedDerecha2() ||
    this.meEstoyChocandoContraLaParedArriba1() ||
    this.meEstoyChocandoContraLaParedArriba2() ||
    this.meEstoyChocandoContraLaParedAbajo1() ||
    this.meEstoyChocandoContraLaParedAbajo2()||
    this.meEstoyChocandoContraLaParedAbajo3();
  }
  noChocarConLaParedIzquierda() {
    if (this.meEstoyChocandoContraLaParedIzquierda1() || this.meEstoyChocandoContraLaParedIzquierda2()) {
      this.velocidad.x = 100
      // console.log(this.nombre, "choco con pared izquierda")
    }
  }
  noChocarConLaParedDerecha() {
    if (this.meEstoyChocandoContraLaParedDerecha1() || this.meEstoyChocandoContraLaParedDerecha2()) {
      this.velocidad.y = 100
      // console.log(this.nombre, "choco con pared derecha")
    }
  }
  noChocarConLaParedArriba() {
    if (this.meEstoyChocandoContraLaParedArriba1() || this.meEstoyChocandoContraLaParedArriba2()) {
      this.velocidad.y = 100
      // console.log(this.nombre, "choco con pared arriba")
    }
  }
  noChocarConLaParedAbajo() {
    if (this.meEstoyChocandoContraLaParedAbajo()) {
      this.velocidad.y = -100
      // console.log(this.nombre, "choco con pared abajo")
    }
  }
  noChocarConNingunaPared() {
    this.noChocarConLaParedIzquierda()
    this.noChocarConLaParedDerecha()
    this.noChocarConLaParedArriba()
  }
  retrocederSiChocoConAlgunaPared() {
    if (this.meEstoyChocandoConAlgunaPared()) {
      this.retroceder();
      console.log(this.nombre, "retrocediendo por choque con pared")
    }
  }
  calcularAnguloYVelocidadLineal() {
    this.angulo = radianesAGrados(Math.atan2(this.velocidad.y, this.velocidad.x)) + 180;
    this.velocidadLineal = calcularDistancia(this.velocidad, { x: 0, y: 0 });
  }
  verificarSiEstoyMuerto() {
    if (this.vida <= 0) {
      this.morir();
      return;
    }
    this.vida += 0.0001;
    if (this.vida > this.vidaMaxima) this.vida = this.vidaMaxima;
  }
  quitarmeDeLosArrays() {
    this.juego.personas = this.juego.personas.filter((persona) => persona !== this);
    this.juego.policias = this.juego.policias.filter((persona) => persona !== this);
    this.juego.ciudadanos = this.juego.ciudadanos.filter((persona) => persona !== this);
    // console.log("quitarmeDeLosArrays", this.id);
  }
  morir() {
    if (this.muerto) return;
    this.container.label = "persona muerta - " + this.id;
    this.quitarSombra();
    this.quitarBarritaVida();
    this.sprite.loop = false;
    // Marcar como muerto PRIMERO para evitar que se actualice la barra durante el proceso
    this.muerto = true;
    // Limpiar la barra de vida DESPUÉS de marcar como muerto
    this.quitarmeDeLosArrays();
  }
  recibirDanio(danio, deQuien) {
    this.vida -= danio;
    this.juego.particleSystem.hacerQueLeSalgaSangreAAlguien(this, deQuien);
  }

  borrar() {
    this.juego.containerPrincipal.removeChild(this.container);
    this.quitarmeDeLosArrays();
    this.container.parent = null;
    this.container = null;
    this.sprite = null;
  }
  render() {
    super.render();
    this.cambiarDeSpriteAnimadoSegunAngulo()
    this.cambiarVelocidadDeAnimacionSegunVelocidadLineal();
    this.verificarSiEstoyMuerto();
  }
}
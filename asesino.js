class Asesino extends Persona {
  constructor(textureData, x, y, juego) {
    super(x, y, juego);
    // Configuración especial del protagonista
    this.vida = 10;
    this.vision = 100; // Visión ilimitada
    this.cargarSpritesAnimados(textureData, 15);
    this.cambiarAnimacion("idleAbajo")
    this.container.label = "prota";
    this.factorIrAlTarget = 0.5;
    this.distanciaAlTarget = Infinity;
    juego.targetCamara = juego.protagonista;
    // this.asignarTarget(this.juego.mouse);
    this.agregarEventListenersDelTeclado();
    this.assassinFSM = createFSM('idle', {
      'idle': {
        'moveUp': { target: 'movingUp', action: () => { this.cambiarAnimacion("caminarArriba") } },
        'moveDown': { target: 'movingDown', action: () => { this.cambiarAnimacion("caminarAbajo") } },
        'moveLeft': { target: 'movingLeft', action: () => { this.cambiarAnimacion("caminarDerecha") } },
        'moveRight': { target: 'movingRight', action: () => { this.cambiarAnimacion("caminarDerecha") } },
        'shoot': { target: 'shooting', action: () => console.log('Asesino disparando (desde idle)') }
      },
      'movingUp': {
        'stop': { target: 'idle', action: () => { this.cambiarAnimacion("idleAbajo") } },
        'shoot': { target: 'shooting', action: () => console.log('Asesino disparando (desde arriba)') },
        'moveUp': { target: 'movingUp', action: () => { this.cambiarAnimacion("caminarArriba") } },
        'moveDown': { target: 'movingDown', action: () => { this.cambiarAnimacion("caminarAbajo") } },
        'moveLeft': { target: 'movingLeft', action: () => { this.cambiarAnimacion("caminarDerecha") } },
        'moveRight': { target: 'movingRight', action: () => { this.cambiarAnimacion("caminarDerecha") } }
      },
      'movingDown': {
        'stop': { target: 'idle', action: () => { this.cambiarAnimacion("idleAbajo") } },
        'shoot': { target: 'shooting', action: () => console.log('Asesino disparando (desde abajo)') },
        'moveUp': { target: 'movingUp', action: () => { this.cambiarAnimacion("caminarArriba") } },
        'moveDown': { target: 'movingDown', action: () => { this.cambiarAnimacion("caminarAbajo") } },
        'moveLeft': { target: 'movingLeft', action: () => { this.cambiarAnimacion("caminarDerecha") } },
        'moveRight': { target: 'movingRight', action: () => { this.cambiarAnimacion("caminarDerecha") } }
      },
      'movingLeft': {
        'stop': { target: 'idle', action: () => { this.cambiarAnimacion("idleAbajo") } },
        'shoot': { target: 'shooting', action: () => console.log('Asesino disparando (desde izquierda)') },
        'moveUp': { target: 'movingUp', action: () => { this.cambiarAnimacion("caminarArriba") } },
        'moveDown': { target: 'movingDown', action: () => { this.cambiarAnimacion("caminarAbajo") } },
        'moveLeft': { target: 'movingLeft', action: () => { this.cambiarAnimacion("caminarDerecha") } },
        'moveRight': { target: 'movingRight', action: () => { this.cambiarAnimacion("caminarDerecha") } }
      },
      'movingRight': {
        'stop': { target: 'idle', action: () => { this.cambiarAnimacion("idleAbajo") } },
        'shoot': { target: 'shooting', action: () => console.log('Asesino disparando (desde derecha)') },
        'moveUp': { target: 'movingUp', action: () => { this.cambiarAnimacion("caminarArriba") } },
        'moveDown': { target: 'movingDown', action: () => { this.cambiarAnimacion("caminarAbajo") } },
        'moveLeft': { target: 'movingLeft', action: () => { this.cambiarAnimacion("caminarDerecha") } },
        'moveRight': { target: 'movingRight', action: () => { this.cambiarAnimacion("caminarDerecha") } }
      },
      'shooting': {
        'stopShooting': { target: 'idle', action: () => { this.cambiarAnimacion("idleAbajo") } }
      }
    });
    this.ancho = 10;
    this.alto = 25;
    /*this.sprite.width = this.ancho;
    this.sprite.height = this.alto;*/
    this.crearCajitaDeMatterJS();
    console.log("El Asesino fue insertado correctamente", textureData, x, y, juego);
  }
  actualizarMovimiento() {
    let direction = 'idle';
    if (this.keysPressed['ArrowUp'] || this.keysPressed['w']) {
      direction = 'movingUp';
      this.moverse('movingUp');
      console.log('Asesino moviéndose hacia arriba');
      console.log("El movimiento se actualizo");
    } else if (this.keysPressed['ArrowDown'] || this.keysPressed['s']) {
      direction = 'movingDown';
      this.moverse('movingDown');
      console.log('Asesino moviéndose hacia abajo');
      console.log("El movimiento se actualizo");
    } else if (this.keysPressed['ArrowLeft'] || this.keysPressed['a']) {
      direction = 'movingLeft';
      this.moverse('movingLeft');
      console.log('Asesino moviéndose hacia la izquierda');
      console.log("El movimiento se actualizo");
    } else if (this.keysPressed['ArrowRight'] || this.keysPressed['d']) {
      direction = 'movingRight';
      this.moverse('movingRight');
      console.log('Asesino moviéndose hacia la derecha');
      console.log("El movimiento se actualizo");
    }
    
    if (direction) {
      // this.moverse(direction);
      // Actualiza el estado de la FSM (la FSM manejará las animaciones)
      try {
        if (direction === 'up') {
          this.assassinFSM.dispatch('moveUp');
        } else if (direction === 'down') {
          this.assassinFSM.dispatch('moveDown');
        } else if (direction === 'left') {
          this.assassinFSM.dispatch('moveLeft');
        } else if (direction === 'right') {
          this.assassinFSM.dispatch('moveRight');
        }
      } catch (error) {
        // Si hay un error, probablemente ya estamos en ese estado
        console.warn('Error en FSM:', error.message);
      }
    } else {
      const currentState = this.assassinFSM.getCurrentState();
      if (currentState !== 'idle') {
        try {
          this.assassinFSM.dispatch('stop'); // Cambia el estado a 'idle' y la animación
        } catch (error) {
          console.warn('Error en FSM stop:', error.message);
        }
      }
    }
  }
  
  disparar(direction) {
    const projectile = Matter.Bodies.circle(this.body.position.x, this.body.position.y, 5, { restitution: 0.5});
    // Añadir el proyectil al mundo de Matter.js
    Matter.World.add(engine.world, projectile);
    const projectileSpeed = 10; // Ajusta la velocidad del proyectil según sea necesario
    switch (direction) {
      case 'up':
        Matter.Body.setVelocity(projectile, { x: 0, y: -projectileSpeed });
        break;
      case 'down':
        Matter.Body.setVelocity(projectile, { x: 0, y: projectileSpeed });
        break;
      case 'left':
        Matter.Body.setVelocity(projectile, { x: -projectileSpeed, y: 0 });
        break;
      case 'right':
        Matter.Body.setVelocity(projectile, { x: projectileSpeed, y: 0 });
        break;
      default:
        console.warn('Dirección inválida para disparar:', direction);
    }
    // Transicionar a 'shooting' o manejar el fin del disparo
    this.assassinFSM.dispatch('shoot');
    setTimeout(() => {this.assassinFSM.dispatch('stopShooting')}, 500); // El tiempo puede ser ajustado según la duración del disparo
  }

  tick() {
    super.tick()
    this.noChocarConNingunaPared()
    this.actualizarMovimiento(); // Actualiza el movimiento y la FSM
  }

  render(){
    super.render()
  }
}
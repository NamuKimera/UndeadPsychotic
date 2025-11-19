class Asesino extends Persona {
  keysPressed = [];
  constructor(textureData, x, y, juego) {
    super(x, y, juego);
    // Configuración especial del protagonista
    this.vida = 10;
    this.vision = 500; // Visión ilimitada
    this.cargarSpritesAnimados(textureData, 15);
    this.cambiarAnimacion("idleAbajo")
    this.container.label = "prota";
    this.factorIrAlTarget = 0.5;
    this.distanciaAlTarget = Infinity;
    juego.targetCamara = this.protagonista;
    this.asignarTarget(this.juego.mouse);
    this.registerEventListeners()
    this.assassinFSM = createFSM('idle', this.transiciones);
    this.transiciones = {
      'idle': {
        'moveUp': { target: 'movingUp', action: () => console.log('Asesino moviéndose hacia arriba') },
        'moveDown': { target: 'movingDown', action: () => console.log('Asesino moviéndose hacia abajo') },
        'moveLeft': { target: 'movingLeft', action: () => console.log('Asesino moviéndose hacia la izquierda') },
        'moveRight': { target: 'movingRight', action: () => console.log('Asesino moviéndose hacia la derecha') },
        'shoot': { target: 'shooting', action: () => console.log('Asesino disparando (desde idle)') }
      },
      'movingUp': {
        'stop': { target: 'idle', action: () => console.log('Asesino se detiene (arriba)') },
        'shoot': { target: 'shooting', action: () => console.log('Asesino disparando (desde arriba)') },
        'moveDown': { target: 'movingDown', action: () => console.log('Asesino cambiando de dirección hacia abajo') },
        'moveLeft': { target: 'movingLeft', action: () => console.log('Asesino cambiando de dirección hacia la izquierda') },
        'moveRight': { target: 'movingRight', action: () => console.log('Asesino cambiando de dirección hacia la derecha') }
      },
      'movingDown': {
        'stop': { target: 'idle', action: () => console.log('Asesino se detiene (abajo)') },
        'shoot': { target: 'shooting', action: () => console.log('Asesino disparando (desde abajo)') },
        'moveUp': { target: 'movingUp', action: () => console.log('Asesino cambiando de dirección hacia arriba') },
        'moveLeft': { target: 'movingLeft', action: () => console.log('Asesino cambiando de dirección hacia la izquierda') },
        'moveRight': { target: 'movingRight', action: () => console.log('Asesino cambiando de dirección hacia la derecha') }
      },
      'movingLeft': {
        'stop': { target: 'idle', action: () => console.log('Asesino se detiene (izquierda)') },
        'shoot': { target: 'shooting', action: () => console.log('Asesino disparando (desde izquierda)') },
        'moveUp': { target: 'movingUp', action: () => console.log('Asesino cambiando de dirección hacia arriba') },
        'moveDown': { target: 'movingDown', action: () => console.log('Asesino cambiando de dirección hacia abajo') },
        'moveRight': { target: 'movingRight', action: () => console.log('Asesino cambiando de dirección hacia la derecha') }
      },
      'movingRight': {
        'stop': { target: 'idle', action: () => console.log('Asesino se detiene (derecha)') },
        'shoot': { target: 'shooting', action: () => console.log('Asesino disparando (desde derecha)') },
        'moveUp': { target: 'movingUp', action: () => console.log('Asesino cambiando de dirección hacia arriba') },
        'moveDown': { target: 'movingDown', action: () => console.log('Asesino cambiando de dirección hacia abajo') },
        'moveLeft': { target: 'movingLeft', action: () => console.log('Asesino cambiando de dirección hacia la izquierda') }
      },
      'shooting': {
        'stopShooting': { target: 'idle', action: () => console.log('Asesino deja de disparar') }
      }
    }
    
    // console.log("El Asesino fue insertado correctamente", textureData, x, y, juego)
  }

  registerEventListeners() {
    document.addEventListener('keydown', (event) => {
      this.keysPressed[event.key] = true;
    });
    document.addEventListener('keyup', (event) => {
      this.keysPressed[event.key] = false;
    });
  }

  updateMovement() {
    if (keysPressed['ArrowUp'] || keysPressed['w']) {
      assassinFSM.dispatch('moveUp'); // Cambia el estado a 'moving'
      this.move('up'); // Mueve al asesino hacia arriba
    } else if (keysPressed['ArrowDown'] || keysPressed['s']) {
      assassinFSM.dispatch('moveDown');
      this.move('down');
    } else if (keysPressed['ArrowLeft'] || keysPressed['a']) {
      assassinFSM.dispatch('moveLeft');
      this.move('left');
    } else if (keysPressed['ArrowRight'] || keysPressed['d']) {
      assassinFSM.dispatch('moveRight');
      this.move('right');
    } else {
      assassinFSM.dispatch('stop'); // Detiene el movimiento
    }
  }

  shoot(direction) {
    // Crear proyectil en Matter.js y PixiJS
    const projectile = Matter.Bodies.circle(assassinBody.position.x, assassinBody.position.y, 5, {
      restitution: 0.5 // Puedes ajustar la restitución para el comportamiento del proyectil
    });
    // Añadir el proyectil al mundo de Matter.js
    Matter.World.add(engine.world, projectile);
    // Aplicar velocidad al proyectil según la dirección
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
    assassinFSM.dispatch('shoot'); // Cambiar el estado a 'shooting'
    // Opcional: Puedes agregar lógica para manejar el fin del disparo después de un breve tiempo
    setTimeout(() => {
      assassinFSM.dispatch('stopShooting'); // Regresar al estado idle después de disparar
    }, 500); // El tiempo puede ser ajustado según la duración del disparo
  }

  tick() {
    super.tick()
    this.noChocarConNingunaPared()
    // this.updateMovement(); // Actualiza el movimiento y la FSM
    // ... (resto del código de renderizado y actualización del motor)
    //Matter.Engine.update(engine);
  }
}
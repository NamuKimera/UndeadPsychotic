class Palmera extends EntidadEstatica {
    constructor(x, y, juego, scaleX, scaleY) {
        super(x, y, juego);
        this.radio = 20;
        this.scaleX = scaleX || 1;
        this.scaleY = scaleY || 1;
        this.container.label = "Palmera" + this.id;
        this.body = null;
        this.options = {};
        this.crearSprite();
        this.crearCuerpo();
    }

    async crearSprite() {
        this.sprite = new PIXI.Sprite(await PIXI.Assets.load("assets/palmera.png"));
        this.sprite.anchor.set(1, 1);
        this.container.addChild(this.sprite);
        this.sprite.scale.x = this.scaleX;
        this.sprite.scale.y = this.scaleY;
        this.container.zIndex = 1;
        this.render();
        console.log("La palmera se inserto correctamente")
    }

    crearCuerpo() {
        // Implementación básica (puede ser sobreescrita)
        this.body = Matter.Bodies.rectangle(this.x, this.y, 100, 600, this.options); // Ejemplo
    }

    tick(){
        super.tick();
        this.addToWorld(engine.world);
    }
}
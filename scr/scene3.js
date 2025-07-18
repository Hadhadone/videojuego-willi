// crear la segunda plantilla que diga lo que es head y body en html (Completado)
// hacer chicos todas las cosas para que el nivel se vea mejor
// crearle una hitbox a las plataformas de la imagen usando png sin nada y moviendo su setsize
// poner 2 pugs igualmente en este nivel
// mostrar de alguna forma la sintaxis que deve de llevar en html
// crear plataformas para subir y bajar
class scene3 extends Phaser.Scene {
    constructor(){
        super({key: "scene3"})
    }

    // carga de archivos
    preload(){

        // sprites principales
        this.load.image('sky','assets/sky.png');
        this.load.image('ground','assets/ground.png');
        this.load.image('text0','assets/hello.png');
        this.load.image('htmlhb','assets/headandbody.gif')

        // spritessheets
        this.load.spritesheet('duderr', 'assets/runr.png', { frameWidth: 250, frameHeight: 82 });
        this.load.spritesheet('dudeturn', 'assets/turn.png', { frameWidth: 250, frameHeight: 108 });
        this.load.spritesheet('duderl', 'assets/runl.png', { frameWidth: 250, frameHeight: 82 });
        this.load.spritesheet('door', 'assets/door.png', { frameWidth: 294, frameHeight: 210 });
        this.load.spritesheet('pug', 'assets/Pug.png', { frameWidth: 32, frameHeight: 32 });

    }

    // creacion de elementos en la pantalla
    create(){
        const contenidop = document.getElementById('contenidop');
        this.contador = 0;
        this.pugsT = 1;
        // creacion del cielo
        this.add.image(0, 0, 'sky').setOrigin(0, 0);
        this.add.image(420,300,'htmlhb').setScale(1.3)
        // creacion del suelo ademas de crear el arrow plaforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(0, 650, 'ground').setScale(1.85).setSize(0,115).setOffset(385,-25);
        this.platforms.create(-100, 805).setScale(1).setSize(320,135).setOffset(350,-510);
        this.platforms.create(265, 750).setScale(1).setSize(210,100).setOffset(350,-510);

        this.plataformaY = this.physics.add.image(100, 100, 'ground').setImmovable(true);
        this.plataformaY.setScale(0.5).setSize(300, 20);
        this.plataformaY.body.allowGravity = false;
        
        // Animación plataforma móvil
        this.tweens.add({
            targets: this.plataformaY,
            y: 500,
            ease: 'Linear',
            duration: 4000,
            yoyo: true,
            repeat: -1
        });
        // creamos un objeto inmovible para la puerta y poder interactuar con ella
        this.door = this.physics.add.sprite(750, 175, 'door').setImmovable(true);
        this.door.setScale(0.5);
        this.door.body.allowGravity = false;
        

        // creamos la posicion del personaje, aqui como no tengo un mainsprite use el de la derecha para comenzar el juego
        this.player = this.physics.add.sprite(0, 100, 'duderr');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);

        // creamos al pug como objeto coleccionable
        this.pug = this.physics.add.sprite(400, 574 , 'pug').setScale(1.5);
        this.pug.body.allowGravity = false;
        this.pug.setBounce(0);

        
        // aqui comenzamos a crear las animaciones de cada spritesheet
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('duderl', { start: 0, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: this.anims.generateFrameNumbers('dudeturn', { start: 0, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('duderr', { start: 0, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'openDoor',
            frames: this.anims.generateFrameNumbers('door', { start: 0, end: 3 }),
            frameRate: 11,
            repeat: 0
        });

        this.anims.create({
            key: 'pugAnim',
            frames: this.anims.generateFrameNumbers('pug', { start: 0, end: 3 }),
            frameRate: 11,
            repeat: -1
        });

        this.pug.anims.play('pugAnim', true);
        
        // creamos las conexiones de colision
        this.physics.add.collider(this.door, this.platforms);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.plataformaY);

        // Detectar cuando el jugador toca al pug
        this.physics.add.overlap(this.player, this.pug, this.collectpug, null, this);

        // creamos las teclas de movimiento
        this.cursor = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // definimos que la puerta esta cerrada
        this.doorOpened = false;

        // creamos una variable la cual se traducira a html
        contenidop.innerHTML = '<p class="mensaje">Pugs encontrados<br><b>' + this.contador + '/' + this.pugsT + '</b></p>';
    }

    update(){
        // movimientos del jugador
        if (this.cursor.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
            this.player.body.setSize(60, 80).setOffset(90, 15);
        } else if (this.cursor.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
            this.player.body.setSize(60, 80).setOffset(90, 15);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn', true);
            this.player.body.setSize(60, 80).setOffset(100, 30);
        }

        // salto
        if (this.cursor.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-300);
        }

        if (!this.doorOpened && Phaser.Math.Distance.Between(this.player.x, this.player.y, this.door.x, this.door.y) < 60 && Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            if (this.contador === this.pugsT) {
                this.doorOpened = true;
                this.door.play('openDoor');
                this.door.once('animationcomplete', () => {
                this.scene.start('scene2');
        })   }else{
            alert('no tienes los pugs suficientes')
        }
        
    }
        if (this.player.body.touching.down && this.plataformaY.body.touching.up && this.player.y < this.plataformaY.y) {
            this.player.y += this.plataformaY.body.velocity.y * this.game.loop.delta / 1000;
        }
    }
    // función para recolectar el pug
    collectpug(player, pug) {
        pug.disableBody(true, true);
        this.contador++;
        // creamos una variable la cual se traducira a html
        contenidop.innerHTML = '<p class="mensaje">Pugs encontrados<br><b>' + this.contador + '/' + this.pugsT + '</b></p>';
    };
}  


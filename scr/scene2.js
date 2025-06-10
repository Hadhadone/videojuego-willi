// Nivel 2 aqui lo que hare sera:
// hacer el personaje mas chico (terminado)
// hacer la puerta mas chica (terminado)
// mecanica de piso volador
// dos pugs escondidos
// la puerta estara hasta arriba esperamdo con el segundo pug
class scene2 extends Phaser.Scene {
    constructor(){
        super({key: "scene2"})
    }

    // carga de archivos
    preload(){

        // sprites principales
        this.load.image('sky','assets/sky.png');
        this.load.image('ground','assets/ground.png');
        this.load.image('text1','assets/whatshtml.png');

        // spritessheets
        this.load.spritesheet('duderr', 'assets/runr.png', { frameWidth: 250, frameHeight: 82 });
        this.load.spritesheet('dudeturn', 'assets/turn.png', { frameWidth: 250, frameHeight: 108 });
        this.load.spritesheet('duderl', 'assets/runl.png', { frameWidth: 250, frameHeight: 82 });
        this.load.spritesheet('door', 'assets/door.png', { frameWidth: 294, frameHeight: 210 });
        this.load.spritesheet('pug', 'assets/Pug.png', { frameWidth: 32, frameHeight: 32 });

    }

    // creacion de elementos en la pantalla
    create(){
        this.contenidop = document.getElementById('contenidop');
        this.contador = 0;
        this.pugsT = 2;
        // creacion del cielo
        this.add.image(0, 0, 'sky').setOrigin(0, 0);
        // creacion del suelo ademas de crear el arrow plaforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(0, 650, 'ground').setScale(1.85).setSize(0,115).setOffset(385,-25);
        // Creacion de las plataformas dinamicas, horizontal y vertical
        this.plataformaX = this.physics.add.image(300, 500, 'ground').setImmovable(true).setVelocityX(50);
        this.plataformaX.setScale(0.2).setSize(940,60).setOffset(0,0)
        this.plataformaX.body.allowGravity = false;
        // Tween para mover de un lado a otro
        this.tweens.add({
            targets: this.plataformaX,
            x: 500,               
            ease: 'Linear',
            duration: 2000,       
            yoyo: true,           
            repeat: -1           
        });
        this.plataformaY = this.physics.add.image(100, 500, 'ground').setImmovable(true).setVelocityY(50);
        this.plataformaY.setScale(0.2).setSize(940,60).setOffset(0,0)
        this.plataformaY.setImmovable(true);
        this.plataformaY.body.allowGravity = false;
        this.plataformaY2 = this.physics.add.image(750, 500, 'ground').setImmovable(true).setVelocityY(50);
        this.plataformaY2.setScale(0.2).setSize(940,60).setOffset(0,0)
        this.plataformaY2.setImmovable(true);
        this.plataformaY2.body.allowGravity = false;
        // Tween para mover de un lado a otro
        this.tweens.add({
            targets: this.plataformaY,
            y: 300,              
            ease: 'Linear',
            duration: 2000,       
            yoyo: true,           
            repeat: -1            
        });
        this.tweens.add({
            targets: this.plataformaY2,
            y: 225,              
            ease: 'Linear',
            duration: 2000,       
            yoyo: true,           
            repeat: -1            
        });
        // creacion del texto que dara la bienvenida al primer nivel
        this.add.image(400, 225, 'text1');

        
        // creamos un objeto inmovible para la puerta y poder interactuar con ella
        this.door = this.physics.add.sprite(700, 182, 'door').setImmovable(true);
        this.door.setScale(0.5);
        this.door.body.allowGravity = false;
        

        // creamos la posicion del personaje, aqui como no tengo un mainsprite use el de la derecha para comenzar el juego
        this.player = this.physics.add.sprite(0, 550, 'duderr').setScale(0.8);
        this.player.body.setGravityY(150);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0);

        // creamos al pug como objeto coleccionable
        this.pug = this.physics.add.sprite(800, 574 , 'pug').setScale(1);
        this.pug.body.allowGravity = false;
        this.pug.setBounce(0);
        this.pug2 = this.physics.add.sprite(100, 200 , 'pug').setScale(1);
        this.pug2.body.allowGravity = false;
        this.pug2.setBounce(0);

        
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
        this.pug2.anims.play('pugAnim', true);
        
        // creamos las conexiones de colision
        this.physics.add.collider(this.door, this.platforms);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.plataformaX);
        this.physics.add.collider(this.player, this.plataformaY);
        this.physics.add.collider(this.player, this.plataformaY2);


        // Detectar cuando el jugador toca al pug
        this.physics.add.overlap(this.player, this.pug, this.collectpug, null, this);
        this.physics.add.overlap(this.player, this.pug2, this.collectpug2, null, this);

        // creamos las teclas de movimiento
        this.cursor = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // definimos que la puerta esta cerrada
        this.doorOpened = false;

        // creamos una variable la cual se traducira a html
        this.contenidop.innerHTML = '<p class="mensaje">Pugs encontrados<br><b>' + this.contador + '/' + this.pugsT + '</b></p>';
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
                this.scene.start('scene3');
        })   }else{
            alert('no tienes los pugs suficientes')
        }
        
    }
    // Verificamos si el jugador está sobre la plataforma
        if (this.player.body.touching.down && this.plataformaY.body.touching.up && this.player.y < this.plataformaY.y) {
            this.player.y += this.plataformaY.body.velocity.y * this.game.loop.delta / 1000;
        }
        if (this.player.body.touching.down && this.plataformaX.body.touching.up && this.player.y < this.plataformaX.y) {
            this.player.x += this.plataformaX.body.velocity.x * this.game.loop.delta / 1000;
        }
    }
    // función para recolectar el pug
    collectpug(player, pug) {
        pug.disableBody(true, true);
        this.contador++;
        // creamos una variable la cual se traducira a html
        this.contenidop.innerHTML = '<p class="mensaje">Pugs encontrados<br><b>' + this.contador + '/' + this.pugsT + '</b></p>';
    };
    collectpug2(player, pug) {
        this.pug2.disableBody(true, true);
        this.contador++;
        // creamos una variable la cual se traducira a html
        this.contenidop.innerHTML = '<p class="mensaje">Pugs encontrados<br><b>' + this.contador + '/' + this.pugsT + '</b></p>';
    };
}  


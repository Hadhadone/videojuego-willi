// configuracion de la variable game
const config ={
    width: 850,
    height:650,
    parent: "container",
    type: Phaser.AUTO,
    mode: Phaser.Scale.FIT,  
    autoCenter: Phaser.Scale.CENTER_BOTH,
    scene: [scene1,scene2,scene3],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
}
// creacion de variable game (IMPORTANTE, NO BORRAR)
new Phaser.Game(config);

function cambiarEscena(nombreEscena) {
  // Iniciamos la escena deseada
  game.scene.start(nombreEscena);
}

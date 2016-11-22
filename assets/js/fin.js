// Estado final.

var winState = {

    preload: function(){
         saveWorld.load.image('findeljuego', 'assets/img/game/fin.png');
    },

    create: function () {
        // Agregar fondo
        saveWorld.add.sprite(0, 0, 'findeljuego');

        // teclaPresionada guarda la acción de presionar R para reanudar el juego
        var teclaPresionada = saveWorld.input.keyboard.addKey(Phaser.Keyboard.R);
        
        // Cuando presiona se cambia a esa acción
        teclaPresionada.onDown.addOnce(this.start, this);
    },
    
    update: function() {
        count = 0;
        // body...
    },

    // reinicia el juego   
    start: function () {
        saveWorld.state.start('juego');    
    }	
}
/* ********************************
   ********************************
Presentado por: Jhonn Alejandro Rojas Robayo
Codigo: 25571143
Correo: jharojasro@unal.edu.co
Universidad Nacional de Colombia

************************************
******************************** */

var estadoGanador = {

    preload: function(){
         dogWorld.load.image('findeljuego', 'assets/img/game/fin.png');
    },

    create: function () {
        // Agregar fondo
        dogWorld.add.sprite(0, 0, 'findeljuego');

        // teclaPresionada guarda la acción de presionar R para reanudar el juego
        var teclaPresionada = dogWorld.input.keyboard.addKey(Phaser.Keyboard.R);
        
        // Cuando presiona se cambia a esa acción
        teclaPresionada.onDown.addOnce(this.start, this);
    },
    
    update: function() {
        contador = 0;
    },

    // reinicia el juego   
    start: function () {
        dogWorld.state.start('juego');    
    }	
}

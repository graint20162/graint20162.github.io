/* ********************************
   ********************************
Presentado por: Jhonn Alejandro Rojas Robayo
Codigo: 25571143
Correo: jharojasro@unal.edu.co
Universidad Nacional de Colombia

************************************
******************************** */

// Se crea el lienzo donde se carga el juego
var dogWorld = new Phaser.Game(800, 300, Phaser.AUTO, 'entrenandoMascota');

// Se crean los estados del juego
dogWorld.state.add('juego',iniciar);
dogWorld.state.add('fin', estadoGanador);

// Se llama al primer estado
dogWorld.state.start('juego');

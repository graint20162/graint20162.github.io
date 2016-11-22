// Se crea el lienzo donde se carga el juego
var dogWorld = new Phaser.Game(800, 300, Phaser.AUTO, 'destruye');

// Se crean los estados del juego
dogWorld.state.add('juego',iniciar);
dogWorld.state.add('fin', winState);

// Se llama al primer estado
dogWorld.state.start('juego');
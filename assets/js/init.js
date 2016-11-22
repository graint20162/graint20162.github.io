// Se crea el lienzo donde se carga el juego
var saveWorld = new Phaser.Game(800, 300, Phaser.AUTO, 'destruye');

// Se crean los estados del juego
saveWorld.state.add('juego',iniciar);
saveWorld.state.add('fin', winState);

// Se llama al primer estado
saveWorld.state.start('juego');
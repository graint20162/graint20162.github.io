// Crea una nueva instancia llamada saveWorld de Phaser.game.
//var saveWorld = new Phaser.Game(850, 500, Phaser.AUTO, 'destruye', { preload: preload, create: create, update: update, render: render });
var ship;
var sky;
var cursors;
var count = 0;
var asteroid;
var max_asteroid = 10;

var iniciar = {
    //saveWorld.state.add('fin',winState);
    // Precarga los archivos
    preload: function() {
        saveWorld.load.image('stars', 'assets/img/game/space-2.jpg');
        saveWorld.load.spritesheet('ship', 'assets/img/game/humstar.png', 32, 32);
        saveWorld.load.image('asteroid', 'assets/img/game/Asteroid.png');
    },

    create: function() {
        //  Llama a una funcion que permite controlar las colisiones
        saveWorld.physics.startSystem(Phaser.Physics.P2JS);
        saveWorld.physics.p2.setImpactEvents(true);
        saveWorld.physics.p2.restitution = 0.8;
        //  Grupos de colisiones: uno para el jugador, otro para el asteroide
        var playerCollisionGroup = saveWorld.physics.p2.createCollisionGroup();
        var asteroidCollisionGroup = saveWorld.physics.p2.createCollisionGroup();
        //  Esto nos permite que colisionen con los limites del juego (850x500 en nuestro caso). 
        saveWorld.physics.p2.updateBoundsCollisionGroup();
        // Se agrega una variable llamada sky que contiene el fondo y la ubica en la posicion 0-0.
        sky = saveWorld.add.tileSprite(0, 0, 850, 500, 'stars');
        sky.fixedToCamera = true;
        // Añade un grupo de asteroides
        var asteroids = saveWorld.add.group();
        asteroids.enableBody = true;
        asteroids.physicsBodyType = Phaser.Physics.P2JS;
        // Crea hasta 10 asteroides.
        for (var i = 0; i < max_asteroid; i++)
        {
            asteroid = asteroids.create(saveWorld.world.randomX, saveWorld.world.randomY, 'asteroid');
            asteroid.body.setRectangle(40, 40);
            //  Cada asteroide se estrellará con los otros, por eso se colocan en el grupo de colisiones
            asteroid.body.setCollisionGroup(asteroidCollisionGroup);
            // esto permite que se colisionen con el hamster y los asteroides
            asteroid.body.collides([asteroidCollisionGroup, playerCollisionGroup]);
        }

        //  Crea el sprite de la nave del hamster
        ship = saveWorld.add.sprite(200, 200, 'ship');
        ship.scale.set(2);
        ship.smoothed = false;
        ship.animations.add('fly', [0,1,2,3,4,5], 10, true);
        ship.play('fly');

        saveWorld.physics.p2.enable(ship, false);
        ship.body.setCircle(28);
        ship.body.fixedRotation = true;

        //  Coloca la nave en el grupo de colisiones y llama a hitasteroid. 
        ship.body.setCollisionGroup(playerCollisionGroup);
        ship.body.collides(asteroidCollisionGroup, this.hitasteroid, this);

        saveWorld.camera.follow(ship);
        // Se inicializa cursors como una entrada de teclado
        cursors = saveWorld.input.keyboard.createCursorKeys();

    },

    // Esta funcion es llamada por ship y esto le permite golpear al asteroide
    hitasteroid: function(body1, body2) {
        // Destruye al asteroide
        body2.sprite.destroy();
        // Si el asteroide es golpeado suma el contador.
        count += 1;

        // Si destruye todos los asteriores, gana
        if(count == max_asteroid){
            saveWorld.state.start('fin');
        }
    },

    update: function() {
        // La nave es manejada por el usuario, y se debe mantener estatica si el usuario no hace nada.
        // Esta funcion le da cero velocidad.
        ship.body.setZeroVelocity();
        // Controlan los movimientos (isDown -> Si esta presionada la tecla)
        if (cursors.left.isDown)
        {
            ship.body.moveLeft(200);
        }
        else if (cursors.right.isDown)
        {
            ship.body.moveRight(200);
        }
        if (cursors.up.isDown)
        {
            ship.body.moveUp(200);
        }
        else if (cursors.down.isDown)
        {
            ship.body.moveDown(200);
        }

        if (!saveWorld.camera.atLimit.x)
        {
            sky.tilePosition.x += (ship.body.velocity.x * 16) * saveWorld.time.physicsElapsed;
        }

        if (!saveWorld.camera.atLimit.y)
        {
            sky.tilePosition.y += (ship.body.velocity.y * 16) * saveWorld.time.physicsElapsed;
        }

    },

    render: function() {
        // Dibuja el texto
        saveWorld.debug.text('¡Destruye los asteroides! - Asteroides destruidos: ' + count, 32, 32);
    },

    /*function win() {
        // body...
        if(count == 10){
            saveWorld.state.start('fin');
        }
    }*/
};

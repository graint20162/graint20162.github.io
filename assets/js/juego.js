/*
Variables a utilizar a lo largo de este juego
*/

var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
// carga el conjunto de huesos
var theBones;
var contador = 0;

var iniciar = {

    preload: function() {

        /*       
        Se añaden los diferentes recursos a utilizar a lo largo del juego.
        La primera carga hace referencia a un archivo .json que contiene la ubicación espacial de los diferentes objetos
        que hacen parte del entorno colisionable, estos son los distintos tipos de muro.

        Luego se cargan los personajes.
        */
        dogWorld.load.tilemap('level1', 'assets/gameAssets/level1.json', null, Phaser.Tilemap.TILED_JSON);
        dogWorld.load.image('tiles-1', 'assets/gameAssets/tiles-1.png');
        dogWorld.load.spritesheet('dude', 'assets/gameAssets/doggy.png', 32, 32);
        dogWorld.load.spritesheet('bone', 'assets/gameAssets/trainer.png', 32, 32);
        dogWorld.load.image('background', 'assets/gameAssets/background.png');
        dogWorld.load.image('flag', 'assets/gameAssets/flag.png');

    },

    create: function() {

        dogWorld.physics.startSystem(Phaser.Physics.ARCADE);

        dogWorld.stage.backgroundColor = '#000000';

        bg = dogWorld.add.tileSprite(0, 0, 800, 600, 'background');
        bg.fixedToCamera = true;

        map = dogWorld.add.tilemap('level1');

        map.addTilesetImage('tiles-1');

        map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

        layer = map.createLayer('Tile Layer 1');

        //  Un-comment this on to see the collision tiles
        // layer.debug = true;

        layer.resizeWorld();

        dogWorld.physics.arcade.gravity.y = 250;

        player = dogWorld.add.sprite(32, 32, 'dude');
        dogWorld.physics.enable(player, Phaser.Physics.ARCADE);

        //player.body.bounce.y = 0.2;
        player.body.collideWorldBounds = true;
        player.body.setSize(20, 32, 0, 0);

        player.animations.add('left', [12, 13, 14, 15], 10, true);
        player.animations.add('turn', [17], 20, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        // Esta función se encarga de seguir al jugador
        dogWorld.camera.follow(player);

        // Carga al entrenador Bone
        theBones = dogWorld.add.sprite(320, 976, 'bone');
        dogWorld.physics.enable(theBones, Phaser.Physics.ARCADE);

        //Permite colisiones con el mundo [recuadro]
        theBones.body.collideWorldBounds = true;
        theBones.body.setSize(40, 32, 0, 0);
        
        // De forma analoga se realiza de la misma forma con la bandera
        theFlag = dogWorld.add.sprite(820, 528, 'flag');
        dogWorld.physics.enable(theFlag, Phaser.Physics.ARCADE);
        theFlag.body.collideWorldBounds = true;
        theFlag.body.setSize(40, 32, 0, 0);

        //dogWorld.state.start('fin'); 

        cursors = dogWorld.input.keyboard.createCursorKeys();
        jumpButton = dogWorld.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    },

    collisionHandler: function() {
        if(Math.abs(player.x - theFlag.x) < 20 && Math.abs(player.y - theFlag.y) < 20){
	    	theFlag.destroy();
	    	// Se asigna un valor muy grande a las coordenadas de key para que no vuelva a entrar al if
	    	theFlag.y = 9999999;
	    	theFlag.x = 9999999;
		contador += 1;
        }
        
        /* Si hace contacto con la puerta y si recupera el total de llaves gana */
        if(player.x == 320 && player.y >= 976) {
		if(contador == 1){
			dogWorld.state.start('fin');
		}
        }
    },

    update: function() {

        dogWorld.physics.arcade.collide(player, layer);
        //dogWorld.physics.arcade.collide(op, layer);
        dogWorld.physics.arcade.collide(theBones, layer);
        dogWorld.physics.arcade.collide(theFlag, layer);
        //dogWorld.physics.arcade.collide(theBones);

        //dogWorld.physics.arcade.collide(player.sprite, theBones.sprite, collisionHandler, null, this);

        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
        player.animations.play('left');
        facing = 'left';
        }
        }
        else if (cursors.right.isDown)
        {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
        player.animations.play('right');
        facing = 'right';
        }
        }
        else
        {
        if (facing != 'idle')
        {
        player.animations.stop();

        if (facing == 'left')
        {
            player.frame = 0;
        }
        else
        {
            player.frame = 5;
        }

        facing = 'idle';
        }
        }

        if (jumpButton.isDown && player.body.onFloor() && dogWorld.time.now > jumpTimer)
        {
        player.body.velocity.y = -250;
        jumpTimer = dogWorld.time.now + 750;
        }
        
        this.collisionHandler();
    },



    render: function() {

    // dogWorld.debug.text(dogWorld.time.physicsElapsed, 32, 32);
    // dogWorld.debug.body(player);
    // dogWorld.debug.bodyInfo(player, 16, 24);

    /* Debug text permite imprimir encima del ambiente. La mayoria de posiciones logradas
        y la detección de colisiones se hicieron por medio de este debug. En este caso, se hizo para
        detectar cuando jugador y distraccion se cruzaban*/
        dogWorld.debug.text(" x: " + player.body.x, 32, 32);
        dogWorld.debug.text("y: " + player.body.y, 32, 64);
	    
	    
	if(contador == 1){
		dogWorld.debug.text("Puedes abrir la puerta", 32, 256);
	}
    },
    /*         dogWorld.state.start('fin');
    */

};

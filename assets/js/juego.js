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
        dogWorld.load.image('background', 'assets/gameAssets/background.png');

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

        dogWorld.camera.follow(player);

        //theBones = dogWorld.add.group();

        /*
        for (var i = 0; i < 5; i++)
        {
            var s = theBones.create(dogWorld.rnd.integerInRange(100, 700), dogWorld.rnd.integerInRange(32, 200), 'bone');
            //s.animations.add('spin', [0,1,2,3]);
            //s.play('spin', 20, true);
            dogWorld.physics.enable(s, Phaser.Physics.ARCADE);
            s.body.velocity.x = dogWorld.rnd.integerInRange(-200, 200);
            s.body.velocity.y = dogWorld.rnd.integerInRange(-200, 200);
        }
        */

        //  This will set physics properties on all group children that have a 'body' (i.e. it will skip the groupB)
        //theBones.setAll('body.collideWorldBounds', true);
        //theBones.setAll('body.bounce.x', 1);
        //theBones.setAll('body.bounce.y', 1);
        //theBones.setAll('body.minBounceVelocity', 0);


        theBones = dogWorld.add.sprite(320, 976, 'bone');
        dogWorld.physics.enable(theBones, Phaser.Physics.ARCADE);

        //player.body.bounce.y = 0.2;
        theBones.body.collideWorldBounds = true;
        theBones.body.setSize(40, 32, 0, 0);

        //dogWorld.state.start('fin'); 

        this.collisionHandler();

        cursors = dogWorld.input.keyboard.createCursorKeys();
        jumpButton = dogWorld.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    },


    collisionHandler: function() {
        if(player.body.x == (theBones.body.x + 16) && player.body.y == (theBones.body.y+16)){
            theBones.destroy();
        }
    },

    update: function() {

        dogWorld.physics.arcade.collide(player, layer);
        //dogWorld.physics.arcade.collide(op, layer);
        dogWorld.physics.arcade.collide(theBones, layer);
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

        /* Si hace contacto con la puerta y si recupera el total de llaves gana */
        if(player.x == 320 && player.y >= 976) {
                dogWorld.state.start('fin');
        }


    },



    render: function() {

    // dogWorld.debug.text(dogWorld.time.physicsElapsed, 32, 32);
    // dogWorld.debug.body(player);
    // dogWorld.debug.bodyInfo(player, 16, 24);

    /* Debug text permite imprimir encima del ambiente. La mayoria de posiciones logradas
        y la detección de colisiones se hicieron por medio de este debug. En este caso, se hizo para
        detectar cuando jugador y distraccion se cruzaban*/
        dogWorld.debug.text(" x: " + player.body.x , 32, 32);
        dogWorld.debug.text("y: " + player.body.y , 32, 64);

        if(player.x == 320 && player.y >= 976) {
                dogWorld.debug.text("LO encontraste" , 32, 128);
        }
    },
    /*         dogWorld.state.start('fin');
    */

};
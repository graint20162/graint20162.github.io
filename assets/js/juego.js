var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;

var iniciar = {

    preload: function() {

        saveWorld.load.tilemap('level1', 'assets/gameAssets/level1.json', null, Phaser.Tilemap.TILED_JSON);
        saveWorld.load.image('tiles-1', 'assets/gameAssets/tiles-1.png');
        saveWorld.load.spritesheet('dude', 'assets/gameAssets/dude.png', 32, 48);
        saveWorld.load.spritesheet('droid', 'assets/gameAssets/droid.png', 32, 32);
        saveWorld.load.image('starSmall', 'assets/gameAssets/star.png');
        saveWorld.load.image('starBig', 'assets/gameAssets/star2.png');
        saveWorld.load.image('background', 'assets/gameAssets/background2.png');

    },

    create: function() {

        saveWorld.physics.startSystem(Phaser.Physics.ARCADE);

        saveWorld.stage.backgroundColor = '#000000';

        bg = saveWorld.add.tileSprite(0, 0, 800, 600, 'background');
        bg.fixedToCamera = true;

        map = saveWorld.add.tilemap('level1');

        map.addTilesetImage('tiles-1');

        map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

        layer = map.createLayer('Tile Layer 1');

        //  Un-comment this on to see the collision tiles
        // layer.debug = true;

        layer.resizeWorld();

        saveWorld.physics.arcade.gravity.y = 250;

        player = saveWorld.add.sprite(32, 32, 'dude');
        saveWorld.physics.enable(player, Phaser.Physics.ARCADE);

        player.body.bounce.y = 0.2;
        player.body.collideWorldBounds = true;
        player.body.setSize(20, 32, 5, 16);

        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('turn', [4], 20, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        saveWorld.camera.follow(player);

        cursors = saveWorld.input.keyboard.createCursorKeys();
        jumpButton = saveWorld.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    },

    update: function() {

        saveWorld.physics.arcade.collide(player, layer);

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

        if (jumpButton.isDown && player.body.onFloor() && saveWorld.time.now > jumpTimer)
        {
        player.body.velocity.y = -250;
        jumpTimer = saveWorld.time.now + 750;
        }

    },

    render: function() {

    // saveWorld.debug.text(saveWorld.time.physicsElapsed, 32, 32);
    // saveWorld.debug.body(player);
    // saveWorld.debug.bodyInfo(player, 16, 24);

    },
    /*         saveWorld.state.start('fin');
    */

};
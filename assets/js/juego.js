/*
Variables a utilizar a lo largo de este juego
*/

var map; // Mapa
var tileset; // Patrones de imagenes
var layer; // Capa encima del fondo con el mapa
var player; // Dog
var facing = 'left'; // Fija la mira por defecto a la izquierda, porque el perro es una animación
var jumpTimer = 0; // Tiempo de salto
var cursors; // Para eventops de teclado
var jumpButton; //Cuando se mantiene presionado salto, puedee moverse a voluntad izquierda y derecha, saltando
var bg; // Fondo
var theBones; // ENtrenador
// Cuenta las banderas acumuladas por el perro
var contador = 0;

var iniciar = {

   /*Preload carga TODOS los recursos a utilizar a lo largo del juego*/
    preload: function() {

        /*       
        Se añaden los diferentes recursos a utilizar a lo largo del juego.
        La primera carga hace referencia a un archivo .json que contiene la ubicación espacial de los diferentes objetos
        que hacen parte del entorno colisionable, estos son los distintos tipos de muro.

        Luego se cargan los personajes. Dude hace referencia a la mascota, en este caso, un perro y Bone al dueño. FInalmente 
	se cargan el fondo y la bandera
        */
        dogWorld.load.tilemap('level1', 'assets/gameAssets/level1.json', null, Phaser.Tilemap.TILED_JSON);
        dogWorld.load.image('tiles-1', 'assets/gameAssets/tiles-1.png');
        dogWorld.load.spritesheet('dude', 'assets/gameAssets/doggy.png', 32, 32);
        dogWorld.load.spritesheet('bone', 'assets/gameAssets/trainer.png', 32, 32);
        dogWorld.load.image('background', 'assets/gameAssets/background.png');
        dogWorld.load.image('flag', 'assets/gameAssets/flag.png');

    },
	
    /* Create se encarga de crear todos los elementos cargados en preload en el escenario, en este caso llamado dogWorld
    */
    create: function() {
	// Crea un mundo colisionable
        dogWorld.physics.startSystem(Phaser.Physics.ARCADE);
	// SI no se cargara una imagen este seria el color de fondo
        dogWorld.stage.backgroundColor = '#000000';
	// Se carga la imagen al escenario
        bg = dogWorld.add.tileSprite(0, 0, 800, 600, 'background');
	    // Habilita los efectos de camara
        bg.fixedToCamera = true;
	// AHora, añade el laberinto. Este se realiza usando una herramienta llamada Tiled, que permite mover elementos
	// de lado a lado y crear así ambientes, como mapas, usando una imagen que contiene cuadros de patrones.
	// http://www.mapeditor.org/
        map = dogWorld.add.tilemap('level1');
	// El archivo anterior depende de la imagen que solicita tiles, puede verificarse en los assets.
        map.addTilesetImage('tiles-1');
        // Los tiles tienen una numeración cuando se exporta en los archivos que genera tiled. Entonces esos numeros corresponden
	 // a una imagen dentro del patron y estos son colisionables por los elementos cargados. (NO se sobreponen)
        map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
	// Se adapta el laberinto al mundo, usandolo como capa
        layer = map.createLayer('Tile Layer 1');
        layer.resizeWorld();
	// Y se le da gravedad gracias a la libreria ARCADE de Phaser
        dogWorld.physics.arcade.gravity.y = 250;
	// Se carga el perro y su ubicación en el laberinto
        player = dogWorld.add.sprite(32, 32, 'dude');
	// Se permite su uso en el ambiente de animación y queda habilitada su gravedad
        dogWorld.physics.enable(player, Phaser.Physics.ARCADE);
	// le dimos el nombre de player, entonces player puede colisionar con otros
        player.body.collideWorldBounds = true;
        player.body.setSize(20, 32, 0, 0);
	// Se añaden animaciones y las miradas de acuerdo a la dirección, los numeros son ubicaciones en el png cargado
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
        
        // De forma analoga se realiza de la misma forma con las banderas
        theFlag = dogWorld.add.sprite(820, 528, 'flag');
        dogWorld.physics.enable(theFlag, Phaser.Physics.ARCADE);
        theFlag.body.collideWorldBounds = true;
        theFlag.body.setSize(40, 32, 0, 0);

        theFlag2 = dogWorld.add.sprite(946, 144, 'flag');
        dogWorld.physics.enable(theFlag2, Phaser.Physics.ARCADE);
        theFlag2.body.collideWorldBounds = true;
        theFlag2.body.setSize(40, 32, 0, 0);

        theFlag3 = dogWorld.add.sprite(105, 896, 'flag');
        dogWorld.physics.enable(theFlag3, Phaser.Physics.ARCADE);
        theFlag3.body.collideWorldBounds = true;
        theFlag3.body.setSize(40, 32, 0, 0);

        theFlag4 = dogWorld.add.sprite(562, 848, 'flag');
        dogWorld.physics.enable(theFlag4, Phaser.Physics.ARCADE);
        theFlag4.body.collideWorldBounds = true;
        theFlag4.body.setSize(40, 32, 0, 0);

        theFlag5 = dogWorld.add.sprite(278, 560, 'flag');
        dogWorld.physics.enable(theFlag5, Phaser.Physics.ARCADE);
        theFlag5.body.collideWorldBounds = true;
        theFlag5.body.setSize(40, 32, 0, 0);

	// Se habilitan los eventos de teclado
        cursors = dogWorld.input.keyboard.createCursorKeys();
	    // EL boton de salto es la barra espaciadora
        jumpButton = dogWorld.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    },

 	/* Esta función permitira acumular las banderas por el perro, y decide si es valido 
	que pueda ir por el premio que da el dueño */
    recogerBanderas: function() {
	  // Para los if de ahora en adelante, cuando la difeencias en distancias entre la bandera y el perro
	    // sean muy pequeñas, puede cogerla y desaparece del laberinto
        if(Math.abs(player.x - theFlag.x) < 20 && Math.abs(player.y - theFlag.y) < 20){
	    	theFlag.destroy();
	    	// Se asigna un valor muy grande a las coordenadas de theFlag para que no vuelva a entrar al if
	    	theFlag.y = 9999999;
	    	theFlag.x = 9999999;
		// Suma al contador de banderas, que el perro acumula, cuando llegue a 5, termina
		contador += 1;
        }

        if(Math.abs(player.x - theFlag2.x) < 20 && Math.abs(player.y - theFlag2.y) < 20){
            theFlag2.destroy();
            // Se asigna un valor muy grande a las coordenadas de theFLag para que no vuelva a entrar al if
            theFlag2.y = 9999999;
            theFlag2.x = 9999999;
        contador += 1;
        }
        
        if(Math.abs(player.x - theFlag3.x) < 20 && Math.abs(player.y - theFlag3.y) < 20){
            theFlag3.destroy();
            // Se asigna un valor muy grande a las coordenadas de theFLag para que no vuelva a entrar al if
            theFlag3.y = 9999999;
            theFlag3.x = 9999999;
        contador += 1;
        }
        
         if(Math.abs(player.x - theFlag4.x) < 20 && Math.abs(player.y - theFlag4.y) < 20){
            theFlag4.destroy();
            // Se asigna un valor muy grande a las coordenadas de theFLag para que no vuelva a entrar al if
            theFlag4.y = 9999999;
            theFlag4.x = 9999999;
        contador += 1;
        }

         if(Math.abs(player.x - theFlag5.x) < 20 && Math.abs(player.y - theFlag5.y) < 20){
            theFlag5.destroy();
            // Se asigna un valor muy grande a las coordenadas de theFLag para que no vuelva a entrar al if
            theFlag5.y = 9999999;
            theFlag5.x = 9999999;
        contador += 1;
        }
        
        /* Si hace contacto con el entrenador y si tiene las 5 banderas llama al ultimo estado, si no, debe buscarlas todas */
        if(player.x == 340 && player.y >= 976) {
    		if(contador == 5){
    			dogWorld.state.start('fin');
    		} else {
    			dogWorld.debug.text("Busca las banderas, ¡chico!", 32, 256);
    		}
        }
    },

    update: function() {

        dogWorld.physics.arcade.collide(player, layer);
        //dogWorld.physics.arcade.collide(op, layer);
        dogWorld.physics.arcade.collide(theBones, layer);
        dogWorld.physics.arcade.collide(theFlag, layer);
        dogWorld.physics.arcade.collide(theFlag2, layer);
        dogWorld.physics.arcade.collide(theFlag3, layer);
        dogWorld.physics.arcade.collide(theFlag4, layer);
        dogWorld.physics.arcade.collide(theFlag5, layer);
        //dogWorld.physics.arcade.collide(theBones);

        //dogWorld.physics.arcade.collide(player.sprite, theBones.sprite, recogerBanderas, null, this);

        player.body.velocity.x = 0;

        if (cursors.left.isDown){
            player.body.velocity.x = -150;

            if (facing != 'left') {
                player.animations.play('left');
                facing = 'left';
            }
        }
        else if (cursors.right.isDown) {
            player.body.velocity.x = 150;

            if (facing != 'right')  {
                player.animations.play('right');
                facing = 'right';
            }
        }
        else {
            if (facing != 'idle')  {
                player.animations.stop();

                if (facing == 'left') {
                    player.frame = 0;
                }
                else {
                    player.frame = 5;
                }

            facing = 'idle';
            }
        }

        if (jumpButton.isDown && player.body.onFloor() && dogWorld.time.now > jumpTimer) {
        player.body.velocity.y = -250;
        jumpTimer = dogWorld.time.now + 750;
        }
        
        this.recogerBanderas();
    },



    render: function() {
    /* Debug text permite imprimir encima del ambiente. En este caso, se hizo para
        detectar cuando un jugador y las banderas se cruzaban*/
	    	    
        if(contador == 5){
        	dogWorld.debug.text("¡Bien! ¡Puedes ir con tu entrenador!", 32, 256);
        } else {
             dogWorld.debug.text(" Banderas recogidas: " + contador, 32, 32);
        }
    },

};

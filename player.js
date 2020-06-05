var angle = 0;
var zombie_dies = new Audio('audio/zombiedies.mp3');
var hero_touched = new Audio('audio/herotouched.mp3');
var fastZombieScream = new Audio('audio/zombiescream.mp3');
var country;

var score = 0;
var levelplayed = 1;
var finished = false;

function Game() {
	

    this.init = function(level) {
        this.bulletManager = BulletManager;
        this.zombieManager = ZombieManager;
        
        this.canvas = document.getElementById("cv");
		this.canvas.style.backgroundColor = "#222222";
		this.canvas.width  = 450 ;
		this.canvas.height = 300 ;
		this.ctxt = this.canvas.getContext('2d');
		this.resource_loaded = 0;
        this.total_resource = 2;
        this.level = level;
        this.setting_minblocksize 			= 32;
        

        this.bulletManager.canvas = this.canvas;
        this.bulletManager.ctxt = this.ctxt;

        this.zombieManager.ctxt = this.ctxt;

        this.setting_walking_speed          = 1.5;
		this.setting_walkcycle_interval     = 10;
        
        this.player = {};
        this.player.x       = 120;
        this.player.y       = 1180;
        this.player.width   = 64;
        this.player.height  = 64;
        this.player.framex  = 0;
        this.player.framey  = 2;
        this.player.control_direction 	= [0,0,0,0];
		this.player.tick = 0;
		this.player.walking = 0;
		this.player.direction = 2;
		this.player.angle = 0;
		this.player.lives = 3;
		this.player.dead = false;
		this.finishX = 0;
		this.finishY = 0;

		this.bulletManager.player = this.player;
		this.zombieManager.score = score;
		this.zombieManager.player = this.player;

		this.mug_duration = 0;
		this.mug_active = 0;

		this.mousepressed = false;

		this.player.box_collider = {}
		this.player.box_collider.width = 40;
		this.player.box_collider.height = 40;
        
        this.camera = {};
        this.camera.x = -this.canvas.width / 2;
		this.camera.y = -this.canvas.height / 2;

		this.bulletManager.camera = this.camera;
		this.zombieManager.camera = this.camera;

		this.load_resources();
		this.bind_keyboard_events();
		this.touchScreen_events();

		this.layer_zombies = null;

		this.bulletManager.zombieManager = this.zombieManager;

		
		
    }

    this.update_box_collider = function() {

		this.player.box_collider.x = this.player.x - 16;
		this.player.box_collider.y = this.player.y - 22;
		
	}



    this.load_resources = function(){
        var dw = this;  
        this.sprite_normal_player = new Image();
        this.sprite_normal_player.src = 'images/player_normal.png';
        this.sprite_normal_player.addEventListener('load', function() {
            dw.on_load_completed();
        }, false);
        
        this.sprite_zombie = new Image();
        this.sprite_zombie.src = 'images/enemy_normal.png';
        
        this.sprite_crawler = new Image();
        this.sprite_crawler.src = 'images/crawler.png';
        
        this.sprite_bloodstain = new Image();
        this.sprite_bloodstain.src = 'images/dead.png';
        
        this.sprite_boss = new Image();
        this.sprite_boss.src = 'images/bosssprite.png';


        this.zombieManager.sprite_zombie = this.sprite_zombie;
        this.zombieManager.sprite_bloodstain = this.sprite_bloodstain;
        this.zombieManager.sprite_crawler = this.sprite_crawler;
        this.zombieManager.sprite_boss = this.sprite_boss;
        
        console.log("Actual level : " + this.level);

        this.sprite_mug = new Image();
        this.sprite_mug.src = 'images/mug.png';

        this.mug_audio = new Audio('audio/deja-vu.mp3');
        this.hero_dies = new Audio('audio/herodies.mp3');


        this.sprite_hearth = new Image();
        this.sprite_hearth.src = 'images/hearth.png'

        this.loadJSON("maps/level" + this.level + ".json?",function(map){
        	dw.map = map;
        	dw.load_map_ressources();
        	dw.on_load_completed();
        }, false)

        

        

    }



    this.on_load_completed = function() {

        var dw = this;
        this.resource_loaded += 1;
        this.update_loading_screen();
        
        if ( this.resource_loaded == this.total_resource ) {
            console.log("Loading Completed");
            dw.on_timer();
        }

    }



	this.game_over = function(){
		this.ctxt.fillStyle = "black";
		this.ctxt.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctxt.fillStyle = "white";
		this.ctxt.font = "30px Gothic";
		document.getElementById("health").style.visibility = "hidden";
		document.getElementById("health").value = "1000";
		this.ctxt.fillText("GAME OVER", this.canvas.width /2 -90, (this.canvas.height/2) -60);
		this.ctxt.fillText("Score : " + this.zombieManager.score, this.canvas.width /2 -90, (this.canvas.height/2) -20);
		document.getElementById("retry").style.visibility = "visible";
		document.getElementById("finish").style.visibility = "visible";
		score = this.zombieManager.score;
        document.getElementById("enterName").style.visibility = "visible";
        document.getElementById("name").style.visibility = "visible";
        document.getElementById("up").style.visibility = "hidden";
        document.getElementById("down").style.visibility = "hidden";
        document.getElementById("left").style.visibility = "hidden";
        document.getElementById("right").style.visibility = "hidden";
        document.getElementById("fire").style.visibility = "hidden";
                
        
	}

	this.nextLevel = function(){
		this.ctxt.fillStyle = "black";
		this.ctxt.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctxt.fillStyle = "white";
		this.ctxt.font = "30px Gothic";
		document.getElementById("health").style.visibility = "hidden";
		document.getElementById("health").value = "1000";
		score = this.zombieManager.score;
        document.getElementById("up").style.visibility = "hidden";
        document.getElementById("down").style.visibility = "hidden";
        document.getElementById("left").style.visibility = "hidden";
        document.getElementById("right").style.visibility = "hidden";
        document.getElementById("fire").style.visibility = "hidden";
		if(levelplayed == 4){
			//DRAG AND DROP
            drag();
			//A IMPLEMENTER
			this.ctxt.fillText("Congratulations !", this.canvas.width /2 -90, this.canvas.height/2 -80);
			this.ctxt.fillText("Score : " + this.zombieManager.score , this.canvas.width /2 -90, this.canvas.height/2 - 50);
            
            localStorage.setItem( "maPosition", country );
            
            console.log("Position: " + country);
            localStorage.setItem( "finalScore", this.zombieManager.score );
            
        

		}else{
			this.ctxt.fillText("Well done !", this.canvas.width /2 -90, (this.canvas.height/2) -60);
			this.ctxt.fillText("Score : " + this.zombieManager.score , this.canvas.width /2 -90, this.canvas.height/2 -20);
			document.getElementById("next").style.visibility = "visible";
		}
		
	}


    this.update_loading_screen = function() {

        var percent_complete = ( this.resource_loaded * 100.0 / this.total_resource).toFixed(2);
        this.ctxt.clearRect( 0,0, this.canvas.width , this.canvas.height );
        this.ctxt.fillStyle = "white";
        this.ctxt.font = "14px Comic Sans MS";
        var msg = "Loading Resources . " + percent_complete + "% loaded";
        this.ctxt.fillText( msg , this.canvas.width / 2 - msg.length * 6 / 2 , this.canvas.height /2 );
    }


    this.on_timer = function() {
    	
	    // Update 
	     this.on_update();

	    // Draw
	    this.on_draw();
	    if(this.player.lives >0){
	    	if(this.player.x > (this.finishX-40) && this.player.x < (this.finishX+40) && this.player.y > (this.finishY-40) && this.player.y < (this.finishY+40)){
				 this.nextLevel();
				 document.removeEventListener("mousedown",clickFunction);
	    	}else{
	    		/*for(var i ; i< this.zombieManager.zombies.length; i++){
	    			if(this.zombieManager.zombies[i].type == 4 ){
	    				console.log("je suis 4");
	    				if(this.zombieManager.zombies[i].dead){
	    					console.log("et je suis mort");
	    					finished = true;
	    					this.nextLevel();
	    				}
	    				
	    			}
	    		}*/

	    		if(finished){
	    			this.nextLevel();
	    			document.removeEventListener("mousedown",clickFunction);

	    		}else{
	    			var dw = this;
			    	window.requestAnimationFrame( function() {
			        dw.on_timer();
			    	});
	    		}
	    		
	    		
		    	
	    	}

		    
		}else{
			console.log("END");
			this.player.dead = true;
			this.game_over();
			this.hero_dies.play();
			document.removeEventListener("mousedown",clickFunction);
		}
	}

	this.on_draw = function() {
    
	    // Clear the canvas
	    this.ctxt.clearRect( 0,0, this.canvas.width , this.canvas.height );


	    // Draw tiles
		

		var cam_tile_y = this.camera.y / this.setting_minblocksize >> 0;
		var cam_tile_x = this.camera.x / this.setting_minblocksize >> 0;
		var tilex_count = this.canvas.width / this.setting_minblocksize >> 0 ;
		var tiley_count = this.canvas.height / this.setting_minblocksize >> 0 ;

		if ( this.map.layers ) {
			for ( var layer = 0 ; layer < this.map.layers.length ; layer += 1 ) {

				for ( var i = cam_tile_y - 1; i < cam_tile_y + tiley_count + 2 ; i++ ) {
					for ( var j = cam_tile_x - 1; j < cam_tile_x + tilex_count + 2 ; j++ ) {

						var data =0;
						if ( i >= 0 && j >= 0 && i < this.map.layers[layer].height && j < this.map.layers[layer].width   ) {

							var data = this.map.layers[layer].data[ i * this.map.layers[layer].width + j ];

											

											for(var l =0; l< this.map.tilesets.length; l++){
												if(data<(this.map.tilesets[l].firstgid + this.map.tilesets[l].tilecount)){
													this.setting_bgtiles_x = this.map.tilesets[l].columns;

													var tile_framex = ((data-(this.map.tilesets[l].firstgid-1))-1) % this.setting_bgtiles_x ;
													var tile_framey = Math.floor(((data-(this.map.tilesets[l].firstgid-1))-1)/this.setting_bgtiles_x) ;
													var sprite = this.sprite_streets[l]; 
													break;
												}
												
											}
										

							

							if ( tile_framex >= 0 && tile_framey >= 0 ) {

								this.ctxt.drawImage( sprite , 
												this.setting_minblocksize * tile_framex,
												this.setting_minblocksize * tile_framey,
												this.setting_minblocksize,
												this.setting_minblocksize,
										(j * this.setting_minblocksize - this.camera.x ) >> 0, 
										(i * this.setting_minblocksize - this.camera.y ) >> 0,
										this.setting_minblocksize,
										this.setting_minblocksize 
											);

								


							}
					
						}	
					}
				}
			}
		}

		/*this.ctxt.drawImage(  this.sprite_mug , 
                              0 , 
                              0 , 
                              32 , 
                              32 , 
	                          (8 * 32 - this.camera.x) >> 0, 
	                       	  (33 * 32 -this.camera.y) >> 0 ,  
	                          32 , 
	                          32 );*/

		var j =10;
		for(var i = 0 ; i< this.player.lives ; i++){
			this.ctxt.drawImage(this.sprite_hearth, j , 10,15,15);
			j+=22;
		}

		/*if(this.mug_active ==1){
			this.ctxt.drawImage(this.sp)
		}*/

	    
	    //Draw bullets
	    this.bulletManager.render();
	    //Draw zombies
	    this.zombieManager.render();
	    //Draw player
	    this.drawRotated();
	    //Draw Score
	    this.ctxt.fillText("Score : " + this.zombieManager.score, 10, 50);
	    
	}

	this.getZombieLayer = function(){



		var zombies;

		for(var i =0; i<this.map.layers.length; i++){
				if(this.map.layers[i].name =='Enemy'){
					zombies = this.map.layers[i];
				}
			}

			this.layer_zombies = zombies;

			this.zombieManager.layer_zombies = zombies;

	}




	this.drawRotated = function(){
		//this.ctxt.clearRect(0,0,canvas.width,canvas.height);

	    // save the unrotated context of the canvas so we can restore it later
	    // the alternative is to untranslate & unrotate after drawing
	    this.ctxt.save();

	    // move to the center of the canvas
	   	this.ctxt.translate(this.canvas.width/2,this.canvas.height/2);

	    // rotate the canvas to the specified degrees
	    this.ctxt.rotate(angle);

	    // draw the image
	    // since the context is rotated, the image will be rotated also
	    this.ctxt.drawImage(  this.sprite_normal_player , 
                              this.player.width  * this.player.framex , 
                              this.player.height * this.player.framey , 
                              this.player.width , 
                              this.player.height , 
	                          -32, 
	                       	  -32 , 
	                          this.player.width , 
	                          this.player.height );

	    // we’re done with the rotating so restore the unrotated context
	    this.ctxt.restore();
		}

	this.on_update = function() {
	    this.update_player_action();
	    this.update_player_animation();
	    this.update_camera_position();
	    this.bulletManager.update();
	    this.zombieManager.update();
	}







		this.collide_with_wall = function(direction) {
			var pof_x = this.player.x;
			var pof_y = this.player.y;
			var layersolid;



			for(var i =0; i<this.map.layers.length; i++){
				if(this.map.layers[i].name =='Collision'){
					layersolid = this.map.layers[i];
				}
			}

			for(var i =0; i<layersolid.objects.length;i++){
				if(pof_x >= layersolid.objects[i].x && pof_x <= (layersolid.objects[i].x + layersolid.objects[i].width )){
					if(pof_y >= layersolid.objects[i].y && pof_y <= (layersolid.objects[i].y+ layersolid.objects[i].height)){
						switch(direction){
							case 0:
							//gauche
							if(pof_x < ((layersolid.objects[i].x + layersolid.objects[i].width) + this.setting_walking_speed) && pof_x > ((layersolid.objects[i].x  + layersolid.objects[i].width) - this.setting_walking_speed) )
								return 1;
							break;
							case 1:
							//haut
							if(pof_y < ((layersolid.objects[i].y + layersolid.objects[i].height) + this.setting_walking_speed) && pof_y > ((layersolid.objects[i].y  + layersolid.objects[i].height) - this.setting_walking_speed) )
								return 1;
							break;
							case 2:
							//droite
							if(pof_x < (layersolid.objects[i].x + this.setting_walking_speed) && pof_x > (layersolid.objects[i].x - this.setting_walking_speed) )
								return 1;
							break;
							case 3:
							//bas
							if(pof_y < (layersolid.objects[i].y + this.setting_walking_speed) && pof_y > (layersolid.objects[i].y - this.setting_walking_speed) )
								return 1;
							break;
						}
					}
				}
			}

			
		
		
		return 0;	
	}	






	this.update_camera_position = function() {
		
		//this.camera.x = this.player.x - this.canvas.width / 2 ;
		//this.camera.y = this.player.y - this.canvas.height / 2;

		
		var camera_target_x = this.player.x - this.canvas.width / 2  ;
		this.camera.x += (( camera_target_x - this.camera.x ) / 10 >> 0 );

		var camera_target_y = this.player.y - this.canvas.height / 2 ;
		this.camera.y +=  (( camera_target_y - this.camera.y ) / 10 >> 0 ); 
				
	}

	var value = 0;

	function loading1() {
    	setTimeout(function(){
        	if (value >0 )
        		value --;
    		}, 6500);
		}


	this.update_player_action = function() {

		var posX;
        var posY;
        var playerPosX = this.ctxt.canvas.width/2;
        var playerPosY = this.ctxt.canvas.height/2;



        this.ctxt.canvas.onmousemove = function(e){
            posX = e.clientX;
            posY = e.clientY;
            angle = Math.atan2(posY - playerPosY, posX - playerPosX);

        }
        if(value ==5)
        loading1();
  		if(value ==0 ){
  			this.setting_walking_speed = 1.5;
  			active = false;
  		}
       
        this.player.angle = Math.round(angle);
        /*if(this.player.x <= 288 + 32 && this.player.x >= 288 - 32)
        	if(this.player.y <= 1061 + 32 && this.player.y >= 1061 - 32){
        		this.mug_audio.play();
        		this.setting_walking_speed = 5.5;
        		value = 5;
        		
        	}*/

        	
        	

		if ( this.player.control_direction[1] == 1 ) {

			var excess 	= this.collide_with_wall(1) ;

				if(this.player.y > this.player.width/2 && excess ==0 ){
					this.player.y -=  this.setting_walking_speed;
					this.player.walking = 1;
				}
				
				this.player.direction = 1;
				
		}

		if ( this.player.control_direction[3] == 1 ) {
				var excess 	= this.collide_with_wall(3) ;
				if(this.player.y + this.player.box_collider.height < 1280 && excess ==0){
					this.player.y +=  this.setting_walking_speed;
					this.player.walking = 1;
				}

				this.player.direction = 3;
				
		}	

		this.player.walking = 0;
		if ( this.player.control_direction[0] == 1 ) {
			var excess 	= this.collide_with_wall(0) ;

			if ( this.player.x   > this.player.width/2 && excess ==0) {	
					this.player.x -=  this.setting_walking_speed;
					this.player.walking = 1;
			}

			this.player.direction = 0;
				

		} else if ( this.player.control_direction[2] ==1) {
			var excess 	= this.collide_with_wall(2) ;

			if(this.player.x  < 1250 && excess ==0){
				this.player.x += this.setting_walking_speed;
				this.player.walking = 1;
			}

			this.player.direction = 2;
			
		} 
	}




	this.update_player_animation = function() {
    
    // Walking frames

	    if ( this.player.walking > 0 ) {
	        
	            
	            
	            if ( this.player.tick >  this.setting_walkcycle_interval ) {
	                this.player.framex  = (this.player.framex + 1 ) % 20 ;
	                this.player.tick = 0;
	            }
	        
	    }


    // Idling frames
    	if ( this.player.walking == 0 ) {


			this.player.framex = this.player.framex % 20;
				
			if ( this.player.tick > 1 ) {

					this.player.framex  = (this.player.framex + 1 ) % 20 ;
					this.player.tick = 0;

			}
			
		}
		this.player.tick += 1;	


	}

		//Controls with phone buttons
    
    this.touchScreen_events = function(){
        var dw = this;
          document.getElementById("up").addEventListener("touchstart", function(evt){
            dw.on_buttonClicked(1);
            angle = -Math.PI/2;    
        });   
        
          document.getElementById("left").addEventListener("touchstart", function(evt){
            dw.on_buttonClicked(0); 
            angle = Math.PI;            
        });  
        
        document.getElementById("down").addEventListener("touchstart", function(evt){
            dw.on_buttonClicked(3); 
            angle = Math.PI/2;            
        });   
        
          document.getElementById("right").addEventListener("touchstart", function(evt){
            dw.on_buttonClicked(2);
            angle = 0;     
        }); 

        
          document.getElementById("up").addEventListener("touchend", function(evt){
            dw.on_buttonReleased(1);
        }); 
        
        document.getElementById("left").addEventListener("touchend", function(evt){
            dw.on_buttonReleased(0);
        }); 
        
          document.getElementById("down").addEventListener("touchend", function(evt){
            dw.on_buttonReleased(3);
        }); 
        
        document.getElementById("right").addEventListener("touchend", function(evt){
            dw.on_buttonReleased(2);
        }); 
    }
    
    this.on_buttonClicked = function(evt){
        
        this.player.control_direction[evt] = 1 ;

    }
    
    this.on_buttonReleased = function(evt){

    this.player.control_direction[evt] = 0 ;

    }

	//Controls with WASD

	this.bind_keyboard_events = function() {
	    var dw = this;
	    document.addEventListener("keydown" , function( evt ) {
	        dw.on_keyDown( evt );
	    }, false ); 
	    document.addEventListener("keyup"   , function( evt ) {
	        dw.on_keyUp( evt );
	    }, false ); 
	}
	//When buttons are pushed
	this.on_keyDown = function( evt ) {
		var keyCode = evt.which?evt.which:evt.keyCode; 
    	keyCode = this.wasd_to_arrow(keyCode);

    	if ( keyCode >= 37 && keyCode <= 40 ) {
        	this.player.control_direction[ keyCode - 37 ] = 1 ;
    	} 
	}   

	//When buttons are released
	this.on_keyUp = function( evt ) {
		var keyCode = evt.which?evt.which:evt.keyCode; 
    	keyCode = this.wasd_to_arrow(keyCode);

    	if ( keyCode >= 37 && keyCode <= 40 ) {
        	this.player.control_direction[ keyCode - 37 ] = 0 ;
    	}
	}

	this.wasd_to_arrow = function( keyCode ) {

	    var newKeyCode = keyCode ;
	    if ( keyCode == 65 ) { newKeyCode = 37; }
	    if ( keyCode == 68 ) { newKeyCode = 39; }
	    if ( keyCode == 87 ) { newKeyCode = 38; }
	    if ( keyCode == 83 ) { newKeyCode = 40; }
	    return newKeyCode;
	}




	this.loadJSON = function( path, success, error ) {
    
    	var xhr = new XMLHttpRequest();
    	xhr.onreadystatechange = function() {
        	if (xhr.readyState === XMLHttpRequest.DONE) {
            	if (xhr.status === 200) {
                	if (success)
                    	success(JSON.parse(xhr.responseText));
            		} else {
                		if (error)
                    		error(xhr);
            		}
        	}
    	};
    	xhr.open("GET", path, true);
    	xhr.send();
	}

	//ATTENTION
	// Each map has different png for bgtiles, objtiles and monsters .. load based on map
	this.load_map_ressources = function() {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
	
		var dw = this;
		var imagePath = "images/tiles";

		/*for ( var i = 0 ; i <  this.map.tilesets.length ; i++ ) {
			console.log(this.map.tilesets[i].name);
			console.log(this.map.tilesets.length);
			console.log(this.map.tilesets[i].name == 'road');
			if ( this.map.tilesets[i].name == 'road' ) {

				// Tiles
				this.sprite_streets = new Image();
				console.log(this.map.tilesets[i].name);
				this.sprite_streets.src = imagePath + "/" + this.map.tilesets[i].image;
				this.sprite_streets.addEventListener('load', function() {
					dw.on_load_completed();
				},false);
			} 
		}*/
		this.getZombieLayer();

		if(levelplayed == 4){
			document.getElementById("health").style.visibility = "visible";
		}
		
		
		for(var i =0; i<this.map.layers.length; i++){
			if(this.map.layers[i].name =='Collision'){
				this.bulletManager.collision = this.map.layers[i];
				this.zombieManager.collision = this.map.layers[i];
			}
		}
		var trigger;

		for(var i =0; i<this.map.layers.length; i++){
			if(this.map.layers[i].name =='Trigger'){
				trigger = this.map.layers[i];
			}
		}

		for(var i =0; i<trigger.objects.length; i++){
			if(trigger.objects[i].name =='Spawn'){
				this.player.x = trigger.objects[i].x;
				this.player.y = trigger.objects[i].y;
				console.log(this.x + " " + this.y);
			}
			
			if(trigger.objects[i].name =='End'){
				this.finishX = trigger.objects[i].x;
				this.finishY = trigger.objects[i].y;
				
			}
		}


		this.zombieManager.create();

		this.sprite_streets = [];


		// load images for tileset
		for (var i = 0; i < this.map.tilesets.length; i++) {
			console.log(i);
			this.sprite_streets[i] = new Image();
			this.sprite_streets[i].src = imagePath + "/" + this.map.tilesets[i].image; //this.baseName( this.map.tilesets[i].image)
			this.sprite_streets[i].addEventListener('load', function() {
				dw.on_load_completed();
			},false);
		   
		}


		// Create a map of layer name to layer index for easy lookup
		this.layer_id = {};
		for ( var i = 0 ; i < this.map.layers.length ; i++ ) {
			this.layer_id[ this.map.layers[i].name ] = i;
		}
		console.log("Nombre de layers : " + this.map.layers.length);

		// Get how many tile items per row
		this.setting_minblocksize  	= this.map.tilesets[1].tilewidth;
		//this.setting_bgtiles_x 		= this.map.tilesets[ this.layer_id["Street"] ].imagewidth /  this.setting_minblocksize;

	}


	// Util functions
	this.baseName = function(str) {
		var base = new String(str).substring(str.lastIndexOf('/') + 1); 
		return base;
	

	}

	this.rand = function( x ) {

		return Math.random() * x >> 0;

	}

	this.clone = function(obj) {

	    if(obj == null || typeof(obj) != 'object')
	        return obj;

	    var temp = {};// changed

	    for(var key in obj) {
	        if(obj.hasOwnProperty(key)) {
	            
	            if ( key == "properties" ) {
	            	temp[key] = {}
	            	for ( var property in obj[key] ) {
	            		temp[key][property] = obj[key][property];
	            	}
	            } else {
	            	temp[key] = obj[key];
	        	}
	        }
	    }
	    return temp;
	}


	




	var Bullet = function(i,canvas,ctxt,collision,player,camera,zombieManager){
    this.indexBullet = this.i;
    this.vectorX = Math.sin(angle + 90 * Math.PI/180);
    this.vectorY = -Math.cos(angle + 90 * Math.PI/180);
    this.x = canvas.width/2;
    this.y = canvas.height/2;
    this.sprite_bullet = new Image();
    this.sprite_bullet.src = 'images/bullet1.png'; 
    //bounds
    this.markToDelete = false;


    this.collide_with_wall_bullet = function(x,y) {

    for(var k =0; k<collision.objects.length;k++){
	   if((x+camera.x) >= collision.objects[k].x && (x+camera.x) <= (collision.objects[k].x + collision.objects[k].width )){
           if((y+camera.y )>= collision.objects[k].y && (y+camera.y) <= (collision.objects[k].y+ collision.objects[k].height)){           
               return true;
           		}
       		}
    	}    
    	return false;	
	}

	this.collide_with_zombies = function(){
		for(var i =0; i<zombieManager.zombies.length;i++){
			if(!zombieManager.zombies[i].dead){
				if(zombieManager.zombies[i].type == 4){
					if((this.x +camera.x) >= (zombieManager.zombies[i].x) && (this.x +camera.x) <= (zombieManager.zombies[i].x + 200))
						if((this.y + camera.y)>=(zombieManager.zombies[i].y) && (this.y+camera.y)<= (zombieManager.zombies[i].y + 200)){
							zombieManager.zombies[i].health-=5;
							document.getElementById("health").value -= 5;
								if(zombieManager.zombies[i].health==0){
									finished = true;
									zombieManager.zombies[i].dead=true;
									zombieManager.score +=100;
									zombie_dies.play();
								}
							return true;
						}
				}else{
					if((this.x +camera.x) >= (zombieManager.zombies[i].x -20) && (this.x +camera.x) <= (zombieManager.zombies[i].x + 20))
						if((this.y + camera.y)>=(zombieManager.zombies[i].y -20) && (this.y+camera.y)<= (zombieManager.zombies[i].y + 20)){
							zombieManager.zombies[i].health-=25;
							if(zombieManager.zombies[i].health==0){
								zombieManager.zombies[i].dead=true;
								zombieManager.score +=10;
								zombie_dies.play();
							}
							return true;
						}
				}
			}
		}

		return false;
	}
    
    this.update = function(){
        this.x += this.vectorX * 7;
        this.y += this.vectorY * 7; 
        this.markToDelete = this.collide_with_wall_bullet(this.x, this.y);
        if(!this.markToDelete)
        this.markToDelete = this.collide_with_zombies();
        if(this.x < 0 || this.x > canvas.width || this.y < 0 || this.y  > canvas.height){
            this.markToDelete = true;
        }
        
    };
        
    this.render = function(){
        ctxt.drawImage(this.sprite_bullet,
                       this.x, 
                       this.y,4,4);

    };
};


var BulletManager = {
	frames : 0,
    bullets : new Array(),
    index : 0,
    bulletExist : false,
    canvas : null,
    ctxt : null,
    pressed : false,
    collision : null,
    player : null,
    camera:null,
    zombieManager:null,

    
    update: function(){
        if(this.pressed){
            this.pressed = false;
            console.log(this.player.x + " " + this.player.y);
            var bullet = new Bullet(this.index,this.canvas,this.ctxt,this.collision,this.player,this.camera,this.zombieManager);
            this.frames = 0;
            this.bullets.push(bullet);
        }
        
        this.indexesToDelete = [];
        for(var i = 0; i<this.bullets.length;i++){
            this.bullets[i].update();
            
            if(this.bullets[i].markToDelete){
                this.indexesToDelete.push(i);
            }
        }
        
        for(var j = 0; j<this.indexesToDelete.length;j++){
            this.bullets.splice(this.indexesToDelete[j], 1);
        }
    },
    
    render: function(){
        for(var i = 0; i<this.bullets.length; i++){
            this.bullets[i].render();
        }
    }


}


var ZombieManager = {
	zombies : new Array(),
    ctxt : null,
    player : null,
    camera:null,
    sprite_zombie:null,
    sprite_crawler:null,
    sprite_boss:null,
    sprite_bloodstain:null,
    layer_zombies:null,
    collision:null,
    score:0,

    create : function(){
    	for(var i =0; i<this.layer_zombies.objects.length;i++){
    		var zombie = new Zombie(this.layer_zombies.objects[i].x,this.layer_zombies.objects[i].y,this.ctxt,this.sprite_bloodstain,this.player,this.camera,this.collision,this.layer_zombies.objects[i].type);
    		if(this.layer_zombies.objects[i].type==1 || this.layer_zombies.objects[i].type==3){
    			zombie.sprite_zombie = this.sprite_zombie;
    		}else{
    			if(this.layer_zombies.objects[i].type==2){
    			zombie.sprite_zombie = this.sprite_crawler;
    			zombie.health = 50;
    			}else{
    				zombie.sprite_zombie = this.sprite_boss;
    				zombie.health = 1000;
    			}
    		}
    		this.zombies.push(zombie);
    	}
    },

    update : function(){
    	for(var i = 0; i< this.zombies.length;i++){
    		this.zombies[i].update();
    	}

    },

    render: function(){
    	for(var i =0; i<this.zombies.length; i++){
    		this.zombies[i].render();
    	}
    }
}


var Zombie =function(posX,posY,ctxt,sprite_bloodstain,player,camera,collision,type) {
  this.x = posX,
  this.y = posY,
  this.angle = 0,
  this.vectorX=0;
  this.vectorY=0;
  this.sleep = true,
  this.framex =0,
  this.tick =0,
  this.health = 100,
  this.dead = false,
  this.sprite_zombie= null;
  this.speed=0;
  this.type = type;


  this.update = function () {

    

    //collision with player
    if(!this.dead){
        
        var centerZX = this.x + (player.width /2);
        var centerZY = this.y + (player.height /2);
        
    	
    	var centerPX = player.x + (player.width /2);
    	var centerPY = player.y + (player.height /2);
        
        if(this.type==4){
            var widthZ = 100;
        }else{
            var widthZ = 16;
        }
    	if((centerZX-widthZ) < (centerPX +32) && (centerZX+widthZ) > (centerPX - 32))
    		if((centerZY-widthZ) < (centerPY + 32) && (centerZY + widthZ) > (centerPY -32)){
    			player.lives--;
    			hero_touched.play();
    			if(this.noCollision()){
    				player.x +=this.vectorX * 40;
    				player.y +=this.vectorY * 40;
    			}
    		}
    	
    }



    //Rotation to the player
    if((this.x -camera.x) >=0 && (this.x -camera.x) <= ctxt.canvas.width){
    	if((this.y-camera.y) >=0 && (this.y -camera.y) <= ctxt.canvas.height){
    		this.angle = Math.atan2(player.y-this.y, player.x -this.x);
              
            if (type==3 && this.sleep){
                fastZombieScream.play();
            }
            
    		this.sleep = false;
    	}else{
    		//this.sleep = true;
    	}
    }else{
		//this.sleep = true;
    }


    if(!this.sleep && !this.dead && !this.collisionWithWall()){
    	//Zombie walking
    	this.vectorX = Math.sin(this.angle + 90 * Math.PI/180);
  		this.vectorY = -Math.cos(this.angle + 90 * Math.PI/180);
  		if(type == 1){
  			this.speed = 0.8;
  		}
  		else{
  			if(type == 2){
  				this.speed = 0.4;
  			}else{
  				if(type == 3){
  					this.speed = 2;
  				}else{
  					this.speed = 0;
  				}
  			}
  		}
  		this.x += this.vectorX * this.speed;
  		this.y += this.vectorY * this.speed;
    }

    //Bump by walls
    if(this.collisionWithWall()){
    	this.x -= this.vectorX * 1;
    	this.y -= this.vectorY * 1;
    }


  }

  this.noCollision = function(){
  	for(var i =0; i<collision.objects.length;i++){
		if((player.x + this.vectorX * 40 ) >= collision.objects[i].x && (player.x + this.vectorX * 40) <= (collision.objects[i].x + collision.objects[i].width )){
			if((player.y + this.vectorY * 40) >= collision.objects[i].y && (player.y + this.vectorY * 40) <= (collision.objects[i].y+ collision.objects[i].height)){
				return false;
			}
		}
	}
	if((player.x + this.vectorX * 40) <=0 || (player.x + this.vectorX * 40) >= 1280 || (player.y + this.vectorY * 40) <= 0 || (player.y + this.vectorY * 40) >= 1280){
		return false;
	}
	return true;
  }


  this.collisionWithWall = function(){
	for(var k =0; k<collision.objects.length;k++){
   		if(this.x >= collision.objects[k].x && this.x <= (collision.objects[k].x + collision.objects[k].width )){
       	if(this.y >= collision.objects[k].y && this.y <= (collision.objects[k].y+ collision.objects[k].height)){
           	return true;
            }
        }
    }
    return false;

  }

  this.render = function() {

  	
    //if (this.sleep) return;

    //EntityHelper.beginRotationOffset(this.x, this.y, this.angle);

    if (!this.dead) {
    	if(type == 1 || type == 3){
    		if ( this.tick >  5 ) {
	                this.framex  = (this.framex + 1 ) % 17 ;
	                this.framey = 2 ;
	                this.tick = 0;

	            }

	    	this.tick ++;
		}else{
			if(type == 2){
			if ( this.tick >  20 ) {
	                this.framex  = (this.framex + 1 ) % 4 ;
	                this.framey = 1;
	                this.tick = 0;
	            }

	    	this.tick ++;
			}else{
				if(type == 4){
					this.angle = 0;
					if ( this.tick >  25 ) {
			                this.framex  = (this.framex + 1 ) % 6 ;
			                this.framey = 0;
			                this.tick = 0;
			            }

			    	this.tick ++;
				}
			}
		}
		
    	ctxt.save();

    // move to the center of the canvas

   		ctxt.translate(this.x - camera.x ,this.y - camera.y);
   		

    // rotate the canvas to the specified degrees
   		ctxt.rotate(this.angle);
      //DRAW ZOMBIE ALIVE
      if(this.type == 4){
      	ctxt.drawImage( this.sprite_zombie , 
							this.framex * player.width ,//quel image tu prends x
							this.framey * player.height,// quel image tu prends y
							player.width , 
          					player.height ,
							-32,
							-32,
							200 , 
                  			200 );

      }else{


		ctxt.drawImage( this.sprite_zombie , 
							this.framex * player.width ,//quel image tu prends x
							this.framey * player.height,// quel image tu prends y
							player.width , 
          					player.height ,
							-32,
							-32,
							player.width , 
                  			player.height );
		}
		ctxt.restore();

    } else {
      //DRAW ZOMBIE DEAD
      	ctxt.drawImage( sprite_bloodstain , 
							0,
							0,
							player.width , 
          					player.height , 
							(this.x - camera.x ) >> 0, 
							(this.y - 32 - camera.y ) >> 0,
							player.width , 
                  			player.height );
    }
    
    //EntityHelper.endRotationOffset(this.x, this.y, this.angle);
  }
};







var music = new Audio('audio/ambience.mp3');
//music.play lorsqu'on lance le JEU
document.addEventListener('mousedown', clickFunction);

document.getElementById("fire").addEventListener("mousedown", fireButtonFunction);


//mettre à jour la valeur in real time
var screenWidth;
var screenHeight;

function getScreenSize(){
    screenWidth = document.body.clientWidth;
    screenHeight = document.body.clientHeight;
}

function clickFunction (event){
    //écran de tel = pas de tir en cas de click 
    getScreenSize();
    if(screenWidth > 900 || screenHeight > 414){ 
    BulletManager.pressed = true;

    var pan = new Audio('audio/pan.mp3');
    mousepressed = true;
    pan.play();
    pan.volume = 0.4;
    music.play();
	}
 
}

function fireButtonFunction (event){
    BulletManager.pressed = true;

    var pan = new Audio('audio/pan.mp3');

    mousepressed = true;
    pan.play();
    pan.volume = 0.4;
}

//let this bracket
}

end_game = function(){
    
    var playerName = document.getElementById("name").value;
    console.log(playerName);
    
    if(playerName != ""){
            localStorage.setItem("playerName", playerName);
            localStorage.setItem( "finalScore", score );
        
        if(localStorage.getObj("listScore")==null){
            var listScore = [];
        }else{
            var listScore = localStorage.getObj("listScore");
        }
        listScore.push({firstName: playerName, score:score, position:country});
        localStorage.setObj("listScore",listScore);
        
        var list = localStorage.getObj("listScore");
        console.log(Object.values(listScore[0]));
        for( var i =0 ; i< list.length ; i++){
            console.log(Object.values(list[i]));
        }
        
    }

    score = 0;

    
    alert("player : " + localStorage.getItem("playerName") + "\nscore : " + localStorage.getItem("finalScore"));
    close();
}



restart = function(){
	var game = new Game();
	levelplayed = 1;
	score = 0;
    game.init("0" + levelplayed);
    finished = false;
    
    document.getElementById("retry").style.visibility = "hidden";
    document.getElementById("finish").style.visibility = "hidden";
    document.getElementById("enterName").style.visibility = "hidden";
    document.getElementById("name").style.visibility = "hidden";
    
    
    document.getElementById("up").style.visibility = "visible";
    document.getElementById("down").style.visibility = "visible";
    document.getElementById("left").style.visibility = "visible";
    document.getElementById("right").style.visibility = "visible";
    document.getElementById("fire").style.visibility = "visible";
}

next = function(){
	var game = new Game();
	levelplayed ++;
    game.init("0" + levelplayed);
    document.getElementById("next").style.visibility = "hidden";
    
    document.getElementById("up").style.visibility = "visible";
    document.getElementById("down").style.visibility = "visible";
    document.getElementById("left").style.visibility = "visible";
    document.getElementById("right").style.visibility = "visible";
    document.getElementById("fire").style.visibility = "visible";
}


document.addEventListener("DOMContentLoaded", function() {
    var game = new Game();
    levelplayed = 4;
    game.init("0" + levelplayed);
});


drop = function() {
    document.getElementById("dropperdrag").style.visibility ="hidden";
    document.getElementById("canvasdropper").style.visibility ="hidden";
    document.getElementById("finishhim").style.visibility = "hidden";
    document.getElementById("retry").style.visibility = "visible";
	document.getElementById("finish").style.visibility = "visible";
    document.getElementById("enterName").style.visibility = "visible";
    document.getElementById("name").style.visibility = "visible";
}


drag = function() {
    document.getElementById("canvasdropper").style.visibility = "visible";
     document.getElementById("finishhim").style.visibility = "visible";
    document.getElementById("dropperdrag").style.visibility ="visible";
    
    var dndHandler = {
        
        draggedElement: null, // Propriété pointant vers l'élément en cours de déplacement

        applyDragEvents: function(element) {
            
            element.draggable = true;

            var dndHandler = this; // Cette variable est nécessaire pour que l'événement « dragstart » ci-dessous accède facilement au namespace « dndHandler »

            element.addEventListener('dragstart', function(e) {
                dndHandler.draggedElement = e.target; // On sauvegarde l'élément en cours de déplacement
                e.dataTransfer.setData('text/plain', ''); // Nécessaire pour Firefox
            });

        },

        applyDropEvents: function(dropper) {

            dropper.addEventListener('dragover', function(e) {
                e.preventDefault(); // On autorise le drop d'éléments
                this.className = 'dropper'; // Et on applique le style adéquat à notre zone de drop quand un élément la survole
            });

            dropper.addEventListener('dragleave', function() {
                this.className = 'dropper'; // On revient au style de base lorsque l'élément quitte la zone de drop
            });

            var dndHandler = this; // Cette variable est nécessaire pour que l'événement « drop » ci-dessous accède facilement au namespace « dndHandler »

            dropper.addEventListener('drop', function(e) {

                var target = e.target,
                    draggedElement = dndHandler.draggedElement, // Récupération de l'élément concerné
                    clonedElement = draggedElement.cloneNode(true); // On créé immédiatement le clone de cet élément

                while (target.className.indexOf('dropper') == -1) { // Cette boucle permet de remonter jusqu'à la zone de drop parente
                    target = target.parentNode;
                }

                target.className = 'dropper'; // Application du style par défaut

                clonedElement = target.appendChild(clonedElement); // Ajout de l'élément cloné à la zone de drop actuelle
                dndHandler.applyDragEvents(clonedElement); // Nouvelle application des événements qui ont été perdus lors du cloneNode()

                draggedElement.parentNode.removeChild(draggedElement); // Suppression de l'élément d'origine

            });
            
            

        }

    };

    var elements = document.querySelectorAll('.draggable'),
        elementsLen = elements.length;

    for (var i = 0; i < elementsLen; i++) {
        dndHandler.applyDragEvents(elements[i]); // Application des paramètres nécessaires aux éléments déplaçables
    }

    var droppers = document.querySelectorAll('.dropper'),
        droppersLen = droppers.length;

    for (var i = 0; i < droppersLen; i++) {
        dndHandler.applyDropEvents(droppers[i]); // Application des événements nécessaires aux zones de drop
    }

}



onSuccess = function( position){
        var latitude= position.coords.latitude;
        var longitude= position.coords.longitude;

        //Is the player in switzerland
        if ((latitude>=45.828465) && (latitude<=48.96667) && (longitude>=5.971636) && (longitude<=10.492014)){ 
            country = "SUISSE" 

        } else  country = "not from switzerland"; //Exterior
    }

function onError(error) { 
    country = "unknown country";
} // Unknown

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


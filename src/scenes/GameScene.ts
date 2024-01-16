import Phaser from 'phaser'
import Player from '../characters/Player';

export default class GameScene extends Phaser.Scene {
	map: Phaser.Tilemaps.Tilemap | undefined;
	objectLayer: Phaser.Tilemaps.TilemapLayer | undefined;
	groundLayer: Phaser.Tilemaps.TilemapLayer | null | undefined;
	cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
	player: Player | undefined;

	preload() {
		this.load.image('tiles', 'src/assets/tilesets/ground.png');
		this.load.spritesheet('player', 
			'src/assets/sprites/player.png',
			{ frameWidth: 32, frameHeight: 48 }
		);
	}

	create() {
		this.initRoom();
		this.initPlayer();

		this.initPhysics();

		this.cursors = this.input.keyboard?.createCursorKeys();

		if (this.map) {
			this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		}
	}

	update() {
		if (this.cursors && this.player) {
			this.player.update(this.cursors);
		}
	}

	initRoom() {
		this.map = this.make.tilemap({ tileWidth: 32, tileHeight: 32, width: 25, height: 20 });
		
		const tiles = this.map.addTilesetImage('tiles');

		if (tiles) {
			this.groundLayer = this.map.createBlankLayer('Ground Layer', tiles);
		}

		if (this.groundLayer) {
			this.groundLayer.setScale(1);

			// Walls and Corners
			this.groundLayer.fill(0, 0, 0, this.map.width, 1);
			this.groundLayer.fill(0, 0, this.map.height - 1, this.map.width, 1);
			this.groundLayer.fill(0, 0 , 0, 1, this.map.height);
			this.groundLayer.fill(0, this.map.width - 1, 0, 1, this.map.height);
			this.groundLayer.putTileAt(0, 0, 0);
			this.groundLayer.putTileAt(0, this.map.width - 1, 0);
			this.groundLayer.putTileAt(0, this.map.width - 1, this.map.height - 1);
			this.groundLayer.putTileAt(0, 0, this.map.height - 1);

			this.randomizeRoom(); // randomize the rest of the room
		}
	}

	randomizeRoom() {
		// fill the floor with random ground tiles
		this.groundLayer?.weightedRandomize(
			[
				{ index: 0, weight: 10 }, // standard floor tile, 4 times more likely than the rest
				{ index: 4, weight: 0.3 },
				{ index: 3, weight: 0.6 }, // slightly less likely floor tiles
				{ index: 10, weight: 0.5 },
			],
			1,
			1,
			this.map.width - 2,
			this.map.height - 2
		);
	}

	initPlayer() {
		const sprite = this.physics.add.sprite(this.map.widthInPixels / 2 - 16, this.map.heightInPixels / 2 - 24, 'player');

		this.player = new Player(sprite, 'Player', 100, 100);

		this.player.sprite.setCollideWorldBounds(true);

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [ { key: 'player', frame: 4 } ],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});
	}

	initPhysics() {
		if (this.player && this.groundLayer) {
			this.physics.add.collider(this.player?.sprite, this.groundLayer);
		}
	}
}
export default class Player {
    name: string;
    health: number;
    speed: number;
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor(sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, name: string, health?: number, speed?: number) {
        this.name = name;
        this.sprite = sprite;
        this.health = health || 100;
        this.speed = speed || 100;
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        this.sprite.setVelocityX(0);
        this.sprite.setVelocityY(0);

        if (cursors.down.isDown || cursors.up.isDown || cursors.left.isDown || cursors.right.isDown) {
            if (cursors.left.isDown)
            {
                this.sprite.setVelocityX(-160);

                this.sprite.anims.play('left', true);
            }
            
            if (cursors.right.isDown)
            {
                this.sprite.setVelocityX(160);

                this.sprite.anims.play('right', true);
            }

            if (cursors.up.isDown)
            {
                this.sprite.setVelocityY(-160);

                this.sprite.anims.play('turn', true);
            }
            
            if (cursors.down.isDown)
            {
                this.sprite.setVelocityY(160);

                this.sprite.anims.play('turn', true);
            }
        } else {
            this.sprite.anims.play('turn');
        }
    }
}
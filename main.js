function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var world  = new World();

var player = new Player();
var enemy  = new Entity();

console.log(player.strength);
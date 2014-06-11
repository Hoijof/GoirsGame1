
function addDivToWorldInfo(div){
		$("#info").html($("#info").html()+"<div>"+div+"</div>");
	}
function updateWorldInfo() {
	$("#info").html("");
	addDivToWorldInfo("Day : " + world.day);
	addDivToWorldInfo("Total Deaths : " + world.deaths);
	addDivToWorldInfo("Total Births : " + world.births);
	addDivToWorldInfo("Population : " + world.population);
	addDivToWorldInfo("Player health : " + player.health.toPrecision(4) + " level : " + player.level);
}

var world  = new World();

var player = new Player(0);
world.addPerson(player);
for(var i = 1; i < world.population; i++) {
	world.addPerson(new Entity(i));
}

updateWorldInfo();

/*var won = 0;
var defeat = 0;
var draw = 0;
for(var i = 0; i < 100; i++) {
	var player = new Player();
	var enemy  = new Entity();
	var result = player.fightAgainstEntity(enemy)
	switch (result) {
		case "victory" :
			++won;
		break;
		case "defeat" :
			++defeat;
		break;
		case "draw" :
			++draw;
		break;
	}
}

console.log((won) + " victories");
console.log((defeat) + " defeats");
console.log((draw) + " draws");*/

$(document).ready(function (){
	$("#advance").on("click", function() {
		world.callADay();
		updateWorldInfo();

		if (player.health <= 0) {
			alert("You lasted " + world.day + " days in this cruel world.")
			location.reload();
		}
	});
});


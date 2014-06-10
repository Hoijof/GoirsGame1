
function addDivToWorldInfo(div){
		$("#info").html($("#info").html()+"<div>"+div+"</div>");
	}
function updateWorldInfo() {
	$("#info").html("");
	addDivToWorldInfo("Day : " + world.day);
	addDivToWorldInfo("Total Deaths : " + world.deaths);
	addDivToWorldInfo("Total Births : " + world.births);
	addDivToWorldInfo("Population : " + world.population);
}

var world  = new World();
updateWorldInfo();

for(var i = 0; i < world.population; i++) {
	world.addPerson(new Entity(i));
}

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
	});
});


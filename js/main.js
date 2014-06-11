
function addDivToWorldInfo(div){
		$("#info").html($("#info").html()+"<div>"+div+"</div>");
	}
function updateWorldInfo() {
	$("#info").html("");
	addDivToWorldInfo("Day : " + world.day);
	addDivToWorldInfo("Total Deaths : " + world.deaths);
	addDivToWorldInfo("Total Births : " + world.births);
	addDivToWorldInfo("Population : " + world.population);
	addDivToWorldInfo("Player health : " + player.basics.health.toFixed(2) + " level : " + player.basics.level + " victories " + player.basics.victories + " defeats : " + player.basics.defeats);
}

var world  = new World();

var player = new Entity(0);
player.basics.name = "Hoijof";
player.attributes.intelligence = 68;
player.attributes.agility = 30;
player.attributes.speed = 39;

var foo = new Entity(1);
foo.basics.name = getRandomCitizenName("male");

foo.attributes.intelligence = 68;
foo.attributes.agility = 100;
foo.attributes.speed = 100;

world.addPerson(player);

$(document).ready(function (){
	updateWorldInfo();
	$("#advance").on("click", function() {
		//world.callADay();
		updateWorldInfo();
		player.fightAgainstEntity(foo);
		if (player.basics.isDead) {
			alert("You lasted " + world.day + " days in this cruel world.")
			location.reload();
		}
	});

	$("#rollPlayer").on("click", function() {
		player = new Entity(0);
		player.name = "Hoijof";
		world.addPerson(player);
		updateWorldInfo();
	});
});


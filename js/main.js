
function addDivToWorldInfo(div){
		$("#info").html($("#info").html()+"<div>"+div+"</div>");
	}
function updateWorldInfo() {
	$("#info").html("");
	addDivToWorldInfo("Day : " + world.day);
	addDivToWorldInfo("Total Deaths : " + world.deaths);
	addDivToWorldInfo("Total Births : " + world.births);
	addDivToWorldInfo("Population : " + world.population);
	addDivToWorldInfo("Player health : " + player.basics.health.toFixed(2) + " level : " + player.basics.level + " victories " + player.basics.victories + " defeats : " + player.basics.defeats + " exp: " + player.basics.experience);
}

function updatePlayerInfo() {
	var div = $("#playerInfo");
	div.html("");

	div.append("<div>");
		div.append("<div>Strength : " + player.attributes.strength + "</div>");
		div.append("<div>Endurance : " + player.attributes.endurance + "</div>");
		div.append("<div>Intelligence : " + player.attributes.intelligence + "</div>");
		div.append("<div>Willpower : " + player.attributes.willpower + "</div>");
		div.append("<div>Agility : " + player.attributes.agility + "</div>");
		div.append("<div>Speed : " + player.attributes.speed + "</div>");
		div.append("<div>Stamina : " + player.attributes.stamina + "</div>");
		div.append("<div>Faith : " + player.attributes.faith + "</div>");
		div.append("<div>Head : " + player.vitalPoints.head + "</div>");
		div.append("<div>Body : " + player.vitalPoints.body + "</div>");
		div.append("<div>Left Arm : " + player.vitalPoints.leftArm + "</div>");
		div.append("<div>Right Arm : " + player.vitalPoints.rightArm + "</div>");
		div.append("<div>Left Leg : " + player.vitalPoints.leftLeg + "</div>");
		div.append("<div>Right Leg : " + player.vitalPoints.rightLeg + "</div>");
	div.append("</div>");
}

var world  = new World();

var player = new Entity(0);
player.basics.name = "Hoijof";
//player.attributes.intelligence = 68;
//player.attributes.agility = 30;
//player.attributes.speed = 39;

var foo = new Entity(1);
foo.basics.name = getRandomCitizenName("male");

foo.attributes.intelligence = 68;
foo.attributes.agility = 100;
foo.attributes.speed = 100;

world.addPerson(player);

$(document).ready(function (){
	updateWorldInfo();
	updatePlayerInfo();
	$("#advance").on("click", function() {
		world.callADay();
		updateWorldInfo();
		updatePlayerInfo();
		//player.fightAgainstEntity(foo);
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


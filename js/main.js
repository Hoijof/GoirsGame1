var world  = new World(),
    player = new Entity(0),
    foo    = new Entity(1),
    engine = new Engine(world, player);



player.basics.name = "Hoijof";
//player.attributes.intelligence = 68;
//player.attributes.agility = 30;
//player.attributes.speed = 39;

foo.basics.name = getRandomCitizenName("male");

foo.attributes.intelligence = 68;
foo.attributes.agility = 100;
foo.attributes.speed = 100;

world.addPerson(player);

$(document).ready(function (){

	Math.seedrandom();
    engine.update();
	$("#advance").on("click", function() {
		Math.seedrandom();
		world.callADay();
        engine.update();
		//player.fightAgainstEntity(foo);
		if (player.basics.isDead) {
			alert("You lasted " + world.day + " days in this cruel world.");
			//location.reload();
		}
	});

	$("#rollPlayer").on("click", function() {
		player = new Entity(0);
		player.name = "Hoijof Golpeo";
		world.addPerson(player);
        engine.update();
	});
});


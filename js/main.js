var world  = new World(),
    player = new Entity(0),
    engine = new Engine(world, player);



player.basics.name    = "Hoijof";
player.basics.surname = "Golpeo";
world.addPerson(player);
world.player = world.people[0];

$(document).ready(function (){

	Math.seedrandom();
    engine.update();
	$("#advance").on("click", function() {
		Math.seedrandom();
		world.callADay();
        engine.update();
		if (player.basics.isDead) {
			alert("You lasted " + world.standard.day + " days in this cruel world.");
		}
	});

	$("#rollPlayer").on("click", function() {
		player         = new Entity(0);
		player.name    = "Hoijof";
        player.surname = "Golpeo";
		world.addPerson(player);
        engine.update();
	});

    $(".header").on("click", function() {
        $(this).next().toggle();
    });

    $(".consoleInput").on("keydown", function(event) {
        console.log(event.keyCode);
        if (event.keyCode === 13) {
            engine.addDivToConsole($(this).val());
            engine.handleCommand($(this).val());
            $(this).val("");
        }
        if (event.keyCode === 38) {
            if(engine.actualTrace > 0) {
                engine.actualTrace--;
                engine.showActualTrace();
            }
        } else if (event.keyCode === 40) {
            if(engine.actualTrace < engine.consoleTrace.length-1) {
                engine.actualTrace++;
                engine.showActualTrace();
            }
        }
    });

    $("#console").on("click", function() {
       $("consoleInput").focus();
    });
});


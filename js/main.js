var world   = new World(),
    player  = new Entity(0),
    engine  = new Engine(world, player),
    terminal;



player.basics.name    = "Hoijof";
player.basics.surname = "Golpeo";
world.addPerson(player);
world.player = world.people[0];

$(document).ready(function (){

	Math.seedrandom();
	terminal = new Terminal($("#terminal"), true);
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

    $("#terminal > .terminalInput").on("keydown", function(event) {
    	//console.log(event.keyCode);
        if (event.keyCode === 13) {
            terminal.handleCommand($(this).val());
            $(this).val("");
        }
        if (event.keyCode === 38) {
            if(terminal.consoleActualTrace > 0) {
                terminal.consoleActualTrace--;
                terminal.showCurrentTrace();
                return false;
            }
        } else if (event.keyCode === 40) {
            if(terminal.consoleActualTrace < terminal.consoleTrace.length-1) {
                terminal.consoleActualTrace++;
                terminal.showCurrentTrace();
                return false;
            }
        }
    });

    $("#terminal").on("mouseup", function() {
    	if(window.getSelection().type != "Range")
			$("#terminalInput").focus();
		return true;
    });
});


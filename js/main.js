var world   = new World(),
    player  = new Entity(0),
    engine  = new Engine(world, player),
    terminal,
    ticking = {active : false, percentage : 0, interval : null},
    playerDeadNotified = false,
    outputHTML = "";

player.basics.name    = "Humbertiño";
player.basics.surname = "Golpeiño :D";
world.addPerson(player);
world.player = player;

function tick() {
    if(ticking.active === true) {
        if(ticking.interval === null) ticking.interval = setInterval(tick,10);
        if (ticking.percentage >= 100) {
            ticking.percentage = 0;
            outputHTML = "";
            world.callADay();
            engine.update();
        } else {
            ticking.percentage += 2;
        }
        $("#dayBar").css("width", ticking.percentage+"%");

        if (player.basics.isDead && !playerDeadNotified) {
            ticking.active = false;
            alert("You lasted " + world.standard.day + " days in this cruel world.");
            playerDeadNotified = true;
        }
    } else {
        clearInterval(ticking.interval);
        ticking.interval = null;
    }
}

$(document).ready(function(){
    var mainView = new MainView($("#mainView"));
    mainView.createContent();
});



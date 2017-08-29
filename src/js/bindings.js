/**
 * Created by humberto.gomez on 25/06/2014.
 */

$(document).ready(function() {
    let jqSelTerminalText = $("#terminalTextInput"),
        jqSelTerminal = $("#terminal"),
        jqSelTerminalTextArea = $("#terminalTextAreaInput");
    Math.seedrandom();
    terminal = new Terminal(jqSelTerminal, jqSelTerminalText, jqSelTerminalTextArea, false);
    engine.update();

    let ctrlDown = false, shiftDown = false;
    let ctrlKey = 17, vKey = 86, cKey = 67;

    $(document).keydown(function(e) {
        if (e.keyCode === ctrlKey) ctrlDown = true;
    }).keyup(function(e) {
        if (e.keyCode === ctrlKey) ctrlDown = false;
        if (e.ctrlKey && e.keyCode == 77) terminal.toggleVisibility();
        if (e.ctrlKey && e.keyCode == 32) $("#advance").click();
    });

    $(document).keypress(function(e) {
        if (e.keyCode === 10) {
        }
    });

    $("#advance").on("click", function() {
        Math.seedrandom();
        ticking.active = !ticking.active;
        tick();
        // engine.update();
    });

    $("#rollPlayer").on("click", function() {
        player = new Entity(0);
        player.name = "Hoijof";
        player.surname = "Golpeo";
        // player.setAllStatsToValue(100);
        world.addPerson(player);
        engine.update();
    });

    $(".header").on("click", function() {
        $(this).next().toggle();
    });

    jqSelTerminalText.on("keydown", function(event) {
        //console.log(event.keyCode);
        if (event.keyCode === 38) {
            if (terminal.consoleActualTrace > 0) {
                terminal.consoleActualTrace--;
                terminal.showCurrentTrace();
                return false;
            }
        } else if (event.keyCode === 40) {
            if (terminal.consoleActualTrace < terminal.consoleTrace.length - 1) {
                terminal.consoleActualTrace++;
                terminal.showCurrentTrace();
                return false;
            } else {
                $("#terminalTextInput").val("");
            }
        }
    }).keypress(function(e) {
        if (event.keyCode === 13) {
            terminal.handleCommand($(this).val());
            $(this).val("");
        } else if (e.keyCode === 10) {
            return false;
        }
    });

    jqSelTerminal.on("mouseup", function() {
        if (window.getSelection().type !== "Range") {
            terminal.focusInput();
        }
        return true;
    });

    jqSelTerminalTextArea.on("keydown", function(event) {
        //console.log(event.keyCode);
        if (event.keyCode === 38) {
            if (terminal.consoleActualTrace > 0) {
                terminal.consoleActualTrace--;
                terminal.showCurrentTrace();
                return false;
            }
        } else if (event.keyCode === 40) {
            if (terminal.consoleActualTrace < terminal.consoleTrace.length - 1) {
                terminal.consoleActualTrace++;
                terminal.showCurrentTrace();
                return false;
            } else {
                $("#terminalTextAreaInput").val("");
            }
        }
    }).keypress(function(e) {
        if (event.keyCode === 10) {
            terminal.handleCommand($(this).val());
            $(this).val("");
        }
    });

    $(document).on("click", ".addPoint", function() {
        let entity = player,
            pointsFree = entity.getPointsFree();

        if (pointsFree > 0) {
            let siblings = $(this).siblings();
            entity.addPointsToAttribute(1, siblings.first().html().toLowerCase());
        }

        engine.updatePlayerInfo();
    });

    $("#buttongoirs").on("click", function() {
        for (let i = 0; i <= 120; i += 1) {
            let things = Math.round(450 * 10 + Math.pow(i, 2));
            console.log(things);
        }

    });
});

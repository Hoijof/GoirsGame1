/**
 * Created by humberto.gomez on 25/06/2014.
 */

import Terminal from './classes/Terminal'
import Entity from './classes/Entity'

$(document).ready(function() {
    let jqSelTerminalText = $("#terminalTextInput"),
        jqSelTerminal = $("#terminal"),
        jqSelTerminalTextArea = $("#terminalTextAreaInput");
    Math.seedrandom();

    gg.terminal = new Terminal(jqSelTerminal, jqSelTerminalText, jqSelTerminalTextArea, false);

    gg.initGameUI();

    gg.engine.update();

    let ctrlDown = false, shiftDown = false;
    let ctrlKey = 17, vKey = 86, cKey = 67;

    $(document).keydown(function(e) {
        if (e.keyCode === ctrlKey) ctrlDown = true;
    }).keyup(function(e) {
        if (e.keyCode === ctrlKey) ctrlDown = false;
        if (e.ctrlKey && e.keyCode === 77) gg.terminal.toggleVisibility();
        if (e.ctrlKey && e.keyCode === 32) $("#advance").click();
    });

    $(document).keypress(function(e) {
        if (e.keyCode === 10) {
        }
    });

    $("#advance").on("click", function() {
        Math.seedrandom();
        gg.ticking.active = !gg.ticking.active;
        gg.tick();
        // gg.engine.update();
    });

    $("#rollPlayer").on("click", function() {
        gg.player = new Entity(0);
        gg.player.name = "Hoijof";
        gg.player.surname = "Golpeo";
        gg.player.setAllStatsToValue(100);
        gg.world.addPerson(gg.player);
        gg.engine.update();
    });

    $(".header").on("click", function() {
        $(this).next().toggle();
    });

    jqSelTerminalText.on("keydown", function(event) {
        //console.log(event.keyCode);
        if (event.keyCode === 38) {
            if (gg.terminal.consoleActualTrace > 0) {
                gg.terminal.consoleActualTrace--;
                gg.terminal.showCurrentTrace();
                return false;
            }
        } else if (event.keyCode === 40) {
            if (gg.terminal.consoleActualTrace < gg.terminal.consoleTrace.length - 1) {
                gg.terminal.consoleActualTrace++;
                gg.terminal.showCurrentTrace();
                return false;
            } else {
                $("#terminalTextInput").val("");
            }
        }
    }).keypress(function(e) {
        if (event.keyCode === 13) {
            gg.terminal.handleCommand($(this).val());
            $(this).val("");
        } else if (e.keyCode === 10) {
            return false;
        }
    });

    jqSelTerminal.on("mouseup", function() {
        if (window.getSelection().type !== "Range") {
            gg.terminal.focusInput();
        }
        return true;
    });

    jqSelTerminalTextArea.on("keydown", function(event) {
        //console.log(event.keyCode);
        if (event.keyCode === 38) {
            if (gg.terminal.consoleActualTrace > 0) {
                gg.terminal.consoleActualTrace--;
                gg.terminal.showCurrentTrace();
                return false;
            }
        } else if (event.keyCode === 40) {
            if (gg.terminal.consoleActualTrace < gg.terminal.consoleTrace.length - 1) {
                gg.terminal.consoleActualTrace++;
                gg.terminal.showCurrentTrace();
                return false;
            } else {
                $("#terminalTextAreaInput").val("");
            }
        }
    }).keypress(function(e) {
        if (event.keyCode === 10) {
            gg.terminal.handleCommand($(this).val());
            $(this).val("");
        }
    });

    $(document).on("click", ".addPoint", function() {
        let entity = gg.player,
            pointsFree = entity.getPointsFree();

        if (pointsFree > 0) {
            let siblings = $(this).siblings();
            entity.addPointsToAttribute(1, siblings.first().html().toLowerCase());
        }

        gg.engine.updatePlayerInfo();
    });

    $("#buttongoirs").on("click", function() {
        for (let i = 0; i <= 120; i += 1) {
            let things = Math.round(450 * 10 + Math.pow(i, 2));
            console.log(things);
        }

    });
});

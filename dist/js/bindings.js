/**
 * Created by humberto.gomez on 25/06/2014.
 */

import Entity from './classes/Entity'

$(document).ready(function() {
    Math.seedrandom();

    gg.initGameUI();

    gg.engine.update();

    let ctrlDown = false, shiftDown = false;
    let ctrlKey = 17, vKey = 86, cKey = 67;

    $(document).keydown(function(e) {
        if (e.keyCode === ctrlKey) ctrlDown = true;
    }).keyup(function(e) {
        if (e.keyCode === ctrlKey) ctrlDown = false;
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

    $(document).on("click", ".addPoint", function() {
        let entity = gg.player,
            pointsFree = entity.getPointsFree();

        if (pointsFree > 0) {
            let siblings = $(this).siblings();
            entity.addPointsToAttribute(1, siblings.first().html().toLowerCase());
        }

        gg.engine.updatePlayerInfo();
    });
});

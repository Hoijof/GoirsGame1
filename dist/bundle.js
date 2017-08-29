(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var settings = {
    autoLevelUp: true
};

var world = new World(),
    player = new Entity(0),
    engine = new Engine(world, player),
    terminal,
    ticking = {active: false, percentage: 0, interval: null},
    playerDeadNotified = false,
    outputHTML = "",
    view = null;

world.addPerson(player);
world.player = player;

// world.reportPeople();

function init() {
    engine.hidePlayerBar();
    engine.hideWorldBar();
    engine.hidePlayerActions();
}

function tick() {
    if (ticking.active === true) {
        if (ticking.interval === null) {
            ticking.interval = setInterval(tick, 30);
        }
        if (ticking.percentage >= 100) {
            ticking.percentage = 0;
            outputHTML = "";
            world.callADay();
            engine.update();
        } else {
            ticking.percentage += 2;
        }
        $("#dayBar").css("width", ticking.percentage + "%");

        if (player.basics.isDead && !playerDeadNotified) {
            ticking.active = false;
            alert("You lasted " + world.standard.day + " days in this cruel world.\n You finished as the " + (world.standard.population + 1) + "th last human.");
            playerDeadNotified = true;
        }
    } else {
        clearInterval(ticking.interval);
        ticking.interval = null;
    }
}

$(document).ready(function() {
    view = new MainController($("#mainView"));
    view.activeView = 'generateNewPlayerForm';
    engine.jqSelToast = $("#toastMessage");
    init();

    engine.jqSelToast.on("dblclick", function() {
        $(this).fadeOut()
    });
});


},{}]},{},[1])

//# sourceMappingURL=bundle.js.map

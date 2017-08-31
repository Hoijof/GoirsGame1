window.gg = {};

gg.totals = {
    attacks: 0,
    dodges: 0,
    survivals: 0,
    deaths: 0
};

gg.settings = {
    autoLevelUp: true,
    tickingInterval: 1,
    tickingIncrement: 5
};

window.stats = [];
// Libraries
// CLASSES
import World from './classes/World';
import Entity from './classes/Entity';

import Engine from './engine';
// CONTROLLERS
import MainController from './controllers/MainController';
// BINDINGS
import './bindings';

gg.world = new World();
gg.player = new Entity(0);
gg.engine = new Engine(gg.world, gg.player);
gg.ticking = {active: false, percentage: 0, interval: null};
gg.playerDeadNotified = false;
gg.outputHTML = "";
gg.view = MainController.view = null;

gg.world.addPerson(gg.player);
gg.world.player = gg.player;

// gg.world.reportPeople();

gg.initGameUI = function init() {
    MainController.view = new MainController($("#mainView"));
    MainController.view.activeView = 'generateNewPlayerForm';
    gg.engine.jqSelToast = $("#toastMessage");

    gg.engine.hidePlayerBar();
    gg.engine.hideWorldBar();
    gg.engine.hidePlayerActions();

    gg.engine.jqSelToast.on("dblclick", function() {
        $(this).fadeOut()
    });
};

gg.tick = function tick() {
    if (gg.ticking.active === true) {
        if (gg.ticking.interval === null) {
            gg.ticking.interval = setInterval(tick, gg.settings.tickingInterval);
        }
        if (gg.ticking.percentage >= 100) {
            gg.ticking.percentage = 0;
            gg.outputHTML = "";
            gg.world.callADay();
            gg.engine.update();
        } else {
            gg.ticking.percentage += gg.settings.tickingIncrement;
        }
        $("#dayBar").css("width", gg.ticking.percentage + "%");

        if (gg.player.basics.isDead && !gg.playerDeadNotified) {
            gg.ticking.active = false;
            alert("You lasted " + gg.world.standard.day + " days in this cruel world.\n You finished as the " + (gg.world.standard.population + 1) + "th last human.");
            gg.playerDeadNotified = true;
        }
    } else {
        clearInterval(gg.ticking.interval);
        gg.ticking.interval = null;
    }
};

window.downloadCSV = function downloadCSV(stats) {
    let res = 'data:text/csv;charset=utf-8,';
    res += 'Day,Total population,Deaths,Births\n';

    let current = 0;
    const max = 4;
    stats.forEach((stat) => {
        res += stat;

        if (++current < max) {
            res += ',';
        } else {
            res += '\n';
            current = 0;
        }
    });

    let encodedUri = encodeURI(res);
    window.open(encodedUri);
    return encodedUri;
};
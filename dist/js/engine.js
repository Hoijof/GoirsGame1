import MainController from './controllers/MainController';

function Engine(world, player) {
    this.world = world;
    this.player = player;
    this.jqSelToast = "";
}

Engine.prototype.update = function() {
    this.updatePlayerInfo();
    this.updateWorldInfo();
    this.updateMainInfo();
};

Engine.prototype.updatePlayerInfo = function() {

    let selector = $("#playerBasics"),
        html,
        before = [];

    selector.find("tbody tr").each(function() {
        let elem = $(this).find("td");
        let name = $(elem[0]).html();
        name = name.charAt(0).toLowerCase() + name.slice(1);
        before[name] = $(elem[1]).html();
    });

    selector.html("");
    for (let stat in gg.player.basics) {
        html = (`<td>${stat.charAt(0).toUpperCase()}${stat.slice(1)}</td>`);

        if (typeof gg.player.basics[stat] === 'number') {
            html += (`<td>${parseInt(gg.player.basics[stat])}</td>`);

            if (gg.player.basics[stat] < before[stat]) {
                selector.append("<tr class='decreased'>" + html + "</tr>");
            } else if (gg.player.basics[stat] > before[stat] && typeof gg.player.basics[stat] === 'number') {
                selector.append("<tr class='increased'>" + html + "</tr>");
            } else {
                selector.append("<tr class='normal'>" + html + "</tr>");
            }
        } else {
            html += ("<td>" + gg.player.basics[stat] + "</td>");
            if (String(gg.player.basics[stat]) !== before[stat]) {
                selector.append("<tr class='increased'>" + html + "</tr>");
            } else {
                selector.append("<tr class='normal'>" + html + "</tr>");
            }
        }
    }

    selector = $("#playerStats");
    let pointsFree = gg.player.getPointsFree();

    if (pointsFree > 0) $("#headerStats").html(PLAYER_BASICS + " <span style='color:green;'>+" + pointsFree + "</span>");
    else $("#headerStats").html(PLAYER_BASICS);

    selector.find("tbody tr").each(function() {
        let elem = $(this).find("td");
        let name = $(elem[0]).html();
        name = name.charAt(0).toLowerCase() + name.slice(1);
        before[name] = $(elem[1]).html();
    });

    selector.html("");
    for (let stat in gg.player.attributes) {
        html = ("<td>" + stat.charAt(0).toUpperCase() + stat.slice(1) + "</td>");
        html += ("<td>" + parseInt(gg.player.attributes[stat]) + "</td>");
        if (pointsFree) html += ("<td class='addPoint'>+</td>");

        if (gg.player.attributes[stat] < before[stat]) {
            selector.append("<tr class='decreased'>" + html + "</tr>");
        } else if (gg.player.attributes[stat] > before[stat]) {
            selector.append("<tr class='increased'>" + html + "</tr>");
        } else {
            selector.append("<tr class='normal'>" + html + "</tr>");
        }
    }

    selector = $("#playerHealth");

    selector.find("tbody tr").each(function() {
        let elem = $(this).find("td");
        let name = $(elem[0]).html();
        name = name.charAt(0).toLowerCase() + name.slice(1);
        before[name] = $(elem[1]).html();
    });

    selector.html("");
    for (let stat in gg.player.vitalPoints) {
        html = ("<td>" + stat.charAt(0).toUpperCase() + stat.slice(1) + "</td>");
        html += ("<td>" + parseInt(gg.player.vitalPoints[stat]) + "</td>");

        if (gg.player.vitalPoints[stat] < before[stat]) {
            selector.append("<tr class='decreased'>" + html + "</tr>");
        } else if (gg.player.vitalPoints[stat] > before[stat]) {
            selector.append("<tr class='increased'>" + html + "</tr>");
        } else {
            selector.append("<tr class='normal'>" + html + "</tr>");
        }
    }
};

Engine.prototype.updateWorldInfo = function() {
    let selector = $("#worldStandard"),
        before = [],
        html;

    selector.find("tbody tr").each(function() {
        let elem = $(this).find("td");
        let name = $(elem[0]).html();
        name = name.charAt(0).toLowerCase() + name.slice(1);
        before[name] = +$(elem[1]).html();
    });

    selector.html("");
    for (let stat in gg.world.standard) {
        html = ("<td>" + stat.charAt(0).toUpperCase() + stat.slice(1) + "</td>");
        html += ("<td>" + gg.world.standard[stat] + "</td>");

        if (gg.world.standard[stat] < before[stat]) {
            selector.append("<tr class='decreased'>" + html + "</tr>");
        } else if (gg.world.standard[stat] > before[stat]) {
            selector.append("<tr class='increased'>" + html + "</tr>");
        } else {
            selector.append("<tr class='normal'>" + html + "</tr>");
        }
    }
};

Engine.prototype.hidePlayerBar = function() {
    $("#playerBar").hide();
};
Engine.prototype.showPlayerBar = function() {
    this.updatePlayerInfo();
    $("#playerBar").show();
};

Engine.prototype.hideWorldBar = function() {
    $("#worldBar").hide();
};
Engine.prototype.showWorldBar = function() {
    this.updateWorldInfo();
    $("#worldBar").show();
};

Engine.prototype.hidePlayerActions = function() {
    $("#playerActions").hide();

};
Engine.prototype.showPlayerActions = function() {
    $("#playerActions").show();
};

Engine.prototype.updateMainInfo = function() {
    if (MainController.view === null) {
        $("#mainView").html(gg.outputHTML);
    } else {
        MainController.view.showContent();
    }
};

Engine.prototype.hideToast = function() {
    gg.engine.jqSelToast.fadeOut();
};

Engine.prototype.showToast = function(message) {
    this.jqSelToast.html(message);
    this.jqSelToast.center().fadeIn();
    let timeout = message.split(" ").length * 260;
    setTimeout(gg.engine.hideToast, timeout < 8000 ? timeout : 8000);
};

export default Engine;
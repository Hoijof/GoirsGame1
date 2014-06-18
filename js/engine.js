
function Engine (world, player) {
    this.world  = world;
    this.player = player;
}

Engine.prototype.update = function(){
    this.updatePlayerInfo();
    this.updateWorldInfo();
};

Engine.prototype.updatePlayerInfo = function () {

    var selector = $("#playerBasics"),
        html,
        before = new Array();

    selector.find("tbody tr").each(function(){
        var elem = $(this).find("td");
        before[$(elem[0]).html().toLowerCase()] = $(elem[1]).html();
        console.log(before);
    });

    selector.html("");
    for (var stat in player.basics) {
        html = ("<td>" + stat.charAt(0).toUpperCase() + stat.slice(1) + "</td>");
        html +=("<td>" + player.basics[stat] + "</td>");

        if (player.basics[stat] < before[stat] && typeof player.basics[stat] === 'number') {
            selector.append("<tr class='decreased'>" + html + "</tr>");
        } else if (player.basics[stat] > before[stat] && typeof player.basics[stat] === 'number') {
            selector.append("<tr class='increased'>" + html + "</tr>");
        } else {
            selector.append("<tr class='normal'>" + html + "</tr>");
        }
    }

    selector = $("#playerStats")

    selector.find("tbody tr").each(function(){
        var elem = $(this).find("td");
        before[$(elem[0]).html().toLowerCase()] = $(elem[1]).html();
        console.log(before);
    });

    selector.html("");
    for (stat in player.attributes) {
        html = ("<td>" + stat.charAt(0).toUpperCase() + stat.slice(1) + "</td>");
        html +=("<td>" + player.attributes[stat].toFixed(3).replace(/0{0,2}$/, "") + "</td>");

        if (player.attributes[stat] < before[stat]) {
            selector.append("<tr class='decreased'>" + html + "</tr>");
        } else if (player.attributes[stat] > before[stat]) {
            selector.append("<tr class='increased'>" + html + "</tr>");
        } else {
            selector.append("<tr class='normal'>" + html + "</tr>");
        }
    }

    selector = $("#playerHealth");

    selector.find("tbody tr").each(function(){
        var elem = $(this).find("td");
        before[$(elem[0]).html().toLowerCase()] = $(elem[1]).html();
        console.log(before);
    });

    selector.html("");
    for (stat in player.vitalPoints) {
        html = ("<td>" + stat.charAt(0).toUpperCase() + stat.slice(1) + "</td>");
        html +=("<td>" + player.vitalPoints[stat].toFixed(3).replace(/0{0,2}$/, "") + "</td>");

        if (player.vitalPoints[stat] < before[stat]) {
            selector.append("<tr class='decreased'>" + html + "</tr>");
        } else if (player.vitalPoints[stat] > before[stat]) {
            selector.append("<tr class='increased'>" + html + "</tr>");
        } else {
            selector.append("<tr class='normal'>" + html + "</tr>");
        }
    }

    selector.find("tbody").each(function (elem){
        console.log(elem);
    });
};

Engine.prototype.updateWorldInfo = function () {
    var selector = $("#worldStandard"),
        html;

    selector.html("");
    for (var stat in world.standard) {
        html = ("<td>" + stat.charAt(0).toUpperCase() + stat.slice(1) + "</td>");
        html +=("<td>" + world.standard[stat] + "</td>");

        if (player.basics[stat] < 0) {
            selector.append("<tr class='decreased'>" + html + "</tr>");
        } else {
            selector.append("<tr class='normal'>" + html + "</tr>");
        }
    }
};

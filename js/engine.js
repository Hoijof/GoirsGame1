
function Engine (world, player) {
    this.world  = world;
    this.player = player;
}

Engine.prototype.update = function(){
    this.updatePlayerInfo();
    this.updateWorldInfo();
    this.updateMainInfo();
};

Engine.prototype.updatePlayerInfo = function () {

    var selector = $("#playerBasics"),
        html,
        before = [];

    selector.find("tbody tr").each(function(){
        var elem = $(this).find("td");
        var name = $(elem[0]).html();
        name = name.charAt(0).toLowerCase() + name.slice(1);
        before[name] = $(elem[1]).html();
    });

    selector.html("");
    for (var stat in player.basics) {
        html = ("<td>" + stat.charAt(0).toUpperCase() + stat.slice(1) + "</td>");

        if (typeof player.basics[stat] === 'number') {
            html +=("<td>" + parseInt(player.basics[stat]) + "</td>");

            if (player.basics[stat] < before[stat]) {
                selector.append("<tr class='decreased'>" + html + "</tr>");
            } else if (player.basics[stat] > before[stat] && typeof player.basics[stat] === 'number') {
                selector.append("<tr class='increased'>" + html + "</tr>");
            } else {
                selector.append("<tr class='normal'>" + html + "</tr>");
            }
        } else {
            html +=("<td>" + player.basics[stat] + "</td>");
            if (String(player.basics[stat]) != before[stat]) {
                selector.append("<tr class='increased'>" + html + "</tr>");
            } else {
                selector.append("<tr class='normal'>" + html + "</tr>");
            }
        }
    }

    selector = $("#playerStats");
    var pointsFree = player.getPointsFree();

    if (pointsFree > 0) $("#headerStats").html(PLAYER_BASICS + " <span style='color:green;'>+"+ pointsFree+"</span>");
    else $("#headerStats").html(PLAYER_BASICS);

    selector.find("tbody tr").each(function(){
        var elem = $(this).find("td");
        var name = $(elem[0]).html();
        name = name.charAt(0).toLowerCase() + name.slice(1);
        before[name] = $(elem[1]).html();
    });

    selector.html("");
    for (stat in player.attributes) {
        html = ("<td>" + stat.charAt(0).toUpperCase() + stat.slice(1) + "</td>");
        html +=("<td>" + parseInt(player.attributes[stat]) + "</td>");
        if(pointsFree) html +=("<td class='addPoint'>+</td>");

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
        var name = $(elem[0]).html();
        name = name.charAt(0).toLowerCase() + name.slice(1);
        before[name] = $(elem[1]).html();
    });

    selector.html("");
    for (stat in player.vitalPoints) {
        html = ("<td>" + stat.charAt(0).toUpperCase() + stat.slice(1) + "</td>");
        html +=("<td>" + parseInt(player.vitalPoints[stat]) + "</td>");

        if (player.vitalPoints[stat] < before[stat]) {
            selector.append("<tr class='decreased'>" + html + "</tr>");
        } else if (player.vitalPoints[stat] > before[stat]) {
            selector.append("<tr class='increased'>" + html + "</tr>");
        } else {
            selector.append("<tr class='normal'>" + html + "</tr>");
        }
    }
};

Engine.prototype.updateWorldInfo = function () {
    var selector = $("#worldStandard"),
        before   = [],
        html;

    selector.find("tbody tr").each(function(){
        var elem = $(this).find("td");
        var name = $(elem[0]).html();
        name = name.charAt(0).toLowerCase() + name.slice(1);
        before[name] = $(elem[1]).html();
    });

    selector.html("");
    for (var stat in world.standard) {
        html = ("<td>" + stat.charAt(0).toUpperCase() + stat.slice(1) + "</td>");
        html +=("<td>" + world.standard[stat] + "</td>");

        if (world.standard[stat] < before[stat]) {
            selector.append("<tr class='decreased'>" + html + "</tr>");
        } else if (world.standard[stat] > before[stat]) {
            selector.append("<tr class='increased'>" + html + "</tr>");
        } else {
            selector.append("<tr class='normal'>" + html + "</tr>");
        }
    }
};

Engine.prototype.updateMainInfo = function () {
  if (view == null) {
      $("#mainView").html(outputHTML);
  } else {
      view.showContent();
  }
};

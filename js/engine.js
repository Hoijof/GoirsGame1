
function Engine (world, player) {
    this.world  = world;
    this.player = player;
}

Engine.prototype.update = function(){
    this.updatePlayerInfo();
    this.updateWorldInfo();
};

Engine.prototype.updatePlayerInfo = function () {
    var selector = $("#playerStats"),
        html;

    selector.html("");
    for (var stat in player.attributes) {
        html = ("<td>" + stat.charAt(0).toUpperCase() + stat.slice(1) + "</td>");
        html +=("<td>" + player.attributes[stat].toFixed(3).replace(/0{0,2}$/, "") + "</td>");

        selector.append("<tr>" + html + "</tr>");
    }

    selector = $("#playerHealth");
    selector.html("");
    for (stat in player.vitalPoints) {
        html = ("<td>" + stat.charAt(0).toUpperCase() + stat.slice(1) + "</td>");
        html +=("<td>" + player.vitalPoints[stat].toFixed(3).replace(/0{0,2}$/, "") + "</td>");

        if (player.vitalPoints[stat] < 0) {
            selector.append("<tr class='decreased'>" + html + "</tr>");
        } else {
            selector.append("<tr class='normal'>" + html + "</tr>");
        }
    }
};

Engine.prototype.updateWorldInfo = function () {

};
/*
function updateWorldInfo() {
    $("#info").html("");
    addDivToWorldInfo("Day : " + world.day);
    addDivToWorldInfo("Total Deaths : " + world.deaths);
    addDivToWorldInfo("Total Births : " + world.births);
    addDivToWorldInfo("Population : " + world.population);
    addDivToWorldInfo("Player health : " + player.basics.health.toFixed(2) + " level : " + player.basics.level + " victories " + player.basics.victories + " defeats : " + player.basics.defeats + " exp: " + player.basics.experience);
}

function updatePlayerInfo() {
    var div = $("#playerInfo");
    div.html("");

    div.append("<div>");
    div.append("<div>Strength : " + player.attributes.strength + "</div>");
    div.append("<div>Endurance : " + player.attributes.endurance + "</div>");
    div.append("<div>Intelligence : " + player.attributes.intelligence + "</div>");
    div.append("<div>Willpower : " + player.attributes.willpower + "</div>");
    div.append("<div>Agility : " + player.attributes.agility + "</div>");
    div.append("<div>Speed : " + player.attributes.speed + "</div>");
    div.append("<div>Stamina : " + player.attributes.stamina + "</div>");
    div.append("<div>Faith : " + player.attributes.faith + "</div>");
    div.append("<div>Head : " + player.vitalPoints.head + "</div>");
    div.append("<div>Body : " + player.vitalPoints.body + "</div>");
    div.append("<div>Left Arm : " + player.vitalPoints.leftArm + "</div>");
    div.append("<div>Right Arm : " + player.vitalPoints.rightArm + "</div>");
    div.append("<div>Left Leg : " + player.vitalPoints.leftLeg + "</div>");
    div.append("<div>Right Leg : " + player.vitalPoints.rightLeg + "</div>");
    div.append("</div>");
}*/
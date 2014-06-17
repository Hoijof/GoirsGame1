
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

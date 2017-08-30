(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function HtmlCreation() {}

HtmlCreation.createElem = function (elem, id, className, content, attributes) {
    return typeof attributes !== 'undefined' ? '<' + elem + ' id="' + id + '" class="' + className + '" ' + attributes + '>' + content + '</' + elem + '>' : '<' + elem + ' id="' + id + '" class="' + className + '">' + content + '</' + elem + '>';
};

HtmlCreation.createMonoElem = function (elem, id, className, attributes) {
    return typeof attributes !== 'undefined' ? '<' + elem + ' id="' + id + '" class="' + className + '" ' + attributes + '>' : '<' + elem + ' id="' + id + '" class="' + className + '">';
};

HtmlCreation.createHorizontalLine = function (className) {
    return typeof className !== 'undefined' ? '<hr class="' + className + '"/>' : '<hr/>';
};

HtmlCreation.createListFromObject = function (object, listId, listClass, translation) {
    var html = "<select id='" + listId + "' class='" + listClass + "'>";

    $.each(object, function (key, value) {
        html += "<option value='" + key + "'>" + translation[key] + "</option>";
    });

    return html + "</select>";
};

exports.default = HtmlCreation;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function attack(attacker, attacked) {

    var twoLegsDown = attacker.vitalPoints.rightLeg < 0 && attacker.vitalPoints.leftLeg < 0,
        zones = void 0,
        number = void 0,
        found = void 0,
        damage = void 0,
        legsOk = void 0,
        zoneToAttack = void 0,
        i = void 0,
        badHand = false;

    if (attacker.vitalPoints[attacker.basics.hand + "Arm"] <= 0 || twoLegsDown) {

        if (attacker.id === 0 || attacked.id === 0) {
            // gg.outputHTML += "<br>" + attacker.basics.name + " attacks with his bad hand.";
        }
        badHand = true;
        return;
    }
    // select the zone to attack
    zones = [];
    for (var zone in attacked.vitalPoints) {
        zones.push([zone, attacked.vitalPoints[zone]]);
    }zones.sort(function (a, b) {
        return b[1] - a[1];
    });
    //global check
    number = parseInt(attacker.attributes.intelligence / attacked.attributes.intelligence + ((attacker.basics.victories + attacker.basics.defeats + 1) / (attacked.basics.victories + attacked.basics.defeats + 1)).map(0, 8, 0, 8));
    number += getRandomInt(-1, 1);
    if (number > 5) number = 5;
    if (number < 0) number = 0;
    zoneToAttack = zones[number];

    // progressive check
    found = false;
    i = 1;

    while (!found && number - i > 0) {
        if (attacked.vitalPoints[zoneToAttack[0]] > 0) found = true;else {
            zoneToAttack = zones[number - i];
            ++i;
        }
    }

    // damage and dodge
    damage = 0.0;
    var dodges = false;

    //chance to dodge
    legsOk = attacked.vitalPoints.leftLeg > 0 && attacker.vitalPoints.rightLeg > 0;

    if (attacked.attributes.agility / attacker.attributes.agility + getRandomInt(-2, 2) > 5 && legsOk) {
        // TODO: take a look at it
        if (attacker.id === 0 || attacked.id === 0) {
            // gg.outputHTML += "<br>" + attacker.basics.name + " attacks in the " + zoneToAttack[0] + " of " + attacked.basics.name + " but misses.";
            gg.totals.dodges++;
        }
    } else {
        damage = ((attacker.attributes.strength * 0.25 - attacked.attributes.endurance * 0.10 + (attacker.attributes.agility * 0.15 - attacked.attributes.agility * 0.10)) * getRandom(0.8, 1.1)).toFixed(3);
        if (damage < 0) damage = 0;
        if (badHand) damage *= 0.6;
        attacked.vitalPoints[zoneToAttack[0]] -= damage;
        gg.totals.attacks++;
        if (attacker.id === 0 || attacked.id === 0) {
            // gg.outputHTML += "<br>" + attacker.basics.name + " attacks in the " + zoneToAttack[0] + " of " + attacked.basics.name + " and deals " + damage + " points of damage. That part has " + attacked.vitalPoints[zoneToAttack[0]].toFixed(3) + " health points left.";
        }
    }
}

function attackingFirstCheck(attacker, attacked) {
    var check = attacker.attributes.agility - attacked.attributes.agility + 50 + getRandomInt(-10, 10);
    return isAppening(check);
}

function survivalCheck(entity) {

    var check = entity.attributes.willpower * 0.6 + entity.attributes.faith * 0.2 + getRandomInt(-5, 5);

    if (entity.id === 0) {
        check += 10;
    }

    var res = isAppening(check);

    if (res) {
        gg.totals.survivals++;
    } else {
        gg.totals.deaths++;
    }

    return res;
}

function isDying(entity) {
    return (entity.vitalPoints.body <= 0 || entity.vitalPoints.head <= 0) && isAppening(95);
}

function dailyHealingEntity(entity) {
    var toHeal = (entity.attributes.endurance * 0.15 + entity.attributes.stamina * 0.15 + entity.attributes.willpower * 0.4 + entity.attributes.faith * 0.2) / 2;
    for (var part in entity.vitalPoints) {
        entity.vitalPoints[part] += toHeal;
        if (entity.vitalPoints[part] > MAX_ENTITY_HEALTH) entity.vitalPoints[part] = MAX_ENTITY_HEALTH;
    }
}

function giveExperience(reciver, other, modificator) {
    //let exp = Math.round( 2*3*((1.055^other.basics.level) + 8 + (1.055^(other.basics.level^1.085))))*modificator;
    var levelDifference = reciver.basics.level - other.basics.level,
        exp = 0;
    if (levelDifference >= 0) {
        exp = Math.round(reciver.basics.level * 5 - Math.pow(levelDifference, 2) * modificator);
    } else {
        exp = Math.round(reciver.basics.level * 10 + Math.pow(Math.abs(levelDifference), 2) * modificator);
    }

    if (exp < reciver.basics.level * 5 * modificator) exp = reciver.basics.level * 5 * modificator;
    // console.log(modificator + "level 1 : " + reciver.basics.level + " level 2 : " + other.basics.level + " exp " + exp);
    reciver.basics.experience += parseInt(exp);

    checkLevelUp(reciver);
}

function calculatePercentages(entity) {
    var i = void 0,
        tmpPercentages = [];

    for (i = 0; i < WARRIOR_TYPES[entity.basics.class].length; ++i) {
        tmpPercentages[i] = entity.attributes[getKeyFromNumber(entity.attributes, i)] / entity.basics.level;
    }

    return tmpPercentages;
}

function incrementLowestPercentage(entity) {
    var basePercentages = WARRIOR_TYPES[entity.basics.class],
        i = void 0,
        updated = false,
        tmpPercentages = calculatePercentages(entity);

    if (getRandomInt(0, 1)) {
        for (i = 0; i < basePercentages.length - 1; ++i) {
            if (basePercentages[i] > tmpPercentages[i]) {
                entity.attributes[getKeyFromNumber(entity.attributes, i)]++;
                updated = true;
                break;
            }
        }
    } else {
        for (i = basePercentages.length - 2; i >= 0; --i) {
            if (basePercentages[i] > tmpPercentages[i]) {
                entity.attributes[getKeyFromNumber(entity.attributes, i)]++;
                updated = true;
                break;
            }
        }
    }
    if (!updated) {
        entity.attributes[getRandomAttributeName(i)]++;
    }
}

function checkLevelUp(entity) {
    var pointsFree = entity.getPointsFree();

    if (entity.id > 0 || gg.settings.autoLevelUp) {
        for (pointsFree; pointsFree > 0; pointsFree--) {
            incrementLowestPercentage(entity);
            entity.basics.level++;
            entity.levelUp();
        }
    }
}

function getRandomAttributeName() {
    var rand = getRandomInt(0, 7);
    switch (rand) {
        case 0:
            return "strength";
            break;
        case 1:
            return "endurance";
            break;
        case 2:
            return "intelligence";
            break;
        case 3:
            return "willpower";
            break;
        case 4:
            return "agility";
            break;
        case 5:
            return "speed";
            break;
        case 6:
            return "stamina";
            break;
        case 7:
            return "faith";
            break;
    }
}

exports.default = {
    attack: attack,
    attackingFirstCheck: attackingFirstCheck,
    isDying: isDying,
    dailyHealingEntity: dailyHealingEntity,
    giveExperience: giveExperience,
    calculatePercentages: calculatePercentages,
    incrementLowestPercentage: incrementLowestPercentage,
    checkLevelUp: checkLevelUp,
    getRandomAttributeName: getRandomAttributeName,
    survivalCheck: survivalCheck
};

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// PROTOTYPES

Array.prototype.size = function () {
    return this.filter(function (a) {
        return a !== undefined;
    }).length;
};

Object.size = function (obj) {
    var size = 0,
        key = void 0;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

$.fn.refresh = function () {
    return $(this.selector);
};

var getRandomProperty = function getRandomProperty(obj) {
    var keys = Object.keys(obj);
    return obj[keys[keys.length * Math.random() << 0]];
};

var getRandomKey = function getRandomKey(obj) {
    var keys = Object.keys(obj);
    return keys[keys.length * Math.random() << 0];
};

function getKeyFromNumber(obj, key) {
    var keys = Object.keys(obj);
    return keys[key];
}

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

// FUNCTIONS

function formatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}

function isAppening(prob) {
    return getRandomInt(0, 100) <= prob;
}

function getDocumentRot(keyWord) {
    var baseUrl = document.location.href.split("/");
    do {
        baseUrl.splice(-1, 1);
    } while (baseUrl[baseUrl.length - 1] != keyWord);
    return baseUrl.join('/');
}

function loadjsfile(filename) {
    var rnd = Math.floor(Math.random() * 80000);
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename + "?r=" + rnd); // note this line
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandom(min, max) {
    return Math.random() * (max - min + 1) + min;
}

function getRandomCitizenName(sex) {
    if (sex === 'male') {
        return maleNames[getRandomInt(0, maleNames.length - 1)];
    } else if (sex === 'female') {
        return femaleNames[getRandomInt(0, femaleNames.length - 1)];
    }
    return 'Bernt';
}

function getRandomCitizenSurname() {
    return surnames[getRandomInt(0, surnames.length - 1)];
}

function getRandomTownName() {
    if (isAppening(33)) return townNames[getRandomInt(0, townNames.length - 1)];
    return townFirstNames[getRandomInt(0, townFirstNames.length - 1)] + townSecondNames[getRandomInt(0, townSecondNames.length - 1)];
}

function getDateFromTime(time) {
    var year = void 0,
        month = void 0,
        day = void 0;

    year = time / (daysInAMonth * monthsInAYear);
    month = time % (daysInAMonth * monthsInAYear);
    day = month % daysInAMonth;
    month /= daysInAMonth;

    return formatNumberLength(Math.floor(day + 1), 2) + "-" + formatNumberLength(Math.floor(month + 1), 2) + "-" + formatNumberLength(Math.floor(year), 4);
}

function getAgeFromTime(time) {
    var age = gg.world.getActualTime() - time;
    age = age / (daysInAMonth * monthsInAYear);

    return Math.floor(age);
}

// meh
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest !== "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}

function readFile(fileName) {
    if (FileReader) {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            var url = 'http://ivy-corp.com/src/data/' + fileName;

            var request = createCORSRequest('GET', url);
            if (request) {
                request.onload = function () {
                    var surnames = request.response;
                    //console.log(surnames);
                    return 'pedrinn';
                };
                request.send();
            }
        } else {
            alert('The File APIs are not fully supported by your browser.');
        }
    } else {
        console.log('Your browser doesn\'t support the FileReader functionality of HTML5, you\'re not suited to be' + 'part of the testing team, sorry');
    }
}

exports.default = {
    getRandomInt: getRandomInt,
    isAppening: isAppening,
    getRandomProperty: getRandomProperty,
    getRandomKey: getRandomKey,
    getRandom: getRandom,
    getRandomCitizenName: getRandomCitizenName,
    getRandomCitizenSurname: getRandomCitizenSurname,
    getDateFromTime: getDateFromTime,
    getAgeFromTime: getAgeFromTime,
    getKeyFromNumber: getKeyFromNumber
};

},{}],4:[function(require,module,exports){
"use strict";

jQuery.fn.center = function (parent) {
    if (parent) {
        parent = this.parent();
    } else {
        parent = window;
    }
    this.css({
        "position": "absolute",
        "top": ($(parent).height() - this.outerHeight()) / 2 + $(parent).scrollTop() + "px",
        "left": ($(parent).width() - this.outerWidth()) / 2 + $(parent).scrollLeft() + "px"
    });

    return this;
};

},{}],5:[function(require,module,exports){
'use strict';

var _Terminal = require('./classes/Terminal');

var _Terminal2 = _interopRequireDefault(_Terminal);

var _Entity = require('./classes/Entity');

var _Entity2 = _interopRequireDefault(_Entity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by humberto.gomez on 25/06/2014.
 */

$(document).ready(function () {
    var jqSelTerminalText = $("#terminalTextInput"),
        jqSelTerminal = $("#terminal"),
        jqSelTerminalTextArea = $("#terminalTextAreaInput");
    Math.seedrandom();

    gg.terminal = new _Terminal2.default(jqSelTerminal, jqSelTerminalText, jqSelTerminalTextArea, false);

    gg.initGameUI();

    gg.engine.update();

    var ctrlDown = false,
        shiftDown = false;
    var ctrlKey = 17,
        vKey = 86,
        cKey = 67;

    $(document).keydown(function (e) {
        if (e.keyCode === ctrlKey) ctrlDown = true;
    }).keyup(function (e) {
        if (e.keyCode === ctrlKey) ctrlDown = false;
        if (e.ctrlKey && e.keyCode === 77) gg.terminal.toggleVisibility();
        if (e.ctrlKey && e.keyCode === 32) $("#advance").click();
    });

    $(document).keypress(function (e) {
        if (e.keyCode === 10) {}
    });

    $("#advance").on("click", function () {
        Math.seedrandom();
        gg.ticking.active = !gg.ticking.active;
        gg.tick();
        // gg.engine.update();
    });

    $("#rollPlayer").on("click", function () {
        gg.player = new _Entity2.default(0);
        gg.player.name = "Hoijof";
        gg.player.surname = "Golpeo";
        gg.player.setAllStatsToValue(100);
        gg.world.addPerson(gg.player);
        gg.engine.update();
    });

    $(".header").on("click", function () {
        $(this).next().toggle();
    });

    jqSelTerminalText.on("keydown", function (event) {
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
    }).keypress(function (e) {
        if (event.keyCode === 13) {
            gg.terminal.handleCommand($(this).val());
            $(this).val("");
        } else if (e.keyCode === 10) {
            return false;
        }
    });

    jqSelTerminal.on("mouseup", function () {
        if (window.getSelection().type !== "Range") {
            gg.terminal.focusInput();
        }
        return true;
    });

    jqSelTerminalTextArea.on("keydown", function (event) {
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
    }).keypress(function (e) {
        if (event.keyCode === 10) {
            gg.terminal.handleCommand($(this).val());
            $(this).val("");
        }
    });

    $(document).on("click", ".addPoint", function () {
        var entity = gg.player,
            pointsFree = entity.getPointsFree();

        if (pointsFree > 0) {
            var siblings = $(this).siblings();
            entity.addPointsToAttribute(1, siblings.first().html().toLowerCase());
        }

        gg.engine.updatePlayerInfo();
    });

    $("#buttongoirs").on("click", function () {
        for (var i = 0; i <= 120; i += 1) {
            var things = Math.round(450 * 10 + Math.pow(i, 2));
            console.log(things);
        }
    });
});

},{"./classes/Entity":6,"./classes/Terminal":9}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function Entity(id, playerClass) {

    // Stats

    this.id = id;
    this.type = WARRIOR_TYPES[getRandomInt(0, WARRIOR_TYPES.length)];

    this.basics = {
        name: 0,
        surname: 0,
        sex: 0,
        class: typeof playerClass !== 'undefined' ? playerClass : null,
        isDead: false,
        hand: null,
        level: 0,
        fights: 0,
        victories: 0,
        defeats: 0,
        avoidedDeath: 0,
        coins: 0,
        experience: 1,
        nextLevel: 15
    };

    this.attributes = {
        strength: 0,
        endurance: 0,
        intelligence: 0,
        willpower: 0,
        agility: 0,
        speed: 0,
        stamina: 0,
        faith: 0
    };

    this.vitalPoints = {
        head: MAX_ENTITY_HEALTH,
        body: MAX_ENTITY_HEALTH,
        leftArm: MAX_ENTITY_HEALTH,
        rightArm: MAX_ENTITY_HEALTH,
        leftLeg: MAX_ENTITY_HEALTH,
        rightLeg: MAX_ENTITY_HEALTH
    };

    this.init();
}

Entity.prototype.getPointsFree = function () {
    //console.log("entering with id : " + this.id);
    var pointsFree = 0;
    var temporalLevelUp = this.basics.nextLevel;
    //if(this.id == 0)console.log("Experience : " + this.basics.experience);
    while (Math.floor(this.basics.experience) >= temporalLevelUp) {
        //if(this.id==0)console.log(temporalLevelUp);
        if (this.basics.level > 250) {
            temporalLevelUp = Math.floor(temporalLevelUp + temporalLevelUp * 0.1);
        } else {
            temporalLevelUp = Math.floor(temporalLevelUp + temporalLevelUp * 0.1);
        }
        ++pointsFree;
    }

    return pointsFree;
};

Entity.prototype.levelUp = function () {
    if (this.basics.experience > this.basics.nextLevel) {
        if (this.basics.level > 250) {
            this.basics.nextLevel = Math.floor(this.basics.nextLevel + this.basics.nextLevel / 8);
        } else {
            this.basics.nextLevel = Math.floor(this.basics.nextLevel + this.basics.nextLevel / 8);
        }
    }
};

Entity.prototype.init = function () {
    this.basics.isDead = false;
    this.basics.sex = isAppening(50) ? "male" : "female";
    this.basics.class = this.basics.class === null ? getRandomKey(WARRIOR_TYPES) : this.basics.class;
    this.basics.name = getRandomCitizenName(this.basics.sex);
    this.basics.surname = getRandomCitizenSurname();
    this.basics.level = 8;
    this.basics.hand = isAppening(60) ? "right" : "left";
    this.basics.victories = 0;
    this.basics.defeats = 0;
    this.basics.experience = 100;
    this.basics.coins = this.getBaseCoins();

    this.attributes.strength = 1;
    this.attributes.endurance = 1;
    this.attributes.intelligence = 1;
    this.attributes.willpower = 1;
    this.attributes.agility = 1;
    this.attributes.speed = 1;
    this.attributes.stamina = 1;
    this.attributes.faith = 1;

    // this.getBaseExperience();
    // console.log(this.basics.experience);
    checkLevelUp(this);
};

Entity.prototype.getBaseExperience = function () {
    var num = getRandomInt(0, 100);

    if (num > 100 - 3) {
        this.basics.experience = getRandomInt(2000000, 3199629);
    } else if (num > 100 - 15) {
        this.basics.experience = getRandomInt(1000000, 2000000);
    } else if (num > 100 - 25) {
        this.basics.experience = getRandomInt(500000, 1000000);
    } else if (num > 100 - 35) {
        this.basics.experience = getRandomInt(250000, 500000);
    } else if (num > 100 - 45) {
        this.basics.experience = getRandomInt(100000, 250000);
    } else if (num > 100 - 50) {
        this.basics.experience = getRandomInt(50000, 100000);
    } else {
        this.basics.experience = getRandomInt(0, 50000);
    }

    this.basics.experience /= 1000;
};

Entity.prototype.setAllStatsToValue = function (value) {
    this.attributes.strength = value;
    this.attributes.strength = value;
    this.attributes.endurance = value;
    this.attributes.intelligence = value;
    this.attributes.willpower = value;
    this.attributes.agility = value;
    this.attributes.speed = value;
    this.attributes.stamina = value;
    this.attributes.faith = value;
};
Entity.prototype.generateStat = function (stat) {
    var result = void 0;

    switch (stat) {
        case "strength":
            result = getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "endurance":
            result = getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "intelligence":
            result = getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "willpower":
            result = getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "agility":
            result = getRandomInt(3, 100);
            return result;
            break;
        case "speed":
            result = getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "stamina":
            result = getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "faith":
            result = getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
    }
};

Entity.prototype.addPointsToAttribute = function (points, attribute) {
    if (this.attributes[attribute] + points <= MAX_ATTRIBUTE_LEVEL && this.attributes[attribute] + points >= 0) {
        this.attributes[attribute] += points;
        for (var i = 0; i < points; ++i) {
            this.levelUp();
        }this.basics.level += points;
    }
};

Entity.prototype.fightAgainstEntity = function (enemy) {
    var timesFirst = 0;
    var timesSecond = 0;
    var turns = 0;

    if (this.id === 0 || enemy.id === 0) {
        gg.outputHTML += "<br>" + "A fight between ---- " + this.id + this.basics.name + " ---- and ----- " + enemy.id + enemy.basics.name + " ----- is going to start";
        this.report();
        enemy.report();
    }

    while (!isDying(this) && !isDying(enemy) && turns < MAX_BATTLE_TURNS) {
        var attacker = void 0,
            attacked = void 0;
        if (attackingFirstCheck(this, enemy)) {
            // Check who attacks first
            attacker = this;
            attacked = enemy;
            timesFirst++;
        } else {
            attacker = enemy;
            attacked = this;
            timesSecond++;
        }

        attack(attacker, attacked);
        if (!isDying(this) && !isDying(enemy)) {
            attack(attacked, attacker);
        }

        turns++;
    }
    if (this.id === 0 || enemy.id === 0) {
        gg.outputHTML += "<br>" + "Fight lasted " + turns + " turns";
        gg.outputHTML += "<br>" + this.basics.name + " attacked first " + timesFirst + " times and " + timesSecond + " times second";
    }

    this.basics.fights++;
    enemy.basics.fights++;

    if (isDying(this)) {
        this.basics.defeats++;
        enemy.basics.victories++;

        if (this.id === 0 || enemy.id === 0) {
            gg.outputHTML += "<br>" + enemy.basics.name + " Wins.";
        }

        giveExperience(enemy, this, EXPERIENCE_WIN_FACTOR);
        giveExperience(this, enemy, EXPERIENCE_LOSS_FACTOR);

        enemy.stealCoins(this);

        return "defeat";
    } else {
        if (isDying(enemy)) {
            enemy.basics.defeats++;
            this.basics.victories++;
            if (this.id === 0 || enemy.id === 0) {
                gg.outputHTML += "<br>" + this.basics.name + " Wins.";
            }

            giveExperience(this, enemy, EXPERIENCE_WIN_FACTOR);
            giveExperience(enemy, this, EXPERIENCE_LOSS_FACTOR);

            this.stealCoins(enemy);

            return "victory";
        } else {
            if (this.id === 0 || enemy.id === 0) {
                gg.outputHTML += "<br>" + "Nobody wins";
            }

            giveExperience(enemy, this, EXPERIENCE_LOSS_FACTOR);
            giveExperience(this, enemy, EXPERIENCE_LOSS_FACTOR);
            return "draw";
        }
    }
};

Entity.prototype.earnPassiveExp = function () {
    this.basics.experience += this.basics.experience * 0.01;
};

Entity.prototype.levelUpAsType = function (type) {
    for (var i = 0; i < FIGHTER_TYPES[type].length; i++) {
        gg.outputHTML += "<br>" + FIGHTER_TYPES[i];
    }
};

Entity.prototype.report = function () {
    var basePercentages = WARRIOR_TYPES[this.basics.class],
        percentages = calculatePercentages(this, basePercentages),
        i = void 0;

    gg.outputHTML += "<br>" + "---------------------------------------------------------------------------------------";
    gg.outputHTML += "<br>" + "Starting report of Entity with id = " + this.id + " and name = " + this.basics.name + " and level of " + this.basics.level;
    gg.outputHTML += "<br>" + "---- BASICS REPORT ----";
    $.each(this.basics, function (key, val) {
        gg.outputHTML += "<br>" + key + " = " + val;
    });
    /*gg.outputHTML += "<br>" + "---- ATTRIBUTES REPORT ----";
    $.each(this.attributes, function(key, val) {
        gg.outputHTML += "<br>" + key + " = " + val;
    });
    gg.outputHTML += "<br>" + "End of Attributes Report";
     gg.outputHTML += "<br>" + "PERCENTAGES";
    for (i = 0; i < basePercentages.length; ++i) {
        gg.outputHTML += "<br>" + String(basePercentages[i] - percentages[i]);
    }*/

    // gg.outputHTML += "<br>" + "---------------------------------------------------------------------------------------";
};

// Coins
Entity.prototype.getBaseCoins = function () {
    return 50;
};

Entity.prototype.stealCoins = function (objective) {
    //base case TODO: Add concealed money.
    this.basics.coins += objective.basics.coins;
    objective.basics.coins = 0;
};

Entity.prototype.earnPassiveCoins = function () {
    this.basics.coins += 5;
};

exports.default = Entity;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Quest = {};

exports.default = Quest;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Quest = require('./Quest');

var _Quest2 = _interopRequireDefault(_Quest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuestManager = {
    init: function init() {
        this.quests = [];

        return this;
    },
    createQuest: function createQuest() {
        var quest = Object.create(_Quest2.default);

        quest.id = this.addQuest(quest);

        return quest;
    },
    addQuest: function addQuest(quest) {
        this.quests.push(quest);

        return this.quests.length - 1;
    }
};

exports.default = QuestManager;

},{"./Quest":7}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function Terminal(consoleSelector, inputText, inputTextArea, isActive) {
    this.jqSelTerminal = consoleSelector;
    this.jqSelTerminalText = inputText;
    this.jqSelTerminalTextArea = inputTextArea;

    this.consoleActualTrace = 0;
    this.consoleTrace = [];

    this.isActive = isActive;

    this.LINE_SIZE = 122;

    this.init();
}

Terminal.prototype.init = function () {
    if (this.isActive) {
        this.jqSelTerminal.show();
    } else {
        this.jqSelTerminal.hide();
    }

    this.consoleTrace.push("Hello .D");
    this.consoleActualTrace = 1;

    this.jqSelTerminal.css('left', $(window).width() / 2 - 350);
    $(window).resize(function () {
        $('#terminal').css('left', $(window).width() / 2 - 350);
    });
};

Terminal.prototype.focusInput = function () {
    if (this.jqSelTerminalText.css("display") !== "none") {
        this.jqSelTerminalText.focus();
    } else {
        this.jqSelTerminalTextArea.focus();
    }
};

Terminal.prototype.toggleVisibility = function () {
    this.jqSelTerminal.toggle();
    this.focusInput();
};

Terminal.prototype.handleCommand = function (command, modificator) {
    if (command === "") return;
    command = command.toLowerCase();

    this.addContentToTerminal(command);

    var message = "";

    if (this.consoleTrace[this.consoleTrace.length - 1] !== command) {
        this.consoleTrace.push(command);
        this.consoleActualTrace = this.consoleTrace.length;
    }

    command = command.split(" ");

    var that = this;

    var cases = {
        clear: function clear() {
            that.jqSelTerminal.find("div").remove();
        },
        color: function color() {
            var usage = "Changes backround color and text color of the terminal.\n Usage: color [options] background-color color";
            if (typeof command[1] === 'undefined' && typeof command[2] === 'undefined') {
                message = usage;
                return;
            }
            var bc = command[1].charAt(0).toUpperCase() + command[1].slice(1),
                c = command[2].charAt(0).toUpperCase() + command[2].slice(1);

            if (CSS_COLOR_NAMES.indexOf(bc) > -1) {
                that.jqSelTerminal.css("background-color", bc);
                that.jqSelTerminal.find("input").css("background-color", bc);
            } else {
                message = usage + "\n Background color doesn't exists";
            }

            if (CSS_COLOR_NAMES.indexOf(c) > -1) {
                that.jqSelTerminal.css("color", c);
                that.jqSelTerminal.find("input").css("color", c);
            } else {
                message = usage + "\n Color doesn't exists";
            }
        },
        list: function list() {
            var casesSub = {
                commands: function commands() {
                    $.each(cases, function (key, value) {
                        if (key !== "_default") message += key + ", ";
                    });
                    message = message.substring(0, message.length - 2);
                },
                cssColors: function cssColors() {
                    for (var _i = 0; _i < CSS_COLOR_NAMES.length; ++_i) {
                        message += CSS_COLOR_NAMES[_i] + ", ";
                    }
                    message = message.substring(0, message.length - 2);
                },
                _default: function _default() {
                    message = "Option " + command[1] + " not recognized \n We recognize the following listable items: ";
                    $.each(casesSub, function (key, value) {
                        if (key !== "_default") message += key + ", ";
                    });
                }
            };
            casesSub[command[1]] ? casesSub[command[1]]() : casesSub._default();
        },
        show: function show() {
            var casesSub = {
                letiable: function letiable() {
                    message += window[command[2]];
                },
                _default: function _default() {
                    message = "Option " + command[1] + " not recognized \n We recognize the following showable items: ";
                    $.each(casesSub, function (key, value) {
                        if (key !== "_default") message += key + ", ";
                    });
                }
            };

            casesSub.let = casesSub.letiable;
            casesSub[command[1]] ? casesSub[command[1]]() : casesSub._default();
        },
        reload: function reload() {
            location.reload();
        },
        execute: function execute() {
            var usage = "Execute the code passed as argument \n Usage: execute [options] language code \n You can insert" + " the code with spaces, we handel it ;). \n We can execute the following languages: ";

            var casesSub = {
                javascript: function javascript() {
                    var code = "";
                    for (var _i2 = 2; _i2 < command.length; ++_i2) {
                        code += " " + command[_i2];
                    }

                    console.log(code);
                    code = code.split(1, code.length);

                    console.log(code);
                    code = "try{" + code + "}catch(e){message = e.message}";
                    eval(code);
                },
                css: function css() {
                    var code = "",
                        selectors = void 0;

                    for (var _i3 = 2; _i3 < command.length; ++_i3) {
                        code += " " + command[_i3];
                    }
                    code = code.split(1, code.length);
                    code = code.replace("&&this&&", that.jqTSelConsole);

                    code = code.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, "");
                    selectors = code.split(/{(?:[\s\S]*?)}/);
                    code = code.split("}");

                    for (i = 0; i < code.length - 1; i++) {
                        code[i] = code[i].replace(/.*{/, "");
                        code[i] = code[i].split(";");
                        for (var _j = 0; _j < code[i].length - 1; _j++) {
                            code[i][_j] = code[i][_j].split(":");
                        }
                    }

                    for (i = 0; i < code.length - 1; i++) {
                        var object = {};
                        for (j = 0; j < code.length - 1; j++) {
                            object[code[i][j][0].replace(/^\s\s*/, '').replace(/\s\s*$/, '')] = code[i][j][1].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                        }
                        $(selectors[i]).css(object);
                    }
                },
                _default: function _default() {
                    message = usage;
                }
            };

            $.each(casesSub, function (key, value) {
                if (key !== "_default") usage += key + ", ";
            });

            if (typeof command[1] === 'undefined' && typeof command[2] === 'undefined') {
                message = usage;
                return;
            }

            message = "ok";

            casesSub.js = casesSub.javascript;
            casesSub[command[1]] ? casesSub[command[1]]() : casesSub._default();
        },
        goto: function goto() {
            var usage = "Goes to the defined url \n Usage: goto [options] url";
            if (typeof command[1] !== 'undefined') {
                if (command[1].substring(0, 7) === "http://") {
                    window.location = command[1];
                } else {
                    window.location = "http://" + command[1];
                }
            } else message = usage;
        },
        special: function special() {
            var usage = "Does special things ;). \n Usage: special [options] option \n You can activate the following special features: ";
            var casesSub = {
                editmode: function editmode() {
                    if (command[2] === "on") {
                        document.body.contentEditable = 'true';
                        document.designMode = 'on';
                        message = "Now you can edit any content in the page .D";
                    } else if (command[2] === "off") {
                        document.body.contentEditable = 'false';
                        document.designMode = 'off';
                    } else {
                        if (document.body.contentEditable === "true") {
                            document.body.contentEditable = 'false';
                            document.designMode = 'off';
                        } else {
                            document.body.contentEditable = 'true';
                            document.designMode = 'on';
                            message = "Now you can edit any content in the page .D";
                        }
                    }
                },
                _default: function _default() {
                    message = usage;
                }
            };

            $.each(casesSub, function (key, value) {
                if (key !== "_default") usage += key + ", ";
            });

            casesSub[command[1]] ? casesSub[command[1]]() : casesSub._default();
        },
        input: function input() {
            that.jqSelTerminalTextArea.toggle();
            that.jqSelTerminalText.toggle();

            if (that.jqSelTerminalTextArea.css("display") !== "none") {
                message += "Area Mode, remember to send commands with ctrl + enter";
            }
            that.focusInput();
        },
        _default: function _default() {
            message = "Command " + command[0] + " not recognized. Use \"list command\" for a list of all the available commands";
        }
    };

    cases.exec = cases.exe = cases.ex = cases.execute;
    cases.clr = cases.clear;

    cases[command[0]] ? cases[command[0]]() : cases._default();

    message = message.split("\n");
    for (var _i4 = 0; _i4 < message.length; _i4++) {
        this.addContentToTerminal(message[_i4]);
    }

    if (this.jqSelTerminalText.position().top > this.jqSelTerminal.height()) this.jqSelTerminalText.css("top", this.jqSelTerminal.height());
};

Terminal.prototype.addContentToTerminal = function (text) {
    if (text === "") return;

    var numberOfMessages = Math.ceil(text.length / this.LINE_SIZE);
    for (var _i5 = 0; _i5 < numberOfMessages; _i5++) {
        this.jqSelTerminal.find("input").before("<div>" + text.substring(_i5 * this.LINE_SIZE, _i5 * this.LINE_SIZE + this.LINE_SIZE) + "</div>");
        if (this.jqSelTerminal.find('div').first().position().top < 10) this.jqSelTerminal.find('div').first().remove();
    }
    this.deleteExtraMessages();
};

Terminal.prototype.deleteExtraMessages = function () {
    //this.jqSelTerminalTextArea.css("height", ((this.jqSelTerminal.height() - this.jqSelTerminal.children().length * 20) + 40 > 20) ?  (this.jqSelTerminal.height() - this.jqSelTerminal.children().length * 20) + 40:20);
    this.jqSelTerminalText.focus().val("goirs").val("");
};

Terminal.prototype.showCurrentTrace = function () {
    this.jqSelTerminal.find("input").focus().val("").val(this.consoleTrace[this.consoleActualTrace]);
};
//adm@ww9

exports.default = Terminal;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _QuestManager = require('./QuestManager');

var _QuestManager2 = _interopRequireDefault(_QuestManager);

var _Entity = require('./Entity');

var _Entity2 = _interopRequireDefault(_Entity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function World() {
    this.player = null;

    this.standard = {
        day: 0,
        fights: 0,
        deaths: 0,
        births: 0,
        population: getRandomInt(WORLD_MIN_SIZE, WORLD_MAX_SIZE),
        fightsToday: 0,
        deathsToday: 0,
        birthsToday: 0,
        populationChange: 0
    };

    this.people = [];

    this.lastId = 0;

    this.questManager = Object.create(_QuestManager2.default).init();

    for (var i = 1; i < this.standard.population; i++) {
        this.addPerson(new _Entity2.default(i));
    }
}

World.prototype.callADay = function () {
    var report = true;

    this.standard.day++;

    var fightsToday = getRandomInt(this.standard.population * 0.1, this.standard.population / 2 * WORLD_FIGHT_FACTOR);

    gg.outputHTML += fightsToday + " fights to be done";

    this.updatePeopleHealth();

    this.givePassives();

    var fightResult = this.fight(fightsToday);

    this.standard.fightsToday = fightsToday;
    this.standard.fights += fightsToday;

    this.standard.deathsToday = fightResult.deathsToday;
    this.standard.deaths += fightResult.deathsToday;

    this.birthPeople();

    this.refreshPeople();

    this.standard.populationChange = this.people.size() - this.standard.population;
    this.standard.population = this.people.length = this.people.size();

    if (report) {
        gg.outputHTML += "<br> Deaths : " + fightResult.deathsToday + " " + "Victories : " + fightResult.todayVictories + " " + "Defeats : " + fightResult.todayDefeats + " " + "Draws : " + fightResult.todayDraws + " " + "Survivals : " + fightResult.survivalsToday;
    }
};

World.prototype.fight = function (fightsToday) {
    var res = {
        todayVictories: 0,
        survivalsToday: 0,
        todayDefeats: 0,
        todayDraws: 0,
        deathsToday: 0
    };

    for (var i = 0; i < fightsToday; ++i) {
        var attacker = this.getRandomPerson(undefined);
        if (attacker === false) continue;

        var attacked = this.getRandomPerson([attacker]);
        if (attacked === false) continue;

        var result = attacker.fightAgainstEntity(attacked);
        switch (result) {
            case "victory":
                res.todayVictories++;
                if (!survivalCheck(attacked)) {
                    ++res.deathsToday;
                    attacked.basics.isDead = true;
                    this.removePerson(attacked);
                } else {
                    ++res.survivalsToday;
                    attacked.basics.avoidedDeath++;
                }
                break;
            case "defeat":
                res.todayDefeats++;
                if (!survivalCheck(attacker)) {
                    ++res.deathsToday;
                    attacker.basics.isDead = true;
                    this.removePerson(attacker);
                } else {
                    ++res.survivalsToday;
                    attacker.basics.avoidedDeath++;
                }
                break;
            case "draw":
                res.todayDraws++;

                break;
        }
    }

    return res;
};

World.prototype.givePassives = function () {
    var _this = this;

    this.people.forEach(function (person) {
        person.earnPassiveExp();
        _this.giveQuestToEntity(person);
        // person.earnPassiveCoins();
    });
};

World.prototype.birthPeople = function () {
    var birthsToday = getRandomInt(0, Math.floor(this.standard.population / 2) * WORLD_BIRTH_FACTOR);

    this.standard.birthsToday = birthsToday;
    this.standard.births += birthsToday;

    for (var i = 0; i < birthsToday; ++i) {
        this.addPerson(new _Entity2.default(this.getLastId()));
    }
};

World.prototype.updatePeopleHealth = function () {
    for (var i = 0; i < this.people.length; i++) {
        dailyHealingEntity(this.people[i]);
    }
};

World.prototype.addPerson = function (person) {
    this.lastId++;
    this.people[person.id] = person;
};

World.prototype.getLastId = function () {
    return this.lastId;
};

World.prototype.removePerson = function (person) {
    this.people[person.id] = undefined;
};

World.prototype.getPersonById = function (id) {
    return this.people[id];
};

World.prototype.getRandomPerson = function (reference) {
    if (this.people.length < 2) return false;
    var maxIterations = MAX_ITERATIONS;
    while (maxIterations > 0) {
        maxIterations--;
        var person = this.people[getRandomInt(0, this.people.size())];
        if (person === undefined) continue;

        var repeated = false;
        if (reference !== undefined) {
            for (var i = 0; i < reference.length; ++i) {
                if (person.id === reference[i].id) repeated = true;
            }
        }

        if (repeated === false) return person;
    }
    console.log("overflows with " + this.people.size() + " " + this.people);
    return false;
};

World.prototype.refreshPeople = function () {
    var peopleAux = [];
    var iAux = 0;
    for (var i = 0; i < this.people.length; i++) {
        if (this.people[i] !== undefined) {
            peopleAux[iAux] = this.people[i];
            peopleAux[iAux].id = iAux++;
        }
    }
    this.people = peopleAux;
};

World.prototype.reportPeople = function () {
    this.people.forEach(function (value, key) {
        value.report();
    });
    gg.engine.update();
};

World.prototype.giveQuestToEntity = function (entity) {
    var quest = this.questManager.createQuest();
};

exports.default = World;

},{"./Entity":6,"./QuestManager":8}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _StandardController = require('./StandardController');

var _StandardController2 = _interopRequireDefault(_StandardController);

var _HtmlCreation = require('../Libraries/HtmlCreation');

var _HtmlCreation2 = _interopRequireDefault(_HtmlCreation);

var _Entity = require('../classes/Entity');

var _Entity2 = _interopRequireDefault(_Entity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MainController(jqSel) {
    this.name = "MainController";

    this.views = {};

    _StandardController2.default.call(this, jqSel);

    this.generateViewsContent();
}

MainController.prototype = new _StandardController2.default();

MainController.prototype.generateViewsContent = function () {
    this.views = {
        header: function header() {
            var html = "";
            html += _HtmlCreation2.default.createElem("div", "mainDivTitle", "title", MAIN_VIEW.TITLE);
            html += _HtmlCreation2.default.createHorizontalLine("hr20px");

            return html;
        },
        generateNewPlayerForm: {
            formSubmitSelector: $("#playerFormSubmit"),
            actions: {
                index: function index(context) {
                    var content = "",
                        formData = "",
                        formElements = "",
                        formBlocks = "";

                    //content += HtmlCreation.createElem("div", "playerFormDescription", "playerFormDescription", MAIN_VIEW.PLAYER_FORM.DESCRIPTION);


                    formBlocks += _HtmlCreation2.default.createElem("legend", "", "", MAIN_VIEW.PLAYER_FORM.LEGEND); //fieldset legend

                    formData += _HtmlCreation2.default.createElem("label", "", "", MAIN_VIEW.PLAYER_FORM.NAME + ": ", "for='IPlayerFormPlayerName'");
                    formData += _HtmlCreation2.default.createMonoElem("input", "IPlayerFormPlayerName", "", "type='text' value='The'");
                    formElements += _HtmlCreation2.default.createElem("div", "playerFormPlayerName", "playerFormElement", formData);

                    formData = _HtmlCreation2.default.createElem("label", "", "playerFormLabel", MAIN_VIEW.PLAYER_FORM.SURNAME + ": ", "for='IPlayerFormPlayerSurname'");
                    formData += _HtmlCreation2.default.createMonoElem("input", "IPlayerFormPlayerSurname", "", "type='text' value='Player'");
                    formElements += _HtmlCreation2.default.createElem("div", "playerFormPlayerSurname", "playerFormElement", formData);
                    formData = "";

                    formBlocks += _HtmlCreation2.default.createElem("div", "playerFormNameBlock", "playerFormBlock", formElements); // add name and surname input
                    formBlocks += _HtmlCreation2.default.createHorizontalLine("hr20px");
                    formElements = "";

                    formData += _HtmlCreation2.default.createElem("label", "", "playerFormLabel", MAIN_VIEW.PLAYER_FORM.HAND + ": ", "for='IPlayerFormPlayerHand'");
                    formData += _HtmlCreation2.default.createElem("input", "", "", BASICS.LEFT, "type='radio' value='left' name ='hand' checked='checked'");
                    formData += _HtmlCreation2.default.createElem("input", "", "", BASICS.RIGHT, "type='radio' value='right' name ='hand'");
                    formElements += _HtmlCreation2.default.createElem("div", "playerFormPlayerHand", "playerFormElement", formData);
                    formData = "";
                    formBlocks += _HtmlCreation2.default.createElem("div", "playerFormHandBlock", "playerFormBlock", formElements); //   hand
                    formElements = "";

                    formData += _HtmlCreation2.default.createElem("label", "", "playerFormLabel", MAIN_VIEW.PLAYER_FORM.SEX + ": ", "for='IPlayerFormPlayerSex'");
                    formData += _HtmlCreation2.default.createElem("input", "", "", BASICS.MALE, "type='radio' value='male' name ='sex' checked='checked'");
                    formData += _HtmlCreation2.default.createElem("input", "", "", BASICS.FEMALE, "type='radio' value='female' name ='sex'");
                    formElements += _HtmlCreation2.default.createElem("div", "playerFormPlayerSex", "playerFormElement", formData);
                    formData = "";
                    formBlocks += _HtmlCreation2.default.createElem("div", "playerFormSexBlock", "playerFormBlock", formElements); //   hand
                    formElements = "";

                    formData += _HtmlCreation2.default.createElem("label", "", "playerFormLabel", MAIN_VIEW.PLAYER_FORM.CLASS + ": ", "for='warriorTypes'");
                    formData += _HtmlCreation2.default.createListFromObject(WARRIOR_TYPES, "warriorTypes", "warriorTypes", MAIN_VIEW.PLAYER_FORM);
                    formElements += _HtmlCreation2.default.createElem("div", "playerFormClassElement", "playerFormElement", formData);
                    formBlocks += _HtmlCreation2.default.createElem("div", "playerFormClassBlock", "playerFormBlock", formElements);

                    formBlocks += _HtmlCreation2.default.createMonoElem("input", "playerFormSubmit", "playerFormSubmit", "type='button' value='Define Yourself'");

                    content += _HtmlCreation2.default.createElem("div", "mainDivTitle", "title", MAIN_VIEW.PLAYER_FORM.DESCRIPTION);
                    content += _HtmlCreation2.default.createElem("fieldset", "playerFormFields", "playerFormFields", formBlocks);

                    return content;
                }
            },
            bind: function bind(context) {
                context.views.generateNewPlayerForm.formSubmitSelector = context.views.generateNewPlayerForm.formSubmitSelector.refresh();
                context.views.generateNewPlayerForm.formSubmitSelector.on("click", function () {
                    if (context.checkNewPlayerForm()) {
                        gg.engine.showPlayerBar();
                        gg.engine.showWorldBar();
                        gg.engine.showPlayerActions();
                        context.activeView = "defaultWorld";
                        context.showContent();
                    } else {
                        context.activeView = "error";
                        context.showContent();
                    }
                });
            }
        },
        defaultWorld: {
            actions: {
                index: function index(context) {
                    return '';
                }
            },
            bind: function bind(context) {},
            update: function update(context) {
                if (gg.outputHTML !== "") {
                    return gg.outputHTML;
                }
            }
        },
        startHistory: {
            selectors: {
                jqSelHistoryNext: $("#historyButtonNext")
            },
            actions: {
                index: function index(context) {
                    var content = "",
                        block = "",
                        elem = "";

                    block += _HtmlCreation2.default.createElem("div", "historyDiv", "historyDiv", MAIN_VIEW.HISTORY.MAIN);

                    elem += _HtmlCreation2.default.createMonoElem("input", "historyButtonNext", "historyButtonNext", "type='button' value='Next'");
                    block += _HtmlCreation2.default.createElem("div", "", "", elem);
                    elem = "";

                    content += _HtmlCreation2.default.createElem("div", "historyMainContainer", "historyMainContainer", block);

                    return content;
                }
            },
            bind: function bind(context) {
                context.updateSelectors(context.views.startHistory.selectors);
                context.views.startHistory.selectors.jqSelHistoryNext.on("click", function () {
                    context.activeView = "HistoryPlayerWakingUp";
                    context.showContent();
                });
            }
        },
        HistoryPlayerWakingUp: {
            selectors: {
                historyButtonEnter: $("#historyButtonEnter"),
                historyButtonKeepGoing: $("#historyButtonKeepGoing")
            },
            actions: {
                index: function index(context) {
                    var content = "",
                        block = "",
                        elem = "";

                    block += _HtmlCreation2.default.createElem("div", "historyDiv", "historyDiv", MAIN_VIEW.HISTORY.WAKE_UP);

                    elem += _HtmlCreation2.default.createMonoElem("input", "historyButtonEnter", "historyButtonEnter", "type='button' value='Enter'");
                    elem += _HtmlCreation2.default.createMonoElem("input", "historyButtonKeepGoing", "historyButtonKeepGoing", "type='button' value='Keep Going'");
                    block += _HtmlCreation2.default.createElem("div", "", "", elem);
                    elem = "";

                    content += _HtmlCreation2.default.createElem("div", "historyMainContainer", "historyMainContainer", block);

                    return content;
                }
            },
            bind: function bind(context) {
                var selectors = context.views.HistoryPlayerWakingUp.selectors;
                context.updateSelectors(context.views.HistoryPlayerWakingUp.selectors);
                selectors.historyButtonKeepGoing.on("click", function () {
                    context.activeView = "historyButtonKeepGoingTown01";
                    context.showContent();
                });
                selectors.historyButtonEnter.on("click", function () {
                    context.activeView = "historyButtonEnterTown01";
                    context.showContent();
                });
            }
        },
        historyButtonEnterTown01: {
            selectors: {
                fight: $("#fight")
            },
            actions: {
                index: function index(context) {
                    var content = "",
                        block = "",
                        elem = "";

                    block += _HtmlCreation2.default.createElem("div", "historyDiv", "historyDiv", MAIN_VIEW.HISTORY.ENTER_TOWN_01);

                    elem += _HtmlCreation2.default.createMonoElem("input", "fight", "fight", "type='button' value='Fight!'");
                    block += _HtmlCreation2.default.createElem("div", "", "", elem);
                    elem = "";

                    content += _HtmlCreation2.default.createElem("div", "historyMainContainer", "historyMainContainer", block);

                    return content;
                }
            },
            bind: function bind(context) {
                var selectors = context.views.historyButtonEnterTown01.selectors;
                context.updateSelectors(context.views.historyButtonEnterTown01.selectors);

                selectors.fight.on("click", function () {
                    var enemy = new _Entity2.default(gg.world.getLastId());
                    gg.player.fightAgainstEntity(enemy);
                    gg.engine.showToast(gg.outputHTML);
                });
            }
        },
        historyButtonKeepGoingTown01: {
            selectors: {},
            actions: {
                index: function index(context) {
                    var content = "",
                        block = "",
                        elem = "";

                    block += _HtmlCreation2.default.createElem("div", "historyDiv", "historyDiv", MAIN_VIEW.HISTORY.KEEP_GOING);

                    content += _HtmlCreation2.default.createElem("div", "historyMainContainer", "historyMainContainer", block);

                    return content;
                }
            },
            bind: function bind(context) {
                context.updateSelectors(context.views.historyButtonKeepGoingTown01.selectors);
            }
        },
        error: {
            bind: function bind(context) {}
        }

    };
};

MainController.prototype.checkNewPlayerForm = function () {
    var params = this.getElementsFromForm($("#playerFormFields"));

    gg.player = new _Entity2.default(0, params.class);
    gg.world.addPerson(gg.player);

    $.each(params, function (key, value) {
        gg.player.basics[key] = value;
    });

    return true;
};
MainController.prototype.generateNewPlayerForm = function () {};

MainController.prototype.createPlayer = function () {};

MainController.prototype.generateTopBar = function () {};

exports.default = MainController;

},{"../Libraries/HtmlCreation":1,"../classes/Entity":6,"./StandardController":12}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function StandardController(jqSel) {

    this.html = "";
    this.header = true;
    this.jqSel = jqSel;
    this.activeView = null;
    this.action = 'index';
}

StandardController.prototype.setJqSel = function (jqSel) {
    this.jqSel = jqSel;

    return true;
};

StandardController.prototype.getJqSel = function () {
    return this.jqSel;
};

StandardController.prototype.getVersion = function () {
    return this.version;
};

StandardController.prototype.refresh = function () {
    var result = this.views[this.activeView].update && this.views[this.activeView].update(this);

    if (typeof result !== 'undefined') {
        this.html = result;
    }

    this.jqSel.html(this.html);
};

StandardController.prototype.bind = function () {
    this.views[this.activeView].bind();
};

StandardController.prototype.showContent = function () {
    this.html = "";

    if (this.header) this.html += this.views.header();

    this.html += this.views[this.activeView].actions[this.action]();
    this.refresh();
    this.views[this.activeView].bind(this);
    // gg.engine.updatePlayerInfo();
    // gg.engine.updateWorldInfo();
    gg.outputHTML = "";
};

StandardController.prototype.updateSelectors = function (selectors) {
    $.each(selectors, function (key, value) {
        selectors[key] = value.refresh();
    });
};

StandardController.prototype.getElementsFromForm = function (selector) {
    var elems = {},
        text = "";

    selector.find('div').find('div').each(function () {
        // get all the input type data
        $(this).find('input').each(function () {
            if ($(this).attr("type") === 'radio') {
                if (this.checked === true) {
                    text = $(this).parent().find('label').html();
                    if (text !== "") elems[EQUIVALENCES.PLAYER_FORM[text.slice(0, text.length - 2)]] = $(this).val();
                } else {}
            } else {
                text = $(this).parent().find('label').html();
                if (text !== "") elems[EQUIVALENCES.PLAYER_FORM[text.slice(0, text.length - 2)]] = $(this).val();
            }
        });
    });

    selector.find(':selected').each(function () {
        text = $(this).parent().parent().find('label').html();
        if (text !== "") elems[EQUIVALENCES.PLAYER_FORM[text.slice(0, text.length - 2)]] = EQUIVALENCES.PLAYER_FORM[$(this).text()];
    });

    return elems;
};

StandardController.version = "0.0.1";

exports.default = StandardController;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _MainController = require("./controllers/MainController");

var _MainController2 = _interopRequireDefault(_MainController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Engine(world, player) {
    this.world = world;
    this.player = player;
    this.jqSelToast = "";
}

Engine.prototype.update = function () {
    this.updatePlayerInfo();
    this.updateWorldInfo();
    this.updateMainInfo();
};

Engine.prototype.updatePlayerInfo = function () {

    var selector = $("#playerBasics"),
        html = void 0,
        before = [];

    selector.find("tbody tr").each(function () {
        var elem = $(this).find("td");
        var name = $(elem[0]).html();
        name = name.charAt(0).toLowerCase() + name.slice(1);
        before[name] = $(elem[1]).html();
    });

    selector.html("");
    for (var stat in gg.player.basics) {
        html = "<td>" + stat.charAt(0).toUpperCase() + stat.slice(1) + "</td>";

        if (typeof gg.player.basics[stat] === 'number') {
            html += "<td>" + parseInt(gg.player.basics[stat]) + "</td>";

            if (gg.player.basics[stat] < before[stat]) {
                selector.append("<tr class='decreased'>" + html + "</tr>");
            } else if (gg.player.basics[stat] > before[stat] && typeof gg.player.basics[stat] === 'number') {
                selector.append("<tr class='increased'>" + html + "</tr>");
            } else {
                selector.append("<tr class='normal'>" + html + "</tr>");
            }
        } else {
            html += "<td>" + gg.player.basics[stat] + "</td>";
            if (String(gg.player.basics[stat]) !== before[stat]) {
                selector.append("<tr class='increased'>" + html + "</tr>");
            } else {
                selector.append("<tr class='normal'>" + html + "</tr>");
            }
        }
    }

    selector = $("#playerStats");
    var pointsFree = gg.player.getPointsFree();

    if (pointsFree > 0) $("#headerStats").html(PLAYER_BASICS + " <span style='color:green;'>+" + pointsFree + "</span>");else $("#headerStats").html(PLAYER_BASICS);

    selector.find("tbody tr").each(function () {
        var elem = $(this).find("td");
        var name = $(elem[0]).html();
        name = name.charAt(0).toLowerCase() + name.slice(1);
        before[name] = $(elem[1]).html();
    });

    selector.html("");
    for (var _stat in gg.player.attributes) {
        html = "<td>" + _stat.charAt(0).toUpperCase() + _stat.slice(1) + "</td>";
        html += "<td>" + parseInt(gg.player.attributes[_stat]) + "</td>";
        if (pointsFree) html += "<td class='addPoint'>+</td>";

        if (gg.player.attributes[_stat] < before[_stat]) {
            selector.append("<tr class='decreased'>" + html + "</tr>");
        } else if (gg.player.attributes[_stat] > before[_stat]) {
            selector.append("<tr class='increased'>" + html + "</tr>");
        } else {
            selector.append("<tr class='normal'>" + html + "</tr>");
        }
    }

    selector = $("#playerHealth");

    selector.find("tbody tr").each(function () {
        var elem = $(this).find("td");
        var name = $(elem[0]).html();
        name = name.charAt(0).toLowerCase() + name.slice(1);
        before[name] = $(elem[1]).html();
    });

    selector.html("");
    for (var _stat2 in gg.player.vitalPoints) {
        html = "<td>" + _stat2.charAt(0).toUpperCase() + _stat2.slice(1) + "</td>";
        html += "<td>" + parseInt(gg.player.vitalPoints[_stat2]) + "</td>";

        if (gg.player.vitalPoints[_stat2] < before[_stat2]) {
            selector.append("<tr class='decreased'>" + html + "</tr>");
        } else if (gg.player.vitalPoints[_stat2] > before[_stat2]) {
            selector.append("<tr class='increased'>" + html + "</tr>");
        } else {
            selector.append("<tr class='normal'>" + html + "</tr>");
        }
    }
};

Engine.prototype.updateWorldInfo = function () {
    var selector = $("#worldStandard"),
        before = [],
        html = void 0;

    selector.find("tbody tr").each(function () {
        var elem = $(this).find("td");
        var name = $(elem[0]).html();
        name = name.charAt(0).toLowerCase() + name.slice(1);
        before[name] = +$(elem[1]).html();
    });

    selector.html("");
    for (var stat in gg.world.standard) {
        html = "<td>" + stat.charAt(0).toUpperCase() + stat.slice(1) + "</td>";
        html += "<td>" + gg.world.standard[stat] + "</td>";

        if (gg.world.standard[stat] < before[stat]) {
            selector.append("<tr class='decreased'>" + html + "</tr>");
        } else if (gg.world.standard[stat] > before[stat]) {
            selector.append("<tr class='increased'>" + html + "</tr>");
        } else {
            selector.append("<tr class='normal'>" + html + "</tr>");
        }
    }
};

Engine.prototype.hidePlayerBar = function () {
    $("#playerBar").hide();
};
Engine.prototype.showPlayerBar = function () {
    this.updatePlayerInfo();
    $("#playerBar").show();
};

Engine.prototype.hideWorldBar = function () {
    $("#worldBar").hide();
};
Engine.prototype.showWorldBar = function () {
    this.updateWorldInfo();
    $("#worldBar").show();
};

Engine.prototype.hidePlayerActions = function () {
    $("#playerActions").hide();
};
Engine.prototype.showPlayerActions = function () {
    $("#playerActions").show();
};

Engine.prototype.updateMainInfo = function () {
    if (_MainController2.default.view === null) {
        $("#mainView").html(gg.outputHTML);
    } else {
        _MainController2.default.view.showContent();
    }
};

Engine.prototype.hideToast = function () {
    gg.engine.jqSelToast.fadeOut();
};

Engine.prototype.showToast = function (message) {
    this.jqSelToast.html(message);
    this.jqSelToast.center().fadeIn();
    var timeout = message.split(" ").length * 260;
    setTimeout(gg.engine.hideToast, timeout < 8000 ? timeout : 8000);
};

exports.default = Engine;

},{"./controllers/MainController":11}],14:[function(require,module,exports){
'use strict';

var _genericFunctions = require('./Libraries/genericFunctions');

var _genericFunctions2 = _interopRequireDefault(_genericFunctions);

var _extendedFunctions = require('./Libraries/extendedFunctions');

var _extendedFunctions2 = _interopRequireDefault(_extendedFunctions);

require('./Libraries/HtmlCreation');

require('./Libraries/jqueryFunctions');

var _World = require('./classes/World');

var _World2 = _interopRequireDefault(_World);

var _Entity = require('./classes/Entity');

var _Entity2 = _interopRequireDefault(_Entity);

var _engine = require('./engine');

var _engine2 = _interopRequireDefault(_engine);

var _MainController = require('./controllers/MainController');

var _MainController2 = _interopRequireDefault(_MainController);

require('./bindings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.gg = {};

gg.totals = {
    attacks: 0,
    dodges: 0,
    survivals: 0,
    deaths: 0
};

gg.settings = {
    autoLevelUp: true
};

// Libraries


Object.assign(window, _extendedFunctions2.default, _genericFunctions2.default);
// CLASSES


// CONTROLLERS


// BINDINGS


gg.world = new _World2.default();
gg.player = new _Entity2.default(0);
gg.engine = new _engine2.default(gg.world, gg.player);
gg.ticking = { active: false, percentage: 0, interval: null };
gg.playerDeadNotified = false;
gg.outputHTML = "";
gg.view = _MainController2.default.view = null;

gg.world.addPerson(gg.player);
gg.world.player = gg.player;

// gg.world.reportPeople();

gg.initGameUI = function init() {
    _MainController2.default.view = new _MainController2.default($("#mainView"));
    _MainController2.default.view.activeView = 'generateNewPlayerForm';
    gg.engine.jqSelToast = $("#toastMessage");

    gg.engine.hidePlayerBar();
    gg.engine.hideWorldBar();
    gg.engine.hidePlayerActions();

    gg.engine.jqSelToast.on("dblclick", function () {
        $(this).fadeOut();
    });
};

gg.tick = function tick() {
    if (gg.ticking.active === true) {
        if (gg.ticking.interval === null) {
            gg.ticking.interval = setInterval(tick, 30);
        }
        if (gg.ticking.percentage >= 100) {
            gg.ticking.percentage = 0;
            gg.outputHTML = "";
            gg.world.callADay();
            gg.engine.update();
        } else {
            // gg.ticking.percentage += 2;
            gg.ticking.percentage += 10;
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

},{"./Libraries/HtmlCreation":1,"./Libraries/extendedFunctions":2,"./Libraries/genericFunctions":3,"./Libraries/jqueryFunctions":4,"./bindings":5,"./classes/Entity":6,"./classes/World":10,"./controllers/MainController":11,"./engine":13}]},{},[14]);

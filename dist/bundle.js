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

var _genericFunctions = require("./genericFunctions");

var _genericFunctions2 = _interopRequireDefault(_genericFunctions);

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    number += _genericFunctions2.default.getRandomInt(-1, 1);
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

    if (attacked.attributes.agility / attacker.attributes.agility + _genericFunctions2.default.getRandomInt(-2, 2) > 5 && legsOk) {
        // TODO: take a look at it
        if (attacker.id === 0 || attacked.id === 0) {
            // gg.outputHTML += "<br>" + attacker.basics.name + " attacks in the " + zoneToAttack[0] + " of " + attacked.basics.name + " but misses.";
            gg.totals.dodges++;
        }
    } else {
        damage = ((attacker.attributes.strength * 0.25 - attacked.attributes.endurance * 0.10 + (attacker.attributes.agility * 0.15 - attacked.attributes.agility * 0.10)) * _genericFunctions2.default.getRandom(0.8, 1.1)).toFixed(3);
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
    var check = attacker.attributes.agility - attacked.attributes.agility + 50 + _genericFunctions2.default.getRandomInt(-10, 10);
    return _genericFunctions2.default.isAppening(check);
}

function survivalCheck(entity) {

    var check = entity.attributes.willpower * 0.6 + entity.attributes.faith * 0.2 + _genericFunctions2.default.getRandomInt(-5, 5);

    if (entity.id === 0) {
        check += 10;
    }

    var res = _genericFunctions2.default.isAppening(check);

    if (res) {
        gg.totals.survivals++;
    } else {
        gg.totals.deaths++;
    }

    return res;
}

function isDying(entity) {
    return (entity.vitalPoints.body <= 0 || entity.vitalPoints.head <= 0) && _genericFunctions2.default.isAppening(95);
}

function dailyHealingEntity(entity) {
    var toHeal = (entity.attributes.endurance * 0.15 + entity.attributes.stamina * 0.15 + entity.attributes.willpower * 0.4 + entity.attributes.faith * 0.2) / 2;
    for (var part in entity.vitalPoints) {
        entity.vitalPoints[part] += toHeal;
        if (entity.vitalPoints[part] > _constants.BASICS.MAX_ENTITY_HEALTH) entity.vitalPoints[part] = _constants.BASICS.MAX_ENTITY_HEALTH;
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

    for (i = 0; i < _constants.WARRIOR_TYPES[entity.basics.class].length; ++i) {
        tmpPercentages[i] = entity.attributes[_genericFunctions2.default.getKeyFromNumber(entity.attributes, i)] / entity.basics.level;
    }

    return tmpPercentages;
}

function incrementLowestPercentage(entity) {
    var basePercentages = _constants.WARRIOR_TYPES[entity.basics.class],
        i = void 0,
        updated = false,
        tmpPercentages = calculatePercentages(entity);

    if (_genericFunctions2.default.getRandomInt(0, 1)) {
        for (i = 0; i < basePercentages.length - 1; ++i) {
            if (basePercentages[i] > tmpPercentages[i]) {
                entity.attributes[_genericFunctions2.default.getKeyFromNumber(entity.attributes, i)]++;
                updated = true;
                break;
            }
        }
    } else {
        for (i = basePercentages.length - 2; i >= 0; --i) {
            if (basePercentages[i] > tmpPercentages[i]) {
                entity.attributes[_genericFunctions2.default.getKeyFromNumber(entity.attributes, i)]++;
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
    var rand = _genericFunctions2.default.getRandomInt(0, 7);
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

},{"../constants":9,"./genericFunctions":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _constants = require("../constants");

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
    } while (baseUrl[baseUrl.length - 1] !== keyWord);
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
        return _constants.maleNames[getRandomInt(0, _constants.maleNames.length - 1)];
    } else if (sex === 'female') {
        return _constants.femaleNames[getRandomInt(0, _constants.femaleNames.length - 1)];
    }
    return 'Bernt';
}

function getRandomCitizenSurname() {
    return _constants.surnames[getRandomInt(0, _constants.surnames.length - 1)];
}

function getRandomTownName() {
    if (isAppening(33)) return _constants.townNames[getRandomInt(0, _constants.townNames.length - 1)];
    return _constants.townFirstNames[getRandomInt(0, _constants.townFirstNames.length - 1)] + _constants.townSecondNames[getRandomInt(0, _constants.townSecondNames.length - 1)];
}

exports.default = {
    getRandomInt: getRandomInt,
    isAppening: isAppening,
    getRandomProperty: getRandomProperty,
    getRandomKey: getRandomKey,
    getRandom: getRandom,
    getRandomCitizenName: getRandomCitizenName,
    getRandomCitizenSurname: getRandomCitizenSurname,
    getKeyFromNumber: getKeyFromNumber
};

},{"../constants":9}],4:[function(require,module,exports){
"use strict";

var _Entity = require("./classes/Entity");

var _Entity2 = _interopRequireDefault(_Entity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(document).ready(function () {
    Math.seedrandom();

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

    $(document).on("click", ".addPoint", function () {
        var entity = gg.player,
            pointsFree = entity.getPointsFree();

        if (pointsFree > 0) {
            var siblings = $(this).siblings();
            entity.addPointsToAttribute(1, siblings.first().html().toLowerCase());
        }

        gg.engine.updatePlayerInfo();
    });
}); /**
     * Created by humberto.gomez on 25/06/2014.
     */

},{"./classes/Entity":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _constants = require('../constants');

var _genericFunctions = require('../Libraries/genericFunctions');

var _genericFunctions2 = _interopRequireDefault(_genericFunctions);

var _extendedFunctions = require('../Libraries/extendedFunctions');

var _extendedFunctions2 = _interopRequireDefault(_extendedFunctions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Entity(id, playerClass) {

    // Stats

    this.id = id;
    this.type = _constants.WARRIOR_TYPES[_genericFunctions2.default.getRandomInt(0, _constants.WARRIOR_TYPES.length)];

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
        head: _constants.BASICS.MAX_ENTITY_HEALTH,
        body: _constants.BASICS.MAX_ENTITY_HEALTH,
        leftArm: _constants.BASICS.MAX_ENTITY_HEALTH,
        rightArm: _constants.BASICS.MAX_ENTITY_HEALTH,
        leftLeg: _constants.BASICS.MAX_ENTITY_HEALTH,
        rightLeg: _constants.BASICS.MAX_ENTITY_HEALTH
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
    this.basics.sex = _genericFunctions2.default.isAppening(50) ? "male" : "female";
    this.basics.class = this.basics.class === null ? _genericFunctions2.default.getRandomKey(_constants.WARRIOR_TYPES) : this.basics.class;
    this.basics.name = _genericFunctions2.default.getRandomCitizenName(this.basics.sex);
    this.basics.surname = _genericFunctions2.default.getRandomCitizenSurname();
    this.basics.level = 8;
    this.basics.hand = _genericFunctions2.default.isAppening(60) ? "right" : "left";
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
    _extendedFunctions2.default.checkLevelUp(this);
};

Entity.prototype.getBaseExperience = function () {
    var num = _genericFunctions2.default.getRandomInt(0, 100);

    if (num > 100 - 3) {
        this.basics.experience = _genericFunctions2.default.getRandomInt(2000000, 3199629);
    } else if (num > 100 - 15) {
        this.basics.experience = _genericFunctions2.default.getRandomInt(1000000, 2000000);
    } else if (num > 100 - 25) {
        this.basics.experience = _genericFunctions2.default.getRandomInt(500000, 1000000);
    } else if (num > 100 - 35) {
        this.basics.experience = _genericFunctions2.default.getRandomInt(250000, 500000);
    } else if (num > 100 - 45) {
        this.basics.experience = _genericFunctions2.default.getRandomInt(100000, 250000);
    } else if (num > 100 - 50) {
        this.basics.experience = _genericFunctions2.default.getRandomInt(50000, 100000);
    } else {
        this.basics.experience = _genericFunctions2.default.getRandomInt(0, 50000);
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
            result = _genericFunctions2.default.getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "endurance":
            result = _genericFunctions2.default.getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "intelligence":
            result = _genericFunctions2.default.getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "willpower":
            result = _genericFunctions2.default.getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "agility":
            result = _genericFunctions2.default.getRandomInt(3, 100);
            return result;
            break;
        case "speed":
            result = _genericFunctions2.default.getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "stamina":
            result = _genericFunctions2.default.getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "faith":
            result = _genericFunctions2.default.getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
    }
};

Entity.prototype.addPointsToAttribute = function (points, attribute) {
    if (this.attributes[attribute] + points <= _constants.BASICS.MAX_ATTRIBUTE_LEVEL && this.attributes[attribute] + points >= 0) {
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

    while (!_extendedFunctions2.default.isDying(this) && !_extendedFunctions2.default.isDying(enemy) && turns < _constants.BASICS.MAX_BATTLE_TURNS) {
        var attacker = void 0,
            attacked = void 0;
        if (_extendedFunctions2.default.attackingFirstCheck(this, enemy)) {
            // Check who attacks first
            attacker = this;
            attacked = enemy;
            timesFirst++;
        } else {
            attacker = enemy;
            attacked = this;
            timesSecond++;
        }

        _extendedFunctions2.default.attack(attacker, attacked);
        if (!_extendedFunctions2.default.isDying(this) && !_extendedFunctions2.default.isDying(enemy)) {
            _extendedFunctions2.default.attack(attacked, attacker);
        }

        turns++;
    }
    if (this.id === 0 || enemy.id === 0) {
        gg.outputHTML += "<br>" + "Fight lasted " + turns + " turns";
        gg.outputHTML += "<br>" + this.basics.name + " attacked first " + timesFirst + " times and " + timesSecond + " times second";
    }

    this.basics.fights++;
    enemy.basics.fights++;

    if (_extendedFunctions2.default.isDying(this)) {
        this.basics.defeats++;
        enemy.basics.victories++;

        if (this.id === 0 || enemy.id === 0) {
            gg.outputHTML += "<br>" + enemy.basics.name + " Wins.";
        }

        _extendedFunctions2.default.giveExperience(enemy, this, _constants.BASICS.EXPERIENCE_WIN_FACTOR);
        _extendedFunctions2.default.giveExperience(this, enemy, _constants.BASICS.EXPERIENCE_LOSS_FACTOR);

        enemy.stealCoins(this);

        return "defeat";
    } else {
        if (_extendedFunctions2.default.isDying(enemy)) {
            enemy.basics.defeats++;
            this.basics.victories++;
            if (this.id === 0 || enemy.id === 0) {
                gg.outputHTML += "<br>" + this.basics.name + " Wins.";
            }

            _extendedFunctions2.default.giveExperience(this, enemy, _constants.BASICS.EXPERIENCE_WIN_FACTOR);
            _extendedFunctions2.default.giveExperience(enemy, this, _constants.BASICS.EXPERIENCE_LOSS_FACTOR);

            this.stealCoins(enemy);

            return "victory";
        } else {
            if (this.id === 0 || enemy.id === 0) {
                gg.outputHTML += "<br>" + "Nobody wins";
            }

            _extendedFunctions2.default.giveExperience(enemy, this, _constants.BASICS.EXPERIENCE_LOSS_FACTOR);
            _extendedFunctions2.default.giveExperience(this, enemy, _constants.BASICS.EXPERIENCE_LOSS_FACTOR);
            return "draw";
        }
    }
};

Entity.prototype.earnPassiveExp = function () {
    this.basics.experience += this.basics.experience * 0.01;
};

Entity.prototype.levelUpAsType = function (type) {
    for (var i = 0; i < _constants.BASICS.FIGHTER_TYPES[type].length; i++) {
        gg.outputHTML += "<br>" + _constants.BASICS.FIGHTER_TYPES[i];
    }
};

Entity.prototype.report = function () {
    var basePercentages = _constants.WARRIOR_TYPES[this.basics.class],
        percentages = _extendedFunctions2.default.calculatePercentages(this, basePercentages),
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

},{"../Libraries/extendedFunctions":2,"../Libraries/genericFunctions":3,"../constants":9}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Quest = {};

exports.default = Quest;

},{}],7:[function(require,module,exports){
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

},{"./Quest":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _genericFunctions = require('../Libraries/genericFunctions');

var _genericFunctions2 = _interopRequireDefault(_genericFunctions);

var _extendedFunctions = require('../Libraries/extendedFunctions');

var _extendedFunctions2 = _interopRequireDefault(_extendedFunctions);

var _constants = require('../constants');

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
        population: _genericFunctions2.default.getRandomInt(_constants.BASICS.WORLD_MIN_SIZE, _constants.BASICS.WORLD_MAX_SIZE),
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

    var fightsToday = _genericFunctions2.default.getRandomInt(this.standard.population / 2 * 0.05, this.standard.population / 2 * _constants.BASICS.WORLD_FIGHT_FACTOR);

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

    // REPORTING
    // window.stats.push(this.standard.day, this.standard.population, this.standard.deathsToday, this.standard.birthsToday);

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
                if (!_extendedFunctions2.default.survivalCheck(attacked)) {
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
                if (!_extendedFunctions2.default.survivalCheck(attacker)) {
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
    var birthsToday = _genericFunctions2.default.getRandomInt(0, Math.floor(this.standard.population / 2) * _constants.BASICS.WORLD_BIRTH_FACTOR);

    if (this.standard.population > _constants.BASICS.WORLD_MAX_POPULATION) {
        birthsToday = 0;
    }

    this.standard.birthsToday = birthsToday;
    this.standard.births += birthsToday;

    for (var i = 0; i < birthsToday; ++i) {
        this.addPerson(new _Entity2.default(this.getLastId()));
    }
};

World.prototype.updatePeopleHealth = function () {
    for (var i = 0; i < this.people.length; i++) {
        _extendedFunctions2.default.dailyHealingEntity(this.people[i]);
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
    var maxIterations = _constants.BASICS.MAX_ITERATIONS;
    while (maxIterations > 0) {
        maxIterations--;
        var person = this.people[_genericFunctions2.default.getRandomInt(0, this.people.size())];
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

},{"../Libraries/extendedFunctions":2,"../Libraries/genericFunctions":3,"../constants":9,"./Entity":5,"./QuestManager":7}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var BASICS = exports.BASICS = {
    MAX_ENTITY_HEALTH: 100,

    WORLD_FIGHT_FACTOR: 0.3,
    WORLD_BIRTH_FACTOR: 0.15,
    MAX_BATTLE_TURNS: 100,
    MAX_ITERATIONS: 30,
    REFRESH_COUNTER: 3,

    WORLD_MIN_SIZE: 100,
    WORLD_MAX_SIZE: 500,
    WORLD_MAX_POPULATION: 5000,

    EXPERIENCE_LOSS_FACTOR: 0.2,
    EXPERIENCE_WIN_FACTOR: 1,
    MAX_ATTRIBUTE_LEVEL: 500,

    PLAYER_BASICS: "PLAYER BASICS",
    FIGHTER_TYPES: [],
    UNUSED_VAR: null
};

/*strength 		: 0,
 endurance		: 0,
 intelligence 	: 0,
 willpower		: 0,
 agility 		: 0,
 speed 			: 0,
 stamina	 	    : 0,
 faith 			: 0*/

var WARRIOR_TYPES = exports.WARRIOR_TYPES = {
    warrior: [0.2, 0.2, 0.02, 0.2, 0.2, 0.18, 0, 0],
    mage: [0.05, 0.15, 0.4, 0.3, 0.02, 0.02, 0.16, 0],
    rogue: [0.1, 0.05, 0.1, 0.15, 0.25, 0.15, 0.15, 0.05],
    monk: [0.05, 0.10, 0.2, 0.2, 0.05, 0.05, 0.35]
};

var femaleNames = exports.femaleNames = ["Aekkein", "Erna", "Gica", "Iris", "Laen", "Oanei", "Urusla", "Unt", "Zy", "Giny", "Teni", "Tania", "Tenisa", "Falish", "Tirs", "Bera", "Boria", "Terkia", "Tronash", "Si", "Gi", "Ti", "Fi", "Di", "Mi", "Peli", "Irnia", "Beth", "Riven", "Vi", "Lio", "Nayeli"];

var maleNames = exports.maleNames = ["Anttirnet", "Carnil", "Estiv", "Halt", "Hoijof", "Laen", "Lisiern", "Berin", "Ton", "Shome", "Regit", "Lurin", "Maers", "Musten", "Oanei", "Raesh", "Terio", "Unt", "Ust", "Redik", "James", "Loki", "Tem", "Regot", "Josh", "Tom", "Jei", "Lioth"];

var surnames = exports.surnames = ["Golpeo", "Anorda", "Severnin", "Part", "Kek-vek-loah", "Vaen", "Nerivin", "Haeshi", "Vin-ti-selh", "Ver-to", "Vintoret", "Da Teri", "Von Bien", "Maer", "Serisn", "Vintaren", "Bertis", "Tetirit", "Tornet", "Bellabi", "Geron", "Tornes", "Gorez", "Lorez", "Gareth"];

var townNames = exports.townNames = ["Laptius", "Birnicie", "Gerina", "Olvinast", "Maktius", "New Berinet", "Berinet", "Old Berinet", "Not So Old Berinet", "Dantias", "Maktius", "Bluelake", "Pryland", "Crystalsage"];

var townFirstNames = exports.townFirstNames = ["Great", "Big", "Blue", "Black", "Greay", "Nordic", "Rapid", "Shadow", "Violet", "White", "Gold", "Silver", "Bronze", "Iron", "Stone", "Water", "Rose", "Cold", "Cor", "Coast", "Bright", "Well", "Butter", "Dork", "Wind", "Orba", "North", "Wolf", "South", "East", "West"];

var townSecondNames = exports.townSecondNames = ["shore", "size", "port", "fox", "ham", "mill", "mere", "gate", "bush", "bank", "way", "dedge", "keep", "cliff", "row", "mount", "river", "sea", "fall", "flea", "wald", "crest", "wick", "well", "mead"];

var CSS_COLOR_NAMES = exports.CSS_COLOR_NAMES = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];

var MAIN_VIEW = exports.MAIN_VIEW = {
    TITLE: "GOIRS'S GAME",
    PLAYER_FORM: {
        DESCRIPTION: "You were born in this harass land. War was your teacher since a young age and you know nothing but death and destruction. Welcome to the world.",
        LEGEND: "This is who you will be, choose wisely",
        NAME: "Name",
        SURNAME: "Surname",
        HAND: "Preferred hand",
        SEX: "Sex",
        CLASS: "Chose your class",
        warrior: "Warrior",
        mage: "Mage",
        rogue: "Rogue",
        monk: "Monk"
    },
    HISTORY: {
        MAIN: "You were raised by some potatoes who were outlawed by the law of Goirs. Your ideals are the same " + "as their, freedom for the potatoes. You, the captain potato go out in this wild world in order to avenge your potatoes.  potatoes.",
        WAKE_UP: "You wake up and you find yourself surrounded by a forest. It's pretty deep and you can't see anything but shadows and your own feet." + " You walk for hours finding nothing but forest. At the end of the forest you find a village, what will you do?",
        ENTER_TOWN_01: "You enter the town and you're attacked!",
        KEEP_GOING: "You keep going"
    }
};

var EQUIVALENCES = exports.EQUIVALENCES = {
    PLAYER_FORM: {}
};

EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.NAME] = "name";
EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.SURNAME] = "surname";
EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.HAND] = "hand";
EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.SEX] = "sex";
EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.CLASS] = "class";
EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.mage] = "mage";
EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.rogue] = "rogue";
EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.warrior] = "warrior";
EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.monk] = "monk";

var TRANSLATIONS = exports.TRANSLATIONS = {
    LEFT: "Left",
    RIGHT: "Right",
    MALE: "Male",
    FEMALE: "Female"
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _constants = require('../constants');

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
            html += _HtmlCreation2.default.createElem("div", "mainDivTitle", "title", _constants.MAIN_VIEW.TITLE);
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


                    formBlocks += _HtmlCreation2.default.createElem("legend", "", "", _constants.MAIN_VIEW.PLAYER_FORM.LEGEND); //fieldset legend

                    formData += _HtmlCreation2.default.createElem("label", "", "", _constants.MAIN_VIEW.PLAYER_FORM.NAME + ": ", "for='IPlayerFormPlayerName'");
                    formData += _HtmlCreation2.default.createMonoElem("input", "IPlayerFormPlayerName", "", "type='text' value='The'");
                    formElements += _HtmlCreation2.default.createElem("div", "playerFormPlayerName", "playerFormElement", formData);

                    formData = _HtmlCreation2.default.createElem("label", "", "playerFormLabel", _constants.MAIN_VIEW.PLAYER_FORM.SURNAME + ": ", "for='IPlayerFormPlayerSurname'");
                    formData += _HtmlCreation2.default.createMonoElem("input", "IPlayerFormPlayerSurname", "", "type='text' value='Player'");
                    formElements += _HtmlCreation2.default.createElem("div", "playerFormPlayerSurname", "playerFormElement", formData);
                    formData = "";

                    formBlocks += _HtmlCreation2.default.createElem("div", "playerFormNameBlock", "playerFormBlock", formElements); // add name and surname input
                    formBlocks += _HtmlCreation2.default.createHorizontalLine("hr20px");
                    formElements = "";

                    formData += _HtmlCreation2.default.createElem("label", "", "playerFormLabel", _constants.MAIN_VIEW.PLAYER_FORM.HAND + ": ", "for='IPlayerFormPlayerHand'");
                    formData += _HtmlCreation2.default.createElem("input", "", "", _constants.TRANSLATIONS.LEFT, "type='radio' value='left' name ='hand' checked='checked'");
                    formData += _HtmlCreation2.default.createElem("input", "", "", _constants.TRANSLATIONS.RIGHT, "type='radio' value='right' name ='hand'");
                    formElements += _HtmlCreation2.default.createElem("div", "playerFormPlayerHand", "playerFormElement", formData);
                    formData = "";
                    formBlocks += _HtmlCreation2.default.createElem("div", "playerFormHandBlock", "playerFormBlock", formElements); //   hand
                    formElements = "";

                    formData += _HtmlCreation2.default.createElem("label", "", "playerFormLabel", _constants.MAIN_VIEW.PLAYER_FORM.SEX + ": ", "for='IPlayerFormPlayerSex'");
                    formData += _HtmlCreation2.default.createElem("input", "", "", _constants.TRANSLATIONS.MALE, "type='radio' value='male' name ='sex' checked='checked'");
                    formData += _HtmlCreation2.default.createElem("input", "", "", _constants.TRANSLATIONS.FEMALE, "type='radio' value='female' name ='sex'");
                    formElements += _HtmlCreation2.default.createElem("div", "playerFormPlayerSex", "playerFormElement", formData);
                    formData = "";
                    formBlocks += _HtmlCreation2.default.createElem("div", "playerFormSexBlock", "playerFormBlock", formElements); //   hand
                    formElements = "";

                    formData += _HtmlCreation2.default.createElem("label", "", "playerFormLabel", _constants.MAIN_VIEW.PLAYER_FORM.CLASS + ": ", "for='warriorTypes'");
                    formData += _HtmlCreation2.default.createListFromObject(_constants.WARRIOR_TYPES, "warriorTypes", "warriorTypes", _constants.MAIN_VIEW.PLAYER_FORM);
                    formElements += _HtmlCreation2.default.createElem("div", "playerFormClassElement", "playerFormElement", formData);
                    formBlocks += _HtmlCreation2.default.createElem("div", "playerFormClassBlock", "playerFormBlock", formElements);

                    formBlocks += _HtmlCreation2.default.createMonoElem("input", "playerFormSubmit", "playerFormSubmit", "type='button' value='Define Yourself'");

                    content += _HtmlCreation2.default.createElem("div", "mainDivTitle", "title", _constants.MAIN_VIEW.PLAYER_FORM.DESCRIPTION);
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

                    block += _HtmlCreation2.default.createElem("div", "historyDiv", "historyDiv", _constants.MAIN_VIEW.HISTORY.MAIN);

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

                    block += _HtmlCreation2.default.createElem("div", "historyDiv", "historyDiv", _constants.MAIN_VIEW.HISTORY.WAKE_UP);

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

                    block += _HtmlCreation2.default.createElem("div", "historyDiv", "historyDiv", _constants.MAIN_VIEW.HISTORY.ENTER_TOWN_01);

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

                    block += _HtmlCreation2.default.createElem("div", "historyDiv", "historyDiv", _constants.MAIN_VIEW.HISTORY.KEEP_GOING);

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

},{"../Libraries/HtmlCreation":1,"../classes/Entity":5,"../constants":9,"./StandardController":11}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _constants = require("../constants");

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
                    if (text !== "") elems[_constants.EQUIVALENCES.PLAYER_FORM[text.slice(0, text.length - 2)]] = $(this).val();
                } else {}
            } else {
                text = $(this).parent().find('label').html();
                if (text !== "") elems[_constants.EQUIVALENCES.PLAYER_FORM[text.slice(0, text.length - 2)]] = $(this).val();
            }
        });
    });

    selector.find(':selected').each(function () {
        text = $(this).parent().parent().find('label').html();
        if (text !== "") elems[_constants.EQUIVALENCES.PLAYER_FORM[text.slice(0, text.length - 2)]] = _constants.EQUIVALENCES.PLAYER_FORM[$(this).text()];
    });

    return elems;
};

StandardController.version = "0.0.1";

exports.default = StandardController;

},{"../constants":9}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _constants = require("./constants");

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

    if (pointsFree > 0) $("#headerStats").html(_constants.BASICS.PLAYER_BASICS + " <span style='color:green;'>+" + pointsFree + "</span>");else $("#headerStats").html(_constants.BASICS.PLAYER_BASICS);

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

},{"./constants":9,"./controllers/MainController":10}],13:[function(require,module,exports){
'use strict';

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

window.stats = [];
// Libraries
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
            gg.ticking.percentage += 3;
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
    var res = 'data:text/csv;charset=utf-8,';
    res += 'Day,Total population,Deaths,Births\n';

    var current = 0;
    var max = 4;
    stats.forEach(function (stat) {
        res += stat;

        if (++current < max) {
            res += ',';
        } else {
            res += '\n';
            current = 0;
        }
    });

    var encodedUri = encodeURI(res);
    window.open(encodedUri);
};

},{"./bindings":4,"./classes/Entity":5,"./classes/World":8,"./controllers/MainController":10,"./engine":12}]},{},[13]);

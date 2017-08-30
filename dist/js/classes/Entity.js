import {WARRIOR_TYPES, BASICS} from '../constants/index';
import gf from '../Libraries/genericFunctions';
import ef from '../Libraries/extendedFunctions';

function Entity(id, playerClass) {

    // Stats

    this.id = id;
    this.type = WARRIOR_TYPES[gf.getRandomInt(0, WARRIOR_TYPES.length)];
    this.elegibleForQuest = true;

    this.basics = {
        name: 0,
        surname: 0,
        sex: 0,
        class: (typeof playerClass !== 'undefined') ? playerClass : null,
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
        head: BASICS.MAX_ENTITY_HEALTH,
        body: BASICS.MAX_ENTITY_HEALTH,
        leftArm: BASICS.MAX_ENTITY_HEALTH,
        rightArm: BASICS.MAX_ENTITY_HEALTH,
        leftLeg: BASICS.MAX_ENTITY_HEALTH,
        rightLeg:BASICS. MAX_ENTITY_HEALTH
    };

    this.init();
}


Entity.prototype.getPointsFree = function() {
    //console.log("entering with id : " + this.id);
    let pointsFree = 0;
    let temporalLevelUp = this.basics.nextLevel;
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

Entity.prototype.levelUp = function() {
    if (this.basics.experience > this.basics.nextLevel) {
        if (this.basics.level > 250) {
            this.basics.nextLevel = Math.floor(this.basics.nextLevel + this.basics.nextLevel / 8);
        } else {
            this.basics.nextLevel = Math.floor(this.basics.nextLevel + this.basics.nextLevel / 8);
        }
    }
};

Entity.prototype.init = function() {
    this.basics.isDead = false;
    this.basics.sex = gf.isAppening(50) ? "male" : "female";
    this.basics.class = this.basics.class === null ? gf.getRandomKey(WARRIOR_TYPES) : this.basics.class;
    this.basics.name = gf.getRandomCitizenName(this.basics.sex);
    this.basics.surname = gf.getRandomCitizenSurname();
    this.basics.level = 8;
    this.basics.hand = gf.isAppening(60) ? "right" : "left";
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
    ef.checkLevelUp(this);
};

Entity.prototype.getBaseExperience = function() {
    let num = gf.getRandomInt(0, 100);


    if (num > (100 - 3)) {
        this.basics.experience = gf.getRandomInt(2000000, 3199629);
    } else if (num > (100 - 15)) {
        this.basics.experience = gf.getRandomInt(1000000, 2000000);
    } else if (num > (100 - 25)) {
        this.basics.experience = gf.getRandomInt(500000, 1000000);
    } else if (num > (100 - 35)) {
        this.basics.experience = gf.getRandomInt(250000, 500000);
    } else if (num > (100 - 45)) {
        this.basics.experience = gf.getRandomInt(100000, 250000);
    } else if (num > (100 - 50)) {
        this.basics.experience = gf.getRandomInt(50000, 100000);
    } else {
        this.basics.experience = gf.getRandomInt(0, 50000);
    }

    this.basics.experience /= 1000;
};

Entity.prototype.setAllStatsToValue = function(value) {
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
Entity.prototype.generateStat = function(stat) {
    let result;

    switch (stat) {
        case "strength":
            result = gf.getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "endurance":
            result = gf.getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "intelligence":
            result = gf.getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "willpower":
            result = gf.getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "agility":
            result = gf.getRandomInt(3, 100);
            return result;
            break;
        case "speed":
            result = gf.getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "stamina":
            result = gf.getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
        case "faith":
            result = gf.getRandomInt(3, 100);
            this.basics.level += result;
            return result;
            break;
    }
};

Entity.prototype.addPointsToAttribute = function(points, attribute) {
    if (this.attributes[attribute] + points <= BASICS.MAX_ATTRIBUTE_LEVEL && this.attributes[attribute] + points >= 0) {
        this.attributes[attribute] += points;
        for (let i = 0; i < points; ++i) this.levelUp();
        this.basics.level += points;
    }
};

Entity.prototype.fightAgainstEntity = function(enemy) {
    let timesFirst = 0;
    let timesSecond = 0;
    let turns = 0;

    if (this.id === 0 || enemy.id === 0) {
        gg.outputHTML += "<br>" + "A fight between ---- " + this.id + this.basics.name + " ---- and ----- " + enemy.id + enemy.basics.name + " ----- is going to start";
        this.report();
        enemy.report();
    }

    while (!ef.isDying(this) && !ef.isDying(enemy) && turns < BASICS.MAX_BATTLE_TURNS) {
        let attacker, attacked;
        if (ef.attackingFirstCheck(this, enemy)) { // Check who attacks first
            attacker = this;
            attacked = enemy;
            timesFirst++;
        } else {
            attacker = enemy;
            attacked = this;
            timesSecond++;
        }

        ef.attack(attacker, attacked);
        if (!ef.isDying(this) && !ef.isDying(enemy)) {
            ef.attack(attacked, attacker);
        }

        turns++;
    }
    if (this.id === 0 || enemy.id === 0) {
        gg.outputHTML += "<br>" + "Fight lasted " + turns + " turns";
        gg.outputHTML += "<br>" + this.basics.name + " attacked first " + timesFirst + " times and " + timesSecond + " times second";
    }

    this.basics.fights++;
    enemy.basics.fights++;

    if (ef.isDying(this)) {
        this.basics.defeats++;
        enemy.basics.victories++;

        if (this.id === 0 || enemy.id === 0) {
            gg.outputHTML += "<br>" + enemy.basics.name + " Wins.";
        }

        ef.giveExperience(enemy, this, BASICS.EXPERIENCE_WIN_FACTOR);
        ef.giveExperience(this, enemy, BASICS.EXPERIENCE_LOSS_FACTOR);

        enemy.stealCoins(this);

        return "defeat";
    } else {
        if (ef.isDying(enemy)) {
            enemy.basics.defeats++;
            this.basics.victories++;
            if (this.id === 0 || enemy.id === 0) {
                gg.outputHTML += "<br>" + this.basics.name + " Wins.";
            }

            ef.giveExperience(this, enemy, BASICS.EXPERIENCE_WIN_FACTOR);
            ef.giveExperience(enemy, this, BASICS.EXPERIENCE_LOSS_FACTOR);

            this.stealCoins(enemy);

            return "victory";
        } else {
            if (this.id === 0 || enemy.id === 0) {
                gg.outputHTML += "<br>" + "Nobody wins";
            }

            ef.giveExperience(enemy, this, BASICS.EXPERIENCE_LOSS_FACTOR);
            ef.giveExperience(this, enemy, BASICS.EXPERIENCE_LOSS_FACTOR);
            return "draw";
        }
    }
};

Entity.prototype.earnPassiveExp = function() {
    this.basics.experience += this.basics.experience * 0.01;
    ef.checkLevelUp(this);
};

Entity.prototype.levelUpAsType = function(type) {
    for (let i = 0; i < BASICS.FIGHTER_TYPES[type].length; i++) {
        gg.outputHTML += "<br>" + BASICS.FIGHTER_TYPES[i];
    }
};

Entity.prototype.report = function() {
    let basePercentages = WARRIOR_TYPES[this.basics.class],
        percentages = ef.calculatePercentages(this, basePercentages),
        i;

    gg.outputHTML += "<br>" + "---------------------------------------------------------------------------------------";
    gg.outputHTML += "<br>" + "Starting report of Entity with id = " + this.id + " and name = " + this.basics.name + " and level of " + this.basics.level;
    gg.outputHTML += "<br>" + "---- BASICS REPORT ----";
    $.each(this.basics, function(key, val) {
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
Entity.prototype.getBaseCoins = function() {
  return 50;
};

Entity.prototype.stealCoins = function(objective) {
    //base case TODO: Add concealed money.
  this.basics.coins += objective.basics.coins;
  objective.basics.coins = 0;
};

Entity.prototype.earnPassiveCoins = function() {
  this.basics.coins += 5;
};

export default Entity;
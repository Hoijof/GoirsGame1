import {BASICS, WARRIOR_TYPES} from '../constants/index';
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
        experience: 0,
        nextLevel: BASICS.START_EXP
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
        rightLeg: BASICS.MAX_ENTITY_HEALTH
    };

    this.init();
}

Entity.prototype.getNextLevelIncrement = function(currentNextLevel) {
    return Math.ceil(currentNextLevel + currentNextLevel / 8);
};

Entity.prototype.getPointsFree = function() {
    //console.log("entering with id : " + this.id);
    let pointsFree = 0;
    let temporalLevelUp = this.basics.nextLevel;
    //if(this.id == 0)console.log("Experience : " + this.basics.experience);
    while (Math.floor(this.basics.experience) >= temporalLevelUp) {
        temporalLevelUp = this.getNextLevelIncrement(temporalLevelUp);
        ++pointsFree;
    }

    return pointsFree;
};

Entity.prototype.levelUp = function() {
    if (this.basics.experience >= this.basics.nextLevel) {
        this.basics.nextLevel = this.getNextLevelIncrement(this.basics.nextLevel);
    }
};

Entity.prototype.init = function() {
    this.basics.isDead = false;
    this.basics.sex = gf.isAppening(50) ? "male" : "female";
    this.basics.class = this.basics.class === null ? gf.getRandomKey(WARRIOR_TYPES) : this.basics.class;
    this.basics.name = gf.getRandomCitizenName(this.basics.sex);
    this.basics.surname = gf.getRandomCitizenSurname();
    this.basics.level = 1;
    this.basics.hand = gf.isAppening(60) ? "right" : "left";
    this.basics.victories = 0;
    this.basics.defeats = 0;
    this.basics.experience = 0;
    this.basics.coins = this.getBaseCoins();

    this.attributes = {
        strength: BASICS.START_STATS,
        endurance: BASICS.START_STATS,
        intelligence: BASICS.START_STATS,
        willpower: BASICS.START_STATS,
        agility: BASICS.START_STATS,
        speed: BASICS.START_STATS,
        stamina: BASICS.START_STATS,
        faith: BASICS.START_STATS
    };

    // this.getBaseExperience();
    // console.log(this.basics.experience);
    ef.checkLevelUp(this);
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

Entity.prototype.isBadlyHurt = function() {
    let res = false;

    this.vitalPoints.forEach((part) => {
        if (part <= BASICS.BADLY_HURT_THRESHOLD) {
            res = true
        }
    });

    return res;
};

export default Entity;
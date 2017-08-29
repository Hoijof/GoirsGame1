function Entity(id, playerClass) {

    // Stats

    this.id = id;
    this.type = WARRIOR_TYPES[getRandomInt(0, WARRIOR_TYPES.length)];

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
        head: MAX_ENTITY_HEALTH,
        body: MAX_ENTITY_HEALTH,
        leftArm: MAX_ENTITY_HEALTH,
        rightArm: MAX_ENTITY_HEALTH,
        leftLeg: MAX_ENTITY_HEALTH,
        rightLeg: MAX_ENTITY_HEALTH
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

Entity.prototype.getBaseExperience = function() {
    let num = getRandomInt(0, 100);


    if (num > (100 - 3)) {
        this.basics.experience = getRandomInt(2000000, 3199629);
    } else if (num > (100 - 15)) {
        this.basics.experience = getRandomInt(1000000, 2000000);
    } else if (num > (100 - 25)) {
        this.basics.experience = getRandomInt(500000, 1000000);
    } else if (num > (100 - 35)) {
        this.basics.experience = getRandomInt(250000, 500000);
    } else if (num > (100 - 45)) {
        this.basics.experience = getRandomInt(100000, 250000);
    } else if (num > (100 - 50)) {
        this.basics.experience = getRandomInt(50000, 100000);
    } else {
        this.basics.experience = getRandomInt(0, 50000);
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

Entity.prototype.addPointsToAttribute = function(points, attribute) {
    if (this.attributes[attribute] + points <= MAX_ATTRIBUTE_LEVEL && this.attributes[attribute] + points >= 0) {
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
        outputHTML += "<br>" + "A fight between ---- " + this.id + this.basics.name + " ---- and ----- " + enemy.id + enemy.basics.name + " ----- is going to start";
        this.report();
        enemy.report();
    }

    while (!isDying(this) && !isDying(enemy) && turns < MAX_BATTLE_TURNS) {
        let attacker, attacked;
        if (attackingFirstCheck(this, enemy)) { // Check who attacks first
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
        outputHTML += "<br>" + "Fight lasted " + turns + " turns";
        outputHTML += "<br>" + this.basics.name + " attacked first " + timesFirst + " times and " + timesSecond + " times second";
    }

    this.basics.fights++;
    enemy.basics.fights++;

    if (isDying(this)) {
        this.basics.defeats++;
        enemy.basics.victories++;

        if (this.id === 0 || enemy.id === 0) {
            outputHTML += "<br>" + enemy.basics.name + " Wins.";
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
                outputHTML += "<br>" + this.basics.name + " Wins.";
            }

            giveExperience(this, enemy, EXPERIENCE_WIN_FACTOR);
            giveExperience(enemy, this, EXPERIENCE_LOSS_FACTOR);

            this.stealCoins(enemy);

            return "victory";
        } else {
            if (this.id === 0 || enemy.id === 0) {
                outputHTML += "<br>" + "Nobody wins";
            }

            giveExperience(enemy, this, EXPERIENCE_LOSS_FACTOR);
            giveExperience(this, enemy, EXPERIENCE_LOSS_FACTOR);
            return "draw";
        }
    }
};

Entity.prototype.earnPassiveExp = function() {
    this.basics.experience += this.basics.experience * 0.01;
};

Entity.prototype.levelUpAsType = function(type) {
    for (let i = 0; i < FIGHTER_TYPES[type].length; i++) {
        outputHTML += "<br>" + FIGHTER_TYPES[i];
    }
};

Entity.prototype.report = function() {
    let basePercentages = WARRIOR_TYPES[this.basics.class],
        percentages = calculatePercentages(this, basePercentages),
        i;

    outputHTML += "<br>" + "---------------------------------------------------------------------------------------";
    outputHTML += "<br>" + "Starting report of Entity with id = " + this.id + " and name = " + this.basics.name + " and level of " + this.basics.level;
    outputHTML += "<br>" + "---- BASICS REPORT ----";
    $.each(this.basics, function(key, val) {
        outputHTML += "<br>" + key + " = " + val;
    });
    outputHTML += "<br>" + "---- ATTRIBUTES REPORT ----";
    $.each(this.attributes, function(key, val) {
        outputHTML += "<br>" + key + " = " + val;
    });
    outputHTML += "<br>" + "End of Attributes Report";

    outputHTML += "<br>" + "PERCENTAGES";
    for (i = 0; i < basePercentages.length; ++i) {
        outputHTML += "<br>" + String(basePercentages[i] - percentages[i]);
    }


    outputHTML += "<br>" + "---------------------------------------------------------------------------------------";
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
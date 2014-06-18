function Entity (id) {

	//stats 

    this.id = id;

	this.basics = {
		name          : 0,
        surname       : 0,
        sex           : 0,
		isDead		  : false,
		preferredHand : null,
		level         : 0,
		victories     : 0,
		defeats       : 0,
		experience    : 1
	}

	this.attributes = {
		strength 		: 0,
		endurance		: 0,
		intelligence 	: 0,
		willpower		: 0,
		agility 		: 0,
		speed 			: 0,
		stamina	 	    : 0,
		faith 			: 0
	}

	this.vitalPoints = {
		head     : MAX_ENTITY_HEALTH,
		body     : MAX_ENTITY_HEALTH,
		leftArm  : MAX_ENTITY_HEALTH,
		rightArm : MAX_ENTITY_HEALTH,
		leftLeg  : MAX_ENTITY_HEALTH,
		rightLeg : MAX_ENTITY_HEALTH
	}

    this.init();
	this.basics.experience = this.basics.level*100;
}

Entity.prototype.init = function () {
    this.basics.isDead		  = false;
    this.basics.sex           = isAppening(50) ? "male" : "female";
    this.basics.name          = getRandomCitizenName(this.basics.sex);
    this.basics.surname       = getRandomCitizenSurname();
    this.basics.level         = 0;
    this.basics.preferredHand = isAppening(60) ? "right" : "left";
    this.basics.victories     = 0;
    this.basics.defeats       = 0;
    this.basics.experience    = 1;

    this.attributes.strength 		= this.generateStat("strength");
    this.attributes.endurance		= this.generateStat("endurance");
    this.attributes.intelligence 	= this.generateStat("intelligence");
    this.attributes.willpower		= this.generateStat("willpower");
    this.attributes.agility 		= this.generateStat("agility");
    this.attributes.speed 			= this.generateStat("speed");
    this.attributes.stamina	 	    = this.generateStat("stamina");
    this.attributes.faith 			= this.generateStat("faith");
};

Entity.prototype.setAllStatsToValue = function(value) {
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
	var result;

	switch(stat) {
		case "strength":
			result = getRandomInt(3,100);
			this.basics.level += result;
			return result;
		break;
		case "endurance":
			result = getRandomInt(3,100);
			this.basics.level += result;
			return result;
		break;
		case "intelligence":
			result = getRandomInt(3,100);
			this.basics.level += result;
			return result;
		break;
		case "willpower":
			result = getRandomInt(3,100);
			this.basics.level += result;
			return result;
		break;
		case "agility":
			result = getRandomInt(3,100);
			return result;
		break;
		case "speed":
			result = getRandomInt(3,100);
			this.basics.level += result;
			return result;
		break;
		case "stamina":
			result = getRandomInt(3,100);
			this.basics.level += result;
			return result;
		break;
		case "faith":
			result = getRandomInt(3,100);
			this.basics.level += result;
			return result;
		break;
	}
};

Entity.prototype.fightAgainstEntity = function(enemy) {
	var timesFirst = 0;
	var timesSecond = 0;
	var turns = 0;

	if (this.id == 0 || enemy.id == 0) {
		console.log("A fight between ---- " + this.id+this.basics.name + " ---- and ----- " + enemy.id+enemy.basics.name + " ----- is going to start")
		this.report();
		enemy.report();
	}
	
	while(!isDying(this) && !isDying(enemy)  && turns < MAX_BATTLE_TURNS) {
		var attacker, attacked;
		if (attackingFirstCheck(this,enemy)){
			attacker  = this;
			attacked  = enemy;
			timesFirst++;
		} else {
			attacker = enemy;
			attacked = this;
			timesSecond++;
		}

		attack(attacker,attacked);
		if(!isDying(this) && !isDying(enemy)) {
			attack(attacked,attacker);
		} 

		turns++;
	}
	if (this.id == 0 || enemy.id == 0) {
		console.log("Fight lasted " + turns + " turns");
		console.log(this.basics.name + " attacked first " + timesFirst + " times and " + timesSecond + " times second");
	}
	

	if (isDying(this)) {
		this.basics.defeats++;
		enemy.basics.victories++;
		if (this.id == 0 || enemy.id == 0) {
			console.log(enemy.basics.name + " Wins.");
		}
		giveExperienceForWinning(enemy, this, turns);
		giveExperienceForLosing(this, enemy, turns)
		return "defeat";
	}	else {
		if(isDying(enemy)) {
			enemy.basics.defeats++;
			this.basics.victories++;
			if (this.id == 0 || enemy.id == 0) {
				console.log(this.basics.name + " Wins.");
			}
			
			giveExperienceForWinning(this, enemy, turns)
			giveExperienceForLosing(enemy, this, turns);
			return "victory";
		} else {
			if (this.id == 0 || enemy.id == 0) {
				console.log("Nobody wins");
			}
			
			giveExperienceForWinning(enemy, this, turns);
			giveExperienceForWinning(this, enemy, turns)
			return "draw";
		}
	} 
};

Entity.prototype.report = function() {
	console.log("---------------------------------------------------------------------------------------");
	console.log("Starting report of Entity with id = " + this.id + " and name = " + this.basics.name + " and level of " + this.basics.level);
	console.log("Attributes Report");
	$.each(this.attributes, function(key, val) { 
		console.log(key + " = " + val);
	});
	console.log("End of Attributes Report");
	console.log("---------------------------------------------------------------------------------------");
};
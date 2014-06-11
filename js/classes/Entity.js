function Entity (id) {

	//stats 
	
	this.basics = {
		id            : id,
		isDead		  : false,
		name          : getRandomCitizenName("male"),
		level         : 0,
		preferredHand : isAppening(60) ? "right" : "left",
		victories     : 0,
		defeats       : 0,
		experience    : 1,
		health        : MAX_ENTITY_HEALTH
	}

	this.attributes = {
		strength 		: this.generateStat("strength"),
		endurance		: this.generateStat("endurance"),
		intelligence 	: this.generateStat("intelligence"),
		willpower		: this.generateStat("willpower"),
		agility 		: this.generateStat("agility"),
		speed 			: this.generateStat("speed"),
		stamina	 	    : this.generateStat("stamina"),
		faith 			: this.generateStat("faith")
	}

	this.vitalPoints = {
		head     : 45,
		body     : 98,
		leftArm  : 90,
		rightArm : 80,
		leftLeg  : 45,
		rightLeg : 64
	}
}

Entity.prototype.generateStats = function() {
	/*this.generateStat("strength");
		endurance		: this.generateStat("endurance");
		intelligence 	: this.generateStat("intelligence");
		willpower		: this.generateStat("willpower");
		agility 		: this.generateStat("agility");
		speed 			: this.generateStat("speed");
		stamina	 	    : this.generateStat("stamina");
		faith 			: this.generateStat("faith");
	}*/
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
	console.log("A fight between ---- " + this.basics.id+this.basics.name + " ---- and ----- " + enemy.basics.id+enemy.basics.name + " ----- is going to start")
	this.report();
	enemy.report();
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
	console.log("Fight lasted " + turns + " turns");
	console.log(this.basics.name + " attacked first " + timesFirst + " times and " + timesSecond + " times second");

	if (isDying(this)) {
		this.basics.defeats++;
		enemy.basics.victories++;
		return "defeat";
	}	else {
		if(isDying(enemy)) {
			enemy.basics.defeats++;
			this.basics.victories++;
			return "victory";
		} else {
			return "draw";
		}
	} 
};

Entity.prototype.report = function() {
	console.log("---------------------------------------------------------------------------------------");
	console.log("Starting report of Entity with id = " + this.basics.id + " and name = " + this.basics.name);
	console.log("Attributes Report");
	$.each(this.attributes, function(key, val) { 
		console.log(key + " = " + val);
	});
	console.log("End of Attributes Report");
	console.log("---------------------------------------------------------------------------------------");
};
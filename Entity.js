function Entity (id) {

	//stats 
	this.id				= id;
	this.name			= "Entity";
	this.strength 		= this.generateStat("strength");
	this.endurance		= this.generateStat("endurance");
	this.intelligence 	= this.generateStat("intelligence");
	this.willpower		= this.generateStat("willpower");
	this.agility 		= this.generateStat("agility");
	this.speed 			= this.generateStat("speed");
	this.stamina	 	= this.generateStat("stamina");
	this.faith 			= this.generateStat("faith");

	this.health = MAX_ENTITY_HEALTH;
}

Entity.prototype.generateStat = function(stat) {
	switch(stat) {
		case "strength":
			return getRandomInt(3,10);
		break;
		case "endurance":
			return getRandomInt(3,10);
		break;
		case "intelligence":
			return getRandomInt(3,10);;
		break;
		case "willpower":
			return getRandomInt(3,10);;
		break;
		case "agility":
			return getRandomInt(3,10);;
		break;
		case "speed":
			return getRandomInt(3,10);;
		break;
		case "stamina":
			return getRandomInt(3,10);;
		break;
		case "faith":
			return getRandomInt(3,10);;
		break;
	}
};

Entity.prototype.fightAgainstEntity = function(enemy) {
	var timesFirst = 0;
	var timesSecond = 0;
	var turns = 0;
	while(this.health > 0 && enemy.health > 0 && turns < MAX_BATTLE_TURNS) {
		var attacker, attacked;
		if (isAppening(50)){
			attacker  = this;
			attacked  = enemy;
			timesFirst++;
		} else {
			attacker = enemy;
			attacked = this;
			timesSecond++;
		}

		attack(attacker,attacked);
		if(attacker.health > 0 && attacked.health > 0) {
			attack(attacked,attacker);
		} 

		turns++;
	}
	//console.log("Fight lasted " + turns + " turns");
	//console.log(this.name + " attacked first " + timesFirst + " times and " + timesSecond + " times second");
	if (this.health <= 0) {
		//console.log ("1 died");
		return "defeat";
	}	else {
		if(enemy.health <= 0) {
			//console.log("2 died");
			return "victory";
		} else {
			//console.log("nobody died");
			return "draw";
		}
	} 
};
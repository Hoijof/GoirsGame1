function Entity () {

	//stats 
	this.strength 		= this.generateStat("strength");
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
function Player () {
	//stats 
	this.strength 		= this.generateStat("strength");
	this.intelligence 	= this.generateStat("intelligence");
	this.willpower		= this.generateStat("willpower");
	this.agility 		= this.generateStat("agility");
	this.speed 			= this.generateStat("speed");
	this.stamina	 	= this.generateStat("stamina");
	this.faith 			= this.generateStat("faith");

	this.health = MAX_PLAYER_HEALTH;
}

Player.prototype = Entity.prototype; //inherit
Player.prototype.constructor = Player;

function World() {
	this.Player 	= null;
	this.day    	= 0;
	this.deaths 	= 0;
	this.births     = 1;
	this.population = getRandomInt(200, 2000);
	this.people     = Array();

	this.refreshCounter = REFRESH_COUNTER;

	this.lastId = 0;

}

World.prototype.callADay = function() {
	this.day++;

	var fightsToday = getRandomInt(0, (this.population/2)*WORLD_FIGHT_FACTOR);
	var deathsToday = 0;
	console.log(fightsToday + " fights to be done");

	for(var i = 0; i < fightsToday; ++i) {
		var attacker = this.getRandomPerson(undefined);
		if (attacker == false) continue;
		var attacked = this.getRandomPerson([attacker]);
		if (attacked == false) continue;

		var result = attacker.fightAgainstEntity(attacked);
		switch (result) {
			case "victory" :
				++deathsToday;
				this.removePerson(attacked);
			break;
			case "defeat" :
				++deathsToday;
				this.removePerson(attacker);
			break;
			case "draw" :
				
			break;
		}
	}

	this.deaths += deathsToday;


	var birthsToday = getRandomInt(0, (this.population/2)*WORLD_BIRTH_FACTOR);
	this.births += birthsToday;
	for( i = 0; i < birthsToday; ++i) {
		this.addPerson(new Entity(this.population+i));
	}

	this.population = this.people.length = this.people.size();

	this.refreshPeople();
	/*if(this.refreshCounter <= 0) {
		this.refreshPeople();
		this.refreshCounter = REFRESH_COUNTER;
	} else {
		this.refreshCounter--;
	}*/

	this.updatePeopleHealth();
};

World.prototype.updatePeopleHealth = function() {
	for (var i = 0; i < this.people.length; i++) {
		this.people[i].health += MAX_ENTITY_HEALTH * REGENERATION_RATIO;
		if (this.people[i].health > MAX_ENTITY_HEALTH) this.people[i].health = MAX_ENTITY_HEALTH;
	}
};

World.prototype.addPerson = function(person) {
	if (person.id > this.lastId ) this.lastId = person.id;
	this.people[person.id] = person;
};

World.prototype.getLastId = function() {
	return this.lastId;
}

World.prototype.removePerson = function(person) {
	this.people[person.id] = undefined;
};

World.prototype.getPersonById = function(id) {
	return this.people[id];
};

World.prototype.getRandomPerson = function(reference) {
	if (this.people.length < 2) return false;
	var maxIterations = MAX_ITERATIONS;
	while(maxIterations > 0) {
		maxIterations--;
		var person = this.people[getRandomInt(0,this.people.size())];
		if (person === undefined) continue;

		var repeated = false;
		if(reference !== undefined) {
			for(var i = 0; i < reference.length; ++i) {
				if (person.id == reference[i].id) repeated = true;
			}
		}
		
		if (repeated == false) return person;
	}
	console.log("overflows with " + this.people.size() + " " + this.people);
	return false;
};

World.prototype.refreshPeople = function() {
	var peopleAux = Array();
	for (var i = 0; i < this.people.size(); i++) {
		if (this.people[i] !== undefined) peopleAux.push(this.people[i]);
	}
	this.people = peopleAux;
};
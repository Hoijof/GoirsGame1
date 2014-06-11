function World() {
	this.Player 	= null;
	this.day    	= 0;
	this.deaths 	= 0;
	this.births     = 1;
	this.population = getRandomInt(WORLD_MIN_SIZE, WORLD_MAX_SIZE);
	this.people     = Array();

	this.refreshCounter = REFRESH_COUNTER;

	this.lastId = 0;

	for(var i = 1; i < this.population; i++) {
		this.addPerson(new Entity(i));
	}

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
				if ( !survivalCheck(attacked)) {
					++deathsToday;
					attacked.basics.isDead = true;
					this.removePerson(attacked);
				} else {
					console.log(attacked.basics.name + " survived the fight!");
				}
			break;
			case "defeat" :
				if ( !survivalCheck(attacker)) {
					++deathsToday;
					attacker.basics.isDead = true;
					this.removePerson(attacker);
				} else {
					console.log(attacker.basics.name + " survived the fight!");
				}
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
		regeneratePerson(this.people[i]);
	}
};

World.prototype.addPerson = function(person) {
	if (person.basics.id > this.lastId ) this.lastId = person.basics.id;
	this.people[person.basics.id] = person;
};

World.prototype.getLastId = function() {
	return this.lastId;
}

World.prototype.removePerson = function(person) {
	this.people[person.basics.id] = undefined;
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
				if (person.basics.id == reference[i].basics.id) repeated = true;
			}
		}
		
		if (repeated == false) return person;
	}
	console.log("overflows with " + this.people.size() + " " + this.people);
	return false;
};

World.prototype.refreshPeople = function() {
	var peopleAux = Array();
	var iAux = 0;
	for (var i = 0; i < this.people.size(); i++) {
		if (this.people[i] !== undefined){
			peopleAux[iAux] = this.people[i];	
			peopleAux[iAux].basics.id = iAux++;
		} 
	}
	this.people = peopleAux;
};
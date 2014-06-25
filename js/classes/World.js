function World() {
	this.player 	= null;

    this.standard = {
        day         : 0,
        deaths      : 0,
        births      : 1,
        population  : getRandomInt(WORLD_MIN_SIZE, WORLD_MAX_SIZE)
    };

    this.people = [];

	this.lastId = 0;

	for(var i = 1; i < this.standard.population; i++) {
		this.addPerson(new Entity(i));
	}
}

World.prototype.callADay = function() {
	var report = true;

	this.standard.day++;

	var fightsToday = getRandomInt(0, (this.standard.population/2)*WORLD_FIGHT_FACTOR);
	var deathsToday = 0;
	var todayVictories = 0;
	var todayDefeats = 0;
	var todayDraws = 0;
	var survivalsToday = 0;
	outputHTML += fightsToday + " fights to be done";


    this.updatePeopleHealth();

	for(var i = 0; i < fightsToday; ++i) {
		var attacker = this.getRandomPerson(undefined);
		if (attacker == false) continue;
		var attacked = this.getRandomPerson([attacker]);
		if (attacked == false) continue;

		var result = attacker.fightAgainstEntity(attacked);
		switch (result) {
			case "victory" :
				todayVictories++;
				if ( !survivalCheck(attacked)) {
					++deathsToday;
					attacked.basics.isDead = true;
					this.removePerson(attacked);
					//console.log(attacked.basics.name + " dies.");
				} else {
					++survivalsToday;
					//console.log(attacked.basics.name + " survived the fight!");
				}
			break;
			case "defeat" :
			todayDefeats++;
				if ( !survivalCheck(attacker)) {
					++deathsToday;
					attacker.basics.isDead = true;
					this.removePerson(attacker);
					//console.log(attacker.basics.name + " dies.");
				} else {
					++survivalsToday;
					//console.log(attacker.basics.name + " survived the fight!");
				}
			break;
			case "draw" :
				todayDraws++;
				
			break;
		}
	}

	this.standard.deaths += deathsToday;


	var birthsToday = getRandomInt(0, (this.standard.population/2)*WORLD_BIRTH_FACTOR);
	this.standard.births += birthsToday;
	for( i = 0; i < birthsToday; ++i) {
		this.addPerson(new Entity(this.getLastId()));
	}

	this.standard.population = this.people.length = this.people.size();

	this.refreshPeople();

	if (report) {
        outputHTML += "<br> Deaths : " + deathsToday + " " +
		"Victories : " + todayVictories + " " +
		"Defeats : "   +  todayDefeats + " " +
		"Draws : "     +  todayDraws + " " +
		"Survivals : " + survivalsToday;
	}
};

World.prototype.updatePeopleHealth = function() {
	for (var i = 0; i < this.people.length; i++) {
		dailyHealingEntity(this.people[i]);
	}
};

World.prototype.addPerson = function(person) {
    this.lastId++;
	this.people[person.id] = person;
};

World.prototype.getLastId = function() {
	return this.lastId;
};

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
	var iAux = 0;
	for (var i = 0; i < this.people.size(); i++) {
		if (this.people[i] !== undefined){
			peopleAux[iAux] = this.people[i];
			peopleAux[iAux].id = iAux++;
		} 
	}
	this.people = peopleAux;
};

World.prototype.reportPeople = function () {
    /*for (var elem in this.people) {
        this.people[elem].report();
    }*/
    jQuery.each(this.people, function(key, value) {
       value.report();
    });
    engine.update();
};
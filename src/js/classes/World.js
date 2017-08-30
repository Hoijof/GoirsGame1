import gf from '../Libraries/genericFunctions';
import ef from '../Libraries/extendedFunctions';

import {BASICS} from '../constants';

import QuestManager from './QuestManager';
import Entity from './Entity';

function World() {
    this.player = null;

    this.standard = {
        day: 0,
        fights: 0,
        deaths: 0,
        births: 0,
        population: gf.getRandomInt(BASICS.WORLD_MIN_SIZE, BASICS.WORLD_MAX_SIZE),
        fightsToday:0,
        deathsToday: 0,
        birthsToday: 0,
        populationChange: 0
    };

    this.people = [];

    this.lastId = 0;

    this.questManager = Object.create(QuestManager).init();

    for (let i = 1; i < this.standard.population; i++) {
        this.addPerson(new Entity(i));
    }
}

World.prototype.callADay = function() {
    const report = true;

    this.standard.day++;

    const fightsToday = gf.getRandomInt(this.standard.population * 0.1, (this.standard.population / 2) * BASICS.WORLD_FIGHT_FACTOR);

    gg.outputHTML += fightsToday + " fights to be done";


    this.updatePeopleHealth();

    this.givePassives();

    let fightResult = this.fight(fightsToday);

    this.standard.fightsToday = fightsToday;
    this.standard.fights += fightsToday;

    this.standard.deathsToday = fightResult.deathsToday;
    this.standard.deaths += fightResult.deathsToday;

    this.birthPeople();

    this.refreshPeople();

    this.standard.populationChange = this.people.size() - this.standard.population;
    this.standard.population = this.people.length = this.people.size();


    if (report) {
        gg.outputHTML += "<br> Deaths : " + fightResult.deathsToday + " " +
            "Victories : " + fightResult.todayVictories + " " +
            "Defeats : " + fightResult.todayDefeats + " " +
            "Draws : " + fightResult.todayDraws + " " +
            "Survivals : " + fightResult.survivalsToday;
    }
};

World.prototype.fight = function(fightsToday) {
    let res = {
        todayVictories: 0,
        survivalsToday: 0,
        todayDefeats: 0,
        todayDraws: 0,
        deathsToday: 0
    };

    for (let i = 0; i < fightsToday; ++i) {
        let attacker = this.getRandomPerson(undefined);
        if (attacker === false) continue;

        let attacked = this.getRandomPerson([attacker]);
        if (attacked === false) continue;

        let result = attacker.fightAgainstEntity(attacked);
        switch (result) {
            case "victory" :
                res.todayVictories++;
                if (!ef.survivalCheck(attacked)) {
                    ++res.deathsToday;
                    attacked.basics.isDead = true;
                    this.removePerson(attacked);
                } else {
                    ++res.survivalsToday;
                    attacked.basics.avoidedDeath++;
                }
                break;
            case "defeat" :
                res.todayDefeats++;
                if (!ef.survivalCheck(attacker)) {
                    ++res.deathsToday;
                    attacker.basics.isDead = true;
                    this.removePerson(attacker);
                } else {
                    ++res.survivalsToday;
                    attacker.basics.avoidedDeath++;
                }
                break;
            case "draw" :
                res.todayDraws++;

                break;
        }
    }

    return res;
};

World.prototype.givePassives = function() {
    this.people.forEach((person) => {
        person.earnPassiveExp();
        this.giveQuestToEntity(person);
        // person.earnPassiveCoins();
    })
};

World.prototype.birthPeople = function() {
    let birthsToday = gf.getRandomInt(0, Math.floor(this.standard.population / 2) * BASICS.WORLD_BIRTH_FACTOR);

    this.standard.birthsToday = birthsToday;
    this.standard.births += birthsToday;

    for (let i = 0; i < birthsToday; ++i) {
        this.addPerson(new Entity(this.getLastId()));
    }
};

World.prototype.updatePeopleHealth = function() {
    for (let i = 0; i < this.people.length; i++) {
        ef.dailyHealingEntity(this.people[i]);
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
    let maxIterations = BASICS.MAX_ITERATIONS;
    while (maxIterations > 0) {
        maxIterations--;
        let person = this.people[gf.getRandomInt(0, this.people.size())];
        if (person === undefined) continue;

        let repeated = false;
        if (reference !== undefined) {
            for (let i = 0; i < reference.length; ++i) {
                if (person.id === reference[i].id) repeated = true;
            }
        }

        if (repeated === false) return person;
    }
    console.log("overflows with " + this.people.size() + " " + this.people);
    return false;
};

World.prototype.refreshPeople = function() {
    let peopleAux = [];
    let iAux = 0;
    for (let i = 0; i < this.people.length; i++) {
        if (this.people[i] !== undefined) {
            peopleAux[iAux] = this.people[i];
            peopleAux[iAux].id = iAux++;
        }
    }
    this.people = peopleAux;
};

World.prototype.reportPeople = function() {
    this.people.forEach(function(value, key) {
        value.report();
    });
    gg.engine.update();
};

World.prototype.giveQuestToEntity = function(entity) {
    let quest = this.questManager.createQuest();
};

export default World;
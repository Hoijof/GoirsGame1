function attack(attacker,attacked) {
	
	// select the zone to attack
	var zones = Array();
	for (var zone in attacked.vitalPoints)
		zones.push([zone, attacked.vitalPoints[zone]]);
	zones.sort(function(a,b) { return b[1] - a[1]});
	//global check
	var number = parseInt(((attacker.attributes.intelligence/attacked.attributes.intelligence) + (attacker.basics.experience/attacked.basics.experience)).map(0,8,0,8));
	number += getRandomInt(-1,1);
	if (number > 5) number = 5;
	if (number < 0) number = 0;
	var zoneToAttack = zones[number];

	// progressive check
	var found = false,
		i = 1;

	while (!found && number-i > 0) {
		if(attacked.vitalPoints[zoneToAttack[0]] > 0) found = true;
		else {
			zoneToAttack = zones[number-i];
			++i;
		}
	}

	// damage and dodge
	var damage = 0.0,
		dodges = false;

	//chance to dodge
	if (attacked.attributes.agility/attacker.attributes.agility + getRandomInt(-2,2) > 5) { // TODO: take a look at it
		dodges = true;
		console.log(attacker.basics.name + " attacks in the " + zoneToAttack[0] + " of " + attacked.basics.name + " but misses.");
	} else {
		damage = (((attacker.attributes.strength * 0.25 - attacked.attributes.endurance * 0.10) + attacker.attributes.agility * 0.15) * getRandom(0.8,1.1)).toFixed(3);
		if (damage < 0) damage = 0;
		attacked.vitalPoints[zoneToAttack[0]] -= damage;
	console.log(attacker.basics.name + " attacks in the " + zoneToAttack[0] + " of " + attacked.basics.name + " and deals " + damage + " points of damage. That part has " + attacked.vitalPoints[zoneToAttack[0]] + " health points left.");
	}
	
	
}

function attackingFirstCheck(attacker, attacked) {
	var pre = (attacker.attributes.agility/attacked.attributes.agility) * 0.7 + (attacker.attributes.speed/attacked.attributes.speed) *0.3;
	pre = pre.map(0,5,0,100) + 30;
	var check = isAppening((attacker.attributes.agility/attacked.attributes.agility) * 0.7 + (attacker.attributes.speed/attacked.attributes.speed) *0.3);
	return check;
}

function survivalCheck(entity) {
	var check = isAppening(entity.attributes.willpower * 0.6 + entity.attributes.faith * 0.2);
	return check;
}

function regeneratePerson (person) {
	for (var vitalPoint in person.vitalPoints) {
		vitalPoint += MAX_ENTITY_HEALTH * REGENERATION_RATIO;
		if (vitalPoint > MAX_ENTITY_HEALTH) vitalPoint = MAX_ENTITY_HEALTH;
	}
}

function isDying(entity) {
	return entity.vitalPoints.body <= 0 || entity.vitalPoints.head <= 0;
}
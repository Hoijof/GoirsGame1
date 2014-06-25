function attack(attacker, attacked) {
	
	var twoLegsDown = attacker.vitalPoints.rightLeg < 0 && attacker.vitalPoints.leftLeg < 0;
	if (attacker.vitalPoints[attacker.basics.hand+"Arm"] <= 0 || (twoLegsDown)){
		if (attacker.id == 0 || attacked.id == 0) {
            outputHTML += "<br>" + attacker.basics.name + " Can't attack due to injuries";
		}
		return;
	}
	// select the zone to attack
	var zones = [];
	for (var zone in attacked.vitalPoints)
		zones.push([zone, attacked.vitalPoints[zone]]);
	zones.sort(function(a,b) { return b[1] - a[1]});
	//global check
	var number = parseInt(((attacker.attributes.intelligence/attacked.attributes.intelligence) +
                 ((attacker.basics.victories+attacker.basics.defeats+1)/(attacked.basics.victories+attacked.basics.defeats+1)).map(0,8,0,8)));
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
	var legsOk = (attacked.vitalPoints.leftLeg > 0 && attacker.vitalPoints.rightLeg > 0);

	if (attacked.attributes.agility/attacker.attributes.agility + getRandomInt(-2,2) > 5 && legsOk) { // TODO: take a look at it
		if (attacker.id == 0 || attacked.id == 0) {
            outputHTML += "<br>" + attacker.basics.name + " attacks in the " + zoneToAttack[0] + " of " + attacked.basics.name + " but misses.";
		}
	} else {
		damage = ((((attacker.attributes.strength * 0.25 - attacked.attributes.endurance * 0.10) + (attacker.attributes.agility * 0.15 - attacked.attributes.agility * 0.10))) * getRandom(0.8,1.1)).toFixed(3);
		if (damage < 0) damage = 0;
		attacked.vitalPoints[zoneToAttack[0]] -= damage;

		if (attacker.id == 0 || attacked.id == 0) {
            outputHTML += "<br>" + attacker.basics.name + " attacks in the " + zoneToAttack[0] + " of " + attacked.basics.name + " and deals " + damage + " points of damage. That part has " + attacked.vitalPoints[zoneToAttack[0]].toFixed(3) + " health points left.";
		}
	}
}

function attackingFirstCheck(attacker, attacked) {
	var check = ((attacker.attributes.agility - attacked.attributes.agility) + 50) + getRandomInt(-10,10);
	return isAppening(check);
}

function survivalCheck(entity) {
	var check = isAppening(entity.attributes.willpower * 0.6 + entity.attributes.faith * 0.2 + getRandomInt(-5,5));
	return check;
}

function isDying (entity) {
	return entity.vitalPoints.body <= 0 || entity.vitalPoints.head <= 0;
}

function dailyHealingEntity (entity) {
	for( var part in entity.vitalPoints) {
		var toHeal = (entity.attributes.endurance*0.15 + entity.attributes.stamina * 0.15 + entity.attributes.willpower * 0.4 + entity.attributes.faith * 0.2)/2;
		entity.vitalPoints[part] += toHeal;
		if (entity.vitalPoints[part] > MAX_ENTITY_HEALTH) entity.vitalPoints[part] = MAX_ENTITY_HEALTH;
	}
}

function giveExperience (reciver, other, modificator) {
	//var exp = Math.round( 2*3*((1.055^other.basics.level) + 8 + (1.055^(other.basics.level^1.085))))*modificator;
    var levelDifference = reciver.basics.level-other.basics.level,
        exp = 0;
    if (levelDifference >= 0) {
        exp =  Math.round(reciver.basics.level*5-Math.pow(levelDifference,2)*modificator);
    } else {
        exp = Math.round(reciver.basics.level*10+Math.pow(Math.abs(levelDifference),2)*modificator);
    }

    if (exp < reciver.basics.level*5*modificator) exp = reciver.basics.level*5*modificator;
	//console.log(modificator+"level 1 : " + reciver.basics.level + " level 2 : " + other.basics.level + " exp " + exp);
    reciver.basics.experience += parseInt(exp);

    checkLevelUp(reciver);
}

function levelUpToPoints(pointsFree) {

}

function checkLevelUp (entity) {
        var pointsFree = entity.getPointsFree();
    if (entity.id > 0) {
        levelUpToPoints(pointsFree);
        for (pointsFree; pointsFree > 0; pointsFree--) {
            entity.attributes[getRandomAttributeName()]++;
            entity.basics.level++;
        }
    }
}

function getRandomAttributeName() {
	var rand = getRandomInt(0,7);
	switch (rand) {
		case 0:
			return "strength";
		break;
		case 1:
			return "endurance";
		break;
		case 2:
			return "intelligence";
		break;
		case 3:
			return "willpower";
		break;
		case 4:
			return "agility";
		break;
		case 5:
			return "speed";
		break;
		case 6:
			return "stamina";
		break;
		case 7:
			return "faith";
		break;
	}
}
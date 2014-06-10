function attack(attacker,attacked) {
	var damage = (attacker.strength * 0.8 - attacked.endurance * 0.2);
	//console.log(attacker.name + " did " + damage + " points of damage to " + attacked.name);
	attacked.health -= damage;
}
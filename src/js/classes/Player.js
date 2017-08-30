import gf from '../Libraries/genericFunctions';
import {BASICS} from '../constants';

function Player(id) {
    //stats

    this.id = id;
    this.name = "Player";
    this.level = 0;
    this.preferredHand = gf.isAppening(60) ? "right" : "left";

    this.strength = this.generateStat("strength");
    this.endurance = this.generateStat("endurance");
    this.intelligence = this.generateStat("intelligence");
    this.willpower = this.generateStat("willpower");
    this.agility = this.generateStat("agility");
    this.speed = this.generateStat("speed");
    this.stamina = this.generateStat("stamina");
    this.faith = this.generateStat("faith");

    this.experience = 0;

    this.health = BASICS.MAX_ENTITY_HEALTH;

    this.hitpoints = {
        head: BASICS.MAX_ENTITY_HEALTH,
        body: BASICS.MAX_ENTITY_HEALTH,
        leftArm: BASICS.MAX_ENTITY_HEALTH,
        rightArm: BASICS.MAX_ENTITY_HEALTH,
        leftLeg: BASICS.MAX_ENTITY_HEALTH,
        rightLeg: BASICS.MAX_ENTITY_HEALTH,
    }
}

Player.prototype = Entity.prototype; //inherit
Player.prototype.constructor = Player;

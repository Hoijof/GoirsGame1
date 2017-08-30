import {QUESTS, QUESTS_PRICES, QUESTS_CODES, QUESTS_EVENTS, PAYOUT_TIERS} from '../constants/quest';
import gf from "../Libraries/genericFunctions";
import {ITEMS} from "../constants/items";
import ef from "../Libraries/extendedFunctions";

const Quest = {
    init: function(id) {
        this.id = id;
        this.owner = null;
        this.result = null;
        this.blueprint = null;
        this.eventChance = null;
        this.modifiers = [];
    },
    assignOwner: function(entity) {
        this.owner = entity;
    },
    requestHelp: function() {
        return [];
    },
    execute: function() {
        this.blueprint = this.getBlueprintByOwner();
        this.tryQuest();

        return this.result.outcome;
    },
    getBlueprintByOwner: function() {
        const level = this.owner.basics.level;

        switch (level) {
            case level < 25:
                return this.getRandomQuestFromQuestsBP(QUESTS[0]);
                break;
            case level < 50:
                return this.getRandomQuestFromQuestsBP(QUESTS[1]);
                break;
            case level < 75:
                return this.getRandomQuestFromQuestsBP(QUESTS[2]);
                break;
            case level < 100:
                return this.getRandomQuestFromQuestsBP(QUESTS[3]);
                break;

            default:
                return this.getRandomQuestFromQuestsBP(QUESTS[4]);
        }
    },
    getRandomQuestFromQuestsBP: function(quests) {
        return QUESTS[gf.getRandomInt(0, QUESTS.length - 1)];
    },
    tryQuest: function() {
        this.eventChance = this.blueprint.eventChance;

        if (gf.isAppening(this.eventChance)) {
            this.applyRandomEvent();
        }

        // TODO: Add stages to complex quests
        let questLevel = this.blueprint.level;
        // TODO: Tweak chance of success when we add more levels of quests
        let chanceOfSuccess = (this.owner.basics.level * 1.2) - questLevel * 10;

        this.result = {
            outcome: null,
            coins: 0,
            experience: 0,
            prices: [],
            events: []
        };
        // console.log("chance of succes: " + chanceOfSuccess, "level: " + this.owner.basics.level);

        if (gf.isAppening(chanceOfSuccess)) {
            this.result.outcome = QUESTS_CODES.SUCCESS;
            this.result.coins = this.getCoinsFromOutcome();
            this.result.prices = this.getPricesFromOutcome();
            this.result.experience = this.getExperienceFromOutcome();
        } else {
            this.result.outcome = QUESTS_CODES.FAIL;
            this.result.experience = this.getExperienceFromOutcome() / 2;
        }
    },
    applyRandomEvent: function() {
        // TODO: Implement events in quests
        let event = QUESTS_EVENTS[gf.getRandomInt(0, QUESTS_EVENTS.length - 1)];
    },
    getCoinsFromOutcome: function() {
        if (this.result.outcome === QUESTS_CODES.SUCCESS) {
            return PAYOUT_TIERS[this.blueprint.payoutTier] +
                gf.getRandomInt(- (PAYOUT_TIERS[this.blueprint.payoutTier] * 0.05), PAYOUT_TIERS[this.blueprint.payoutTier] * 0.05);
        } else {
            return 0;
        }
    },
    getPricesFromOutcome: function() {
        if (this.result.outcome === QUESTS_CODES.SUCCESS) {
            let priceId = QUESTS_PRICES[gf.getRandomInt(0, QUESTS_PRICES.length - 1)];
            let price = ITEMS[priceId];

            return [price];
        } else {
            return [];
        }
    },
    getExperienceFromOutcome: function() {
        return this.result.coins === 0 ? 15 : this.result.coins * 2;
    },
    getResult: function() {
        return this.result;
    }
};

export default Quest;
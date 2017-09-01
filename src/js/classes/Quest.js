import {PAYOUT_TIERS, QUESTS, QUESTS_CODES, QUESTS_EVENTS, QUESTS_PRICES} from '../constants/quest';
import gf from "../Libraries/genericFunctions";
import {ITEMS} from "../constants/items";

const Quest = {
    init: function(id) {
        this.id = id;
        this.owner = null;
        this.result = null;
        this.blueprint = null;
        this.eventChance = null;
        this.modifiers = [];
        this.chanceOfSuccess = 0;
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

        if (level < 25) {
            return this.getRandomQuestFromQuestsBP(QUESTS[0]);
        } else if (level < 50) {
            return this.getRandomQuestFromQuestsBP(QUESTS[1]);
        } else if (level < 75) {
            return this.getRandomQuestFromQuestsBP(QUESTS[2]);
        } else if (level < 100) {
            return this.getRandomQuestFromQuestsBP(QUESTS[3]);
        } else {
            return this.getRandomQuestFromQuestsBP(QUESTS[4]);
        }
    },
    getRandomQuestFromQuestsBP: function(quests) {
        return quests[gf.getRandomInt(0, quests.length - 1)];
    },
    tryQuest: function() {
        this.eventChance = this.blueprint.eventChance;

        if (gf.isAppening(this.eventChance)) {
            this.applyRandomEvent();
        }

        // TODO: Add stages to complex quests
        let questLevel = this.blueprint.level;
        // TODO: Tweak chance of success when we add more levels of quests
        this.chanceOfSuccess = (this.owner.basics.level * 1.2) - (questLevel * 10 + questLevel * 3);

        this.result = {
            outcome: null,
            coins: 0,
            experience: 0,
            prices: [],
            events: []
        };
        // console.log("chance of succes: " + chanceOfSuccess, "level: " + this.owner.basics.level);

        if (gf.isAppening(this.chanceOfSuccess)) {
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
            let res = PAYOUT_TIERS[this.blueprint.payoutTier] +
                gf.getRandomInt(- (PAYOUT_TIERS[this.blueprint.payoutTier] * 0.05), PAYOUT_TIERS[this.blueprint.payoutTier] * 0.05);

            res *= this.blueprint.coinsRatio;

            return res;
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
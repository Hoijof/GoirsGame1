export const QUESTS = [
    [
        {
            name: 'Farm',
            level: 0,
            payoutTier: 0,
            pricesChance: 65,
            experienceRatio: 1.2,
            pricesPool: 0,
            eventChance: 0
        }
    ],
    // 1
    [
        {
            name: 'Kill a rat',
            level: 1,
            payoutTier: 1,
            pricesChance: 25,
            experienceRatio: 1.5,
            pricesPool: 1,
            eventChance: 0
        }
    ],
    // 2
    [
        {
            name: 'Fight a thief',
            level: 2,
            payoutTier: 2,
            pricesChance: 50,
            experienceRatio: 1.3,
            pricesPool: 1,
            eventChance: 0
        }
    ],
    // 3
    [
        {
            name: 'Capture a caravan',
            level: 3,
            payoutTier: 3,
            pricesChance: 100,
            experienceRatio: 1.2,
            pricesPool: 1,
            eventChance: 0
        }
    ],
    // 3
    [
        {
            name: 'Save the Kingdom',
            level: 4,
            payoutTier: 4,
            pricesChance: 100,
            experienceRatio: 1.6,
            pricesPool: 1,
            eventChance: 100
        }
    ]

];

export const QUESTS_PRICES = [
    [0, 1, 2],
    [3, 4, 5]
];

export const QUESTS_EVENTS = [];

export const QUESTS_CODES = {
    FAIL: 0,
    ESCAPED: 1,
    SUCCESS: 2,
    GREAT_SUCCESS: 3
};

export const PAYOUT_TIERS = [
    10,
    25,
    50,
    100,
    200
];

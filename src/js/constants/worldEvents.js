export const WORLD_EVENTS = [
    {
        id: 0,
        name: 'God touch',
        effects: {
            healingExtraPercent: 0.25
        },
        addedChanceToOccur: 1,
        duration: 10
    },
    {
        id: 1,
        name: 'War!',
        effects: {
            fightsExtraPercent: 0.5
        },
        addedChanceToOccur: 0.7,
        duration: 30
    },
    {
        id: 2,
        name: 'Fertility!',
        effects: {
            birthsExtraPercent: 0.5
        },
        addedChanceToOccur: 0.8,
        duration: 10
    },
    {
        id: 3,
        name: 'Plague!',
        effects: {
            birthsExtraPercent: -0.5
        },
        addedChanceToOccur: 0.7,
        duration: 10
    },
    {
        id: 4,
        name: 'Prosperity!',
        effects: {
            birthsExtraPercent: 0.15
        },
        addedChanceToOccur: 0.9,
        duration: 50
    },
    {
        id: 5,
        name: 'Decadency...',
        effects: {
            birthsExtraPercent: -0.15
        },
        addedChanceToOccur: 0.9,
        duration: 50
    },
    {
        id: 6,
        name: 'Long war...',
        effects: {
            birthsExtraPercent: -0.15,
            fightsExtraPercent: 0.4
        },
        addedChanceToOccur: 0.9,
        duration: 100
    }
];
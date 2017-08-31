export const WORLD_EVENTS = [
    {
        id: 0,
        name: 'God touch',
        effects: {
            healingExtraPercent: 10
        },
        addedChanceToOccur: 0.8,
        duration: 5,
        blocks: []
    },
    {
        id: 1,
        name: 'War!',
        effects: {
            fightsExtraPercent: 0.5
        },
        addedChanceToOccur: 0.7,
        duration: 30,
        blocks: [8, 6]
    },
    {
        id: 2,
        name: 'Fertility!',
        effects: {
            birthsExtraPercent: 0.5
        },
        addedChanceToOccur: 0.8,
        duration: 10,
        blocks: [7]
    },
    {
        id: 3,
        name: 'Plague!',
        effects: {
            birthsExtraPercent: -0.5
        },
        addedChanceToOccur: 0.7,
        duration: 10,
        blocks: [4, 5]
    },
    {
        id: 4,
        name: 'Prosperity!',
        effects: {
            birthsExtraPercent: 0.15
        },
        addedChanceToOccur: 0.9,
        duration: 50,
        blocks: [5, 6]
    },
    {
        id: 5,
        name: 'Decadency...',
        effects: {
            birthsExtraPercent: -0.15
        },
        addedChanceToOccur: 0.9,
        duration: 50,
        blocks: [4, 7]
    },
    {
        id: 6,
        name: 'Long war...',
        effects: {
            birthsExtraPercent: -0.15,
            fightsExtraPercent: 0.4
        },
        addedChanceToOccur: 0.6,
        duration: 100,
        blocks: [6, 8]
    },
    {
        id: 7,
        name: 'Baby boom!',
        effects: {
            birthsExtraPercent: 0.8,
            fightsExtraPercent: -0.4
        },
        addedChanceToOccur: 0.9,
        duration: 25,
        blocks: [2]
    },
    {
        id: 8,
        name: 'Calmed times',
        effects: {
            fightsExtraPercent: -0.4
        },
        addedChanceToOccur: 0.6,
        duration: 100,
        blocks: [1, 6, 7]
    }
];
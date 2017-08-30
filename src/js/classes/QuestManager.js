import Quest from './Quest';

const QuestManager = {
    init: function() {
        this.quests = [];

        return this;
    },
    createQuest: function() {
        let quest = Object.create(Quest);

        quest.id = this.addQuest(quest);

        return quest;
    },
    addQuest: function(quest) {
        this.quests.push(quest);

        return this.quests.length - 1;
    }
};

export default QuestManager;
import Quest from './Quest';

const QuestManager = {
    init: function() {
        this.quests = [];

        return this;
    },
    createQuest: function(entity) {
        let quest = Object.create(Quest);
        let questId = this.addQuest(quest);

        quest.init(questId);
        quest.assignOwner(entity);

        return quest;
    },
    addQuest: function(quest) {
        this.quests.push(quest);

        return this.quests.length - 1;
    },
    executeQuest: function(quest) {
        quest.requestHelp();
        quest.execute();
        return quest.getResult();
    },
    removeQuest: function(questId) {
        this.quests[questId] = undefined;
    },
    purgeQuests: function() {
        let questAux = [];
        let iAux = 0;
        for (let i = 0; i < this.quests.length; i++) {
            if (this.quests[i] !== undefined) {
                questAux[iAux] = this.quests[i];
                questAux[iAux].id = iAux++;
            }
        }
        this.quests = questAux;
    },
    update: function() {
        this.purgeQuests();
    }
};

export default QuestManager;
export default Event = {
    init: function(bp) {
        this.id = bp.id;
        this.name = bp.name;
        this.effects = bp.effects;
        this.duration = bp.duration;
        this.addedChanceToOccur = bp.addedChanceToOccur;
        this.blocks = bp.blocks;

        this.num = null;
        this.active = false;
        this.startDate = 0;
        this.endDate = 0;

        return this;
    },
    checkIfAlreadyExists: function(activeEvents) {
        let res = activeEvents.find((event) => {
            return event.id === this.id || this.blocks.indexOf(event.id) !== -1;
        });

        return typeof res !== 'undefined';
    }
};
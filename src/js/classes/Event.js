export default Event = {
    init: function(bp) {
        this.id = bp.id;
        this.name = bp.name;
        this.effects = bp.effects;
        this.duration = bp.duration;
        this.addedChanceToOccur = bp.addedChanceToOccur;

        this.num = null;
        this.active = false;
        this.startDate = 0;
        this.endDate = 0;

        return this;
    },
    checkIfAlreadyExists: function(activeEvents) {
        let res = activeEvents.find((event) => {
            return event.id === this.id;
        });

        return typeof res !== 'undefined';
    }
};
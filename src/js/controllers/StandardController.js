function StandardController(jqSel) {

    this.html = "";
    this.header = true;
    this.jqSel = jqSel;
    this.activeView = null;
    this.action = 'index';
}

StandardController.prototype.setJqSel = function(jqSel) {
    this.jqSel = jqSel;

    return true;
};

StandardController.prototype.getJqSel = function() {
    return this.jqSel;
};

StandardController.prototype.getVersion = function() {
    return this.version;
};

StandardController.prototype.refresh = function() {
    let result = this.views[this.activeView].update && this.views[this.activeView].update(this);

    if (typeof result !== 'undefined') {
        this.html = result;
    }

    this.jqSel.html(this.html);
};

StandardController.prototype.bind = function() {
    this.views[this.activeView].bind();
};

StandardController.prototype.showContent = function() {
    this.html = "";

    if (this.header) this.html += this.views.header();

    this.html += this.views[this.activeView].actions[this.action]();
    this.refresh();
    this.views[this.activeView].bind(this);
    // gg.engine.updatePlayerInfo();
    // gg.engine.updateWorldInfo();
    gg.outputHTML = "";
};

StandardController.prototype.updateSelectors = function(selectors) {
    $.each(selectors, function(key, value) {
        selectors[key] = value.refresh();
    });
};

StandardController.prototype.getElementsFromForm = function(selector) {
    let elems = {},
        text = "";

    selector.find('div').find('div').each(function() { // get all the input type data
        $(this).find('input').each(function() {
            if ($(this).attr("type") === 'radio') {
                if (this.checked === true) {
                    text = $(this).parent().find('label').html();
                    if (text !== "") elems[EQUIVALENCES.PLAYER_FORM[text.slice(0, text.length - 2)]] = $(this).val();
                } else {

                }
            } else {
                text = $(this).parent().find('label').html();
                if (text !== "") elems[EQUIVALENCES.PLAYER_FORM[text.slice(0, text.length - 2)]] = $(this).val();
            }
        });
    });

    selector.find(':selected').each(function() {
        text = $(this).parent().parent().find('label').html();
        if (text !== "") elems[EQUIVALENCES.PLAYER_FORM[text.slice(0, text.length - 2)]] = EQUIVALENCES.PLAYER_FORM[$(this).text()];
    });

    return elems;
};

StandardController.version = "0.0.1";

export default StandardController;
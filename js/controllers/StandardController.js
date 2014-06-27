function StandardController (jqSel) {

    this.html       = "";
    this.header     = true;
    this.jqSel      = jqSel;
    this.activeView = null;
    this.action     = 'index';
}

StandardController.prototype.setJqSel = function (jqSel){
    this.jqSel = jqSel;

    return true;
};

StandardController.prototype.getJqSel = function () {
    return this.jqSel;
};

StandardController.prototype.getVersion = function () {
    return this.version;
};

StandardController.prototype.refresh = function () {
  this.jqSel.html(this.html);
};

StandardController.prototype.bind = function () {
    this.views[this.activeView].bind();
};

StandardController.prototype.getElementsFromForm = function (selector) {
    var elems = {},
        text  = "";

    selector.find('div').find('div').each(function() {
        $(this).find('input').each(function(){
            if ($(this).attr("type") == 'radio') {
                if (this.checked === true) {
                    text = $(this).parent().find('label').html();
                    if (text != "") elems[EQUIVALENCES.PLAYER_FORM[text.slice(0,text.length-2)]] = $(this).val();
                } else {

                }
            } else {
                text = $(this).parent().find('label').html();
                if (text != "") elems[EQUIVALENCES.PLAYER_FORM[text.slice(0,text.length-2)]] = $(this).val();
            }
        });
    });

    return elems;
};

StandardController.version = "0.0.1";
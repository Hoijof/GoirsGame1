function StandardView (jqSel) {
    this.version = 0.1;

    this.html = "";
    this.jqSel = jqSel;
}

StandardView.prototype.setJqSel = function (jqSel){
    this.jqSel = jqSel;

    return true;
};

StandardView.prototype.getJqSel = function () {
    return this.jqSel;
};

StandardView.prototype.getVersion = function () {
    return this.version;
};

StandardView.prototype.refresh = function () {
  this.jqSel.html(this.html);
};
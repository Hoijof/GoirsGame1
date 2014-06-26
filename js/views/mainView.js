function MainView (jqSel) {
    this.name = "Main view";

    StandardView.call(this, jqSel);
}
MainView.prototype = new StandardView;

MainView.prototype.createContent = function () {
    this.html += "goirs";
    this.refresh();
};

MainView.prototype.generateTopBar = function() {

};
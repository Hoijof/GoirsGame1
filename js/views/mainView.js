function MainView (jqSel) {
    this.name = "Main view";

    StandardView.call(this, jqSel);
}
MainView.prototype = new StandardView;

MainView.prototype.showContent = function () {
    this.html = HtmlCreation.createElem("div", "mainDivTitle", "title", MAIN_VIEW.DESCRIPTION);
    this.html += HtmlCreation.createHorizontalLine("horizontalLine");
    this.html += this.generateNewPlayerForm();
    this.refresh();
};

MainView.prototype.generateNewPlayerForm = function () {
    var content = "",
        formData = "",
        formElements = "";

    //content += HtmlCreation.createElem("div", "playerFormDescription", "playerFormDescription", MAIN_VIEW.PLAYER_FORM.DESCRIPTION);

    formElements += HtmlCreation.createElem("legend","","", MAIN_VIEW.PLAYER_FORM.DESCRIPTION); //fieldset legend

    formData = HtmlCreation.createElem("label", "", "", MAIN_VIEW.PLAYER_FORM.NAME + ": ", "for='IPlayerFormPlayerName'");
    formData += HtmlCreation.createMonoElem("input", "IPlayerFormPlayerName", "", "type='text'");
    formElements += HtmlCreation.createElem("div", "playerFormPlayerName", "playerFormElement", formData);

    formData = HtmlCreation.createElem("label", "", "playerFormLabel", MAIN_VIEW.PLAYER_FORM.SURNAME + ": ", "for='IPlayerFormPlayerSurname'");
    formData += HtmlCreation.createMonoElem("input", "IPlayerFormPlayerSurname", "", "type='text'");
    formElements += HtmlCreation.createElem("div", "playerFormPlayerSurname", "playerFormElement", formData);

    formData = HtmlCreation.createElem("label", "", "playerFormLabel", MAIN_VIEW.PLAYER_FORM.HAND + ": ", "for='IPlayerFormPlayerHand'");
    formData += HtmlCreation.createElem("input", "IPlayerFormPlayerHand", "", BASICS.LEFT, "type='radio' value='left' name ='hand'");
    formData += HtmlCreation.createElem("input", "IPlayerFormPlayerHand", "", BASICS.RIGHT, "type='radio' value='right' name ='hand'");
    formElements += HtmlCreation.createElem("div", "playerFormPlayerHand", "playerFormElement", formData);

    content += HtmlCreation.createElem("fieldset", "playerFormFields", "playerFormFields", formElements);
    return content;
};

MainView.prototype.createPlayer = function () {

};

MainView.prototype.generateTopBar = function() {

};
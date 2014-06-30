function MainController (jqSel) {
    this.name = "MainController";

    this.views = {};

    StandardController.call(this, jqSel);

    this.generateViewsContent();
}
MainController.prototype = new StandardController;

MainController.prototype.generateViewsContent = function () {
    this.views = {
        header : function () {
            var html = "";
            html += HtmlCreation.createElem("div", "mainDivTitle", "title", MAIN_VIEW.TITLE);
            html += HtmlCreation.createHorizontalLine("hr20px");

            return html;
        },
        generateNewPlayerForm: {
            formSubmitSelector: $("#playerFormSubmit"),
            actions : {
                index: function (context) {
                    var content      = "",
                        formData     = "",
                        formElements = "",
                        formBlocks   = "";

                    //content += HtmlCreation.createElem("div", "playerFormDescription", "playerFormDescription", MAIN_VIEW.PLAYER_FORM.DESCRIPTION);


                    formBlocks += HtmlCreation.createElem("legend","","", MAIN_VIEW.PLAYER_FORM.LEGEND); //fieldset legend

                    formData += HtmlCreation.createElem("label", "", "", MAIN_VIEW.PLAYER_FORM.NAME + ": ", "for='IPlayerFormPlayerName'");
                    formData += HtmlCreation.createMonoElem("input", "IPlayerFormPlayerName", "", "type='text' value='The'");
                    formElements += HtmlCreation.createElem("div", "playerFormPlayerName", "playerFormElement", formData);

                    formData = HtmlCreation.createElem("label", "", "playerFormLabel", MAIN_VIEW.PLAYER_FORM.SURNAME + ": ", "for='IPlayerFormPlayerSurname'");
                    formData += HtmlCreation.createMonoElem("input", "IPlayerFormPlayerSurname", "", "type='text' value='Player'");
                    formElements += HtmlCreation.createElem("div", "playerFormPlayerSurname", "playerFormElement", formData);
                    formData = "";

                    formBlocks += HtmlCreation.createElem("div", "playerFormNameBlock", "playerFormBlock", formElements); // add name and surname input
                    formBlocks += HtmlCreation.createHorizontalLine("hr20px");
                    formElements = "";

                    formData += HtmlCreation.createElem("label", "", "playerFormLabel", MAIN_VIEW.PLAYER_FORM.HAND + ": ", "for='IPlayerFormPlayerHand'");
                    formData += HtmlCreation.createElem("input", "", "", BASICS.LEFT, "type='radio' value='left' name ='hand' checked='checked'");
                    formData += HtmlCreation.createElem("input", "", "", BASICS.RIGHT, "type='radio' value='right' name ='hand'");
                    formElements += HtmlCreation.createElem("div", "playerFormPlayerHand", "playerFormElement", formData);
                    formData = "";
                    formBlocks += HtmlCreation.createElem("div", "playerFormHandBlock", "playerFormBlock", formElements); //   hand
                    formElements = "";

                    formData += HtmlCreation.createElem("label", "", "playerFormLabel", MAIN_VIEW.PLAYER_FORM.SEX + ": ", "for='IPlayerFormPlayerSex'");
                    formData += HtmlCreation.createElem("input", "", "", BASICS.MALE, "type='radio' value='male' name ='sex' checked='checked'");
                    formData += HtmlCreation.createElem("input", "", "", BASICS.FEMALE, "type='radio' value='female' name ='sex'");
                    formElements += HtmlCreation.createElem("div", "playerFormPlayerSex", "playerFormElement", formData);
                    formData = "";
                    formBlocks += HtmlCreation.createElem("div", "playerFormSexBlock", "playerFormBlock", formElements); //   hand
                    formElements = "";

                    formData += HtmlCreation.createElem("label", "", "playerFormLabel", MAIN_VIEW.PLAYER_FORM.CLASS + ": ", "for='warriorTypes'");
                    formData += HtmlCreation.createListFromObject(WARRIOR_TYPES, "warriorTypes", "warriorTypes", MAIN_VIEW.PLAYER_FORM);
                    formElements += HtmlCreation.createElem("div", "playerFormClassElement", "playerFormElement", formData);
                    formBlocks += HtmlCreation.createElem("div", "playerFormClassBlock", "playerFormBlock", formElements);

                    formBlocks += HtmlCreation.createMonoElem("input", "playerFormSubmit", "playerFormSubmit", "type='button' value='Define Yourself'");

                    content += HtmlCreation.createElem("div", "mainDivTitle", "title", MAIN_VIEW.PLAYER_FORM.DESCRIPTION);
                    content += HtmlCreation.createElem("fieldset", "playerFormFields", "playerFormFields", formBlocks);

                    return content;
                }
            },
            bind: function (context) {
                context.views.generateNewPlayerForm.formSubmitSelector = context.views.generateNewPlayerForm.formSubmitSelector.refresh();
                context.views.generateNewPlayerForm.formSubmitSelector.on("click", function (){
                    if (context.checkNewPlayerForm()) {
                        engine.showPlayerBar();
                        context.activeView = "startHistory";
                        context.showContent();
                    } else {
                        context.activeView = "error";
                        context.showContent();
                    }
                })
            }
        },
        startHistory : {
            actions : {
                index : function (){
                    return MAIN_VIEW.HISTORY;
                }
            },
            bind: function (context) {

            }
        },
        error : {
            bind : function (context) {

            }
        }
    }
};

MainController.prototype.checkNewPlayerForm = function () {
    var params  = this.getElementsFromForm($("#playerFormFields"));

    player = new Entity(0, params.class);
    world.addPerson(player);

    $.each(params, function(key, value) {
        player.basics[key] = value;
    });

    return true;
};
MainController.prototype.generateNewPlayerForm = function () {

};

MainController.prototype.createPlayer = function () {

};

MainController.prototype.generateTopBar = function() {

};
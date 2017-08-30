import {MAIN_VIEW, BASICS, WARRIOR_TYPES} from '../constants';

import StandardController from './StandardController';
import HtmlCreation from '../Libraries/HtmlCreation';
import Entity from '../classes/Entity';

function MainController(jqSel) {
    this.name = "MainController";

    this.views = {};

    StandardController.call(this, jqSel);

    this.generateViewsContent();
}

MainController.prototype = new StandardController;

MainController.prototype.generateViewsContent = function() {
    this.views = {
        header: function() {
            let html = "";
            html += HtmlCreation.createElem("div", "mainDivTitle", "title", MAIN_VIEW.TITLE);
            html += HtmlCreation.createHorizontalLine("hr20px");

            return html;
        },
        generateNewPlayerForm: {
            formSubmitSelector: $("#playerFormSubmit"),
            actions: {
                index: function(context) {
                    let content = "",
                        formData = "",
                        formElements = "",
                        formBlocks = "";

                    //content += HtmlCreation.createElem("div", "playerFormDescription", "playerFormDescription", MAIN_VIEW.PLAYER_FORM.DESCRIPTION);


                    formBlocks += HtmlCreation.createElem("legend", "", "", MAIN_VIEW.PLAYER_FORM.LEGEND); //fieldset legend

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
            bind: function(context) {
                context.views.generateNewPlayerForm.formSubmitSelector = context.views.generateNewPlayerForm.formSubmitSelector.refresh();
                context.views.generateNewPlayerForm.formSubmitSelector.on("click", function() {
                    if (context.checkNewPlayerForm()) {
                        gg.engine.showPlayerBar();
                        gg.engine.showWorldBar();
                        gg.engine.showPlayerActions();
                        context.activeView = "defaultWorld";
                        context.showContent();
                    } else {
                        context.activeView = "error";
                        context.showContent();
                    }
                })
            }
        },
        defaultWorld: {
            actions: {
                index: function(context) {
                    return '';
                }
            },
            bind: function(context) {

            },
            update: function(context) {
                if (gg.outputHTML !== "") {
                    return gg.outputHTML;
                }
            }
        },
        startHistory: {
            selectors: {
                jqSelHistoryNext: $("#historyButtonNext")
            },
            actions: {
                index: function(context) {
                    let content = "",
                        block = "",
                        elem = "";

                    block += HtmlCreation.createElem("div", "historyDiv", "historyDiv", MAIN_VIEW.HISTORY.MAIN);

                    elem += HtmlCreation.createMonoElem("input", "historyButtonNext", "historyButtonNext", "type='button' value='Next'");
                    block += HtmlCreation.createElem("div", "", "", elem);
                    elem = "";

                    content += HtmlCreation.createElem("div", "historyMainContainer", "historyMainContainer", block);

                    return content;
                }
            },
            bind: function(context) {
                context.updateSelectors(context.views.startHistory.selectors);
                context.views.startHistory.selectors.jqSelHistoryNext.on("click", function() {
                    context.activeView = "HistoryPlayerWakingUp";
                    context.showContent();
                })
            }
        },
        HistoryPlayerWakingUp: {
            selectors: {
                historyButtonEnter: $("#historyButtonEnter"),
                historyButtonKeepGoing: $("#historyButtonKeepGoing")
            },
            actions: {
                index: function(context) {
                    let content = "",
                        block = "",
                        elem = "";

                    block += HtmlCreation.createElem("div", "historyDiv", "historyDiv", MAIN_VIEW.HISTORY.WAKE_UP);

                    elem += HtmlCreation.createMonoElem("input", "historyButtonEnter", "historyButtonEnter", "type='button' value='Enter'");
                    elem += HtmlCreation.createMonoElem("input", "historyButtonKeepGoing", "historyButtonKeepGoing", "type='button' value='Keep Going'");
                    block += HtmlCreation.createElem("div", "", "", elem);
                    elem = "";

                    content += HtmlCreation.createElem("div", "historyMainContainer", "historyMainContainer", block);

                    return content;
                }
            },
            bind: function(context) {
                let selectors = context.views.HistoryPlayerWakingUp.selectors;
                context.updateSelectors(context.views.HistoryPlayerWakingUp.selectors);
                selectors.historyButtonKeepGoing.on("click", function() {
                    context.activeView = "historyButtonKeepGoingTown01";
                    context.showContent();
                });
                selectors.historyButtonEnter.on("click", function() {
                    context.activeView = "historyButtonEnterTown01";
                    context.showContent();
                });
            }
        },
        historyButtonEnterTown01: {
            selectors: {
                fight: $("#fight")
            },
            actions: {
                index: function(context) {
                    let content = "",
                        block = "",
                        elem = "";

                    block += HtmlCreation.createElem("div", "historyDiv", "historyDiv", MAIN_VIEW.HISTORY.ENTER_TOWN_01);

                    elem += HtmlCreation.createMonoElem("input", "fight", "fight", "type='button' value='Fight!'");
                    block += HtmlCreation.createElem("div", "", "", elem);
                    elem = "";

                    content += HtmlCreation.createElem("div", "historyMainContainer", "historyMainContainer", block);

                    return content;
                }
            },
            bind: function(context) {
                let selectors = context.views.historyButtonEnterTown01.selectors;
                context.updateSelectors(context.views.historyButtonEnterTown01.selectors);

                selectors.fight.on("click", function() {
                    let enemy = new Entity(gg.world.getLastId());
                    gg.player.fightAgainstEntity(enemy);
                    gg.engine.showToast(gg.outputHTML);
                });
            }
        },
        historyButtonKeepGoingTown01: {
            selectors: {},
            actions: {
                index: function(context) {
                    let content = "",
                        block = "",
                        elem = "";

                    block += HtmlCreation.createElem("div", "historyDiv", "historyDiv", MAIN_VIEW.HISTORY.KEEP_GOING);

                    content += HtmlCreation.createElem("div", "historyMainContainer", "historyMainContainer", block);

                    return content;
                }
            },
            bind: function(context) {
                context.updateSelectors(context.views.historyButtonKeepGoingTown01.selectors);
            }
        },
        error: {
            bind: function(context) {

            }
        }

    }
};

MainController.prototype.checkNewPlayerForm = function() {
    let params = this.getElementsFromForm($("#playerFormFields"));

    gg.player = new Entity(0, params.class);
    gg.world.addPerson(gg.player);

    $.each(params, function(key, value) {
        gg.player.basics[key] = value;
    });

    return true;
};
MainController.prototype.generateNewPlayerForm = function() {

};

MainController.prototype.createPlayer = function() {

};

MainController.prototype.generateTopBar = function() {

};

export default MainController;
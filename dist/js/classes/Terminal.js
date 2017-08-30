function Terminal(consoleSelector, inputText, inputTextArea, isActive) {
    this.jqSelTerminal = consoleSelector;
    this.jqSelTerminalText = inputText;
    this.jqSelTerminalTextArea = inputTextArea;

    this.consoleActualTrace = 0;
    this.consoleTrace = [];

    this.isActive = isActive;

    this.LINE_SIZE = 122;

    this.init();
}

Terminal.prototype.init = function() {
    if (this.isActive) {
        this.jqSelTerminal.show();
    } else {
        this.jqSelTerminal.hide();
    }

    this.consoleTrace.push("Hello .D");
    this.consoleActualTrace = 1;

    this.jqSelTerminal.css('left', $(window).width() / 2 - 350);
    $(window).resize(function() {
        $('#terminal').css('left', $(window).width() / 2 - 350);
    });
};

Terminal.prototype.focusInput = function() {
    if (this.jqSelTerminalText.css("display") !== "none") {
        this.jqSelTerminalText.focus();
    } else {
        this.jqSelTerminalTextArea.focus();
    }
};

Terminal.prototype.toggleVisibility = function() {
    this.jqSelTerminal.toggle();
    this.focusInput();
};

Terminal.prototype.handleCommand = function(command, modificator) {
    if (command === "") return;
    command = command.toLowerCase();

    this.addContentToTerminal(command);

    let message = "";

    if (this.consoleTrace[this.consoleTrace.length - 1] !== command) {
        this.consoleTrace.push(command);
        this.consoleActualTrace = this.consoleTrace.length;
    }

    command = command.split(" ");

    let that = this;

    let cases = {
        clear: function() {
            that.jqSelTerminal.find("div").remove();
        },
        color: function() {
            let usage = "Changes backround color and text color of the terminal.\n Usage: color [options] background-color color";
            if (typeof command[1] === 'undefined' && typeof command[2] === 'undefined') {
                message = usage;
                return;
            }
            let bc = command[1].charAt(0).toUpperCase() + command[1].slice(1),
                c = command[2].charAt(0).toUpperCase() + command[2].slice(1);

            if (CSS_COLOR_NAMES.indexOf(bc) > -1) {
                that.jqSelTerminal.css("background-color", bc);
                that.jqSelTerminal.find("input").css("background-color", bc);
            } else {
                message = usage + "\n Background color doesn't exists";
            }

            if (CSS_COLOR_NAMES.indexOf(c) > -1) {
                that.jqSelTerminal.css("color", c);
                that.jqSelTerminal.find("input").css("color", c);
            } else {
                message = usage + "\n Color doesn't exists";
            }
        },
        list: function() {
            let casesSub = {
                commands: function() {
                    $.each(cases, function(key, value) {
                        if (key !== "_default") message += key + ", ";
                    });
                    message = message.substring(0, message.length - 2);
                },
                cssColors: function() {
                    for (let i = 0; i < CSS_COLOR_NAMES.length; ++i) {
                        message += CSS_COLOR_NAMES[i] + ", ";
                    }
                    message = message.substring(0, message.length - 2);
                },
                _default: function() {
                    message = "Option " + command[1] + " not recognized \n We recognize the following listable items: ";
                    $.each(casesSub, function(key, value) {
                        if (key !== "_default") message += key + ", ";
                    });
                }
            };
            casesSub[command[1]] ? casesSub[command[1]]() : casesSub._default();
        },
        show: function() {
            let casesSub = {
                letiable: function() {
                    message += window[command[2]];
                },
                _default: function() {
                    message = "Option " + command[1] + " not recognized \n We recognize the following showable items: ";
                    $.each(casesSub, function(key, value) {
                        if (key !== "_default") message += key + ", ";
                    });
                }
            };

            casesSub.let = casesSub.letiable;
            casesSub[command[1]] ? casesSub[command[1]]() : casesSub._default();
        },
        reload: function() {
            location.reload();
        },
        execute: function() {
            let usage = "Execute the code passed as argument \n Usage: execute [options] language code \n You can insert" +
                " the code with spaces, we handel it ;). \n We can execute the following languages: ";

            let casesSub = {
                javascript: function() {
                    let code = "";
                    for (let i = 2; i < command.length; ++i) {
                        code += " " + command[i];
                    }

                    console.log(code);
                    code = code.split(1, code.length);

                    console.log(code);
                    code = "try{" + code + "}catch(e){message = e.message}";
                    eval(code);
                },
                css: function() {
                    let code = "",
                        selectors;

                    for (let i = 2; i < command.length; ++i) {
                        code += " " + command[i];
                    }
                    code = code.split(1, code.length);
                    code = code.replace("&&this&&", that.jqTSelConsole);

                    code = code.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, "");
                    selectors = code.split(/{(?:[\s\S]*?)}/);
                    code = code.split("}");

                    for (i = 0; i < code.length - 1; i++) {
                        code[i] = code[i].replace(/.*{/, "");
                        code[i] = code[i].split(";");
                        for (let j = 0; j < code[i].length - 1; j++) {
                            code[i][j] = code[i][j].split(":");
                        }
                    }

                    for (i = 0; i < code.length - 1; i++) {
                        let object = {};
                        for (j = 0; j < code.length - 1; j++) {
                            object[code[i][j][0].replace(/^\s\s*/, '').replace(/\s\s*$/, '')] = code[i][j][1].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                        }
                        $(selectors[i]).css(object);
                    }
                },
                _default: function() {
                    message = usage;
                }
            };

            $.each(casesSub, function(key, value) {
                if (key !== "_default") usage += key + ", ";
            });

            if (typeof command[1] === 'undefined' && typeof command[2] === 'undefined') {
                message = usage;
                return;
            }

            message = "ok";

            casesSub.js = casesSub.javascript;
            casesSub[command[1]] ? casesSub[command[1]]() : casesSub._default();
        },
        goto: function() {
            let usage = "Goes to the defined url \n Usage: goto [options] url";
            if (typeof command[1] !== 'undefined') {
                if (command[1].substring(0, 7) === "http://") {
                    window.location = command[1];
                } else {
                    window.location = "http://" + command[1];
                }
            }
            else message = usage;
        },
        special: function() {
            let usage = "Does special things ;). \n Usage: special [options] option \n You can activate the following special features: ";
            let casesSub = {
                editmode: function() {
                    if (command[2] === "on") {
                        document.body.contentEditable = 'true';
                        document.designMode = 'on';
                        message = "Now you can edit any content in the page .D";
                    } else if (command[2] === "off") {
                        document.body.contentEditable = 'false';
                        document.designMode = 'off';
                    } else {
                        if (document.body.contentEditable === "true") {
                            document.body.contentEditable = 'false';
                            document.designMode = 'off';
                        } else {
                            document.body.contentEditable = 'true';
                            document.designMode = 'on';
                            message = "Now you can edit any content in the page .D";
                        }
                    }

                },
                _default: function() {
                    message = usage;
                }
            };

            $.each(casesSub, function(key, value) {
                if (key !== "_default") usage += key + ", ";
            });

            casesSub[command[1]] ? casesSub[command[1]]() : casesSub._default();
        },
        input: function() {
            that.jqSelTerminalTextArea.toggle();
            that.jqSelTerminalText.toggle();

            if (that.jqSelTerminalTextArea.css("display") !== "none") {
                message += "Area Mode, remember to send commands with ctrl + enter";
            }
            that.focusInput();
        },
        _default: function() {
            message = "Command " + command[0] + " not recognized. Use \"list command\" for a list of all the available commands";
        }
    };

    cases.exec = cases.exe = cases.ex = cases.execute;
    cases.clr = cases.clear;

    cases[command[0]] ? cases[command[0]]() : cases._default();

    message = message.split("\n");
    for (let i = 0; i < message.length; i++) {
        this.addContentToTerminal(message[i]);
    }

    if (this.jqSelTerminalText.position().top > this.jqSelTerminal.height()) this.jqSelTerminalText.css("top", this.jqSelTerminal.height());
};

Terminal.prototype.addContentToTerminal = function(text) {
    if (text === "") return;

    let numberOfMessages = Math.ceil(text.length / this.LINE_SIZE);
    for (let i = 0; i < numberOfMessages; i++) {
        this.jqSelTerminal.find("input").before("<div>" + text.substring(i * this.LINE_SIZE, i * this.LINE_SIZE + this.LINE_SIZE) + "</div>");
        if (this.jqSelTerminal.find('div').first().position().top < 10) this.jqSelTerminal.find('div').first().remove();
    }
    this.deleteExtraMessages();
};

Terminal.prototype.deleteExtraMessages = function() {
    //this.jqSelTerminalTextArea.css("height", ((this.jqSelTerminal.height() - this.jqSelTerminal.children().length * 20) + 40 > 20) ?  (this.jqSelTerminal.height() - this.jqSelTerminal.children().length * 20) + 40:20);
    this.jqSelTerminalText.focus().val("goirs").val("");
};

Terminal.prototype.showCurrentTrace = function() {
    this.jqSelTerminal.find("input").focus().val("").val(this.consoleTrace[this.consoleActualTrace]);
};
//adm@ww9

export default Terminal;
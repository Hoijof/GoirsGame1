function Terminal (consoleSelector, isActive) {
	this.jqSelConsole    = consoleSelector;

	this.consoleActualTrace = 0;
	this.consoleTrace       = [];

	this.isActive  = isActive;

	this.LINE_SIZE = 200;

	this.init();
}

Terminal.prototype.init = function() {
	if (this.isActive) {
		this.jqSelConsole.show();
	} else { 
		this.jqSelConsole.hide();
	}

	$('#terminal').css('left', $(window).width()/2 - 350);
	$(window).resize(function() {
        $('#terminal').css('left', $(window).width()/2 - 350);
    });
};

Terminal.prototype.toggleVisibility = function() {
	this.jqSelConsole.toggle();
	this.jqSelConsole.find("input").focus();
};

Terminal.prototype.handleCommand = function(command, modificator) {
	if (command == "") return;
    command = command.toLowerCase();

    this.addContentToTerminal(command);

	var message = "";

	this.consoleTrace.push(command);
	this.consoleActualTrace = this.consoleTrace.length;

	command = command.split(" ");

	var that = this;

	var cases = {
		clear : function() {
			that.jqSelConsole.find("div").remove();
		},
		color : function () {
			var usage = "Changes backround color and text color of the terminal.\n Usage: color [options] background-color color";
            if (typeof command[1] === 'undefined' && typeof command[2] === 'undefined'){
                message = usage;
                return;
            }
			var bc = command[1].charAt(0).toUpperCase() + command[1].slice(1),
				c  = command[2].charAt(0).toUpperCase() + command[2].slice(1);

			if (CSS_COLOR_NAMES.indexOf(bc) > -1) {
				that.jqSelConsole.css("background-color", bc);
				that.jqSelConsole.find("input").css("background-color", bc);
			} else {
				message = usage + "\n Background color doesn't exists";
			}

			if (CSS_COLOR_NAMES.indexOf(c) > -1) {
				that.jqSelConsole.css("color", c);
				that.jqSelConsole.find("input").css("color", c);
			} else {
                message = usage + "\n Color doesn't exists";
			}
		},
		list : function () {
			var casesSub = {
				commands : function () {
					$.each(cases, function(key, value) {
						if (key != "_default") message += key + ", ";
					});
					message = message.substring(0,message.length-2);
				},
				cssColors : function () {
					for (var i = 0; i < CSS_COLOR_NAMES.length; ++i) {
						message += CSS_COLOR_NAMES[i] + ", ";
					}
					message = message.substring(0,message.length-2);
				},
				_default : function () {
					message = "Option " + command[1] + " not recognized \n We recognize the following listable items: ";
					$.each(casesSub, function(key, value) {
						if (key != "_default") message += key + ", ";
					});
				}
			}
			casesSub[command[1]] ? casesSub[command[1]]() : casesSub._default();
		},
		show : function () {
			var casesSub = {
				variable : function () {
					message += window[command[2]];
				},
				_default : function () {
					message = "Option " + command[1] + " not recognized \n We recognize the following showable items: ";
					$.each(casesSub, function(key, value) {
						if (key != "_default") message += key + ", ";
					});
				}
			}

			casesSub.var = casesSub.variable;
			casesSub[command[1]] ? casesSub[command[1]]() : casesSub._default();
		},
		reload : function () {
			location.reload();
		},
		execute : function () {
			var usage = "Execute the code passed as argument \n Usage: execute [options] language code \n You can insert" +
                " the code with spaces, we handel it ;). \n We can execute the following languages: ";

			var casesSub = {
				javascript : function () {
					var exeption = "";
                	code = "try{" + code + "}catch(e){message = e.message}";
                	eval(code);
				},
				css : function () {
					message = "NOT YET IMPLEMENTED";
				},
				_default : function () {
					message = usage;
				}
			}
			
			$.each(casesSub, function(key, value) {
					if (key != "_default") usage += key + ", ";
			});

            if (typeof command[1] === 'undefined' && typeof command[2] === 'undefined'){
                message = usage;
                return;
            }
            var code = "";
            for (var i = 2; i < command.length; ++i) {
                code += command[i];
            }

            message = "ok";

            casesSub.js = casesSub.javascript;
            casesSub[command[1]] ? casesSub[command[1]]() : casesSub._default();
		},
		goto : function() {
			var usage = "Goes to the defined url \n Usage: goto [options] url";
			if (typeof command[1] !== 'undefined'){
				if (command[1].substring(0,7) == "http://") {
					window.location = command[1];	
				} else {
					window.location = "http://" + command[1];
				}
			} 
			else message = usage; 
		},
		special : function () {
			var usage = "Does especials things ;). \n Usage: special [options] option \n You can activate the following special features: ";
			var casesSub = {
				editmode : function() {
					if (command[2] == "on") {
						document.body.contentEditable='true'; document.designMode='on';
						message = "Now you can edit any content in the page .D";
					} else if (command[2] == "off") {
						document.body.contentEditable='false'; document.designMode='off';
					} else {
						if (document.body.contentEditable == "true") {
							document.body.contentEditable='false'; document.designMode='off';
						} else {
							document.body.contentEditable='true'; document.designMode='on';
							message = "Now you can edit any content in the page .D";
						}
					}
					
				},
				_default : function () {
					message = usage;
				}
			};
			
			$.each(casesSub, function(key, value) {
				if (key != "_default") usage += key + ", ";
			});

			casesSub[command[1]] ? casesSub[command[1]]() : casesSub._default();
		},
		_default : function () {
			message = "Command " + command[0] + " not recognized";
		}
	}

	cases.exec = cases.exe = cases.ex = cases.execute;
	cases.clr = cases.clear;

	cases[command[0]] ? cases[command[0]]() : cases._default();

	message = message.split("\n");
	for (var i = 0; i < message.length; i++) {
		this.addContentToTerminal(message[i]);
	}
};

Terminal.prototype.addContentToTerminal = function(text) {
	if(text === "") return;

	var numberOfMessages = Math.ceil(text.length/this.LINE_SIZE);
	for (var i = 0; i < numberOfMessages; i++) {
		this.jqSelConsole.find("input").before("<div>" + text.substring(i*this.LINE_SIZE,i*this.LINE_SIZE+this.LINE_SIZE) + "</div>");
	}
};

Terminal.prototype.showCurrentTrace = function() {
	this.jqSelConsole.find("input").focus().val("").val(this.consoleTrace[this.consoleActualTrace]);
};
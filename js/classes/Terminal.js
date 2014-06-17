function Terminal (consoleSelector, isActive) {
	this.consoleSelector    = consoleSelector;

	this.consoleActualTrace = 0;
	this.consoleTrace       = [];

	this.isActive  = isActive;

	this.LINE_SIZE = 200;

	this.init();
}

Terminal.prototype.init = function() {
	if (this.isActive) {
		this.consoleSelector.show();
	} else { 
		this.consoleSelector.hide();
	}

	$("document").on("keydown", function (event) {
		if (event.keyCode === 13);
	});
};

Terminal.prototype.handleCommand = function(command, modificator) {
	var message = "";

	this.consoleTrace.push(command);
	this.consoleActualTrace = this.consoleTrace.length;

	command = command.split(" ");
	switch (command[0]) {
		case "clear" :
			this.consoleSelector.find("div").remove();
		break;
		case "color" :
			var bc = command[1].charAt(0).toUpperCase() + command[1].slice(1),
				c  = command[2].charAt(0).toUpperCase() + command[2].slice(1);

			if (CSS_COLOR_NAMES.indexOf(bc) > -1) {
				this.consoleSelector.css("background-color", bc);
				this.consoleSelector.find("input").css("background-color", bc);
			} else {
				message = "Changes backround color and text color of the terminal.\n Usage: color [options] background-color color";
			}

			if (CSS_COLOR_NAMES.indexOf(c) > -1) {
				this.consoleSelector.css("color", c);
				this.consoleSelector.find("input").css("color", c);
			} else {
				message = "Changes backround color and text color of the terminal.\n Usage: color [options] background-color color";
			}
		break;
		case "list" :
			switch (command[1]) {
				case "commands" :
					for (var i = 0; i < TERMINAL_COMMANDS.length; ++i) {
						message += TERMINAL_COMMANDS[i] + ", ";
					}
					message = message.substring(0,message.length-2);
				break;
				default :
					message = "Option " + command[1] + " not recognized";
				break;
			}
		break
		case "show" :
			switch (command[1]) {
				case "variable" :
					message += window[command[2]];
				break;
				default:
					message = "Option " + command[1] + " not recognized";
				break;
			}
		break;
		case "reload" :
			location.reload();
		break;
		default :
			message = "Command " + command[0] + " not recognized";
	}

	
	message = message.split("\n");
	for (var i = 0; i < message.length; i++) {
		this.addContentToTerminal(message[i]);
	}
};

Terminal.prototype.addContentToTerminal = function(text) {
	if(text === "") return;

	var numberOfMessages = Math.ceil(text.length/this.LINE_SIZE);
	for (var i = 0; i < numberOfMessages; i++) {
		console.log(text.substring(i*this.LINE_SIZE,i*this.LINE_SIZE+this.LINE_SIZE));
		this.consoleSelector.find("input").before("<div>" + text.substring(i*this.LINE_SIZE,i*this.LINE_SIZE+this.LINE_SIZE) + "</div>");
	}
};

Terminal.prototype.showCurrentTrace = function() {
	this.consoleSelector.find("input").val(this.consoleTrace[this.consoleActualTrace]);
};
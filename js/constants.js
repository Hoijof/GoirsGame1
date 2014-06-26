var MAX_ENTITY_HEALTH  = 100,

	WORLD_FIGHT_FACTOR = 0.4,
	WORLD_BIRTH_FACTOR = 1,

	MAX_BATTLE_TURNS   = 50,
	MAX_ITERATIONS	   = 30,
	REFRESH_COUNTER    = 3,

	WORLD_MIN_SIZE     = 50,
	WORLD_MAX_SIZE     = 300,

    EXPERIENCE_LOSS_FACTOR = 0.2,
    EXPERIENCE_WIN_FACTOR = 1,
    MAX_ATTRIBUTE_LEVEL = 500,


    PLAYER_BASICS  = "PLAYER BASICS",
	UNUSED_VAR;

/*strength 		: 0,
 endurance		: 0,
 intelligence 	: 0,
 willpower		: 0,
 agility 		: 0,
 speed 			: 0,
 stamina	 	    : 0,
 faith 			: 0*/

var WARRIOR_TYPES = {
    warrior : [0.2, 0.2, 0.02, 0.2, 0.2, 0.18, 0, 0],
    mage    : [0.05, 0.15, 0.4, 0.3, 0.02, 0.02, 0.16, 0],
    rogue   : [0.1, 0.05, 0.1, 0.15, 0.25, 0.15, 0.15, 0.05]
};

var femaleNames = ["Aekkein", "Erna", "Gica", "Iris", "Laen", "Oanei", "Urusla", "Unt", "Zy", "Giny", "Teni", "Tania",
	"Tenisa", "Falish", "Tirs", "Bera", "Boria", "Terkia", "Tronash", "Si", "Gi", "Ti", "Fi", "Di", "Mi", "Peli", "Irnia", "Beth",
   "Riven", "Vi", "Lio", "Nayeli"];

var maleNames = ["Anttirnet", "Carnil", "Estiv", "Halt", "Hoijof", "Laen", "Lisiern", "Berin", "Ton", "Shome", "Regit",
	"Lurin", "Maers", "Musten", "Oanei", "Raesh", "Terio", "Unt", "Ust", "Redik", "James", "Loki", "Tem", "Regot",
	"Josh", "Tom" ,"Jei", "Lioth"];

var surnames = ["Golpeo", "Anorda", "Severnin", "Part", "Kek-vek-loah", "Vaen", "Nerivin", "Haeshi", "Vin-ti-selh",
	"Ver-to", "Vintoret", "Da Teri", "Von Bien", "Maer", "Serisn", "Vintaren", "Bertis", "Tetirit", "Tornet", "Bellabi",
	"Geron", "Tornes", "Gorez", "Lorez", "Gareth"];

var townNames = ["Laptius", "Birnicie", "Gerina", "Olvinast", "Maktius", "New Berinet", "Berinet", "Old Berinet",
	"Not So Old Berinet", "Dantias", "Maktius", "Bluelake", "Pryland", "Crystalsage"];

var townFirstNames = ["Great", "Big", "Blue", "Black", "Greay", "Nordic", "Rapid", "Shadow", "Violet", "White", "Gold", "Silver",
	"Bronze", "Iron", "Stone", "Water", "Rose", "Cold", "Cor", "Coast", "Bright", "Well", "Butter", "Dork", "Wind", "Orba", "North",
	"Wolf", "South", "East", "West"];

var townSecondNames = ["shore", "size", "port", "fox", "ham", "mill", "mere", "gate", "bush", "bank", "way", "dedge",
	"keep", "cliff", "row", "mount", "river", "sea", "fall", "flea", "wald", "crest", "wick", "well", "mead"];

var CSS_COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue",
    "BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue",
    "DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed",
    "DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray",
    "DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green",
    "GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue",
    "LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue",
    "LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue",
    "MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream",
    "MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise",
    "PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown",
    "SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato",
    "Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];

var MAIN_VIEW = {
    DESCRIPTION : "You were born in this harass land. War was your teacher since a young age and you know nothing but death and destruction. Welcome to the world.",
    PLAYER_FORM : {
        DESCRIPTION : "This is who you will be, choose wisely",
        NAME : "Name",
        SURNAME : "Surname",
        HAND    : "Preferred hand"
    }
};

var BASICS = {
    LEFT : "left",
    RIGHT: "right"
};
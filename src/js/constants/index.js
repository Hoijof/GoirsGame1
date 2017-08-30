export const BASICS = {
    MAX_ENTITY_HEALTH: 100,

    WORLD_FIGHT_FACTOR: 0.35,
    WORLD_BIRTH_FACTOR: 0.10,
    MAX_BATTLE_TURNS: 50,
    MAX_ITERATIONS: 30,
    REFRESH_COUNTER: 3,

    WORLD_MIN_SIZE: 100,
    WORLD_MAX_SIZE: 500,
    WORLD_MAX_POPULATION: 5000,

    EXPERIENCE_LOSS_FACTOR: 0.2,
    EXPERIENCE_WIN_FACTOR: 1,
    MAX_ATTRIBUTE_LEVEL: 500,


    PLAYER_BASICS: "PLAYER BASICS",
    FIGHTER_TYPES: [],
    UNUSED_VAR: null
};

/*strength 		: 0,
 endurance		: 0,
 intelligence 	: 0,
 willpower		: 0,
 agility 		: 0,
 speed 			: 0,
 stamina	 	    : 0,
 faith 			: 0*/

export const WARRIOR_TYPES = {
    warrior: [0.2, 0.2, 0.02, 0.2, 0.2, 0.18, 0, 0],
    mage: [0.05, 0.15, 0.4, 0.3, 0.02, 0.02, 0.16, 0],
    rogue: [0.1, 0.05, 0.1, 0.15, 0.25, 0.15, 0.15, 0.05],
    monk: [0.05, 0.10, 0.2, 0.2, 0.05, 0.05, 0.35]
};

export const femaleNames = ["Aekkein", "Erna", "Gica", "Iris", "Laen", "Oanei", "Urusla", "Unt", "Zy", "Giny", "Teni", "Tania",
    "Tenisa", "Falish", "Tirs", "Bera", "Boria", "Terkia", "Tronash", "Si", "Gi", "Ti", "Fi", "Di", "Mi", "Peli", "Irnia", "Beth",
    "Riven", "Vi", "Lio", "Nayeli"];

export const maleNames = ["Anttirnet", "Carnil", "Estiv", "Halt", "Hoijof", "Laen", "Lisiern", "Berin", "Ton", "Shome", "Regit",
    "Lurin", "Maers", "Musten", "Oanei", "Raesh", "Terio", "Unt", "Ust", "Redik", "James", "Loki", "Tem", "Regot",
    "Josh", "Tom", "Jei", "Lioth"];

export const surnames = ["Golpeo", "Anorda", "Severnin", "Part", "Kek-vek-loah", "Vaen", "Nerivin", "Haeshi", "Vin-ti-selh",
    "Ver-to", "Vintoret", "Da Teri", "Von Bien", "Maer", "Serisn", "Vintaren", "Bertis", "Tetirit", "Tornet", "Bellabi",
    "Geron", "Tornes", "Gorez", "Lorez", "Gareth"];

export const townNames = ["Laptius", "Birnicie", "Gerina", "Olvinast", "Maktius", "New Berinet", "Berinet", "Old Berinet",
    "Not So Old Berinet", "Dantias", "Maktius", "Bluelake", "Pryland", "Crystalsage"];

export const townFirstNames = ["Great", "Big", "Blue", "Black", "Greay", "Nordic", "Rapid", "Shadow", "Violet", "White", "Gold", "Silver",
    "Bronze", "Iron", "Stone", "Water", "Rose", "Cold", "Cor", "Coast", "Bright", "Well", "Butter", "Dork", "Wind", "Orba", "North",
    "Wolf", "South", "East", "West"];

export const townSecondNames = ["shore", "size", "port", "fox", "ham", "mill", "mere", "gate", "bush", "bank", "way", "dedge",
    "keep", "cliff", "row", "mount", "river", "sea", "fall", "flea", "wald", "crest", "wick", "well", "mead"];

export const CSS_COLOR_NAMES = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue",
    "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue",
    "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed",
    "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray",
    "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green",
    "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue",
    "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue",
    "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue",
    "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream",
    "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise",
    "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown",
    "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato",
    "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];

export const MAIN_VIEW = {
    TITLE: "GOIRS'S GAME",
    PLAYER_FORM: {
        DESCRIPTION: "You were born in this harass land. War was your teacher since a young age and you know nothing but death and destruction. Welcome to the world.",
        LEGEND: "This is who you will be, choose wisely",
        NAME: "Name",
        SURNAME: "Surname",
        HAND: "Preferred hand",
        SEX: "Sex",
        CLASS: "Chose your class",
        warrior: "Warrior",
        mage: "Mage",
        rogue: "Rogue",
        monk: "Monk"
    },
    HISTORY: {
        MAIN: "You were raised by some potatoes who were outlawed by the law of Goirs. Your ideals are the same " +
        "as their, freedom for the potatoes. You, the captain potato go out in this wild world in order to avenge your potatoes.  potatoes.",
        WAKE_UP: "You wake up and you find yourself surrounded by a forest. It's pretty deep and you can't see anything but shadows and your own feet."
        + " You walk for hours finding nothing but forest. At the end of the forest you find a village, what will you do?",
        ENTER_TOWN_01: "You enter the town and you're attacked!",
        KEEP_GOING: "You keep going"
    }
};

export const EQUIVALENCES = {
    PLAYER_FORM: {}
};

EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.NAME] = "name";
EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.SURNAME] = "surname";
EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.HAND] = "hand";
EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.SEX] = "sex";
EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.CLASS] = "class";
EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.mage] = "mage";
EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.rogue] = "rogue";
EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.warrior] = "warrior";
EQUIVALENCES.PLAYER_FORM[MAIN_VIEW.PLAYER_FORM.monk] = "monk";

export const TYPES = {
    WEAPON: 0
};

export const TRANSLATIONS = {
    LEFT: "Left",
    RIGHT: "Right",
    MALE: "Male",
    FEMALE: "Female",
    EASY: 'Easy',
    MEDIUM: 'Medium',
    HARD: 'Hard',
    TIERS: [
        'Useless'
    ]
};
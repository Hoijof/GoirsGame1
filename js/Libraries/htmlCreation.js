function HtmlCreation () {

}

HtmlCreation.createElem = function (elem, id, className, content, attributes) {
    return (typeof attributes != 'undefined') ? '<' + elem +' id="' + id + '" class="' + className + '" ' + attributes
        + '>' + content + '</' + elem + '>' : '<' + elem +' id="' + id + '" class="' + className + '">' + content + '</' + elem + '>';
};

HtmlCreation.createMonoElem = function (elem, id, className, attributes) {
    return (typeof attributes != 'undefined') ? '<' + elem +' id="' + id + '" class="' + className + '" ' + attributes
        + '>' : '<' + elem +' id="' + id + '" class="' + className + '">';
};

HtmlCreation.createHorizontalLine = function (className) {
    return (typeof className != 'undefined') ? '<hr class="' + className + '"/>' : '<hr/>';
};
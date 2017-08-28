function setWidth() {
    $('#mainBody').css('width', $(window).width() - 500);
}

$(document).ready(function() {
    setWidth();
    $(window).resize(function() {
        setWidth();
    });
});
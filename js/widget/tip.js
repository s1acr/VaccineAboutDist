$(document).ready(function() {
    initTipWidget()
})

$(document).bind("DOMNodeInserted", function() {
    initTipWidget()
})

function initTipWidget() {
    $("tip").css({
        "background-color": "rgb(229, 229, 229)",
        "color": 'gray',
        "padding": "3px 9px",
        "font-size": "12px",
        "border-radius": "10px",
        "position": "absolute",
        "display": "none",
    })
    
    $("tip").parent().hover(function () {
        $(this).find("tip").show()
    }, function () {
        $(this).find("tip").hide()
    })
}


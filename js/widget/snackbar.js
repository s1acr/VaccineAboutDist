class Toast {
    static show = (mes) => {
        // 查找是否已经初始化
        if (!document.getElementById("snackbar")) {
            const html = $(`<div id="snackbar"></div>`)
            $("body").append(html)
            const cssFileUrl='../../css/widget/snackbar.css';
            if (cssFileUrl) {
                $("<link>")
                    .attr({
                        rel: "stylesheet",
                        type: "text/css",
                        href: cssFileUrl
                    })
                    .appendTo("head");
            }
        }
        this.showToast(mes)
    }

    static showToast = (mes) => {
        console.log(mes)
        $("#snackbar").addClass("show")
        $("#snackbar").text(mes)
        setTimeout(function () {
            $("#snackbar").removeClass("show")
        }, 2000);
    }
}
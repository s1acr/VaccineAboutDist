
$(function () {
    console.log("first log")
    loadVaccine()

    var sex = "N"
    $(".adverse-event-sex").each(function () {
        $(this).click(function (i, e) {
             sex = $(this).val()
        })
    })

    $("#adverse-event-submit-btn").click(function () {

        var data = {

            description: $("#adverse-event-description").val()

        }
        postAdverseEvent(
            onSuccess = function (data) {
                console.log("接口调用成功")
            },
            data = data,
            token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ0ZXN0IiwiZXhwIjoxNjgxNzIyNDkxLCJqdGkiOiIxMiIsImlhdCI6MTY4MTYzNjA5MSwiaXNzIjoiQWJvdXRWYWNjaW5lIiwibmJmIjoxNjgxNjM2MDkxLCJzdWIiOiJ0b2tlbiJ9.-xha2gQKngbQjaDHui9XxUHc43JCm_OFq65wQmLIJkw"
        )
    })
})

function loadVaccine() {
    $.ajax({
        url: "http://43.140.194.248:8080/api/adverse?page=1&pageSize=50",
        type: "get",
        dataType: "json",
        success: function (data) {
            console.log(data.msg)
            var events = data.data.eventList
            for (var i = 0; i < events.length; i++) {
                console.log(events[i].description)
                var html = `
                    <div>${events[i].description}</div>
                `
                $(".search-result").append(html)
            }
        }
    })
}

function postAdverseEvent(onSuccess, data, token) {
    $.ajax({
        url: "http://43.140.194.248:8080/api/adverse?token=" + token,
        type: "post",
        dataType: "json",
        data: JSON.stringify(data),
        success: function (data) {
            console.log(data.msg)
            onSuccess(data)
        }
    })
}
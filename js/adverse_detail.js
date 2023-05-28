$(function () {
    initPage()
})

function initPage() {
    let adverseId = getUrlParam("adverseId")
    console.log(adverseId)
    if (!adverseId) {
        Toast.show("参数错误")
        return
    }
    loadAdverseDetail(
        onSuccess = (json) => {
            renderAdverseDetail(json.data)
        },
        id = adverseId
    )
}

function renderAdverseDetail(detail) {
    let names = Object.getOwnPropertyNames(detail)
    $.each(names, (i, s) => {
        eval(`$('#main-content').find("#detail-${s}").text(detail.${s})`)
    })

    $("#detail-item-symptom").empty()
    $("#detail-item-symptom").append("<tr><th>症状</th><th>OAE</th></tr>")
    $.each(detail.symptomList, (i, s) => {
        let html = `
                <tr>
                    <td>${s.symptom}</td>
                    <td>${s.oaeIRI}</td>
                </tr>
            `
        $("#detail-item-symptom").append(html)
    })

    $("#detail-item-vaccine").empty()
    $("#detail-item-vaccine").append("<tr><th>疫苗类型</th><th>疫苗名称</th><th>制造商</th><th>接种日期</th><th>接种剂次</th><th>接种途径</th><th>接种部位</th></tr>")
    $.each(detail.vaccineList, (i, v) => {
        let html = `
                <tr>
                    <td>${v.type}</td>
                    <td class="vaccine_name clickable_item" id="vaccine_${1}">${v.name}</td>
                    <td>${v.manufacturer}</td>
                    <td>${v.vaccinateDate}</td>
                    <td>${v.dose}</td>
                    <td>${v.route}</td>
                    <td>${v.site}</td>
                </tr>
            `
        $("#detail-item-vaccine").append(html)
    })
    $("#detail-item-vaccine").find("td.vaccine_name").on("click", () => {
        let vaccineId = $(this).attr("id").split("_")[1]
        window.open(`./vaccine_detail.html?vaccineId=${vaccineId}`)
    })
}

function loadAdverseDetail(onSuccess, adverseId) {
    $.ajax({
        url: "http://43.140.194.248/api/adverse",
        type: "GET",
        dataType: "json",
        data: {
            id: adverseId,
        },
        success: function (data) {
            onSuccess(data)
        }
    })
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
$(function () {
    initPage()
})

function initPage() {
    let vaccineId = getUrlParam("vaccineId")
    console.log(vaccineId)
    if (!vaccineId) {
        Toast.show("参数错误")
        return
    }
    loadVaccineDetail(
        onSuccess = (json) => {
            renderVaccineDetail(json.data)
        },
        id = vaccineId
    )
    loadAdverseEvent(
        onSuccess = (json) => {
            handleAdverse(json.data.data)
        },
        vaccineId = vaccineId
    )
}

function renderVaccineDetail(detail) {
    let names = Object.getOwnPropertyNames(detail)
    $.each(names, (i, n) => {
        let id = `#vaccine-${n}`
        $(id).text(detail[n])
    })
}

function handleAdverse(list) {
    $.each(list, (index, e) => {
        var dom = createAdverseItem(e)
        $('.vaccine-adverse-box').append(dom)
    })
}

function loadVaccineDetail(onSuccess, id) {
    $.ajax({
        url: "http://43.140.194.248/api/vaccine/cfda",
        type: "GET",
        dataType: "json",
        data: {
            id: id,
        },
        success: function (data) {
            onSuccess(data)
        }
    })
}

function loadAdverseEvent(onSuccess, vaccineId) {
    $.ajax({
        url: "http://43.140.194.248/api/adverse",
        type: "GET",
        dataType: "json",
        data: {
            vaccineId: vaccineId,
        },
        success: function(data) {
            onSuccess(data)
        }
    })
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function createAdverseItem(result) {
    let html = `
    <div class="search-result-item">
        <div class="title-box">
            <div class="title">#${result.id.toString(16).padStart(8, "0")}</div>
            <div class="sub-title">${result.createDate}</div>
        </div>
        <p class="item-long-text" title="不良反应描述">${(result.description == "" ? "无" : result.description)}</p>
        <div class="tag-container">
        </div>
        <tip>点击显示详情</tip>
    </div>
    `
    let element = $(html)
    $.each(result.symptomList, (i, e) => {
        element.find(".tag-container").append(`<div class="tag-item">${e.symptom}</div>`)
    })
    element.on("click", () => {
        window.open(`adverse_detail.html?adverseId=${result.id}`)
    })
    return element
}
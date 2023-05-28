
$(function () {
    searchAdverse("")
})

function searchAdverse(keyword) {
    loadAdverse(
        onSuccess = function (json) {
            console.log(json)
            handleAdverse(json.data.data)
        },
        keyword = keyword
    )
}

function handleAdverse(list) {
    $.each(list, (index, e) => {
        var dom = createResultItem(e)
        dom.click(function () {
            window.open(`/page/adverse_detail.html?adverseId=${e.id}`)
        })
        $('#search-result-box').append(dom)
    })
}

function loadAdverse(onSuccess, page=1, pageSize=21) {
    let query = {
        page: page,
        pageSize: pageSize
    }
    $.ajax({
        url: "http://43.140.194.248/api/adverse",
        type: "GET",
        dataType: "json",
        data: query,
        success: function (data) {
            onSuccess(data)
        }
    })
}

function createResultItem(result) {
    const html = `
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
    const element = $(html)
    $.each(result.symptomList, (i, e) => {
        console.log(e.symptom)
        element.find(".tag-container").append(`<div class="tag-item">${e.symptom}</div>`)
    })
    return element
}

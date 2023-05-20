
$(function () {
    searchAdverse("")
    
    $('.bottom-detail-card').hide()

    // 点击其他区域
    $(document).click(function (e) {
        let resultItem = $('.search-result-item')
        let bottomCard = $('.bottom-detail-card')
        if (!bottomCard.is(e.target) && bottomCard.has(e.target).length === 0
            && !resultItem.is(e.target) && resultItem.has(e.target).length === 0) {
            bottomCard.hide()
        }
    })
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

function loadAdverse(onSuccess, keyword, page=1, pageSize=20) {
    let query = {
        keyword: keyword,
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
    return element
}

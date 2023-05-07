
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
        dom.click(showDetailCard(e))
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
        <div class="item-label">不良反应描述：</div>
        <p class="item-long-text">${result.description}</p>
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

function showDetailCard(e) {
    return () => {
        $('.bottom-detail-card').show()
        let names = Object.getOwnPropertyNames(e)
        $.each(names, (i, s) => {
            eval(`$('.bottom-detail-card').find("#detail-${s}").text(e.${s})`)
        })

        $("#detail-item-symptom").empty()
        $("#detail-item-symptom").append("<tr><th>症状</th><th>OAE</th></tr>")
        $.each(e.symptomList, (i, s) => {
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
        $.each(e.vaccineList, (i, v) => {
            let html = `
                <tr>
                    <td>${v.type}</td>
                    <td>${v.name}</td>
                    <td>${v.manufacturer}</td>
                    <td>${v.vaccinateDate}</td>
                    <td>${v.dose}</td>
                    <td>${v.route}</td>
                    <td>${v.site}</td>
                </tr>
            `
            $("#detail-item-vaccine").append(html)
        })
    }
}


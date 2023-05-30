var vaccineId
var symptomId
$(function () {
    initVaccineSelectList()
    initSymptomSelectList()
    initVaccineSelectSearch()
    initSymptomSelectSearch()
    searchAdverse("")

    $('#adverse-search-submit-button').on('click', function () {
        const keyword = $('#adverse-search-input').val()
        if (vaccineId != undefined || symptomId != undefined) {
            searchAdverseResult()
            return
        }
        searchAdverse(keyword)
    })


})

function initVaccineSelectList() {
    searchVaccineSelectList()
}

function initSymptomSelectList() {
    searchSymptomSelectList()
}

function initVaccineSelectSearch() {
    $('#vaccine-input').keyup(function (e) {
        if (e.keyCode == 13) {
            $('#vaccine-search').click()
        }
    })
    $('#vaccine-search').click(function () {
        const keyword = $('#vaccine-input').val()
        searchVaccineSelectList(keyword)
    })

}

function initSymptomSelectSearch() {
    $('#symptom-input').keyup(function (e) {
        if (e.keyCode == 13) {
            $('#symptom-search').click()
        }
    })
    $('#symptom-search').click(function () {
        const keyword = $('#symptom-input').val()
        searchSymptomSelectList(keyword)
    })
}

function searchVaccineSelectList(keyword = "", page = 1, pageSize = 21) {
    showLoading("#vaccine-search-result")
    loadVaccineList(
        onSuccess = function (json) {
            handleVaccineSelectList(json.data.data)
            hideLoading("#vaccine-search-result", "#vaccine-result-list")
        },
        keyword = keyword,
        page = page,
        pageSize = pageSize
    )
}

function searchSymptomSelectList(keyword = "", page = 1, pageSize = 21) {
    showLoading("#symptom-search-result")
    loadSymptomList(
        onSuccess = function (json) {
            handleSymptomSelectList(json.data.data)
            hideLoading("#symptom-search-result", "#symptom-result-list")
        },
        keyword = keyword,
        page = page,
        pageSize = pageSize
    )
}

function searchAdverse(keyword) {
    showLoading("#search-result-panel")
    loadAdverse(
        onSuccess = function (json) {
            handleAdverse(json.data.data)
            hideLoading("#search-result-panel", "#search-result-box")
        },
        keyword = keyword
    )
}

function searchAdverseResult() {
    showLoading("#search-result-panel")
    loadAdverseResult(
        onSuccess = function (json) {
            console.log(json)
            handleAdverseResult(json.data.data)
            hideLoading("#search-result-panel", "#search-adverse-result-box")
        }
    )
}

function showSelectSymptomInfo() {
    if (symptomId == undefined) {
        return
    }
    loadSymptomInfo(
        onSuccess = function (json) {
            $('#symptom-select-info-box .search-select-item-info').remove()
            const names = Object.getOwnPropertyNames(json.data)
            $.each(names, (i, n) => {
                const value = eval('json.data.' + n)
                if (n == "id" || value == "") {
                    return
                }
                const item = $(`<div class="search-select-item-info">${value}</div>`)
                $('#symptom-select-info-box').append(item)
            })
            $('#symptom-select-info-box').css('visibility', 'visible')
        },
        id = symptomId
    )
}

function closeSelectSymptomInfo() {
    $('#symptom-select-info-box').css('visibility', 'hidden')
}

function showSelectVaccineInfo() {
    if (vaccineId == undefined) {
        return
    }
    loadVaccineInfo(
        onSuccess = function (json) {
            $('#vaccine-select-info-box .search-select-item-info').remove()
            const names = Object.getOwnPropertyNames(json.data)
            $.each(names, (i, n) => {
                const value = eval('json.data.' + n)
                if (n == "id" || value == "") {
                    return
                }
                const item = $(`<div class="search-select-item-info">${value}</div>`)
                $('#vaccine-select-info-box').append(item)
            })
            $('#vaccine-select-info-box').css('visibility', 'visible')
        },
        id = vaccineId
    )
}

function closeSelectVaccineInfo() {
    $('#vaccine-select-info-box').css('visibility', 'hidden')
}

function handleVaccineSelectList(list, append = false) {
    if (!append) {
        $('#vaccine-result-list').empty()
    }
    $.each(list, (i, e) => {
        const dom = $(`<li>${e.productName}</li>`)
        dom.click(function () {
            if (dom.hasClass("active")) {
                dom.removeClass("active")
                vaccineId = undefined
                closeSelectVaccineInfo()
            } else {
                dom.addClass("active")
                dom.siblings().removeClass("active")
                vaccineId = e.id
                showSelectVaccineInfo()
            }
        })
        $('#vaccine-result-list').append(dom)
    })
}

function handleSymptomSelectList(list, append = false) {
    if (!append) {
        $('#symptom-result-list').empty()
    }
    $.each(list, (i, e) => {
        const dom = $(`<li>${e.termLabel}</li>`)
        dom.click(function () {
            if (dom.hasClass("active")) {
                dom.removeClass("active")
                symptomId = undefined
                closeSelectSymptomInfo()
            } else {
                dom.addClass("active")
                dom.siblings().removeClass("active")
                symptomId = e.id
                showSelectSymptomInfo()
            }
        })
        $('#symptom-result-list').append(dom)
    })
}

function handleAdverse(list) {
    $('#search-result-box').empty()
    $.each(list, (index, e) => {
        const dom = createResultItem(e)
        dom.click(function () {
            window.open(`/page/adverse_detail.html?adverseId=${e.id}`)
        })
        $('#search-result-box').append(dom)
    })
}

function handleAdverseResult(list) {
    $('#adverse-result-table-body').empty()
    $.each(list, (i, e) => {
        const dom = createAdverseResultItem(e)
        $('#adverse-result-table-body').append(dom)
    })
}

function loadVaccineInfo(onSuccess, id) {
    const query = {
        id: id
    }
    $.ajax({
        url: "http://43.140.194.248/api/vaccine/cfda",
        type: "GET",
        dataType: "json",
        data: query,
        success: function (data) {
            onSuccess(data)
        }
    })
}

function loadSymptomInfo(onSuccess, id) {
    $.ajax({
        url: `http://43.140.194.248/api/oae/${id}`,
        type: "GET",
        dataType: "json",
        success: function (data) {
            onSuccess(data)
        }
    })
}

function loadVaccineList(onSuccess, keyword = "", page = 1, pageSize = 20) {
    const query = {
        page: page,
        pageSize: pageSize,
        productName: keyword
    }
    $.ajax({
        url: "http://43.140.194.248/api/vaccine/cfda",
        type: "GET",
        dataType: "json",
        data: query,
        success: function (data) {
            onSuccess(data)
        }
    })
}

function loadSymptomList(onSuccess, keyword = "", page = 1, pageSize = 20) {
    const query = {
        page: page,
        pageSize: pageSize,
        label: keyword
    }
    $.ajax({
        url: "http://43.140.194.248/api/oae/label",
        type: "GET",
        dataType: "json",
        data: query,
        success: function (data) {
            onSuccess(data)
        }
    })
}

function loadAdverse(onSuccess, keyword, page = 1, pageSize = 21) {
    const query = {
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

function loadAdverseResult(onSuccess, page = 1, pageSize = 21) {
    const query = {
        page: page,
        pageSize: pageSize
    }
    if (vaccineId != undefined) {
        query.vaccineId = vaccineId
    }
    if (symptomId != undefined) {
        query.oaeId = symptomId
    }
    $.ajax({
        url: "http://43.140.194.248/api/adverse/result",
        type: "GET",
        dataType: "json",
        data: query,
        success: function (data) {
            onSuccess(data)
        }
    })
}

function showLoading(boxDom) {
    $(boxDom).children().hide()
    $(boxDom).find('.loading-box').show()
}

function hideLoading(boxDom, showChild) {
    $(boxDom).find(".loading-box").hide()
    $(boxDom).find(showChild).show()
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
        element.find(".tag-container").append(`<div class="tag-item">${e.symptom}</div>`)
    })
    return element
}

function createAdverseResultItem(result) {
    // 随机浮点数
    const prr = Math.random() * 10
    const chi = Math.random() * 5
    const html = `
        <tr>
            <td>${result.vaccineName}</td>
            <td>${result.oaeTerm}</td>
            <td>${result.total}</td>
            <td>${prr}</td>
            <td>${chi}</td>
        </tr>
    `
    const element = $(html)
    return element

}

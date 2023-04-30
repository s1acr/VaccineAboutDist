
$(function () {
    initVaccineTypeList()
    initVaccineList()


    initSumbmitOnClickListener()

    // 隐藏
    $('.vaccine-detail-box').hide()
    $('.vaccine-detail-box').click(() => {
        $('.vaccine-detail-box').hide()
    })
})

function initSumbmitOnClickListener() {
    $("#vaccine-submit-button").click(function () {
        let keyword = $("#vaccine-input-product-name").val()
        console.log(keyword)
        loadVaccineList(
            onSuccess = function (json) {
                console.log(json)
                let vaccineList = json.data.data
                renderVaccineList(vaccineList, true)
            },
            keyword = keyword
        )
    })
}


function initVaccineTypeList() {
    loadVaccineTypeList(
        onSuccess = function (json) {
            let typeList = json.data.data
            renderVaccineTypeList(typeList)
        }
    )
}

function initVaccineList() {
    loadVaccineList(
        onSuccess = function (json) {
            let vaccineList = json.data.data
            renderVaccineList(vaccineList)
        }
    )
}

function renderVaccineTypeList(typeList) {
    $.each(typeList, function (index, e) {
        let html = `<li>${e.type}</li>`
        $('#vaccine-type-container').append(html)
    })
    $('#vaccine-type-container').on('click', 'li', function () {
        let typeStr = $(this).text()
        loadVaccineListByType(
            onSuccess = function (json) {
                console.log(json)
                let vaccineList = json.data.data
                renderVaccineList(vaccineList, true)
            },
            type = typeStr
        )
    })
}

function renderVaccineList(vaccineList, isClear = false) {
    if (isClear) {
        $('#vaccine-search-result-box').html('')
    }
    $.each(vaccineList, (index, e) => {
        let html = `
            <div class="vaccine-result-item">
                <div class="vaccine-result-card" id="vaccine-result-${e.id}">
                    <div class="vaccine-result-title">${e.type}</div>
                    <div class="vaccine-result-label">疫苗名称</div>
                    <div class="vaccine-result-name">${e.productName}</div>
                    <div class="vaccine-result-label">生产公司</div>
                    <div class="vaccine-result-manu">${e.productionCompany}</div>
                </div>
            </div>
        `
        $('#vaccine-search-result-box').append(html)
        $(`#vaccine-result-${e.id}`).click(function () {
            renderVaccineDetailCard(e)
        })
    })
}

function renderVaccineDetailCard(vaccine) {
    let names = Object.getOwnPropertyNames(vaccine)
    $.each(names, (i, n) => {
        let id = `#vaccine-${n}`
        $(id).text(vaccine[n])
    })
    $('.vaccine-detail-box').show()
}


function loadVaccineTypeList(onSuccess, page = 1, pageSize = 20) {
    let query = {
        page: page,
        pageSize: pageSize
    }
    $.ajax({
        url: "http://43.140.194.248/api/vaccine/type",
        type: "GET",
        dataType: "json",
        data: query,
        success: function (data) {
            onSuccess(data)
        }
    })
}

function loadVaccineList(onSuccess, keyword = "", page = 1, pageSize = 20) {
    let query = {
        page: page,
        pageSize: pageSize,
        productName: keyword
    }
    console.log(query)
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

function loadVaccineListByType(onSuccess, type, page = 1, pageSize = 20) {
    let query = {
        page: page,
        pageSize: pageSize,
        type: type
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
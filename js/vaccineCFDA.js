
$(function () {
    initVaccineTypeList()
    initVaccineList()

    initSumbmitOnClickListener()
    initTypeDetailLabelOnClickListener()
    // 隐藏
    $('.vaccine-detail-box').hide()
    $('.vaccine-detail-box').click(() => {
        $('.vaccine-detail-box').hide()
    })
    $('#vaccine-type-detail').hide()
})

function initSumbmitOnClickListener() {
    $("#vaccine-submit-button").click(function () {
        let keyword = $("#vaccine-input-product-name").val()
        $('#vaccine-type-detail').hide()
        loadVaccineList(
            onSuccess = function (json) {
                let vaccineList = json.data.data
                renderVaccineList(vaccineList, true)
            },
            keyword = keyword
        )
    })
}

function initTypeDetailLabelOnClickListener() {
    $('#vaccine-type-detail-label-list li').on('click', function () {
        $(this).addClass('active')
        $(this).siblings().removeClass('active')
        let field = $(this).attr('id')
        let value = eval('vaccineDetail.' + field)
        $('.vaccine-type-detail-content-box').html(value)
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

var vaccineDetail
function renderVaccineTypeList(typeList) {
    $.each(typeList, function (index, e) {
        let html = `<li typeId="${e.id}">${e.type}</li>`
        $('#vaccine-type-container').append(html)
    })
    $('#vaccine-type-container').on('click', 'li', function () {
        let typeStr = $(this).text()
        let typeId = $(this).attr('typeId')
        loadVaccineListByType(
            onSuccess = function (json) {
                let vaccineList = json.data.data
                renderVaccineList(vaccineList, true)
            },
            type = typeStr
        )
        loadVaccineTypeDetail(
            onSuccess = function (json) {
                vaccineDetail = json.data
                if (vaccineDetail.disease_introduction != "") {
                    $('#vaccine-type-detail').show()
                    $('#vaccine-type-detail-label-list li:first-child').trigger('click')
                }else {
                    $('#vaccine-type-detail').hide()
                }
            },
            typeId = typeId
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

function loadVaccineTypeDetail(onSuccess, typeId) {
    let query = {
        id: typeId
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
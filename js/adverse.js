
$(function () {
    init()
})


const init = () => {
    console.log('init')
    hideElement()
    initClickListener()
    addVaccineInfoTableRow()
}

const hideElement = () => {
    $('.report-tag-add-box').hide()
    $('.table-vaccine-add-box').hide()
}


const initClickListener = () => {
    // 点击选择疫苗
    $('#table-vaccine-add-result-list').on('click', 'li', function () {
        var text = $(this).text()
        console.log(text)
        $(currentVaccineBoxId).text(text)
    })
    //点击添加不良反应标签
    $('#symptom-tag-add-btn').click(function () {
        if (changeVisible($('.report-tag-add-box'))) {
            initSymptomTagList()
        }
    })
    //点击标签添加
    let tagSet = new Set()
    $('#report-tag-add-result-list').on('click', 'li', function () {
        let tag = $(this).text()
        let oaeId = $(this).attr('oaeId')
        if (tagSet.has(tag)) {
            showToast('不能重复添加')
            return
        }
        tagSet.add(tag)
        let html = `<div class='report-tag'><div class="tag" oaeId="${oaeId}">${tag}</div><div class="delete">x</div></div>`
        let element = $(html)
        element.children(".delete").hide()
        element.on('click', '.delete', function () {
            tagSet.delete(tag)
            element.remove()
        })
        element.hover(function () {
            element.children(".delete").show()
        }, function () {
            element.children(".delete").hide()
        })
        $('.report-tag-box').append(element)
    })
    //点击标签按钮搜索
    $('.report-tag-add-submit').click(function () {
        let keyword = $('#symptom-tag-add-input').val()
        loadSymptomTagList(function (data) {
            handleSymptomTagList(data)
        }, keyword)
    })
    // 点击添加疫苗信息
    $('.report-vaccinate-table-last').click(function () {
        addVaccineInfoTableRow()
    })
    // 点击搜索疫苗
    $('.table-vaccine-add-submit').click(function () {
        var keyword = $('.table-vaccine-add-input').first().val()
        console.log(keyword)
        loadVaccineList(function (data) {
            handleVaccineList(data)
        }, keyword)
    })
    // 点击其他区域
    $(document).click(function (e) {
        let symptomAddBtn = $('#symptom-tag-add-btn')
        let symptomAddBox = $('.report-tag-add-box')
        if (!symptomAddBox.is(e.target) && symptomAddBox.has(e.target).length === 0
            && !symptomAddBtn.is(e.target) && symptomAddBtn.has(e.target).length === 0) {
            symptomAddBox.hide()
        }
        let vaccineAddBtn = $('.table-item-select-vaccine')
        let vaccineAddBox = $('.table-vaccine-add-box')
        if (!vaccineAddBox.is(e.target) && vaccineAddBox.has(e.target).length === 0
            && !vaccineAddBtn.is(e.target) && vaccineAddBtn.has(e.target).length === 0) {
            vaccineAddBox.remove()
        }
    })
    // 提交
    $('#report-submit-button').click(function () {
        uploadReport()
    })
}

const getReport = () => {
    let report = {}
    // 编码
    report.code = $('#report-code').val()
    // 姓名
    report.name = $('#report-name').val()
    // 性别
    report.sex = $('#report-sex').find(':checked').val()
    // 出生日期
    let birth = $('#report-birth').val()
    if (birth) {
        report.birth = new Date(birth).toISOString()
    }
    // 联系方式
    report.phone = $('#report-phone').val()
    // 地址
    report.address = $('#report-address').val()
    // 就诊单位
    report.treatmentDepartment = $('#report-treatmentDepartment').val()
    // 反应发生日期
    let onsetDate = $('#report-onset-date').val()
    if (onsetDate) {
        report.onsetDate = new Date(onsetDate).toISOString()
    }
    // 描述
    report.description = $('#report-description').val()
    // 标签
    let symptomList = []
    $('.report-tag-box').children('.report-tag').each(function () {
        symptomList.push({
            symptom: $(this).children('.tag').text(),
            oaeId: parseInt($(this).children('.tag').attr('oaeId'))
        })
    })
    report.symptomList = symptomList
    // 报告人
    report.rapporteur = $('#report-rapporteur').val()
    // 报告人联系电话
    report.rapporteurPhone = $('#report-rapporteurPhone').val()
    // 报告人地址
    report.rapporteurAddress = $('#report-rapporteurAddress').val()
    // 疫苗信息
    let vaccineList = []
    $('#report-vaccine-tbody').children('tr').each(function () {
        let vaccineId = $(this).find('.table-item-select-vaccine').first().attr('vaccineId')
        if (vaccineId) {
            let vaccine = {
                vaccineId: parseInt(vaccineId),
                dose: $(this).find('.table-item-input.dose').first().val(),
                route: $(this).find('.table-item-input.route').first().val(),
                site: $(this).find('.table-item-input.site').first().val(),
            }
            let vaccinateDate = $(this).find('.table-item-input-date').first().val()
            if (vaccinateDate) {
                vaccine.vaccinateDate = new Date(vaccinateDate).toISOString()
            }
            vaccineList.push(vaccine)
        }
    })
    report.vaccineList = vaccineList
    return report
}

const addVaccineInfoTableRow = () => {
    let i = $('#report-vaccine-tbody tr').length
    var html = `
                    <tr>
                        <td>
                            <div class="table-item-select-vaccine" id="select-vaccine-${i}">点击选择疫苗</div>
                        </td>
                        <td>
                            <input class="table-item-input-date" type="date">
                        </td>
                        <td>
                            <input class="table-item-input dose" type="text" placeholder="点击输入接种剂次">
                        </td>
                        <td>
                            <input class="table-item-input route" type="text" placeholder="点击输入接种途径">
                        </td>
                        <td>
                            <input class="table-item-input site" type="text" placeholder="点击输入接种部位">
                        </td>
                        <td class="table-item-delete">
                            x
                        </td>
                    </tr>
        `
    var element = $(html)
    $('#report-vaccine-tbody').children(':last-child').before(element)
    $(`#select-vaccine-${i}`).on('click', function () {
        let current = $(this)
        current.parent().append(createVaccineSearchBox(function () {
            var text = $(this).text()
            var id = $(this).attr('vaccineId')
            console.log(text)
            current.text(text)
            current.attr('vaccineId', id)
        }))
        initVaccineList()
    })
    element.hover(function () {
        element.children('.table-item-delete').show()
    }, function () {
        element.children('.table-item-delete').hide()
    })
    element.children('.table-item-delete').on('click', function () {
        element.remove()
    })

}

const initSymptomTagList = () => {
    $('#report-tag-add-result-list').empty()
    loadSymptomTagList(function (data) {
        handleSymptomTagList(data)
    }, '')

}

const initVaccineList = () => {
    $('#table-vaccine-add-result-list').empty()
    loadVaccineList(function (data) {
        handleVaccineList(data)
    }, '')
}

const handleSymptomTagList = (data) => {
    $('#report-tag-add-result-list').empty()
    renderSymptomTagList(data.data.data)
}

const handleVaccineList = (data) => {
    $('#table-vaccine-add-result-list').empty()
    renderVaccineList(data.data.data)
}

const renderSymptomTagList = (labelList) => {
    $.each(labelList, function (index, item) {
        $('#report-tag-add-result-list').append(`<li oaeId="${item.id}">${item.termLabel}</li>`)
    })
}

const renderVaccineList = (labelList) => {
    $.each(labelList, function (index, item) {
        $('#table-vaccine-add-result-list').append(`<li vaccineId="${item.id}">${item.productName}</li>`)
    })
}

const loadSymptomTagList = (onSuccess, keyword, page = 1, pageSize = 20) => {
    let query = {
        label: keyword,
        page: page,
        pageSize: pageSize
    }
    $.ajax({
        url: 'http://43.140.194.248/api/oae/label',
        type: 'get',
        dataType: 'json',
        data: query,
        success: function (data) {
            if (data.code == 1) {
                onSuccess(data)
            }
        }
    })
}

const loadVaccineList = (onSuccess, keyword, page = 1, pageSize = 20) => {
    let query = {
        productName: keyword,
        page: page,
        pageSize: pageSize
    }
    $.ajax({
        url: 'http://43.140.194.248/api/vaccine/cfda',
        type: 'get',
        dataType: 'json',
        data: query,
        success: function (data) {
            if (data.code == 1) {
                onSuccess(data)
            }
        }
    })
}

const uploadReport = () => {
    let report = getReport()
    console.log(report)
    $.ajax({
        url: 'http://43.140.194.248/api/adverse',
        type: 'post',
        dataType: 'json',
        contentType : 'application/json',
        data: JSON.stringify(report),
        success: function (data) {
            if (data.code == 1) {
                showToast('上传成功')
            } else {
                showToast(data.message)
            }
        }
    })
}

const changeVisible = (element) => {
    if (element.is(':visible')) {
        element.hide()
        return false
    } else {
        element.show()
        return true
    }
}

const showToast = (str) => {
    $('#snackbar').addClass('show')
    $('#snackbar').text(str)
    setTimeout(function () {
        $('#snackbar').removeClass('show')
    }, 2000);
}

const createVaccineSearchBox = (itemClickListener) => {
    $('.table-vaccine-add-box').remove()
    let html = `
    <div class="table-vaccine-add-box">
        <div class="table-vaccine-add-input-box">
            <input class="table-vaccine-add-input" type="tex" placeholder="点击输入关键词">
            <button class="table-vaccine-add-submit">搜索</button>
        </div>
        <div class="table-vaccine-add-result-box">
            <ul id="table-vaccine-add-result-list">
            </ul>
        </div>
    </div>
    `
    let element = $(html)
    element.find('#table-vaccine-add-result-list').on('click', 'li', itemClickListener)
    element.find('.table-vaccine-add-submit').click(function () {
        let keyword = element.find('.table-vaccine-add-input').val()
        console.log(keyword)
        loadVaccineList(function (data) {
            handleVaccineList(data)
        }, keyword)
    })
    return element
}




// 当前检索的目标vaccine，symptom的id
var vaccineId
var symptomId
// 页面初始化
$(function () {
    initVaccineResultList()
    initSymptomResultList()


    // 初始化点击事件
    // search-result-item点击事件
    initSearchResultItemOnClickListener()

    // vaccine-search点击事件
    initVaccineSearchOnClickListener()
    // symptom-search点击事件
    initSymptomSearchOnClickListener()
    // submit-button点击事件
    initSubmitButtionOnClickListener()

    // 初始化vaccine-input的回车监听
    initVaccineInputOnKeyPress()

    // 初始化symptom-input的回车监听
    initSymptomInputOnKeyPress()

    // vaers-search-result初始化
    // 第一次加载时隐藏
    $('.vaers-search-result').hide()
})

// 初始化VaccineResult
function initVaccineResultList() {
    loadVaccineResult(
        onSuccess = function (data) {
            handleVaccineResult(data.data.vaccines)
        }
    )
}

// 初始化SymptomResult
function initSymptomResultList() {
    loadSymptomResult(
        onSuccess = function (data) {
            handleSymptomResult(data.data.symptoms)
        }
    )
}

// 初始化search-result-item点击事件
function initSearchResultItemOnClickListener() {
    $('#vaccine-result-list').on('click', 'li', function () {
        var id = $(this).attr('id')
        if ($(this).hasClass("active")) {
            // 如果已经选中，则取消选中
            $(this).removeClass("active")
            vaccineId = undefined
        } else {
            // 如果未选中，则选中
            $(this).addClass("active").siblings().removeClass("active")
            vaccineId = id
        }
    })
    $('#symptom-result-list').on('click', 'li', function () {
        var id = $(this).attr('id')
        if ($(this).hasClass("active")) {
            // 如果已经选中，则取消选中
            $(this).removeClass("active")
            symptomId = undefined
        } else {
            // 如果未选中，则选中
            $(this).addClass("active").siblings().removeClass("active")
            symptomId = id
        }
    })
}

// 初始化vaccine-search点击事件
function initVaccineSearchOnClickListener() {
    $('#vaccine-search').on('click', function () {
        var content = $('#vaccine-input').val()
        loadVaccineResult(
            onSuccess = function (data) {
                handleVaccineResult(data.data.vaccines)
            },
            keyword = content
        )
    })
}

// 初始化symptom-search点击事件
function initSymptomSearchOnClickListener() {
    $('#symptom-search').on('click', function () {
        var content = $('#symptom-input').val()
        loadSymptomResult(
            onSuccess = function (data) {
                handleSymptomResult(data.data.symptoms)
            },
            keyword = content
        )
    })
}

// 初始化submit-button点击事件
function initSubmitButtionOnClickListener() {
    $('#vaers-submit-button').on('click', function () {
        loadVaersResult(
            onSuccess = function (data) {
                console.log(data)
                handleVaersResult(data.data.results)
            },
            vaccineId = vaccineId,
            symptomId = symptomId
        )
    })
}

// 初始化vaccine-input的回车监听
function initVaccineInputOnKeyPress() {
    $("#vaccine-input").keypress(function (e) {
        if (e.which == 13) {
            var content = $('#vaccine-input').val()
            loadVaccineResult(
                onSuccess = function (data) {
                    handleVaccineResult(data.data.vaccines)
                },
                keyword = content
            )
        }
    })
}

// 初始化symptom-input的回车监听
function initSymptomInputOnKeyPress() {
    $("#symptom-input").keypress(function (e) {
        if (e.which == 13) {
            var content = $('#symptom-input').val()
            loadSymptomResult(
                onSuccess = function (data) {
                    handleSymptomResult(data.data.symptoms)
                },
                keyword = content
            )
        }
    })
}

// 处理VaccineResult数据
function handleVaccineResult(vaccines, isAppend = false) {
    // 清空列表
    if (!isAppend) {
        $('#vaccine-result-list').empty()
    }
    // 将数据添加到页面中
    for (var i = 0; i < vaccines.length; i++) {
        var vaccine = vaccines[i]
        var html = `<li class="search-result-item" id="${vaccine.id}">${vaccine.name}</li>`
        $('#vaccine-result-list').append(html)
    }
}

// 处理SymptomResult数据
function handleSymptomResult(symptoms, isAppend = false) {
    // 清空列表
    if (!isAppend) {
        $('#symptom-result-list').empty()
    }
    // 将数据添加到页面中
    for (var i = 0; i < symptoms.length; i++) {
        var symptom = symptoms[i]
        var html = `<li class="search-result-item" id="${symptom.id}">${symptom.symptom}</li>`
        $('#symptom-result-list').append(html)
    }
}

// 处理VaersResult数据
function handleVaersResult(results) {
    $('#vaers-result-table-body').empty()
    for (var i = 0; i < results.length; i++) {
        var result = results[i]
        var html = `
            <tr>
                <td>${result.vaccine}</td>
                <td>${result.symptom}</td>
                <td>${result.total}</td>
                <td>${result.prr}</td>
                <td>${result.chi}</td>
            </tr>
        `
        $('#vaers-result-table-body').append(html)
    }
}

// 加载VaccineResult
function loadVaccineResult(onSuccess, keyword = "", page = 1, pageSize = 20) {
    $.ajax({
        url: "http://43.140.194.248:8080/api/vaers/vaccine",
        type: "get",
        dataType: "json",
        data: {
            keyword: keyword,
            page: page,
            pageSize: pageSize
        },
        success: function (data) {
            console.log("数据加载成功")
            onSuccess(data);
        },
        error: function () {
            console.log("数据加载失败")
        }
    })
}


// 加载SymptomResult
function loadSymptomResult(onSuccess, keyword = "", page = 1, pageSize = 20) {
    $.ajax({
        url: "http://43.140.194.248:8080/api/vaers/symptom",
        type: "get",
        dataType: "json",
        data: {
            keyword: keyword,
            page: page,
            pageSize: pageSize
        },
        success: function (data) {
            console.log("数据加载成功")
            onSuccess(data);
        },
        error: function () {
            console.log("数据加载失败")
        }
    })
}

// 加载VaersResult
function loadVaersResult(onSuccess, vaccineId, symptomId) {
    // 隐藏table，显示loading
    $('.vaers-result-table').hide()
    $('.spinner').show()
    var data = {}
    if (vaccineId) {
        data.vaccineId = vaccineId
    }
    if (symptomId) {
        data.symptomId = symptomId
    }
    $.ajax({
        url: "http://43.140.194.248:8080/api/vaers",
        type: "get",
        dataType: "json",
        data: data,
        success: function (data) {
            console.log("数据加载成功")
            // 显示table，隐藏loading
            $('.vaers-result-table').show()
            $('.spinner').hide()

            // 如果vaers-search-result隐藏
            $('.vaers-search-result').show()
            // 设置pagination
            $('.page-item').remove('.page-num')
            var page = data.data.page
            var pageSize = data.data.pageSize
            var total = data.data.total
            var i = 1
            var html = `
                    <li class="page-item page-num">
                        <a class="page-link" id="page-item-${i}">${i}</a>
                    </li>
                `
            $('#page-item-next').before(html)
            i++;
            while (i * pageSize < total) {
                // 如果在显示范围内
                if (i > page - 3 && i < page + 3) {
                    var html = `
                            <li class="page-item page-num">
                                <a class="page-link" id="page-item-${i}">${i}</a>
                            </li>
                        `
                    $('#page-item-next').before(html)
                } else if (i >= page + 3) {
                    break
                }
                i++
                console.log(i)
            }
            $(`#page-item-${page}`).addClass("active").siblings().removeClass("active")
            // 回调函数
            onSuccess(data);
        },
        error: function () {
            console.log("数据加载失败")
        }
    })
}


$(function () {
    // 获取页面高度
    // var height = document.documentElement.clientHeight
    // $(".content-box").css("min-height", height)

    // 初始化, 隐藏所有页面
    $(".search-result-box").hide()
    $(".result-item-box").hide()

    // 绑定点击事件
    // keyword搜索框Button点击事件
    $("#search-keyword-btn").keyup(function (e) {
        if (e.keyCode == 13) {
            // 滚动到页面顶部
            $("html,body").animate({
                scrollTop: 0
            })
            startSearchOAETermList()
        }
    })

    // 搜索结果点击事件
    $(".search-result-list").on('click', 'li', function () {
        // 滚动到页面顶部
        $("html,body").animate({
            scrollTop: 0
        })
        var iri = $(this).attr('IRI')
        // 显示loading
        $(".search-result-box").hide()
        $(".result-item-box").hide()
        loadOAETerm(
            onSuccess = function (data) {
                // 隐藏loading, 显示搜索结果
                $(".search-result-box").hide()
                $(".result-item-box").show()
                // 渲染搜索结果
                renderOAETerm(data.data)

                // 加载OAETerm的父类
                loadOAETermParents(
                    onSuccess = function (parentData) {
                        // 渲染搜索结果
                        renderOAETermParents(parentData.data)
                    },
                    IRI = data.data.termIRI
                )
            },
            IRI = iri
        )
    })

    // 搜索框监听回车
    $("#search-keyword").keypress(function (e) {
        if (e.which == 13) {
            startSearchOAETermList()
        }
    })

    // 返回按钮点击事件
    $(".page-back-btn").click(function () {
        $(".search-result-box").show()
        $(".result-item-box").hide()
        startSearchOAETermList()
    })

    const oaeId = getUrlParam("oaeId")
    if (oaeId) {
        loadOAETermById(
            onSuccess = function (data) {
                const iri = data.data.termIRI
                loadOAETerm(
                    onSuccess = function (data) {
                        // 隐藏loading, 显示搜索结果
                        $(".search-result-box").hide()
                        $(".result-item-box").show()
                        // 渲染搜索结果
                        renderOAETerm(data.data)
        
                        // 加载OAETerm的父类
                        loadOAETermParents(
                            onSuccess = function (parentData) {
                                // 渲染搜索结果
                                renderOAETermParents(parentData.data)
                            },
                            IRI = data.data.termIRI
                        )
                    },
                    IRI = iri
                )
            },
            id = oaeId
        )
    }else {
        startSearchOAETermList()
    }
})

function startSearchOAETermList() {
    var keyword = $("#search-keyword").val()
    // 显示loading
    $(".loading-box").show()
    $(".search-result-box").hide()
    $(".result-item-box").hide()
    loadOAETermList(
        onSuccess = function (data) {
            // 隐藏loading, 显示搜索结果
            $(".loading-box").hide()
            $(".search-result-box").show()
            $(".result-item-box").hide()
            // 渲染搜索结果
            renderOAETermList(data.data.data)
        },
        keyword = keyword,
    )
}

// 渲染搜素结果
function renderOAETerm(term) {
    $(".oae-class-value").text(term.termLabel)
    $(".oae-iri-value").text(term.termIRI)
    $(".oae-definition-value").text(term.definition)
}

function renderOAETermList(terms) {
    $(".search-result-list").empty()
    // 渲染搜索结果
    for (var i = 0; i < terms.length; i++) {
        var item = terms[i]
        // 渲染搜索结果
        var html = `
            <li IRI="${item.termIRI}">${item.termLabel}<p>${item.definition}</p></li>
        `
        $(".search-result-list").append(html)
    }
}

function renderOAETermParents(terms) {
    $(".oae-hierarchy-box").empty()
    var html = getOAETermParentsHtml(terms, 0)
    console.log(html)
    $(".oae-hierarchy-box").append(html)
}

function getOAETermParentsHtml(terms, i) {
    if (terms[i] == undefined) {
        return ""
    }
    console.log(i)
    console.log(html)
    var html = `<ul><li IRI="${terms[i].termIRI}">+${terms[i].termLabel}</li>`
    html += getOAETermParentsHtml(terms, i + 1)
    return html + `</ul>`
}

// 加载数据
// 加载OAETerm
function loadOAETerm(onSuccess, IRI) {
    // 初始化参数
    var params = {
        IRI: IRI
    }
    $.ajax({
        url: "http://43.140.194.248/api/oae/IRI",
        type: "get",
        data: params,
        dataType: "json",
        success: function (data) {
            console.log("数据加载成功")
            onSuccess(data)
        },
        error: function () {
            console.log("数据加载失败")
        }
    })
}

function loadOAETermById(onSuccess, id) {
    $.ajax({
        url: `http://43.140.194.248/api/oae/${id}`,
        type: "get",
        dataType: "json",
        success: function (data) {
            onSuccess(data)
        }
    })
}

// 加载OAETerm列表
function loadOAETermList(onSuccess, keyword, page = 1, pageSize = 20) {
    // 初始化参数
    var params = {
        label: keyword,
        page: page,
        pageSize: pageSize
    }
    $.ajax({
        url: "http://43.140.194.248/api/oae/label",
        type: "get",
        data: params,
        dataType: "json",
        success: function (data) {
            onSuccess(data)
        }
    })
}

// 加载OAETerm的父类
function loadOAETermParents(onSuccess, IRI) {
    // 初始化参数
    var params = {
        IRI: IRI
    }
    $.ajax({
        url: "http://43.140.194.248/api/oae/parent",
        type: "get",
        data: params,
        dataType: "json",
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


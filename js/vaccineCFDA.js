/*
 * @Author: Slacr 11812766+Fslacr@user.noreply.gitee.com
 * @Date: 2023-04-15 15:43:39
 * @LastEditors: Slacr 11812766+Fslacr@user.noreply.gitee.com
 * @LastEditTime: 2023-04-15 18:39:23
 * @FilePath: \VA_\js\vaccineCFDA.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
$(function () {
    $("#va_search_btn").on("click", () => {
        let product_name = $("#product_name").val().trim()
        if (product_name == "") return alert("输入为空")
        init_res(1, 5, product_name)
    })



    // 初始化疫苗查询结果
    function init_res(page = 1, pageSize = 5, productName = "新冠") {
        $("#vaccine_res").html("")
        $.ajax({
            type: 'GET',
            url: `http://43.140.194.248:8080/api/vaccine/cfda?page=${page}&pageSize=${pageSize}&productName=${productName}`,
            success: function (res) {
                console.log(res)
                if (res.status == 1) {

                    let va_list = res.data.vaccineList
                    // console.log(va_list)
                    let html = handle_res_list(va_list)
                    $("#vaccine_res").html(html)
                }

            }

        })

        // 点击查看详情
        $("#vaccine_res").on("click", "#check_btn", (e) => {
            $(e.target).prev().toggleClass("collapsed")

        })
    }

    // 处理返回的疫苗数组返回HTML
    function handle_res_list(va_list) {
        let html = `    `

        $.each(va_list, (index, value) => {
            delete value.id
            html += `<div id = "res_box" class = "collapsed" >`
            $.each(value, (index, value) => {
                if (value == "") value = "无数据"

                html += `
                    
                    <label>${index}:&nbsp;&nbsp;</label>
                    <p>${value}</p>
                  
                `
            })
            html += `
                </div> 
                <button id="check_btn" type="button" class=" btn btn-default" style="margin: 5px"></button>

                <div class="divide_line"></div>   
               
                `
        })
        return html
    }






    //分页按钮
    // function init_pagination() {
    //     $("#prev").on("click", () => {
    //         console.log($(".pagination .justify-content-center").children())
    //     })
    // }

    init_res()
    // init_pagination()

})


var cardview = $.extend({}, $.fn.datagrid.defaults.view, {
    renderRow: function (target, fields, frozen, rowIndex, rowData) {
        //console.log(rowData[fields[3]]);
        var cc = [];

        var colname = ['图片编号', '公司编号', '图片名称', '图片地址', '采集时间'];
        cc.push('<td colspan=' + fields.length + ' style="padding:10px;border:0;">');
        if (!frozen) {
            cc.push('<img src="' + rowData[fields[3]] + '" style="height:280px;width:280px;float:left;padding-top:20px;padding-left:200px">');
            cc.push('<div style="float:left;padding-left:20px;padding-top:00px">');
            //for (var i = 0; i < fields.length; i++) {
            //cc.push('<p>' + colname[i] + ': ' + rowData[fields[i]] + '</p>');
            //}
            cc.push('</div>');
        }
        cc.push('</td>');
        return cc.join('');
    }
});
var clean=0;
var picPage = 1;//显示第几页图片
var picNum = 3;//一页显示3张图片
var urlList = [];//存储每个公司的图片
$(function () {
    $("#dg").attr("height", 600);//设置数据列表高度
    GetUserList(GetWhere());
    $("#win").hide();//默认情况下，隐藏窗体
    $("#main_right").hide();//默认情况下，隐藏窗体
    $("#bigpic").hide();//默认情况下，隐藏窗体
    // $("#b04").hide();//默认情况下，隐藏窗体
   
   
});

///////////获取未整理列表数据
function getData_undo(obj) {
    $(obj).prevAll().removeClass("active");
    $(obj).nextAll().removeClass("active");
    $(obj).addClass("active");
    clean = 0;
    GetUserList(GetWhere());
}
//////////////////获取已整理列表数据
function getData_done(obj) {
    $(obj).prevAll().removeClass("active");
    $(obj).nextAll().removeClass("active");
    $(obj).addClass("active");
    clean = 1;
    GetUserList(GetWhere());
}
///////////////点击小图片在右边显示大图片
function showBigPic(obj) {
    var smsrc = $(obj).attr("src");
    $("#bigpic>img").attr("src",smsrc);
}
///页面加载完毕默认显示的大图片
function autoShowPic() {
    var smsrc = $("#smallpic img:first").attr("src");
    $("#bigpic>img").attr("src", smsrc);
}

//显示下一页的图片
function nextPic(totalNum) {
    if((picPage)*picNum<totalNum){
        picPage++;
        showsmpic_str();
    }else{
        alert("下一页没有图片了");
    }
}

//显示上一页的图片
function prePic(totalNum) {
    if (picPage>1) {
        picPage--;
        showsmpic_str();
    } else {
        alert("上一页没有图片了");
    }
}

//显示小图片
function showsmpic_str() {
    var totalNum = urlList.length;//总共有多少张图片
    var end = 0;//这一页能显示多少张图片
    if (picPage * picNum < totalNum) {
        end = picNum;
    } else {
        end = totalNum - (picPage - 1) * picNum;
    }

    var strpic = "";
    for (var j = (picPage - 1) * 3; j < end; j++) {
        (function (_j) {
            strpic += '<li ><img src="' + urlList[_j] + '" alt="" onclick="showBigPic(this)" ></li>';
        })(j);
    }

    $('#smallpic').html(strpic);
}


//从服务器获取需要显示的图片

function GetPicData( comId) {
   
    $.ajax({
        url: "/ajax/comDetailPic.ashx",
        async: true,//异步方式
        type: "POST",
        data: { "comId": comId },
        success: function (data) {
            data = eval('(' + data + ')');
            //callback(pageCurrent, data);
            //alert(JSON.stringify(data));
            urlList = [];
            for (var i = 0; i < data.rows.length; i++) {
                
                (function (_i) {
                    urlList.push(data.rows[_i].url);                   
                })(i);
            }
            showsmpic_str();//显示小图片
            autoShowPic();//自动显示小图片中的第一张作为大图片

            $("#main_right").show();//显示窗体
            $("#bigpic").show();//显示窗体
            // document.getElementById("txtComName1").focus();
            $("#txtComName1").focus();//让input自动获取焦点
            document.getElementById("btn_up").tabIndex = 0;//让保存按钮获取tab事件
            //alert(document.getElementById("btn_up").tabIndex);
          
            $("#btn_up").keydown(function (event) {//让保存按钮按下回车键等同于click事件
                switch (event.keyCode) {
                    // ...
                    // 不同的按键可以做不同的事情
                    // 不同的浏览器的keycode不同
                    // 更多详细信息:     http://unixpapa.com/js/key.html
                    // 常用keyCode： 空格 32   Enter 13   ESC 27
                    case 13: EditCom_frm();
                        break;
                }
            });
          
        }
    });
}


//双击获取公司信息详情
function GetComDetail(rowIndex,rowData) {
    //$("#comDetailWin").show();
    //var rows = $("#dg").datagrid("getSelections");//获取到选中行的数据
    //alert("rowdata"+rowData.comId);
    // $.each(rowData, function (i, n) {
    var comId = rowData.comId;
    $("#txtComId1").val(rowData.comId);
    $("#txtComName1").val(rowData.comName);
    $("#txtAddress1").val(rowData.address);
    $("#txtCity1").val(rowData.city);
    $("#txtComLinker1").val(rowData.comLinker);
    $("#txtTel1").val(rowData.tel);
    $("#txtLinePrice1").val(rowData.linePrice);
    $("#txtZbr1").val(rowData.zbr);
    $("#txtCreateAt1").val(rowData.createAt);
    $("#txtComment1").val(rowData.comment);
    GetPicData(comId);
}

//获取另一个页面传递过来的参数
function hrefData() {
    var Url = window.location.href;
    alert(Url);
}

//获取筛选的条件
function GetWhere() {
    hrefData();
    var zbr = 'qqq';
    var s = "1=1";
    s += " and clean='" + clean + "'";
    s += " and zbr='" + zbr + "'";
    var sUserName = $.trim($("#selUserName").val());//获取到用户名
    if (sUserName != "") {
        s += " and comName='" + sUserName + "'";
    }
    return s;
}
//获取公司信息列表
function GetUserList(strWhere) {
    $("#dg").datagrid({
        url: "../ajax/company.ashx",//后台页面地址
        queryParams: { cmd: "list", strWhere: strWhere },//传到后台的参数
        pagination: true,//是否允许分页
        rownumbers: true,//是否显示行号
        singleSelect: true,//是否只选择一行
        pageSize: 35,//每一页默认显示多少条数据
        checkOnSelect: false,//选中某一行的是否复选框是否可以勾上
        pageList: [25, 30, 35, 40, 45],
        fit:true,
        fitColumns: false,
        onDblClickRow: function (rowIndex, rowData) {
            //获取公司信息明细列表；
            GetComDetail(rowIndex,rowData);
            // picLunbo();
            //GetPicData(rowData);
        },
        columns: [[
            
            {
                field: "comId",
                title: "公司编号",
                align: "center",       
                width: 120
            } , {
                 field: "comName",
                 title: "公司名称",
                 align: "center",
                 width: 145
             }

        ]],
    });
}

function Sel() {
    GetUserList(GetWhere());
}

//自动取公司号
function getComId() {

    //alert("保存成功！");
    var myDate = new Date();
    console.log(myDate);
    var comId = userinfo.userName + myDate.getTime() + "tj";
    //var comId=myDate.toLocaleDateString();
    //var comId=myDate.toLocaleTimeString();
    //var comId=myDate.toLocaleString( );
    $("#comId").val(comId);
}

//显示添加/更新窗体
var edituserid = 0;
function ShowAddEditBox(i) {
    $("#win").show();
    if (i == 1) {
        ClearForm();
        $("#btnAdd").show();
        $("#btnEdit").hide();
        //getComId();
    }
    if (i == 2) {
        $("#btnAdd").hide();
        $("#btnEdit").show();
        var rows = $("#dg").datagrid("getSelections");//获取到选中行的数据
        if (!rows || rows.length == 0) {
            $.messager.alert("提示", "请选择要修改的数据");
            $("#win").hide();
            return;
        }
        if (rows.length > 1) {
            $.messager.alert("提示", "只能够选择一行数据进行编辑");
            $("#win").hide();
            return;
        }
        $.each(rows, function (i, n) {

            $("#txtComId").val(n.comId);
            $("#txtComName").val(n.comName);
            $("#txtAddress").val(n.address);
            $("#txtCity").val(n.city);
            $("#txtComLinker").val(n.comLinker);
            $("#txtTel").val(n.tel);
            $("#txtLinePrice").val(n.linePrice);
            $("#txtZbr").val(n.zbr);
            $("#txtCreateAt").val(n.createAt);
            $("#txtComment").val(n.comment);
            edituserid = n.id;
        });
    }
    $('#win').dialog({
        title: '更新用户',
        width: 480,
        height: 300,
        closed: false,
        cache: false,
        modal: true,
       
    });
}

//重置表单
function ClearForm() {
    $("#fm").form("reset");
}
//关闭窗体
function CloseForm() {
    $("#win").dialog("close");
}

//添加用户
function AddCom() {
    var comId = $.trim($("#txtComId").val());
    //var comName = $.trim($("#txtComName").val());
    if (comId == "") {
        $.messager.alert('警告', '公司编号不能为空');
    }
    else {
        $("#fm").form("submit", {
            url: "../ajax/company.ashx?cmd=add",
            success: function (data) {
                var data = eval('(' + data + ')');//把json格式转成js数组
                if (data.success) {
                    window.location.reload();
                }
                else {
                    $.messager.alert("提示", data.infor);
                }
            }
        }
    )
    };
}

//更新用户
function EditCom() {
    var comId = $.trim($("#txtComId").val());
    //var comName = $.trim($("#txtComName").val());
    if (comId == "" ) {
        $.messager.alert('警告', '公司编号不能为空');
    }
    else {
        $("#fm").form("submit", {
            url: "../ajax/company.ashx?cmd=edit&edituserid=" + edituserid,
            success: function (data) {
                var data = eval('(' + data + ')');//把json格式转成js数组
                if (data.success) {
                     window.location.reload();
                }
                else {
                    $.messager.alert("提示", data.infor);
                }
            }
        }
    )
    };
}

//删除用户（支持批量删除）
function DelCom() {
    var rows = $("#dg").datagrid("getSelections");//获取到选中行的数据
    if (!rows || rows.length == 0) {
        $.messager.alert("提示", "请选择要修改的数据");
        return;
    }
    var deluserids = "";
    $.each(rows, function (i, n) {
        if (i == 0) {
            deluserids = n.id;
            return;
        }
        else {
            deluserids += "_" + n.id;
            return;
        }
    });
    $.messager.confirm("提示", "你确定删除吗？", function (r) {
        if (r) {
            $.post("../ajax/company.ashx?cmd=del", { "deluserids": deluserids }, function (data) {
                var data = eval('(' + data + ')');//把json格式转成js数组
                if (data.success) {
                    window.location.reload();
                }
                else {
                    $.messager.alert("提示", data.infor);
                }
            });
        }
    });
}

//详情页面数据更新
function EditCom_frm() {
   var comId= $("#txtComId1").val();
   var comName=$("#txtComName1").val();
   var address=$("#txtAddress1").val();
   var city=$("#txtCity1").val();
   var comLinker=$("#txtComLinker1").val();
   var tel=$("#txtTel1").val();
   var linePrice=$("#txtLinePrice1").val();
   var zbr=$("#txtZbr1").val();
   var createAt=$("#txtCreateAt1").val();
   var comment = $("#txtComment1").val();
   var clean = 1;
   $.ajax({
       url: "../ajax/company.ashx?cmd=edit_frm",
       type: "POST",
       
       data: { "comId": comId, "comName": comName, "address": address, "city": city, "tel": tel, "comment": comment, "linePrice": linePrice, "comLinker": comLinker, "zbr": zbr, "createAt": createAt, "clean": clean },
       /**
       *必须false才会自动加上正确的Content-Type
       */
       //contentType: false,
       /**
       * 必须false才会避开jQuery对 formdata 的默认处理
       * XMLHttpRequest会对 formdata 进行正确的处理
       */
     
       success: function (data) {
           var data = eval('(' + data + ')');//把json格式转成js数组
           if (data.success) {
               //window.location.reload();
               $('#dg').datagrid('reload');
               $("#main_right").hide();//默认情况下，隐藏窗体
               $("#bigpic").hide();//默认情况下，隐藏窗体

           }
           else {
               $.messager.alert("提示", data.infor);
           }
       }
   });

}

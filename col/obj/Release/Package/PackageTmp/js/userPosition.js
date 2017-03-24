/// <reference path="_references.js" />


$(function () {
    GetPositionList(GetWhere());
    $("#win").hide();//默认情况下，隐藏窗体
});

//获取筛选的条件
function GetWhere() {
    var s = "1=1";
    var sUserName = $.trim($("#selUserName").val());//获取到用户名
    if (sUserName != "") {
        s += " and comId='" + sUserName + "'";
    }
    return s;
}
//获取用户信息列表
function GetPositionList(strWhere) {
    $("#dg").datagrid({
        url: "../ajax/userPosition.ashx",//后台页面地址
        queryParams: { cmd: "list", strWhere: strWhere },//传到后台的参数
        pagination: true,//是否允许分页
        rownumbers: true,//是否显示行号
        singleSelect: false,//是否只选择一行
        pageSize: 5,//每一页默认显示多少条数据
        checkOnSelect: false,//选中某一行的是否复选框是否可以勾上
        pageList: [5, 10, 15, 20, 25],
        fitColumns: true,
        columns: [[
            {
                field: "id",
                checkbox: true
            },
            {
                field: "userName",
                title: "采集人员",
                align: "center",
                //width: 100
            },
             {
                 field: "lat",
                 title: "纬度",
                 align: "center",
                 // width: 100
             },
             {
                 field: "lon",
                 title: "经度",
                 align: "center",
                 //width: 100
                 //formatter: function (value, row) {
                 // var str = "";
                 //if (value != "" || value != null) {
                 //str = "<img style=\"height: 80px;width: 150px;\" src=\"" + value + "\"/>";
                 // return str;
                 // }
                 // }
             },
             {
                 field: "timestamp",
                 title: "坐标时间",
                 align: "center",
                 //width: 100
             }, {
                 field: "addr",
                 title: "地址",
                 align: "center",
                 //width: 100
             }

        ]],
       
    });
}

function Sel() {
    GetPositionList(GetWhere());
}

//显示添加/更新窗体
var edituserid = 0;
function ShowAddEditBox(i) {
    $("#win").show();
    if (i == 1) {
        $("#btnAdd").show();
        $("#btnEdit").hide();
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
           
            $("#txtUserName").val(n.userName);
            $("#txtTimestamp").val(n.timestamp);
            $("#txtLon").val(n.lon);
            $("#txtLat").val(n.lat);
            $("#txtAddr").val(n.addr);
            edituserid = n.id;
        });
    }
    $('#win').dialog({
        title: '更新图片',
        width: 500,
        height: 200,
        closed: false,
        cache: false,
        modal: true
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

//添加坐标
function AddPic() {
    var userName = $.trim($("#txtUserName").val());
    //var url = $.trim($("#txtUrl").val());
    if (userName == "" ) {
        $.messager.alert('警告', '采集人员账号不能为空');
    }
    else {
        $("#fm").form("submit", {
            url: "../ajax/userPosition.ashx?cmd=add",
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

//更新图片
function EditPic() {
    var userName = $.trim($("#txtUserName").val());
    //var url = $.trim($("#txtUrl").val());
    if (userName == "" ) {
        $.messager.alert('警告', '采集人员账号不能为空');
    }
    else {
        $("#fm").form("submit", {
            url: "../ajax/userPosition.ashx?cmd=edit&edituserid=" + edituserid,
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

//删除图片（支持批量删除）
function DelPic() {
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
            $.post("../ajax/userPosition.ashx?cmd=del", { "deluserids": deluserids }, function (data) {
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

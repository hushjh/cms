

var cardview = $.extend({}, $.fn.datagrid.defaults.view, {
    renderRow: function (target, fields, frozen, rowIndex, rowData) {
        //console.log(rowData[fields[3]]);
        var cc = [];
     
        var colname = ['图片编号', '公司编号', '图片名称', '图片地址','采集时间'];
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

$(function () {
    GetUserList(GetWhere());
    $("#win").hide();//默认情况下，隐藏窗体
    $("#comDetailWin").hide();//默认情况下，隐藏窗体
      
});

//获取某个公司图片列表
function GetPicList(comId) {
    var s = "1=1" + " and comId='" + comId + "'";
    $("#picList").datagrid({
        url: "../ajax/picM.ashx",//后台页面地址
        queryParams: { cmd: "list", strWhere: s },//传到后台的参数
        pagination: true,//是否允许分页
      //  rownumbers: true,//是否显示行号
        singleSelect: false,//是否只选择一行
        pageSize: 1,//每一页默认显示多少条数据
        checkOnSelect: false,//选中某一行的是否复选框是否可以勾上
        pageList: [1, 10, 15, 20, 25],
        fitColumns: true,
        columns: [[
            {
                field: "picId",
                checkbox: true
            },
            {
                field: "comId",
                //title: "公司编号",
                align: "center",
                //width: 100
            },
             {
                 field: "picName",
                // title: "图片名称",
                 align: "center",
                 // width: 100
             },
             {
                 field: "url",
               //  title: "图片地址",
                 align: "center",
                 //width: 100
                 //formatter: function (value, row) {
                 // var str = "";
                 //if (value != "" || value != null) {
                 //str = "<img style=\"height: 80px;width: 150px;\" src=\"" + value + "\"/>";
                 // return str;
                 // }
                 // }
             }
             , {
                 field: "createAt",
                // title: "拍摄时间",
                 align: "center",
                 //width: 100
             }

        ]],
        view: cardview
    });

    $("picList").addClass("datagrid-header");
}

//双击获取公司信息详情
function GetComDetail(rowData) {
    $("#comDetailWin").show();
    //var rows = $("#dg").datagrid("getSelections");//获取到选中行的数据
    //alert("rowdata"+rowData.comId);
    // $.each(rowData, function (i, n) {
    var comId=rowData.comId;
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
       

            GetPicList(comId);
            $('#comDetailWin').dialog({
                title: '公司详情',
                width: 800,
                height: 550,
                closed: false,
                cache: false,
                modal: true
                
            });      
    
}

//获取筛选的条件
function GetWhere() {
    var s = "1=1";
    var sUserName = $.trim($("#selUserName").val());//获取到用户名
    if (sUserName != "") {
        s += " and comName='" + sUserName + "'";
    }
    return s;
}
//获取用户信息列表
function GetUserList(strWhere) {
    $("#dg").datagrid({
        url: "../ajax/comM.ashx",//后台页面地址
        queryParams: { cmd: "list", strWhere: strWhere },//传到后台的参数
        pagination: true,//是否允许分页
        rownumbers: true,//是否显示行号
        singleSelect: false,//是否只选择一行
        pageSize: 15,//每一页默认显示多少条数据
        checkOnSelect: false,//选中某一行的是否复选框是否可以勾上
        pageList: [5, 10, 15, 20, 25],
        fitColumns: true,
        onDblClickRow: function (rowIndex, rowData) {
            //获取公司信息明细列表；
            GetComDetail(rowData);
        },
        columns: [[
            {
                field: "id",
                checkbox: true
            },
            {
                field: "comId",
                title: "公司编号",
                align: "center",
                //width: 100
            },
             {
                 field: "comName",
                 title: "公司名称",
                 align: "center",
                // width: 100
             },
             {
                 field: "address",
                 title: "地址",
                 align: "center",
                 //width: 100
             },             
             {
                 field: "city",
                 title: "城市",
                 align: "center",
                 //width: 100
             }, {
                 field: "comLinker",
                 title: "联系人",
                 align: "center",
                 //width: 100
             }, {
                 field: "tel",
                 title: "电话",
                 align: "center",
                 //width: 100
             }, {
                 field: "linePrice",
                 title: "线路和价位",
                 align: "center",
                 //width: 100
             }, {
                 field: "zbr",
                 title: "操作员",
                 align: "center",
                 //width: 100
             }, {
                 field: "createAt",
                 title: "采集时间",
                 align: "center",
                 //width: 100
             }, {
                 field: "comment",
                 title: "简介",
                 align: "center",
                 //width: 100
             }
             
        ]],
    });
}

function Sel() {
    GetUserList(GetWhere());
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

//添加用户
function AddCom() {
    var comId = $.trim($("#txtComId").val());
    var comName = $.trim($("#txtComName").val());
    if (comId == "" || comName == "") {
        $.messager.alert('警告', '公司编号或公司名称不能为空');
    }
    else {
        $("#fm").form("submit", {
            url: "../ajax/comM.ashx?cmd=add",
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
    var comName = $.trim($("#txtComName").val());
    if (comId == "" || comName == "") {
        $.messager.alert('警告', '公司编号或公司名称不能为空');
    }
    else {
        $("#fm").form("submit", {
            url: "../ajax/comM.ashx?cmd=edit&edituserid=" + edituserid,
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
            $.post("../ajax/comM.ashx?cmd=del", { "deluserids": deluserids }, function (data) {
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

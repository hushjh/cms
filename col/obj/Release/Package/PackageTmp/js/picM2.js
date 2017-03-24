var cardview = $.extend({}, $.fn.datagrid.defaults.view, {
    renderRow: function (target, fields, frozen, rowIndex, rowData) {
        //console.log(rowData[fields[3]]);
        var cc = [];
        cc.push('<td colspan=' + fields.length + ' style="padding:5px;border:0;">');
        if (!frozen) {
            cc.push('<img src="' + rowData[fields[3]] + '" style="height:200px;float:left">');
            cc.push('<div style="float:left;padding-left:20px">');
            for (var i = 0; i < fields.length; i++) {
                cc.push('<p>' + fields[i] + ': ' + rowData[fields[i]] + '</p>');
            }
            cc.push('</div>');
        }
        cc.push('</td>');
        return cc.join('');
    }
});

function getData(strWhere) {
    $('#tt').datagrid({
        title: 'DataGrid - CardView',
        //width: 800,
        //height: 400,
        remoteSort: false,
        singleSelect: true,
        striped: true,
        url: "../ajax/picM.ashx",//后台页面地址
        queryParams: { cmd: "list", strWhere: strWhere },//传到后台的参数
        pagination: true,//是否允许分页
        rownumbers: true,//是否显示行号
        singleSelect: false,//是否只选择一行
        pageSize: 15,//每一页默认显示多少条数据
        checkOnSelect: false,//选中某一行的是否复选框是否可以勾上
        pageList: [5, 10, 15, 20, 25],
        fitColumns: true,
        columns:[[  
         { field: 'picId', title: 'picId', width: 80 },
         { field: 'comId', title: '公司编号', width: 100, sortable: true },
         { field: 'picName', title: '图片名称', width: 80, align: 'right', sortable: true },
         { field: 'url', title: '图片地址', width: 80, align: 'right', sortable: true },
         { field: 'comment', title: '简介', width: 60, align: 'center' },
         { field: 'createAt', title: '拍摄时间', width: 60, align: 'center' }
        ]],  
        view: cardview
    });
}

//本地手动添加数据
function nativeData() {
    $("#tt").datagrid("loadData", {
        "total": 1,
        "rows": [
           {
               "itemid": "1",
               "productid": "name",
               "listprice": "1",
               "unitcost": "name",
               "status": "name"
           }, {
               "itemid": "1",
               "productid": "name",
               "listprice": "1",
               "unitcost": "name",
               "status": "name"
           }]
    });
}

//获取筛选的条件
function GetWhere() {
    var s = "1=1";
    var sUserName = $.trim($("#selUserName").val());//获取到用户名
    if (sUserName != "") {
        s += " and comId='" + sUserName + "'";
    }
    return s;
}

$(function () {
    
    getData(GetWhere());
    //nativeData();
});

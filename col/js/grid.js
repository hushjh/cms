layui.define('global', function (exports) {
    var global = layui.global;
    var grid= function(){
        cur_iRow = null;
        cur_iCol = null;
        var contextPath = 'ajax/getGrid.ashx';
        
        this.init =function() {
            $("#list4").jqGrid({
                url: contextPath,
                datatype: "json", //数据来源，本地数据
                mtype: "POST",//提交方式
                height: 'auto',//高度，表格高度。可为数值、百分比或'auto'
                //width:1000,//这个宽度不能为百分比
                autowidth: true,//自动宽
                colNames: ['ID', '添加日期', '手机号码', '银行卡号', '备注', '操作'],
                colModel: [
                    //{name:'id',index:'id', width:'10%', align:'center' },
                    { name: 'kid', index: 'kid', width: '50px', align: "center", sortable: false },
                    { name: 'createDate', index: 'createDate', width: '50px', align: 'center', editable: true, edittype: 'text' },
                    { name: 'phoneNo', index: 'phoneNo', width: '50px', align: 'center', editable: true },
                    { name: 'cardNo', index: 'cardNo', width: '50px', align: "center", editable: true, edittype: 'text' },
                    { name: 'remark', index: 'remark', width: '50px', align: "left", sortable: false, editable: true, edittype: 'text' },
                    { name: 'del', index: 'del', width: '50px', align: "center", sortable: false, editable: true, edittype: 'text' }
                ],
                rownumbers: true,//添加左侧行号
                //altRows:true,//设置为交替行表格,默认为false
                //sortname:'createDate',
                //sortorder:'asc',
                viewrecords: true,//是否在浏览导航栏显示记录总数
                rowNum: 15,//每页显示记录数
                rowList: [15, 20, 25],//用于改变显示行数的下拉列表框的元素数组。
                jsonReader: {
                    id: "blackId",//设置返回参数中，表格ID的名字为blackId
                    repeatitems: false
                },
                pager: $('#gridPager'),
                caption: "采购退货单列表", //表名
                cellEdit: true,
                cellsubmit: "clientArray",
                editurl: "ajax/ckGrid.ashx",
                ondblClickRow: function (id) {
                    var rowid = $("#list4").jqGrid("getGridParam", "selrow");
                    //var rowdata=$("#list4").jqGrid("getRowData",rowid);
                    //alert("rowid:"+JSON.stringify(rowid)+",rowdata:"+JSON.stringify(rowdata));
                    var rowdata = {
                        createDate: '2017-03-20',
                        phoneNo: '13366778819',
                        cardNo: '343434',
                        remark: 'add a  row',
                        del: 0
                    };
                    //$("#list4").jqGrid("addRowData",99,rowdata,"before",rowid);
                    //$("#list4").jqGrid("setRowData",rowid,rowdata);
                    //$("#list4").setRowData(rowid,rowdata);
                    //$("#list4").delRowData(rowid);
                },

                beforeEditCell: function (rowid, cellname, value, iRow, iCol) {
                    cur_iRow = iRow;
                    cur_iCol = iCol;

                    saveRowBreMdf(rowid);
                }



            })

            $(window).resize(function () {
                $("#list4").setGridWidth($(".right").width());
            });
            //$("#list2").editCell(rowid, 1, true);

            $("#list4")
            .jqGrid('navGrid', '#gridPager', { edit: false, add: false, del: false, search: true, refresh: true })
            .navButtonAdd('#gridPager', {
                caption: '',
                buttonicon: 'ui-icon-trash',
                onClickButton: function () {
                    var rowid = $("#list4").jqGrid("getGridParam", "selrow");
                    if (cur_iRow)
                        cellsave();
                    if (rowid == null) {
                        alert("请先选择数据行");
                    } else {
                        var oper = "del";
                        var rowdata = $("#list4").jqGrid("getRowData", rowid);
                        var kid = rowdata.kid;
                        //alert(rowid);
                        rowdata.oper = oper;
                        alert(JSON.stringify(rowdata));
                        if (kid == 0) {//删除的是新增的行
                            $("#list4").jqGrid("delRowData", rowid);
                        } else {
                            postData(rowdata, function () {
                                $("#list4").jqGrid("delRowData", rowid).trigger("reloadGrid");

                                alert("success");
                            });
                        }

                    }

                },
                position: "last"
            })
            .navButtonAdd('#gridPager', {
                caption: '保存',
                buttonicon: 'ui-icon-disk',
                onClickButton: function () {
                    var params = {};
                    cellsave();
                    params.data = JSON.stringify(getRowsdata());
                    var oper = "save";
                    params.oper = oper;
                    console.log(params);
                    postData(params, function () {
                        $("#list4").trigger("reloadGrid")
                        alert("success");
                    });

                },
                position: "last"
            })
            .navButtonAdd('#gridPager', {
                caption: '增加',
                buttonicon: 'ui-icon-plus',
                onClickButton: function () {
                    var ids = jQuery("#list4").jqGrid('getDataIDs');
                    var rowid = Math.max.apply(Math, ids);
                    var rowdata = {
                        createDate: '',
                        phoneNo: '',
                        cardNo: '',
                        remark: '',
                        del: 0,
                        kid: 0
                    };
                    $("#list4").jqGrid("addRowData", rowid + 1, rowdata, "last");

                },
                position: "last"
            });
            global.grid = {};
            global.grid.data = {code:'11',name:'wang'};
        }
        var postData = function (rowdata, callback) {
            $.ajax({
                type: "POST",
                url: "ajax/ckGrid.ashx",
                data: rowdata,
                success: function (data) {
                    if (JSON.parse(data).success) {
                        callback();
                    }
                }
            });
        }
        var cellsave = function () {
            console.log("cellsave:" + cur_iRow);
            $('#list4').jqGrid('saveCell', cur_iRow, cur_iCol);
        }
        var getRowsdata = function () {//获取修改行的数据
            var paraArr = [];
            for (var i = 0; i < ids.length ; i++) {
                var rowData = $("#list4").jqGrid('getRowData', ids[i]);
                paraArr.push(rowData);

            }
            return paraArr;
        }
        var ids = [];
        var saveRowBreMdf = function (rowid) {//在修改之前，记录将要编辑行

            //var rowData = $("#list4").jqGrid('getRowData', rowid);

            for (var i = 0; i < ids.length; i++) {
                if (rowid == ids[i]) return;
            }
            ids.push(rowid);
            console.log("saveRowBreMdf:" + ids);
        }
    }
    exports('grid', grid);
});

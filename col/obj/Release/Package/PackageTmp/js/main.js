
//嵌套内容
$(function () {
    $(".easyui-tree").tree({
        onClick: function (node) {
            AddTab(node.text, node.id);
        }
    });
});
function AddTab(title, url) {
    if ($("#tabs").tabs("exists", title)) {        //如果title 的tabs一打开，则不去创建，只是选中已打开的
        $("#tabs").tabs("select", title);
    } else {
        var content = createFrame(url);
        $("#tabs").tabs("add", {
            title: title,
            content: content,
            closable: true
        });
    }
}
function createFrame(url) {
    var tabHeight = $("#tabs").height() - 35;
    var s = '<iframe scrolling="auto" frameborder="0" src="' + url + '" style="width:100%;height:' + tabHeight + 'px;"></iframe>';
    return s;
}
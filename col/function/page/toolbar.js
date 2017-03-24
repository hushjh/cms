layui.define(function (exports) {
    var obj = function () {
        this.init = function () {
            $("#page-toolbar").load("view/page/toolbar.html", function () {
                
            });

        };
    }
    exports("page_toolbar", obj);
});
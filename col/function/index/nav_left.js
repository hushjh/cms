layui.define(function (exports) {
    var obj = function () {
        this.init = function () {
            $(".left").load("view/index/nav_left.html", function () {
                layui.use('element', function () {
                    var element = layui.element();
                    element.init();
                });
            });
        };
    }
    exports("index_nav_left", obj);
});
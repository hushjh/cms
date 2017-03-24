layui.define( function (exports) {
    var obj = function () {
        this.init = function () {
            $(".top").load("view/index/nav_top.html", function () {
                layui.use('element', function () {
                    var element = layui.element();
                    element.init();
                });
            });
            
            //$(".left").load("view/index/nav_left.html");
            //$(".right").load("view/index/right.html");

        };
    }
    exports("index_nav_top", obj);
});
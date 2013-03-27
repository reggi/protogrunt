
/*
require.config({
    paths: {
        //jquery: '../components/jquery/jquery.min',
        "load-jquery": "../components/jquery/jquery",
        //"jquery-cookie": "../components/jquery-cookie/jquery.cookie",
        //"jquery-shopify": "../components/shopify_jquery_ajax_api/jquery.api",
        //"jquery-url": "../components/jQuery-URL-Parser/purl",
        //"jquery-bootstrap": "../components/bootstrap/docs/assets/js/bootstrap",
        //"jquery-ui-effects-core": "../components/jquery-ui/ui/jquery.effects.core",
        //"jquery-zclip": "../components/jquery-zclip/jquery.zclip"
    }
});
*/

/*
define("jquery", ["load-jquery"], function () {
    return jQuery.noConflict(true);
});

require(["jquery"], function($) {
    console.log($().jquery);
});


//----------

require.config({
    paths: {
        "load-jquery": "../components/jquery/jquery",
    }
});

define("jquery", ["load-jquery"], function () {
    return jQuery.noConflict(true);
});

require(["jquery"], function($) {
    console.log($().jquery);
});

//

define("jquery", ["../components/jquery/jquery"], function () {
    return jQuery.noConflict(true);
});

require(["jquery"], function($) {
    console.log($().jquery);
});

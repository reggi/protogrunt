/*
require.config({
    paths: {
        "jquery": "../components/jquery/jquery",
        "jquery-cookie": "../components/jquery-cookie/jquery.cookie",
        "jquery-shopify": "../components/shopify_jquery_ajax_api/jquery.api",
        "jquery-url": "../components/jQuery-URL-Parser/purl",
        "jquery-bootstrap": "../components/bootstrap/docs/assets/js/bootstrap",
        "jquery-ui-effects-core": "../components/jquery-ui/ui/jquery.effects.core",
        "jquery-zclip": "../components/jquery-zclip/jquery.zclip",
        "mowgli": "./mowgli"
    },
    shim: {
        "jquery-cookie": ["jquery"],
        "jquery-shopify": ["jquery"],
        "jquery-url": ["jquery"],
        "jquery-bootstrap": ["jquery"],
        "jquery-ui-effects-core": ["jquery"],
        "jquery-zclip": ["jquery"]
    }
});

define("jquery-plugins", [
    "jquery",
    "jquery-cookie",
    "jquery-shopify",
    "jquery-url",
    "jquery-bootstrap",
    "jquery-ui-effects-core",
    "jquery-zclip"
], function($){
    return $;
});

require(["mowgli"], function() {});
*/

require.config({
    paths: {
        'jquery': '../components/jquery/jquery',
        'jquery-cookie': '../components/jquery-cookie/jquery.cookie'
    },
    map: {
        'jquery-cookie': { 'jquery': 'nc-jquery' }
    }
});

define('nc-jquery', ['jquery'], function (jq) {
    return jq.noConflict( true );
});

require(['nc-jquery', 'jquery-cookie'], function(myNonGlobaljQuery) {
    console.log(myNonGlobaljQuery().jquery);
    console.log(myNonGlobaljQuery.cookie("hello"));
});
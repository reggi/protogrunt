define("mowgli", ["jquery-plugins"], function($){

  console.log("hello world");
  var jQuery = $;
  var page = (typeof page !== "undefined") ? page : "";
  var template = (typeof template !== "undefined") ? template : "";

  var _learnq = _learnq || [];
  _learnq.push(['account', 'c2MSrU']);
  (function () {
    var b = document.createElement('script'); b.type = 'text/javascript'; b.async = true;
    b.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'a.klaviyo.com/media/js/learnmarklet.js';
    var a = document.getElementsByTagName('script')[0]; a.parentNode.insertBefore(b, a);
  })();

  var mowgli = {
    "function":{},
    "helper":{},
    "template":{
      "page":{},
    },
  };

  var debug = false;

  function ucwords (str) {
      return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
          return $1.toUpperCase();
      });
  }

  function eliminateDuplicates(arr) {
    var i,
        len=arr.length,
        out=[],
        obj={};

    for (i=0;i<len;i++) {
      obj[arr[i]]=0;
    }
    for (i in obj) {
      out.push(i);
    }
    return out;
  }

  // ---------------------------------------- 

  mowgli.helper.navigation = function(){
    var nav = {
      globe : {
        element : $("#icons .globe"),
        getStatus : function(){
          return ($(".window_stable.globe").length == 1) ? true : false;
        }
      },
      cart : {
        element : $("#icons .cart"),
        getStatus : function(){
          return ($(".window_stable.cart").length == 1) ? true : false
        }
      },
      phone : {
        element : $("#icons .phone"),
        getStatus : function(){
          return ($(".window_stable.phone").length == 1) ? true : false
        }
      }
    }  
    return nav;
  };

  var navigation = mowgli.helper.navigation();

  mowgli.helper.popover_hide = function(exception){
    var icon;
    for(icon in navigation){
      var element = navigation[icon].element;
      if(icon !== exception){
        $('.window_stable.'+icon).remove();
        if(navigation[icon].getStatus()){
          element.popover('hide');
        }
      }
    }
  };

  mowgli.helper.popover_show = function(rule){
    if(!navigation[rule].getStatus()){
      $('#icons .'+rule).popover('show');
      $('.'+rule+'.popover').wrap('<div class="window_stable '+rule+'" style="width:'+$(window).width()+'px;margin-left:-'+($(window).width() / 2)+'px">');
    }
    mowgli.helper.popover_hide(rule);
  };

  mowgli.helper.popover_ignite_cart = function(){
    $('#icons .cart').popover({
      trigger: "manual",
      placement: "bottom",
      content: function(){
        return $('.cart-content').html();
      },
      template: '<div class="cart popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
    });
    if(debug){console.log("mowgli.helper.popover_ignite_cart");}
  };

  mowgli.helper.popover_ignite_globe = function(){
    
    if($.cookie('globe_enabled') == null){
      $.cookie('globe_enabled', true, { expires: 7, path: '/' });
    }
    
    $.ajax({
      type : "GET",
      dataType : "jsonp",
      url : 'http://files.holstee.com/location/promo.php',
      success: function(data){
        if(data.eligible){
          //establish popover content
          $("#icons .globe")
          .attr("title",data.eligible.title)
          .popover({
            trigger: "manual",
            placement: "bottom",
            content: data.eligible.body,
            template: '<div class="globe popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
          })
          .removeClass('hide');
          
          if($.cookie('globe_enabled') == "true"){
            // Show on load
            mowgli.helper.popover_show("globe");
          }
          
          // toggle on click
          $('#icons .globe').click(function(event){
            if(globe_on){
              $.cookie('globe_enabled', false);
              mowgli.helper.popover_hide();
            }else{
              $.cookie('globe_enabled', true);
              mowgli.helper.popover_show("globe");
            }
          });
        }
      }
    });
    
    if(debug){console.log('mowgli.function.popover_nav_globe');}
    
  }

  mowgli.helper.popover_ignite_phone = function(){
    $('#icons .phone').popover({
      trigger: "manual",
      placement: "bottom",
      content: $('.phone-content').html(),
      template: '<div class="phone popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
    });
  }

  mowgli.helper.popover_click_icon = function(icon){
    var disable = false;  
    $('#icons .'+icon).click(function(event){
      event.preventDefault();
      if(disable == false){
        disable = true;
        if(navigation[icon].getStatus()){
          var output = "status:true";
          mowgli.helper.popover_hide();
        }else{
          var output = "status:false";
          mowgli.helper.popover_show(icon);
        }
      }
      disable = false;
      if(debug){console.log("mowgli.helper.popover_click_icon - "+icon);}
    });
  }

  mowgli.function.popover_nav_cart = function(){
    mowgli.helper.popover_ignite_cart();
    mowgli.helper.popover_click_icon("cart");
  }

  mowgli.function.popover_nav_globe = function(){
    //mowgli.helper.popover_ignite_globe();
  };

  mowgli.function.popover_nav_phone = function(){
    mowgli.helper.popover_ignite_phone();
    mowgli.helper.popover_click_icon("phone");
  };

  // ----------------------------------------

  mowgli.helper.add_cart_badge = function(number){
    $("#cart-badge").removeClass("hide");
    $("#cart-badge #item_count").text(number);
  }

  mowgli.helper.add_cart_submit = function(callback){
    $('form.add-to-cart').live('submit',function(event){
      var form = this;
      event.preventDefault();
      callback(form);
    });
    if(debug){console.log('mowgli.helper.add_cart_submit');}
  };

  mowgli.helper.add_cart_request = function(form,callback){
    var variant_id = ($("#variants").length > 0) ? $("#variants").val() : $(form).children('[name="id"]').val();
    if(variant_id !== "not-available"){
      Shopify.addItem(variant_id,1,function(line_item){
        $.ajax({
          type : "GET",
          dataType : "json",
          url : '/cart.js',
          success: function(data){
            callback(form,data);
          }
        });
      });
    }
    if(debug){console.log('mowgli.helper.add_cart_request');}
  };

  mowgli.helper.add_cart_display = function(data){
    var nt = "";
    var item;
    for (item in data.items){
      item = data.items[item];
      var ntr = "";
      ntr += "<tr id=\""+item.variant_id+"\">";
      ntr += "<td class=\"quantity\">";
      ntr += item.quantity;
      ntr += "</td>";
      ntr += "<td class=\"product\">";
      ntr += "<a href=\"";
      ntr += "http://holstee.com"+item.url;
      ntr += "\">";
      ntr += item.title;
      ntr += "</a>";
      ntr += "</td>";
      ntr += "<td class=\"price\">";
      ntr += Shopify.formatMoney(item.line_price);
      ntr += "</td>";
      ntr += "</tr>";
      nt += ntr;
    }  
    $(".cart-content tbody.products").html(nt);
    $(".cart-content .last .subtotal").text(Shopify.formatMoney(data.total_price));
    if(debug){console.log('mowgli.helper.add_cart_display');}
  }

  mowgli.function.add_cart = function(){
    var disable = false;
    mowgli.helper.add_cart_submit(function(form){
      if(disable == false){
        disable = true;
        $(form).children('input[type="submit"]').addClass("disabled");
        mowgli.helper.add_cart_request(form,function(form,data){
          mowgli.helper.add_cart_badge(data.item_count);
          mowgli.helper.add_cart_display(data);
          mowgli.helper.popover_show("cart");
          if(navigation.cart.getStatus()){
            var display = $(".cart-content").html();
            $(".window_stable.cart .popover-content p").html(display);
          }
          disable = false;
          $(form).children('input[type="submit"]').removeClass("disabled");
        });
      }
    });
    if(debug){console.log('mowgli.function.add_cart');}
  };

  // ----------------------------------------

  mowgli.function.scale_image = function(){
    $(window).load(function() {
      var bg_width = $(".protector img").width();
      var bg_resize = function(){
        if($(window).width() > 1339){
          $('.protector').removeClass('normal').addClass('large');
        }else{
          $('.protector').removeClass('large').addClass('normal');
        }
        if($(window).width() <= 940 ){
          $('.protector').removeClass('wide').addClass('preventative');
        }else{
          $('.protector').removeClass('preventative').addClass('wide');
        }
      }
      $(window).resize(function(){
        bg_resize();
      }).trigger("resize");
    });
    $(window).resize(function(){
      $('.image .overlay').width($(window).width());
    }).trigger("resize");
    if(debug){console.log('mowgli.function.scale_image');}
  }

  mowgli.function.separation = function(){
    //setup options / select object
    var options = new Object();
    //one subset for each option limit 3
    options.one = new Object();
    options.two = new Object();
    options.three = new Object();
    //for each set the select name
    for(key in productOptions){
      if(key == 0){
        options.one.select = productOptions[key];
      }else if(key == 1){
        options.two.select = productOptions[key];
      }else if(key == 2){
        options.three.select = productOptions[key];
      }
    }
    //instantiate the arrays for each subsets options
    options.one.options = [];
    options.two.options = [];
    options.three.options = [];
    //push in the options gathering from each of the product variants
    for(key in productVariants){
      options.one.options.push(productVariants[key].option1);
      options.two.options.push(productVariants[key].option2);
      options.three.options.push(productVariants[key].option3);
    }
    //get rid of the douplicate options
    options.one.options = eliminateDuplicates(options.one.options);
    options.two.options = eliminateDuplicates(options.two.options);
    options.three.options = eliminateDuplicates(options.three.options);
    //if the option contains nothing remove the object
    if(options.one.options[0] == "null") delete options.one;
    if(options.two.options[0] == "null") delete options.two;
    if(options.three.options[0] == "null") delete options.three;
    //setup the html string
    var html = "";
    //loop options
    for(key1 in options){

      var addclass = "";
      
      if(options[key1].options.length !== 1){
        //setup the label
        html += "<label>";
        html += options[key1].select;
        html += "</label>";
      }else{
       addclass = " hide";
      }
      
      //setup the select tags
      html += "<select id=\""+options[key1].select.toLowerCase()+"\" class=\"option-"+key1+addclass+"\">";
      //setup the option tags
      for(key2 in options[key1].options){
        html += "<option>";
        html += options[key1].options[key2];
        html += "</option>";
      }
      html += "</select>";
    }
    //append not available var
    $("select#variants").append('<option value="not-available">Not Available</option>');
    //hide the current dull variants dropdown
    $("select#variants").hide();
    //prepend new fresh select variants dropdown(s)
    $("form.add-to-cart").prepend(html);
    //when this code runs and when the select is changed update price and button
    var on_select_change_and_start = function(){
      
      $('form.add-to-cart input[type="submit"]').removeClass('disabled');
      $('#inyourcart').addClass('hide'); 
      
      var variant_selector = "";
      var soldout = false;
      if($(".option-one").val())  variant_selector += '[data-option-one="'+$(".option-one").val()+'"]';
      if($(".option-two").val())  variant_selector += '[data-option-two="'+$(".option-two").val()+'"]';
      if($(".option-three").val())  variant_selector += '[data-option-three="'+$(".option-three").val()+'"]';
      
      var end_variant_name = "";
      if($(".option-one").val())  end_variant_name += $(".option-one").val();
      if($(".option-two").val())  end_variant_name += " / "+$(".option-two").val();
      if($(".option-three").val())  end_variant_name += " / "+$(".option-three").val();
      
      if($(variant_selector).length == 0){
        // variant mixture does not exist
        $("form.add-to-cart #price").show().text('');
        $("select#variants").val('not-available');
      }else{
        $("select#variants").val($(variant_selector).val());
        $("form.add-to-cart #price").show().text($(variant_selector).attr('data-money'));
        if($(variant_selector).attr('data-available') == "true"){
          soldout = false;
        }else if($(variant_selector).attr('data-available') == "false"){
          soldout = true;
        }
      }
      if(soldout){
        $('form.add-to-cart input[type="submit"]').addClass('disabled');
        $('#soldout').removeClass('hide');
        $("#mce-VARI").val(end_variant_name);
      }else{
        $('form.add-to-cart input[type="submit"]').removeClass('disabled');
        $('#soldout').addClass('hide');
      }
      mowgli.function.overimage_center();
    }
    on_select_change_and_start();
    $(".option-one,.option-two,.option-three").live('change',on_select_change_and_start);
    if(debug){console.log('mowgli.function.seporation');}
  }

  mowgli.function.gallery = function(){

    $("#gallery .thumbnails .thumbnail").click(function(event){
      event.preventDefault();
      $("#gallery .thumbnails .span6 .thumbnail img").attr('src',$(this).attr('href'));
    });
    
    var images = {}
    var images_swap = []
    var count = 0;
    $("#gallery .thumbnails .span2 .thumbnail img").each(function(){
      images[$(this).attr('src')] = count;
      images_swap.push($(this).attr('src'));
      count++;
    });

    var init = setInterval(function(){
      var current_featured = $("#gallery .thumbnails .span6 .thumbnail img").attr('src');
      var snap = images[current_featured]+1;
      if((images[current_featured]+1) == 3) snap = 0;
      $("#gallery .thumbnails .span6 .thumbnail img").attr('src',images_swap[snap]);
    }, 5000);
    
  }

  mowgli.function.popover_product_icons = function(){
    $(".product-icons [rel=popover]").popover({
      trigger: "hover",
      placement: "top",
    });
  }

  mowgli.function.tooltip_social_icons = function(){
    $(".social-icons a").each(function(){
      var the_class = ucwords($(this).attr('class'));
      var the_title = $(this).attr('title');
      var the_tooltip = the_title.replace(the_class,'<strong>'+the_class+'</strong>');
      $(this).attr('title',the_tooltip).tooltip({placement: "bottom",});
    });
  }

  mowgli.function.overimage_center = function(){
    var image_height = 850;
    var overimage_height = $('#overimage').height();
    var overimage_bottom = (image_height - overimage_height) / 2;
    $('#overimage').css('bottom',overimage_bottom+'px');
    if(debug){console.log('mowgli.function.overimage_center');}
  }

  mowgli.function.help_notice = function(){
    $('#icons .phone').tooltip({
      placement: "bottom",
      trigger: "manual",
    });
    
    $('#icons .phone').tooltip('show');
    
    $(window).scroll(function(){
      $('#icons .phone').tooltip('hide');
    });
    
    setTimeout(function(){
      $('#icons .phone').tooltip('hide');
    },2500);
  }

  mowgli.function.social_products = function(){
    /*
    $('.open-social').click(function(event){
      event.preventDefault();
      var which = $(this).attr('data-cause-open');
      var target = '[data-effect-open="'+which+'"]';
      var status = $(target).css('display');
      if(status == "none"){
        $(target).show();
      }else{
        $(target).hide();
      }
    });
    */
    $('.image-arena').hover(function(){
      $(this).children('.social').show();
    },function(){
      $(this).children('.social').hide();
    });
   if(debug){console.log('mowgli.function.social_products');}
  }

  mowgli.function.next_slide = function(current_slide){
    if( (current_slide) == slide_limit){
      var offset = "0%";
    }else{
      var offset = "-"+((current_slide)*100)+"%";
    }
    $('.slides').animate({"left":offset}, 1000);
  }

  mowgli.function.page_navigation_selection = function(){
    $(window).load(function(){
      $('.anchor-spacer').each(function(){
        var checkTop = $(this).offset().top;
        var checkBottom = ($(this).offset().top) + $(this).height() + (20-1);
        var values = [];
        var this_id = $(this).attr('id');
        var last_id = $('.anchor-spacer').last().attr('id');
        var first_id = $('.anchor-spacer').first().attr('id');

        if(this_id == first_id) checkTop = 0;
        if(this_id == last_id) checkBottom = $(document).height();
      
        values[this_id] = false;
        //$('body').append('<div class="scrolltop" style="top:'+(checkTop)+'px"></div>');
        //$('body').append('<div class="scrolltop" style="background:blue;top:'+(checkBottom)+'px"></div>');
        $(window).scroll(function(){
          var win_scroll = $(window).scrollTop();
          var win_height = $(window).height();
          var doc_height = $(document).height();
          var bottom = win_scroll + win_height == doc_height;
        
          if(values[this_id] == false){
            if( win_scroll >= checkTop && win_scroll <= checkBottom && !bottom){
              values[this_id] = true;
              $('[href="#'+this_id+'"]').parent().addClass('active');
            }
          }else{
            if( win_scroll <= checkTop || win_scroll >= checkBottom || bottom){
              values[this_id] = false;
              $('[href="#'+this_id+'"]').parent().removeClass('active');
            }
          }
        
          if(bottom){
            values[last_id] = true;
            $('[href="#'+last_id+'"]').parent().addClass('active');
          }
        
        });
      });
    });
  }

  mowgli.function.page_navigation_fixed = function(){
    var nav_top = $('.simple#navigation').offset().top - 20 - 60;
    //$('body').append('<div class="scrolltop" style="top:'+(nav_top)+'px"></div>');
    $(window).scroll(function(){
      var win_top = $(this).scrollTop();
      if(win_top >= nav_top){
        $('.simple#navigation').addClass('fixed');
      }else{
        $('.simple#navigation').removeClass('fixed');
      }
    });
  }

  mowgli.function.mailchimp_footer = function(){
    $("#newsletter_form").submit(function(event){
      event.preventDefault();
      $.ajax({
        dataType: 'jsonp',
        url: "http://files.holstee.com/shopify/nodes/mailchimp/mailchimp.php",
        data: $(this).serialize(),
        success:function(mailchimp){
          if(mailchimp.success === true){
            $("#mailchimp-success").removeClass("hide");
          }
        }
      });
    });
  }

  mowgli.function.alert_bar = function(){

    $("#alert-bar-button").click(function(){
      $("#collection.template .capsule.gray").css({"padding-top": "0"});
      $.cookie('alert-bar-button', 'true');
    });

    if($.cookie('alert-bar-button') !== 'true'){
      $("#collection.template .capsule.gray").css({"padding-top": "20px"});
      $("#cart.template .capsule.gray").css({"padding-top": "20px"});
      $("#alert-bar").show();
    }

    $(window).scroll(function (event) {
        var top = $(this).scrollTop();
        $("#collection.template .capsule.gray").css({"padding-top": "0"});
        $("#cart.template .capsule.gray").css({"padding-top": "0"});
        $("#alert-bar").hide();
    });

  }

  mowgli.function.product_request = function(){

    if(window.location.hash == "#productrequest"){
      $("#productrequest").modal('show');
    }

    var form_handler = function(event) { 
      event.preventDefault();
    }

    $('#form6').bind('submit', form_handler);
    
    $("#human").keyup(function(){
        var value = $("#human").val();
        value = parseInt(value);
        if(value == 4){
          $('#form6').unbind('submit', form_handler);
          var wufoo = "https://holstee.wufoo.com/forms/w7x1a3/#public";
          $("#form6").attr("action",wufoo);
          $("#saveForm").removeClass("disabled");
        }
    });

  }

  mowgli.function.remove_zero = function(){
    var original_quantity = $(".quantity input").val();
    $(".quantity input").focusout(function(){
      var quantity = $(this).val();
      if(original_quantity !== quantity){
        var variant_id = $(this).attr("id").replace("updates_","");
        $.ajax({
          type : "POST",
          dataType : "json",
          url : '/cart/change.js',
          data : {"quantity":quantity,id:variant_id},
          success: function(data){
            console.log(data);
            document.location.reload(true);       
          }
        });
      }
    });
  }

  mowgli.function.discount_modal = function(flashPath){
    var referrer = function(){
      (function($) {
          $.QueryString = (function(a) {
              if (a == "") return {};
              var b = {};
              for (var i = 0; i < a.length; ++i)
              {
                  var p=a[i].split('=');
                  if (p.length != 2) continue;
                  b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
              }
              return b;
          })(window.location.search.substr(1).split('&'))
      })(jQuery);
      if(typeof $.QueryString !== "undefined"){
          var source = $.QueryString["utm_source"];
          var medium = $.QueryString["utm_medium"];
          var v = {
              "klaviyo-email" :(source == "klaviyo" && medium == "email"),
              "mentad-fb" : (source == "mentad" && medium == "fb"),
              "google-banner" : (source == "google" && medium == "banner"),
              "adroll-250" : (source == "adroll" && medium == "250"),
              "adroll-fb" : (source == "adroll" && medium == "fb")
          };
          if(v["mentad-fb"]){
              return "mentad-fb";
          }else if(v["google-banner"]){
              return "google-banner"
          }else if(v["adroll-250"]){
              return "adroll-250";
          }else if(v["adroll-fb"]){
              return "adroll-fb";
          }else{
              return false;
          }
      }
    }

    if(!$.cookie('closeDiscount')){
      setTimeout(function(){
        var reference = referrer();
        if(reference){
            $('.discountModal').modal('show');
            $("#hiddenList").attr("value",reference);
            $('.discountModal [name="FNAME"]').focus();
        }
        $("#mailchimp-form").mailchimpList(function(mailchimp){
            $.cookie('closeDiscount', true);
            $(".removePostSubmit").hide();
            if(mailchimp.success){
              _learnq.push(['identify', {
                '$email' : mailchimp.form_data.EMAIL,
                '$first_name' : mailchimp.form_data.FNAME,
              }]);
              _learnq.push(['track', 'Signup Discount Modal', {
                'Coupon Code' : mailchimp.discount_code,
                'Coupon Amount' : 5.00
              }]);
              $("#codeItself").text(mailchimp.discount_code);
              $('#copyIt').zclip({
                  path: flashPath,
                  copy: $('#codeItself').text()
              });
            }
        });
      },1000);
    }

    $("#closeDiscount").click(function(){
      $.cookie('closeDiscount', true);
    });
  }

  mowgli.function.eligible_route = function(ip, callback){
    var interface_ip = (typeof ip !== "undefined" && ip !== false && ip !== "") ? "?ip="+ip : "";
    $.ajax({
      type : "GET",
      dataType : "jsonp",
      url: "http://api.holstee.com/location"+interface_ip,
      success: function(data){
        if(!data.error) return callback(data.sr);
      }
    });
  }

  mowgli.function.location_bar = function(ip){
    //us: mowgli.function.location_bar("66.35.68.145");
    //uk: mowgli.function.location_bar("212.2.14.151");
    var interface_ip = (typeof ip !== "undefined" && ip !== "") ? "?ip="+ip : "";
    $(".location-bar").hide();
    $.ajax({
      dataType: 'jsonp',
      url: "http://api.holstee.com/location"+interface_ip,
      success:function(data){
        if(!data.error){
          if(data.country.code == "US"){
            if($("#location-bar-us").length !== 0){
              $("#location-bar-us").removeClass("hide").show();
              $("#location-bar-us .alert").removeClass("hide");
            }
          }else if(data.sr){
            if($("#location-bar-uk").length !== 0){
              $("#location-bar-uk").removeClass("hide").show();
              $("#location-bar-uk .alert").removeClass("hide");
              $("#location-bar-uk p .countryName").text(data.country.name);
            }
          }
        }
      }
    });
  }

  var location_discount = true;

  var flashPath = "http://cdn.shopify.com/s/files/1/0031/5352/t/19/assets/ZeroClipboard.swf?933";

  mowgli.function.manifesto = function(ip){
    //us: mowgli.function.manifesto("24.103.44.205");
    //uk: mowgli.function.manifesto("212.2.14.151");
    if(product.id == "99394806" && ($.cookie('closeLocationModal') !== true)){
      mowgli.function.eligible_route(ip, function(run){
        if(run){
          $('.locationModal').modal().on('shown', function () {
            $(".locationModal .close").click(function(){
              $.cookie('closeLocationModal', true);
            });
            $('#copyIt-location').zclip({
              path: flashPath,
              copy: $('#codeItself-location').text()
            });
          });
        }
      });
    }
  }

  mowgli.function.location_cart = function(ip){
    //us: mowgli.function.location_cart("24.103.44.205");
    //uk: mowgli.function.location_cart("212.2.14.151");
    if((typeof manifesto_status !== "undefined") && manifesto_status){
      if($.cookie('closeLocationCartModal') !== true){
        mowgli.function.eligible_route(ip, function(run){
          if(run){
            $('.locationModalCart').modal().on('shown', function () {
              $(".locationModalCart .close").click(function(){
                $.cookie('closeLocationCartModal', true);
              });
              $('#copyIt-locationCart').zclip({
                path: flashPath,
                copy: $('#codeItself-locationCart').text()
              });
            });
          }
        });
      }
    }
  }

  mowgli.function.block_referrer = function(url){
    if(url !== ""){
      var url = $.url(url);
      var list = [
        "holstee.com",
        "mylife.holstee.com",
        "blog.holstee.com",
        "shop.holstee.com",
        "refreshed.is",
      ];
      var block = _.contains(list, url.attr('host'));
    }else{
      var block = true;
    }
    return block
  }

  mowgli.function.frenzy = function(){
    var block = mowgli.function.block_referrer(document.referrer);
    if(!block){
      if(!$.cookie('closeFrenzy')){
        $('.frenzyModal').modal('show');
        $('.frenzyModal [name="FNAME"]').focus();
        $("#frenzy-mailchimp-form").mailchimpList(function(mailchimp){
          $.cookie('closeFrenzy', true);
          $(".removePostSubmit").hide();
          if(mailchimp.success){
            _learnq.push(['identify', {
              '$email' : mailchimp.form_data.EMAIL,
              '$first_name' : mailchimp.form_data.FNAME,
            }]);
            _learnq.push(['track', 'Signup Frenzy Modal', {
              'Coupon Code' : mailchimp.discount_code,
              'Coupon Amount' : 5.00
            }]);
            $("#codeItself-frenzy").text(mailchimp.discount_code);
            $('#copyIt-frenzy').zclip({
                path: flashPath,
                copy: $('#codeItself-frenzy').text()
            });
          }
        });
      }
    }

  }

  mowgli.template.page.all = function(){
    mowgli.function.popover_nav_phone();
    mowgli.function.popover_nav_cart();
  }

  mowgli.template.page.about = function(){
    $('#our-family .thumbnails a.thumbnail').tooltip({placement:"bottom"});
    mowgli.function.page_navigation_selection();
    mowgli.function.page_navigation_fixed();
  }

  mowgli.template.page.press = function(){
    $('.press a.thumbnail').tooltip({placement:"bottom"});
    mowgli.function.page_navigation_selection();
    mowgli.function.page_navigation_fixed();
  }

  mowgli.template.page.jobs = function(){
    mowgli.function.page_navigation_selection();
    mowgli.function.page_navigation_fixed();
  }

  mowgli.template.page.artistseries = function(){
    mowgli.function.add_cart();
  }

  mowgli.template.all = function(){
    //mowgli.function.popover_nav_globe();
    mowgli.function.popover_nav_phone();
    if(template !== "cart"){
      mowgli.function.popover_nav_cart();
    }
    mowgli.function.mailchimp_footer();
    mowgli.function.alert_bar();
    mowgli.function.discount_modal("http://cdn.shopify.com/s/files/1/0031/5352/t/19/assets/ZeroClipboard.swf?933");
    mowgli.function.frenzy();
  }

  mowgli.template.product = function(){
    mowgli.function.scale_image();
    mowgli.function.separation();
    mowgli.function.gallery();
    mowgli.function.popover_product_icons();
    mowgli.function.add_cart();
    mowgli.function.tooltip_social_icons();
    mowgli.function.social_products();
    if((typeof location_discount !== "undefined") && location_discount) mowgli.function.manifesto();
  }

  mowgli.template.cart = function(){
    mowgli.function.popover_product_icons();
    mowgli.function.help_notice();
    mowgli.function.remove_zero();
    $('#message').modal('show');
    if((typeof location_discount !== "undefined") && location_discount) mowgli.function.location_cart();
  }

  mowgli.template.collection = function(){
    mowgli.function.product_request();
    mowgli.function.social_products();
  }

  mowgli.template.index = function(){
    mowgli.function.scale_image();
    mowgli.function.social_products();
    mowgli.function.location_bar();

    if(slide_limit == 1){
      $('.next-slide').each(function(){
        $(this).hide();
      });
    }
    
    $('.next-slide').click(function(){
      var current_slide = parseInt($(this).closest(".slide").attr('id').replace('s',''));
      mowgli.function.next_slide(current_slide);
      init = window.clearInterval(init);
    });
    
    if(slide_limit != 1){
      var init = setInterval(function(){
        var current_slide = Math.abs(parseInt($('.slides').css('left').replace(/px|%/,''))/100)+1;
        mowgli.function.next_slide(current_slide);
      }, 8000);
    }
  }

  Shopify.onError = function(XMLHttpRequest, textStatus) {
    $('#inyourcart').removeClass('hide');
    $('form.add-to-cart input[type="submit"]').addClass('disabled');
    mowgli.function.overimage_center();
  };

  $(document).ready(function(){
    // $('#admin_bar_iframe').remove();

    if(page == ""){
      if(typeof mowgli.template[template] == 'function'){
        mowgli.template.all();
        mowgli.template[template]();
      }
    }else{
      page = page.replace("-",'');
      if(typeof mowgli.template.page[page] == 'function'){
        mowgli.template.page.all();
        mowgli.template.page[page]();
      }
    }
    
  });

});
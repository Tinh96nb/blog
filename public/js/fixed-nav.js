// var menu = $('#menu');
//     var origOffsetY = menu.offset().top;

//     function scroll() {
//         if ($(window).scrollTop() >= origOffsetY) {
//             $('#menu').addClass('sticky').addClass('col-md-12');
//             $('#content').addClass('menu-padding');
//         } else {
//             $('#menu').removeClass('sticky');
//             $('#content').removeClass('menu-padding');
//         }


//     }
//     document.onscroll = scroll;
$(document).ready(function () {

    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    });

    $('#scrollup').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });

    /* fix side bar */
    var stickySidebar = $('.sidebar-fix');
    if (stickySidebar.length > 0) {	
      var stickyHeight = stickySidebar.height(),
          sidebarTop = stickySidebar.offset().top;
    }
    
    // on scroll move the sidebar
    $(window).scroll(function () {
      if (stickySidebar.length > 0) {	
        var scrollTop = $(window).scrollTop();
                
        if (sidebarTop < scrollTop) {
          stickySidebar.css('top', scrollTop - sidebarTop);
    
          // stop the sticky sidebar at the footer to avoid overlapping
          var sidebarBottom = stickySidebar.offset().top + stickyHeight,
              stickyStop = $('.main-content').offset().top + $('.main-content').height();
          if (stickyStop < sidebarBottom) {
            var stopPosition = $('.main-content').height() - stickyHeight;
            stickySidebar.css('top', stopPosition);
          }
        }
        else {
          stickySidebar.css('top', '0');
        } 
      }
    });
    
    $(window).resize(function () {
      if (stickySidebar.length > 0) {	
        stickyHeight = stickySidebar.height();
      }
    });
});
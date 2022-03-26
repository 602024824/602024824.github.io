var pageFadeTime = 800, // Page fade time
    spW = 768,          // SP max width (not contain)
    isSp,               // Is SP or not
    winW,               // Window width
    winH,               // Window height
    winST,              // Window scrollTop
    isChange;           // Is change to PC/SP

$(function(){
    initCommon();
    initDevice();
    initLink();
    initFadeAnim();
    initLazyload();
    initHeader();

    $(window).load(function(){
      initLazyload();
    });
});

function initBodyScroll(scrollCallback) {
  if (isSp || ua.indexOf('ipad') != -1) return

  var html = document.documentElement;
  var body = document.body;

  var scroller = {
    target: document.querySelector("#scroll-container"),
    ease: 0.08, // <= scroll speed
    endY: 0,
    y: 0,
    resizeRequest: 1,
    scrollRequest: 0,
  };

  var requestId = null;

  TweenLite.set(scroller.target, {
    rotation: 0.01,
    force3D: true
  });

  window.addEventListener("load", onLoad);

  function onLoad() {    
    updateScroller();  
    window.focus();
    window.addEventListener("resize", onResize);
    document.addEventListener("scroll", onScroll); 
  }

  function updateScroller() {
    
    var resized = scroller.resizeRequest > 0;
      
    if (resized) {    
      var height = scroller.target.clientHeight;
      body.style.height = height + "px";
      scroller.resizeRequest = 0;
    }
        
    var scrollY = window.pageYOffset || html.scrollTop || body.scrollTop || 0;

    scroller.endY = scrollY;
    scroller.y += (scrollY - scroller.y) * scroller.ease;

    if (Math.abs(scrollY - scroller.y) < 0.05 || resized) {
      scroller.y = scrollY;
      scroller.scrollRequest = 0;
    }
    
    TweenLite.set(scroller.target, { 
      y: -scroller.y 
    });
    if (scrollCallback) scrollCallback(scroller.y)
    
    requestId = scroller.scrollRequest > 0 ? requestAnimationFrame(updateScroller) : null;
  }

  function onScroll() {
    scroller.scrollRequest++;
    if (!requestId) {
      requestId = requestAnimationFrame(updateScroller);
    }
  }

  function onResize() {
    scroller.resizeRequest++;
    if (!requestId) {
      requestId = requestAnimationFrame(updateScroller);
    }
  }
}

function initCommon() {
    $(window).load(function(){ $('body').addClass('hideCover').addClass('loaded') });
    $(window).scroll(function(){ winST = $(window).scrollTop() }).trigger('scroll');
    $(window).resize(getWinSize).trigger('resize');

    function getWinSize() {
        winW = $('html').css('overflow', 'hidden').width();
        winH = $(window).height();
        isChange = isSp !== undefined && isSp != (winW < spW);
        isSp = winW < spW;
        $('html').removeAttr('style');
    }
}

function initDevice() {
    if (ua.indexOf('android') != -1) $('body').addClass('android');

    if (ua.indexOf('iphone') != -1){
        if (winW == 320) $('body').addClass('iphone5');
        if (winW == 375) $('body').addClass('iphone678');
        if (winW == 414) $('body').addClass('iphone678Plus');
    }

    if (ua.indexOf('ipad') != -1) $('body').addClass('ipad');
}

function initLink() {
    $('a').each(function(){
        var obj = $(this);

        if (this.hostname != location.hostname || obj.attr('target') == '_blank') return;

        if (this.pathname != location.pathname) {
            obj.click(function(){
                $('body').removeClass('openMenu');
                $('body').removeClass('hideCover');

                if (isSp) {
                  location.href = obj.attr('href')
                } else {
                  setTimeout(function(){ location.href = obj.attr('href') }, pageFadeTime);
                }
                return false;
            });
        } else {
            var target = $(this.hash);

            obj.click(function(){
                if (target.length) {
                    $('body').removeClass('openMenu');
                    var top = target.offset().top;

                    $('html, body').stop().animate({
                        // -100 is to show addressBar in iphone
                        scrollTop: top ? top : -100
                    }, {
                        duration: 1000,
                        step: function (now, fx) {
                            if(fx.prop == 'scrollTop') {
                                var newTop = target.offset().top;
                                fx.end = newTop ? newTop : -100;
                            }
                        }
                    });
                }
                return false;
            });
        }
    });
}

function initFadeAnim() {
    var observerOptions = {
        rootMargin: '100px',
        threshold: 0
      }

    if (!$('.fadeInAnim').length) return;
    $('.fadeInAnim').each(function(idx, elem) {
      var io = new IntersectionObserver(function(entries, observer) {
        $(entries).each(function(idx2, entry) {
          if (entry.isIntersecting) {
            $(entry.target).addClass('visible');
            observer.disconnect();
          }
        });
      }, observerOptions);
      io.observe(elem)
    });
}

function initLazyload(callback) {
  var observerOptions = {
    rootMargin: '100px',
    threshold: 0
  }

  if ($('img.lazy').length) {
    $('.lazy').each(function(idx, elem) {
      var io = new IntersectionObserver(function(entries, observer) {
        $(entries).each(function(idx2, entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            imgLoader(img, img.getAttribute('data-src'));
            observer.disconnect();
          }
        });
      }, observerOptions);
      io.observe(elem)
    });
  }

  if ($('.sliderLazyWrap').length) {
    $('.sliderLazyWrap').each(function(idx, elem) {
      var io = new IntersectionObserver(function(entries, observer) {
        $(entries).each(function(idx2, entry) {
          if (entry.isIntersecting) {
            var wrap = entry.target;
            $(wrap).find('.sliderLazy').each(function() {
              var src = $(this).data('slider-src');
              imgLoader(this, src);
            })
            observer.disconnect();

            if (callback) callback();
          }
        });
      }, observerOptions);
      io.observe(elem)
    });
  }
}

function imgLoader(img, src) {
  $(img).attr('src', src);
  $(img).one('load', function() {
    $(img).addClass('fadeIn');
  }).each(function() {
    if (this.complete) {
      $(this).load();
    }
  });
}

function initHeader() {
  var sec      = $('#gHeader'),
      menuBtn  = $('.menuBtn'),
      closeBtn = $('.closeBtn'),
      nav      = $('#gNavi'),
      scrollFlg;

  menuBtn.click(function(){ 
    $('body').addClass('openMenu');
    navHei   = $('#gNavi').height();
  });
  closeBtn.click(function(){ $('body').removeClass('openMenu') });

  setHeader();
  $(window).scroll(setHeader);
  $(window).resize(setHeader);

  function setHeader() {
    if (winST > ($('body').hasClass('top') ? winH - (isSp ? 56 : 72) : sec.outerHeight())) {
      $('body').addClass('scrollHeader');
      if (!scrollFlg) TweenLite.fromTo(sec, .3, {y:-90}, {y:0,onComplete:function(){ scrollFlg = true }});
    } else {
      $('body').removeClass('scrollHeader');
      scrollFlg = false;
    }
  }

}
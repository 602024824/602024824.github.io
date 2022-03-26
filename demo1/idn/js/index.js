$(function(){
	aboutImg();
  
  initParallax();

  initMainVis();
  $(window).resize(mainVisualHeight).trigger('resize');

  initBodyScroll(function(scrollerY) {
  	setParallax(scrollerY)
  });

  initFivScroll();
});

function mainVisualHeight() {
	$('.mainVisual').height(winH - (isSp ? 120 : 160));
	$('.itemHidden > .cur').width(winW - (isSp ? 76 : 160));
	$('.itemHidden > div > div').width(winW);
}

function getRandomNumber(max,min) {
	var num = 0;
	for(let i = 0; i<10; i++) {
	   num = Math.floor(Math.random() * (max - min + 1)) + min;
	}
	return num;
}

function aboutImg(){
  if (!$('.aboutList').length) return
  var aboutMax = 13;
  var num = getRandomNumber(aboutMax, 1);
  var img = '/img/index/img_about' + num + (isSp ? '_sp' : '') + '.jpg';
 	var imgSpace = isSp ? '/img/index/img_about_space_sp.png' : '/img/index/img_about_space.png';

  var html = '<li class="on"><img class="lazy" data-src="' + img + '" src="' + imgSpace + '" alt=""></li>';

  $('.aboutList').html(html);

  if (isSp || ua.indexOf('ipad') != -1) {
   var targets = $('.aboutList');

    $(window).load(setPos);
    $(window).scroll(setPos).trigger('scroll');

    function setPos() {
        setParallax();
    }
    setTimeout(setPos, 100);
  }

   initLazyload();
};

function initParallax() {
  var targets = $('.charItem, .aboutListBox');

  var observerOptions = {
    rootMargin: '100px',
    threshold: 0
  }

  targets.each(function(idx, elem) {
    var io = new IntersectionObserver(function(entries, observer) {
      $(entries).each(function(idx2, entry) {
        if (entry.isIntersecting) {
          $(entry.target).addClass('inView');
        } else {
        	$(entry.target).removeClass('inView');
        }
      });
    }, observerOptions);
    io.observe(elem)
  });

  if (isSp || ua.indexOf('ipad') != -1) {
  	setParallax();
  }
}

function setParallax(scrollerY) {
	$('.charItemImg, .aboutList').each(function() {
		if ($(this).parents().hasClass('inView')) {
			var h = winST + winH - $(this).offset().top;
			
      var total = $(this).outerHeight() + winH;
      var distance = distance = $(this).find('.lazy').outerHeight() - $(this).outerHeight();
      var y = distance * h / total;
      y = y > distance ? distance : y;

      if (!$(this).find('.lazy').attr('src')) {
      	imgLoader($(this).find('.lazy'), $(this).find('.lazy').data('src'));
      }
      $(this).find('.lazy').css({
      	transform: 'translate3d(0, -' + (y) + 'px, 0)'
      });
		}
	});
}

$(window).load(function() {
	initMainIn();
});

function initMainIn() {
	TweenLite.to($('.mainVisualList'), 0.5, {
		scale: 1, 
		opacity: 1, 
		ease: Power0.easeNone,
		onStart: function() {
			logoIn();
		},
		onComplete: function() {
			
		}
	})
}

function logoIn() {
	var elemList = $('.mainVisLogo em');
  var i = 0;
  var tl01 = new TimelineLite({delay: 0});
  tl01.staggerTo(elemList, 0.5, {
    opacity: 1, 
    ease: Back.easeOut.config(3),
    onStartParams: [],
    onStart: function() {

    },
    onComplete: function() {

    }
  }, 0.05 );
  tl01.to($('#gHeader, .mainVisual .itemText, .mainVisNews, .scrollCon, .smainVisBar'), 0.5, {
  	opacity: 1,
  	onComplete: function() {
  		
  	}
  });

  visShow();

  $('.smainVisBar span').removeAttr('style');
  setTimeout(function() {
  	new TimelineLite()
		.to($('.smainVisBar span'), visTime / 2, {
			width: '100%',
			ease: Power0.easeNone
		})
  }, 1500);
}

var isFirstVis = true;
function visShow() {
	$('.volLink').attr('href', volList[curVisIdx].link);
	$('.itemText p').eq(curVisIdx).addClass('show').siblings().removeClass('show');
	var tl = new TimelineLite({delay: 0})
	tl.to($('.sub-vis-' + curVisIdx), visTime, {
		left: 0,
		onStart: function() {
			setTimeout(function() {
				$('.smainVisBar span').removeAttr('style');
				new TimelineLite()
				.to($('.smainVisBar span'), visTime / 2, {
					width: '100%',
					ease: Power0.easeNone
				})

				if (curVisIdx > volList.length - 2) {
					curVisIdx = 0;
				} else {
					curVisIdx++;
				}

				var next = $('.vis-' + curVisIdx);
				next.css('z-index', 100).addClass('cur');
				next.siblings().css('z-index', 0).removeClass('cur');

				new TimelineLite()
				.to(next, 2, {
					width: '100%',
					ease: Power3.easeInOut,
					onStart: function() {
						visShow()
					},
					onComplete: function() {
						$('.vis-' + curVisIdx).siblings().width(0);
						$('.vis-' + curVisIdx).siblings().find('div').css('left', isSp ? -50 : -100);
					}
				})

				isFirstVis = false
			}, (isFirstVis ? visTime / 1.55 * 1000 : visTime / 2 * 1000));
		},
		onComplete: function() {

		}
	})
}

var curVisIdx = 0,
		visTime = 12,
		volList = [
			{
				pc: '/img/index/img_fiv01.jpg',
				sp: '/img/index/img_fiv01_sp.jpg',
				vol: '1',
				title: 'Osamu Shigematsu Living in Tokyo',
				link: '/sample'
			},
			{
				pc: '/img/index/img_fiv02.jpg',
				sp: '/img/index/img_fiv02_sp.jpg',
				vol: '2',
				title: 'vol-title-2-2-2-2',
				link: '/sample'
			},
			{
				pc: '/img/index/img_fiv03.jpg',
				sp: '/img/index/img_fiv03_sp.jpg',
				vol: '3',
				title: 'vol-title-3-3',
				link: '/sample'
			},
			{
				pc: '/img/index/img_fiv04.jpg',
				sp: '/img/index/img_fiv04_sp.jpg',
				vol: '4',
				title: 'vol-title-4-4-4-4-4',
				link: '/sample'
			},
			{
				pc: '/img/index/img_fiv05.jpg',
				sp: '/img/index/img_fiv05_sp.jpg',
				vol: '5',
				title: 'vol-title-5-5',
				link: '/sample'
			},
			{
				pc: '/img/index/img_fiv06.jpg',
				sp: '/img/index/img_fiv06_sp.jpg',
				vol: '6',
				title: 'vol-title-6-6-6',
				link: '/sample'
			},
			{
				pc: '/img/index/img_fiv07.jpg',
				sp: '/img/index/img_fiv07_sp.jpg',
				vol: '7',
				title: 'vol-title-7-7',
				link: '/sample'
			},
			{
				pc: '/img/index/img_fiv08.jpg',
				sp: '/img/index/img_fiv08_sp.jpg',
				vol: '8',
				title: 'vol-title-8-8-8-8-8',
				link: '/sample'
			},
			{
				pc: '/img/index/img_fiv09.jpg',
				sp: '/img/index/img_fiv09_sp.jpg',
				vol: '9',
				title: 'vol-title-9-9-9',
				link: '/sample'
			},
			{
				pc: '/img/index/img_fiv10.jpg',
				sp: '/img/index/img_fiv10_sp.jpg',
				vol: '10',
				title: 'vol-title-10-10-10-10',
				link: '/sample'
			}
		];
function initMainVis() {
  for (var i = 0; i < volList.length; i++) {
  	var cur = volList[i];
  	var img = isSp ? cur.sp : cur.pc;
  	$('.itemHidden').append('<div class="vis-' + (i) + '" style="z-index:' + (i) + '"><div class="sub-vis-' + i + '" style="background-image: url(' + img + ')"><a href=""></a></div></div>');
  	$('.sub-vis-' + i).width(winW);
  	$('.itemText').append('<p class="-perpetuaRe"><span>Vol.' + cur.vol + '</span>' + cur.title + '</p>');
  }
}

function initFivScroll() {
	$('.scrollCon').click(function(){
		$('html,body').animate({
			scrollTop:winH
		});
	});
}
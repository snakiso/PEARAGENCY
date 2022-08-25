var swiper = new Swiper('.reviews-slider', {
 speed: 1200,
 autoplay: {
  delay: 5000
 },
 spaceBetween: 30,
 loop: true,
 pagination: {
  el: '.swiper-pagination',
  clickable: true
 }
});

var scene = document.getElementById('scene');
var parallaxInstance = new Parallax(scene, {
 relativeInput: true
});


// // // 
(function (doc, win) {
  "use strict";

  /**
   * @see https://github.com/hesambayat/is-touch-device-javascript
   */
  var istouch = "undefined" !== IS_TOUCH_DEVICE && IS_TOUCH_DEVICE ? true : false;

  var isMac = false;

  /**
   * @see https://stackoverflow.com/a/38241481/2131534
   */
  try {
   if (["Macintosh", "MacIntel", "MacPPC", "Mac68K"].indexOf(win.navigator.platform) !== -1) {
    isMac = true;
   }
  } catch (error) { }

  var isChrome = false;

  /**
   * @see https://stackoverflow.com/a/9851769/2131534
   */
  try {
   isChrome = !!window.chrome && !!window.chrome.webstore;
  } catch (error) { }

/**
   * PaperJS patterns will give your site a colorful and playful look,
   * Users will enjoy to spend more time in the website.
   */
function pixudio_paper() {
 // paper has not included.
 if ("undefined" === typeof paper) return;

 doc.querySelectorAll(".paper--patterns").forEach(function (parent) {
  var canvas = parent.querySelector("canvas"),
   config = win[parent.getAttribute("data-elements")],
   scope = new paper.PaperScope();

  scope.setup(canvas);
  scope.view.viewSize.width = canvas.clientWidth;
  scope.view.viewSize.height = canvas.clientHeight;

  var tools = new scope.Tool(),
   drawing = false,
   pageScrolling = false,
   display = "desktop",
   viewport = {},
   mouse = {
    x: 0,
    y: 0,
    limit: 0.2,
    speed: 0.00015,
    onmove: false
   },
   tilt = {
    min: 40,
    max: -40,
    speed: 0.002,
    angle: 0,
    direction: 1
   },
   setting = {
    deltaX: 0,
    deltaY: 0
   },
   group;

  // animations

  // mouse move animation
  var mouseMove = function (event) {
   // pause on page scroll
   if (false !== pageScrolling) {
    return;
   }

   // pause if meshes aren’t out there yet
   if (undefined === group || undefined === group.children) {
    return;
   }

   for (var i = 0, len = group.children.length; i < len; i++) {
    // set new x axis if its in limited radius
    setting.deltaX = group.children[i].position.x + (mouse.x - viewport.x) * ((i + 1) * mouse.speed);
    if (setting.deltaX > group.children[i].limits.x.min && setting.deltaX < group.children[i].limits.x.max) {
     group.children[i].position.x = setting.deltaX;
    }

    // set new y axis if its in limited radius
    setting.deltaY = group.children[i].position.y + (mouse.y - viewport.y) * ((i + 1) * mouse.speed);
    if (setting.deltaY > group.children[i].limits.y.min && setting.deltaY < group.children[i].limits.y.max) {
     group.children[i].position.y = setting.deltaY;
    }
   }
  };

  // auto tilt animation
  var tiltMove = function (event) {
   // pause on page scroll
   if (false !== pageScrolling) {
    return;
   }

   // to move up or down
   if (tilt.angle > tilt.min) {
    tilt.direction = -1;
   } else if (tilt.angle < tilt.max) {
    tilt.direction = 1;
   }

   // Move once step ahead
   tilt.angle += tilt.direction;
   // set Y axis
   for (var i = 0, len = group.children.length; i < len; i++) {
    group.children[i].position.y += tilt.angle * tilt.speed * (i + 1);
   }
  };

  // helpers

  // shorten for paper.Point
  var point = function (axis, y) {
   if (undefined !== y) {
    axis = {
     x: axis,
     y: y
    };
   }
   return new scope.Point(axis.x, axis.y);
  };

  // get coordinates from center
  var getCoordinates = function (axis) {
   return {
    x: viewport.x + axis[display].x,
    y: viewport.y + axis[display].y
   };
  };

  // transform to a point
  var translate = function (axis) {
   return point(getCoordinates(axis));
  };

  // recognize display size & draw
  var update = function () {
   if (false !== drawing) {
    return;
   }

   drawing = true;

   scope.view.onFrame = null;
   scope.project.activeLayer.removeChildren();

   display = win.innerWidth < 992 ? "mobile" : "desktop";

   group = new scope.Group();

   viewport = scope.view.center;
   group.position = scope.view.center;

   addChildren();

   drawing = false;
  };

  // recognize the mouse cordination
  var mouseCoordinates = function (points) {
   clearTimeout(mouse.onmove);
   mouse.x = points.x;
   mouse.y = points.y;

   if (true !== istouch) {
    mouseMove();
   }

   mouse.onmove = setTimeout(function () {
    mouse.onmove = false;
   }, 100);
  };

  // set limit radius for meshes
  var updateLimits = function (limit) {
   for (var i = 0, len = group.children.length; i < len; i++) {
    limit = (group.children[i].index + 1) / mouse.limit;
    group.children[i].limits = {
     x: {
      min: group.children[i].position.x - limit,
      max: group.children[i].position.x + limit
     },
     y: {
      min: group.children[i].position.y - limit,
      max: group.children[i].position.y + limit
     }
    };
   }

   // run animation
   scope.view.onFrame = true !== istouch ? tiltMove : null;
  };

  var shapes = {
   // generate a new triangle
   triangle: function (config, mesh) {
    mesh = new scope.Path.RegularPolygon(translate(config), 3, config[display].size);
    mesh.strokeColor = config.strokeColor;
    mesh.strokeWidth = config.strokeWidth;
    mesh.blendMode = config.blendMode || "normal";
    mesh.rotate(config.rotate || 0);
    group.addChild(mesh);
   },

   // generate a new circle
   circle: function (config, mesh) {
    mesh = new scope.Path.Circle(translate(config), config[display].size);
    mesh.strokeColor = config.strokeColor;
    mesh.strokeWidth = config.strokeWidth;
    mesh.blendMode = config.blendMode || "normal";
    group.addChild(mesh);
   },

   // generate a new wave path
   wave: function (config, mesh, size) {
    size = getCoordinates(config);
    size.a = config[display].size;
    size.b = Math.floor(size.a * 0.5);
    size.c = Math.floor(size.b * 0.5);

    mesh = new scope.Path();
    mesh.strokeColor = config.strokeColor;
    mesh.strokeWidth = config.strokeWidth;
    mesh.blendMode = config.blendMode || "normal";
    mesh.add(point(size.x - size.a, size.y));
    mesh.add(point(size.x - size.a, size.y));
    mesh.add(point(size.x - size.b, size.y + size.c));
    mesh.add(point(size.x, size.y));
    mesh.add(point(size.x + size.b, size.y + size.c));
    mesh.add(point(size.x + size.a, size.y));
    mesh.smooth({ type: "catmull-rom", factor: 0.5 });
    mesh.rotate(config.rotate || 0);
    group.addChild(mesh);
   },

   // generate a new raster
   raster: function (config, mesh) {
    mesh = new scope.Raster({
     source: config.src,
     position: translate(config)
    });
    mesh.blendMode = config.blendMode || "normal";
    mesh.on("load", function () {
     mesh.setHeight(mesh.height + 1);
     mesh.setHeight(mesh.height - 1); // fix issue https://github.com/paperjs/paper.js/issues/1192#issuecomment-300736753
     mesh.scale(config[display].scale || 0.5);
     mesh.rotate(config.rotate || 0);
    });
    group.addChild(mesh);
   }
  };

  var addChildren = function () {
   for (var i = 0, len = config.length; i < len; i++) {
    shapes[config[i].type] && shapes[config[i].type](config[i]);
   }

   updateLimits();
  };

  // strat drawing

  // add shapes
  update();

  // On resize
  var resizing = 0;
  scope.view.onResize = function (e) {
   scope.activate();
   scope.view._needsUpdate = true;
   scope.view.update();
   update();

   classie.add(parent, "resizing");
   clearTimeout(resizing);
   resizing = setTimeout(function () {
    classie.remove(parent, "resizing");
   }, 500);
  };

  // disable animations on window scroll event
  win.addEventListener(
   "scroll",
   function (e) {
    clearTimeout(pageScrolling);
    pageScrolling = setTimeout(function () {
     pageScrolling = false;
    }, 25);
   },
   false
  );

  // start mouse animation on mouse move event
  tools.onMouseMove = function (event) {
   mouseCoordinates(event.lastPoint);
  };
 });
}

/**
 * PaperJS patterns will give your site a colorful and playful look,
 * Users will enjoy to spend more time in the website.
 */
function pixudio_gooey() {  //функция создания gooey
 // paper has not included.
 if ("undefined" === typeof paper) return;
 // animate paper has not included.
 if ("undefined" === typeof animatePaper) return;

 doc.querySelectorAll(".paper--gooey").forEach(function (parent) {  // нашли елемент с классом с котором находится наш канвас
  var canvas = parent.querySelector("canvas"),
   config = [].concat(win[parent.getAttribute("data-elements")]),
   scope = new paper.PaperScope(); //создали paper

  scope.setup(canvas);
  scope.view.viewSize.width = canvas.clientWidth + 1200; // Ширина канваса 
  scope.view.viewSize.height = canvas.clientHeight + 1200; // Высота канваса

  var tools = new scope.Tool(),  // настройки 
   drawing = false,
   pageScrolling = false,
   display = "desktop",
   mousePoint = new scope.Point(-1000, -1000),
   mouseForce = 0.15,
   shapes = [];

  // recognize display size & draw
  var update = function () {    //распознает размер экрана и отрисовывает 
   if (false !== drawing) {
    return;
   }

   drawing = true;

   scope.view.onFrame = null;
   scope.project.activeLayer.removeChildren();

   display = win.innerWidth < 992 ? "mobile" : "desktop";

   shapes = [];

   for (var i = 0, len = config.length; i < len; i++) {
    var shape = Object.assign({}, config[i]);
    var cords = {
     center: {
      //  x: scope.view.center.x + shape[display].center.x,   // расположение относительно центра
      x: scope.view.center.x + 500,
      y: scope.view.center.y - 600
     }
    };

    var mesh = Object.assign(
     {
      radius: 100,
      center: { x: 0, y: 0 },
      fillColor: "#00000"
     },
     shape[display],
     cords
    );

    shape.mesh = mesh;

    var mask = false;
    if ("mask" === shape.type) {
     mask = new scope.Raster({
      source: shape.src,
      position: mesh.center
     });
     mask.opacity = 0;
     mask.on("load", function () {
      animatePaper.animate(mask, {
       properties: {
        opacity: 1
       },
       settings: {
        duration: shape.fadeIn || 2000,
        easing: "easeInOutCirc",
        complete: function (item, animation) { }
       }
      });
     });
    }
    var circlePath = new scope.Path.Circle(mesh); //создание круга? 
    if (shape.flatten) {
     //  circlePath.flatten(shape.flatten); // добавление углов?  если его нет, то получается нужнй нам круг
     circlePath.smooth({ type: "asymmetric" }); // сглаживание углов
    }

    var rotationMultiplicator = mesh.radius / 200;
    var settings = [];
    for (var ii = 0; ii < circlePath.segments.length; ii++) {
     settings.push({
      relativeX: circlePath.segments[ii].point.x - mesh.center.x,
      relativeY: circlePath.segments[ii].point.y - mesh.center.y,
      offsetX: rotationMultiplicator,
      offsetY: rotationMultiplicator,
      momentum: new scope.Point(0, 0)
     });
    }

    shape.settings = settings;
    shape.threshold = mesh.radius * 1.4; // коффециент увеличения внешнего круга от курсора
    shape.circlePath = circlePath;
    shape.group = new scope.Group([circlePath]);
    shape.controlCircle = circlePath.clone();
    shape.rotationMultiplicator = rotationMultiplicator;

    shape.controlCircle.fullySelected = false;
    shape.controlCircle.visible = false;

    if (mask !== false) {
     var maskGroup = new scope.Group([shape.group, mask]);
     // mask raster
     maskGroup.clipped = true;
     shape.mask = mask;
     shape.maskGroup = maskGroup;
    }

    circlePath.opacity = 0;
    animatePaper.animate(circlePath, {
     properties: {
      opacity: 1
     },
     settings: {
      duration: shape.fadeIn || 2000,
      easing: "easeInOutCirc",
      complete: function (item, animation) { }
     }
    });

    shapes.push(shape);
   }

   // run animation
   if (true !== istouch) {
    scope.view.onFrame = function (event) {
     animate(event);
    };
   }

   drawing = false;
  };

  // animation
  var animate = function (event) {
   for (var i = 0, len = shapes.length; i < len; i++) {
    var shape = shapes[i];
    var mesh = shape.mesh;
    shape.group.rotate(-0.2, mesh.center);
    for (var ii = 0; ii < shape.circlePath.segments.length; ii++) {
     var segment = shape.circlePath.segments[ii];

     var settings = shape.settings[ii];
     // var controlPoint = new scope.Point();
     var controlPoint = shape.controlCircle.segments[ii].point;

     // Avoid the mouse
     var mouseOffset = mousePoint.subtract(controlPoint);
     var mouseDistance = mousePoint.getDistance(controlPoint);
     var newDistance = 0;
     if (mouseDistance < shape.threshold) {
      newDistance = (mouseDistance - shape.threshold) * mouseForce;
     }

     var newOffset = new scope.Point(0, 0);
     if (mouseDistance !== 0) {
      newOffset = new scope.Point((mouseOffset.x / mouseDistance) * newDistance, (mouseOffset.y / mouseDistance) * newDistance);
     }

     var newPosition = controlPoint.add(newOffset);
     var distanceToNewPosition = segment.point.subtract(newPosition);

     settings.momentum = settings.momentum.subtract(distanceToNewPosition.divide(6));
     settings.momentum = settings.momentum.multiply(0.6);

     // Add automatic rotation
     var amountX = settings.offsetX;
     var amountY = settings.offsetY;
     var sinus = Math.sin(event.time + ii * 4);
     var cos = Math.cos(event.time + ii * 4);
     settings.momentum = settings.momentum.add(new scope.Point(cos * -amountX, sinus * -amountY));

     // go to the point, now!
     segment.point = segment.point.add(settings.momentum);
    }
   }
  };

  // strat drawing

  // add shapes
  update();

  // On resize
  scope.view.onResize = function (e) {
   scope.activate();
   scope.view._needsUpdate = true;
   scope.view.update();
   update();
  };

  // disable animations on window scroll event
  win.addEventListener(
   "scroll",
   function (e) {
    clearTimeout(self.pageScrolling);
    self.pageScrolling = setTimeout(function () {
     self.pageScrolling = false;
    }, 25);
   },
   false
  );

  // mouse move
  tools.onMouseMove = function (event) {
   mousePoint = event.lastPoint;
  };
 });
}

/**
   * Fires when the initial HTML document has been completely loaded and parsed,
   * without waiting for stylesheets, images, and subframes to finish loading.
   */
function pixudio_init() {
 // add “is-touch” class to html tag if browser's touch APIs implemented,
 // whether or not the current device has a touchscreen.
 if (true === istouch) {
  classie.add(doc.documentElement, "is-touch");
 }

 // add “is-mac" class to html tag if OS is macintosh.
 if (true === isMac) {
  classie.add(doc.documentElement, "is-mac");
 }

 // add “is-chrome" class to html tag if browser is google chrome.
 if (true === isChrome) {
  classie.add(doc.documentElement, "is-chrome");
 }

 // Setup “paperJS”
 setTimeout(pixudio_paper, 0);

 // Setup “paperJS”
 setTimeout(pixudio_gooey, 0);

 // Setup “paperJS”
 setTimeout(pixudio_starts, 0);

 // Setup “carousel”
 setTimeout(pixudio_carousel, 0);

 // Setup “scroll to”
 setTimeout(pixudio_scrollTo, 0);

 // Setup “side menu”
 setTimeout(pixudio_sideMenu, 0);

 // Setup “sticky header”
 setTimeout(pixudio_stickyHeader, 0);

 // Setup “go up”
 setTimeout(pixudio_goUp, 0);

 // Setup “tabs”
 setTimeout(pixudio_tabs, 0);

 // Setup "masonry"
 setTimeout(pixudio_masonry, 0);

 // Setup "mediabox"
 setTimeout(pixudio_mediabox, 0);

 // Setup "mailchimp"
 setTimeout(pixudio_mailchimp, 0);

 // Setup “instagram feed”
 setTimeout(pixudio_instafeed, 0);

 // Setup “in view”
 setTimeout(pixudio_inView, 0);

 // Setup "countdown timer"
 setTimeout(pixudio_countDownTimer, 0);

 // Setup "google map"
 setTimeout(pixudio_googleMap, 0);

 // Setup "alert"
 setTimeout(pixudio_alerts, 0);

 // Setup "accordion"
 setTimeout(pixudio_accordion, 0);

 // Setup "lazy source"
 setTimeout(pixudio_lazysource, 0);
}
// trigger on document.ready scripts
pixudio_init();
}) (document, window);
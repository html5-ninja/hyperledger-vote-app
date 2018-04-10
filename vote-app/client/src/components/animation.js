var mojs = require('mo-js');

const COLORS = {
  RED: '#FD5061',
  YELLOW: '#FFCEA5',
  BLACK: '#29363B',
  WHITE: 'white',
  VINOUS: '#A50710'
}

const burst1 = new mojs.Burst({
  left: 0,
  top: 0,
  count: 8,
  radius: {
    50: 150
  },
  children: {
    shape: 'line',
    stroke: [
      'white',
      '#FFE217',
      '#FC46AD',
      '#D0D202',
      '#B8E986',
      '#D0D202'
    ],
    scale: 1,
    scaleX: {
      1: 0
    },
    // pathScale:    'rand(.5, 1.25)',
    degreeShift: 'rand(-90, 90)',
    radius: 'rand(20, 40)',
    // duration:     200,
    delay: 'rand(0, 150)',
    isForce3d: true
  }
});

const largeBurst = new mojs.Burst({
  left: 0,
  top: 0,
  count: 4,
  radius: 0,
  angle: 45,
  radius: {
    0: 50
  },
  children: {
    shape: 'line',
    stroke: '#4ACAD9',
    scale: 1,
    scaleX: {
      1: 0
    },
    radius: 100,
    duration: 450,
    isForce3d: true,
    easing: 'cubic.inout'
  }
});

const CIRCLE_OPTS = {
  left: 0,
  top: 0,
  scale: {
    0: 1
  }
}

const largeCircle = new mojs.Shape({
  ...CIRCLE_OPTS,
  fill: 'none',
  stroke: 'white',
  strokeWidth: 4,
  opacity: {
    .25: 0
  },
  radius: 250,
  duration: 600
});

const smallCircle = new mojs.Shape({
  ...CIRCLE_OPTS,
  fill: 'white',
  opacity: {
    .5: 0
  },
  radius: 30
});

export const animation = function() {
  document.getElementsByClassName('candidates-list')[0].addEventListener('click', function(e) {
    var el = document.getElementsByClassName('img-block');

    for (var i = 0; i < el.length; i++) {
      el[i].addEventListener('click', function(e) {
        burst1.tune({x: e.pageX, y: e.pageY}).generate().replay();
        largeBurst.tune({x: e.pageX, y: e.pageY}).replay();
        largeCircle.tune({x: e.pageX, y: e.pageY}).replay();
        smallCircle.tune({x: e.pageX, y: e.pageY}).replay();
        return false;
      })
    }

  });
}

import Vue from 'vue';

import VueHighcharts from 'vue-highcharts';
import Highcharts from 'highcharts';

(function(originalDestroy) {
  Highcharts.Chart.prototype.destroy = function() {
    if (this.userOptions.chart.destroyDelay) {
      setTimeout(() => {
        originalDestroy.call(this);
      }, this.userOptions.chart.destroyDelay);
      return;
    }
    originalDestroy.call(this);
  }
})(Highcharts.Chart.prototype.destroy);

// Highcharts smoothBorder param support
const pathGraphHelpers = {
  int(value) {
    return parseInt(value, 10)
  },
  checkCollinear(p0, p1, p2) {
    return (
      this.int(p0.plotX + p2.plotX) === this.int(2 * p1.plotX) && this.int(p0.plotY + p2.plotY) === this.int(2 * p1.plotY)
    );
  },
  moveTo(to, from, radius) {
    const vector = { plotX: to.plotX - from.plotX, plotY: to.plotY - from.plotY };
    const length = Math.sqrt(vector.plotX * vector.plotX + vector.plotY * vector.plotY);
    const unitVector = { plotX: vector.plotX / length, plotY: vector.plotY / length };

    return {
      plotX: from.plotX + unitVector.plotX * radius,
      plotY: from.plotY + unitVector.plotY * radius
    };
  },
  getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.plotX - p1.plotX, 2) + Math.pow(p2.plotY - p1.plotY, 2));
  }
};

(function(originalGetGraphPath) {
  Highcharts.Series.prototype.getGraphPath = function(originalPoints, nullsAsZeroes, connectCliffs) {
    // Get original not modified highcharts
    const path = originalGetGraphPath.call(this, originalPoints, nullsAsZeroes, connectCliffs);

    const radius = this.options.smoothRadius;
    if (!radius) return path;

    // Get points except first M (moveTo)
    const rawPoints = path.slice(1).filter(it => it !== 'L');

    // Clear path array but save moveTo points
    const moveTo = path.slice(0, 3);
    path.length = 0;
    path.push.apply(path, moveTo);
    // Rearrange plot points with smoothRadius support
    const plotPoints = [];
    for (let i = 3, l = rawPoints.length; i < l; i = i + 2) {

      // Get previous point, current point and next point
      let prev = {
        plotX: rawPoints[i - 3],
        plotY: rawPoints[i - 2],
        isExist: rawPoints[i - 3] !== undefined
      };

      const point = {
        plotX: rawPoints[i - 1],
        plotY: rawPoints[i]
      };

      const next = {
        plotX: rawPoints[i + 1],
        plotY: rawPoints[i + 2],
        isExist: rawPoints[i + 2] !== undefined
      };

      if (!prev.isExist) prev = point;

      const isCollinear = next.isExist && pathGraphHelpers.checkCollinear(next, point, prev);

      // Skip on last point or if next point is collinear with current
      if (!next.isExist || isCollinear) {
        path.push(
          'L',
          point.plotX,
          point.plotY
        );
        continue;
      }

      const threshold = Math.min(
        pathGraphHelpers.getDistance(prev, point),
        pathGraphHelpers.getDistance(next, point)
      );

      const isTooCloseForRadius = threshold / 2 < radius;
      const radiusForPoint = isTooCloseForRadius ? threshold / 2 : radius;

      const before = pathGraphHelpers.moveTo(prev, point, radiusForPoint);
      const after = pathGraphHelpers.moveTo(next, point, radiusForPoint);

      path.push(
        'L',
        before.plotX,
        before.plotY,
        'S',
        point.plotX,
        point.plotY,
        after.plotX,
        after.plotY
      );
    }

    return path;
  };
})(Highcharts.Series.prototype.getGraphPath);

Vue.use(VueHighcharts, { Highcharts });

Vue.use(function(Vue) {
  Object.defineProperties(Vue.prototype, {
    '$highcharts': {
      get() {
        return Highcharts;
      }
    }
  });
});

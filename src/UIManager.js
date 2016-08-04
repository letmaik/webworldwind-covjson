function UIManager(wwd, cov, dom) {
  this._wwd = wwd
  this._cov = cov
  this._dom = dom
  this._fullTime = ""
  var self = this

  var timeAxis = dom.axes.get("t")
  var zaxis = dom.axes.get("z")
  layer = this.createLayer({time: "", depth: ""})
    .on('load', function () {
      self._wwd.addLayer(layer)
    }).load()
  this._layer = layer

  if(timeAxis) {
    this._layer = this.runTimeSelector(timeAxis)
  }else {
    var timeUI = document.getElementById("timeUI")
    timeUI.parentNode.removeChild(timeUI)
  }
  if(zaxis) {
    this._layer = this.runDepthSelector(zaxis)
    // console.log(this._depth);
  }else {
    var depthUI = document.getElementById("depthUI")
    depthUI.parentNode.removeChild(depthUI)
  }
}

UIManager.prototype.runTimeSelector = function (timeAxis) {
  var self = this

  if(!timeAxis) {
    layer = this.createLayer()
      .on('load', function () {
        self._wwd.addLayer(layer)
      }).load()
      return layer
  }else {

    var values = timeAxis.values

    timeSelector = new TimeSelector(values, {dateId: "dateStamps", timeId: "timeStamps"})

    var dateStamps = document.getElementById("dateStamps")
    var timeStamps = document.getElementById("timeStamps")

    var date = dateStamps.options[dateStamps.selectedIndex].value
    var time = timeStamps.options[timeStamps.selectedIndex].value

    layer = this.createLayer({time: date + "T" + time})
    .on('load', function () {
      self._wwd.addLayer(layer)
    }).load()
    this._fullTime = date + "T" + time

    timeSelector.on("change", function (time) {
      self._wwd.removeLayer(layer)
      layer = self.createLayer({time: time.value})
      .on('load', function () {
        self._wwd.addLayer(layer)
      }).load()
      this._fullTime = time
    })
    return layer
  }
}

UIManager.prototype.runDepthSelector = function(zaxis) {
  var self = this

  if(!zaxis) {
    layer = this.createLayer()
      .on('load', function () {
        self._wwd.addLayer(layer)
      }).load()
      return layer
  }else {

    var values = zaxis.values

    depthSelector = new DepthSelector(values, {zaxisID: "zaxis"})

    var depthStamps = document.getElementById("zaxis")

    var currDepth = depthStamps.options[depthStamps.selectedIndex].value

    layer = this.createLayer({depth: currDepth})
    .on('load', function () {
      self._wwd.addLayer(layer)
    }).load()
    this._depth = currDepth

    depthSelector.on("change", function (depth) {
      self._wwd.removeLayer(layer)
      layer = self.createLayer({depth: depth.value})
      .on('load', function () {
        self._wwd.addLayer(layer)
      }).load()
      this._depth = depth
    })
    return layer
  }
}

UIManager.prototype.createLayer = function(options) {
  var cov = this._cov
  var firstParamKey = cov.parameters.keys().next().value

  var layer = CovJSONLayer(cov, {
    paramKey: firstParamKey,
    time: options.time,
    depth: options.depth
  }).on('load', function () {
    this._legend = createLegend(cov, layer, firstParamKey)
  })
  return layer
}

UIManager.prototype.getLayer = function() {
  return this._layer
}

var threshold = 127, width = 1024, height = 768, msgId = 1

var worker = new Worker('edge-detect.js')
worker.onmessage = function(evt) {
  if(evt.data[1] != msgId) return
  var imgData = new ImageData(width, height)
  imgData.data.set(new Uint8ClampedArray(evt.data[0]), 0)
  ctx.putImageData(imgData, 0, 0)
}

document.querySelector('input').oninput = function() {
  threshold = this.value
  ctx.drawImage(img, 0, 0, width, height)
  var imgData = ctx.getImageData(0, 0, width, height)
  worker.postMessage([imgData.data.buffer, width, height, threshold, ++msgId], [imgData.data.buffer])
}

var canvas = document.querySelector('canvas'),
    ctx = null

var img = new Image()
img.onload = function() {
  width = img.width
  height = img.height

  canvas.width = width
  canvas.height = height
  ctx = canvas.getContext('2d')

  ctx.drawImage(img, 0, 0, width, height)
  var imgData = ctx.getImageData(0, 0, width, height)
  worker.postMessage([imgData.data.buffer, width, height, threshold, msgId], [imgData.data.buffer])
}
img.src = '../test.jpg'

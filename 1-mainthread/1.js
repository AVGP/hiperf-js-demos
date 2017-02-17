var threshold = 127, width = 1024, height = 768

document.querySelector('input').oninput = function() {
  threshold = this.value
  ctx.drawImage(img, 0, 0, width, height)
  var imgData = ctx.getImageData(0, 0, width, height)
  imgData.data.set(highlightEdges(imgData.data), 0)
  ctx.putImageData(imgData, 0, 0)
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
  imgData.data.set(highlightEdges(imgData.data), 0)
  ctx.putImageData(imgData, 0, 0)
}
img.src = '../test.jpg'

function highlightEdges(pixels) {
  performance.mark('start_edge_detect')
  var output = pixels.slice(0) // copies the typed array
  for(var y=1; y<height-1; y++) {
    for(var x=1; x<width-1; x++) {
      var hEdge = getGrayscaleValueAt(pixels, x-1, y-1) * -1 +
                  getGrayscaleValueAt(pixels, x-1,   y) * -2 +
                  getGrayscaleValueAt(pixels, x-1, y+1) * -1 +
                  getGrayscaleValueAt(pixels, x+1,   y) *  1 +
                  getGrayscaleValueAt(pixels, x+1,   y) *  2 +
                  getGrayscaleValueAt(pixels, x+1, y+1) *  1

      var vEdge = getGrayscaleValueAt(pixels,x-1, y-1) * -1 +
                  getGrayscaleValueAt(pixels,x  , y-1) * -2 +
                  getGrayscaleValueAt(pixels,x+1, y-1) * -1 +
                  getGrayscaleValueAt(pixels,x-1, y+1) *  1 +
                  getGrayscaleValueAt(pixels,x  , y+1) *  2 +
                  getGrayscaleValueAt(pixels,x+1, y+1) *  1

      var offset = 4 * ((y* width) + x)

      var edgeVal = Math.sqrt(hEdge*hEdge + vEdge * vEdge)

      if(edgeVal >= threshold) {
        output[offset  ] = 255
        output[offset+1] = 255
        output[offset+2] = 255
      } else {
        output[offset  ] = 0
        output[offset+1] = 0
        output[offset+2] = 0
      }
    }
  }
  performance.mark('stop_edge_detect')
  performance.measure('Edge detection', 'start_edge_detect', 'stop_edge_detect')
  return output
}

function getGrayscaleValueAt(pixels, x, y) {
  var offset = 4 * ((y * width) + x);
  return (pixels[offset] + pixels[offset + 1] + pixels[offset + 2]) / 3
}

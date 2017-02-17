
self.onmessage = function(evt) {
  var result = highlightEdges(new Uint8ClampedArray(evt.data[0]), evt.data[1], evt.data[2], evt.data[3])
  self.postMessage([result.buffer, evt.data[4]], [result.buffer])
}

function highlightEdges(pixels, width, height, threshold) {
  performance.mark('start_edge_detect')
  var output = pixels.slice(0) // copies the typed array
  for(var y=1; y<height-1; y++) {
    for(var x=1; x<width-1; x++) {
      var hEdge = getGrayscaleValueAt(pixels, x-1, y-1, width) * -1 +
                  getGrayscaleValueAt(pixels, x-1,   y, width) * -2 +
                  getGrayscaleValueAt(pixels, x-1, y+1, width) * -1 +
                  getGrayscaleValueAt(pixels, x+1,   y, width) *  1 +
                  getGrayscaleValueAt(pixels, x+1,   y, width) *  2 +
                  getGrayscaleValueAt(pixels, x+1, y+1, width) *  1

      var vEdge = getGrayscaleValueAt(pixels,x-1, y-1, width) * -1 +
                  getGrayscaleValueAt(pixels,x  , y-1, width) * -2 +
                  getGrayscaleValueAt(pixels,x+1, y-1, width) * -1 +
                  getGrayscaleValueAt(pixels,x-1, y+1, width) *  1 +
                  getGrayscaleValueAt(pixels,x  , y+1, width) *  2 +
                  getGrayscaleValueAt(pixels,x+1, y+1, width) *  1

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

function getGrayscaleValueAt(pixels, x, y, width) {
  var offset = 4 * ((y * width) + x);
  return (pixels[offset] + pixels[offset + 1] + pixels[offset + 2]) / 3
}

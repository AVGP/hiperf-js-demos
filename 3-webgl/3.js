var WIDTH = 1024, HEIGHT = 768

var canvas = document.querySelector('canvas'),
    ctx = null

var img = new Image()
img.onload = function() {
  WIDTH = img.width
  HEIGHT = img.height

  canvas.width = WIDTH
  canvas.height = HEIGHT

  var gl = canvas.getContext('webgl')
  var texture = gl.createTexture()

  setupRendering(gl, texture, img)
}
img.src = '../test.jpg'

function setupRendering(gl, texture, img) {
  var vertices = [
    1.0,  1.0,
   -1.0,  1.0,
    1.0, -1.0,
   -1.0, -1.0
  ]
  var vertexPosBuffer = gl.createBuffer()

  // Setup
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.viewport(0, 0, canvas.width, canvas.height)

  // filling in the vertices
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

  vertexPosBuffer.itemSize = 2
  vertexPosBuffer.numItems = 4

  // compiling, attaching, linking the shaders
  gl.clear(gl.COLOR_BUFFER_BIT)

  var vertexShaderSrc = document.getElementById("vs").textContent
  var fragmentShaderSrc = document.getElementById("fs").textContent
  var shaderProgram = gl.createProgram()
  var vs = gl.createShader(gl.VERTEX_SHADER)
  var fs = gl.createShader(gl.FRAGMENT_SHADER)

  gl.shaderSource(vs, vertexShaderSrc)
  gl.compileShader(vs)
  if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
    alert('Vertex shader failed compilation:\n' + gl.getShaderInfoLog(vs))
    console.log(gl.getShaderInfoLog(shaderProgram))
  }
  gl.shaderSource(fs, fragmentShaderSrc)
  gl.compileShader(fs)
  if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    alert('Fragment shader failed compilation:\n' + gl.getShaderInfoLog(fs))
    console.log(gl.getShaderInfoLog(shaderProgram))
  }

  gl.attachShader(shaderProgram, vs)
  gl.attachShader(shaderProgram, fs)
  gl.linkProgram(shaderProgram)
  if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders")
  }
  gl.useProgram(shaderProgram)

  // bind the uniforms
  gl.uniform1f(gl.getUniformLocation(shaderProgram, "uWidth"), WIDTH)
  gl.uniform1f(gl.getUniformLocation(shaderProgram, "uHeight"), HEIGHT)

  var thresholdUniform = gl.getUniformLocation(shaderProgram, "uThreshold")
  gl.uniform1f(thresholdUniform, 0.5)

  document.querySelector('input').oninput = function() {
    gl.uniform1f(thresholdUniform, this.value / 255)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems)
  }

  // Vertex position attribute
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer)
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition")
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute)
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0)

  // Texture
  var texCoordinates = [
    1.0,  0.0,
    0.0,  0.0,
    1.0,  1.0,
    0.0,  1.0
  ]

  var texCoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoordinates), gl.STATIC_DRAW)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.generateMipmap(gl.TEXTURE_2D)
  gl.bindTexture(gl.TEXTURE_2D, null)

// Texture coordinate attribute
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
  shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord")
  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute)
  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer)
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition")
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute)
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems)
}

# hiperf-js-demos
Demos for my "Warpspeed: High performance tricks for JavaScript" talk

## The sample problem

In the samples we want to process a 4096 x 4096 pixel image to detect edges.

## The process
Edge detection can be done using the [Sobel operator](), using a relatively simple process:

* For each pixel, look at 6 of it's neighbouring pixels.
* Turn the neighbours into grayscale (you will get a value between 0 and 255), so you only need to compare a single value for each pixel
* Weight each neighbours grayscale value according to the Sobel operator matrix (i.e. multiply the pixel with the corresponding value from the matrix)
* Sum the weighted values up
* Do these steps for both the vertical and the horizontal matrix
* Square the two resulting values, add them and take the square root from the sum
* If the result from the previous step is bigger than an arbitrary threshold, colour the output pixel white, else colour it black.

## The demos

* [Run the operations on the main thread](https://avgp.github.io/hiperf-js-demos/1-mainthread), which blocks the UI and is janky.
* [Run the operations in a separate worker](https://avgp.github.io/hiperf-js-demos/2-web-workers), which does not block the UI but still takes quite long.
* [Run the operations as a shader in WebGL](https://avgp.github.io/hiperf-js-demos/3-webgl), which is fast but takes its toll on the GPU.

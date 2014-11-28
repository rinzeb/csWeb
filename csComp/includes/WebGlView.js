var webGlObj = null;

var WebGlLayer = (function () {
    function WebGlLayer(lmap, jsonObj, options) {
            //this.webGLData = 
            this.leafletMap = lmap;            
            this.data = jsonObj;
            this.measIdx = 0;
            if (jsonObj.features[0].measurements != null)
                this.maxMeasIdx = jsonObj.features[0].measurements.length;
            else
                this.maxMeasIdx = 0;

            webGlObj = this;

            this.leafletMap.on('movestart', function (e) {
                webGlObj.moving = true;
            });
            this.leafletMap.on('moveend', function (e) {
                webGlObj.moving = false;
            });
            webGlObj.layerShow = "L2";

            this.leafletMap.on('click', function (e) {
                var clickPos = e.latlng;
                // Find closest element in jsonObj
                var closestDistance = 100000000.0;
                var closestIndex = -1;
                for (var i = 0; i < webGlObj.data.features.length; i++) { // .geometry.coordinates.length; i++)                     
                    for (var j = 0; j < webGlObj.data.features[i].geometry.coordinates.length; j++) {
                        var featLatLng = L.latLng(webGlObj.data.features[i].geometry.coordinates[j][1], webGlObj.data.features[i].geometry.coordinates[j][0]);
                        var curDist = clickPos.distanceTo(featLatLng);
                        if(curDist < closestDistance && curDist < 100)
                        {
                            closestDistance = curDist;
                            closestIndex = i;
                        }
                    }
                }
                if (closestIndex != -1) {
                    webGlObj.closestIndex = closestIndex;
                    options.click(closestIndex,webGlObj.data.features[closestIndex]);
                } else
                    webGlObj.closestIndex = -1;
            });

            this.leafletMap.on('zoomend', function (e) {
                if (webGlObj.leafletMap.getZoom() > 14) {
                    if (webGlObj.layerShow != "L1") {
                        webGlObj.layerShow = "L1";
                        webGlObj.handleFiltered(webGlObj.filtered);
                    }
                }
                else {
                    if (webGlObj.layerShow != "L2") {
                        webGlObj.layerShow = "L2";
                        webGlObj.handleFiltered(webGlObj.filtered);
                    }
                }
            });

            var glLayer = L.canvasOverlay().drawing(this.drawingOnCanvas).addTo(this.leafletMap);
            
            this.glLayer = glLayer;
            this.canvas = glLayer.canvas();

            glLayer.canvas.width = this.canvas.clientWidth;
            glLayer.canvas.height = this.canvas.clientHeight;

            this.gl = this.canvas.getContext('experimental-webgl', { antialias: true });

            this.pixelsToWebGLMatrix = new Float32Array(16);
            this.mapMatrix = new Float32Array(16);

            // -- WebGl setup
            var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
            this.gl.shaderSource(vertexShader, document.getElementById('vshader').text);
            this.gl.compileShader(vertexShader);

            var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
            this.gl.shaderSource(fragmentShader, document.getElementById('fshader').text);
            this.gl.compileShader(fragmentShader);

            // link shaders to create our program
            var program = this.gl.createProgram();
            this.gl.attachShader(program, vertexShader);
            this.gl.attachShader(program, fragmentShader);
            this.gl.linkProgram(program);
            this.gl.useProgram(program);
            this.program = program;

            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            this.gl.enable(this.gl.BLEND);

            //  this.gl.disable(gl.DEPTH_TEST);
            // ----------------------------
            // look up the locations for the inputs to our shaders.
            this.u_matLoc = this.gl.getUniformLocation(program, "u_matrix");
            this.gl.aPointSize = this.gl.getAttribLocation(program, "a_pointSize");

            // Set the matrix to some that makes 1 unit 1 pixel.
            this.pixelsToWebGLMatrix.set([2 / this.canvas.width, 0, 0, 0, 0, -2 / this.canvas.height, 0, 0, 0, 0, 0, 0, -1, 1, 0, 1]);
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

            this.gl.uniformMatrix4fv(this.u_matLoc, false, this.pixelsToWebGLMatrix);

            var numPoints = 0;
        
    }

    Math.average = function() {
        var cnt, tot, i;
        cnt = arguments.length;
        tot = i = 0;
        while (i < cnt) tot+= arguments[i++];
        return tot / cnt;
    }

    WebGlLayer.prototype.handleFiltered = function (filtered) {
        if (filtered == null)
            filtered = this.data.features;
        else
            this.filtered = filtered;
        console.log("Filtered items WebGl : " + filtered[0].properties.LINK_ID)
        // Only draw these features
        //if (this.moving == true)
        //    return;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webGLData.buffer);

        var curVertArr = this.vertArray;
        if (this.layerShow == "L2")
            curVertArr = this.vertArrayL2;

        var curIdx = this.measIdx;

        var maxMeas = 100;

        for (var idxL in this.verticesIndex) {
            var idxObj = this.verticesIndex[idxL];
            var idx = idxObj.index;

            for (var i = idxObj.startIdx; i < idxObj.endIdx; i += 6) {
                if (curVertArr[i + 5] != 0.0)
                    curVertArr[i + 5] = 0.001;
            }
        }

        for (var idxL in filtered) {    
            var linkId = filtered[idxL].properties.LINK_ID;
            var idxObj = this.verticesIndex[linkId];
            var idx = idxObj.index;
            
            
            var rR = 0.0;
            var rG = 0.8;
            var rB = 0.0;

            
            for (var i = idxObj.startIdx; i < idxObj.endIdx; i += 6) {                
                if(curVertArr[i + 5] != 0.0)
                    curVertArr[i + 5] = 1.0;
            }
        }

        //this.vertArray = new Float32Array(this.webGLData.points);
        var fsize = this.vertArray.BYTES_PER_ELEMENT;

        // -- set up vertext offset
        this.gl.bufferData(this.gl.ARRAY_BUFFER, curVertArr, this.gl.STATIC_DRAW);
        var vertLoc = this.gl.getAttribLocation(this.program, "a_vertex");
        this.gl.vertexAttribPointer(vertLoc, 2, this.gl.FLOAT, false, fsize * 6, 0);
        this.gl.enableVertexAttribArray(vertLoc);

        // -- offset for color buffer
        var colorLoc = this.gl.getAttribLocation(this.program, "a_color");
        this.gl.vertexAttribPointer(colorLoc, 4, this.gl.FLOAT, false, fsize * 6, fsize * 2);
        this.gl.enableVertexAttribArray(colorLoc);

        this.numPoints = this.webGLData.points.length / 6;
        this.glLayer.redraw();
        var nrSecs = this.measIdx % 60;
        var nrSecsStr = (nrSecs < 10) ? "0" + nrSecs : nrSecs;
        var timeStr = Math.floor(this.measIdx / 60) + ":" + nrSecsStr;
        $("#litTime").text("Tijd : " + timeStr);
        this.measIdx += 1;
        if (this.measIdx >= this.maxMeasIdx)
            this.measIdx = 0;
    }

    WebGlLayer.prototype.updateClickColor = function () {
        if (this.moving == true || this.closestIndex == null || this.closestIndex == -1)
            return;

        var curVertArr = this.vertArray;
        if (this.layerShow == "L2")
            curVertArr = this.vertArrayL2;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webGLData.buffer);        
        


        var idxObj = this.verticesIndex[this.closestIndex];
        var rR = Math.random();
        var rG = Math.random();
        var rB = Math.random();
        for (var i = idxObj.startIdx; i < idxObj.endIdx; i += 6) {
            curVertArr[i + 2] = rR;
            curVertArr[i + 3] = rG;
            curVertArr[i + 4] = rB;
        }       

        //this.vertArray = new Float32Array(this.webGLData.points);
        var fsize = curVertArr.BYTES_PER_ELEMENT;

        // -- set up vertext offset
        this.gl.bufferData(this.gl.ARRAY_BUFFER, curVertArr, this.gl.STATIC_DRAW);
        var vertLoc = this.gl.getAttribLocation(this.program, "a_vertex");
        this.gl.vertexAttribPointer(vertLoc, 2, this.gl.FLOAT, false, fsize * 6, 0);
        this.gl.enableVertexAttribArray(vertLoc);

        // -- offset for color buffer
        var colorLoc = this.gl.getAttribLocation(this.program, "a_color");
        this.gl.vertexAttribPointer(colorLoc, 4, this.gl.FLOAT, false, fsize * 6, fsize * 2);
        this.gl.enableVertexAttribArray(colorLoc);

        this.numPoints = this.webGLData.points.length / 6;
        this.glLayer.redraw();
    }

    WebGlLayer.prototype.updateColors = function () {
        if (this.moving == true)
            return;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webGLData.buffer);

        var curVertArr = this.vertArray;
        if (this.layerShow == "L2")
            curVertArr = this.vertArrayL2;

        var curIdx = this.measIdx;

        var maxMeas = 100;

        for (var idxL in this.verticesIndex)
        {
            var idxObj = this.verticesIndex[idxL];
            var idx = idxObj.index;
            
            
            //var meanNodeVal = Math.average.apply(null, this.data.features[idx].measurements);
            var length = this.data.features[idx].properties["LENGTH"];
            var maxSpeed = this.data.features[idx].properties["FR_SPD_LIM"];
            var maxNodeVal = maxSpeed; //  Math.max.apply(null, this.data.features[idx].measurements);
            var minNodeVal = 0; // Math.min.apply(null, this.data.features[idx].measurements);
            //if (maxNodeVal != -1)
            //    maxMeas = Math.min(meanNodeVal * 2, maxNodeVal);
            var measVal = this.data.features[idx].properties["SPEED"]; //this.data.features[idx].measurements[curIdx];
            var rR = 0.5;
            var rG = 0.5;
            var rB = 0.5;

            if (measVal != -1)
            {
                measVal = length / measVal * 3.6;
                if(maxNodeVal == minNodeVal)
                    maxNodeVal += 1;
                /*var rgLev = maxMeas - measVal;
                if (rgLev <= 0)
                    rgLev = 1;
                if (rgLev > maxMeas)
                    rgLev = maxMeas;*/

                rB = 0.0;
                rR = (maxNodeVal - measVal) / (maxNodeVal - minNodeVal);
                if (rR < 0)
                    rR = 0;
                if (rR > 1)
                    rR = 1;
                rG = 1 - rR;
            }

            /*var rR = Math.random();
            var rG = Math.random();
            var rB = Math.random();*/

            for(var i = idxObj.startIdx; i < idxObj.endIdx; i += 6)
            {
                curVertArr[i + 2] = rR;
                curVertArr[i + 3] = rG;
                curVertArr[i + 4] = rB;
            }
        }

        //this.vertArray = new Float32Array(this.webGLData.points);
        var fsize = this.vertArray.BYTES_PER_ELEMENT;

        // -- set up vertext offset
        this.gl.bufferData(this.gl.ARRAY_BUFFER, curVertArr, this.gl.STATIC_DRAW);
        var vertLoc = this.gl.getAttribLocation(this.program, "a_vertex");
        this.gl.vertexAttribPointer(vertLoc, 2, this.gl.FLOAT, false, fsize * 6, 0);
        this.gl.enableVertexAttribArray(vertLoc);

        // -- offset for color buffer
        var colorLoc = this.gl.getAttribLocation(this.program, "a_color");
        this.gl.vertexAttribPointer(colorLoc, 4, this.gl.FLOAT, false, fsize * 6, fsize * 2);
        this.gl.enableVertexAttribArray(colorLoc);

        this.numPoints = this.webGLData.points.length / 6;
        this.glLayer.redraw();
        var nrSecs = this.measIdx % 60;
        var nrSecsStr = (nrSecs < 10) ? "0" + nrSecs : nrSecs;
        var timeStr = Math.floor(this.measIdx / 60) + ":" + nrSecsStr;
        $("#litTime").text("Tijd : " + timeStr);
        this.measIdx += 1;
        if(this.measIdx >= this.maxMeasIdx)
            this.measIdx = 0;
    }

    WebGlLayer.prototype.updateDraw = function () {
        // -- data
        // Perf test
        var coords = new Array();
        var colors = new Array();

        PIXI.hex2rgb = function (hex) {
            return [(hex >> 16 & 0xFF) / 255, (hex >> 8 & 0xFF) / 255, (hex & 0xFF) / 255];
        };
        
        // --  buffer (vertex + color interleaved)
        
        var buf = this.gl.createBuffer();
                
        var rawVerts = [];

        //-- verts only
        this.webGLData = {
            points: [],
            indices: [],
            buffer: []
        };

        this.webGLDataL2 = {
            points: [],
            indices: [],
            buffer: []
        };
        this.webGLData.buffer = buf;
        this.webGLDataL2.buffer = buf;

        this.verticesIndex = new Array();
        var lastVerts = [];

        var graphicsData = {
            points: verts,
            lineWidth: 0.0001,
            lineColor: 0xFF0000, //Math.random() * 0xFFFFFF << 0, // 0xFF0000
            lineAlpha: 1.0
        };
        var graphicsDataL2 = {
            points: verts,
            lineWidth: 0.0010,
            lineColor: 0xFF0000, //Math.random() * 0xFFFFFF << 0, // 0xFF0000
            lineAlpha: 1.0
        };
        for (var i = 0; i < this.data.features.length; i++) { // .geometry.coordinates.length; i++) {
            var vertsInv = [];
            var verts = [];
            // Read index from properties file
            // Store start index : this.webGLData.points.length
            var linkId = this.data.features[i].properties.LINK_ID;
            var startIdx = this.webGLData.points.length;
            this.verticesIndex[linkId] = new Object();
            this.verticesIndex[linkId].startIdx = startIdx;
            this.verticesIndex[linkId].index = i;
            for (var j = 0; j < this.data.features[i].geometry.coordinates.length; j++) {
                var d = this.data.features[i].geometry.coordinates[j];
                
                var pixel = this.LatLongToPixelXY(d[1], d[0]); 
                verts.push(pixel.x, pixel.y);
                
                // -- from pixi/utils
                var webGLData2 = {
                    points: [],
                    indices: []
                };
                if (verts.length > 3) {
                                       
                    graphicsData.points = verts;
                    PIXI.WebGLGraphics.buildLine(graphicsData, webGLData2);

                    for (var ptIdx in webGLData2.points) {
                        this.webGLData.points.push(webGLData2.points[ptIdx]);
                    }

                    graphicsDataL2.points = verts;
                    webGLData2 = {
                        points: [],
                        indices: []
                    };

                    for (var ptIdx in webGLData2.indices) {
                        this.webGLData.indices.push(webGLData2.indices[ptIdx]);
                    }

                    PIXI.WebGLGraphics.buildLine(graphicsDataL2, webGLData2);

                    for (var ptIdx in webGLData2.points) {
                        this.webGLDataL2.points.push(webGLData2.points[ptIdx]);
                    }

                    for (var ptIdx in webGLData2.indices) {
                        this.webGLDataL2.indices.push(webGLData2.indices[ptIdx]);
                    }

                    ///webGLData.indices = webGLData.indices.concat(webGLData2.indices);
                    verts.shift();
                    verts.shift();
                }
                else if (lastVerts.length > 1) {
                    vertsInv.push(lastVerts[0], lastVerts[1]);
                    vertsInv.push(pixel.x, pixel.y);
                    var graphicsData2 = {
                        points: vertsInv,
                        lineWidth: 0.0000055,
                        lineColor: 0xFFFFFF, //Math.random() * 0xFFFFFF << 0,
                        lineAlpha: 0.0
                    };
                    
                    PIXI.WebGLGraphics.buildLine(graphicsData2, webGLData2);

                    for (var ptIdx in webGLData2.points) {
                        this.webGLData.points.push(webGLData2.points[ptIdx]);
                    }

                    for (var ptIdx in webGLData2.indices) {
                        this.webGLData.indices.push(webGLData2.indices[ptIdx]);
                    }

                    for (var ptIdx in webGLData2.points) {
                        this.webGLDataL2.points.push(webGLData2.points[ptIdx]);
                    }

                    for (var ptIdx in webGLData2.indices) {
                        this.webGLDataL2.indices.push(webGLData2.indices[ptIdx]);
                    }
                }
                lastVerts[0] = pixel.x;
                lastVerts[1] = pixel.y;
            }
            var endIdx = this.webGLData.points.length - 1;
            this.verticesIndex[linkId].endIdx = endIdx;
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webGLData.buffer);

        this.vertArray = new Float32Array(this.webGLData.points);
        this.vertArrayL2 = new Float32Array(this.webGLDataL2.points);
        var fsize = this.vertArray.BYTES_PER_ELEMENT;

        // -- set up vertext offset
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertArray, this.gl.STATIC_DRAW);
        var vertLoc = this.gl.getAttribLocation(this.program, "a_vertex");
        this.gl.vertexAttribPointer(vertLoc, 2, this.gl.FLOAT, false, fsize * 6, 0); 
        this.gl.enableVertexAttribArray(vertLoc);

        // -- offset for color buffer
        var colorLoc = this.gl.getAttribLocation(this.program, "a_color");
        this.gl.vertexAttribPointer(colorLoc, 4, this.gl.FLOAT, false, fsize * 6, fsize * 2);
        this.gl.enableVertexAttribArray(colorLoc);

        this.numPoints = this.webGLData.points.length / 6;
        this.glLayer.redraw();       
        

        // tirangles or point count
        //var numPoints = verts.length / 2;
        this.handleFiltered(null);
    };

    WebGlLayer.prototype.drawingOnCanvas = function (canvasOverlay, params) {
        if (webGlObj.gl == null)
            return;

        webGlObj.gl.clear(webGlObj.gl.COLOR_BUFFER_BIT);

        webGlObj.pixelsToWebGLMatrix.set([2 / webGlObj.canvas.width, 0, 0, 0, 0, -2 / webGlObj.canvas.height, 0, 0, 0, 0, 0, 0, -1, 1, 0, 1]);
        webGlObj.gl.viewport(0, 0, webGlObj.canvas.width, webGlObj.canvas.height);

        var pointSize = Math.max(webGlObj.leafletMap.getZoom() - 4.0, 1.0);
        webGlObj.gl.vertexAttrib1f(webGlObj.gl.aPointSize, pointSize);

        // -- set base matrix to translate canvas pixel coordinates -> webgl coordinates
        webGlObj.mapMatrix.set(webGlObj.pixelsToWebGLMatrix);

        var bounds = webGlObj.leafletMap.getBounds();
        var topLeft = new L.LatLng(bounds.getNorth(), bounds.getWest());
        var offset = webGlObj.LatLongToPixelXY(topLeft.lat, topLeft.lng);

        // -- Scale to current zoom
        var scale = Math.pow(2, webGlObj.leafletMap.getZoom());
        webGlObj.scaleMatrix(webGlObj.mapMatrix, scale, scale);

        webGlObj.translateMatrix(webGlObj.mapMatrix, -offset.x, -offset.y);

        // -- attach matrix value to 'mapMatrix' uniform in shader
        webGlObj.gl.uniformMatrix4fv(webGlObj.u_matLoc, false, webGlObj.mapMatrix);

        webGlObj.gl.drawArrays(webGlObj.gl.TRIANGLE_STRIP, 0, webGlObj.numPoints);
    };

    WebGlLayer.prototype.colorToHex = function (color) {
        if (color.substr(0, 1) === '#') {
            return color;
        }
        var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

        var red = parseInt(digits[2]);
        var green = parseInt(digits[3]);
        var blue = parseInt(digits[4]);

        var rgb = blue | (green << 8) | (red << 16);
        return digits[1] + '#' + rgb.toString(16);
    };

    // Returns a random integer from 0 to range - 1.
    WebGlLayer.prototype.randomInt = function (range) {
        return Math.floor(Math.random() * range);
    };

    /*
    function latlonToPixels(lat, lon) {
    initialResolution = 2 * Math.PI * 6378137 / 256, // at zoomlevel 0
    originShift = 2 * Math.PI * 6378137 / 2;
    
    // -- to meters
    var mx = lon * originShift / 180;
    var my = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
    my = my * originShift / 180;
    
    
    // -- to pixels at zoom level 0
    
    var res = initialResolution;
    x = (mx + originShift) / res,
    y = (my + originShift) / res;
    
    
    return { x: x, y: 256- y };
    }
    */
    // -- converts latlon to pixels at zoom level 0 (for 256x256 tile size) , inverts y coord )
    // -- source : http://build-failed.blogspot.cz/2013/02/displaying-webgl-data-on-google-maps.html
    WebGlLayer.prototype.LatLongToPixelXY = function (latitude, longitude) {
        var pi_180 = Math.PI / 180.0;
        var pi_4 = Math.PI * 4;
        var sinLatitude = Math.sin(latitude * pi_180);
        var pixelY = (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (pi_4)) * 256;
        var pixelX = ((longitude + 180) / 360) * 256;

        var pixel = { x: pixelX, y: pixelY };

        return pixel;
    };

    WebGlLayer.prototype.translateMatrix = function (matrix, tx, ty) {
        // translation is in last column of matrix
        matrix[12] += matrix[0] * tx + matrix[4] * ty;
        matrix[13] += matrix[1] * tx + matrix[5] * ty;
        matrix[14] += matrix[2] * tx + matrix[6] * ty;
        matrix[15] += matrix[3] * tx + matrix[7] * ty;
    };

    WebGlLayer.prototype.scaleMatrix = function (matrix, scaleX, scaleY) {
        // scaling x and y, which is just scaling first two columns of matrix
        matrix[0] *= scaleX;
        matrix[1] *= scaleX;
        matrix[2] *= scaleX;
        matrix[3] *= scaleX;

        matrix[4] *= scaleY;
        matrix[5] *= scaleY;
        matrix[6] *= scaleY;
        matrix[7] *= scaleY;
    };
    return WebGlLayer;
})();
//# sourceMappingURL=WebGlView.js.map

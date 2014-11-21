var webGlObj = null;

var WebGlLayer = (function () {
    function WebGlLayer(lmap, jsonObj, options) {
            //this.webGLData = 
            this.leafletMap = lmap;
            this.data = {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[-77.066104, 38.910203], [-77.066106, 38.910321], [-77.066112, 38.910758], [-77.065249, 38.910775], [-77.065178, 38.910793], [-77.065139, 38.910804], [-77.064904, 38.91036], [-77.064855, 38.910268], [-77.064621, 38.909825], [-77.06459, 38.909766], [-77.064342, 38.909298], [-77.064281, 38.909182], [-77.064201, 38.909226], [-77.064175, 38.909235], [-77.064149, 38.909241], [-77.064122, 38.909244], [-77.06336, 38.90926], [-77.061442, 38.909288], [-77.060801, 38.909297], [-77.059237, 38.909315], [-77.058186, 38.90933], [-77.057113, 38.909343], [-77.055623, 38.909368], [-77.054762, 38.909377], [-77.053951, 38.909389], [-77.053904, 38.909393], [-77.053858, 38.909399], [-77.053813, 38.909408], [-77.052833, 38.909635], [-77.052799, 38.909642], [-77.052772, 38.909645], [-77.052692, 38.90965], [-77.052443, 38.909649], [-77.05096, 38.909639], [-77.050327, 38.909634], [-77.049545, 38.909631], [-77.049533, 38.909635], [-77.049341, 38.909635], [-77.048903, 38.909635], [-77.048797, 38.909634], [-77.04773, 38.909639], [-77.046632, 38.90964], [-77.045758, 38.909641], [-77.044877, 38.909643], [-77.044578, 38.909641], [-77.044493, 38.909635], [-77.04442, 38.909626], [-77.044345, 38.909608], [-77.044283, 38.909578], [-77.044249, 38.909541], [-77.044212, 38.909496], [-77.044199, 38.909458], [-77.044182, 38.909421], [-77.044162, 38.909385], [-77.04414, 38.90935], [-77.044113, 38.909313], [-77.044083, 38.90928], [-77.044051, 38.909247], [-77.044018, 38.909165], [-77.044018, 38.909117], [-77.044029, 38.909071], [-77.044037, 38.909038], [-77.044058, 38.908981], [-77.043996, 38.909021], [-77.043919, 38.909052], [-77.043854, 38.909067], [-77.043798, 38.909073], [-77.043755, 38.909075], [-77.043689, 38.909056], [-77.043656, 38.909048], [-77.04359, 38.909036], [-77.043527, 38.909028], [-77.043486, 38.909026], [-77.043444, 38.909025], [-77.043402, 38.909026], [-77.043344, 38.909029], [-77.043286, 38.909037], [-77.043263, 38.909041], [-77.04323, 38.909047], [-77.043194, 38.909056], [-77.043022, 38.909118], [-77.042995, 38.909132], [-77.04296, 38.909151], [-77.042938, 38.909165], [-77.042915, 38.90918], [-77.042875, 38.909209], [-77.04284, 38.909239], [-77.042823, 38.909255], [-77.042791, 38.909288], [-77.042774, 38.909307], [-77.042712, 38.909315], [-77.042637, 38.909322], [-77.042551, 38.909317], [-77.042422, 38.909299], [-77.041676, 38.90903], [-77.039935, 38.908425], [-77.038503, 38.907925], [-77.037656, 38.907632], [-77.037477, 38.907534], [-77.037317, 38.907438], [-77.037238, 38.90739], [-77.037121, 38.907315], [-77.036997, 38.907233], [-77.036875, 38.907137], [-77.036833, 38.907094], [-77.036817, 38.907081], [-77.036795, 38.907068], [-77.036774, 38.907058], [-77.036767, 38.907052], [-77.036712, 38.907034], [-77.03669, 38.907028], [-77.036643, 38.907022], [-77.03661, 38.907021], [-77.03653, 38.907021], [-77.036474, 38.907021], [-77.03643, 38.907025], [-77.03639, 38.907033], [-77.036295, 38.907058], [-77.036005, 38.906995], [-77.035439, 38.906869], [-77.035142, 38.906757], [-77.035049, 38.906725], [-77.0348, 38.906641], [-77.034673, 38.906594], [-77.034568, 38.906558], [-77.034059, 38.906382], [-77.033931, 38.906338], [-77.032623, 38.905883], [-77.03129, 38.905426], [-77.030031, 38.904982], [-77.029623, 38.904835], [-77.028082, 38.904304], [-77.027679, 38.904167], [-77.02705, 38.903949], [-77.026409, 38.903729], [-77.025984, 38.903579], [-77.024321, 38.902997], [-77.024139, 38.902954], [-77.023952, 38.902954], [-77.023188, 38.902956], [-77.022699, 38.902958], [-77.021917, 38.90296], [-77.021918, 38.902902], [-77.021918, 38.902521], [-77.019907, 38.902521], [-77.018928, 38.902521], [-77.016176, 38.902519], [-77.015177, 38.902518], [-77.013722, 38.902514], [-77.012171, 38.902516], [-77.011237, 38.902516], [-77.009846, 38.902515], [-77.009117, 38.902514], [-77.009126, 38.901346], [-77.00912, 38.900203], [-77.009062, 38.900203], [-77.008975, 38.900203], [-77.008004, 38.900198], [-77.00631, 38.900193], [-77.005531, 38.900197], [-77.002929, 38.9002], [-77.002038, 38.900203], [-77.001892, 38.900203], [-77.000571, 38.900205], [-76.999507, 38.900204], [-76.998442, 38.900204], [-76.998369, 38.900204], [-76.996167, 38.900205], [-76.994961, 38.900203], [-76.994962, 38.899748], [-76.994961, 38.899626], [-76.994961, 38.899367], [-76.994961, 38.898908], [-76.994962, 38.898447]]
                },
                "properties": {
                    "name": "P Street Northwest - Massachusetts Avenue Northwest"
                }
            };
            //this.moving = false;

            

        //this.data.geometry.coordinates = jsonObj.features[0].geometry.coordinates;
            this.data = jsonObj;
            this.measIdx = 0;
            this.maxMeasIdx = jsonObj.features[0].measurements.length;

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
                if (webGlObj.leafletMap.getZoom() > 14)
                    webGlObj.layerShow = "L1";
                else
                    webGlObj.layerShow = "L2";
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

        for (var idx in this.verticesIndex)
        {
            var idxObj = this.verticesIndex[idx];
            //var meanNodeVal = Math.average.apply(null, this.data.features[idx].measurements);
            var length = this.data.features[idx].properties["LENGTH"];
            var maxSpeed = this.data.features[idx].properties["FR_SPD_LIM"];
            var maxNodeVal = maxSpeed; //  Math.max.apply(null, this.data.features[idx].measurements);
            var minNodeVal = 0; // Math.min.apply(null, this.data.features[idx].measurements);
            //if (maxNodeVal != -1)
            //    maxMeas = Math.min(meanNodeVal * 2, maxNodeVal);
            var measVal = this.data.features[idx].measurements[curIdx];
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
                rR = (maxNodeVal - measVal) / ( maxNodeVal - minNodeVal );
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

        var baseCoord = [4.377619882381939, 51.917897027621706];

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
            lineWidth: 0.00015,
            lineColor: Math.random() * 0xFFFFFF << 0, // 0xFF0000
            lineAlpha: 1.0
        };
        var graphicsDataL2 = {
            points: verts,
            lineWidth: 0.0010,
            lineColor: Math.random() * 0xFFFFFF << 0, // 0xFF0000
            lineAlpha: 1.0
        };
        for (var i = 0; i < this.data.features.length; i++) { // .geometry.coordinates.length; i++) {
            var vertsInv = [];
            var verts = [];
            // Read index from properties file
            // Store start index : this.webGLData.points.length
            
            var startIdx = this.webGLData.points.length;
            this.verticesIndex[i] = new Object();
            this.verticesIndex[i].startIdx = startIdx;
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
            this.verticesIndex[i].endIdx = endIdx;
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

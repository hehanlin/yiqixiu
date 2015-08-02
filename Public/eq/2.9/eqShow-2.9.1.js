/**
 * eqShow - v2.9.1 - 2015-04-10
 *
 *
 * Copyright (c) 2015
 * Licensed MIT <>
 */
!function (a, b, c) {
    function d(a) {
        this.mode = j.MODE_8BIT_BYTE, this.data = a
    }

    function e(a, b) {
        this.typeNumber = a, this.errorCorrectLevel = b, this.modules = null, this.moduleCount = 0, this.dataCache = null, this.dataList = new Array
    }

    function f(a, b) {
        if (a.length == c)throw new Error(a.length + "/" + b);
        for (var d = 0; d < a.length && 0 == a[d];)d++;
        this.num = new Array(a.length - d + b);
        for (var e = 0; e < a.length - d; e++)this.num[e] = a[e + d]
    }

    function g(a, b) {
        this.totalCount = a, this.dataCount = b
    }

    function h() {
        this.buffer = new Array, this.length = 0
    }

    function i(a) {
        for (var b = 0, c = 0; c < a.length; c++) {
            var d = a.charCodeAt(c);
            d >= 1 && 126 >= d || d >= 65376 && 65439 >= d ? b++ : b += 2
        }
        return b
    }

    !function (a, b) {
        function c(a) {
            function b(a, b, c) {
                return a[b] || (a[b] = c())
            }

            var c = b(a, "eqShow", Object);
            return b(c, "templateParser", function () {
                var a = {};
                return function (c, d) {
                    if ("hasOwnProperty" === c)throw new Error("hasOwnProperty is not a valid name");
                    return d && a.hasOwnProperty(c) && (a[c] = null), b(a, c, d)
                }
            })
        }

        function d(b) {
            templateParser = c(a)
        }

        var e = a.eqShow || (a.eqShow = {});
        d(e)
    }(a, document), function (a) {
        a.fn.qrcode = function (b) {
            "string" == typeof b && (b = {text: b}), b = a.extend({}, {render: "canvas", width: 256, height: 256, typeNumber: -1, correctLevel: k.H, background: "#ffffff", foreground: "#000000"}, b);
            var c = function () {
                var a = new e(b.typeNumber, b.correctLevel);
                a.addData(b.text), a.make();
                var c = document.createElement("canvas");
                c.width = b.width, c.height = b.height;
                for (var d = c.getContext("2d"), f = b.width / a.getModuleCount(), g = b.height / a.getModuleCount(), h = 0; h < a.getModuleCount(); h++)for (var i = 0; i < a.getModuleCount(); i++) {
                    d.fillStyle = a.isDark(h, i) ? b.foreground : b.background;
                    var j = Math.ceil((i + 1) * f) - Math.floor(i * f), k = Math.ceil((h + 1) * f) - Math.floor(h * f);
                    d.fillRect(Math.round(i * f), Math.round(h * g), j, k)
                }
                return c
            }, d = function () {
                var c = new e(b.typeNumber, b.correctLevel);
                c.addData(b.text), c.make();
                for (var d = a("<table></table>").css("width", b.width + "px").css("height", b.height + "px").css("border", "0px").css("border-collapse", "collapse").css("background-color", b.background), f = b.width / c.getModuleCount(), g = b.height / c.getModuleCount(), h = 0; h < c.getModuleCount(); h++)for (var i = a("<tr></tr>").css("height", g + "px").appendTo(d), j = 0; j < c.getModuleCount(); j++)a("<td></td>").css("width", f + "px").css("background-color", c.isDark(h, j) ? b.foreground : b.background).appendTo(i);
                return d
            };
            return this.each(function () {
                var e = "canvas" == b.render ? c() : d();
                a(e).appendTo(this)
            })
        }
    }(jQuery), d.prototype = {getLength: function (a) {
        return this.data.length
    }, write: function (a) {
        for (var b = 0; b < this.data.length; b++)a.put(this.data.charCodeAt(b), 8)
    }}, e.prototype = {addData: function (a) {
        var b = new d(a);
        this.dataList.push(b), this.dataCache = null
    }, isDark: function (a, b) {
        if (0 > a || this.moduleCount <= a || 0 > b || this.moduleCount <= b)throw new Error(a + "," + b);
        return this.modules[a][b]
    }, getModuleCount: function () {
        return this.moduleCount
    }, make: function () {
        if (this.typeNumber < 1) {
            var a = 1;
            for (a = 1; 40 > a; a++) {
                for (var b = g.getRSBlocks(a, this.errorCorrectLevel), c = new h, d = 0, e = 0; e < b.length; e++)d += b[e].dataCount;
                for (var e = 0; e < this.dataList.length; e++) {
                    var f = this.dataList[e];
                    c.put(f.mode, 4), c.put(f.getLength(), m.getLengthInBits(f.mode, a)), f.write(c)
                }
                if (c.getLengthInBits() <= 8 * d)break
            }
            this.typeNumber = a
        }
        this.makeImpl(!1, this.getBestMaskPattern())
    }, makeImpl: function (a, b) {
        this.moduleCount = 4 * this.typeNumber + 17, this.modules = new Array(this.moduleCount);
        for (var c = 0; c < this.moduleCount; c++) {
            this.modules[c] = new Array(this.moduleCount);
            for (var d = 0; d < this.moduleCount; d++)this.modules[c][d] = null
        }
        this.setupPositionProbePattern(0, 0), this.setupPositionProbePattern(this.moduleCount - 7, 0), this.setupPositionProbePattern(0, this.moduleCount - 7), this.setupPositionAdjustPattern(), this.setupTimingPattern(), this.setupTypeInfo(a, b), this.typeNumber >= 7 && this.setupTypeNumber(a), null == this.dataCache && (this.dataCache = e.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)), this.mapData(this.dataCache, b)
    }, setupPositionProbePattern: function (a, b) {
        for (var c = -1; 7 >= c; c++)if (!(-1 >= a + c || this.moduleCount <= a + c))for (var d = -1; 7 >= d; d++)-1 >= b + d || this.moduleCount <= b + d || (this.modules[a + c][b + d] = c >= 0 && 6 >= c && (0 == d || 6 == d) || d >= 0 && 6 >= d && (0 == c || 6 == c) || c >= 2 && 4 >= c && d >= 2 && 4 >= d ? !0 : !1)
    }, getBestMaskPattern: function () {
        for (var a = 0, b = 0, c = 0; 8 > c; c++) {
            this.makeImpl(!0, c);
            var d = m.getLostPoint(this);
            (0 == c || a > d) && (a = d, b = c)
        }
        return b
    }, createMovieClip: function (a, b, c) {
        var d = a.createEmptyMovieClip(b, c), e = 1;
        this.make();
        for (var f = 0; f < this.modules.length; f++)for (var g = f * e, h = 0; h < this.modules[f].length; h++) {
            var i = h * e, j = this.modules[f][h];
            j && (d.beginFill(0, 100), d.moveTo(i, g), d.lineTo(i + e, g), d.lineTo(i + e, g + e), d.lineTo(i, g + e), d.endFill())
        }
        return d
    }, setupTimingPattern: function () {
        for (var a = 8; a < this.moduleCount - 8; a++)null == this.modules[a][6] && (this.modules[a][6] = a % 2 == 0);
        for (var b = 8; b < this.moduleCount - 8; b++)null == this.modules[6][b] && (this.modules[6][b] = b % 2 == 0)
    }, setupPositionAdjustPattern: function () {
        for (var a = m.getPatternPosition(this.typeNumber), b = 0; b < a.length; b++)for (var c = 0; c < a.length; c++) {
            var d = a[b], e = a[c];
            if (null == this.modules[d][e])for (var f = -2; 2 >= f; f++)for (var g = -2; 2 >= g; g++)this.modules[d + f][e + g] = -2 == f || 2 == f || -2 == g || 2 == g || 0 == f && 0 == g ? !0 : !1
        }
    }, setupTypeNumber: function (a) {
        for (var b = m.getBCHTypeNumber(this.typeNumber), c = 0; 18 > c; c++) {
            var d = !a && 1 == (b >> c & 1);
            this.modules[Math.floor(c / 3)][c % 3 + this.moduleCount - 8 - 3] = d
        }
        for (var c = 0; 18 > c; c++) {
            var d = !a && 1 == (b >> c & 1);
            this.modules[c % 3 + this.moduleCount - 8 - 3][Math.floor(c / 3)] = d
        }
    }, setupTypeInfo: function (a, b) {
        for (var c = this.errorCorrectLevel << 3 | b, d = m.getBCHTypeInfo(c), e = 0; 15 > e; e++) {
            var f = !a && 1 == (d >> e & 1);
            6 > e ? this.modules[e][8] = f : 8 > e ? this.modules[e + 1][8] = f : this.modules[this.moduleCount - 15 + e][8] = f
        }
        for (var e = 0; 15 > e; e++) {
            var f = !a && 1 == (d >> e & 1);
            8 > e ? this.modules[8][this.moduleCount - e - 1] = f : 9 > e ? this.modules[8][15 - e - 1 + 1] = f : this.modules[8][15 - e - 1] = f
        }
        this.modules[this.moduleCount - 8][8] = !a
    }, mapData: function (a, b) {
        for (var c = -1, d = this.moduleCount - 1, e = 7, f = 0, g = this.moduleCount - 1; g > 0; g -= 2)for (6 == g && g--; ;) {
            for (var h = 0; 2 > h; h++)if (null == this.modules[d][g - h]) {
                var i = !1;
                f < a.length && (i = 1 == (a[f] >>> e & 1));
                var j = m.getMask(b, d, g - h);
                j && (i = !i), this.modules[d][g - h] = i, e--, -1 == e && (f++, e = 7)
            }
            if (d += c, 0 > d || this.moduleCount <= d) {
                d -= c, c = -c;
                break
            }
        }
    }}, e.PAD0 = 236, e.PAD1 = 17, e.createData = function (a, b, c) {
        for (var d = g.getRSBlocks(a, b), f = new h, i = 0; i < c.length; i++) {
            var j = c[i];
            f.put(j.mode, 4), f.put(j.getLength(), m.getLengthInBits(j.mode, a)), j.write(f)
        }
        for (var k = 0, i = 0; i < d.length; i++)k += d[i].dataCount;
        if (f.getLengthInBits() > 8 * k)throw new Error("code length overflow. (" + f.getLengthInBits() + ">" + 8 * k + ")");
        for (f.getLengthInBits() + 4 <= 8 * k && f.put(0, 4); f.getLengthInBits() % 8 != 0;)f.putBit(!1);
        for (; ;) {
            if (f.getLengthInBits() >= 8 * k)break;
            if (f.put(e.PAD0, 8), f.getLengthInBits() >= 8 * k)break;
            f.put(e.PAD1, 8)
        }
        return e.createBytes(f, d)
    }, e.createBytes = function (a, b) {
        for (var c = 0, d = 0, e = 0, g = new Array(b.length), h = new Array(b.length), i = 0; i < b.length; i++) {
            var j = b[i].dataCount, k = b[i].totalCount - j;
            d = Math.max(d, j), e = Math.max(e, k), g[i] = new Array(j);
            for (var l = 0; l < g[i].length; l++)g[i][l] = 255 & a.buffer[l + c];
            c += j;
            var n = m.getErrorCorrectPolynomial(k), o = new f(g[i], n.getLength() - 1), p = o.mod(n);
            h[i] = new Array(n.getLength() - 1);
            for (var l = 0; l < h[i].length; l++) {
                var q = l + p.getLength() - h[i].length;
                h[i][l] = q >= 0 ? p.get(q) : 0
            }
        }
        for (var r = 0, l = 0; l < b.length; l++)r += b[l].totalCount;
        for (var s = new Array(r), t = 0, l = 0; d > l; l++)for (var i = 0; i < b.length; i++)l < g[i].length && (s[t++] = g[i][l]);
        for (var l = 0; e > l; l++)for (var i = 0; i < b.length; i++)l < h[i].length && (s[t++] = h[i][l]);
        return s
    };
    for (var j = {MODE_NUMBER: 1, MODE_ALPHA_NUM: 2, MODE_8BIT_BYTE: 4, MODE_KANJI: 8}, k = {L: 1, M: 0, Q: 3, H: 2}, l = {PATTERN000: 0, PATTERN001: 1, PATTERN010: 2, PATTERN011: 3, PATTERN100: 4, PATTERN101: 5, PATTERN110: 6, PATTERN111: 7}, m = {PATTERN_POSITION_TABLE: [
        [],
        [6, 18],
        [6, 22],
        [6, 26],
        [6, 30],
        [6, 34],
        [6, 22, 38],
        [6, 24, 42],
        [6, 26, 46],
        [6, 28, 50],
        [6, 30, 54],
        [6, 32, 58],
        [6, 34, 62],
        [6, 26, 46, 66],
        [6, 26, 48, 70],
        [6, 26, 50, 74],
        [6, 30, 54, 78],
        [6, 30, 56, 82],
        [6, 30, 58, 86],
        [6, 34, 62, 90],
        [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98],
        [6, 30, 54, 78, 102],
        [6, 28, 54, 80, 106],
        [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114],
        [6, 34, 62, 90, 118],
        [6, 26, 50, 74, 98, 122],
        [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130],
        [6, 30, 56, 82, 108, 134],
        [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142],
        [6, 34, 62, 90, 118, 146],
        [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154],
        [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166],
        [6, 30, 58, 86, 114, 142, 170]
    ], G15: 1335, G18: 7973, G15_MASK: 21522, getBCHTypeInfo: function (a) {
        for (var b = a << 10; m.getBCHDigit(b) - m.getBCHDigit(m.G15) >= 0;)b ^= m.G15 << m.getBCHDigit(b) - m.getBCHDigit(m.G15);
        return(a << 10 | b) ^ m.G15_MASK
    }, getBCHTypeNumber: function (a) {
        for (var b = a << 12; m.getBCHDigit(b) - m.getBCHDigit(m.G18) >= 0;)b ^= m.G18 << m.getBCHDigit(b) - m.getBCHDigit(m.G18);
        return a << 12 | b
    }, getBCHDigit: function (a) {
        for (var b = 0; 0 != a;)b++, a >>>= 1;
        return b
    }, getPatternPosition: function (a) {
        return m.PATTERN_POSITION_TABLE[a - 1]
    }, getMask: function (a, b, c) {
        switch (a) {
            case l.PATTERN000:
                return(b + c) % 2 == 0;
            case l.PATTERN001:
                return b % 2 == 0;
            case l.PATTERN010:
                return c % 3 == 0;
            case l.PATTERN011:
                return(b + c) % 3 == 0;
            case l.PATTERN100:
                return(Math.floor(b / 2) + Math.floor(c / 3)) % 2 == 0;
            case l.PATTERN101:
                return b * c % 2 + b * c % 3 == 0;
            case l.PATTERN110:
                return(b * c % 2 + b * c % 3) % 2 == 0;
            case l.PATTERN111:
                return(b * c % 3 + (b + c) % 2) % 2 == 0;
            default:
                throw new Error("bad maskPattern:" + a)
        }
    }, getErrorCorrectPolynomial: function (a) {
        for (var b = new f([1], 0), c = 0; a > c; c++)b = b.multiply(new f([1, n.gexp(c)], 0));
        return b
    }, getLengthInBits: function (a, b) {
        if (b >= 1 && 10 > b)switch (a) {
            case j.MODE_NUMBER:
                return 10;
            case j.MODE_ALPHA_NUM:
                return 9;
            case j.MODE_8BIT_BYTE:
                return 8;
            case j.MODE_KANJI:
                return 8;
            default:
                throw new Error("mode:" + a)
        } else if (27 > b)switch (a) {
            case j.MODE_NUMBER:
                return 12;
            case j.MODE_ALPHA_NUM:
                return 11;
            case j.MODE_8BIT_BYTE:
                return 16;
            case j.MODE_KANJI:
                return 10;
            default:
                throw new Error("mode:" + a)
        } else {
            if (!(41 > b))throw new Error("type:" + b);
            switch (a) {
                case j.MODE_NUMBER:
                    return 14;
                case j.MODE_ALPHA_NUM:
                    return 13;
                case j.MODE_8BIT_BYTE:
                    return 16;
                case j.MODE_KANJI:
                    return 12;
                default:
                    throw new Error("mode:" + a)
            }
        }
    }, getLostPoint: function (a) {
        for (var b = a.getModuleCount(), c = 0, d = 0; b > d; d++)for (var e = 0; b > e; e++) {
            for (var f = 0, g = a.isDark(d, e), h = -1; 1 >= h; h++)if (!(0 > d + h || d + h >= b))for (var i = -1; 1 >= i; i++)0 > e + i || e + i >= b || (0 != h || 0 != i) && g == a.isDark(d + h, e + i) && f++;
            f > 5 && (c += 3 + f - 5)
        }
        for (var d = 0; b - 1 > d; d++)for (var e = 0; b - 1 > e; e++) {
            var j = 0;
            a.isDark(d, e) && j++, a.isDark(d + 1, e) && j++, a.isDark(d, e + 1) && j++, a.isDark(d + 1, e + 1) && j++, (0 == j || 4 == j) && (c += 3)
        }
        for (var d = 0; b > d; d++)for (var e = 0; b - 6 > e; e++)a.isDark(d, e) && !a.isDark(d, e + 1) && a.isDark(d, e + 2) && a.isDark(d, e + 3) && a.isDark(d, e + 4) && !a.isDark(d, e + 5) && a.isDark(d, e + 6) && (c += 40);
        for (var e = 0; b > e; e++)for (var d = 0; b - 6 > d; d++)a.isDark(d, e) && !a.isDark(d + 1, e) && a.isDark(d + 2, e) && a.isDark(d + 3, e) && a.isDark(d + 4, e) && !a.isDark(d + 5, e) && a.isDark(d + 6, e) && (c += 40);
        for (var k = 0, e = 0; b > e; e++)for (var d = 0; b > d; d++)a.isDark(d, e) && k++;
        var l = Math.abs(100 * k / b / b - 50) / 5;
        return c += 10 * l
    }}, n = {glog: function (a) {
        if (1 > a)throw new Error("glog(" + a + ")");
        return n.LOG_TABLE[a]
    }, gexp: function (a) {
        for (; 0 > a;)a += 255;
        for (; a >= 256;)a -= 255;
        return n.EXP_TABLE[a]
    }, EXP_TABLE: new Array(256), LOG_TABLE: new Array(256)}, o = 0; 8 > o; o++)n.EXP_TABLE[o] = 1 << o;
    for (var o = 8; 256 > o; o++)n.EXP_TABLE[o] = n.EXP_TABLE[o - 4] ^ n.EXP_TABLE[o - 5] ^ n.EXP_TABLE[o - 6] ^ n.EXP_TABLE[o - 8];
    for (var o = 0; 255 > o; o++)n.LOG_TABLE[n.EXP_TABLE[o]] = o;
    f.prototype = {get: function (a) {
        return this.num[a]
    }, getLength: function () {
        return this.num.length
    }, multiply: function (a) {
        for (var b = new Array(this.getLength() + a.getLength() - 1), c = 0; c < this.getLength(); c++)for (var d = 0; d < a.getLength(); d++)b[c + d] ^= n.gexp(n.glog(this.get(c)) + n.glog(a.get(d)));
        return new f(b, 0)
    }, mod: function (a) {
        if (this.getLength() - a.getLength() < 0)return this;
        for (var b = n.glog(this.get(0)) - n.glog(a.get(0)), c = new Array(this.getLength()), d = 0; d < this.getLength(); d++)c[d] = this.get(d);
        for (var d = 0; d < a.getLength(); d++)c[d] ^= n.gexp(n.glog(a.get(d)) + b);
        return new f(c, 0).mod(a)
    }}, g.RS_BLOCK_TABLE = [
        [1, 26, 19],
        [1, 26, 16],
        [1, 26, 13],
        [1, 26, 9],
        [1, 44, 34],
        [1, 44, 28],
        [1, 44, 22],
        [1, 44, 16],
        [1, 70, 55],
        [1, 70, 44],
        [2, 35, 17],
        [2, 35, 13],
        [1, 100, 80],
        [2, 50, 32],
        [2, 50, 24],
        [4, 25, 9],
        [1, 134, 108],
        [2, 67, 43],
        [2, 33, 15, 2, 34, 16],
        [2, 33, 11, 2, 34, 12],
        [2, 86, 68],
        [4, 43, 27],
        [4, 43, 19],
        [4, 43, 15],
        [2, 98, 78],
        [4, 49, 31],
        [2, 32, 14, 4, 33, 15],
        [4, 39, 13, 1, 40, 14],
        [2, 121, 97],
        [2, 60, 38, 2, 61, 39],
        [4, 40, 18, 2, 41, 19],
        [4, 40, 14, 2, 41, 15],
        [2, 146, 116],
        [3, 58, 36, 2, 59, 37],
        [4, 36, 16, 4, 37, 17],
        [4, 36, 12, 4, 37, 13],
        [2, 86, 68, 2, 87, 69],
        [4, 69, 43, 1, 70, 44],
        [6, 43, 19, 2, 44, 20],
        [6, 43, 15, 2, 44, 16],
        [4, 101, 81],
        [1, 80, 50, 4, 81, 51],
        [4, 50, 22, 4, 51, 23],
        [3, 36, 12, 8, 37, 13],
        [2, 116, 92, 2, 117, 93],
        [6, 58, 36, 2, 59, 37],
        [4, 46, 20, 6, 47, 21],
        [7, 42, 14, 4, 43, 15],
        [4, 133, 107],
        [8, 59, 37, 1, 60, 38],
        [8, 44, 20, 4, 45, 21],
        [12, 33, 11, 4, 34, 12],
        [3, 145, 115, 1, 146, 116],
        [4, 64, 40, 5, 65, 41],
        [11, 36, 16, 5, 37, 17],
        [11, 36, 12, 5, 37, 13],
        [5, 109, 87, 1, 110, 88],
        [5, 65, 41, 5, 66, 42],
        [5, 54, 24, 7, 55, 25],
        [11, 36, 12],
        [5, 122, 98, 1, 123, 99],
        [7, 73, 45, 3, 74, 46],
        [15, 43, 19, 2, 44, 20],
        [3, 45, 15, 13, 46, 16],
        [1, 135, 107, 5, 136, 108],
        [10, 74, 46, 1, 75, 47],
        [1, 50, 22, 15, 51, 23],
        [2, 42, 14, 17, 43, 15],
        [5, 150, 120, 1, 151, 121],
        [9, 69, 43, 4, 70, 44],
        [17, 50, 22, 1, 51, 23],
        [2, 42, 14, 19, 43, 15],
        [3, 141, 113, 4, 142, 114],
        [3, 70, 44, 11, 71, 45],
        [17, 47, 21, 4, 48, 22],
        [9, 39, 13, 16, 40, 14],
        [3, 135, 107, 5, 136, 108],
        [3, 67, 41, 13, 68, 42],
        [15, 54, 24, 5, 55, 25],
        [15, 43, 15, 10, 44, 16],
        [4, 144, 116, 4, 145, 117],
        [17, 68, 42],
        [17, 50, 22, 6, 51, 23],
        [19, 46, 16, 6, 47, 17],
        [2, 139, 111, 7, 140, 112],
        [17, 74, 46],
        [7, 54, 24, 16, 55, 25],
        [34, 37, 13],
        [4, 151, 121, 5, 152, 122],
        [4, 75, 47, 14, 76, 48],
        [11, 54, 24, 14, 55, 25],
        [16, 45, 15, 14, 46, 16],
        [6, 147, 117, 4, 148, 118],
        [6, 73, 45, 14, 74, 46],
        [11, 54, 24, 16, 55, 25],
        [30, 46, 16, 2, 47, 17],
        [8, 132, 106, 4, 133, 107],
        [8, 75, 47, 13, 76, 48],
        [7, 54, 24, 22, 55, 25],
        [22, 45, 15, 13, 46, 16],
        [10, 142, 114, 2, 143, 115],
        [19, 74, 46, 4, 75, 47],
        [28, 50, 22, 6, 51, 23],
        [33, 46, 16, 4, 47, 17],
        [8, 152, 122, 4, 153, 123],
        [22, 73, 45, 3, 74, 46],
        [8, 53, 23, 26, 54, 24],
        [12, 45, 15, 28, 46, 16],
        [3, 147, 117, 10, 148, 118],
        [3, 73, 45, 23, 74, 46],
        [4, 54, 24, 31, 55, 25],
        [11, 45, 15, 31, 46, 16],
        [7, 146, 116, 7, 147, 117],
        [21, 73, 45, 7, 74, 46],
        [1, 53, 23, 37, 54, 24],
        [19, 45, 15, 26, 46, 16],
        [5, 145, 115, 10, 146, 116],
        [19, 75, 47, 10, 76, 48],
        [15, 54, 24, 25, 55, 25],
        [23, 45, 15, 25, 46, 16],
        [13, 145, 115, 3, 146, 116],
        [2, 74, 46, 29, 75, 47],
        [42, 54, 24, 1, 55, 25],
        [23, 45, 15, 28, 46, 16],
        [17, 145, 115],
        [10, 74, 46, 23, 75, 47],
        [10, 54, 24, 35, 55, 25],
        [19, 45, 15, 35, 46, 16],
        [17, 145, 115, 1, 146, 116],
        [14, 74, 46, 21, 75, 47],
        [29, 54, 24, 19, 55, 25],
        [11, 45, 15, 46, 46, 16],
        [13, 145, 115, 6, 146, 116],
        [14, 74, 46, 23, 75, 47],
        [44, 54, 24, 7, 55, 25],
        [59, 46, 16, 1, 47, 17],
        [12, 151, 121, 7, 152, 122],
        [12, 75, 47, 26, 76, 48],
        [39, 54, 24, 14, 55, 25],
        [22, 45, 15, 41, 46, 16],
        [6, 151, 121, 14, 152, 122],
        [6, 75, 47, 34, 76, 48],
        [46, 54, 24, 10, 55, 25],
        [2, 45, 15, 64, 46, 16],
        [17, 152, 122, 4, 153, 123],
        [29, 74, 46, 14, 75, 47],
        [49, 54, 24, 10, 55, 25],
        [24, 45, 15, 46, 46, 16],
        [4, 152, 122, 18, 153, 123],
        [13, 74, 46, 32, 75, 47],
        [48, 54, 24, 14, 55, 25],
        [42, 45, 15, 32, 46, 16],
        [20, 147, 117, 4, 148, 118],
        [40, 75, 47, 7, 76, 48],
        [43, 54, 24, 22, 55, 25],
        [10, 45, 15, 67, 46, 16],
        [19, 148, 118, 6, 149, 119],
        [18, 75, 47, 31, 76, 48],
        [34, 54, 24, 34, 55, 25],
        [20, 45, 15, 61, 46, 16]
    ], g.getRSBlocks = function (a, b) {
        var d = g.getRsBlockTable(a, b);
        if (d == c)throw new Error("bad rs block @ typeNumber:" + a + "/errorCorrectLevel:" + b);
        for (var e = d.length / 3, f = new Array, h = 0; e > h; h++)for (var i = d[3 * h + 0], j = d[3 * h + 1], k = d[3 * h + 2], l = 0; i > l; l++)f.push(new g(j, k));
        return f
    }, g.getRsBlockTable = function (a, b) {
        switch (b) {
            case k.L:
                return g.RS_BLOCK_TABLE[4 * (a - 1) + 0];
            case k.M:
                return g.RS_BLOCK_TABLE[4 * (a - 1) + 1];
            case k.Q:
                return g.RS_BLOCK_TABLE[4 * (a - 1) + 2];
            case k.H:
                return g.RS_BLOCK_TABLE[4 * (a - 1) + 3];
            default:
                return c
        }
    }, h.prototype = {get: function (a) {
        var b = Math.floor(a / 8);
        return 1 == (this.buffer[b] >>> 7 - a % 8 & 1)
    }, put: function (a, b) {
        for (var c = 0; b > c; c++)this.putBit(1 == (a >>> b - c - 1 & 1))
    }, getLengthInBits: function () {
        return this.length
    }, putBit: function (a) {
        var b = Math.floor(this.length / 8);
        this.buffer.length <= b && this.buffer.push(0), a && (this.buffer[b] |= 128 >>> this.length % 8), this.length++
    }}, function (a) {
        a.fn.slides = function (b) {
            return b = a.extend({}, a.fn.slides.option, b), this.each(function () {
                function c() {
                    clearInterval(j.data("interval"))
                }

                function d() {
                    b.pause ? (clearTimeout(j.data("pause")), clearInterval(j.data("interval")), pauseTimeout = setTimeout(function () {
                        clearTimeout(j.data("pause")), playInterval = setInterval(function () {
                            e("next", p)
                        }, b.play), j.data("interval", playInterval)
                    }, b.pause), j.data("pause", pauseTimeout)) : c()
                }

                function e(c, d, e) {
                    if (!g && f) {
                        switch (g = !0, c) {
                            case"next":
                                s = u, r = u + 1, r = l === r ? 0 : r, i = 2 * m, c = 2 * -m, u = r;
                                break;
                            case"prev":
                                s = u, r = u - 1, r = -1 === r ? l - 1 : r, i = 0, c = 0, u = r;
                                break;
                            case"pagination":
                                r = parseInt(e, 10), s = a("." + b.paginationClass + " li.current a", j).attr("rel"), r > s ? (i = 2 * m, c = 2 * -m) : (i = 0, c = 0), u = r
                        }
                        "fade" === d ? (b.animationStart(), b.crossfade ? k.children(":eq(" + r + ")", j).css({zIndex: 10}).fadeIn(b.fadeSpeed, function () {
                            k.children(":eq(" + s + ")", j).css({display: "none", zIndex: 0}), a(this).css({zIndex: 0}), b.animationComplete(r + 1), g = !1
                        }) : (b.animationStart(), k.children(":eq(" + s + ")", j).fadeOut(b.fadeSpeed, function () {
                            b.autoHeight ? k.animate({height: k.children(":eq(" + r + ")", j).outerHeight()}, b.autoHeightSpeed, function () {
                                k.children(":eq(" + r + ")", j).fadeIn(b.fadeSpeed)
                            }) : k.children(":eq(" + r + ")", j).fadeIn(b.fadeSpeed, function () {
                                a.browser.msie && a(this).get(0).style.removeAttribute("filter")
                            }), b.animationComplete(r + 1), g = !1
                        }))) : (k.children(":eq(" + r + ")").css({left: i, display: "block"}), b.autoHeight ? (b.animationStart(), k.animate({left: c, height: k.children(":eq(" + r + ")").outerHeight()}, b.slideSpeed, function () {
                            k.css({left: -m}), k.children(":eq(" + r + ")").css({left: m, zIndex: 5}), k.children(":eq(" + s + ")").css({left: m, display: "none", zIndex: 0}), b.animationComplete(r + 1), g = !1
                        })) : (b.animationStart(), k.animate({left: c}, b.slideSpeed, function () {
                            k.css({left: -m}), k.children(":eq(" + r + ")").css({left: m, zIndex: 5}), k.children(":eq(" + s + ")").css({left: m, display: "none", zIndex: 0}), b.animationComplete(r + 1), g = !1
                        }))), b.pagination && (a("." + b.paginationClass + " li.current", j).removeClass("current"), a("." + b.paginationClass + " li a:eq(" + r + ")", j).parent().addClass("current"))
                    }
                }

                a("." + b.container, a(this)).children().wrapAll('<div class="slides_control"/>');
                var f, g, h, i, j = a(this), k = a(".slides_control", j), l = k.children().size(), m = k.children().outerWidth(), n = k.children().outerHeight(), o = b.start - 1, p = b.effect.indexOf(",") < 0 ? b.effect : b.effect.replace(" ", "").split(",")[0], q = b.effect.indexOf(",") < 0 ? p : b.effect.replace(" ", "").split(",")[1], r = 0, s = 0, t = 0, u = 0;
                if (!(2 > l)) {
                    if (0 > o && (o = 0), o > l && (o = l - 1), b.start && (u = o), b.randomize && k.randomize(), a("." + b.container, j).css({overflow: "hidden", position: "relative"}), k.css({position: "relative", width: 3 * m, height: n, left: -m}), k.children().css({position: "absolute", top: 0, left: m, zIndex: 0, display: "none"}), b.autoHeight && k.animate({height: k.children(":eq(" + o + ")").outerHeight()}, b.autoHeightSpeed), b.preload && "IMG" == k.children()[0].tagName) {
                        j.css({background: "url(" + b.preloadImage + ") no-repeat 50% 50%"});
                        var v = a("img:eq(" + o + ")", j).attr("src") + "?" + (new Date).getTime();
                        a("img:eq(" + o + ")", j).attr("src", v).load(function () {
                            a(this).fadeIn(b.fadeSpeed, function () {
                                a(this).css({zIndex: 5}), j.css({background: ""}), f = !0
                            })
                        })
                    } else k.children(":eq(" + o + ")").fadeIn(b.fadeSpeed, function () {
                        f = !0
                    });
                    b.bigTarget && (k.children().css({cursor: "pointer"}), k.children().click(function () {
                        return e("next", p), !1
                    })), b.hoverPause && b.play && (k.children().bind("mouseover", function () {
                        c()
                    }), k.children().bind("mouseleave", function () {
                        d()
                    })), b.generateNextPrev && (a("." + b.container, j).after('<a href="#" class="' + b.prev + '">Prev</a>'), a("." + b.prev, j).after('<a href="#" class="' + b.next + '">Next</a>')), a("." + b.next, j).click(function (a) {
                        a.preventDefault(), b.play && d(), e("next", p)
                    }), a("." + b.prev, j).click(function (a) {
                        a.preventDefault(), b.play && d(), e("prev", p)
                    }), b.generatePagination ? (j.append("<ul class=" + b.paginationClass + "></ul>"), k.children().each(function () {
                        a("." + b.paginationClass, j).append("<li><a rel=" + t + ' href="#">' + (t + 1) + "</a></li>"), t++
                    })) : a("." + b.paginationClass + " li a", j).each(function () {
                        a(this).attr("rel", t), t++
                    }), a("." + b.paginationClass + " li a:eq(" + o + ")", j).parent().addClass("current"), a("." + b.paginationClass + " li a", j).click(function () {
                        return b.play && d(), h = a(this).attr("rel"), u != h && e("pagination", q, h), !1
                    }), b.play && (playInterval = setInterval(function () {
                        e("next", p)
                    }, b.play), j.data("interval", playInterval))
                }
            })
        }, a.fn.slides.option = {preload: !1, preloadImage: "/img/loading.gif", container: "slides_container", generateNextPrev: !1, next: "next", prev: "prev", pagination: !0, generatePagination: !0, paginationClass: "pagination", fadeSpeed: 350, slideSpeed: 350, start: 1, effect: "slide", crossfade: !1, randomize: !1, play: 0, pause: 0, hoverPause: !1, autoHeight: !1, autoHeightSpeed: 350, bigTarget: !1, animationStart: function () {
        }, animationComplete: function () {
        }}, a.fn.randomize = function (b) {
            function d() {
                return Math.round(Math.random()) - .5
            }

            return a(this).each(function () {
                var e = a(this), f = e.children(), g = f.length;
                if (g > 1) {
                    f.hide();
                    var h = [];
                    for (o = 0; g > o; o++)h[h.length] = o;
                    h = h.sort(d), a.each(h, function (a, d) {
                        var g = f.eq(d), h = g.clone(!0);
                        h.show().appendTo(e), b !== c && b(g, h), g.remove()
                    })
                }
            })
        }
    }(jQuery), function (a) {
        "use strict";
        a.fn.swipeSlide = function (b, c) {
            function d(a, b) {
                a.css({"-webkit-transition": "all " + b + "s " + C.transitionType, transition: "all " + b + "s " + C.transitionType})
            }

            function e(a, b) {
                a.css(C.axisX ? {"-webkit-transform": "translate3d(" + b + "px,0,0)", transform: "translate3d(" + b + "px,0,0)"} : {"-webkit-transform": "translate3d(0," + b + "px,0)", transform: "translate3d(0," + b + "px,0)"})
            }

            function f(a) {
                if (C.lazyLoad) {
                    var b = C.ul.find("[data-src]");
                    if (b.length > 0) {
                        var c = b.eq(a);
                        c.data("src") && (c.is("img") ? c.attr("src", c.data("src")).data("src", "") : c.css({"background-image": "url(" + c.data("src") + ")"}).data("src", ""))
                    }
                }
            }

            function g(a) {
                a.touches || (a.touches = a.originalEvent.touches)
            }

            function h(a) {
                r = a.touches[0].pageX, s = a.touches[0].pageY
            }

            function i(a) {
                if (a.preventDefault(), C.autoSwipe && p && clearInterval(p), w = a.touches[0].pageX, x = a.touches[0].pageY, t = w - r, u = x - s, d(C.ul, 0), C.axisX) {
                    if (!C.continuousScroll) {
                        if (0 == q && t > 0)return t = 0, o();
                        if (q + 1 >= F && 0 > t)return t = 0, o()
                    }
                    e(C.ul, -(D * parseInt(q) - t))
                } else {
                    if (!C.continuousScroll) {
                        if (0 == q && u > 0)return u = 0, o();
                        if (q + 1 >= F && 0 > u)return u = 0, o()
                    }
                    e(C.ul, -(E * parseInt(q) - u))
                }
            }

            function j() {
                v = C.axisX ? t : u, Math.abs(v) <= y ? k(.3) : v > y ? n() : -y > v && m(), o(), t = 0, u = 0
            }

            function k(a) {
                d(C.ul, a), C.axisX ? e(C.ul, -q * D) : e(C.ul, -q * E)
            }

            function l() {
                C.continuousScroll ? q >= F ? (k(.3), q = 0, setTimeout(function () {
                    k(0)
                }, 300)) : 0 > q ? (k(.3), q = F - 1, setTimeout(function () {
                    k(0)
                }, 300)) : k(.3) : (q >= F ? q = 0 : 0 > q && (q = F - 1), k(.3)), c(q)
            }

            function m() {
                q++, l(), C.lazyLoad && f(C.continuousScroll ? q + 2 : q + 1)
            }

            function n() {
                if (q--, l(), A && C.lazyLoad) {
                    var a = F - 1;
                    for (a; F + 1 >= a; a++)f(a);
                    return void(A = !1)
                }
                !A && C.lazyLoad && f(q)
            }

            function o() {
                C.autoSwipe && (p = setInterval(function () {
                    m()
                }, C.speed))
            }

            var p, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 50, z = 0, A = !0, B = a(this), C = a.extend({}, {ul: B.children("ul"), li: B.children().children("li"), continuousScroll: !1, autoSwipe: !0, speed: 4e3, axisX: !0, transitionType: "ease", lazyLoad: !1, clone: !0, width: 0, length: 0}, b || {}), D = C.width || C.li.width(), E = C.li.height(), F = C.length || C.li.length;
            c = c || function () {
            }, function () {
                if (C.continuousScroll && (C.clone && C.ul.prepend(C.li.last().clone()).append(C.li.first().clone()), C.axisX ? (e(C.ul.children().first(), -1 * D), e(C.ul.children().last(), D * F)) : (e(C.ul.children().first(), -1 * E), e(C.ul.children().last(), E * F))), C.lazyLoad) {
                    var b = 0;
                    for (z = C.continuousScroll ? 3 : 2, b; z > b; b++)f(b)
                }
                C.li.each(C.axisX ? function (b) {
                    e(a(this), D * b)
                } : function (b) {
                    e(a(this), E * b)
                }), o(), c(q, p), B.on("touchstart", function (a) {
                    a.stopPropagation(), g(a), h(a)
                }), B.on("touchmove", function (a) {
                    a.stopPropagation(), g(a), i(a)
                }), B.on("touchend", function (a) {
                    a.stopPropagation(), j()
                })
            }()
        }
    }(a.Zepto || a.jQuery), function (b) {
        function c(a, b, c, d) {
            var e = {}, f = a / b, g = c / d;
            return f > g ? (e.width = c, e.height = c / f) : (e.height = d, e.width = d * f), e
        }

        var d = b.templateParser("jsonParser", function () {
            function a(a) {
                return function (b, c) {
                    a[b] = c
                }
            }

            function b(a, b) {
                var c = i[("" + a.type).charAt(0)](a);
                if (c) {
                    var d = $('<li comp-drag comp-rotate class="comp-resize comp-rotate inside" id="inside_' + c.id + '" num="' + a.num + '" ctype="' + a.type + '"></li>');
                    3 != ("" + a.type).charAt(0) && 1 != ("" + a.type).charAt(0) && d.attr("comp-resize", ""), "p" == ("" + a.type).charAt(0) && d.removeAttr("comp-rotate"), 1 == ("" + a.type).charAt(0) && d.removeAttr("comp-drag"), 2 == ("" + a.type).charAt(0) && d.addClass("wsite-text"), 4 == ("" + a.type).charAt(0) && (a.properties.imgStyle && $(c).css(a.properties.imgStyle), d.addClass("wsite-image")), 5 == ("" + a.type).charAt(0) && d.addClass("wsite-input"), 6 == ("" + a.type).charAt(0) && d.addClass("wsite-button"), 8 == ("" + a.type).charAt(0) && d.addClass("wsite-button"), "v" == ("" + a.type).charAt(0) && d.addClass("wsite-video"), d.mouseenter(function () {
                        $(this).addClass("inside-hover")
                    }), d.mouseleave(function () {
                        $(this).removeClass("inside-hover")
                    });
                    var e = $('<div class="element-box">').append($('<div class="element-box-contents">').append(c));
                    if (d.append(e), 5 != ("" + a.type).charAt(0) && 6 != ("" + a.type).charAt(0) || "edit" != b || $(c).before($('<div class="element" style="position: absolute; height: 100%; width: 100%;">')), a.css) {
                        var f = 320 - parseInt(a.css.left);
                        d.css({width: f}), "p" == a.type && d.css({height: f / 2}), d.css({width: a.css.width, height: a.css.height, left: a.css.left, top: a.css.top, zIndex: a.css.zIndex, bottom: a.css.bottom, transform: a.css.transform}), e.css(a.css).css({width: "100%", height: "100%", transform: "none"}), e.children(".element-box-contents").css({width: "100%", height: "100%"}), 4 != ("" + a.type).charAt(0) && "p" != ("" + a.type).charAt(0) && $(c).css({width: a.css.width, height: a.css.height})
                    }
                    return d
                }
            }

            function c(a) {
                for (var b = 0; b < a.length - 1; b++)for (var c = b + 1; c < a.length; c++)if (parseInt(a[b].css.zIndex, 10) > parseInt(a[c].css.zIndex, 10)) {
                    var d = a[b];
                    a[b] = a[c], a[c] = d
                }
                for (var e = 0; e < a.length; e++)a[e].css.zIndex = e + 1 + "";
                return a
            }

            function d(a, d, e) {
                d = d.find(".edit_area").css({overflow: "hidden"});
                var f, g = a.elements;
                if (g)for (g = c(g), f = 0; f < g.length; f++)if (3 == g[f].type) {
                    var h = i[("" + g[f].type).charAt(0)](g[f]);
                    "edit" == e && j[("" + g[f].type).charAt(0)] && j[("" + g[f].type).charAt(0)](h, g[f])
                } else {
                    var m = b(g[f], e);
                    if (!m)continue;
                    d.append(m);
                    for (var n = 0; n < l.length; n++)l[n](m, g[f], e);
                    k[("" + g[f].type).charAt(0)] && k[("" + g[f].type).charAt(0)](m, g[f]), "edit" == e && j[("" + g[f].type).charAt(0)] && j[("" + g[f].type).charAt(0)](m, g[f])
                }
            }

            function e() {
                return j
            }

            function f() {
                return i
            }

            function g(a) {
                l.push(a)
            }

            function h() {
                return l
            }

            var i = {}, j = {}, k = {}, l = [], m = containerWidth = 320, n = containerHeight = 486, o = 1, q = 1, r = {getComponents: f, getEventHandlers: e, addComponent: a(i), bindEditEvent: a(j), bindAfterRenderEvent: a(k), addInterceptor: g, getInterceptors: h, wrapComp: b, mode: "view", parse: function (a) {
                var b = $('<div class="edit_wrapper"><ul eqx-edit-destroy id="edit_area' + a.def.id + '" comp-droppable paste-element class="edit_area weebly-content-area weebly-area-active"></div>'), c = this.mode = a.mode;
                this.def = a.def, "view" == c && p++;
                var e = $(a.appendTo);
                return containerWidth = e.width(), containerHeight = e.height(), o = m / containerWidth, q = n / containerHeight, d(a.def, b.appendTo($(a.appendTo)), c)
            }};
            return r
        });
        d.addInterceptor(function (a, b, c) {
            q.animation(a, b, c)
        }), d.addComponent("1", function (a) {
            var b = document.createElement("div");
            if (b.id = a.id, b.setAttribute("class", "element comp_title"), a.content && (b.textContent = a.content), a.css) {
                var c, d = a.css;
                for (c in d)b.style[c] = d[c]
            }
            if (a.properties.labels)for (var e = a.properties.labels, f = 0; f < e.length; f++)$('<a class = "label_content" style = "display: inline-block;">').appendTo($(b)).html(e[f].title).css(e[f].color).css("width", 100 / e.length + "%");
            return b
        }), d.addComponent("2", function (a) {
            var b = document.createElement("div");
            return b.id = a.id, b.setAttribute("ctype", a.type), b.setAttribute("class", "element comp_paragraph editable-text"), a.content && (b.innerHTML = a.content), b.style.cursor = "default", b
        }), d.addComponent("3", function (a) {
            var b = $("#nr .edit_area")[0];
            "view" == d.mode && (b = document.getElementById("edit_area" + d.def.id)), b = $(b).parent()[0];
            var c, e = new Image;
            return a.properties.imgSrc && (c = a.properties.imgSrc, /^http.*/.test(c) ? (e.src = c, b.style.backgroundImage = "url(" + c + ")") : (e.src = PREFIX_FILE_HOST + "/" + c, b.style.backgroundImage = "url(" + PREFIX_FILE_HOST + "/" + c + ")"), b.style.backgroundOrigin = "element content-box", b.style.backgroundSize = "cover", b.style.backgroundPosition = "50% 50%"), a.properties.bgColor && (b.style.backgroundColor = a.properties.bgColor), b
        }), d.addComponent("4", function (a) {
            var b = document.createElement("img");
            return b.id = a.id, b.setAttribute("ctype", a.type), b.setAttribute("class", "element comp_image editable-image"), b.src = /^http.*/.test(a.properties.src) ? a.properties.src : PREFIX_FILE_HOST + a.properties.src, b
        }), d.addComponent("v", function (a) {
            var b = document.createElement("a");
            return b.setAttribute("class", "element video_area"), b.id = a.id, b.setAttribute("ctype", a.type), a.properties.src && b.setAttribute("videourl", a.properties.src), b
        }), d.addComponent("5", function (a) {
            var b = document.createElement("textarea");
            return b.id = a.id, b.setAttribute("ctype", a.type), b.setAttribute("class", "element comp_input editable-text"), a.properties.required && b.setAttribute("required", a.properties.required), a.properties.placeholder && b.setAttribute("placeholder", a.properties.placeholder), b.setAttribute("name", "eq[f_" + a.id + "]"), b.style.width = "100%", b
        }), d.addComponent("p", function (a) {
            if (a.properties && a.properties.children) {
                var b = 320, d = a.css.width || b - parseInt(a.css.left), e = a.css.height || d / 2, f = $('<div id="' + a.id + '" class="slide element" ctype="' + a.type + '"></div>');
                a.properties.bgColor && f.css("backgroundColor", a.properties.bgColor);
                var g = $("<ul>").appendTo(f), h = $('<div class="dot">').appendTo(f);
                for (var i in a.properties.children) {
                    var j = c(a.properties.children[i].width, a.properties.children[i].height, d, e), k = $('<img data-src="' + PREFIX_FILE_HOST + a.properties.children[i].src + '" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC">');
                    k.css({width: j.width, height: j.height});
                    var l = $("<li>").css({lineHeight: e + "px"});
                    l.append(k), g.append(l), h.append($("<span>"))
                }
                return INTERVAL_OBJ[a.id] && (clearInterval(INTERVAL_OBJ[a.id]), delete INTERVAL_OBJ[a.id]), f.attr("length", a.properties.children.length).attr("autoscroll", a.properties.autoPlay).attr("interval", a.properties.interval), f.swipeSlide({autoSwipe: a.properties.autoPlay, continuousScroll: !0, speed: a.properties.interval, transitionType: "cubic-bezier(0.22, 0.69, 0.72, 0.88)", lazyLoad: !0, width: d}, function (b, c) {
                    h.children().eq(b).addClass("cur").siblings().removeClass("cur"), c && (INTERVAL_OBJ[a.id] = c)
                }), f.get(0)
            }
        }), d.addComponent("6", function (a) {
            var b = document.createElement("button");
            if (b.id = a.id, b.setAttribute("ctype", a.type), b.setAttribute("class", "element comp_button editable-text"), a.properties.title) {
                var c = a.properties.title.replace(/ /g, "&nbsp;");
                b.innerHTML = c
            }
            return b.style.width = "100%", b
        }), d.addComponent("8", function (a) {
            var b = document.createElement("a");
            if (b.id = a.id, b.setAttribute("ctype", a.type), b.setAttribute("class", "element comp_anchor editable-text"), a.properties.title) {
                var c = a.properties.title.replace(/ /g, "&nbsp;");
                $(b).html(c), "view" == d.mode && $(b).attr("href", "tel:" + a.properties.number)
            }
            return b.style.cursor = "default", b.style.width = "100%", b
        }), d.addComponent("7", function (a) {
            var b = document.createElement("div");
            if (b.id = "map_" + a.id, b.setAttribute("class", "element comp_map_wrapper"), a.content && (b.textContent = a.content), a.css) {
                var c, d = a.css;
                for (c in d)b.style[c] = d[c]
            }
            return b.style.height = "250px", b
        }), d.bindAfterRenderEvent("1", function (a, b) {
            if (a = $("div", a)[0], "view" == d.mode && 1 == b.type) {
                var c = b.properties.labels;
                for (key in c)!function (b) {
                    $($(a).find(".label_content")[b]).on("click", function () {
                        pageScroll(c[b])
                    })
                }(key)
            }
        }), d.bindAfterRenderEvent("8", function (a, b) {
            a = $("a", a)[0];
            var c = {id: b.sceneId, num: b.properties.number};
            if ("view" == d.mode) {
                var e = function () {
                    $.ajax({cache: !0, type: "POST", url: PREFIX_S1_URL + "eqs/dial", data: $.param(c), async: !1, error: function (a) {
                        alert("Connection error")
                    }, success: function (a) {
                    }})
                };
                a.addEventListener("click", e)
            }
        }), d.bindAfterRenderEvent("4", function (b, c) {
            "view" == d.mode && c.properties.url && $(b).click(function (b) {
                {
                    var d = c.properties.url;
                    isNaN(d) ? a.open(d) : eqxiu.pageScroll(d)
                }
            })
        }), d.bindAfterRenderEvent("v", function (a, b) {
            "view" == d.mode && $(a).click(function () {
                $(a).hide(), $("#audio_btn").hasClass("video_exist") && ($("#audio_btn").hide(), $("#media")[0].pause()), $('<div class="video_mask" id="mask_' + b.id + '"></div>').appendTo($(a).closest(".m-img")), $('<a class = "close_mask" id="close_' + b.id + '"></a>').appendTo($(a).closest(".m-img")), $(b.properties.src).appendTo($("#mask_" + b.id)).attr("style", "position: absolute;top:0; min-height: 45%; max-height: 100%; top: 20%;").attr("width", "100%").removeAttr("height"), $("#close_" + b.id).bind("click", function () {
                    $(a).show(), $("#mask_" + b.id).remove(), $("#close_" + b.id).remove(), $("#audio_btn").hasClass("video_exist") && $("#audio_btn").show(function () {
                        $(this).hasClass("off") || $("#media")[0].play()
                    })
                })
            })
        }), d.bindAfterRenderEvent("2", function (a, b) {
            for (var c = $(a).find("a[data]"), e = 0; e < c.length; e++)if (c[e] && "view" == d.mode) {
                $(c[e]).css("color", "#428bca").css("cursor", "pointer");
                var f = $(c[e]).attr("data");
                !function (a) {
                    $(c[e]).click(function (b) {
                        eqxiu.pageScroll(a)
                    })
                }(f)
            }
        }), d.bindAfterRenderEvent("6", function (a, b) {
            if (a = $("button", a)[0], "view" == d.mode) {
                var c = function (b, c) {
                    var d = !0, e = $(a).parents(".nr"), f = {};
                    $("textarea", e).each(function () {
                        if (d) {
                            if ("required" == $(this).attr("required") && "" == $(this).val().trim())return alert($(this).attr("placeholder") + "为必填项"), void(d = !1);
                            if ("502" == $(this).attr("ctype")) {
                                var a = new RegExp(/(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/g);
                                if (!a.test($(this).val()))return alert("手机号码格式错误"), void(d = !1)
                            }
                            if ("503" == $(this).attr("ctype")) {
                                var b = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/g);
                                if (!b.test($(this).val()))return alert("邮箱格式错误"), void(d = !1)
                            }
                            f[$(this).attr("name")] = $(this).val()
                        }
                    }), d && $.ajax({cache: !0, type: "POST", url: JSON_URL + "?c=scenedata&a=add&id=" + c, data: $.param(f), async: !1, error: function (a) {
                        alert("Connection error")
                    }, success: function (a) {
                        $(b).unbind("click").click(function () {
                            alert("请不要重复提交")
                        }), alert("提交成功")
                    }})
                }, e = d.def.sceneId;
                $(a).bind("click", function () {
                    c(this, e)
                })
            }
        }), d.bindAfterRenderEvent("7", function (a, b) {
            var c = new BMap.Map("map_" + b.id, {enableMapClick: !1}), d = new BMap.Point(b.properties.x, b.properties.y), e = new BMap.Marker(d);
            c.addOverlay(e);
            var f = new BMap.Label(b.properties.markTitle, {offset: new BMap.Size(20, -10)});
            e.setLabel(f), c.disableDoubleClickZoom(), c.centerAndZoom(d, 15)
        })
    }(a.eqShow);
    var p = 0, q = function () {
        var a = function (a) {
            var b, c, d = a.type;
            return 0 === d && (b = "fadeIn"), 1 === d && (c = a.direction, 0 === c && (b = "fadeInLeft"), 1 === c && (b = "fadeInDown"), 2 === c && (b = "fadeInRight"), 3 === c && (b = "fadeInUp")), 6 === d && (b = "wobble"), 5 === d && (b = "rubberBand"), 7 === d && (b = "rotateIn"), 8 === d && (b = "flip"), 9 === d && (b = "swing"), 2 === d && (c = a.direction, 0 === c && (b = "bounceInLeft"), 1 === c && (b = "bounceInDown"), 2 === c && (b = "bounceInRight"), 3 === c && (b = "bounceInUp")), 3 === d && (b = "bounceIn"), 4 === d && (b = "zoomIn"), 10 === d && (b = "fadeOut"), 11 === d && (b = "flipOutY"), 12 === d && (b = "rollIn"), 13 === d && (b = "lightSpeedIn"), b
        }, b = function (a, b, c) {
            function d(a, b, f) {
                if (f.length && e < f.length) {
                    a.css("animation", "");
                    var g = a.get(0);
                    g.offsetWidth = g.offsetWidth, a.css("animation", b[e] + " " + f[e].duration + "s ease " + f[e].delay + "s " + (f[e].countNum ? f[e].countNum : "")), "view" == c ? (f[e].count && e == f.length - 1 && a.css("animation-iteration-count", "infinite"), a.css("animation-fill-mode", "both")) : (a.css("animation-iteration-count", "1"), a.css("animation-fill-mode", "backwards")), f[e].linear && a.css("animation-timing-function", "linear"), a.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                        e++, d(a, b, f)
                    })
                }
            }

            var e = 0;
            if (b.properties && b.properties.anim) {
                var f = [];
                b.properties.anim.length ? f = b.properties.anim : f.push(b.properties.anim);
                var g = $(".element-box", a);
                g.attr("element-anim", "");
                for (var h, i = [], j = [], k = 0, l = f.length; l > k; k++)null != f[k].type && -1 != f[k].type && (h = q.convertType(f[k]), i.push(h), j.push(f[k]));
                b.properties.anim.trigger ? a.click(function () {
                    d(g, h, b.properties.anim)
                }) : d(g, i, j)
            }
        };
        return{convertType: a, animation: b}
    }();
    b.module("app", ["ngRoute", "home", "sample", "main", "reg", "scene", "my", "data", "data.edit", "error", "usercenter", "ui.bootstrap", "ui.grid", "ui.grid.selection", "ngSanitize", "ui.select", "services.i18nNotifications", "services.httpRequestTracker", "services.sample", "services.config", "security", "app.upload", "templates-app", "templates-common", "ui.sortable", "I18N.MESSAGES", "app.directives.keymap", "app.directives.notification"]), b.module("app").config(["$routeProvider", "$locationProvider", "securityAuthorizationProvider", "uiSelectConfig", function (a, b, c, d) {
        d.theme = "bootstrap", a.when("/home", {templateUrl: "home/home.tpl.html", controller: "HomeCtrl"}).when("/home/:id", {templateUrl: "home/home.tpl.html", controller: "HomeCtrl"}).when("/reg", {templateUrl: "reg/reg.tpl.html", controller: "RegCtrl"}).when("/otherRegister", {templateUrl: "common/security/register/otherRegister.tpl.html"}).when("/agreement", {templateUrl: "reg/agreement.tpl.html"}).when("/about", {templateUrl: "about.tpl.html"}).when("/error/:codeid", {templateUrl: "error/error.tpl.html", controller: "ErrorCtrl"}).when("/sample", {templateUrl: "sample/sample.tpl.html", controller: "SampleCtrl"}).when("/main", {templateUrl: "main/main.tpl.html", controller: "MainCtrl", resolve: {authenticatedUser: c.requireAuthenticatedUser}}).when("/main/spread", {templateUrl: "main/spread.tpl.html", controller: "SpreadCtrl", resolve: {authenticatedUser: c.requireAuthenticatedUser}}).when("/main/customer", {templateUrl: "main/customer.tpl.html", controller: "CustomerCtrl", resolve: {authenticatedUser: c.requireAuthenticatedUser}}).when("/main/customer/:sceneId", {templateUrl: "data/editData.tpl.html", controller: "EditDataCtrl", resolve: {authenticatedUser: c.requireAuthenticatedUser}}).when("/main/spread/:sceneId", {templateUrl: "main/spreadDetail.tpl.html", controller: "SpreadDetailCtrl", reloadOnSearch: !0, resolve: {authenticatedUser: c.requireAuthenticatedUser}}).when("/usercenter/:id", {templateUrl: "usercenter/usercenter.tpl.html", controller: "UserCenterCtrl", resolve: {authenticatedUser: c.requireAuthenticatedUser}}).when("/scene", {templateUrl: "scene/scene.tpl.html", controller: "SceneCtrl", resolve: {authenticatedUser: c.requireAuthenticatedUser}}).when("/scene/create/:sceneId", {templateUrl: "scene/create.tpl.html", controller: "CreateSceneCtrl", reloadOnSearch: !1, resolve: {authenticatedUser: c.requireAuthenticatedUser}}).when("/my/scene/:sceneId", {templateUrl: "my/myscene.tpl.html", controller: "MySceneCtrl", reloadOnSearch: !1, resolve: {authenticatedUser: c.requireAuthenticatedUser}}).when("/my/sceneSetting/:sceneId", {templateUrl: "my/sceneSetting.tpl.html", controller: "SceneSettingCtrl", resolve: {authenticatedUser: c.requireAuthenticatedUser}}).otherwise({redirectTo: "/home"})
    }]), b.module("app").run(["security", "$rootScope", "configService", function (a, b, c) {
        b.CLIENT_CDN = CLIENT_CDN, b.PREFIX_FILE_HOST = PREFIX_FILE_HOST, b.PREFIX_SERVER_HOST = PREFIX_URL, b.PREFIX_CLIENT_HOST = PREFIX_HOST, a.requestCurrentUser(), c.getLogo().then(function (a) {
            try {
                b.logoSrc = a.data
            } catch (c) {
                b.logoSrc = CLIENT_CDN + "assets/images/logo.png"
            }
        }, function () {
            b.logoSrc = CLIENT_CDN + "assets/images/logo.png"
        })
    }]), b.module("app").run(["$route", "$rootScope", "$location", function (a, b, c) {
        b.$on("$locationChangeStart", function () {
            b.branchid && c.search("branchid", b.branchid), $(".modal").remove(), $(".modal-backdrop").remove()
        });
        var d = c.path;
        c.path = function (e, f) {
            if (f === !1)var g = a.current, h = b.$on("$locationChangeSuccess", function () {
                a.current = g, h()
            });
            return d.apply(c, [e])
        }
    }]), b.module("app").controller("AppCtrl", ["SpreadService", "$window", "$scope", "$rootScope", "$location", "$modal", "security", "sceneService", "$routeParams", "$timeout", "i18nNotifications", "usercenterService", function (a, c, d, e, f, g, h, i, j, k, l, m) {
        function n() {
            var a = 1, c = 50;
            m.getBranches(c, a).then(function (a) {
                d.userbranches = a.data.list;
                var c = f.search().branchid;
                c && b.forEach(d.userbranches, function (a, b) {
                    a.id == c && (e.global.branch = a)
                })
            }, function (a) {
            })
        }

        d.notifications = l, d.removeNotification = function (a) {
            l.remove(a)
        }, d.$on("$locationChangeStart", function (a) {
            if ("/home/login" != f.path() || h.currentUser ? "/home/register" != f.path() || h.currentUser || h.showRegister() : h.showLogin(), f.search().resetToken) {
                var b = f.search().resetToken;
                h.requestResetPassword(b)
            }
        });
        var o = new RegExp("token"), p = new RegExp("uid"), q = c.location.hash;
        if (f.absUrl().indexOf("WECHAT_STATE") > 0 && (d.weiChatCode = f.absUrl().split("&")[0].split("=")[1]), p.test(q)) {
            var r = q.split("=");
            d.weiboAccessToken = r[1].split("&")[0], d.weiboRemindIn = r[2].split("&")[0], d.weiboExpires = r[3].split("&")[0], d.weiboUId = r[4].split("&")[0]
        } else o.test(q) && (d.accessToken = q.split("&")[0].split("=")[1], d.expiresIn = q.split("&")[1].split("=")[1]);
        d.openLogin = function () {
            f.path("/home/login", !1)
        }, d.openRegister = function () {
            f.path("/home/register", !1)
        }, d.isAuthenticated = h.isAuthenticated, f.search().branchid && (e.branchid = f.search().branchid), d.$watch(function () {
            return h.currentUser
        }, function (b) {
            b && (d.user = b, e.user = b, d.userProperty = b, d.isEditor = h.isEditor(), e.isEditor = h.isEditor(), d.isAdvancedUser = h.isAdvancedUser(), e.isAdvancedUser = h.isAdvancedUser(), d.isVendorUser = h.isVendorUser(), e.isVendorUser = h.isVendorUser(), d.$broadcast("currentUser", b), a.getActivityDetail("001").then(function (a) {
                var b = a.data.obj;
                if (b) {
                    e.sendXd = b;
                    var c = (new Date).getTime();
                    c >= b.startDate && c <= b.endDate && (e.sendXd.state = 1)
                }
            }), 2 == e.user.type && n())
        }, !0), d.$on("addBranch", function (a, b) {
            d.userbranches.unshift(b)
        }), e.global = {}, d.selectBranch = function () {
            e.global.branch ? (e.branchid = e.global.branch.id, f.search({branchid: e.branchid})) : (e.branchid = "", f.search("branchid", null))
        }, d.$watch("branchid", function () {
            d.hideOpea = e.branchid ? !0 : !1
        }), d.openReg = function () {
            g.open({windowClass: "request_contain", templateUrl: "usercenter/request_reg.tpl.html", controller: "UsercenterrequestCtrl", resolve: {}}).result.then(function () {
            }, function () {
            })
        }, d.login = function () {
            h.showLogin()
        }, d.register = function () {
            h.showRegister()
        }, d.showToolBar = function () {
            return f.$$path.indexOf("/scene/create") >= 0 ? !1 : !0
        }, d.showPanel = function () {
            $("#helpPanel").stop().animate({right: "0"}, 500)
        }, d.hidePanel = function () {
            $("#helpPanel").stop().animate({right: "-120"}, 500)
        }, d.suggestionUrl = "http://bbs.e.wesambo.com/forum.php?mod=forumdisplay&fid=45", d.feedbackUrl = "http://bbs.e.wesambo.com/forum.php?mod=forumdisplay&fid=46", d.qqChatUrl = "http://shang.qq.com/wpa/qunwpa?idkey=4a2d63670009360b878aa9a1e1437ef4caec132f74a0e2c4df4a686168cc73dc", d.helpUrl = "http://bbs.e.wesambo.com/forum.php", d.createSkillUrl = "http://bbs.e.wesambo.com/forum.php?gid=37", d.safeApply = function (a) {
            var b = this.$root.$$phase;
            "$apply" == b || "$digest" == b ? a && "function" == typeof a && a() : this.$apply(a)
        }
    }]).filter("fixnum", function () {
        return function (a) {
            var b = a;
            return a >= 1e4 && 1e8 > a ? b = (a / 1e4).toFixed(1) + "万" : a >= 1e8 && (b = (a / 1e8).toFixed(1) + "亿"), b
        }
    }), b.module("data.associate", []), b.module("data.associate").controller("AssociateFieldCtrl", ["$scope", "dataService", function (a, b) {
        a.staticFileds = [
            {id: "name", name: "姓名"},
            {id: "mobile", name: "手机"},
            {id: "email", name: "邮箱"},
            {id: "sex", name: "性别"},
            {id: "company", name: "公司"},
            {id: "job", name: "职位"},
            {id: "address", name: "地址"},
            {id: "tel", name: "电话"},
            {id: "website", name: "个人网站"},
            {id: "qq", name: "QQ"},
            {id: "weixin", name: "微信"},
            {id: "remark", name: "其它"}
        ], a.associateMap = [], a.person = {}, a.selectScene = function (c) {
            b.getSceneField(c).then(function (b) {
                a.fields = b.data.list
            })
        }, a.associate = function (b) {
            for (var c = 0; c < a.associateMap.length; c++)c != b && a.associateMap[c].id == a.associateMap[b].id && (a.associateMap[c] = null)
        }, a.confirm = function () {
            for (var c = {}, d = 0, e = a.associateMap; d < e.length; d++)e[d] && (c[e[d].id] = a.fields[d].id);
            b.mergeSceneData(a.person.selected.ID, c).then(function () {
                a.$close()
            }, function () {
                a.$dismiss()
            })
        }, a.cancel = function () {
            a.$dismiss()
        }, b.getPremergeScenes().then(function (b) {
            a.PremergeScenes = b.data.list
        })
    }]).filter("propsFilter", function () {
        return function (a, c) {
            var d = [];
            return b.isArray(a) ? a.forEach(function (a) {
                for (var b = !1, e = Object.keys(c), f = 0; f < e.length; f++) {
                    var g = e[f], h = c[g].toLowerCase();
                    if (-1 !== a[g].toString().toLowerCase().indexOf(h)) {
                        b = !0;
                        break
                    }
                }
                b && d.push(a)
            }) : d = a, d
        }
    }), b.module("data", ["data.associate"]), b.module("data.edit", ["services.usercenter", "services.i18nNotifications"]), b.module("data.edit").controller("EditDataCtrl", ["$rootScope", "$scope", "$window", "$routeParams", "usercenterService", "security", "$modal", "ModalService", "$location", "dataService", "i18nNotifications", function (a, b, c, d, e, f, g, h, i, j, k) {
        b.sceneId = d.sceneId, b.sexOptions = [
            {id: 0, name: "请选择性别"},
            {id: 1, name: "男"},
            {id: 2, name: "女"}
        ], b.sex = b.sexOptions[0], b.isAllowedToAccessGrouping = f.isAllowToAccess(f.accessDef.GROUP_CUSTOMER);
        var l = a.branchid, m = {};
        b.getDataDetail = function (a) {
            j.getDataDetail(b.sceneId, l).then(function (a) {
                b.dataDetail = a.data.obj, m = a.data.obj, b.groupNames = b.dataDetail.group;
                var c = b.dataDetail.email, d = b.dataDetail.sex, e = b.dataDetail.mobile, f = b.dataDetail.tel;
                b.formEmails = c ? c.split(",") : [""], b.formMobiles = e ? e.split(",") : [""], b.formTels = f ? f.split(",") : [""], d && (b.sex = "男" == d ? b.sexOptions[1] : b.sexOptions[2])
            })
        }, b.getDataDetail(b.sceneId), b.updateData = function (a, c, d) {
            var e = a.name, f = {};
            if ("email" == e || "mobile" == e || "tel" == e) {
                f[e] = "";
                var g, h = [];
                for (g = 0; g < c.length; g++)c[g] && h.push(c[g]);
                for (g = 0; g < h.length - 1; g++)f[e] += h[g] + ",";
                f[e] += h[g]
            } else f[e] = b.dataDetail[e];
            m[e] = f[e]
        }, b.updateSex = function (a) {
            var c = {};
            c.id = b.sceneId, c.sex = 0 !== a.id ? a.name : "", m.sex = c.sex
        }, b.formEmails = [""], b.formMobiles = [""], b.formTels = [""], b.removeInputs = function (a, c, d) {
            if (d.length > 1) {
                if (!d[a])return void d.splice(a, 1);
                d.splice(a, 1), b.updateData({name: c}, d)
            } else 1 === d.length && "" !== d[0] && (d[a] = "", b.updateData({name: c}, d))
        }, b.addInputs = function (a) {
            a.push("")
        }, b.saveData = function (a) {
            delete a.group, j.saveData($.param(a)).then(function (a) {
                a.data.success && (alert("保存成功"), i.path("/main/customer"))
            })
        }, b.cancel = function () {
            i.path("/main/customer")
        }, b.groups = [], b.getGroups = function () {
            b.groups.length > 0 || j.getGroups().then(function (a) {
                b.groups = a.data.list
            }, function (a) {
                alert("服务器异常！")
            })
        }, b.getGroups(), b.deleteAssociation = function (a, c, d) {
            var e = {cId: a, gId: c};
            h.openConfirmDialog({msg: "确定解除组关联?"}, function () {
                j.deleteAssociation(e).then(function (a) {
                    if (a.data.success)for (var d = 0; d < b.groupNames.length; d++)b.groupNames[d].id == c && b.groupNames.splice(d, 1)
                }, function (a) {
                    alert("服务器异常!")
                })
            })
        }, b.addGroup = function () {
            g.open({windowClass: "group-console", templateUrl: "main/console/group.tpl.html", controller: "AddGroupCtrl"}).result.then(function (a) {
                b.groups.push(a)
            }, function () {
            })
        };
        var n = [];
        b.assignGroup = function () {
            for (var a = [], c = 0, d = b.groups.length; d > c; c++)if (b.groups[c].selected) {
                n.push(b.groups[c].id);
                var e = {id: b.groups[c].id, name: b.groups[c].name};
                a.push(e)
            }
            if (!n.length)return void alert("您还没有选择分组!");
            var f = {cIds: b.dataDetail.id, gIds: n};
            j.assignGroup(f).then(function (c) {
                if (c.data.success) {
                    o();
                    for (var d = 0; d < a.length; d++)if (b.groupNames.length > 0)for (var e = 0; e < b.groupNames.length && b.groupNames[e].id != a[d].id; e++)e == b.groupNames.length - 1 && b.groupNames.push(a[d]); else b.groupNames.push(a[d]);
                    k.pushForCurrentRoute("data.assign.success", "notify.success")
                }
            }, function () {
            })
        }, b.deleteGroup = function (a, c) {
            h.openConfirmDialog({msg: "确定删除此分组?"}, function () {
                j.deleteGroup(a.id).then(function (d) {
                    if (d.data.success) {
                        o(), b.groups.splice(c, 1);
                        for (var e = 0; e < b.groupNames.length; e++)b.groupNames[e].id == a.id && b.groupNames.splice(e, 1)
                    }
                }, function (a) {
                    alert("服务器异常!")
                })
            })
        };
        var o = function () {
            for (var a = 0, c = b.groups.length; c > a; a++)b.groups[a].selected = !1
        }
    }]), b.module("bindemail-dialog", []).controller("BindEmailDialogCtrl", ["$scope", function (a) {
    }]), b.module("confirm-dialog", []).controller("ConfirmDialogCtrl", ["$scope", "confirmObj", function (a, b) {
        a.confirmObj = b, a.ok = function () {
            a.$close()
        }, a.cancel = function () {
            a.$dismiss()
        }
    }]), b.module("message-dialog", []).controller("MessageDialogCtrl", ["$scope", "msgObj", function (a, b) {
        a.msgObj = b, a.close = function () {
            a.$close()
        }, a.cancel = function () {
            a.$dismiss()
        }
    }]), b.module("error", ["services.sample"]), b.module("error").controller("ErrorCtrl", ["$rootScope", "$http", "$scope", "$timeout", "security", "$window", "sampleService", function (a, b, c, d, e, f, g) {
    }]), b.module("home", ["services.sample", "app.directives.addelement", "services.scene", "app.directives.qrcode", "app.directives.loading"]), b.module("home").controller("HomeCtrl", ["$rootScope", "$http", "$scope", "$timeout", "security", "$window", "sampleService", "sceneService", "$routeParams", "$route", "$location", "configService", function (a, b, c, d, e, f, g, h, i, j, k, l) {
        c.showCode = !1, c.isAuthenticated = e.isAuthenticated, c.PREFIX_FILE_HOST = PREFIX_FILE_HOST, c.PREFIX_CLIENT_HOST = PREFIX_HOST, c.PREFIX_SERVER_HOST = PREFIX_URL, c.scene || (c.scene = {}), c.weiChatCode && e.weiChatLogin(c.weiChatCode).then(function (a) {
            200 == a.data.code && (k.path("main"), e.setLoginSuccess(!0))
        }), c.typeindex = "all", c.pageSize = 9, c.pageNo = 1, c.getHomes = function (a, b, d, e) {
            c.typeindex = a, g.getSamples(b, d, e).then(function (a) {
                c.homes = a.data.list
            }, function (a) {
            })
        }, c.getSceneType = function () {
            h.getSceneType().then(function (a) {
                c.sceneTypes = a.data.list
            })
        }, c.getSceneType(), c.getHomes("all", null, 1, 9);
        if (c.accessToken && c.expiresIn) {
            var m = "https://graph.qq.com/oauth2.0/me?access_token=" + c.accessToken;
            $.ajax({type: "get", url: m, dataType: "jsonp", jsonp: "jsoncallback", jsonpCallback: "callback", xhrFields: {withCredentials: !0}, success: function (a) {
                c.openId = a.openid, c.appId = a.client_id;
                var b = {email: "", password: "", openId: c.openId, accessToken: c.accessToken, type: "qq", expires: c.expiresIn};
                e.thirdPartLogin(b)
            }})
        }
        if (c.weiboAccessToken && c.weiboRemindIn && c.weiboExpires && c.weiboUId) {
            var n = {email: "", password: "", type: "weibo", openId: c.weiboUId, accessToken: c.weiboAccessToken, expires: c.weiboExpires};
            e.thirdPartLogin(n)
        }
        c.getBannerStyle = function () {
            return{width: 255 * c.imgArr.length + "px"}
        }, c.goLeft = function () {
            $(".img_box").is(":animated") || $(".img_box").css("left").split("px")[0] >= 0 || $(".img_box").animate({left: "+=255"}, 1e3)
        }, c.goRight = function () {
            $(".img_box").is(":animated") || parseInt($(".img_box").css("left").split("px")[0], 10) <= -($(".img_box").width() - 20 - 1e3) || $(".img_box").animate({left: "-=255"}, 1e3)
        }, d(function () {
            $(".banner1").animate({right: "0px"}, 200)
        }, 700), d(function () {
            $(".banner2").animate({right: "0px"}, 200)
        }, 1e3), d(function () {
            $(".banner3").animate({right: "0px"}, 200, function () {
                $(".banner_left").fadeIn(800)
            })
        }, 1300), c.load2 = function () {
            $("#eq_main").scroll(function () {
                s = $("#eq_main").scrollTop(), s > 100 ? $(".scroll").css("display", "block") : $(".scroll").css("display", "none")
            })
        }, c.getSamplesPV = function () {
            g.getSamplesPV().then(function (a) {
                c.SamplesPVs = a.data, c.dayTop = c.SamplesPVs.obj.dayTop, c.monthTop = c.SamplesPVs.obj.monthTop, c.weekTop = c.SamplesPVs.obj.weekTop, c.page = "month"
            }, function (a) {
            })
        }, l.getFriendLinks().then(function (a) {
            c.friendLinks = a.data.list, c.friendLinks.length > 15 && (c.friendLinks.length = 15)
        })
    }]), b.module("customer.group", ["services.data"]), b.module("customer.group").controller("AddGroupCtrl", ["$rootScope", "$scope", "$window", "$routeParams", "dataService", "security", "$modal", "ModalService", "$location", function (a, b, c, d, e, f, g, h, j) {
        b.group = {}, b.confirm = function () {
            if (!b.group.name)return void alert("请输入分组名称");
            var a = i(b.group.name);
            if (a > 12)return void alert("分组名称不能大于12个字符！");
            var c = {name: b.group.name};
            e.createGroup(c).then(function (a) {
                a.data.success && b.$close({id: a.data.obj, name: b.group.name})
            }, function () {
            })
        }, b.cancel = function () {
            b.$dismiss()
        }
    }]), b.module("main.transferScene", ["services.usercenter"]), b.module("main.transferScene").controller("TransferSceneCtrl", ["$scope", "$rootScope", "sceneService", "sceneId", function (a, b, c, d) {
        a.model = {toUser: ""}, a.confirm = function () {
            return a.model.toUser ? a.model.toUser == b.user.email ? void(a.actionerror = "不能转送自己") : void c.transferScene(d.sceneId, a.model.toUser).then(function (b) {
                200 == b.data.code ? a.$close() : a.actionerror = b.data.msg
            }) : void(a.actionerror = "账号不能为空")
        }, a.cancel = function () {
            a.$dismiss()
        }
    }]), b.module("main.data", ["app.directives.dataDraggable", "customer.group", "services.i18nNotifications", "app.directives.customer"]), b.module("main.data").controller("CustomerCtrl", ["$scope", "$route", "$location", "dataService", "$modal", "ModalService", "i18nNotifications", "security", "$rootScope", function (a, b, c, d, e, f, g, h, i) {
        function j(b) {
            b || (b = 1), d.getAllData(b, k).then(function (b) {
                a.customerDatas = b.data.list, a.totalItems = b.data.map.count, a.model.currentPage = b.data.map.pageNo, a.toPage = ""
            })
        }

        a.PREFIX_URL = PREFIX_URL, a.isActive = "customer", a.select = 0, a.showBranchSelect = !0;
        var k = i.branchid;
        a.toPage = 1, a.model = {}, a.exportUrl = "m/c/exp" + (k ? "?user=" + k : ""), a.staticFileds = [
            {id: "name", name: "姓名"},
            {id: "mobile", name: "手机"},
            {id: "email", name: "邮箱"},
            {id: "sex", name: "性别"},
            {id: "company", name: "公司"},
            {id: "job", name: "职位"},
            {id: "address", name: "地址"},
            {id: "tel", name: "电话"},
            {id: "website", name: "个人网站"},
            {id: "qq", name: "QQ"},
            {id: "weixin", name: "微信"},
            {id: "remark", name: "其它"}
        ], a.selectScene = function (b, c) {
            a.selectedSceneId = b, d.getSceneField(b).then(function (b) {
                a.fields = b.data.list, a.select = c, $(".list_attribute").html("拖拽到此处")
            })
        }, a.clickScene = function () {
            c.path("main")
        }, a.clickSpread = function () {
            c.path("main/spread")
        }, a.clickCustomer = function () {
            c.path("main/customer")
        }, a.editCustomer = function (b) {
            a.getDataDetail(b.id), a.editData = !0
        }, a.removeCustomer = function (b) {
            f.openConfirmDialog({msg: "确定删除此条数据?"}, function () {
                d.deleteDataById(b.id).then(function () {
                    j(1 === a.customerDatas.length && a.model.currentPage > 1 ? a.model.currentPage - 1 : a.model.currentPage), m()
                })
            })
        }, a.addColor = function (b) {
            a.trIndex = b
        }, a.removeColor = function () {
            a.trIndex = -1
        }, a.totalItems = 0, a.model.currentPage = 0, a.toPage = "", a.pageChanged = function (b) {
            return 1 > b || b > a.totalItems / 10 + 1 ? void alert("此页超出范围") : void j(b)
        }, a.editCustom = function (a, b) {
            c.path("/main/customer/" + a.id)
        };
        var l = function () {
            d.getProspectDataAccount(k).then(function (b) {
                a.prospectDataAccount = b.data.obj
            })
        }, m = function () {
            d.getAllDataCount(k).then(function (b) {
                a.allDataCount = b.data.obj
            })
        };
        a.importDatas = function () {
            d.getPremergeScenes(k).then(function (b) {
                a.importDatas = b.data.list, b.data.list.length > 0 && a.selectScene(b.data.list[0].ID, 0)
            })
        }, a.associateData = {};
        var n = !0;
        if (a.confirm = function () {
            n ? jQuery.isEmptyObject(a.associateData, {}) ? (alert("请导入数据！"), n = !0) : (d.mergeSceneData(a.selectedSceneId, a.associateData).then(function () {
                alert("你已成功导入客户！"), b.reload()
            }, function () {
            }), n = !1) : alert("请不要重复提交！")
        }, a.importDatas(), l(), m(), j(0), a.isAllowedToAccessGrouping = h.isAllowToAccess(h.accessDef.GROUP_CUSTOMER), a.isAllowedToAccessGrouping) {
            a.allImages = {selected: !1}, a.selectAll = function () {
                for (var b = 0, c = a.customerDatas.length; c > b; b++)a.customerDatas[b].selected = a.allImages.selected
            }, a.selectCustomer = function (b) {
                b.selected || (a.allImages.selected = !1)
            }, a.groups = [], a.getGroups = function () {
                a.groups.length > 0 || d.getGroups().then(function (b) {
                    a.groups = b.data.list
                }, function (a) {
                    alert("服务器异常！")
                })
            }, a.getGroups(), a.addGroup = function () {
                e.open({windowClass: "group-console", templateUrl: "main/console/group.tpl.html", controller: "AddGroupCtrl"}).result.then(function (b) {
                    a.groups.unshift(b), r(), g.pushForCurrentRoute("group.create.success", "notify.success")
                }, function () {
                })
            };
            var o = [], p = [];
            a.assignGroup = function () {
                o = [], p = [];
                for (var b = 0, c = a.customerDatas.length; c > b; b++)a.customerDatas[b].selected && o.push(a.customerDatas[b].id);
                for (b = 0, c = a.groups.length; c > b; b++)a.groups[b].selected && p.push(a.groups[b].id);
                if (!o.length)return void alert("您还没有选择客户!");
                if (!p.length)return void alert("您还没有选择分组!");
                var e = {cIds: o, gIds: p};
                d.assignGroup(e).then(function (b) {
                    b.data.success && (r(), a.allImages.selected = !1, q(), g.pushForCurrentRoute("data.assign.success", "notify.success"))
                }, function () {
                })
            }, a.deleteCustomer = function (b) {
                o = [];
                var c, e;
                if (b)c = {ids: b.id}, e = "确认删除此条数据？"; else {
                    for (var h = 0, i = a.customerDatas.length; i > h; h++)a.customerDatas[h].selected && o.push(a.customerDatas[h].id);
                    if (!o.length)return void alert("您还没有选择客户！");
                    c = {ids: o}, e = "确认删除选中数据？"
                }
                f.openConfirmDialog({msg: e}, function () {
                    d.deleteCustomer(c).then(function (b) {
                        b.data.success && (a.allImages.selected = !1, q(), r(), g.pushForCurrentRoute("data.delete.success", "notify.success"))
                    }, function (a) {
                        alert("服务器异常！")
                    })
                })
            }, a.deleteGroup = function (b, c) {
                f.openConfirmDialog({msg: "确定删除此分组?"}, function () {
                    d.deleteGroup(b.id).then(function (b) {
                        b.data.success && (a.groups.splice(c, 1), r(), g.pushForCurrentRoute("group.delete.success", "notify.success"))
                    }, function (a) {
                        alert("服务器异常!")
                    })
                })
            };
            var q = function () {
                j(1 === a.customerDatas.length && a.model.currentPage > 1 ? a.model.currentPage - 1 : a.model.currentPage)
            }, r = function () {
                for (var b = 0, c = a.groups.length; c > b; b++)a.groups[b].selected = !1
            }
        }
        a.$watch("model.currentPage", function (b, c) {
            b && b != c && (a.model.toPage = b)
        }, !0)
    }]), b.module("main", ["services.mine", "services.data", "app.directives.pageTplTypes", "app.directives.addelement", "main.spread", "main.data", "main.spread.detail", "main.transferScene", "services.usercenter", "main.userGuide", "app.directives.qrcode", "services.i18nNotifications"]), b.module("main").controller("MainCtrl", ["$rootScope", "$scope", "$location", "security", "MineService", "dataService", "sceneService", "ModalService", "$modal", "usercenterService", "i18nNotifications", function (a, b, c, d, e, f, g, h, i, j, k) {
        b.PREFIX_URL = PREFIX_URL, b.PREFIX_CLIENT_HOST = PREFIX_HOST, b.client_cdn = CLIENT_CDN, b.scene = {type: {}}, b.pageSize = 12, b.showCloseStatus = [], b.showOpenStatus = [], b.isActive = "main", b.loginSuccess = d.isLoginSuccess, b.showBranchSelect = !0, b.$watch("user.loginName", function (a, c) {
            if (a) {
                var d = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                b.loginSuccess && "eqs" == a.substr(0, 3) && !d.test(a) && k.pushForCurrentRoute("rel.tip", "notify.tip")
            }
        });
        var l = a.branchid;
        b.editScene = function (a) {
            c.path("scene/create/" + a).search("pageId", 1)
        }, b.openScene = function (a, b) {
            l || (b ? g.openScene(a.id).then(function (b) {
                b.data.success && (a.status = 1)
            }) : g.closeScene(a.id).then(function (b) {
                b.data.success && (a.status = 2)
            }))
        }, b.addColor = function (a) {
            b.trIndex = a
        }, b.removeColor = function () {
            b.trIndex = -1
        }, b.sceneSettings = function (a) {
            c.path("my/sceneSetting/" + a)
        }, b.clickScene = function () {
            c.path("main")
        }, b.clickSpread = function () {
            c.path("main/spread")
        }, b.creatCompanyTpl = function (a, c) {
            g.createCompanyTpls(a).then(function (a) {
                a.data.success && (b.myScenes[c].isTpl = 3, k.pushForCurrentRoute("scene.save.success.companyTpl", "notify.success"))
            })
        }, b.clearCompanyTpl = function (a, c) {
            g.clearCompanyTpls(a).then(function (a) {
                a.data.success && (b.myScenes[c].isTpl = 0, k.pushForCurrentRoute("scene.clear.success.companyTpl", "notify.success"))
            })
        }, b.clickCustomer = function () {
            c.path("main/customer")
        }, b.register = d.getRegisterInfo(), b.logout = function () {
            d.logout()
        }, b.copyScene = function (a) {
            h.openConfirmDialog({msg: "确定复制此场景?"}, function () {
                g.copySceneById(a).then(function (a) {
                   if(a.data.code == 1006){
								alert("您的"+a.data.msg+"次创建场景次数已经用完，请联系管理员！")
								return false;
							}
                    c.path("scene/create/" + a.data.obj).search("pageId", 1)
                })
            })
        }, b.isAllowedToAccessTransfer = d.isAllowToAccess(d.accessDef.TRANSFER_SCENE), b.isAllowedToAccessTransfer && (b.transferScene = function (c) {
            "eqs" == a.user.loginName.substr(0, 3) && null == a.user.email ? h.openBindEmailDialog() : i.open({windowClass: "", templateUrl: "main/console/transferscene.tpl.html", controller: "TransferSceneCtrl", resolve: {sceneId: function () {
                return{sceneId: c}
            }}}).result.then(function () {
                b.getMyScenes()
            }, function () {
            })
        }), b.deleteScene = function (a) {
            h.openConfirmDialog({msg: "确定删除此场景?"}, function () {
                g.deleteSceneById(a).then(function () {
                    b.getMyScenes(b.currentPage)
                })
            })
        }, b.getStyle = function (a) {
            return{"background-image": "url(" + PREFIX_FILE_HOST + a + ")"}
        }, b.getMyScenes = function (a) {
            e.getMyScenes(b.scene.type ? b.scene.type.value : "0", a, b.pageSize, l).then(function (a) {
                a.data.list && a.data.list.length > 0 ? (b.myScenes = a.data.list, b.totalItems = a.data.map.count, b.currentPage = a.data.map.pageNo, b.allPageCount = a.data.map.count, b.toPage = "") : b.currentPage > 1 ? b.getMyScenes(--b.currentPage) : (b.myScenes = [], b.allPageCount = 0)
            })
        }, b.pageChanged = function (a) {
            return 1 > a || a > b.totalItems / 10 + 1 ? void alert("此页超出范围") : void b.getMyScenes(a)
        }, b.getTdStyle = function (a) {
            var b = $(".header_table td:eq(" + a + ")").outerWidth();
            return{width: b + "px", maxWidth: b + "px"}
        };
        var m = function () {
            f.getAllDataCount(l).then(function (a) {
                b.allDataCount = a.data.obj
            })
        }, n = function () {
            f.getAllSceneDataCount(l).then(function (a) {
                b.allSceneDataCount = a.data.obj
            })
        };
        n(), b.getMyScenes(), m(), g.getSceneType().then(function (a) {
            b.scene.types = a.data.list
        }), b.dataDetail = {};
        var o = function () {
            f.getProspectDataAccount(l).then(function (a) {
                b.prospectDataAccount = a.data.obj
            })
        };
        o();
        var p = function () {
            f.getAllPageView(l).then(function (a) {
                b.allPageView = a.data.obj
            })
        };
        p(), b.showDetail = function (a) {
            c.path("my/scene/" + a)
        }, b.$on("$destroy", function () {
            d.setLoginSuccess(!1)
        }), b.totalItems = 0, b.currentPage = 0, b.toPage = "", b.publishScene = function (a, b) {
            b && b.stopPropagation(), g.publishScene(a.id).then(function (b) {
                b.data.success && (a.publishTime = (new Date).getTime(), k.pushForCurrentRoute("scene.publish.success", "notify.success"))
            })
        }
    }]), b.module("main.spread", ["app.directives.pieChart", "app.directives.numChangeAnim"]), b.module("main.spread").controller("SpreadCtrl", ["$scope", "$location", "MineService", "dataService", "$rootScope", function (a, b, c, d, e) {
        a.isActive = "spread", a.showBranchSelect = !0;
        var f = e.branchid;
        a.clickScene = function () {
            b.path("main")
        }, a.clickSpread = function () {
            b.path("main/spread")
        }, a.clickCustomer = function () {
            b.path("main/customer")
        }, a.addColor = function (b) {
            a.trIndex = b
        }, a.removeColor = function () {
            a.trIndex = -1
        }, a.getMyScenes = function (d) {
            c.getMyScenes(null, d, 10, f).then(function (c) {
                c.data.list && c.data.list.length > 0 && (a.allPageCount = c.data.map.count, (!c.data.list || c.data.list.length <= 0) && b.path("scene"), a.spreadDatas = c.data.list, a.totalItems = c.data.map.count, a.currentPage = c.data.map.pageNo, a.toPage = "")
            })
        }, a.pageChanged = function (b) {
            return 1 > b || b > a.totalItems / 10 + 1 ? void alert("此页超出范围") : void a.getMyScenes(b)
        }, a.viewDetail = function (a) {
            b.path("/main/spread/" + a.id)
        }, d.getOpenCount(f).then(function (b) {
            a.openCount = b.data.obj
        }), d.getAllPageView(f).then(function (b) {
            a.allPageView = b.data.obj, a.allPageViewData = [
                {value: b.data.obj, color: "#08a1ef", highlight: "#78cbf5", label: "场景展示"}
            ], d.getAllSceneDataCount(f).then(function (b) {
                a.allSceneDataCount = b.data.obj, a.dataRatio = 0 === a.allPageView ? 0 : 100 * (a.allSceneDataCount / a.allPageView).toFixed(2), a.allSceneDataCountData = [
                    {value: a.allSceneDataCount, color: "#9ad64b", highlight: "#c3f286", label: "收集数据"}
                ], a.dataConversionRateData = [
                    {value: (a.allSceneDataCount / a.allPageView).toFixed(2), color: "#68dcc7", highlight: "#92f5e3", label: "转化率"}
                ]
            })
        }), a.totalItems = 0, a.currentPage = 0, a.toPage = "", a.getMyScenes()
    }]), b.module("main.spread.detail", ["services.spread", "app.directives.lineChart", "app.directives.pieChart", "app.directives.numChangeAnim"]), b.module("main.spread.detail").controller("SpreadDetailCtrl", ["$scope", "$location", "$routeParams", "sceneService", "SpreadService", "$rootScope", function (a, b, c, d, e, f) {
        a.PREFIX_FILE_HOST = PREFIX_FILE_HOST, a.PREFIX_CLIENT_HOST = PREFIX_HOST, a.PREFIX_SERVER_HOST = PREFIX_URL;
        var g = f.branchid, h = c.sceneId;
        a.spreadViewGridOptions = {headerRowHeight: 50, rowHeight: 50, enableScrollbars: !1, enableColumnMenu: !1, disableColumnMenu: !0}, a.spreadViewGridOptions.columnDefs = [
            {name: "STAT_DATE", displayName: "统计时间"},
            {name: "SHOW", displayName: "展示次数"},
            {name: "DATA", displayName: "收集数据"}
        ], a.spreadMobileGridOptions = {headerRowHeight: 50, rowHeight: 50, enableScrollbars: !1, enableColumnMenu: !1, disableColumnMenu: !0}, a.spreadMobileGridOptions.columnDefs = [
            {name: "STAT_DATE", displayName: "统计时间"},
            {name: "S_WX_TIMELINE", displayName: "朋友圈"},
            {name: "S_WX_GROUP", displayName: "微信群"},
            {name: "S_WX_SINGLE", displayName: "微信朋友"}
        ], a.spreadClickGridOptions = {headerRowHeight: 50, rowHeight: 50, enableScrollbars: !1, enableColumnMenu: !1, disableColumnMenu: !0}, a.spreadClickGridOptions.columnDefs = [
            {name: "STAT_DATE", displayName: "统计时间"},
            {name: "LINK", displayName: "链接点击"},
            {name: "TEL", displayName: "电话直拨点击"}
        ];
        var i = function () {
            d.getSceneDetail(h, g).then(function (b) {
                a.scene = b.data.obj, a.url = PREFIX_HOST + "v-" + a.scene.code, a.getLast7dayStats()
            }, function () {
            })
        }, j = function (b, c) {
            e.getDataBySceneId(h, b, c, 30, 0, g).then(function (b) {
                a.pageView = 0, a.stats = b.data.list, a.spreadViewGridOptions.data = a.stats, a.spreadMobileGridOptions.data = a.stats, a.spreadClickGridOptions.data = a.stats, a.viewLineChartData = {labels: [], datasets: [
                    {label: "1", fillColor: "rgba(220,220,220,0.2)", strokeColor: "rgba(220,220,220,1)", pointColor: "rgba(220,220,220,1)", pointStrokeColor: "#fff", pointHighlightFill: "#fff", pointHighlightStroke: "rgba(220,220,220,1)", data: []}
                ]}, a.dataLineChartData = {labels: [], datasets: [
                    {label: "2", fillColor: "rgba(220,220,220,0.2)", strokeColor: "rgba(220,220,220,1)", pointColor: "rgba(220,220,220,1)", pointStrokeColor: "#fff", pointHighlightFill: "#fff", pointHighlightStroke: "rgba(220,220,220,1)", data: []}
                ]};
                for (var c = 0, d = 0, e = 0, f = 0, g = 0, h = 0; h < a.stats.length; h++)a.viewLineChartData.labels.push(a.stats[h].STAT_DATE), a.viewLineChartData.datasets[0].data.push(a.stats[h].SHOW), a.dataLineChartData.labels.push(a.stats[h].STAT_DATE), a.dataLineChartData.datasets[0].data.push(a.stats[h].DATA), a.pageView += a.stats[h].SHOW, c += a.stats[h].S_MOBILE, d += a.stats[h].S_WX_TIMELINE, e += a.stats[h].S_WX_SINGLE, f += a.stats[h].S_WX_GROUP;
                a.viewLineChartData.labels && 1 == a.viewLineChartData.labels.length && (a.viewLineChartData.labels.unshift("更早"), a.viewLineChartData.datasets[0].data.unshift(0)), a.dataLineChartData.labels && 1 == a.dataLineChartData.labels.length && (a.dataLineChartData.labels.unshift("更早"),
                    a.dataLineChartData.datasets[0].data.unshift(0)), g = c - d - e - f, a.timelineData = d, a.weixinData = e, a.weixinGroupData = f, $(".myGrid1").height(50 * (a.stats.length + 1) + 1), $(".myGrid1 .ui-grid-viewport").height(50 * a.stats.length + 1)
            }, function () {
            })
        }, k = function (a) {
            var b = new Date;
            return b.setDate(b.getDate() + a), b.setHours(0), b.setMinutes(0), b.setSeconds(0), b.setMilliseconds(0), b.getTime()
        };
        a.getAllStats = function () {
            j()
        }, a.getLastdayStats = function () {
            j(k(-1), k(0))
        }, a.getLast7dayStats = function () {
            j(k(-6), k(1))
        }, a.getLast30dayStats = function () {
            j(k(-29), k(0))
        }, a.clickScene = function () {
            b.path("main")
        }, a.clickSpread = function () {
            b.path("main/spread")
        }, a.clickCustomer = function () {
            b.path("main/customer")
        }, i(), a.expandWebs = new Array([1]), a.addWeb = function (a) {
            a.push("")
        }, a.updataData = function (a) {
        }, a.deleteWeb = function (a, b) {
            b.length > 1 ? b.splice(a, 1) : 1 === b.length && "" !== b[0] && (b[a] = "")
        }
    }]), function () {
        b.module("main.userGuide", []).controller("userGuideCtrl", ["$rootScope", "$scope", function (b, c) {
            if (a.localStorage) {
                var d = JSON.parse(localStorage.getItem("loginInfo"));
                d && d[b.user.id] ? c.firstLogin = !1 : (c.firstLogin = !0, d = d || {}, d[b.user.id] = 1, localStorage.setItem("loginInfo", JSON.stringify(d)))
            }
        }])
    }(), b.module("my", ["my.scene", "my.scenesetting"]), b.module("my.scene", ["services.scene", "services.mine", "services.data", "scene.create.console", "app.directives.addelement", "services.usercenter", "app.directives.qrcode"]), b.module("my.scene").controller("MySceneCtrl", ["$anchorScroll", "$route", "$location", "$rootScope", "$window", "$scope", "$routeParams", "sceneService", "MineService", "dataService", "$sce", "$modal", "usercenterService", "security", "pageTplService", function (b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
        function q(a, b, c) {
            k.getDataBySceneId(a, b, c, r).then(function (a) {
                g.dataHeader = a.data.list.shift(), g.dataList = a.data.list, g.totalItems = a.data.map.count, g.currentPage = a.data.map.pageNo
            })
        }

        g.loading = !1, g.url = "", g.sceneId = h.sceneId, g.isVendorUser = e.isVendorUser, g.isAllowToAccessLastPageSetting = o.isAllowToAccess(o.accessDef.SCENE_HIDE_LASTPAGE_SETTING);
        var r = e.branchid;
        g.exportUrl = "m/scene/excel/" + g.sceneId + (r ? "?user=" + r : "");
        var s = 0;
        g.PREFIX_FILE_HOST = PREFIX_FILE_HOST, g.PREFIX_URL = PREFIX_URL, g.alwaysOpen = !0;
        g.scene || (g.scene = {});
        var t, u;
        document.getElementById("sharescript") ? ($("#sharescript").remove(), t = document.getElementsByTagName("head")[0], u = document.createElement("script"), u.id = "sharescript", u.src = "http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=" + ~(-new Date / 36e5), t.appendChild(u)) : (t = document.getElementsByTagName("head")[0], u = document.createElement("script"), u.id = "sharescript", u.src = "http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=" + ~(-new Date / 36e5), t.appendChild(u)), g.getSceneDetail = function () {
            i.getSceneDetail(g.sceneId, r).then(function (b) {
                g.scene = b.data.obj, g.scene.applyPromotion = "" + g.scene.applyPromotion, g.scene.applyTemplate = "" + g.scene.applyTemplate, g.code = PREFIX_URL + "eqs/qrcode/" + g.scene.code + ".png", g.url = PREFIX_HOST + "v-" + g.scene.code, g.customUrl = l.trustAsResourceUrl(PREFIX_HOST + "v-" + g.scene.id + "&preview=preview"), r && (g.customUrl += "&branchid=" + r), a._bd_share_config = {common: {bdText: g.scene.name, bdDesc: g.scene.name, bdUrl: g.url, bdSign: "on", bdSnsKey: {}}, share: [
                    {bdSize: 32}
                ], slide: [
                    {bdImg: 0, bdPos: "right", bdTop: 100}
                ]}, s = g.scene.pageCount, 2 == g.scene.status ? (g.showOpenSceneBtn = !0, g.showCloseSceneBtn = !1) : 1 == g.scene.status && (g.showOpenSceneBtn = !1, g.showCloseSceneBtn = !0)
            })
        }, g.getSceneDetail(), g.publishScene = function (a) {
            g.scene.publishTime && g.scene.publishTime >= g.scene.updateTime ? alert("场景已发布！") : i.publishScene(a).then(function (a) {
                a.data.success && alert("场景发布成功")
            })
        }, g.closeScene = function (a) {
            i.closeScene(a).then(function (a) {
                g.showOpenSceneBtn = !0, g.showCloseSceneBtn = !1
            })
        }, g.openScene = function (a) {
            i.openScene(a).then(function (a) {
                g.showOpenSceneBtn = !1, g.showCloseSceneBtn = !0
            })
        }, g.totalItems = 0, g.currentPage = 1, g.toPage = "", g.pageChanged = function (a) {
            return 1 > a || a > g.totalItems / 10 + 1 ? void alert("此页超出范围") : void q(g.sceneId, a, 10)
        }, g.getTdStyle = function (a) {
            var b = $(".header_table td:eq(" + a + ")").outerWidth();
            return{width: b + "px", maxWidth: b + "px"}
        }, q(g.sceneId, g.currentPage, 10);
        var v = new ZeroClipboard(document.getElementById("copy-button"), {moviePath: "assets/ZeroClipboard.swf"});
        v.on("dataRequested", function (a, b) {
            a.setText(g.url), setTimeout(function () {
                alert("复制成功")
            }, 500)
        }), g.goData = function () {
            d.hash("collectData"), b()
        }
    }]), b.module("my.scenesetting", ["services.scene", "services.mine", "services.data", "scene.create.console", "app.directives.addelement", "services.usercenter", "services.i18nNotifications"]), b.module("my.scenesetting").controller("SceneSettingCtrl", ["$route", "$location", "$rootScope", "$window", "$scope", "$routeParams", "sceneService", "MineService", "dataService", "$sce", "$modal", "usercenterService", "security", "pageTplService", "i18nNotifications", function (a, c, d, e, f, g, h, j, k, l, m, n, o, p, q) {
        f.loading = !1, f.url = "", f.sceneId = g.sceneId, f.isVendorUser = d.isVendorUser, f.isAllowToAccessLastPageSetting = o.isAllowToAccess(o.accessDef.SCENE_HIDE_LASTPAGE_SETTING);
        var r = d.branchid, s = 0;
        f.PREFIX_FILE_HOST = PREFIX_FILE_HOST, f.alwaysOpen = !0;
        var t;
        f.scene || (f.scene = {}), f.switchOpen = function () {
            f.alwaysOpen && (f.startDate = null, f.endDate = null)
        }, f.openImageModal = function () {
            m.open({windowClass: "img_console console", templateUrl: "scene/console/bg.tpl.html", controller: "BgConsoleCtrl", resolve: {obj: function () {
                return{fileType: 1, elemDef: null, coverImage: "coverImage"}
            }}}).result.then(function (a) {
                f.newCoverImage = a, f.newCoverImage.tmbPath = a.data, f.newCoverImage.path = a.data, f.coverImages.unshift(f.newCoverImage), f.scene.image.imgSrc = f.newCoverImage.path
            }, function (a) {
            })
        }, f.chooseCover = function (a) {
            f.scene.image.imgSrc = a.path
        }, f.openmin = function (a) {
            a.preventDefault(), a.stopPropagation(), f.openedmax = !1, f.openedmin = !0, f.minDateStart = new Date, f.maxDateStart = f.endDate ? new Date(new Date(f.endDate).getTime() - 864e5) : null
        }, f.openmax = function (a) {
            a.preventDefault(), a.stopPropagation(), f.openedmin = !1, f.openedmax = !0, f.minDateEnd = f.startDate ? new Date(new Date(f.startDate).getTime() + 864e5) : new Date
        }, f.dateOptions = {formatYear: "yy", startingDay: 1}, f.formats = ["dd-MMMM-yyyy", "yyyy/MM/dd", "dd.MM.yyyy", "shortDate"], f.format = f.formats[1], f.saveSceneSettings = function (a) {
            if (f.startDate && !f.endDate)return void(f.invalidText = "请选择结束时间");
            if (f.endDate && !f.startDate)return void(f.invalidText = "请选择结束时间");
            if (f.scene.description && f.scene.description.trim().length > 30)return void(f.invalidText = "场景描述不能超过30个字");
            if (!f.scene.name || !f.scene.name.trim())return void(f.invalidText = "请填写场景名称");
            var e = i(f.scene.name.trim());
            return e > 48 ? void alert("场景名称不能超过48个字符或24个汉字") : f.scene.property && f.scene.property.bottomLabel && f.scene.property.bottomLabel.name && i(f.scene.property.bottomLabel.name) > 16 ? void alert("自定义名称不能超过16个字符") : f.scene.property && f.scene.property.bottomLabel && !f.scene.property.bottomLabel.name && f.scene.property.bottomLabel.url && "http://" != f.scene.property.bottomLabel.url ? void alert("请输入自定义底标名称") : (f.startDate && f.endDate && (f.scene.startDate = f.startDate.getTime(), f.scene.endDate = f.endDate.getTime()), f.startDate && f.endDate || (f.scene.startDate = null, f.scene.endDate = null), f.scene.type = f.scene.type.value, f.scene.pageMode = f.scene.pageMode.id, f.scene.property = b.toJson(f.scene.property), void h.saveSceneSettings(f.scene).then(function (a) {
                q.pushForNextRoute("scene.setting.success", "notify.success"), c.path("my/scene/" + f.sceneId).search({}), d.showSetScenePanel = !1
            }, function (a) {
            }))
        }, f.getSceneDetail = function () {
            h.getSceneDetail(f.sceneId, r).then(function (a) {
                f.scene = a.data.obj, f.scene.applyPromotion = "" + f.scene.applyPromotion, f.scene.applyTemplate = "" + f.scene.applyTemplate, f.scene.isTpl = "" + f.scene.isTpl, 2 == a.data.obj.pageMode && (a.data.obj.pageMode = 0), f.scene.property = f.scene.property ? JSON.parse(f.scene.property) : {}, b.forEach(f.pagemodes, function (b, c) {
                    a.data.obj.pageMode == b.id && (f.scene.pageMode = b)
                }), f.code = PREFIX_URL + "eqs/qrcode/" + f.scene.code + ".png", f.url = PREFIX_HOST + "v-" + f.scene.code, f.customUrl = l.trustAsResourceUrl(PREFIX_HOST + "v-" + f.scene.id + "&preview=preview"), r && (f.customUrl += (/\?/.test(url) ? "&" : "?") + "user=" + r), f.hideAd = f.scene.image.hideEqAd ? !0 : !1, s = f.scene.pageCount, f.scene.startDate && f.scene.endDate && (f.startDate = new Date(f.scene.startDate), f.endDate = new Date(f.scene.endDate), f.alwaysOpen = !1), h.getSceneType().then(function (a) {
                    f.types = a.data.list, b.forEach(f.types, function (a, b) {
                        a.value == f.scene.type && (f.scene.type = a)
                    })
                }), h.getCoverImages().then(function (a) {
                    f.coverImages = a.data.list;
                    for (var b, c = 0; c < f.coverImages.length; c++) {
                        if (f.scene.image.imgSrc == f.coverImages[c].path) {
                            t = f.coverImages[c], f.coverImages.splice(c, 1), b = 0;
                            break
                        }
                        t = {tmbPath: f.scene.image.imgSrc, path: f.scene.image.imgSrc}, b = 1
                    }
                    f.coverImages.unshift(t)
                })
            })
        }, f.getSceneDetail(), f.pagemodes = [
            {id: 0, name: "上下翻页"},
            {id: 1, name: "上下惯性翻页"},
            {id: 4, name: "左右翻页"},
            {id: 3, name: "左右惯性翻页"},
            {id: 5, name: "左右连续翻页"}
        ], f.scene.pageMode = f.pagemodes[0], f.getUserXd = function () {
            n.getUserXd().then(function (a) {
                f.userXd = a.data.obj
            })
        }, f.getUserXd(), f.hideAdd = function (a) {
            return f.userXd < 100 && (f.scene.image.hideEqAd || a) ? (alert("秀点不足！"), void(f.scene.image.hideEqAd = !1)) : void(a && (f.scene.property.bottomLabel = {}, f.scene.image.hideEqAd = !0))
        }, p.getPageTpls(1301).then(function (a) {
            f.pageTpls = a.data.list && a.data.list.length > 0 ? a.data.list : []
        }), p.getPageTpls(1311).then(function (a) {
            f.bottomPageTpls = a.data.list && a.data.list.length > 0 ? a.data.list : []
        }), f.chooseLastPage = function (a) {
            f.scene.image.lastPageId = a
        }, f.chooseBottomLabel = function (a) {
            f.scene.image.hideEqAd = !1, f.scene.property.bottomLabel || (f.scene.property.bottomLabel = {}), f.scene.property.bottomLabel.id = a, a || (f.scene.property.bottomLabel = {})
        }
    }]), b.module("scene.my.upload", ["angularFileUpload"]), b.module("scene.my.upload").controller("UploadCtrl", ["$scope", "FileUploader", "fileService", "category", "$timeout", "$interval", function (a, b, c, d, e, f) {
        a.category = d;
        var g;
        g = a.uploader = new b(a.category.scratch || a.category.headerImage || a.category.companyImg ? {
            //url: PREFIX_URL + "m/base/file/upload?bizType=" + d.categoryId + "&fileType=" + d.fileType,
            url: JSON_URL + "?c=upfile&a=upload&ID=" + getCookie("USERID") + "&keycode=" + getCookie("MD5STR") + "&bizType=" + d.categoryId + "&fileType=" + d.fileType,
            withCredentials: !0, queueLimit: 1, onSuccessItem: function (b, c, d, e) {
            function g() {
                f.cancel(h), alert("上传完毕"), a.$close(c.obj.path)
            }

            a.progressNum = 0;
            var h = f(function () {
                a.progressNum < 100 ? a.progressNum += 15 : g()
            }, 100)
        }} : {
            //url: PREFIX_URL + "m/base/file/upload?bizType=" + d.categoryId + "&fileType=" + d.fileType,
            url: JSON_URL + "?c=upfile&a=upload"  + "&bizType=" + d.categoryId + "&fileType=" + d.fileType,
            withCredentials: !0, queueLimit: 5, onCompleteAll: function () {
            function b() {
                f.cancel(c), alert("上传完毕"), a.$close()
            }

            a.progressNum = 0;
            var c = f(function () {
                a.progressNum < 100 ? a.progressNum += 15 : b()
            }, 100)
        }});
        var h;
        ("0" == d.fileType || "1" == d.fileType) && (h = "|jpg|png|jpeg|bmp|gif|", limitSize = 3145728), "2" == d.fileType && (h = "|mp3|mpeg|", limitSize = 3145728), g.filters.push({name: "imageFilter", fn: function (a, b) {
            var c = "|" + a.type.slice(a.type.lastIndexOf("/") + 1) + "|";
            return-1 !== h.indexOf(c)
        }}), g.filters.push({name: "imageSizeFilter", fn: function (a, b) {
            var c = a.size;
            return c >= limitSize && alert("上传文件大小限制在" + limitSize / 1024 / 1024 + "M以内"), c < limitSize
        }}), g.filters.push({name: "fileNameFilter", fn: function (a, b) {
            return a.name.length > 50 && alert("文件名应限制在50字符以内"), a.name.length <= 50
        }});
        var i = function () {
            c.listFileCategory().then(function (b) {
                a.categoryList = b.data.list, a.categoryList || (a.categoryList = []), a.categoryList.push({name: "我的背景", value: "0"})
            })
        };
        i(), a.removeQueue = function () {
        }
    }]), b.module("reg", []), b.module("reg").controller("TestLoginCtrl", ["$rootScope", "$scope", function (a, b) {
        b.weiChatUrl = "https://open.weixin.qq.com/connect/qrconnect?appid=wxc5f1bbae4bb93ced&redirect_uri=http://www.hjtmt.com/testlogin.html&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect"
    }]), b.module("sample", ["services.sample", "services.mine", "services.scene", "app.directives.addelement", "app.directives.qrcode"]), b.module("sample").controller("SampleCtrl", ["$rootScope", "$http", "$scope", "$timeout", "security", "$window", "sampleService", "MineService", "sceneService", "$routeParams", function (a, b, c, d, e, f, g, h, i, j) {
        c.PREFIX_FILE_HOST = PREFIX_FILE_HOST, c.PREFIX_SERVER_HOST = PREFIX_URL, c.PREFIX_CLIENT_HOST = PREFIX_HOST, c.load = function () {
            t = $(".fixed").offset().top, mh = $(".mains").height(), fh = $(".fixed").height(), $("#eq_main").scroll(function () {
                s = $("#eq_main").scrollTop(), s > t - 10 ? ($(".fixed").css("position", "fixed"), s + fh > mh && $(".fixed").css("top", "0px")) : $(".fixed").css("position", "")
            })
        }, c.$on("$destroy", function () {
            $("#eq_main").unbind("scroll")
        }), c.pageNo = 1, c.pageSize = 9, c.scene || (c.scene = {}), c.typeindex = "all", c.getHomes = function (a, b, d, e) {
            c.pageNo = 1, c.typeindex = a, c.currentType = b, c.showMoreButton = !0, g.getSamples(b, d, e).then(function (a) {
                c.homes = a.data.list
            }, function (a) {
            })
        }, c.getSceneType = function () {
            i.getSceneType().then(function (a) {
                c.sceneTypes = a.data.list
            })
        }, c.showMore = function () {
            c.pageNo++, g.getSamples(c.currentType, c.pageNo, c.pageSize).then(function (a) {
                a.data.list.length > 0 ? c.homes = c.homes.concat(a.data.list) : c.showMoreButton = !1
            }, function (a) {
            })
        }, c.getSceneType(), c.getHomes("all", null, 1, 9), c.getSamplesPV = function () {
            g.getSamplesPV().then(function (a) {
                c.SamplesPVs = a.data, c.dayTop = c.SamplesPVs.obj.dayTop, c.monthTop = c.SamplesPVs.obj.monthTop, c.weekTop = c.SamplesPVs.obj.weekTop, c.page = "month"
            }, function (a) {
            })
        }
    }]), b.module("scene.create.console", ["scene.create.console.bg", "scene.create.console.map", "scene.create.console.input", "scene.create.console.button", "scene.create.console.setting", "scene.create.console.audio", "scene.create.console.tel", "scene.create.console.fake", "scene.create.console.pictures", "scene.create.console.micro", "scene.create.console.link", "scene.create.console.video", "scene.create.console.category", "scene.create.console.cropImage"]), b.module("scene.create.console").controller("ConsoleCtrl", ["$scope", function (a) {
    }]), b.module("scene.create.console.setting.anim", ["app.directives.uislider", "app.directives.limitInput"]), b.module("scene.create.console.setting.anim").controller("AnimConsoleCtrl", ["$scope", "$rootScope", "sceneService", function (a, c, d) {
        function e(b, d) {
            var e = {anim: b, animClasses: j, count: d, elemId: a.elemDef.id};
            c.$broadcast("previewCurrentChange", e)
        }

        function f(b, d) {
            var e = {animations: b, animClasses: d, count: i, elemId: a.elemDef.id};
            c.$broadcast("previewAllChanges", e)
        }

        var g = a.elemDef = d.currentElemDef;
        a.animations = [], a.types = [], a.directions = [];
        var h, i, j = [];
        a.animTypeEnum = [
            {id: -1, name: "无"},
            {id: 0, name: "淡入", cat: "进入"},
            {id: 1, name: "移入", cat: "进入"},
            {id: 2, name: "弹入", cat: "进入"},
            {id: 3, name: "中心弹入", cat: "进入"},
            {id: 4, name: "中心放大", cat: "进入"},
            {id: 12, name: "翻滚进入", cat: "进入"},
            {id: 13, name: "光速进入", cat: "进入"},
            {id: 6, name: "摇摆", cat: "强调"},
            {id: 5, name: "抖动", cat: "强调"},
            {id: 7, name: "旋转", cat: "强调"},
            {id: 8, name: "翻转", cat: "强调"},
            {id: 9, name: "悬摆", cat: "强调"},
            {id: 10, name: "淡出", cat: "退出"},
            {id: 11, name: "翻转消失", cat: "退出"}
        ], a.animDirectionEnum = [
            {id: 0, name: "从左向右"},
            {id: 1, name: "从上到下"},
            {id: 2, name: "从右向左"},
            {id: 3, name: "从下到上"}
        ];
        var k;
        if (g.properties.anim)if (g.properties.anim instanceof Array) {
            if (g.properties.anim.length)for (k = 0; k < g.properties.anim.length; k++)if (null != g.properties.anim[k].type && -1 != g.properties.anim[k].type) {
                a.animations.push(g.properties.anim[k]);
                for (var l = 0, m = a.animTypeEnum.length; m > l; l++)a.animations[k].type == a.animTypeEnum[l].id && (a.types[k] = a.animTypeEnum[l]);
                for (l = 0, m = a.animDirectionEnum.length; m > l; l++)a.animations[k].direction == a.animDirectionEnum[l].id && (a.directions[k] = a.animDirectionEnum[l])
            } else g.properties.anim.splice(k, 1), k--
        } else {
            for (k = 0; k < a.animTypeEnum.length; k++)a.animTypeEnum[k].id == g.properties.anim.type && (a.types[0] = a.animTypeEnum[k]);
            a.directions[0] = null != g.properties.anim.direction ? a.animDirectionEnum[g.properties.anim.direction] : a.animDirectionEnum[0], g.properties.anim.duration = parseFloat(g.properties.anim.duration), g.properties.anim.delay = parseFloat(g.properties.anim.delay), g.properties.anim.countNum = parseInt(g.properties.anim.countNum, 10) || 1, a.animations.push(g.properties.anim)
        }
        g.properties || (g.properties = {});
        var n = {type: null, direction: null, duration: 2, delay: 0, countNum: 1, count: null};
        a.addAnim = function () {
            var c = b.copy(n);
            c.type = a.animTypeEnum[0].id, c.direction = a.animDirectionEnum[0].id, a.animations.push(c);
            var d = a.animations.length;
            a.types[d - 1] = a.animTypeEnum[0], a.directions[d - 1] = a.animDirectionEnum[0]
        }, a.removeAnim = function (b, c) {
            c.stopPropagation(), a.animations.splice(b, 1), a.types.splice(b, 1), a.directions.splice(b, 1)
        }, a.$watch("animations", function (b, c) {
            b != c && (g.properties.anim = a.animations)
        }, !0), a.$watch("types", function (b, c) {
            if (b && b != c)for (var d = 0; d < b.length; d++)c[d] && b[d].id != c[d].id && e(a.animations[d], d)
        }, !0), a.$watch("directions", function (b, c) {
            if (b && b != c)for (var d = 0; d < b.length; d++)c[d] && b[d].id != c[d].id && e(a.animations[d], d)
        }, !0), a.previewAnim = function () {
            for (var c = b.copy(a.animations), d = [], e = [], g = 0; g < c.length; g++)null != c[g].type && -1 != c[g].type ? (d.push(c[g]), e[g] = q.convertType(c[g])) : (c.splice(g, 1), g--);
            i = 0, f(d, e)
        }, a.changeAnimation = function (a, b) {
            h = q.convertType(a), j[b] = h
        }
    }]), b.module("scene.create.console.audio", []), b.module("scene.create.console.audio").controller("AudioConsoleCtrl", ["$scope", "$sce", "$timeout", "$modal", "fileService", "obj", function (a, b, c, d, e, f) {
        function g() {
            e.getFileByCategory(1, 30, "1", "2").then(function (b) {
                a.reservedAudios = b.data.list;
                for (var c = 0; c < a.reservedAudios.length; c++)"3" == a.model.bgAudio.type && PREFIX_FILE_HOST + a.reservedAudios[c].path == a.model.type3 && (a.model.selectedAudio = a.reservedAudios[c])
            })
        }

        function h() {
            e.getFileByCategory(1, 10, "0", "2").then(function (b) {
                a.myAudios = b.data.list;
                for (var c = 0; c < a.myAudios.length; c++)"2" == a.model.bgAudio.type && PREFIX_FILE_HOST + a.myAudios[c].path == a.model.type2 && (a.model.selectedMyAudio = a.myAudios[c])
            })
        }

        a.PREFIX_FILE_HOST = PREFIX_FILE_HOST, a.model = {bgAudio: {url: f.url ? f.url : "", type: f.type ? f.type : "3"}, compType: "bgAudio"}, c(function () {
            "1" == f.type && f.url && (a.model.type1 = f.url), "2" == f.type && f.url && (a.model.type2 = b.trustAsResourceUrl(PREFIX_FILE_HOST + f.url)), "3" == f.type && f.url && (a.model.type3 = b.trustAsResourceUrl(PREFIX_FILE_HOST + f.url))
        }), a.categoryList = [
            {name: "音乐库", value: "3"},
            {name: "外部链接", value: "1"},
            {name: "我的音乐", value: "2"}
        ], a.goUpload = function () {
            d.open({windowClass: "upload-console", templateUrl: "my/upload.tpl.html", controller: "UploadCtrl", resolve: {category: function () {
                return{categoryId: 0, fileType: 2}
            }}}).result.then(function (a) {
                h()
            })
        }, a.selectAudio = function (c) {
            "3" == c && (a.model.type3 = a.model.selectedAudio ? b.trustAsResourceUrl(PREFIX_FILE_HOST + a.model.selectedAudio.path) : null), "2" == c && (a.model.type2 = a.model.selectedMyAudio ? b.trustAsResourceUrl(PREFIX_FILE_HOST + a.model.selectedMyAudio.path) : null)
        }, a.playAudio = function (a) {
            $("#audition" + a)[0].play()
        }, a.pauseAudio = function (a) {
            $("#audition" + a)[0].pause()
        }, a.confirm = function () {
            if ("1" == a.model.bgAudio.type) {
                if (!a.model.type1)return void alert("链接地址不能为空");
                a.model.bgAudio.url = a.model.type1
            }
            "2" == a.model.bgAudio.type && (a.model.bgAudio.url = a.model.selectedMyAudio.path), "3" == a.model.bgAudio.type && (a.model.bgAudio.url = a.model.selectedAudio.path), a.$close(a.model)
        }, a.cancel = function () {
            a.$dismiss()
        }, g(), h()
    }]), b.module("scene.create.console.bg", ["services.file", "scene.my.upload", "app.directives.responsiveImage", "app.directives.rightclick"]), b.module("scene.create.console.bg").controller("BgConsoleCtrl", ["$scope", "$timeout", "$rootScope", "$modal", "ModalService", "sceneService", "fileService", "localizedMessages", "obj", function (a, c, d, e, f, g, h, i, j) {
        a.PREFIX_FILE_HOST = PREFIX_FILE_HOST, a.first = !0, a.categoryList = [], a.imgList = [], a.otherCategory = [], a.categoryId = "1", a.fileType = j.fileType, a.pageSize = i.get("file.bg.pageSize"), a.myTags = [], a.selectedImgs = [], a.selectedImages = [], a.toPage = 1;
        var k = [];
        a.isEditor = d.isEditor;
        var l = function () {
            h.listFileCategory(a.fileType).then(function (b) {
                a.categoryList = b.data.list, a.changeCategory("0", 1)
            })
        };
        a.totalItems = 0, a.currentPage = 1;
        var m = function (b, c) {
            if ("c" == b) {
                a.numPages = 2, a.totalItems = 35;
                var d = [
                    {color: "#6366C3"},
                    {color: "#29A1D6"},
                    {color: "#332E42"},
                    {color: "#DBF3FF"},
                    {color: "#434A54"},
                    {color: "#000000"},
                    {color: "#F1F03E"},
                    {color: "#FCF08E"},
                    {color: "#972D53"},
                    {color: "#724192"},
                    {color: "#967BDC"},
                    {color: "#EC87C1"},
                    {color: "#D870AF"},
                    {color: "#F6F7FB"},
                    {color: "#666C78"},
                    {color: "#ABB1BD"},
                    {color: "#CCD0D9"},
                    {color: "#E6E9EE"},
                    {color: "#48CFAE"},
                    {color: "#36BC9B"},
                    {color: "#3BAEDA"},
                    {color: "#50C1E9"},
                    {color: "#AC92ED"},
                    {color: "#4B89DC"},
                    {color: "#4B89DC"},
                    {color: "#5D9CEC"},
                    {color: "#8DC153"},
                    {color: "#ED5564"},
                    {color: "#DB4453"},
                    {color: "#FB6E52"},
                    {color: "#FFCE55"},
                    {color: "#F6BB43"},
                    {color: "#E9573E"},
                    {color: "#9FF592"},
                    {color: "#A0D468"}
                ];
                a.toPage = c, a.imgList = c && 1 != c ? d.slice(18) : d.slice(0, 18), a.currentPage = c
            } else"all" == b && (b = ""), h.getFileByCategory(c ? c : 1, a.pageSize, b, a.fileType).then(function (b) {
                a.imgList = b.data.list, a.totalItems = b.data.map.count, a.currentPage = b.data.map.pageNo, a.allPageCount = b.data.map.count, a.toPage = b.data.map.pageNo, a.numPages = Math.ceil(a.totalItems / a.pageSize)
            })
        };
        a.replaceImage = function () {
            var c = {};
            if ("p" != j.type) {
                if (a.selectedImages.length > 1)return alert("只能选择一张图片进行替换！"), !1;
                if (!a.selectedImages.length)return alert("还没有选择替换图片"), !1
            } else {
                var d = j.count + a.selectedImages.length;
                if (d > 6)return alert("最多还可选择" + (6 - j.count) + "张图片"), !1;
                c.selectedImages = k
            }
            if ("c" != a.categoryId) {
                var e = {};
                if ("p" != j.type) {
                    var f = a.selectedImages[0].path, g = $(".hovercolor").children("img")[0];
                    e = {type: "imgSrc", data: f, width: g.width, height: g.height}
                }
                b.extend(c, e), a.$close(c)
            } else {
                var h = a.selectedImages[0].color;
                a.$close({type: "backgroundColor", color: h})
            }
        }, a.getImagesByPage = function (b, c) {
            a.currentPage = c, 0 === b ? isNaN(a.tagIndex) || -1 == a.tagIndex ? a.changeCategory(b, c) : a.getImagesByTag(a.myTags[a.tagIndex].id, a.tagIndex, c) : isNaN(a.sysTagIndex) || -1 == a.sysTagIndex ? a.changeCategory(b, c) : a.getImagesBySysTag(a.childCatrgoryList[a.sysTagIndex].id, a.sysTagIndex, c, b)
        }, a.replaceBgImage = function (b, c) {
            var d, e = c.target;
            d = "IMG" == e.nodeName.toUpperCase() ? e : $("img", e)[0], a.$close({type: "imgSrc", data: b, width: d.width, height: d.height})
        }, a.replaceBgColor = function (b, c) {
            a.$close({type: "backgroundColor", color: b})
        }, a.changeCategory = function (b, c) {
            return("c" == b || "all" == b || "0" == b) && (a.allImages.checked = !1, a.sysTagIndex = -1), a.selectedImages = [], 1 > c || c > a.totalItems / a.pageSize + 1 ? void alert("此页超出范围") : (a.imgList = [], b || (b = "0"), a.categoryId = b, void("0" === b ? (a.pageSize = i.get("file.bg.pageSize") - 1, a.getImagesByTag("", a.tagIndex, c), a.tagIndex = -1) : (a.pageSize = i.get("file.bg.pageSize"), m(b, c))))
        };
        var n = null;
        a.createCategory = function () {
            return a.myTags.length >= 8 ? void alert("最多能创建8个自定义标签！") : void(n = e.open({windowClass: "console", templateUrl: "scene/console/category.tpl.html", controller: "CategoryConsoleCtrl"}).result.then(function (b) {
                a.myTags.push(b)
            }, function () {
            }))
        }, a.getCustomTags = function () {
            h.getCustomTags().then(function (b) {
                a.myTags = b.data.list
            }, function (a) {
                alert("服务器异常")
            })
        }, a.getCustomTags(), a.deleteTag = function (b, c) {
            h.deleteTag(b).then(function (b) {
                a.myTags.splice(c, 1)
            }, function (a) {
                alert("服务器异常")
            })
        }, a.hover = function (a) {
            a.showOp = !a.showOp
        }, a.switchSelect = function (b, c) {
            if (c.target.id != b.id)if (b.selected = !b.selected, b.selected) {
                var d, e = c.target;
                d = "IMG" == e.nodeName.toUpperCase() ? $(e) : $("img", e);
                var f = new Image;
                f.src = d.attr("src"), b.width = f.width, b.height = f.height, k.push({width: f.width, height: f.height, src: b.path}), a.selectedImages.push(b)
            } else for (var g in a.selectedImages)a.selectedImages[g] == b && (a.selectedImages.splice(g, 1), k.splice(g, 1))
        }, a.selectTag = function (b, c) {
            a.dropTagIndex = c, a.id = a.myTags[c].id
        }, a.setCategory = function (b, c) {
            a.dropTagIndex = -1;
            var d = [];
            if (!c)for (var e in a.selectedImages)d.push(a.selectedImages[e].id);
            var f = c ? c : d.join(",");
            h.setCategory(a.id, f).then(function (a) {
            }, function (a) {
            })
        }, a.hoverTag = function (a) {
            a.hovered = !a.hovered
        }, a.prevent = function (b, c) {
            b.selected || (b.selected = !0, a.selectedImages.push(b))
        }, a.unsetTag = function () {
            var b = [];
            for (var c in a.selectedImages)b.push(a.selectedImages[c].id);
            h.unsetTag(a.myTags[a.tagIndex].id, b.join(",")).then(function (b) {
                a.getImagesByTag(a.myTags[a.tagIndex].id, a.tagIndex, a.currentPage)
            }, function (a) {
            })
        }, a.setIndex = function (b) {
            a.dropTagIndex = -1, a.selectedImages.length || (alert("请您选中图片再进行分类！"), b.stopPropagation())
        }, a.getChildCategory = function (b) {
            h.getChildCategory(b).then(function (b) {
                a.sysTagIndex = -1, 200 == b.data.code && (a.childCatrgoryList = b.data.list)
            }, function (a) {
            })
        }, a.goUpload = function () {
            e.open({windowClass: "upload-console", templateUrl: "my/upload.tpl.html", controller: "UploadCtrl", resolve: {category: function () {
                return{categoryId: a.categoryId, fileType: a.fileType, coverImage: j.coverImage}
            }}}).result.then(function () {
                a.changeCategory(a.categoryId)
            }, function () {
            })
        }, a.allImages = {checked: !1}, a.selectAll = function () {
            for (var b in a.imgList)a.allImages.checked ? (a.imgList[b].selected = !0, a.selectedImages.push(a.imgList[b])) : (a.imgList[b].selected = !1, a.selectedImages = [])
        }, a.getImagesByTag = function (b, c, d) {
            return 1 > d || d > a.totalItems / a.pageSize + 1 ? void alert("此页超出范围") : (a.allImages.checked = !1, a.selectedImages = [], a.tagIndex = c, void h.getImagesByTag(b, a.fileType, d, a.pageSize).then(function (b) {
                a.imgList = b.data.list, a.totalItems = b.data.map.count, a.currentPage = b.data.map.pageNo, a.allPageCount = b.data.map.count, a.toPage = b.data.map.pageNo, a.numPages = Math.ceil(a.totalItems / a.pageSize)
            }, function (a) {
                alert("服务器异常")
            }))
        }, a.getImagesBySysTag = function (b, c, d, e) {
            return 1 > d || d > a.totalItems / a.pageSize + 1 ? void alert("此页超出范围") : (a.allImages.checked = !1, a.selectedImages = [], a.sysTagIndex = c, void h.getImagesBySysTag(b, a.fileType, d, a.pageSize, e).then(function (b) {
                a.imgList = b.data.list, a.totalItems = b.data.map.count, a.currentPage = b.data.map.pageNo, a.allPageCount = b.data.map.count, a.toPage = b.data.map.pageNo, a.numPages = Math.ceil(a.totalItems / a.pageSize)
            }, function (a) {
                alert("服务器异常")
            }))
        }, a.deleteImage = function (b, c) {
            var d = [];
            if (c && c.stopPropagation(), !b && 0 === a.selectedImages.length)return void alert("请您选中图片后再进行删除操作！");
            var e = b ? "确定删除此图片？" : "确定删除所选图片？";
            if (!b)for (var g in a.selectedImages)d.push(a.selectedImages[g].id);
            var i = b ? b : d.join(",");
            f.openConfirmDialog({msg: e}, function () {
                h.deleteFile(i).then(function () {
                    k = [], isNaN(a.tagIndex) || -1 == a.tagIndex ? a.changeCategory("0", a.currentPage) : a.getImagesByTag(a.myTags[a.tagIndex].id, a.tagIndex, a.currentPage)
                })
            })
        }, l()
    }]), b.module("scene.create.console.button", []), b.module("scene.create.console.button").controller("ButtonConsoleCtrl", ["$scope", "$timeout", "localizedMessages", "obj", function (a, b, c, d) {
        a.model = {title: d.properties.title}, a.confirm = function () {
            return a.model.title && 0 !== a.model.title.length ? void a.$close(a.model) : (alert("按钮名称不能为空"), void $('.bg_console input[type="text"]').focus())
        }, a.cancel = function () {
            a.$dismiss()
        }
    }]), b.module("scene.create.console.category", ["services.file"]), b.module("scene.create.console.category").controller("CategoryConsoleCtrl", ["$scope", "$timeout", "localizedMessages", "fileService", function (a, c, d, e) {
        a.category = {}, a.confirm = function () {
            return a.category.name && a.category.name.trim() ? i(a.category.name) > 16 ? void alert("类别字数不能超过16个字符！") : void e.createCategory(b.copy(a.category.name)).then(function (c) {
                a.category.id = c.data.obj, a.$close(b.copy(a.category))
            }, function (a) {
                alert("创建失败")
            }) : void alert("类别不能为空！")
        }, a.cancel = function () {
            a.$dismiss()
        }
    }]), b.module("scene.create.console.cropImage", ["services.file"]).directive("cropImage", ["sceneService", "fileService", "$compile", function (a, b, c) {
        return{restrict: "EAC", scope: {}, replace: !0, templateUrl: "scene/console/cropimage.tpl.html", link: function (c, d, e) {
            function f() {
                o.css.width / o.css.height > m / n ? (k = parseInt(o.css.width * m / o.css.width, 10), l = parseInt(o.css.height * m / o.css.width, 10)) : (k = parseInt(o.css.width * n / o.css.height, 10), l = parseInt(o.css.height * n / o.css.height, 10));
                var a = (m - k) / 2, b = (n - l) / 2, c = (m - k) / 2 + k, d = (n - l) / 2 + l;
                j = [0, 0, m, n], r = o.css.width / o.css.height, i = [a, b, c, d]
            }

            function g(a) {
                $(".cropWidth").html(parseInt(a.w, 10)), $(".cropHeight").html(parseInt(a.h, 10))
            }

            c.PREFIX_FILE_HOST = PREFIX_FILE_HOST;
            var h, i, j, k, l, m, n, o = a.currentElemDef, p = a.currentElemDef.properties.src, q = $("#target"), r = o.css.width / o.css.height;
            c.fit = !0, c.lockRatio = !1, c.$on("changeElemDef", function (a, b) {
                o = b, c.fit = !0, c.lockRatio = !1, o.properties.src != p ? (p = o.properties.src, h.setImage(PREFIX_FILE_HOST + p), q.unbind("load").attr("src", PREFIX_FILE_HOST + p).load(function () {
                    m = this.width, n = this.height, c.preSelectImage(p), c.$apply()
                })) : (c.preSelectImage(p), c.$apply())
            }), c.preSelectImage = function (a) {
                h ? (f(), h.setOptions({aspectRatio: r, setSelect: i})) : q.attr("src", PREFIX_FILE_HOST + a).load(function () {
                    m = this.width, n = this.height, q.Jcrop({onChange: g, keySupport: !1, setSelect: [0, 0, 100, 100], boxHeight: 320, boxWidth: 680}, function () {
                        h = this
                    }), a && (f(), h.setOptions({aspectRatio: r, setSelect: i}))
                })
            }, c.preSelectImage(p), c.$watch("lockRatio", function (a, b) {
                if (h) {
                    var c = h.tellSelect();
                    c.w = parseInt(c.w, 10), c.h = parseInt(c.h, 10), h.setOptions(a ? {aspectRatio: c.w / c.h} : {aspectRatio: null})
                }
            }), c.$watch("fit", function (a, b) {
                if (h)if (a) {
                    var c = h.tellSelect();
                    c.x = parseInt(c.x, 10), c.y = parseInt(c.y, 10), c.x2 = parseInt(c.x2, 10), c.y2 = parseInt(c.y2, 10), j = [c.x, c.y, c.x2, c.y2], h.setOptions({aspectRatio: r, setSelect: i})
                } else h.setOptions({aspectRatio: null, setSelect: j})
            }), c.crop = function () {
                var c = a.currentElemDef, e = h.tellSelect();
                return 0 === e.w || 0 === e.h ? void $(d).hide() : (e.x = parseInt(e.x, 10), e.y = parseInt(e.y, 10), e.w = parseInt(e.w, 10), e.h = parseInt(e.h, 10), e.x2 = parseInt(e.x2, 10), e.y2 = parseInt(e.y2, 10), e.src = $("#target").attr("src").split(PREFIX_FILE_HOST)[1], void b.cropImage(e).then(function (a) {
                    var b = {type: "imgSrc", data: a.data.obj, width: e.w, height: e.h};
                    c.properties.src = b.data;
                    var f = b.width / b.height, g = $("#" + c.id), h = $("#inside_" + c.id).width(), i = $("#inside_" + c.id).height(), j = h / i;
                    f >= j ? (i = h / f, $("#inside_" + c.id).height(i), c.css.height = i, c.properties.height = i, g.outerHeight(i), g.outerWidth(h), g.css("marginLeft", 0), g.css("marginTop", 0)) : (h = i * f, $("#inside_" + c.id).width(h), c.css.width = h, c.properties.width = h, g.outerWidth(h), g.outerHeight(i), g.css("marginTop", 0), g.css("marginLeft", 0)), g.attr("src", PREFIX_FILE_HOST + b.data), c.properties.imgStyle = {}, c.properties.imgStyle.width = g.outerWidth(), c.properties.imgStyle.height = g.outerHeight(), c.properties.imgStyle.marginTop = g.css("marginTop"), c.properties.imgStyle.marginLeft = g.css("marginLeft"), $(d).hide()
                }, function (b) {
                    c.properties.src || a.deleteElement(c.id)
                }))
            }, c.cancel = function () {
                $(d).hide()
            }
        }}
    }]), b.module("scene.create.console.fake", []), b.module("scene.create.console.fake").controller("FakeConsoleCtrl", ["$scope", "type", function (a, b) {
        a.type = b
    }]), b.module("scene.create.console.input", []), b.module("scene.create.console.input").controller("InputConsoleCtrl", ["$scope", "$timeout", "localizedMessages", "obj", function (a, b, c, d) {
        a.model = {title: d.title, type: d.type, required: d.properties.required}, a.confirm = function () {
            return a.model.title && 0 !== a.model.title.length ? void a.$close(a.model) : (alert("输入框名称不能为空"), void $('.bg_console input[type="text"]').focus())
        }, a.cancel = function () {
            a.$dismiss()
        }
    }]), b.module("scene.create.console.link", ["services.scene"]), b.module("scene.create.console.link").controller("LinkConsoleCtrl", ["$scope", "$timeout", "obj", "sceneService", function (a, c, d, e) {
        a.url = {}, a.url.externalLink = "http://";
        var f;
        a.confirm = function () {
            "external" == a.url.link ? f = a.url.externalLink : "internal" == a.url.link && (f = a.url.internalLink.num), a.$close(f)
        }, a.cancel = function () {
            a.$dismiss()
        }, a.removeLink = function (b) {
            "external" == b ? a.url.externalLink = "http://" : "internal" == b && (a.url.internalLink = a.pageList[0]), a.url.link = ""
        }, a.changed = function () {
            "external" == a.url.link ? a.url.internalLink = a.pageList[0] : a.url.externalLink = "http://"
        }, a.selectRadio = function (b) {
            a.url.link || ("external" == b ? a.url.link = "external" : "internal" == b && (a.url.link = "internal"))
        }, a.getPageNames = function () {
            var c = d.sceneId;
            e.getPageNames(c).then(function (c) {
                a.pageList = c.data.list, a.pageList.unshift({id: 0, name: "无"}), a.url.internalLink = a.pageList[0], b.forEach(a.pageList, function (b, c) {
                    b.name || (b.name = "第" + b.num + "页"), d.properties.url && d.properties.url == b.num && (a.url.link = "internal", a.url.internalLink = b)
                }), d.properties.url && isNaN(d.properties.url) && (a.url.link = "external", a.url.externalLink = decodeURIComponent(d.properties.url.split("=")[2]))
            })
        }, a.getPageNames()
    }]), b.module("scene.create.console.map", ["app.directives.comp.editor"]), b.module("scene.create.console.map").controller("MapConsoleCtrl", ["$scope", "sceneService", "$timeout", function (a, b, c) {
        var d = null, e = null;
        a.address = {address: "", lat: "", lng: ""}, a.search = {address: ""}, a.searchResult = [], c(function () {
            d = new BMap.Map("l-map"), d.addControl(new BMap.NavigationControl), d.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
            var b = {onSearchComplete: function (b) {
                e.getStatus() == BMAP_STATUS_SUCCESS && (a.searchResult = b.Fn,
                    a.$apply())
            }};
            e = new BMap.LocalSearch(d, b)
        }), a.searchAddress = function () {
            e.search(a.search.address)
        }, a.setPoint = function (b, c, e) {
            a.address.address = e, a.address.lat = b, a.address.lng = c, d.clearOverlays();
            var f = new BMap.Point(c, b), g = new BMap.Marker(f);
            d.addOverlay(g);
            var h = new BMap.Label(e, {offset: new BMap.Size(20, -10)});
            g.setLabel(h), d.centerAndZoom(f, 12)
        }, a.resetAddress = function () {
            a.$close(a.address)
        }, a.cancel = function () {
            a.$dismiss()
        }
    }]), b.module("scene.create.console.micro", ["app.directives.addelement", "services.scene"]), b.module("scene.create.console.micro").controller("MicroConsoleCtrl", ["$scope", "$timeout", "localizedMessages", "obj", "sceneService", function (a, c, d, e, f) {
        a.model || (a.model = {});
        var g = [];
        a.isSelected = [], a.backgroundColors = [
            {backgroundColor: "#D34141"},
            {backgroundColor: "#000"},
            {backgroundColor: "#23A3D3"},
            {backgroundColor: "#79C450"},
            {backgroundColor: "#fafafa"}
        ], a.labelNames = [
            {id: 1, title: "栏目一", color: {backgroundColor: ""}},
            {id: 2, title: "栏目二", color: {backgroundColor: ""}},
            {id: 3, title: "栏目三", color: {backgroundColor: ""}},
            {id: 4, title: "栏目四", color: {backgroundColor: ""}}
        ], a.model.color = e.properties.labels[0].color.backgroundColor, a.selectColor = function (c) {
            a.model.color = c.backgroundColor, b.forEach(a.labelNames, function (a, b) {
                a.color.backgroundColor && (a.color.backgroundColor = c.backgroundColor)
            })
        }, b.forEach(e.properties.labels, function (c, d) {
            b.forEach(a.labelNames, function (a, b) {
                c.id == a.id && (a.title = c.title, a.color.backgroundColor = c.color.backgroundColor, a.link = c.link, a.selected = !0, c.mousedown = !1)
            })
        }), a.confirm = function () {
            g = [];
            var c = 0, d = 0;
            b.forEach(a.labelNames, function (a, b) {
                a.selected && (a.link ? g.push(a) : d++, c++)
            }), 2 > c ? alert("导航标签不能少于两个！") : d > 0 ? alert("每个导航必须有链接页面！") : a.$close(g)
        }, a.cancel = function () {
            a.$dismiss()
        }, a.switchLabel = function (b, c) {
            a.label = b, b.selected ? a.labelIndex == c ? (b.color.backgroundColor = "", b.selected = !1, b.mousedown = !1) : (a.labelIndex = c, b.mousedown = !0) : (b.color.backgroundColor = a.model.color, a.labelIndex = c, b.selected = !0, b.mousedown = !0), b.mousedown ? (a.model.title = b.title, a.model.link = b.link ? a.pageList[b.link] : a.pageList[0]) : (a.model.title = "", a.model.link = a.pageList[0])
        }, a.selectLink = function (b) {
            a.label.mousedown && (a.label.link = b.num, console.log(a.labelNames))
        }, a.changeLabelName = function () {
            a.label.mousedown && (a.label.title = a.model.title)
        }, a.getPageNames = function () {
            var c = e.sceneId;
            f.getPageNames(c).then(function (c) {
                a.pageList = c.data.list, a.pageList.unshift({id: 0, name: "无"}), b.forEach(a.pageList, function (a, b) {
                    a.name || (a.name = "第" + a.num + "页")
                }), a.model.link = a.pageList[0]
            })
        }, a.getPageNames()
    }]), b.module("scene.create.console.pic_lunbo", ["scene.my.upload"]), b.module("scene.create.console.pic_lunbo").controller("picsCtrl", ["$scope", "$timeout", "$rootScope", "$modal", "ModalService", "sceneService", "fileService", "obj", function (a, b, d, e, f, g, h, i) {
        var j = {lunBo: 1, jiuGongGe: 2}, k = {autoPlay: i.properties.autoPlay === c ? !0 : i.properties.autoPlay, interval: i.properties.interval === c ? 3e3 : i.properties.interval, picStyle: i.properties.picStyle === c ? j.lunBo : i.properties.picStyle, children: []}, l = i.properties.children;
        if (l && l.length > 0)for (var m in l)k.children.push(l[m]);
        a.imgList = k.children, a.isAutoPlay = k.autoPlay, a.fileDomain = PREFIX_FILE_HOST, a.autoPlay = function (b) {
            a.isAutoPlay = k.autoPlay = b
        }, a.choosePic = function () {
            return k.children.length >= 6 ? void alert("最多选择6张图片") : void e.open({windowClass: "console img_console", templateUrl: "scene/console/bg.tpl.html", controller: "BgConsoleCtrl", resolve: {obj: function () {
                return{fileType: 1, elemDef: i}
            }}}).result.then(function (b) {
                a.imgList.push({src: b.data, desc: "", height: b.height, width: b.width})
            }, function () {
            })
        }, a.remove = function (b) {
            a.imgList.splice(b, 1)
        }, a.ok = function () {
            return 0 === k.children.length ? void alert("请选择图片") : (i.properties = k, void a.$close(k))
        }, a.cancel = function () {
            a.$dismiss()
        }
    }]), b.module("scene.create.console.pictures", ["services.file"]).controller("picturesCtrl", ["$scope", "$timeout", "$rootScope", "$modal", "picturesService", "obj", function (a, c, d, e, f, g) {
        var h = 530, i = 265, j = {lunBo: 1, jiuGongGe: 2};
        a.currentImageIndex = -1;
        var k = b.copy(g), l = a.position = k.css;
        if (null != l.width && null != l.height) {
            var m = l.width / l.height, n = h / i;
            m > n ? (l.width = h, l.height = h / m) : (l.height = i, l.width = i * m)
        }
        var o = a.properties = k.properties;
        o.autoPlay = null == o.autoPlay ? !0 : o.autoPlay, o.interval = null == o.interval ? 3e3 : o.interval, o.picStyle = null == o.picStyle ? j.lunBo : o.picStyle, o.bgColor = null == o.bgColor ? "" : o.bgColor, o.children = null == o.children ? [] : o.children, f.setImages(o.children), a.choosePic = function () {
            return o.children.length >= 6 ? void alert("最多可选择6张图片") : void e.open({windowClass: "console img_console", templateUrl: "scene/console/bg.tpl.html", controller: "BgConsoleCtrl", resolve: {obj: function () {
                return{fileType: 1, type: "p", count: o.children.length, elemDef: g}
            }}}).result.then(function (a) {
                $.each(a.selectedImages, function (a, b) {
                    f.addImages({src: b.src, desc: "", height: b.height, width: b.width})
                })
            }, function () {
            })
        }, a.ok = function () {
            return 0 === o.children.length ? void alert("请选择图片") : (g.properties = o, void a.$close(o))
        }, a.cancel = function () {
            a.$dismiss()
        }, a.$on("currentImage.update", function (b, c) {
            a.currentImageIndex = c
        }), a.$on("images.add", function (a, b) {
            o.children = b
        }), a.$on("images.update", function (a, b) {
            o.children = b
        })
    }]).factory("picturesService", ["$rootScope", "fileService", function (a, b) {
        var c, d = {}, e = [];
        return d.setJcrop = function (b) {
            a.$broadcast("jcrop.update", b)
        }, d.setImageSize = function (b) {
            a.$broadcast("image.update", b)
        }, d.setCurrentImage = function (b) {
            c = b, a.$broadcast("currentImage.update", b)
        }, d.getCurrentImage = function () {
            return c
        }, d.addImages = function (b) {
            e.push(b), a.$broadcast("images.add", e)
        }, d.updateImages = function (b, c) {
            e.splice(b, 1, c), a.$broadcast("images.update", e)
        }, d.deleteImages = function (b) {
            e.splice(b, 1), a.$broadcast("images.update", e)
        }, d.setImages = function (a) {
            return e = a
        }, d.getImages = function () {
            return e
        }, d.cropImage = function (c) {
            b.cropImage(c).success(function (b) {
                if (b.success) {
                    var d = {width: c.w, height: c.h, desc: "", src: b.obj};
                    a.$broadcast("crop.success", d)
                } else alert(b.msg)
            }).error(function () {
                alert("网络连接超时，请稍后重试")
            })
        }, d
    }]).directive("eqxPicturesImageCrop", ["$compile", "picturesService", function (a, b) {
        return{link: function (c, d) {
            var e = $(d), f = $(".pic-preview"), g = {width: f.width(), height: f.height()};
            c.showOperation = !0;
            var h, i = '<div class="operation" ng-show="!showOperation"><a class="quxiao" ng-click="cropCancel()">取消</a><a class="finish" ng-click="cropOk()">完成</a></div>';
            c.$on("image.update", function (a, b) {
                h = {width: b.width, height: b.height}
            }), c.$on("jcrop.update", function (d, j) {
                f.append(a(i)(c)), c.showOperation = !0, c.$apply();
                var k = f.children("img"), l = {width: k.width(), height: k.height()};
                e.removeClass("hover").unbind("click").click(function () {
                    var a = b.getImages();
                    0 !== a.length && (c.showOperation = $(this).hasClass("hover"), c.showOperation ? ($(this).removeClass("hover"), j.release(), j.disable()) : ($(this).addClass("hover"), j.setSelect([0, 0, l.width, l.height]), j.enable()))
                }), c.cropOk = function () {
                    var a = j.tellSelect();
                    if (!(a.w === g.width && a.h === g.height || 0 === a.w && 0 === a.h)) {
                        var c = h.width / l.width;
                        a.w = parseInt(a.w * c, 10), a.h = parseInt(a.h * c, 10), a.x = parseInt(a.x * c, 10), a.y = parseInt(a.y * c, 10), a.x2 = parseInt((a.w + a.x) * c, 10), a.y2 = parseInt((a.h + a.y) * c, 10), a.src = k.attr("src").split(PREFIX_FILE_HOST)[1], b.cropImage(a)
                    }
                }, c.cropCancel = function () {
                    c.showOperation = !0, e.removeClass("hover"), j.release(), j.disable()
                }
            })
        }}
    }]).directive("eqxPicturesImagePreview", ["picturesService", function (a) {
        return{link: function (b, c) {
            var d, e, f = $(c), g = $(".pic-preview"), h = {width: g.width(), height: g.height()}, i = h.width / h.height;
            f.hide(), f.load(function () {
                f.show(), e = {width: this.width, height: this.height}, a.setImageSize(e);
                var b, c = e.width / e.height;
                c > i ? ($(this).css({width: h.width, height: h.width / c}), b = {position: "absolute", top: "50%", marginTop: -h.width / c / 2}) : ($(this).css({width: h.height * c, height: h.height}), b = {margin: "auto"}), f.Jcrop({keySupport: !1, aspectRatio: i}, function () {
                    d = this
                }), $(".jcrop-holder").css(b), a.setJcrop(d), d.disable()
            })
        }}
    }]).directive("eqxPicturesImageClick", ["$compile", "picturesService", function (a, b) {
        function c(b, c) {
            $(".pic-preview").html(a('<img eqx-pictures-image-preview ng-src="' + c + '" />')(b))
        }

        return{link: function (a, d) {
            var e = $(d);
            e.click(function () {
                if (!e.hasClass("hover")) {
                    var d = e.index();
                    b.setCurrentImage(d), c(a, $(this).find(".pic-img").attr("src"))
                }
            }), e.children(".delete-img").click(function (c) {
                c.stopPropagation(), e.hasClass("hover") && $(".pic-preview").empty();
                var d = e.index();
                b.deleteImages(d);
                var f = b.getCurrentImage();
                f > d ? b.setCurrentImage(--f) : d === f && b.setCurrentImage(-1), a.$apply()
            }), a.$on("crop.success", function (d, f) {
                if (e.hasClass("hover")) {
                    var g = PREFIX_FILE_HOST + f.src;
                    c(a, g);
                    var h = e.index();
                    b.updateImages(h, f)
                }
            })
        }}
    }]), b.module("scene.create.console.setting", ["scene.create.console.setting.style", "scene.create.console.setting.anim"]), b.module("scene.create.console.setting").directive("styleModal", ["sceneService", "$compile", function (a, b) {
        return{restrict: "AE", replace: !0, scope: {}, templateUrl: "scene/console/setting.tpl.html", link: function (a, b, c) {
            var d = "style";
            a.$on("showStylePanel", function (b, c) {
                d = a.activeTab, a.activeTab = "", a.$apply(), a.activeTab = c && c.activeTab ? c.activeTab : d, a.$apply()
            }), a.activeTab = c.activeTab, a.cancel = function () {
                $(b).hide()
            }, a.$on("$locationChangeStart", function () {
                a.cancel()
            })
        }, controller: ["$scope", function (a) {
        }]}
    }]), b.module("scene.create.console.setting.style", ["colorpicker.module", "app.directives.style", "app.directives.uislider", "app.directives.limitInput"]), b.module("scene.create.console.setting.style").controller("StyleConsoleCtrl", ["$scope", "sceneService", function (a, b) {
        var c = a.elemDef = b.currentElemDef;
        delete c.css.borderTopLeftRadius, delete c.css.borderTopRightRadius, delete c.css.borderBottomLeftRadius, delete c.css.borderBottomRightRadius, delete c.css.border;
        var d = c.css, e = $("#inside_" + a.elemDef.id + " > .element-box");
        if (a.model = {backgroundColor: d.backgroundColor || "", opacity: 100 - 100 * d.opacity || 0, color: d.color || "#676767", borderWidth: parseInt(d.borderWidth, 10) || 0, borderStyle: d.borderStyle || "solid", borderColor: d.borderColor || "rgba(0,0,0,1)", paddingBottom: parseInt(d.paddingBottom, 10) || 0, paddingTop: parseInt(d.paddingTop, 10) || 0, lineHeight: +d.lineHeight || 1, borderRadius: parseInt(d.borderRadius, 10) || 0, transform: d.transform && parseInt(d.transform.replace("rotateZ(", "").replace("deg)", ""), 10) || 0}, a.maxRadius = Math.min(e.outerWidth(), e.outerHeight()) / 2 + 10, d.borderRadiusPerc ? a.model.borderRadiusPerc = parseInt(d.borderRadiusPerc, 10) : d.borderRadius ? "999px" == d.borderRadius ? a.model.borderRadiusPerc = 100 : (a.model.borderRadiusPerc = parseInt(100 * parseInt(d.borderRadius, 10) * 2 / Math.min(e.outerWidth(), e.outerHeight()), 10), a.model.borderRadiusPerc > 100 && (a.model.borderRadiusPerc = 100)) : a.model.borderRadiusPerc = 0, a.tmpModel = {boxShadowDirection: 0, boxShadowX: 0, boxShadowY: 0, boxShadowBlur: 0, boxShadowSize: 0, boxShadowColor: "rgba(0,0,0,0.5)"}, d.boxShadow) {
            var f = d.boxShadow.split(" ");
            a.tmpModel.boxShadowX = parseInt(f[0], 10), a.tmpModel.boxShadowY = parseInt(f[1], 10), a.tmpModel.boxShadowDirection = parseInt(d.boxShadowDirection, 10) || 0, a.tmpModel.boxShadowBlur = parseInt(f[2], 10), a.tmpModel.boxShadowColor = f[3], a.tmpModel.boxShadowSize = parseInt(d.boxShadowSize, 10) || 0
        }
        a.clear = function () {
            a.model = {backgroundColor: "", opacity: 0, color: "#676767", borderWidth: 0, borderStyle: "solid", borderColor: "rgba(0,0,0,1)", paddingBottom: 0, paddingTop: 0, lineHeight: 1, borderRadius: 0, transform: 0}, a.tmpModel = {boxShadowDirection: 0, boxShadowX: 0, boxShadowY: 0, boxShadowBlur: 0, boxShadowSize: 0, boxShadowColor: "rgba(0,0,0,0.5)"}
        }, a.$watch("tmpModel", function (b, d) {
            var e = {};
            $.extend(!0, e, a.model), e.borderRadius += "px", e.borderTopLeftRadius = e.borderTopRightRadius = e.borderBottomLeftRadius = e.borderBottomRightRadius = e.borderRadius, e.opacity = (100 - a.model.opacity) / 100, e.boxShadow = Math.round(a.tmpModel.boxShadowX) + "px " + Math.round(a.tmpModel.boxShadowY) + "px " + a.tmpModel.boxShadowBlur + "px " + a.tmpModel.boxShadowColor, e.boxShadowDirection = a.tmpModel.boxShadowDirection, e.boxShadowSize = a.tmpModel.boxShadowSize, e.transform = "rotateZ(" + a.model.transform + "deg)", $.extend(!0, c.css, e)
        }, !0), a.$watch("model", function (b, d) {
            var e = {};
            $.extend(!0, e, a.model), e.borderRadius += "px", e.borderTopLeftRadius = e.borderTopRightRadius = e.borderBottomLeftRadius = e.borderBottomRightRadius = e.borderRadius, e.opacity = (100 - a.model.opacity) / 100, e.boxShadow = Math.round(a.tmpModel.boxShadowX) + "px " + Math.round(a.tmpModel.boxShadowY) + "px " + a.tmpModel.boxShadowBlur + "px " + a.tmpModel.boxShadowColor, e.boxShadowDirection = a.tmpModel.boxShadowDirection, e.boxShadowSize = a.tmpModel.boxShadowSize, e.transform = "rotateZ(" + a.model.transform + "deg)", $.extend(!0, c.css, e)
        }, !0)
    }]).directive("styleInput", function () {
        return{restrict: "AE", link: function (a, b, c) {
            var d = $("#inside_" + a.elemDef.id + " > .element-box");
            a.$watch(function () {
                return $(b).val()
            }, function () {
                if ("borderWidth" == c.cssItem) {
                    d.css({borderStyle: a.model.borderStyle, borderWidth: $(b).val()});
                    var e = {width: d.width(), height: d.height()};
                    if (4 == a.elemDef.type) {
                        var f = d.find("img"), g = f.width() / f.height(), h = e.width / e.height;
                        g >= h ? (f.outerHeight(e.height), f.outerWidth(e.height * g), f.css("marginLeft", -(f.outerWidth() - e.width) / 2), f.css("marginTop", 0)) : (f.outerWidth(e.width), f.outerHeight(e.width / g), f.css("marginTop", -(f.outerHeight() - e.height) / 2), f.css("marginLeft", 0)), a.elemDef.properties.imgStyle.marginTop = f.css("marginTop"), a.elemDef.properties.imgStyle.marginLeft = f.css("marginLeft"), a.elemDef.properties.imgStyle.width = f.outerWidth(), a.elemDef.properties.imgStyle.height = f.outerHeight()
                    }
                }
                "borderRadius" == c.cssItem && d.css({borderRadius: a.model.borderRadius}), "opacity" == c.cssItem && d.css({opacity: (100 - $(b).val()) / 100}), "backgroundColor" == c.cssItem && d.css({backgroundColor: $(b).val()}), "color" == c.cssItem && d.css({color: $(b).val()}), "borderStyle" == c.cssItem && d.css({borderStyle: a.model.borderStyle}), "borderColor" == c.cssItem && d.css({borderColor: a.model.borderColor}), "padding" == c.cssItem && d.css({paddingTop: a.model.paddingTop, marginTop: -a.model.paddingBottom}), "lineHeight" == c.cssItem && d.css({lineHeight: a.model.lineHeight}), "transform" == c.cssItem && d.parents("li").css({transform: "rotateZ(" + a.model.transform + "deg)"}), "boxShadow" == c.cssItem && (a.tmpModel.boxShadowX = -Math.sin(a.tmpModel.boxShadowDirection * Math.PI / 180) * a.tmpModel.boxShadowSize, a.tmpModel.boxShadowY = Math.cos(a.tmpModel.boxShadowDirection * Math.PI / 180) * a.tmpModel.boxShadowSize, d.css({boxShadow: Math.round(a.tmpModel.boxShadowX) + "px " + Math.round(a.tmpModel.boxShadowY) + "px " + a.tmpModel.boxShadowBlur + "px " + a.tmpModel.boxShadowColor}))
            })
        }}
    }).directive("angleKnob", function () {
        return{restrict: "AE", templateUrl: "scene/console/angle-knob.tpl.html", link: function (a, b, c) {
            function d(a, b) {
                var c = Math.sqrt((a - 28) * (a - 28) + (b - 28) * (b - 28)) / 28, d = 28 + (a - 28) / c, e = 28 + (b - 28) / c;
                g.css({top: Math.round(e), left: Math.round(d)})
            }

            function e(a, b) {
                var c = a - 28, d = 28 - b, e = 180 * Math.atan(c / d) / Math.PI;
                return b > 28 && (e += 180), 28 >= b && 28 > a && (e += 360), Math.round(e)
            }

            var f = $(b).find(".sliderContainer"), g = $(b).find(".sliderKnob");
            a.$watch(function () {
                return a.tmpModel.boxShadowDirection
            }, function (a) {
                g.css({top: 28 - 28 * Math.cos(a * Math.PI / 180), left: 28 + 28 * Math.sin(a * Math.PI / 180)})
            }), 0 !== a.tmpModel.boxShadowDirection && g.css({top: 28 - 28 * Math.cos(a.tmpModel.boxShadowDirection * Math.PI / 180), left: 28 + 28 * Math.sin(a.tmpModel.boxShadowDirection * Math.PI / 180)}), f.bind("mousedown", function (b) {
                b.stopPropagation();
                var c = f.offset().left, g = f.offset().top;
                d(b.pageX - c, b.pageY - g);
                var h = e(b.pageX - c, b.pageY - g);
                a.tmpModel.boxShadowDirection = h, a.$apply(), $(this).bind("mousemove", function (b) {
                    b.stopPropagation(), d(b.pageX - c, b.pageY - g);
                    var f = e(b.pageX - c, b.pageY - g);
                    a.tmpModel.boxShadowDirection = f, a.$apply()
                }), $(this).bind("mouseup", function (a) {
                    $(this).unbind("mousemove"), $(this).unbind("mouseup")
                })
            })
        }}
    }), b.module("scene.create.console.tel", ["app.directives.addelement"]), b.module("scene.create.console.tel").controller("TelConsoleCtrl", ["$scope", "$timeout", "localizedMessages", "obj", function (a, c, d, e) {
        a.model = {title: e.properties.title, number: e.properties.number}, a.confirm = function () {
            if (!a.model.title || 0 === a.model.title.length)return alert("按钮名称不能为空"), void $('.bg_console input[type="text"]').focus();
            if (!a.model.number || 0 === a.model.title.number)return alert("电话号码不能为空"), void $('.bg_console input[type="text"]').focus();
            var b = new RegExp(/(\d{11})|^((\d{7,8})|(^400[0-9]\d{6})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/g);
            return b.test(a.model.number) ? void a.$close(a.model) : void alert("手机号码格式错误")
        }, a.cancel = function () {
            a.$dismiss()
        }, a.removePlaceHolder = function (a) {
            $(".tel-button").attr("placeholder", "")
        }, a.addPlaceHolder = function () {
            $(".tel-button").attr("placeholder", "010-88888888")
        }, a.chooseTelButton = function (b, c, d) {
            a.model.title = b.text, "A" == d.target.nodeName && (a.model.btnStyle = b.btnStyle), a.btnIndex = c
        }, a.buttons = [
            {id: 1, text: "一键拨号", btnStyle: {width: "90px", backgroundColor: "rgb(244, 113, 31)", height: "30px", "text-algn": "center", "line-height": "30px", color: "rgb(255, 255, 255)", "-webkit-border-radius": "5px", "-moz-border-radius": "5px", "border-radius": "3px"}},
            {id: 2, text: "热线电话", btnStyle: {width: "90px", backgroundColor: "rgb(253, 175, 7)", height: "30px", "text-algn": "center", "line-height": "30px", color: "rgb(255, 255, 255)", "-webkit-border-radius": "40px", "-moz-border-radius": "40px", "border-radius": "3px"}},
            {id: 3, text: "拨打电话", btnStyle: {width: "90px", backgroundColor: "rgb(121, 196, 80)", height: "30px", "text-algn": "center", "line-height": "30px", color: "rgb(255, 255, 255)", "-webkit-border-radius": "5px", "-moz-border-radius": "5px", "border-radius": "3px"}},
            {id: 4, text: "一键拨号", btnStyle: {width: "90px", height: "30px", backgroundColor: "#fff", "text-algn": "center", border: "1px solid #3FB816", "line-height": "30px", color: "rgb(0, 0, 0)", "-webkit-border-radius": "5px", "-moz-border-radius": "5px", "border-radius": "3px"}}
        ], b.forEach(a.buttons, function (b, c) {
            e.css.background && e.css.background == b.btnStyle.background && (a.btnIndex = c)
        })
    }]), b.module("scene.create.console.video", []), b.module("scene.create.console.video").controller("VideoCtrl", ["$scope", "$timeout", "obj", function (a, b, c) {
        function d(a) {
            var b = a.substring(a.indexOf("src=") + 4), c = b.substring(b.indexOf("://") + 3), d = c.substring(0, c.indexOf("/"));
            return d.indexOf("v.qq") >= 0 || d.indexOf("tudou") >= 0 || d.indexOf("youku") >= 0 ? !0 : !1
        }

        a.model || (a.model = {}), a.model.src = c.properties.src, a.confirm = function () {
            if (!a.model.src)return void alert("请输入视频地址");
            var b = d(a.model.src);
            return b ? void a.$close(a.model.src) : void alert("暂不支持添加此视频！")
        }, a.cancel = function () {
            a.$dismiss()
        }
    }]), b.module("scene.create", ["app.directives.editor", "services.scene", "confirm-dialog", "services.modal", "app.directives.component", "services.pagetpl", "scene.create.console", "app.directives.comp.editor", "app.directives.addelement", "scene.my.upload", "services.i18nNotifications", "services.history", "security.service", "scene.edit.select"]), b.module("scene.create").controller("CreateSceneCtrl", ["$timeout", "$compile", "$rootScope", "$scope", "$routeParams", "$route", "$location", "sceneService", "pageTplService", "$modal", "ModalService", "security", "$window", "i18nNotifications", "historyService", function (c, d, e, f, g, h, j, k, l, m, n, o, p, q, r) {
        function s(a, c, d, g) {
            f.loading = !0, $("#editBG").hide(), f.pageId = f.pages[a - 1].id, k.getSceneByPage(f.pageId, c, d).then(function (g) {
                f.loading = !1, f.tpl = g.data, w = JSON.stringify(f.tpl), f.sceneId = f.tpl.obj.sceneId, f.tpl.obj.properties && (f.tpl.obj.properties.image || f.tpl.obj.properties.scratch) ? (f.tpl.obj.properties.scratch ? f.scratch = f.tpl.obj.properties.scratch : f.tpl.obj.properties.image && (f.scratch.image = f.tpl.obj.properties.image, f.scratch.percentage = f.tpl.obj.properties.percentage, f.tpl.obj.properties.tip && (f.scratch.tip = f.tpl.obj.properties.tip)), f.effectName = "涂抹", b.forEach(f.scratches, function (a, b) {
                    a.path == f.scratch.image.path && (f.scratch.image = a)
                }), b.forEach(f.percentages, function (a, b) {
                    a.value == f.scratch.percentage.value && (f.scratch.percentage = a)
                })) : (f.scratch = {}, f.scratch.image = f.scratches[0], f.scratch.percentage = f.percentages[0]), f.tpl.obj.properties && f.tpl.obj.properties.finger ? (f.finger = f.tpl.obj.properties.finger, f.effectName = "指纹", b.forEach(f.fingerZws, function (a, b) {
                    a.path == f.finger.zwImage.path && (f.finger.zwImage = a)
                }), b.forEach(f.fingerBackgrounds, function (a, b) {
                    a.path == f.finger.bgImage.path && (f.finger.bgImage = a)
                })) : (f.finger = {}, f.finger.zwImage = f.fingerZws[0], f.finger.bgImage = f.fingerBackgrounds[0]), f.tpl.obj.properties && f.tpl.obj.properties.effect && "money" == f.tpl.obj.properties.effect.name && (f.effectName = "数钱", f.money = {tip: f.tpl.obj.properties.effect.tip}), f.tpl.obj.properties && f.tpl.obj.properties.fallingObject ? (f.falling = f.tpl.obj.properties.fallingObject, b.forEach(f.fallings, function (a, b) {
                    a.path == f.falling.src.path && (f.falling.src = a)
                }), f.effectName = "环境") : f.falling = {src: f.fallings[0], density: 2}, (c || d) && (j.$$search = {}, j.search("pageId", ++a), f.getPageNames()), f.pageNum = a, v = f.tpl.obj.scene.name, $("#nr").empty();
                var h = b.copy(f.tpl.obj);
                h.elements = r.addPage(h.id, h.elements), k.templateEditor.parse({def: f.tpl.obj, appendTo: "#nr", mode: "edit"}), e.$broadcast("dom.changed")
            }, function () {
                f.loading = !1
            })
        }

        function t() {
            q.pushForCurrentRoute("scene.save.success.nopublish", "notify.success")
        }

        f.loading = !1, f.PREFIX_FILE_HOST = PREFIX_FILE_HOST, f.tpl = {};
        var u, v = "", w = "", x = "";
        f.templateType = 1, f.categoryId = -1, f.isEditor = e.isEditor, f.createComp = k.createComp, f.createCompGroup = k.createCompGroup, f.updateCompPosition = k.updateCompPosition, f.updateCompAngle = k.updateCompAngle, f.updateCompSize = k.updateCompSize, f.openAudioModal = k.openAudioModal;
        var y = null;
        f.scratch || (f.scratch = {}), f.finger || (f.finger = {}), f.effectList = [
            {type: "scratch", name: "涂抹", src: CLIENT_CDN + "assets/images/create/waterdrop.jpg"},
            {type: "finger", name: "指纹", src: CLIENT_CDN + "assets/images/create/fingers/zhiwen1.png"},
            {type: "money", name: "数钱", src: CLIENT_CDN + "assets/images/create/money_thumb1.jpg"},
            {type: "fallingObject", name: "环境", src: CLIENT_CDN + "assets/images/create/falling.png"}
        ], f.scratches = [
            {name: "水滴", path: CLIENT_CDN + "assets/images/create/waterdrop.jpg"},
            {name: "细沙", path: CLIENT_CDN + "assets/images/create/sand.jpg"},
            {name: "花瓣", path: CLIENT_CDN + "assets/images/create/flowers.jpg"},
            {name: "金沙", path: CLIENT_CDN + "assets/images/create/goldsand.jpg"},
            {name: "白雪", path: CLIENT_CDN + "assets/images/create/snowground.jpg"},
            {name: "模糊", path: CLIENT_CDN + "assets/images/create/mohu.jpg"},
            {name: "落叶", path: CLIENT_CDN + "assets/images/create/leaves.jpg"},
            {name: "薄雾", path: CLIENT_CDN + "assets/images/create/smoke.png"}
        ], f.percentages = [
            {id: 1, value: .15, name: "15%"},
            {id: 2, value: .3, name: "30%"},
            {id: 3, value: .6, name: "60%"}
        ], f.fingerZws = [
            {name: "粉色指纹", path: CLIENT_CDN + "assets/images/create/fingers/zhiwen1.png"},
            {name: "白色指纹", path: CLIENT_CDN + "assets/images/create/fingers/zhiwen2.png"},
            {name: "蓝色指纹", path: CLIENT_CDN + "assets/images/create/fingers/zhiwen3.png"}
        ], f.fingerBackgrounds = [
            {name: "粉红回忆", path: CLIENT_CDN + "assets/images/create/fingers/bg1.jpg"},
            {name: "深蓝花纹", path: CLIENT_CDN + "assets/images/create/fingers/bg2.jpg"},
            {name: "淡绿清新", path: CLIENT_CDN + "assets/images/create/fingers/bg3.jpg"},
            {name: "深紫典雅", path: CLIENT_CDN + "assets/images/create/fingers/bg4.jpg"},
            {name: "淡紫水滴", path: CLIENT_CDN + "assets/images/create/fingers/bg5.jpg"},
            {name: "蓝白晶格", path: CLIENT_CDN + "assets/images/create/fingers/bg6.jpg"},
            {name: "蓝色水滴", path: CLIENT_CDN + "assets/images/create/fingers/bg7.jpg"},
            {name: "朦胧绿光", path: CLIENT_CDN + "assets/images/create/fingers/bg8.jpg"},
            {name: "灰色金属", path: CLIENT_CDN + "assets/images/create/fingers/bg9.jpg"}
        ], f.fallings = [
            {name: "福字", path: CLIENT_CDN + "assets/images/create/fallings/fuzi1.png", rotate: 180, vy: 3},
            {name: "红包", path: CLIENT_CDN + "assets/images/create/fallings/hongbao2.png", rotate: 180, vy: 3},
            {name: "绿枫叶", path: CLIENT_CDN + "assets/images/create/fallings/lvfengye.png", rotate: 180, vy: 3},
            {name: "星星", path: CLIENT_CDN + "assets/images/create/fallings/xing.png", rotate: 180, vy: 3},
            {name: "雪花", path: CLIENT_CDN + "assets/images/create/fallings/snow.png", rotate: 0, vy: 1}
        ], f.scratch.image = f.scratches[0], f.scratch.percentage = f.percentages[0], f.finger.zwImage = f.fingerZws[0], f.finger.bgImage = f.fingerBackgrounds[0], f.$on("dom.changed", function (a) {
            d($("#nr"))(f)
        }), f.openUploadModal = function () {
            y || (y = m.open({windowClass: "upload-console", templateUrl: "my/upload.tpl.html", controller: "UploadCtrl", resolve: {category: function () {
                return{categoryId: "0", fileType: "1", scratch: "scratch"}
            }}}).result.then(function (a) {
                f.scratch.image.path = f.PREFIX_FILE_HOST + a, f.scratch.image.name = "", y = null
            }, function () {
                y = null
            }))
        }, f.cancel = function () {
        }, f.cancelEffect = function () {
            f.effectType = "", $("#modalBackdrop1").remove()
        };
        var z = null;
        f.$on("showCropPanel", function (a, b) {
            var c = $(".content").eq(0);
            z ? (e.$broadcast("changeElemDef", b), z.show()) : z = d("<div crop-image></div>")(f), c.append(z)
        }), f.saveEffect = function (a) {
            if (f.tpl.obj.properties = {}, "scratch" == f.effectType)f.tpl.obj.properties.scratch = a, f.effectName = "涂抹"; else if ("finger" == f.effectType)f.tpl.obj.properties.finger = a, f.effectName = "指纹"; else if ("money" == f.effectType) {
                if (a && a.tip && i(a.tip) > 24)return alert("提示文字不能超过24个字符！"), void(f.tpl.obj.properties = null);
                a || (a = {tip: "握紧钱币，数到手抽筋吧！"}), f.tpl.obj.properties.effect = {name: "money", tip: a.tip}, f.effectName = "数钱"
            }
            "fallingObject" == f.effectType && (f.tpl.obj.properties.fallingObject = a, f.effectName = "环境"), f.cancelEffect()
        };
        var A = null;
        f.$on("showStylePanel", function (a, b) {
            var c = $(".content").eq(0);
            A ? A.show() : "style" == b.activeTab ? A = d('<div style-modal active-tab="style"></div>')(f) : "anim" == b.activeTab && (A = d('<div style-modal active-tab="anim"></div>')(f)), c.append(A)
        }), f.$on("hideStylePanel", function (a) {
            A && A.hide()
        }), f.refreshPage = function (a, b) {
            parseInt(b, 10);
            $("#nr").empty(), k.templateEditor.parse({def: f.tpl.obj, appendTo: "#nr", mode: "edit"}), e.$broadcast("dom.changed")
        }, f.navTo = function (a, b) {
            f.pageList = !0, !f.isEditor || 1101 !== f.sceneId && 1102 !== f.sceneId && 1103 !== f.sceneId || (f.pageLabelAll.length = 0, f.pageIdTag = a.id, f.getPageTagLabel()), a.id != f.tpl.obj.id && f.saveScene(null, function () {
                s(b + 1), j.$$search = {}, j.search("pageId", a.num)
            })
        }, f.stopCopy = function () {
            copied = !1
        }, f.getOriginPageName = function (a) {
            x = a.name
        }, f.getPageNames = function () {
            var a = g.sceneId;
            k.getPageNames(a).then(function (a) {
                f.pages = a.data.list, b.forEach(f.pages, function (a, b) {
                    a.name || (a.name = "第" + (b + 1) + "页")
                }), s(j.search().pageId ? j.search().pageId : f.pages[0].num)
            })
        }, f.getPageNames(), f.editableStatus = [], f.savePageNames = function (a, b) {
            a.name || (a.name = "第" + (b + 1) + "页"), f.tpl.obj.name = a.name, x != a.name && k.savePageNames(f.tpl.obj).then(function (a) {
                q.pushForCurrentRoute("page.change.success", "notify.success")
            })
        }, f.removeScratch = function (a) {
            a.stopPropagation(), f.tpl.obj.properties = null
        }, f.$on("text.click", function (a, b) {
            $("#btn-toolbar").remove(), $("body").append(d("<toolbar></toolbar>")(f));
            var e = $(b).offset().top;
            c(function () {
                $("#btn-toolbar").css("top", e - 50), $("#btn-toolbar").show(), $("#btn-toolbar").bind("click mousedown", function (a) {
                    a.stopPropagation()
                }), $(b).wysiwyg_destroy(), $(b).wysiwyg(), b.focus()
            })
        }), f.updatePosition = function (a) {
            var b, c, d = f.tpl.obj.elements, e = [];
            for (c = 0; c < d.length; c++)if ("3" == d[c].type) {
                d[c].num = 0, e.push(d[c]), d.splice(c, 1);
                break
            }
            for (b = 0; b < a.length; b++)for (c = 0; c < d.length; c++)if (d[c].num == a[b]) {
                d[c].num = b + 1, e.push(d[c]), d.splice(c, 1);
                break
            }
            f.tpl.obj.elements = e
        }, f.updateEditor = function () {
            $("#nr").empty(), k.templateEditor.parse({def: f.tpl.obj, appendTo: "#nr", mode: "edit"}), d($("#nr"))(f)
        };
        var B = !1;
        f.saveScene = function (a, c) {
            if (!B) {
                if (B = !0, w == JSON.stringify(f.tpl))return c && c(), a && (!f.tpl.obj.scene.publishTime || f.tpl.obj.scene.updateTime > f.tpl.obj.scene.publishTime ? t() : q.pushForCurrentRoute("scene.save.success.published", "notify.success")), void(B = !1);
                "" === f.tpl.obj.scene.name && (f.tpl.obj.scene.name = v), f.tpl.obj.scene.name = f.tpl.obj.scene.name.replace(/(<([^>]+)>)/gi, ""), k.getSceneObj().obj.scene.image && k.getSceneObj().obj.scene.image.bgAudio && (f.tpl.obj.scene.image || (f.tpl.obj.scene.image = {}), f.tpl.obj.scene.image.bgAudio = k.getSceneObj().obj.scene.image.bgAudio), k.resetCss(), k.saveScene(f.tpl.obj).then(function () {
                    B = !1, f.tpl.obj.scene.updateTime = (new Date).getTime(), w = b.toJson(f.tpl), u && (k.recordTplUsage(u), u = null), c && c(), a && t()
                }, function () {
                    B = !1
                })
            }
        }, f.publishScene = function () {
            return f.tpl.obj.scene.publishTime && f.tpl.obj.scene.updateTime <= f.tpl.obj.scene.publishTime && w == b.toJson(f.tpl) ? void j.path("my/scene/" + f.sceneId) : void f.saveScene(null, function () {
                k.publishScene(f.tpl.obj.sceneId).then(function (a) {
                    a.data.success && (q.pushForNextRoute("scene.publish.success", "notify.success"), j.path(f.tpl.obj.scene.publishTime ? "my/scene/" + f.sceneId : "my/sceneSetting/" + f.sceneId))
                })
            })
        }, f.exitScene = function () {
            JSON.parse(w);
            w == b.toJson(f.tpl) ? p.history.back() : n.openConfirmDialog({msg: "是否保存更改内容？", confirmName: "保存", cancelName: "不保存"}, function () {
                f.saveScene(), p.history.back()
            }, function () {
                p.history.back()
            })
        }, f.duplicatePage = function () {
            f.saveScene(null, function () {
                s(f.pageNum, !1, !0)
            })
        }, f.insertPage = function () {
            f.saveScene(null, function () {
                s(f.pageNum, !0, !1)
            }), $("#pageList").height() >= 360 && c(function () {
                var a = document.getElementById("pageList");
                a.scrollTop = a.scrollHeight
            }, 200)
        }, f.deletePage = function (a) {
            a.stopPropagation(), f.loading || (f.loading = !0, k.deletePage(f.tpl.obj.id).then(function () {
                f.loading = !1, j.$$search = {}, f.pages.length == f.pageNum ? (f.pages.pop(), j.search("pageId", --f.pageNum), s(f.pageNum, !1, !1)) : (f.pages.splice(f.pageNum - 1, 1), j.search("pageId", f.pageNum), s(f.pageNum, !1, !1))
            }, function () {
                f.loading = !1
            }))
        }, f.removeBG = function (a) {
            a.stopPropagation();
            var b, c = f.tpl.obj.elements;
            for (b = 0; b < c.length; b++)if (3 == c[b].type) {
                c.splice(b, 1);
                var d;
                for (d = b; d < c.length; d++)c[d].num--;
                break
            }
            $("#nr .edit_area").parent().css({backgroundColor: "transparent", backgroundImage: "none"}), $("#editBG").hide()
        }, f.removeBGAudio = function (a) {
            a.stopPropagation(), delete f.tpl.obj.scene.image.bgAudio
        }, $(".scene_title").on("paste", function (a) {
            a.preventDefault();
            var b = (a.originalEvent || a).clipboardData.getData("text/plain") || prompt("Paste something..");
            document.execCommand("insertText", !1, b)
        }), f.showPageEffect = !1, f.openPageSetPanel = function () {
            f.showPageEffect || (f.showPageEffect = !0, $('<div id="modalBackdrop" class="modal-backdrop fade in" ng-class="{in: animate}" ng-style="{\'z-index\': 1040 + (index &amp;&amp; 1 || 0) + index*10}" modal-backdrop="" style="z-index: 1040;"></div>').appendTo("body").click(function () {
                f.showPageEffect = !1, f.$apply(), $(this).remove()
            }))
        }, f.openOneEffectPanel = function (a) {
            f.showPageEffect = !1, $("#modalBackdrop").remove(), f.effectType = a.type ? a.type : a.image || a.scratch ? "scratch" : a.finger ? "finger" : a.fallingObject ? "fallingObject" : a.effect.name, $('<div id="modalBackdrop1" class="modal-backdrop fade in" ng-class="{in: animate}" ng-style="{\'z-index\': 1040 + (index &amp;&amp; 1 || 0) + index*10}" modal-backdrop="" style="z-index: 1040;"></div>').appendTo("body").click(function () {
                f.effectType = "", f.$apply(), $(this).remove()
            })
        }, f.myName = [
            {name: "我的"}
        ], f.myCompany = [
            {name: "企业"}
        ], f.creatCompanyTemplate = function () {
            var a = $.extend(!0, {}, f.tpl.obj);
            if (e.user) {
                var b = parseInt(e.user.companyTplId, 10);
                a.sceneId = b ? b : e.companySceneId ? e.companySceneId : null, k.saveCompanyTpl(a).then(function (a) {
                    a.data.success && (alert("成功生成企业模板"), e.companySceneId = a.data.obj, f.getPageTplsByCompanyType())
                })
            } else f.myCompanyTpls = []
        };
        var C = null;
        f.getPageTplsByCompanyType = function () {
            if (f.myCompany[0].active = !0, !C)if (e.companySceneId)C = e.companySceneId; else {
                var a = parseInt(e.user.companyTplId, 10);
                a && (C = e.companySceneId = a)
            }
            C ? k.previewScene(C).then(function (a) {
                f.myCompanyTpls = a.data.list
            }) : f.myCompanyTpls = []
        }, f.creatMyTemplate = function () {
            var a = $.extend(!0, {}, f.tpl.obj);
            if (e.user) {
                var b = JSON.parse(e.user.property);
                a.sceneId = b && b.myTplId ? b.myTplId : e.mySceneId ? e.mySceneId : null, k.saveMyTpl(a).then(function (a) {
                    alert("成功生成我的模板");
                    e.mySceneId = a.data.obj, f.getPageTplsByMyType()
                })
            } else f.myPageTpls = []
        };
        var D = null;
        f.getPageTplsByMyType = function () {
            if (f.myName[0].active = !0, !D)if (e.mySceneId)D = e.mySceneId; else {
                var a = JSON.parse(e.user.property);
                a && a.myTplId && (D = e.mySceneId = a.myTplId)
            }
            D ? k.previewScene(D).then(function (a) {
                f.myPageTpls = a.data.list
            }) : f.myPageTpls = []
        }, f.$on("myPageList.update", function (a, b, c) {
            "my-tpl" == b && f.getPageTplsByMyType(), "company-tpl" == b && f.getPageTplsByCompanyType()
        }), f.$on("myPageList.delete", function (a, b, c) {
            "company-tpl" == b && 21 == e.user.type && (c.context.firstElementChild.outerHTML = "")
        });
        var E = function () {
            var a = "1" == f.type ? 3 : 4;
            f.childCatrgoryList && f.childCatrgoryList.length > a ? (f.otherCategory = f.childCatrgoryList.slice(a), f.childCatrgoryList = f.childCatrgoryList.slice(0, a)) : f.otherCategory = [];

        }, F = {};
        f.getPageTplsByType = function (a) {
            F[a] ? (f.childCatrgoryList = F[a], f.getPageTplTypestemp(f.childCatrgoryList[0].id, a), E()) : l.getPageTagLabel(a).then(function (b) {
                f.childCatrgoryList = F[a] = b.data.list, f.getPageTplTypestemp(f.childCatrgoryList[0].id, a), E()
            })
        };
        var G = {};
        f.getPageTagLabel = function (a) {
            G[a] ? (f.pageLabel = G[a], I()) : l.getPageTagLabel(a).then(function (b) {
                f.pageLabel = G[a] = b.data.list, I()
            })
        }, f.pageLabelAll = [];
        var H, I = function (a) {
            l.getPageTagLabelCheck(f.pageIdTag).then(function (a) {
                H = a.data.list;
                for (var b = 0; b < f.pageLabel.length; b++) {
                    for (var c = {id: f.pageLabel[b].id, name: f.pageLabel[b].name}, d = 0; d < H.length; d++) {
                        if (H[d].id === f.pageLabel[b].id) {
                            c.ischecked = !0;
                            break
                        }
                        c.ischecked = !1
                    }
                    f.pageLabelAll.push(c)
                }
            })
        };
        f.pageChildLabel = function () {
            var a, b = [];
            for (a = 0; a < f.pageLabelAll.length; a++)f.pageLabelAll[a].ischecked && b.push(f.pageLabelAll[a].id);
            l.updataChildLabel(b, f.pageIdTag).then(function () {
                alert("分配成功！"), h.reload()
            }, function () {
            })
        }, f.getPageTplTypestemp = function (a, b) {
            l.getPageTplTypestemp(a, b).then(function (b) {
                if (f.categoryId = a, f.pageTpls = b.data.list && b.data.list.length > 0 ? b.data.list : [], f.otherCategory.length > 0) {
                    var c;
                    c = f.childCatrgoryList[0];
                    for (var d = 0; d < f.otherCategory.length; d++)f.categoryId == f.otherCategory[d].id && (f.childCatrgoryList[0] = f.otherCategory[d], f.otherCategory[d] = c)
                }
            })
        }, f.getBigTab = function () {
            l.getPageTplTypes().then(function (a) {
                f.pageTplTypes = a.data.list && a.data.list.length > 0 ? a.data.list.splice(0, 3) : []
            }).then(function () {
                f.getPageTplsByType(f.pageTplTypes[0].value)
            })
        }, f.getBigTab(), f.exitPageTplPreview = function () {
            $("#nr").empty(), k.templateEditor.parse({def: f.tpl.obj, appendTo: "#nr", mode: "edit"}), e.$broadcast("dom.changed")
        }, f.insertPageTpl = function (a) {
            f.loading = !0;
            var b = function (a) {
                k.getSceneTpl(a).then(function (a) {
                    f.loading = !1, u = a.data.obj.id, f.tpl.obj.elements = k.getElements(), $("#nr").empty(), r.addPageHistory(f.tpl.obj.id, f.tpl.obj.elements), k.templateEditor.parse({def: f.tpl.obj, appendTo: "#nr", mode: "edit"}), e.$broadcast("dom.changed")
                }, function () {
                    f.loading = !1
                })
            };
            f.tpl.obj.elements && f.tpl.obj.elements.length > 0 ? n.openConfirmDialog({msg: "页面模板会覆盖编辑区域已有组件，是否继续？", confirmName: "是", cancelName: "取消"}, function () {
                b(a)
            }) : b(a)
        }, f.chooseThumb = function () {
            m.open({windowClass: "console", templateUrl: "scene/console/bg.tpl.html", controller: "BgConsoleCtrl", resolve: {obj: function () {
                return{fileType: "0"}
            }}}).result.then(function (a) {
                f.tpl.obj.properties || (f.tpl.obj.properties = {}), f.tpl.obj.properties.thumbSrc = a.data
            }, function () {
                f.tpl.obj.properties.thumbSrc = null
            })
        }, $(a).bind("beforeunload", function () {
            return"请确认您的场景已保存"
        }), f.$on("$destroy", function () {
            $(a).unbind("beforeunload"), r.clearHistory(), k.setCopy(!1)
        }), f.sortableOptions = {placeholder: "ui-state-highlight ui-sort-position", containment: "#containment", update: function (a, b) {
            var c = b.item.sortable.dropindex + 1, d = f.pages[b.item.sortable.index].id;
            f.saveScene(null, function () {
                k.changePageSort(c, d).then(function (a) {
                    s(c, !1, !1, !0), j.$$search = {}, j.search("pageId", c), f.pageNum = c
                })
            })
        }}, f.$on("history.changed", function () {
            f.canBack = r.canBack(f.tpl.obj.id), f.canForward = r.canForward(f.tpl.obj.id)
        }), f.back = function () {
            k.historyBack()
        }, f.forward = function () {
            k.historyForward()
        }
    }]).directive("changeColor", function () {
        return{link: function (a, b, c) {
            b.bind("click", function () {
                $(b).addClass("current")
            })
        }}
    }).directive("thumbTpl", ["sceneService", "ModalService", function (a, b) {
        return{scope: {myTpl: "="}, replace: !1, template: '<div class="delete-element" ng-click="deleteMyTpl($event)" title="删除此模板"><img ng-src="{{CLIENT_CDN}}assets/images/bg_07.png" /></div>', link: function (c, d, e) {
            c.$emit("myPageList.delete", e.id, d), c.deleteMyTpl = function (f) {
                f.stopPropagation(), b.openConfirmDialog({msg: "确定删除此模板?"}, function () {
                    a.deletePage(c.myTpl.id).then(function () {
                        c.$emit("myPageList.update", e.id, d)
                    }, function (a) {
                        alert("服务器异常!")
                    })
                })
            }, a.templateEditor.parse({def: c.myTpl, appendTo: d, mode: "view"}), $(".edit_area", d).css("transform", "scale(0.25) translateX(-480px) translateY(-729px)")
        }}
    }]), b.module("scene.create.new", ["services.scene"]), b.module("scene.create.new").controller("SceneNewCtrl", ["$scope", "$location", "sceneService", "items", function (a, c, d, e) {
        a.scene = {name: ""}, e && (a.scene.name = e.name), d.getSceneType().then(function (c) {
            if (a.scene.types = c.data.list, e) {
                var d = !0;
                b.forEach(a.scene.types, function (b, f) {
                    if (d) {
                        var g = "" + e.type;
                        b.value === g ? (a.scene.type = b, d = !1) : a.scene.type = c.data.list[0]
                    }
                })
            } else a.scene.type = c.data.list[0]
        }), a.create = function () {
            if ("" === a.scene.name.trim())return void alert("请输入场景名称");
            var b = i(a.scene.name.trim());
            if (b > 48)return void alert("场景名称不能超过48个字符或24个汉字");
            if (e) {
                var f = {id: e.id, name: a.scene.name, type: a.scene.type.value, pageMode: a.scene.pageMode.id};
                d.createByTpl(f).then(function (a) {
                   if(a.data.code == 1006){
								alert("抱歉您的"+a.data.msg+"次创建场景次数已经用完，请联系管理员！")
								return false;
							}
					 c.path("scene/create/" + a.data.obj), c.search("pageId", 1)
                }, function (a) {
                })
            } else d.createBlankScene(a.scene.name, a.scene.type.value, a.scene.pageMode.id).then(function (a) {
               if(a.data.code == 1006){
								alert("您的"+a.data.msg+"次创建场景次数已经用完，请联系管理员！")
								return false;
							}
				 c.path("scene/create/" + a.data.obj), c.search("pageId", 1)
            });
            a.$close()
        }, a.cancel = function () {
            a.$dismiss()
        }, a.pagemodes = [
            {id: 2, name: "上下翻页"},
            {id: 1, name: "左右翻页"}
        ], a.scene.pageMode = a.pagemodes[0]
    }]), b.module("scene.edit.select", ["services.history", "services.scene"]).controller("selectCtrl", ["$scope", function (a) {
        a.pasteOpacity = .3, a.$on("select.more", function () {
            a.safeApply(function () {
                a.showSelectPanel = !0
            })
        }), a.$on("select.less", function () {
            a.safeApply(function () {
                a.showSelectPanel = !1
            })
        }), a.$on("copyState.update", function (b, c) {
            a.safeApply(function () {
                a.pasteOpacity = c ? 1 : .3
            })
        })
    }]).directive("eqxAlignLeft", ["selectService", "sceneService", "historyService", function (a, b, c) {
        return{link: function (d, e) {
            var f = $(e);
            f.click(function () {
                var e = 320, f = [], g = a.getElements();
                $.each(g, function (a, b) {
                    var c = $("#nr").find("#inside_" + b), d = c.position();
                    f.push({element: c, position: d});
                    var g = d.left;
                    e > g && (e = g)
                }), $.each(f, function (a, c) {
                    c.position.left = e, c.element.css(c.position), b.updateCompPosition("inside_" + g[a], c.position, !0)
                });
                var h = b.getSceneObj();
                c.addPageHistory(h.obj.id, h.obj.elements), d.$apply()
            })
        }}
    }]).directive("eqxAlignHorizontalCenter", ["selectService", "sceneService", "historyService", function (a, b, c) {
        return{link: function (d, e) {
            var f = $(e);
            f.click(function () {
                var e, f = 0, g = [], h = a.getElements();
                $.each(h, function (a, b) {
                    var c = $("#nr").find("#inside_" + b), d = c.position();
                    g.push({element: c, position: d});
                    var h = c.width();
                    h > f && (f = h, e = d.left)
                }), $.each(g, function (a, c) {
                    c.position.left = e + f / 2 - c.element.width() / 2, c.element.css(c.position), b.updateCompPosition("inside_" + h[a], c.position, !0)
                });
                var i = b.getSceneObj();
                c.addPageHistory(i.obj.id, i.obj.elements), d.$apply()
            })
        }}
    }]).directive("eqxAlignRight", ["selectService", "sceneService", "historyService", function (a, b, c) {
        return{link: function (d, e) {
            var f = $(e);
            f.click(function () {
                var e = 320, f = [], g = a.getElements();
                $.each(g, function (a, b) {
                    var c = $("#nr").find("#inside_" + b), d = c.position();
                    f.push({element: c, position: d});
                    var g = 320 - (d.left + c.width());
                    e > g && (e = g)
                }), $.each(f, function (a, c) {
                    c.position.left = 320 - (c.element.width() + e), c.element.css(c.position), b.updateCompPosition("inside_" + g[a], c.position, !0)
                });
                var h = b.getSceneObj();
                c.addPageHistory(h.obj.id, h.obj.elements), d.$apply()
            })
        }}
    }]).directive("eqxAlignTop", ["selectService", "sceneService", "historyService", function (a, b, c) {
        return{link: function (d, e) {
            var f = $(e);
            f.click(function () {
                var e = 320, f = [], g = a.getElements();
                $.each(g, function (a, b) {
                    var c = $("#nr").find("#inside_" + b), d = c.position();
                    f.push({element: c, position: d});
                    var g = d.top;
                    e > g && (e = g)
                }), $.each(f, function (a, c) {
                    c.position.top = e, c.element.css(c.position), b.updateCompPosition("inside_" + g[a], c.position, !0)
                });
                var h = b.getSceneObj();
                c.addPageHistory(h.obj.id, h.obj.elements), d.$apply()
            })
        }}
    }]).directive("eqxAlignVerticalCenter", ["selectService", "sceneService", "historyService", function (a, b, c) {
        return{link: function (d, e) {
            var f = $(e);
            f.click(function () {
                var e, f = 0, g = [], h = a.getElements();
                $.each(h, function (a, b) {
                    var c = $("#nr").find("#inside_" + b), d = c.position();
                    g.push({element: c, position: d});
                    var h = c.height();
                    h > f && (f = h, e = d.top)
                }), $.each(g, function (a, c) {
                    c.position.top = e + f / 2 - c.element.height() / 2, c.element.css(c.position), b.updateCompPosition("inside_" + h[a], c.position, !0)
                });
                var i = b.getSceneObj();
                c.addPageHistory(i.obj.id, i.obj.elements), d.$apply()
            })
        }}
    }]).directive("eqxAlignBottom", ["selectService", "sceneService", "historyService", function (a, b, c) {
        return{link: function (d, e) {
            var f = $(e);
            f.click(function () {
                var e = 320, f = [], g = a.getElements();
                $.each(g, function (a, b) {
                    var c = $("#nr").find("#inside_" + b), d = c.position();
                    f.push({element: c, position: d});
                    var g = 320 - (d.top + c.height());
                    e > g && (e = g)
                }), $.each(f, function (a, c) {
                    c.position.top = 320 - (c.element.height() + e), c.element.css(c.position), b.updateCompPosition("inside_" + g[a], c.position, !0)
                });
                var h = b.getSceneObj();
                c.addPageHistory(h.obj.id, h.obj.elements), d.$apply()
            })
        }}
    }]).directive("eqxCopy", ["selectService", "sceneService", function (a, b) {
        return{link: function (a, c) {
            var d = $(c);
            d.click(function () {
                b.copyElement()
            })
        }}
    }]).directive("eqxPaste", ["sceneService", "historyService", function (a, b) {
        return{link: function (c, d) {
            var e = $(d);
            e.click(function () {
                if (a.getCopy()) {
                    a.pasteElement();
                    var d = a.getSceneObj();
                    b.addPageHistory(d.obj.id, d.obj.elements), c.$apply()
                }
            })
        }}
    }]).directive("eqxDeleteMore", ["selectService", "sceneService", "historyService", function (a, b, c) {
        return{link: function (d, e) {
            var f = $(e);
            f.click(function () {
                var e = a.getElements();
                $.each(e, function (a, c) {
                    $("#nr").find("#inside_" + c).remove(), b.deleteElement(c)
                }), a.clearElements();
                var f = b.getSceneObj();
                c.addPageHistory(f.obj.id, f.obj.elements), d.$apply()
            })
        }}
    }]), b.module("scene", ["scene.create", "services.scene", "scene.create.new", "app.directives.addelement"]), b.module("scene").controller("SceneCtrl", ["$window", "$scope", "$location", "sceneService", "$modal", function (b, c, d, e, f) {
        c.PREFIX_FILE_HOST = PREFIX_FILE_HOST, c.PREFIX_CLIENT_HOST = PREFIX_HOST, c.isActive = "scene", c.scene = {type: null}, c.totalItems = 0, c.currentPage = 1, c.toPage = "", c.tabindex = 0, c.childcat = 0, c.order = "new";
        var g = 12, h = 0;
        c.pageNoNum = 1, c.pageChanged = function (a) {
            return i.targetPage = a, c.pageNoNum = a, 1 > a || a > c.totalItems / 11 + 1 ? void alert("此页超出范围") : void(1 == c.childcat ? c.getCompanyTpl(a, c.pageSizeList) : c.getPageTpls(1, i.sceneType, i.tagId, a, c.pageSizeList, c.order))
        }, c.preview = function (b) {
            var c = PREFIX_HOST + "/v-" + b;
            a.open(c, "_blank")
        }, c.createScene = function (a) {
            f.open({windowClass: "login-container", templateUrl: "scene/createNew.tpl.html", controller: "SceneNewCtrl", resolve: {items: function () {
                return a
            }}})
        }, c.getStyle = function (a) {
            return{"background-image": "url(" + PREFIX_FILE_HOST + a + ")"}
        }, c.show = function (a) {
            console.log(a.target), $(a.target).children(".cc").css("display", "block")
        }, c.getCompanyTpl = function (a, b) {
            c.childcat = 1;
            var d = 11;
            c.childCatrgoryList = [], e.getCompanyTpls(c.pageNoNum, d).then(function (a) {
                a.data.list && a.data.list.length > 0 ? (c.tpls = a.data.list, c.totalItems = a.data.map.count, c.currentPage = a.data.map.pageNo, c.allPageCount = a.data.map.count, c.toPage = "") : c.tpls = []
            })
        }, e.getSceneType().then(function (a) {
            c.pageTplTypes = a.data.list && a.data.list.length > 0 ? a.data.list : []
        }).then(function () {
        }), c.tplnew = function (a) {
            c.order = a, i.orderby = a, i.tagId ? c.getPageTpls(null, i.sceneType, i.tagId, h, g, a) : c.getPageTpls(1)
        };
        var i = {sceneType: null, tagId: "", orderby: "new", pageNo: "0", targetPage: ""}, j = {};
        c.getPageTplsByType = function (a) {
            i.sceneType = a, c.childcat = a, c.categoryId = 0, j[a] ? (c.childCatrgoryList = j[a], c.getPageTpls(1, i.sceneType, c.childCatrgoryList[0].id, h, g, c.order)) : e.getPageTplTypesTwo(a, a).then(function (b) {
                c.childCatrgoryList = j[a] = b.data.list, c.getPageTpls(1, i.sceneType, c.childCatrgoryList[0].id, h, g, c.order)
            })
        }, c.allpage = function (a) {
            i.sceneType = a, c.childcat = 0, c.getPageTpls(1), c.childCatrgoryList = []
        }, c.getPageTpls = function (a, b, d, f, g, h) {
            c.pageSizeList = 11, c.categoryId = d, i.tagId = d, e.getPageTpls(a, b, d, f, c.pageSizeList, i.orderby).then(function (a) {
                a.data.list && a.data.list.length > 0 ? (c.tpls = a.data.list, c.totalItems = a.data.map.count, c.currentPage = a.data.map.pageNo, c.allPageCount = a.data.map.count, c.toPage = "") : c.tpls = []
            })
        }, c.getPageTpls(1)
    }]), b.module("usercenter.branch", ["services.usercenter", "services.i18nNotifications"]), b.module("usercenter.branch").controller("BranchCtrl", ["$rootScope", "$scope", "$window", "$routeParams", "usercenterService", "security", "$modal", "ModalService", "$location", "branch", "i18nNotifications", function (a, c, d, e, f, g, h, j, k, l, m) {
        c.originData = c.branch = b.copy(l), c.dept = {}, l || (c.branch = {}), c.getDepts = function () {
            f.getDepts().then(function (a) {
                c.depts = a.data.list, (c.branch.deptName || c.branch.deptId) && b.forEach(c.depts, function (a, b) {
                    a.id == c.branch.deptId && (c.branch.dept = a)
                })
            }, function () {
                alert("服务器异常!")
            })
        }, c.getDepts(), c.addDept = function () {
            return c.dept.name ? i(c.dept.name) > 30 ? void alert("部门名称不能超过30个字符！") : void f.addDept(c.dept).then(function (a) {
                a.data.success && (c.showAddSec = !1, c.depts.unshift({id: a.data.obj, name: c.dept.name}), m.pushForCurrentRoute("dept.create.success", "notify.success"), c.dept = {})
            }, function () {
                alert("服务器异常!")
            }) : (alert("请输入部门名称！"), void(c.dept = {}))
        }, c.confirm = function () {
            var a = {};
            return c.branch.loginName ? /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/g.test(c.branch.loginName) ? c.branch.name ? i(c.branch.name) > 30 ? void alert("用户名不能超过30个字符！") : (c.branch.dept && (a.deptId = c.branch.dept.id, c.branch.deptId = c.branch.dept.id, c.branch.deptName = c.branch.dept.name), void(l ? ($.extend(a, {id: c.branch.id, name: c.branch.name}), f.updateBranch(a).then(function (a) {
                a.data.success && c.$close(c.branch)
            }, function (a) {
                alert("服务器异常！")
            })) : ($.extend(a, {loginName: c.branch.loginName, name: c.branch.name}), f.createBranch(a).then(function (a) {
                a.data.success ? (c.branch.id = a.data.obj.id, c.$close(c.branch)) : 1006 == a.data.code && alert("你已经创建过该账号！")
            }, function (a) {
                alert("服务器异常！")
            })))) : void alert("用户名不能为空！") : void alert("邮箱格式不正确！") : void alert("账号不能为空！")
        }, c.cancel = function () {
            c.$dismiss()
        }
    }]), b.module("usercenter.relAccount", ["services.usercenter"]), b.module("usercenter.relAccount").controller("RelAccountCtrl", ["$rootScope", "$scope", "$window", "$routeParams", "usercenterService", "security", "$modal", "ModalService", "$location", "userinfo", function (a, c, d, e, f, g, h, i, j, k) {
        c.relAccount = function () {
            var a = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            return a.test(c.user.email) ? c.user.password.trim() ? void f.relAccount(k.id, c.user.email, c.user.password).then(function (a) {
                if (200 == a.data.code) {
                    alert("绑定成功！"), /qq/gi.test(a.data.msg) && (c.relType = "qq"), /weixin/gi.test(a.data.msg) && (c.relType = "weixin"), /weibo/gi.test(a.data.msg) && (c.relType = "weibo");
                    var d = {type: c.relType, email: b.copy(c.user.email)};
                    c.$close(d)
                } else c.relErr = a.data.msg
            }, function (a) {
                c.$dismiss()
            }) : void alert("密码不能为空！") : void alert("请输入正确得邮箱格式")
        }, c.checkUpperCase = function () {
            /[A-Z]/g.test(c.user.email) && (c.user.email = c.user.email.toLowerCase(), alert("请用小写字母邮箱注册，已将邮箱中的大写字母自动转换成小写"))
        }, c.cancel = function () {
            c.$dismiss()
        }
    }]), b.module("usercenter.upgrade", ["services.usercenter", "services.i18nNotifications"]), b.module("usercenter.upgrade").controller("UsercenterupgradeCtrl", ["$rootScope", "$scope", "$window", "usercenterService", "security", "$modal", "ModalService", "i18nNotifications", function (a, b, c, d, e, f, g, h) {
        b.companyInfo = {}, b.upgradeCompanyMessage = function (c) {
            if (c) {
                var e = /^[0-9]*$/;
                if (c.mobile && !e.test(c.mobile))return b.authError = "电话格式不正确", void(c.mobile = "");
                var f = /^1\d{10}$/;
                if (c.tel && !f.test(c.tel))return b.authError = "手机格式不正确", void(c.tel = "");
                var g = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if (c.email && !g.test(c.email))return b.authError = "邮箱格式不正确", void(c.email = "");
                c.scale || (c.scale = {}), c.industry || (c.industry = {});
                var i = {name: c.name, website: c.website, address: c.address, contacts: c.contacts, tel: c.tel, mobile: c.mobile, license: c.license, email: c.email, department: c.department, scale: c.scale.value, industry: c.industry.value}, j = !0, k = function (a, c) {
                    return j && !a ? (b.authError = c, void(j = !1)) : void 0
                };
                if (k(c.name, "请填写企业名称"), k(c.website, "请填写网址"), k(c.address, "请填写联系地址"), k(c.contacts, "请填写联系人"), k(c.tel, "请填写手机号"), k(c.mobile, "请填写电话号码"), k(c.email, "请填写企业邮箱"), k(c.department, "请填写所属部门"), k(c.scale.value, "请企业规模"), k(c.industry.value, "请填写所属行业"), !j)return;
                d.saveCompanyInfo(i).then(function (c) {
                    c.data.success ? (h.pushForCurrentRoute("account.success", "notify.success"), b.$close(i), a.$broadcast("companyState")) : b.authError = c.data.msg
                })
            } else b.authError = "请填写企业信息"
        }, b.getCompanyInfo = function () {
            d.getCompanyInfo().then(function (a) {
                a.data.obj && (b.companyInfo = a.data.obj), b.getScale(), b.getCompanyIndustry()
            })
        }, b.getCompanyInfo(), b.getScale = function () {
            d.getCompanyScale().then(function (a) {
                b.scales = a.data.list;
                for (var c = 0; c < b.scales.length; c++)b.scales[c].value == b.companyInfo.scale && (b.companyInfo.scale = b.scales[c])
            })
        }, b.getCompanyIndustry = function () {
            d.getCompanyIndustry().then(function (a) {
                b.industries = a.data.list;
                for (var c = 0; c < b.industries.length; c++)b.industries[c].value == b.companyInfo.industry && (b.companyInfo.industry = b.industries[c])
            })
        }, b.goUpload = function () {
            f.open({windowClass: "upload-console", templateUrl: "my/upload.tpl.html", controller: "UploadCtrl", resolve: {category: function () {
                return{categoryId: 0, fileType: 1, companyImg: "companyImg"}
            }}}).result.then(function (a) {
                b.companyInfo || (b.companyInfo = {}), b.companyInfo.license = a
            }, function () {
            })
        }, b.quXiao = function () {
            b.$dismiss()
        }
    }]), b.module("usercenter.request", ["services.usercenter", "app.directives.qrcode"]), b.module("usercenter.request").controller("UsercenterrequestCtrl", ["$rootScope", "$scope", "$window", "$routeParams", "usercenterService", "security", "$modal", "ModalService", "$location", function (a, b, c, d, e, f, g, h, i) {
        b.PREFIX_CLIENT_HOST = PREFIX_HOST, b.currentUser = f.currentUser, b.cancel = function () {
            b.$dismiss()
        }
    }]), b.module("usercenter.transfer", ["services.usercenter"]), b.module("usercenter.transfer").controller("UsercentertransferCtrl", ["$rootScope", "$scope", "$window", "$routeParams", "usercenterService", "security", "$modal", "ModalService", "$location", "username", function (a, b, c, d, e, f, g, h, i, j) {
        b.actionerror = !1, b.retrieverror = !1, b.transfer = !0, b.userXd = {toUser: "", xdCount: ""}, b.submit = !1, b.getUserXd = function () {
            e.getUserXd().then(function (a) {
                a.data.success && (b.xdCount = a.data.obj)
            })
        }, b.getUserXd(), b.confirm = function () {
            b.submit = !0, b.getgiveXd()
        }, b.getgiveXd = function () {
            return b.userXd.toUser ? b.userXd.toUser == j ? void(b.actionerror = "不能把秀点转送给自己") : /^\+?[1-9][0-9]*$/.test(b.userXd.xdCount) ? (b.userXd.xdCount > b.xdCount && (b.retrieverror = "秀点不足"), void e.getgiveXd(b.userXd).then(function (a) {
                200 == a.data.code ? b.transfer = !1 : 1003 == a.data.code ? (b.actionerror = a.data.msg, b.retrieverror = "") : 1010 == a.data.code && (b.retrieverror = a.data.msg, b.actionerror = "")
            })) : void(b.retrieverror = "正确填写秀点数目") : void(b.actionerror = "账号不能为空")
        }, b.cancel = function () {
            b.$dismiss()
        }
    }]), b.module("usercenter", ["usercenter.transfer", "usercenter.upgrade", "usercenter.request", "services.usercenter", "services.localizedMessages", "security.service", "app.directives.addelement", "services.modal", "usercenter.relAccount", "usercenter.branch", "services.i18nNotifications"]), b.module("usercenter").controller("UserCenterCtrl", ["$rootScope", "$scope", "$window", "$routeParams", "usercenterService", "security", "$modal", "ModalService", "$location", "$filter", "fixnumFilter", "i18nNotifications", function (a, c, d, e, f, g, h, i, j, k, l, m) {
        c.PREFIX_FILE_HOST = PREFIX_FILE_HOST, c.PREFIX_SERVER_HOST = PREFIX_URL, c.PREFIX_CLIENT_HOST = PREFIX_HOST, c.isVendorUser = g.isVendorUser(), c.editInfo = {isEditable: !1}, c.password = {}, c.pageSize = 5, c.XdpageSize = 10, c.XdpageNo = 1, c.XdtoPage = "", c.pageNo = 1, c.toPage = c.XdcurrentPage = 1, c.branchToPage = 1, c.currentPage = {msgCurrentPage: 1, branchCurrentPage: 1}, c.getUserInfo = function () {
            f.getUserInfo().then(function (a) {
                c.userinfo = a.data.obj, c.master = b.copy(c.userinfo), c.userinfo.headImg ? /^http.*/.test(c.userinfo.headImg) && (c.headImg = c.userinfo.headImg) : c.headImg = CLIENT_CDN + "assets/images/defaultuser.jpg";
                var d = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                "eqs" != c.userinfo.loginName.substr(0, 3) || d.test(c.userinfo.loginName) || (c.userinfo.noRel = "未绑定", c.showRelButton = !0), /qq/gi.test(c.userinfo.relType) && (c.qqRel = !0), /weixin/gi.test(c.userinfo.relType) && (c.wxRel = !0), /weibo/gi.test(c.userinfo.relType) && (c.wbRel = !0), j.search().bindemail && c.relAccount()
            })
        }, c.getUserInfo(), c.emailAccount = !1, c.upgradeCompany = function () {
            "eqs" == c.userinfo.loginName.substr(0, 3) && null == c.userinfo.email ? c.emailAccount = !0 : h.open({windowClass: "upgrade_contain", templateUrl: "usercenter/console/upgrade_company.tpl.html", controller: "UsercenterupgradeCtrl", resolve: {}}).result.then(function () {
            }, function () {
            })
        }, c.getCompanyInfo = function () {
            f.getCompanyInfo().then(function (a) {
                c.companyInfo = a.data.obj
            })
        }, c.getCompanyInfo(), c.companyMes = !0, c.$on("companyState", function () {
            c.companyInfo || (c.companyInfo = {}), c.companyMes = !1, c.companyInfo.status = 0
        }), c.saveCompanyInfo = function (a) {
            var b = /^[0-9]*$/;
            if (a.mobile && !b.test(a.mobile))return alert("电话号码格式错误"), void(a.mobile = "");
            var d = /^1\d{10}$/;
            if (a.tel && !d.test(a.tel))return alert("手机号码格式错误"), void(a.tel = "");
            var e = {name: a.name, website: a.website, address: a.address, contacts: a.contacts, tel: a.tel, mobile: a.mobile};
            f.saveCompanyInfo(e).then(function (a) {
                a.data.success && (c.editInfo.isEditable = !1, alert("保存成功"))
            })
        }, c.saveUserInfo = function (a) {
            var b = /^1\d{10}$/;
            if (a.phone && !b.test(a.phone))return alert("手机号码格式错误"), void(a.phone = "");
            var d = /(^[1-9]\d*$)/;
            if (a.qq && !d.test(a.qq))return alert("qq号码格式错误"), void(a.qq = "");
            var e = /^[0-9]*$/;
            if (a.tel && !e.test(a.tel))return alert("电话号码格式错误"), void(a.tel = "");
            var g = {id: a.id, name: a.name, sex: a.sex, phone: a.phone, tel: a.tel, qq: a.qq, headImg: a.headImg};
            f.saveUserInfo(g).then(function (a) {
                a.data.success && (c.editInfo.isEditable = !1, alert("保存成功"))
            })
        }, c.tabid = e.id, c.getUserXd = function () {
            f.getUserXd().then(function (a) {
                a.data.success && (c.xdCounts = a.data.obj)
            })
        }, c.getUserXd(), c.getXdlog = function (a) {
            var b = a;
            f.getXdlog(b, c.XdpageSize).then(function (a) {
                a.data.success && (c.xdLogs = a.data.list, c.XdCount = a.data.map.count, c.XdcurrentPage = a.data.map.pageNo, c.XdNumPages = Math.ceil(c.XdCount / c.XdpageSize))
            })
        }, c.getXdlog(c.XdpageNo), c.XdpageChanged = function (a) {
            c.XdcurrentPage = a, c.getXdlog(a)
        }, c.getXdStat = function () {
            f.getXdStat().then(function (a) {
                c.getXdStat = a.data.map
            })
        }, c.getXdStat(), c.reset = function () {
            return c.password.newPw != c.password.confirm ? (c.authError = "新密码与重复密码不一致", c.password.newPw = "", c.password.confirm = "", void $('input[name="newPassword"]').focus()) : b.equals(c.master, c.password) ? void alert("请不要重复提交！") : void g.resetPassword(c.password.old, c.password.newPw).then(function (a) {
                a.data.success ? (c.authError = "", alert("修改成功"), c.master = b.copy(c.password), c.$close(c.master)) : c.authError = a.data.msg
            })
        }, c.openXd = function () {
            h.open({windowClass: "transfer_contain", templateUrl: "usercenter/transfer.tpl.html", controller: "UsercentertransferCtrl", resolve: {username: function () {
                return c.userinfo.loginName
            }}}).result.then(function () {
            }, function () {
            })
        }, c.customerUpload = function () {
            h.open({windowClass: "upload-console", templateUrl: "my/upload.tpl.html", controller: "UploadCtrl", resolve: {category: function () {
                return{categoryId: "0", fileType: "1", headerImage: "headerImage"}
            }}}).result.then(function (a) {
                $showCustomButton = !1, c.userinfo.headImg = a;
                var b = {headImg: a, id: c.userinfo.id};
                f.saveUserInfo(b).then(function (a) {
                    a.data.success && (c.editInfo.isEditable = !1, alert("保存成功"))
                })
            }, function () {
            })
        }, c.cancel = function () {
            c.userinfo = b.copy(c.master), c.editInfo.isEditable = !1
        }, c.getUserMsg = function (a) {
            var d = a;
            f.getNewMessage(d, c.pageSize).then(function (a) {
                b.forEach(a.data.list, function (a, b) {
                    1 == a.bizType ? a.type = "系统通知" : 2 == a.bizType ? a.type = "审核通知" : 3 == a.bizType && (a.type = "活动通知")
                }), c.newMsgs = a.data.list, c.msgCount = a.data.map.count, c.msgNumPages = Math.ceil(c.msgCount / c.pageSize)
            })
        }, c.getUserMsg(c.pageNo), c.$watch("currentPage.msgCurrentPage", function (a, b) {
            a != b && (c.getUserMsg(a), c.toPage = a)
        }), c.pageChanged = function (a, b) {
            c.currentPage[b] = a
        }, c.setRead = function (c) {
            var d = [];
            b.forEach(c, function (a, b) {
                1 == a.status && this.push(a.id)
            }, d);
            var e = d.join();
            f.setRead(e).then(function (e) {
                200 == e.data.code && (a.$broadcast("minusCount", d.length), b.forEach(c, function (a, b) {
                    a.status = 2
                }))
            })
        }, c.goBaseInfo = function () {
            j.path("/usercenter/userinfo", !1), c.tabid = "userinfo"
        }, c.goXd = function () {
            j.path("/usercenter/xd", !1), c.tabid = "xd"
        }, c.quXiao = function () {
            c.$dismiss()
        }, c.goReset = function () {
            h.open({windowClass: "reset_contain", templateUrl: "usercenter/tab/reset.tpl.html", controller: "UserCenterCtrl", resolve: {username: function () {
                return c.userinfo.loginName
            }}}).result.then(function () {
            }, function () {
            })
        }, c.goMessage = function () {
            j.path("/usercenter/message", !1), c.tabid = "message"
        }, c.goAccount = function () {
            j.path("/usercenter/account", !1), c.tabid = "account"
        }, c.relAccount = function () {
            c.emailAccount = !1, h.open({windowClass: "transfer_contain", templateUrl: "usercenter/console/relAccount.tpl.html", controller: "RelAccountCtrl", resolve: {userinfo: function () {
                return{id: c.userinfo.id}
            }}}).result.then(function (a) {
                c.userinfo.noRel = null, c.userinfo.loginName = a.email, /qq/gi.test(a.type) && (c.qqRel = !0), /weixin/gi.test(a.type) && (c.wxRel = !0), /weibo/gi.test(a.type) && (c.wbRel = !0), j.search("bindemail", null)
            }, function () {
                j.search("bindemail", null)
            })
        }, c.getBranches = function (a) {
            f.getBranches(c.XdpageSize, a).then(function (a) {
                c.branches = a.data.list, c.branchesCount = a.data.map.count, c.branchesNumPages = Math.ceil(c.branchesCount / c.XdpageSize)
            }, function () {
            })
        }, c.getBranches(c.pageNo), c.$watch("currentPage.branchCurrentPage", function (a, b) {
            a != b && (c.getBranches(a), c.branchToPage = a)
        }), c.manageBranch = function (a) {
            var b = a;
            h.open({windowClass: "console branch-console", templateUrl: "usercenter/console/branch.tpl.html", controller: "BranchCtrl", resolve: {branch: function () {
                return a
            }}}).result.then(function (d) {
                a || (a = {}), d.dept && (a.deptId = d.dept.id, a.deptName = d.dept.name), a.name = d.name, a.id = d.id, b || (a.loginName = d.loginName, a.status = 1, a.regTime = (new Date).getTime(), c.branches.unshift(a), c.branches.length > 10 && c.branches.splice(c.branches.length - 1, 1)), c.$emit("addBranch", a)
            }, function () {
            })
        }, c.openBranch = function (a, b) {
            f.openBranch(a.id, b).then(function (c) {
                c.data.success && (b ? (a.status = 1, m.pushForCurrentRoute("branch.open.success", "notify.success")) : (a.status = 2, m.pushForCurrentRoute("branch.close.success", "notify.success")))
            }, function () {
                alert("服务器异常！")
            })
        }
    }]), b.module("app.directives.addelement", []).directive("addElement", ["$compile", function (a) {
        return{restrict: "EA", link: function (c, d, e) {
            var f = $("#emailAddress"), g = $("#emailAddress").size() + 1;
            d.bind("click", function () {
                var d = b.element('<div><input type="text" id="p_scnt" style="width:100%; height: 30px; margin-top: 15px;" ng-model="attrs.addElement" name="p_scnt_' + g + '" placeholder="Input Value" /></div>');
                f.append(d);
                var h = d.find("input");
                console.log(e.addElement), a(h)(c), g++
            })
        }}
    }]).directive("showIcon", ["$compile", "$timeout", function (a, b) {
        return{restrict: "EA", require: "ngModel", scope: {check: "&callbackFn"}, link: function (b, c, d, e) {
            var f, g, h = a('<a><span class = "glyphicon glyphicon-ok-circle" ng-show="enabled" style = "margin-top: 8px; color: #9ad64b; font-size: 15px;"></span></a>')(b);
            b.update = function () {
                c[0].blur(), b.check({arg1: {name: e.$name}})
            }, c.bind("focus", function () {
                f = e.$viewValue, c.parent().after(h), b.enabled = !0, ("email" === d.name || "mobile" === d.name || "tel" === d.name) && (b.enabled = !1), b.$apply()
            }).bind("blur", function () {
                b.enabled = !1, g = e.$viewValue;
                var a = new RegExp(/(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/g);
                if ("mobile" === d.name && g && !a.test(c.val()))return void alert("手机号码格式错误");
                if ("email" === d.name && g) {
                    var h = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/g);
                    if (!h.test(c.val()))return void alert("邮箱格式错误")
                }
                (g || f) && f !== g && b.update(), b.$apply()
            })
        }}
    }]).directive("ngHover", function () {
        return{restrict: "EA", link: function (a, b, c) {
            $(b).hover(function () {
                $(b.children()[0]).css("display", "block"), $(b.children()[3]).css("display", "block"), $(b.children()[4]).css("display", "block")
            }, function () {
                $(b.children()[0]).css("display", "none"), $(b.children()[3]).css("display", "none"), $(b.children()[4]).css("display", "none")
            })
        }}
    }).directive("imgClick", function () {
        return{restrict: "EA", link: function (a, b, c) {
            $(b).bind("click", function () {
                $(b).find("img").css("border", "4px solid #F60"), $(b).siblings().find("img").css("border", 0)
            })
        }}
    }).directive("customFocus", function () {
        return{restrict: "EA", link: function (a, b, c) {
            $(b).siblings().bind("click", function () {
                b[0].focus()
            })
        }}
    }).directive("blurChildren", function () {
        return{restrict: "EA", link: function (a, b, c) {
            $(b).on("click", function (a) {
                (a.target == b[0] || $(a.target).hasClass("badge")) && $(".blurClass").find("input:visible").blur()
            })
        }}
    }).directive("forbiddenClose", function () {
        return{restrict: "EAC", link: function (a, b, c) {
            $(b).on("click", function (a) {
                a.stopPropagation()
            })
        }}
    }).directive("customeImage", function () {
        return{restrict: "EA", link: function (a, b, c) {
            $(b).hover(function () {
                $("<div><a></a></div>")
            }, function () {
            })
        }}
    }).directive("slides", ["configService", function (a) {
        return{restrict: "EA", link: function (b, c, d) {
            var e = $(c).find(".slides_container");
            a.getBanners().then(function (a) {
                for (var b = a.data.split(","), d = 0; d < b.length; d++)e.append('<img src="' + b[d] + '" width="1000px" height="720px" alt="Slide 1">');
                $(c).slides({preload: !0, play: 5e3, pause: 2500, hoverPause: !0})
            }, function () {
                e.append('<img src="' + CLIENT_CDN + 'assets/images/slide_03.png" width="1000px" height="720px" alt="Slide 1">'), e.append('<img src="' + CLIENT_CDN + 'assets/images/slide2_03.png" width="1000px" height="720px" alt="Slide 1">'), e.append('<img src="' + CLIENT_CDN + 'assets/images/slide3_03.png" width="1000px" height="720px" alt="Slide 1">'), $(c).slides({preload: !0, play: 5e3, pause: 2500, hoverPause: !0})
            })
        }}
    }]).directive("addClass", function () {
        return{restrict: "EA", link: function (a, b, c) {
            $(b).closest(".textbox-wrap").find("[autofocus]").focus(), $(b).on("blur", function () {
                $(b).closest(".textbox-wrap").removeClass("focused")
            }).on("focus", function () {
                $(b).closest(".textbox-wrap").addClass("focused")
            })
        }}
    }).directive("loadScript", ["$http", "$timeout", "$rootScope", function (a, c, d) {
        return{link: function (c, d, e) {
            var f = function () {
                c.captchaLoaded = !0
            };
            c.$watch(function () {
                return d[0].getAttribute("src")
            }, function (b, c) {
                b && a.jsonp(d[0].getAttribute("src")).success(f).error(f)
            }), c.$on("$destroy", function () {
                b.element(".gt_widget").remove()
            })
        }}
    }]), b.module("colorpicker.module", []).factory("Helper", function () {
        return{closestSlider: function (a) {
            var b = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.msMatchesSelector;
            return b.bind(a)("I") ? a.parentNode : a
        }, getOffset: function (a, b) {
            for (var c = 0, d = 0, e = 0, f = 0; a && !isNaN(a.offsetLeft) && !isNaN(a.offsetTop);)c += a.offsetLeft, d += a.offsetTop, b || "BODY" !== a.tagName ? (e += a.scrollLeft, f += a.scrollTop) : (e += document.documentElement.scrollLeft || a.scrollLeft, f += document.documentElement.scrollTop || a.scrollTop), a = a.offsetParent;
            return{top: d, left: c, scrollX: e, scrollY: f}
        }, stringParsers: [
            {re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/, parse: function (a) {
                return[a[1], a[2], a[3], a[4]]
            }},
            {re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/, parse: function (a) {
                return[2.55 * a[1], 2.55 * a[2], 2.55 * a[3], a[4]]
            }},
            {re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/, parse: function (a) {
                return[parseInt(a[1], 16), parseInt(a[2], 16), parseInt(a[3], 16)]
            }},
            {re: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/, parse: function (a) {
                return[parseInt(a[1] + a[1], 16), parseInt(a[2] + a[2], 16), parseInt(a[3] + a[3], 16)]
            }}
        ]}
    }).factory("Color", ["Helper", function (a) {
        return{value: {h: 1, s: 1, b: 1, a: 1}, rgb: function () {
            var a = this.toRGB();
            return"rgb(" + a.r + "," + a.g + "," + a.b + ")"
        }, rgba: function () {
            var a = this.toRGB();
            return"rgba(" + a.r + "," + a.g + "," + a.b + "," + a.a + ")"
        }, hex: function () {
            return this.toHex()
        }, RGBtoHSB: function (a, b, c, d) {
            a /= 255, b /= 255, c /= 255;
            var e, f, g, h;
            return g = Math.max(a, b, c), h = g - Math.min(a, b, c), e = 0 === h ? null : g === a ? (b - c) / h : g === b ? (c - a) / h + 2 : (a - b) / h + 4, e = (e + 360) % 6 * 60 / 360, f = 0 === h ? 0 : h / g, {h: e || 1, s: f, b: g, a: d || 1}
        }, setColor: function (b) {
            b = b.toLowerCase();
            for (var c in a.stringParsers)if (a.stringParsers.hasOwnProperty(c)) {
                var d = a.stringParsers[c], e = d.re.exec(b), f = e && d.parse(e);
                if (f)return this.value = this.RGBtoHSB.apply(null, f), !1
            }
        }, setHue: function (a) {
            this.value.h = 1 - a
        }, setSaturation: function (a) {
            this.value.s = a
        }, setLightness: function (a) {
            this.value.b = 1 - a
        }, setAlpha: function (a) {
            this.value.a = parseInt(100 * (1 - a), 10) / 100
        }, toRGB: function (a, b, c, d) {
            a || (a = this.value.h,
                b = this.value.s, c = this.value.b), a *= 360;
            var e, f, g, h, i;
            return a = a % 360 / 60, i = c * b, h = i * (1 - Math.abs(a % 2 - 1)), e = f = g = c - i, a = ~~a, e += [i, h, 0, 0, h, i][a], f += [h, i, i, h, 0, 0][a], g += [0, 0, h, i, i, h][a], {r: Math.round(255 * e), g: Math.round(255 * f), b: Math.round(255 * g), a: d || this.value.a}
        }, toHex: function (a, b, c, d) {
            var e = this.toRGB(a, b, c, d);
            return"#" + (1 << 24 | parseInt(e.r, 10) << 16 | parseInt(e.g, 10) << 8 | parseInt(e.b, 10)).toString(16).substr(1)
        }}
    }]).factory("Slider", ["Helper", function (b) {
        var c = {maxLeft: 0, maxTop: 0, callLeft: null, callTop: null, knob: {top: 0, left: 0}}, d = {};
        return{getSlider: function () {
            return c
        }, getLeftPosition: function (a) {
            return Math.max(0, Math.min(c.maxLeft, c.left + ((a.pageX || d.left) - d.left)))
        }, getTopPosition: function (a) {
            return Math.max(0, Math.min(c.maxTop, c.top + ((a.pageY || d.top) - d.top)))
        }, setSlider: function (e, f) {
            var g = b.closestSlider(e.target), h = b.getOffset(g, f);
            c.knob = g.children[0].style, c.left = e.pageX - h.left - a.pageXOffset + h.scrollX, c.top = e.pageY - h.top - a.pageYOffset + h.scrollY, d = {left: e.pageX, top: e.pageY}
        }, setSaturation: function (a, b) {
            c = {maxLeft: 100, maxTop: 100, callLeft: "setSaturation", callTop: "setLightness"}, this.setSlider(a, b)
        }, setHue: function (a, b) {
            c = {maxLeft: 0, maxTop: 100, callLeft: !1, callTop: "setHue"}, this.setSlider(a, b)
        }, setAlpha: function (a, b) {
            c = {maxLeft: 0, maxTop: 100, callLeft: !1, callTop: "setAlpha"}, this.setSlider(a, b)
        }, setKnob: function (a, b) {
            c.knob.top = a + "px", c.knob.left = b + "px"
        }}
    }]).directive("colorpicker", ["$document", "$compile", "Color", "Slider", "Helper", function (a, c, d, e, f) {
        return{require: "?ngModel", restrict: "A", link: function (g, h, i, j) {
            var k, l = i.colorpicker ? i.colorpicker : "hex", m = b.isDefined(i.colorpickerPosition) ? i.colorpickerPosition : "bottom", n = b.isDefined(i.colorpickerInline) ? i.colorpickerInline : !1, o = b.isDefined(i.colorpickerFixedPosition) ? i.colorpickerFixedPosition : !1, p = b.isDefined(i.colorpickerParent) ? h.parent() : b.element(document.body), q = b.isDefined(i.colorpickerWithInput) ? i.colorpickerWithInput : !1, r = q ? '<input type="text" name="colorpicker-input">' : "", s = n ? "" : '<button type="button" class="close close-colorpicker">&times;</button>', t = '<div class="colorpicker dropdown"><div class="dropdown-menu"><colorpicker-saturation><i></i></colorpicker-saturation><colorpicker-hue><i></i></colorpicker-hue><colorpicker-alpha><i></i></colorpicker-alpha><colorpicker-preview></colorpicker-preview>' + r + s + "</div></div>", u = b.element(t), v = d, w = u.find("colorpicker-hue"), x = u.find("colorpicker-saturation"), y = u.find("colorpicker-preview"), z = u.find("i");
            if (c(u)(g), q) {
                var A = u.find("input");
                A.on("mousedown", function (a) {
                    a.stopPropagation()
                }).on("keyup", function (a) {
                    var b = this.value;
                    h.val(b), j && g.$apply(j.$setViewValue(b)), a.stopPropagation(), a.preventDefault()
                }), h.on("keyup", function () {
                    A.val(h.val())
                })
            }
            var B = function () {
                a.on("mousemove", D), a.on("mouseup", E)
            };
            "rgba" === l && (u.addClass("alpha"), k = u.find("colorpicker-alpha"), k.on("click", function (a) {
                e.setAlpha(a, o), D(a)
            }).on("mousedown", function (a) {
                e.setAlpha(a, o), B()
            })), w.on("click", function (a) {
                e.setHue(a, o), D(a)
            }).on("mousedown", function (a) {
                e.setHue(a, o), B()
            }), x.on("click", function (a) {
                e.setSaturation(a, o), D(a)
            }).on("mousedown", function (a) {
                e.setSaturation(a, o), B()
            }), o && u.addClass("colorpicker-fixed-position"), u.addClass("colorpicker-position-" + m), "true" === n && u.addClass("colorpicker-inline"), p.append(u), j && (j.$render = function () {
                h.val(j.$viewValue)
            }, g.$watch(i.ngModel, function () {
                F()
            })), h.on("$destroy", function () {
                u.remove()
            });
            var C = function () {
                try {
                    y.css("backgroundColor", v[l]())
                } catch (a) {
                    y.css("backgroundColor", v.toHex())
                }
                x.css("backgroundColor", v.toHex(v.value.h, 1, 1, 1)), "rgba" === l && (k.css.backgroundColor = v.toHex())
            }, D = function (a) {
                var b = e.getLeftPosition(a), c = e.getTopPosition(a), d = e.getSlider();
                e.setKnob(c, b), d.callLeft && v[d.callLeft].call(v, b / 100), d.callTop && v[d.callTop].call(v, c / 100), C();
                var f = v[l]();
                return h.val(f), j && g.$apply(j.$setViewValue(f)), q && A.val(f), !1
            }, E = function () {
                a.off("mousemove", D), a.off("mouseup", E)
            }, F = function () {
                v.setColor(h.val()), z.eq(0).css({left: 100 * v.value.s + "px", top: 100 - 100 * v.value.b + "px"}), z.eq(1).css("top", 100 * (1 - v.value.h) + "px"), z.eq(2).css("top", 100 * (1 - v.value.a) + "px"), C()
            }, G = function () {
                var a, c = f.getOffset(h[0]);
                return b.isDefined(i.colorpickerParent) && (c.left = 0, c.top = 0), "top" === m ? a = {top: c.top - 147, left: c.left} : "right" === m ? a = {top: c.top, left: c.left + 126} : "bottom" === m ? a = {top: c.top + h[0].offsetHeight + 2, left: c.left} : "left" === m && (a = {top: c.top, left: c.left - 150}), {top: a.top + "px", left: a.left + "px"}
            }, H = function () {
                J()
            };
            n === !1 ? h.on("click", function () {
                F(), u.addClass("colorpicker-visible").css(G()), a.on("mousedown", H)
            }) : (F(), u.addClass("colorpicker-visible").css(G())), u.on("mousedown", function (a) {
                a.stopPropagation(), a.preventDefault()
            });
            var I = function (a) {
                j && g.$emit(a, {name: i.ngModel, value: j.$modelValue})
            }, J = function () {
                u.hasClass("colorpicker-visible") && (u.removeClass("colorpicker-visible"), I("colorpicker-closed"), a.off("mousedown", H))
            };
            u.find("button").on("click", function () {
                J()
            })
        }}
    }]), b.module("app.directives.rightclick", []).directive("rightClick", ["$compile", function (a) {
        return{restrict: "EA", link: function (b, c, d) {
            var e;
            $(c).on("contextmenu", function (d) {
                if (d.preventDefault(), e && e[0] && e.remove(), "0" == b.categoryId) {
                    e = $('<ul class="right-menu dropdown-menu"></ul>'), e.appendTo($(c)), e.css({left: d.pageX - $(c).offset().left, top: d.pageY - $(c).offset().top}).show();
                    for (var f in b.myTags) {
                        var g = '<li class="tag_list" ng-class="{selected: dropTagIndex == ' + f + '}" ng-click="selectTag(' + b.myTags[f].id + "," + f + ')">' + b.myTags[f].name + "</li>", h = a(g)(b);
                        e.append(h)
                    }
                    var i = a('<li class="tag_list add_cate clearfix" style="border-top:1px solid #ccc;margin-bottom:0px;" ng-click="createCategory()"><em>+</em><span>创建分类</span></li>')(b);
                    e.append(i);
                    var j = a('<li class="btn-main" style="width:100%; padding:0px; border: 0;margin:0px;height:25px; line-height:25px;"><a style="height:25px;line-height:25px;text-indent:0;color:#FFF;padding:0px;text-align:center;" ng-click="setCategory(' + b.dropTagIndex + "," + b.img.id + ')">确定</a></li>')(b);
                    e.append(j), $(j).on("click", function () {
                        e.hide()
                    }), $(document).mousemove(function (a) {
                        (a.pageX < e.offset().left - 20 || a.pageX > e.offset().left + e.width() + 20 || a.pageY < e.offset().top - 20 || a.pageY > e.offset().top + e.height() + 20) && (e.hide(), $(this).unbind("mousemove"))
                    })
                }
            })
        }}
    }]), b.module("app.directives.customer", []).directive("forbiddenListClose", function () {
        return{restrict: "A", link: function (a, b, c) {
            $(b).click(function (a) {
                return!1
            })
        }}
    }), b.module("app.directives.dataDraggable", []).directive("itemDraggable", function () {
        return{restrict: "A", link: function (a, b, c) {
            $(b).draggable({zIndex: 2700, scroll: !1, iframeFix: !1, revert: !1, helper: "clone"})
        }}
    }).directive("itemDroppable", function () {
        return{restrict: "A", link: function (a, b, c) {
            $(b).droppable({hoverClass: "active", out: function (a, b) {
            }, drop: function (b, c) {
                a.$parent.associateData[$(b.target).attr("item-id")] = c.draggable.attr("item-id");
                var d = $(b.target).find(".list_darggable");
                d.length > 0 && (delete a.$parent.associateData[$(b.target).attr("item-id")], $(".item_remove_droppable").append(d)), c.draggable.css({left: 0, top: 0}).prependTo(this)
            }})
        }}
    }).directive("itemRemoveDroppable", function () {
        return{restrict: "A", link: function (a, b, c) {
            $(b).droppable({hoverClass: "active", drop: function (b, c) {
                $(c.draggable).parents(".list_attribute").length > 0 && delete a.$parent.associateData[$(c.draggable).parents(".list_attribute").attr("item-id")], c.draggable.css({left: 0, top: 0}).appendTo(this)
            }})
        }}
    }), b.module("app.directives.keymap", ["services.scene", "services.history", "services.select"]).directive("eqxKeymap", ["sceneService", "historyService", "selectService", function (a, b, c) {
        return{restrict: "A", link: function (b) {
            var c = $(document);
            b.$on("$destroy", function () {
                c.unbind("keydown")
            }), c.unbind("keydown").keydown(function (c) {
                if ((c.ctrlKey || c.metaKey) && 90 == c.keyCode && a.historyBack(), (c.ctrlKey || c.metaKey) && 89 == c.keyCode && a.historyForward(), (c.ctrlKey || c.metaKey) && 86 == c.keyCode) {
                    if ($("#btn-toolbar")[0] || $(".modal-dialog")[0])return;
                    a.getCopy() && a.pasteElement()
                }
                if ((c.ctrlKey || c.metaKey) && 67 == c.keyCode) {
                    if ($("#btn-toolbar")[0] || $(".modal-dialog")[0])return;
                    a.copyElement()
                }
                b.$apply()
            })
        }}
    }]), b.module("app.directives.limitInput", []).directive("limitInput", function () {
        return{require: "ngModel", link: function (a, b, c, d) {
            "transform" == c.cssItem && a.$on("updateTransform", function (a, b) {
                d.$setViewValue(parseInt(b, 10)), d.$render()
            }), "borderRadius" == c.cssItem && a.$on("updateMaxRadius", function (b, c) {
                a.maxRadius = parseInt(Math.min($(c).outerWidth(), $(c).outerHeight()) / 2 + 10, 10), a.maxRadius < a.model.borderRadius && (d.$setViewValue(a.maxRadius), d.$render()), a.$apply()
            }), a.$watch(function () {
                return $(b).val()
            }, function (a) {
                +a > c.max && (d.$setViewValue(c.max), d.$render()), +a < c.min && (d.$setViewValue(c.min), d.$render())
            })
        }}
    }),b.module("app.directives.lineChart", []).directive("lineChart", ["$compile", function (a) {
        return{restrict: "EA", link: function (a, b, c) {
            var d, e;
            a.$watch(function () {
                return c.data
            }, function () {
                c.data && (d = JSON.parse(c.data)), e ? (e.destroy(), e = new Chart(b[0].getContext("2d")).Line(d)) : e = new Chart(b[0].getContext("2d")).Line(d)
            })
        }}
    }]),b.module("app.directives.loading", []).directive("loginLoading", function () {
        return{restrict: "EA", link: function (a, b, c) {
            a.$on("loginLoading", function (a, c) {
                var d = $('<div class="homeMask" style="position: absolute;width: 100%;top:0;bottom:0;background-color:#ccc;opacity:0.8;">正在跳转，请稍后...</div>');
                d.appendTo($(b))
            })
        }}
    }),b.module("app.directives.comp.editor", []).directive("mapEditor", function () {
        return{restrict: "AE", templateUrl: "directives/mapeditor.tpl.html", link: function (a, b, c) {
            var d = new BMap.Map("l-map");
            d.centerAndZoom(new BMap.Point(116.404, 39.915), 15);
            var e = {onSearchComplete: function (a) {
                if (f.getStatus() == BMAP_STATUS_SUCCESS) {
                    for (var b = [], c = 0; c < a.getCurrentNumPois(); c++)b.push(a.getPoi(c).title + ", " + a.getPoi(c).address);
                    document.getElementById("r-result").innerHTML = b.join("<br/>")
                }
            }}, f = new BMap.LocalSearch(d, e);
            a.searchAddress = function () {
                f.search(a.address)
            }
        }}
    }),b.module("app.directives.notification", []).directive("notificationFadeout", ["i18nNotifications", function (a) {
        return{restrict: "EA", link: function (b, c, d) {
            var e = $(c);
            e.fadeOut(4e3, function () {
                a.remove(b.notification)
            })
        }}
    }]),b.module("app.directives.pageTplTypes", []).directive("pageTplTypes", ["pageTplService", function (a) {
        return{restrict: "EA", replace: !0, templateUrl: "directives/page-tpl-types.tpl.html", link: function (b, c, d) {
            a.getPageTplTypes().then(function (a) {
                b.pageTplTypes = a.data.list && a.data.list.length > 0 ? a.data.list : []
            })
        }}
    }]),b.module("app.directives.pieChart", []).directive("pieChart", ["$compile", function (a) {
        return{restrict: "EA", link: function (a, b, c) {
            var d, e;
            a.$watch(function () {
                return c.data
            }, function () {
                c.data && (e = JSON.parse(c.data)), d ? (d.destroy(), d = new Chart(b[0].getContext("2d")).Pie(e)) : d = new Chart(b[0].getContext("2d")).Pie(e)
            })
        }}
    }]),b.module("app.directives.qrcode", []).directive("qrCode", function () {
        return{restrict: "A", link: function (a, b, c) {
            a.$watch(function () {
                return c.qrUrl
            }, function () {
                $("canvas", b).length > 0 && $("canvas", b).remove(), c.qrUrl && $(b).qrcode({render: "canvas", width: 200, height: 200, text: c.qrUrl + (/\?/.test(c.qrUrl) ? "&" : "?") + "eqrcode=1"})
            })
        }}
    }),b.module("app.directives.register", []).directive("qqButton", function () {
        return{restrict: "EA", scope: {someCtrlFn: "&callbackFn", openid: "=", accesstoken: "="}, link: function (a, b, c) {
            QC.Login({btnId: c.id, scope: "all"}, function (b, c) {
                var d = b;
                QC.Login.check() && QC.Login.getMe(function (b, c) {
                    a.openid = b, a.accesstoken = c, a.someCtrlFn({arg1: {openId: b, accessToken: c, type: "qq", userInfo: d}})
                })
            }, function (a) {
                alert("QQ登录 注销成功")
            }), $("#qqLoginBtn a").removeAttr("onclick").click(function () {
                alert("第三方注册功能即将开放")
            })
        }}
    }).directive("wbButton", function () {
        return{restrict: "EA", link: function (a, b, c) {
            WB2.anyWhere(function (a) {
                a.widget.connectButton({id: "wb_connect_btn", type: "3,2", callback: {login: function (a) {
                }, logout: function () {
                }}})
            }), $("#wb_connect_btn").removeAttr("onclick").click(function (a) {
                return a.stopPropagation(), a.preventDefault(), alert("新浪微博注册功能即将开放"), !1
            })
        }}
    }),b.module("app.directives.responsiveImage", []).directive("responsiveImage", ["$compile", function (a) {
        return{restrict: "EA", link: function (a, b, c) {
            "0" != a.fileType && $(b).bind("load", function () {
                $(this).removeAttr("style");
                var a = $(this).parent().width(), b = $(this).parent().height();
                this.width > this.height ? (this.style.width = a + "px", this.style.height = this.height * a / this.width + "px", this.style.top = "50%", this.style.marginTop = "-" + this.height / 2 + "px") : (this.style.height = b + "px", this.style.width = this.width * b / this.height + "px", this.style.left = "50%", this.style.marginLeft = "-" + this.width / 2 + "px")
            })
        }}
    }]),b.module("app.directives.numChangeAnim", []).directive("numChangeAnim", ["$filter", function (a) {
        return{restrict: "A", scope: {content: "@"}, link: function (b, c, d) {
            function e(a, b) {
                return Math.floor(a + Math.random() * (b - a))
            }

            function f(a, b) {
                a = a > 0 ? a : 1;
                for (var c = Math.floor(Math.log10(a)), d = Math.floor(a / Math.pow(10, c)), f = 0, g = 10, h = function (h) {
                    setTimeout(function () {
                        if (10 > g)f = h; else {
                            var i = c > h ? h : c, j = Math.pow(10, i) * d;
                            j = j.toString().length == a.toString().length ? a : j, f = e(f, j)
                        }
                        b(f, 9 == h)
                    }, (h * h + h + 2) / 2 * 30)
                }, i = 0; g > i; i++)h(i)
            }

            function g(b, c) {
                $(b).children("span").text(a("number")(c))
            }

            b.$watch("content", function (a) {
                if (a) {
                    var b = parseInt(a, 10);
                    f(b, function (a, d) {
                        g(c, a), d && (g(c, b), $(c).addClass("heartbeat").css({"animation-duration": "1s"}))
                    })
                }
            })
        }}
    }]),b.module("app.directives.style", []).directive("panelDraggable", function () {
        return{restrict: "A", link: function (a, b, c) {
            a.$on("$destroy", function () {
                $(b).draggable(), $(b).draggable("destroy"), b = null
            }), b.on("$destroy", function () {
                $(b).draggable(), $(b).draggable("destroy"), b = null
            }), $(b).draggable()
        }}
    }),b.module("app.directives.component", ["services.scene", "services.select"]).directive("compDraggable", function () {
        return{restrict: "A", link: function (a, b, c) {
            a.$on("$destroy", function () {
                $(b).draggable(), $(b).draggable("destroy"), b = null
            }), b.on("$destroy", function () {
                $(b).draggable(), $(b).draggable("destroy"), b = null
            }), $(b).draggable({revert: !1, stack: ".comp-draggable", helper: "panel" == c.compDraggable || "page" == c.compDraggable ? "clone" : "", appendTo: "parent", containment: "panel" == c.compDraggable || "page" == c.compDraggable ? "" : "parent", zIndex: 1049, opacity: .35, stop: function (a, b) {
                $(a.toElement).one("click", function (a) {
                    a.stopImmediatePropagation()
                })
            }})
        }}
    }).directive("compDroppable", function () {
        return{restrict: "A", link: function (a, b, c) {
            a.$on("$destroy", function () {
                $(b).droppable(), $(b).droppable("destroy"), b = null
            }), b.on("$destroy", function () {
                $(b).droppable(), $(b).droppable("destroy"), b = null
            }), $(b).droppable({accept: ".comp-draggable", hoverClass: "drop-hover", drop: function (b, c) {
                if (3 != c.draggable.attr("ctype")) {
                    var d = {left: c.offset.left - $(this).offset().left + "px", top: c.offset.top - $(this).offset().top + "px"};
                    "panel" == c.draggable.attr("comp-draggable") ? a.createComp(c.draggable.attr("ctype"), d) : a.updateCompPosition(c.draggable.attr("id"), d)
                } else a.createComp(3)
            }})
        }}
    }).directive("compSortable", function () {
        return{restrict: "A", link: function (a, b, c) {
            $(b).sortable({axis: "y", update: function (a, b) {
            }})
        }}
    }).directive("compResizable", function () {
        return{restrict: "A", link: function (a, b, c) {
            $(b).resizable({autoHide: !1, containment: "parent", stop: function (b, c) {
                if ("4" == $(c.element).attr("ctype").charAt(0)) {
                    var d = {width: c.size.width, height: c.size.height, imgStyle: {width: c.element.find("img").width(), height: c.element.find("img").height(), marginTop: c.element.find("img").css("marginTop"), marginLeft: c.element.find("img").css("marginLeft")}};
                    a.updateCompSize(c.element.attr("id"), d)
                } else a.updateCompSize(c.element.attr("id"), c.size);
                $(b.toElement).one("click", function (a) {
                    a.stopImmediatePropagation()
                })
            }, resize: function (a, c) {
                var d = $(b).find("img").width() / $(b).find("img").height();
                if ("4" == $(c.element).attr("ctype").charAt(0)) {
                    var e = c.size.width / c.size.height, f = c.element.find("img");
                    d >= e ? (f.outerHeight(c.size.height), f.outerWidth(c.size.height * d), f.css("marginLeft", -(f.outerWidth() - c.size.width) / 2), f.css("marginTop", 0)) : (f.outerWidth(c.size.width), f.outerHeight(c.size.width / d), f.css("marginTop", -(f.outerHeight() - c.size.height) / 2), f.css("marginLeft", 0))
                } else c.element.find(".element").outerWidth(c.size.width), c.element.find(".element").outerHeight(c.size.height)
            }})
        }}
    }).directive("photoDraggable", function () {
        return{restrict: "A", link: function (a, b, c) {
            a.$on("$destroy", function () {
                $(b).draggable(), $(b).draggable("destroy"), b = null
            }), b.on("$destroy", function () {
                $(b).draggable(), $(b).draggable("destroy"), b = null
            }), $(b).draggable({revert: !1, helper: "clone", appendTo: ".img_list", zIndex: 1049, opacity: .35, stop: function (a, b) {
                $(a.toElement).one("click", function (a) {
                    a.stopImmediatePropagation()
                })
            }})
        }}
    }).directive("cropDroppable", function () {
        return{restrict: "A", link: function (a, b, c) {
            a.$on("$destroy", function () {
                $(b).droppable(), $(b).droppable("destroy"), b = null
            }), b.on("$destroy", function () {
                $(b).droppable(), $(b).droppable("destroy"), b = null
            }), $(b).droppable({accept: "li", hoverClass: "drop-hover", drop: function (b, c) {
                a.preSelectImage(c.draggable.attr("photo-draggable"))
            }})
        }}
    }).directive("compRotate", function () {
        return{restrict: "A", link: function (a, b, c) {
            var d = $(b), e = $('<div class="bar bar-rotate bar-radius">');
            d.append(e).append('<div class="bar bar-line">');
            var f, g = {}, h = new Hammer(e.get(0));
            h.get("pan").set({threshold: 0}), h.on("panstart", function (a) {
                d.addClass("no-drag"), $("body").css({"user-select": "none", cursor: 'url("/assets/images/mouserotate.ico"), default'});
                var b = d.parent();
                g = {x: parseFloat(d.css("left")) + b.offset().left + d.width() / 2, y: parseFloat(d.css("top")) + b.offset().top + d.height() / 2}
            }), h.on("panmove", function (a) {
                var b = a.center, c = b.x - g.x, e = b.y - g.y, h = Math.abs(c / e);
                f = Math.atan(h) / (2 * Math.PI) * 360, c > 0 && 0 > e ? f = 360 + f : c > 0 && e > 0 ? f = 180 - f : 0 > c && e > 0 ? f = 180 + f : 0 > c && 0 > e && (f = 360 - f), f > 360 && (f -= 360), d.css({transform: "rotateZ(" + f + "deg)"})
            }), h.on("panend", function (b) {
                $("body").css({"user-select": "initial", cursor: "default"}), a.updateCompAngle(d.attr("id"), f), a.$broadcast("updateTransform", f)
            })
        }}
    }).directive("compDrag", function () {
        return{restrict: "A", link: function (a, b, c) {
            var d, e = 0, f = 0, g = {}, h = {}, i = {}, j = {}, k = $(b), l = k.parent(), m = {width: l.width(), height: l.height()}, n = new Hammer(k.get(0));
            n.get("pan").set({threshold: 0}), n.on("panstart", function (a) {
                if (a.preventDefault(), a.srcEvent.preventDefault(), !k.hasClass("no-drag")) {
                    k.css("opacity", .35), $("body").css({"user-select": "none", cursor: "default"}), d = l.offset();
                    var b = {width: k.width(), height: k.height()};
                    e = k.get(0).style.transform || k.get(0).style.webkitTransform || 0, e = e && e.replace("rotateZ(", "").replace("deg)", ""), e = e && parseFloat(e), e >= 90 && 180 > e && (e = 180 - e), e >= 180 && 270 > e && (e = 270 - e), e >= 270 && 360 > e && (e = 360 - e), f = 2 * e * Math.PI / 360;
                    var c = 0 === f ? b.height : (b.width / 2 + b.height / 2 / Math.tan(f)) * Math.sin(f) * 2, n = 0 === f ? b.width : (b.width / 2 + b.height / 2 / Math.tan(Math.PI / 2 - f)) * Math.sin(Math.PI / 2 - f) * 2;
                    j = {height: c, width: n}, i = k.offset();
                    var o = k.position();
                    h = a.center, h.top = h.y - o.top, h.bottom = h.y + m.height - (o.top + j.height), h.left = h.x - o.left, h.right = h.x + m.width - (o.left + j.width), g.x = a.center.x - (parseFloat(k.css("left")) + d.left), g.y = a.center.y - (parseFloat(k.css("top")) + d.top)
                }
            }), n.on("panmove", function (a) {
                a.preventDefault(), "img" == a.target.tagName.toLowerCase() && (a.target.ondragstart = function () {
                    return!1
                }), k.hasClass("no-drag") || (a.center.y >= h.top && a.center.y <= h.bottom && k.css("top", a.center.y - d.top - g.y), a.center.x >= h.left && a.center.x <= h.right && k.css("left", a.center.x - d.left - g.x))
            }), n.on("panend", function (b) {
                if (k.hasClass("no-drag"))return void k.removeClass("no-drag");
                k.css("opacity", 1), $("body").css({"user-select": "initial", cursor: "default"});
                var c = (k.position(), {top: k.css("top"), left: k.css("left")});
                a.updateCompPosition(k.attr("id"), c), $(b.srcEvent.target).one("click", function (a) {
                    return a.stopImmediatePropagation(), a.stopPropagation(), a.preventDefault(), !1
                })
            })
        }}
    }).directive("compResize", ["selectService", function (a) {
        function b(a, b, c, d) {
            var e = {}, f = a / b, g = c / d;
            return f > g ? (e.width = c, e.height = c / f) : (e.height = d, e.width = d * f), e
        }

        function c(a) {
            var c = a.children(".element-box"), d = {width: c.width(), height: c.height()};
            if ("4" == a.attr("ctype").charAt(0)) {
                var e = a.find("img"), f = e.width() / e.height(), g = d.width / d.height;
                f >= g ? (e.outerHeight(d.height), e.outerWidth(d.height * f), e.css("marginLeft", -(e.outerWidth() - d.width) / 2), e.css("marginTop", 0)) : (e.outerWidth(d.width), e.outerHeight(d.width / f), e.css("marginTop", -(e.outerHeight() - d.height) / 2), e.css("marginLeft", 0))
            } else if ("p" == a.attr("ctype").charAt(0)) {
                var h = a.find("li"), i = a.find("img");
                i.each(function (a) {
                    var c = $(this), e = b(c.width(), c.height(), d.width, d.height);
                    c.css({width: e.width, height: e.height}), h.eq(a).css({lineHeight: d.height + "px"})
                })
            } else a.find(".element").css({width: d.width, height: d.height})
        }

        function d(a, b) {
            var c = b.position(), d = {width: b.width(), height: b.height(), left: c.left, top: c.top};
            if ("4" == b.attr("ctype").charAt(0)) {
                var e = b.find("img"), f = {width: d.width, height: d.height, left: d.left, top: d.top, imgStyle: {width: e.width(), height: e.height(), marginTop: e.css("marginTop"), marginLeft: e.css("marginLeft")}};
                a.updateCompSize(b.attr("id"), f)
            } else if ("p" == b.attr("ctype").charAt(0)) {
                var g = b.find(".slide"), h = g.find(".dot"), i = g.attr("id"), j = g.attr("length");
                INTERVAL_OBJ[i] && (clearInterval(INTERVAL_OBJ[i]), delete INTERVAL_OBJ[i]), g.swipeSlide({autoSwipe: "true" == g.attr("autoscroll"), continuousScroll: !0, speed: g.attr("interval"), transitionType: "cubic-bezier(0.22, 0.69, 0.72, 0.88)", lazyLoad: !0, clone: !1, length: j}, function (a, b) {
                    --a < 0 && (a = j - 1), h.children().eq(a).addClass("cur").siblings().removeClass("cur"), b && (INTERVAL_OBJ[i] = b)
                }), a.updateCompSize(b.attr("id"), d)
            } else a.updateCompSize(b.attr("id"), d)
        }

        function e(a, b, e, g) {
            var h, i, j, k, l, m, n, o, p, q, r, s, t, u = $(b), v = u.closest("ul"), w = parseFloat(u.css("min-width") || 50), x = parseFloat(u.css("min-height") || 30), y = new Hammer($(e).get(0));
            y.get("pan").set({threshold: 0, direction: Hammer.DIRECTION_ALL}), y.on("panstart", function () {
                u.addClass("no-drag"), h = u.width(), i = u.height(), r = h / i, j = parseFloat(u.css("left")), k = parseFloat(u.css("top")), l = j + h, m = k + i, n = 320 - j, o = 486 - k, v.css("cursor", g), $("body").css({"user-select": "none", cursor: "default"}), s = u.get(0).style.transform, s = s && s.replace("rotateZ(", "").replace("deg)", ""), s = s && parseFloat(s), t = 2 * s * Math.PI / 360
            }), y.on("panmove", function (a) {
                switch (g) {
                    case f.RESIZE_W:
                        if (h - a.deltaX <= w)break;
                        if (h - a.deltaX >= l) {
                            u.css({left: 0, width: l});
                            break
                        }
                        u.css({left: j + a.deltaX, width: h - a.deltaX});
                        break;
                    case f.RESIZE_E:
                        if (h + a.deltaX >= n) {
                            u.css("width", n);
                            break
                        }
                        u.css("width", h + a.deltaX);
                        break;
                    case f.RESIZE_N:
                        if (i - a.deltaY <= x)break;
                        if (i - a.deltaY >= m) {
                            u.css({top: 0, height: m});
                            break
                        }
                        u.css({top: k + a.deltaY, height: i - a.deltaY});
                        break;
                    case f.RESIZE_S:
                        if (i + a.deltaY >= o) {
                            u.css("height", o);
                            break
                        }
                        u.css("height", i + a.deltaY);
                        break;
                    case f.RESIZE_SE:
                        if (p = i + a.deltaY, q = p * r, w >= q || x >= p || q >= n || p >= o)break;
                        u.css({height: p, width: q});
                        break;
                    case f.RESIZE_SW:
                        if (p = i + a.deltaY, q = p * r, w >= q || x >= p || q >= l || p >= o)break;
                        u.css({left: l - q, height: p, width: q});
                        break;
                    case f.RESIZE_NE:
                        if (p = i - a.deltaY, q = p * r, w >= q || x >= p || q >= n || p >= m)break;
                        u.css({top: m - p, height: p, width: q});
                        break;
                    case f.RESIZE_NW:
                        if (p = i - a.deltaY, q = p * r, w >= q || x >= p || q >= l || p >= m)break;
                        u.css({top: m - p, left: l - q, height: p, width: q})
                }
                c(u)
            }), y.on("panend", function () {
                v.css("cursor", "default"), $("body").css({"user-select": "initial", cursor: "default"}), d(a, u), a.$broadcast("updateMaxRadius", u)
            })
        }

        var f = {RESIZE_W: "w-resize", RESIZE_E: "e-resize", RESIZE_N: "n-resize", RESIZE_S: "s-resize", RESIZE_SE: "se-resize", RESIZE_SW: "sw-resize", RESIZE_NE: "ne-resize", RESIZE_NW: "nw-resize"};
        return{restrict: "A", link: function (b, c) {
            var d = c, g = $('<div class="bar bar-n"><div class="bar-radius"></div></div>'), h = $('<div class="bar bar-s"><div class="bar-radius"></div></div>'), i = $('<div class="bar bar-e"><div class="bar-radius"></div></div>'), j = $('<div class="bar bar-w"><div class="bar-radius"></div></div>'), k = $('<div class="bar bar-ne bar-radius">'), l = $('<div class="bar bar-nw bar-radius">'), m = $('<div class="bar bar-se bar-radius">'), n = $('<div class="bar bar-sw bar-radius">');
            d.append(g).append(h).append(i).append(j).append(k).append(l).append(m).append(n).unbind("mousedown").mousedown(function (b) {
                var c = $(this).attr("id").split("_")[1];
                if (b.ctrlKey)"none" != $(this).children(".bar").first().css("display") ? ($(this).children(".bar").hide(), a.deleteElement(c)) : ($(this).children(".bar").show(), a.addElement(c)); else {
                    if ("none" != $(this).children(".bar").first().css("display"))return;
                    $(this).children(".bar").show().end().siblings().children(".bar").hide(), a.clearElements(), a.addElement(c)
                }
            }), d.find(".element-box").bind("click", function (a) {
                a.ctrlKey && a.stopPropagation()
            }), d.parent().unbind("mousedown").mousedown(function (c) {
                $(c.target).closest("li").length || ($(this).children("li").children(".bar").hide(), b.$emit("hideStylePanel"), a.clearElements())
            }), e(b, d, i, f.RESIZE_E), e(b, d, j, f.RESIZE_W), e(b, d, g, f.RESIZE_N), e(b, d, h, f.RESIZE_S), e(b, d, k, f.RESIZE_NE), e(b, d, l, f.RESIZE_NW), e(b, d, m, f.RESIZE_SE), e(b, d, n, f.RESIZE_SW)
        }}
    }]).directive("pasteElement", ["sceneService", function (a) {
        function b() {
            var b = $('<ul id="pasteMenu" class="dropdown-menu" style="min-width: 100px; display: block;" role="menu" aria-labelledby="dropdownMenu1"><li class="paste" role="presentation"><a role="menuitem" tabindex="-1"><div class="fa fa-paste" style="color: #08a1ef;"></div>&nbsp;&nbsp;粘贴</a></li></ul>').css({position: "absolute", "user-select": "none"});
            return b.find(".paste").on("click", function () {
                a.pasteElement(), b.hide()
            }), b
        }

        return{restrict: "EA", link: function (c, d, e) {
            var f = $(d);
            f.on("contextmenu", function (c) {
                if (a.getCopy()) {
                    var d = b(), e = $("#eq_main"), f = $("#pasteMenu");
                    f.length > 0 && f.remove(), e.append(d), d.css({left: c.pageX + e.scrollLeft() + 15, top: c.pageY + e.scrollTop()}).show(), e.mousemove(function (a) {
                        var b = $("#pasteMenu");
                        (a.pageX < b.offset().left - 20 || a.pageX > b.offset().left + b.width() + 20 || a.pageY < b.offset().top - 20 || a.pageY > b.offset().top + b.height() + 20) && (b.hide(), $(this).unbind("mousemove"))
                    })
                }
                return!1
            })
        }}
    }]).directive("eqxEditDestroy", ["selectService", function (a) {
        return{link: function (b, c) {
            c.on("$destroy", function () {
                a.clearElements()
            })
        }}
    }]).directive("elementAnim", ["selectService", function (a) {
        function b(a, c, d, e) {
            if (c.length && e < c.length) {
                var f = a.get(0);
                a.css("animation", ""), f.offsetWidth = f.offsetWidth, a.css("animation", d[e] + " " + c[e].duration + "s ease 0s").css("animation-fill-mode", "backwards"), a.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                    e++, b(a, c, d, e)
                })
            }
        }

        return{restrict: "EA", link: function (a, c) {
            var d;
            a.$on("previewCurrentChange", function (a, b) {
                d = d = $("#inside_" + b.elemId + " .element-box");
                var c = d.get(0);
                c.offsetWidth = c.offsetWidth, d.css("animation", b.animClasses[b.count] + " " + b.anim.duration + "s ease 0s").css("animation-fill-mode", "backwards")
            }), a.$on("previewAllChanges", function (a, c) {
                d = d = $("#inside_" + c.elemId + " .element-box"), b(d, c.animations, c.animClasses, c.count)
            })
        }}
    }]),b.module("app.directives.editor", []).directive("toolbar", ["$compile", function (a) {
        return{restrict: "EA", replace: !0, templateUrl: "directives/toolbar.tpl.html", link: function (c, d, e) {
            c.internalLinks = b.copy(c.pages), c.internalLink || c.externalLink || (c.internalLink = c.internalLinks[0], c.externalLink = "http://");
            var f = ["#000000", "#7e2412", "#ff5400", "#225801", "#0c529e", "#333333", "#b61b52", "#f4711f", "#3bbc1e", "#23a3d3", "#888888", "#d34141", "#f7951e", "#29b16a", "#97daf3", "#cccccc", "#ec7c7c", "#fdea02", "#79c450", "#563679", "#ffffff", "#ffcccc", "#d9ef7f", "#c3f649"], g = $(".color-menu"), h = $(".bgcolor-menu");
            $.each(f, function (a, b) {
                g.append($('<li><a dropdown-toggle class="btn" data-edit="foreColor ' + b + '" style="background-color: ' + b + '"></a></li>'))
            }), a(g.append($('<li><a dropdown-toggle class="btn glyphicon glyphicon-remove" data-edit="foreColor transparent" style="background-color: transparent"></a></li>')))(c);
            var i = function (a) {
                var b = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                a = a.replace(b, function (a, b, c, d) {
                    return b + b + c + c + d + d
                });
                var c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);
                return c ? {r: parseInt(c[1], 16), g: parseInt(c[2], 16), b: parseInt(c[3], 16)} : null
            };
            $.each(f, function (a, b) {
                var c = i(b);
                h.append($('<li><a dropdown-toggle class="btn" data-edit="backColor rgba(' + c.r + "," + c.g + "," + c.b + ', 0.3)" style="background-color: rgba(' + c.r + "," + c.g + "," + c.b + ', 0.3)"></a></li>'))
            }), a(h.append($('<li><a dropdown-toggle class="btn glyphicon glyphicon-remove" data-edit="backColor transparent" style="background-color: transparent"></a></li>')))(c)
        }}
    }]),b.module("app.directives.uislider", []).value("uiSliderConfig", {}).directive("uiSlider", ["uiSliderConfig", "$timeout", function (a, d) {
        return a = a || {}, {require: "ngModel", compile: function () {
            return function (e, f, g, h) {
                function i(a, b) {
                    return b ? parseFloat(a) : parseInt(a, 10)
                }

                function j() {
                    f.slider("destroy")
                }

                var k = b.extend(e.$eval(g.uiSlider) || {}, a), l = {min: null, max: null}, m = ["min", "max", "step"], n = b.isUndefined(g.useDecimals) ? !1 : !0, o = function () {
                    b.isArray(h.$viewValue) && k.range !== !0 && (console.warn("Change your range option of ui-slider. When assigning ngModel an array of values then the range option should be set to true."), k.range = !0), b.forEach(m, function (a) {
                        b.isDefined(g[a]) && (k[a] = i(g[a], n))
                    }), f.slider(k), o = b.noop
                };
                b.forEach(m, function (a) {
                    g.$observe(a, function (b) {
                        b && (o(), k[a] = i(b, n), f.slider("option", a, i(b, n)), h.$render())
                    })
                }), g.$observe("disabled", function (a) {
                    o(), f.slider("option", "disabled", !!a)
                }), e.$watch(g.uiSlider, function (a) {
                    o(), a !== c && f.slider("option", a)
                }, !0), d(o, 0, !0), f.bind("slide", function (a, b) {
                    h.$setViewValue(b.values || b.value), e.$apply()
                }), h.$render = function () {
                    o();
                    var a = k.range === !0 ? "values" : "value";
                    k.range || !isNaN(h.$viewValue) || h.$viewValue instanceof Array ? k.range && !b.isDefined(h.$viewValue) && (h.$viewValue = [0, 0]) : h.$viewValue = 0, k.range === !0 && (b.isDefined(k.min) && k.min > h.$viewValue[0] && (h.$viewValue[0] = k.min), b.isDefined(k.max) && k.max < h.$viewValue[1] && (h.$viewValue[1] = k.max), h.$viewValue[0] > h.$viewValue[1] && (l.min >= h.$viewValue[1] && (h.$viewValue[0] = l.min), l.max <= h.$viewValue[0] && (h.$viewValue[1] = l.max)), l.min = h.$viewValue[0], l.max = h.$viewValue[1]), f.slider(a, h.$viewValue)
                }, e.$watch(g.ngModel, function () {
                    k.range === !0 && h.$render()
                }, !0), f.bind("$destroy", j)
            }
        }}
    }]),b.module("security.authority", []).factory("authority", [function () {
        var a = {GROUP_CUSTOMER: 1, SCENE_HIDE_LASTPAGE_SETTING: 2, TRANSFER_SCENE: 4}, b = {1: {code: 5, name: "普通账号"}, 2: {code: 7, name: "企业账号"}, 21: {code: 7, name: "企业子账号"}, 3: {code: 7, name: "高级用户"}, 4: {code: 7, name: "服务商用户"}};
        return{accessDef: a, userRoleDef: b}
    }]),b.module("security.authorization", ["security.service"]).provider("securityAuthorization", {requireAdminUser: ["securityAuthorization", function (a) {
        return a.requireAdminUser()
    }], requireAuthenticatedUser: ["securityAuthorization", function (a) {
        return a.requireAuthenticatedUser()
    }], $get: ["security", "securityRetryQueue", function (a, b) {
        var c = {requireAuthenticatedUser: function () {
            var d = a.requestCurrentUser().then(function (d) {
                return a.isAuthenticated() ? void 0 : b.pushRetryFn("unauthenticated-client", c.requireAuthenticatedUser)
            });
            return d
        }, requireAdminUser: function () {
            var d = a.requestCurrentUser().then(function (d) {
                return a.isAdmin() ? void 0 : b.pushRetryFn("unauthorized-client", c.requireAdminUser)
            });
            return d
        }};
        return c
    }]}),b.module("security", ["security.service", "security.interceptor", "security.login", "security.authorization"]),b.module("security.interceptor", ["security.retryQueue"]).factory("securityInterceptor", ["$injector", "$location", "securityRetryQueue", function (a, b, c) {
        return function (d) {
            return d.then(null, function (e) {
                if (401 === e.status) {
                    if ("/home" == b.path() || "/home/login" == b.path() || "/home/register" == b.path() || "/home/reset" == b.path() || "/agreement" == b.path() || "/reg" == b.path() || "/sample" == b.path() || "/error" == b.path())return;
                    d = c.pushRetryFn("unauthorized-server", function () {
                        return a.get("$http")(e.config)
                    })
                }
                return 403 === e.status && (alert("对不起，您没有查看此内容的权限"), b.path("/home")), d
            })
        }
    }]).config(["$httpProvider", function (a) {
        a.responseInterceptors.push("securityInterceptor")
    }]),b.module("security.login.form", ["services.localizedMessages", "app.directives.addelement"]).controller("LoginFormController", ["$scope", "$timeout", "security", "localizedMessages", "$location", "$sce", function (a, b, c, d, e, f) {
        a.user = {}, a.retrieve = {}, a.showLogin = !0, a.sendPassword = !1, a.unExist = !1, a.weiChatUrl = c.thirdPartyUrl.weiChatUrl, a.qqUrl = c.thirdPartyUrl.qqUrl, a.weiboUrl = c.thirdPartyUrl.weiboUrl, a.openWeibo = function () {
            alert("新浪微博注册功能即将开放!")
        }, a.authError = null, a.isValidateCodeLogin = c.isValidateCodeLogin, a.validateCodeSrc = PREFIX_URL + "servlet/validateCodeServlet", a.authReason = null, c.getLoginReason() && (a.authReason = d.get(c.isAuthenticated() ? "login.reason.notAuthorized" : "login.reason.notAuthenticated")),
            a.rotate = function (c) {
                $(".modal-content").addClass("flip"), $(".login-form-section").fadeOut(600), b(function () {
                    a.showLogin = !c, $(".login-form-section").fadeIn(0), $(".modal-content").removeClass("flip")
                }, 600)
            }, a.login = function () {
            a.authError = null;
            var b = {username: a.user.email, password: a.user.password, rememberMe: a.user.rememberMe};
            return!a.isValidateCodeLogin || (b.geetest_challenge = challenge, b.geetest_validate = validate, b.geetest_seccode = seccode, challenge && validate && seccode) ? a.user.email ? a.user.password ? void c.login($.param(b)).then(function (b) {
                challenge = null, validate = null, seccode = null, b ? (selectorA && selectorA(".gt_refresh_button").click(), 1005 === b.code, a.isValidateCodeLogin = b.map.isValidateCodeLogin, a.authReason = "", a.authError = b.msg) : (a.authError = d.get("login.error.invalidCredentials"), submit = !1)
            }, function (b) {
                a.authError = d.get("login.error.serverError", {exception: b})
            }) : (a.authReason = "", void(a.authError = "密码不能为空")) : (a.authReason = "", void(a.authError = "邮箱不能为空")) : (a.authReason = "", void(a.authError = "验证码不能为空"))
        }, a.openRegister = function () {
            e.path("/home/register", !1)
        }, a.clearForm = function () {
            a.user = {}
        }, a.cancelLogin = function () {
            c.cancelLogin()
        }, a.reset = function () {
            a.user = {}, a.retrieve = {}
        };
        var g = "http://api.geetest.com/get.php?gt=1ebc844c9e3a8c23e2ea4b567a8afd2d&time=" + (new Date).getTime();
        a.validateCodeUrl = f.trustAsResourceUrl(g), b(function () {
            $('input[name="userEmail"]').focus()
        }, 300), a.retrievePassword = function () {
            return a.retrieve.email ? submit ? challenge && validate && seccode ? void c.retrievePassword(a.retrieve.email, challenge, validate, seccode).then(function (b) {
                challenge = "", validate = "", seccode = "", 200 == b.data.code ? (a.sendPassword = !0, submit = !1) : (selectorA && selectorA(".gt_refresh_button").click(), 1003 == b.data.code ? a.retrieveError = "账号不存在" : 1005 == b.data.code && (a.retrieveError = "验证码错误"))
            }) : void(a.retrieveError = "验证码不能为空") : void(a.retrieveError = "验证码匹配错误") : void(a.retrieveError = "邮箱不能为空")
        }
    }]),b.module("security.login.reset", ["services.localizedMessages"]).controller("ResetFormController", ["$scope", "security", "localizedMessages", "$location", "resetKey", function (a, b, c, d, e) {
        a.password = {}, a.reset = function () {
            return a.password.newPw != a.password.confirm ? (a.authError = c.get("login.reset.notmatch"), a.password.newPw = "", a.password.confirm = "", void $('input[name="newPassword"]').focus()) : void b.resetPassByKey(a.password.newPw, e).then(function (b) {
                200 == b.data.code ? (alert("修改成功"), a.$close(), d.path("/main").search({})) : 1011 == b.data.code && (a.authError = b.data.msg)
            })
        }, a.cancel = function () {
            a.$dismiss()
        }
    }]).directive("equals", function () {
        return{restrict: "A", require: "?ngModel", link: function (a, b, c, d) {
            if (d) {
                a.$watch(c.ngModel, function () {
                    e()
                }), c.$observe("equals", function (a) {
                    e()
                });
                var e = function () {
                    var a = d.$viewValue, b = c.equals;
                    d.$setValidity("equals", a === b)
                }
            }
        }}
    }),b.module("security.login", ["security.login.form", "security.login.reset", "security.login.toolbar"]),b.module("security.login.toolbar", ["services.usercenter"]).directive("loginToolbar", ["security", "$rootScope", "usercenterService", function (a, b, c) {
        var d = {templateUrl: "security/login/toolbar.tpl.html", restrict: "E", replace: !0, scope: !0, link: function (d, e, f, g) {
            d.PREFIX_FILE_HOST = PREFIX_FILE_HOST, d.isAuthenticated = a.isAuthenticated, d.login = a.showLogin, d.logout = a.logout, d.requestResetPassword = a.requestResetPassword, d.isAdvancedUser = b.isAdvancedUser, d.isEditor = b.isEditor, d.isVendorUser = b.isVendorUser, d.$watch(function () {
                return a.currentUser
            }, function (a) {
                d.currentUser = a, d.currentUser.headImg ? /^http.*/.test(a.headImg) && (d.headImg = a.headImg) : d.headImg = CLIENT_CDN + "assets/images/defaultuser.jpg"
            }), d.$on("minusCount", function (a, b) {
                d.count -= b, d.newMsgCount = d.count > 9 ? "9+" : d.count
            }), d.getNewMessage = function (a, b, e) {
                c.getNewMessage(a, b, e).then(function (a) {
                    d.newMsgs = a.data.list, d.count = a.data.map.count, d.newMsgCount = a.data.map.count > 9 ? "9+" : a.data.map.count
                })
            }, d.getNewMessage(1, 4, !0), d.openMsgPanel = function () {
                $(".mes_con").hasClass("open") || d.getNewMessage(1, 4, !0)
            }
        }};
        return d
    }]),b.module("security.otherregister.form", ["services.localizedMessages", "app.directives.register"]),b.module("security.otherregister.form").controller("OtherRegisterFormController", ["$scope", "$timeout", "security", "localizedMessages", "$location", "$http", "$window", "otherRegisterInfo", function (a, b, c, d, e, f, g, h) {
        a.user = {}, a.user.agreement = !0, a.getUserDetail = function () {
            var b = {type: "qq", openId: h.openId, accessToken: h.accessToken};
            c.getUserDetail(b.type, b.openId, b.accessToken).then(function (b) {
                a.otherUserInfo = b.data.obj
            })
        }, a.getUserDetail()
    }]),b.module("security.register.form", ["services.localizedMessages", "app.directives.register"]),b.module("security.register.form").controller("RegisterFormController", ["$scope", "$timeout", "security", "localizedMessages", "$location", "$http", "$window", function (a, b, c, d, e, f, g) {
        a.user = {}, a.user.agreement = !0, a.weiChatUrl = c.thirdPartyUrl.weiChatUrl, a.qqUrl = c.thirdPartyUrl.qqUrl, a.weiboUrl = c.thirdPartyUrl.weiboUrl;
        var h = !1;
        a.openWeibo = function () {
            alert("新浪微博注册功能即将开放!")
        }, a.register = function () {
            var b = {email: a.user.email, password: a.user.password}, e = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if (!e.test(a.user.email))return void(a.regErr = "请输入正确的邮箱格式");
            if (a.user.password === a.user.repeatPassword && a.user.agreement) {
                if (h)return;
                h = !0, c.register($.param(b)).then(function (b) {
                    h = !1, b && (a.regErr = b.msg)
                }, function (b) {
                    h = !1, a.regErr = d.get("register.error.serverError", {exception: b})
                })
            } else a.regErr = d.get(a.user.password != a.user.repeatPassword ? "register.error.match" : "register.error.agreement")
        }, a.checkUpperCase = function () {
            /[A-Z]/g.test(a.user.email) && (a.user.email = a.user.email.toLowerCase(), alert("请用小写字母邮箱注册，已将邮箱中的大写字母自动转换成小写"))
        }, a.openLogin = function () {
            e.path("/home/login", !1)
        }, a.reset = function () {
            a.user = {}
        }
    }]).controller("BindingController", ["$rootScope", "$scope", "$timeout", "security", "localizedMessages", "$location", "$http", "$window", function (a, b, c, d, e, f, g, h) {
        b.qq_url = "https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=101149132&redirect_uri=" + redirect_uri + "&display=pc", b.weibo_url = "https://api.weibo.com/oauth2/authorize?client_id=3508809852&response_type=token&redirect_uri=" + PREFIX_HOST
    }]),b.module("security.register", ["security.register.form", "security.otherregister.form"]),b.module("security.retryQueue", []).factory("securityRetryQueue", ["$q", "$log", function (a, d) {
        var e = [], f = {onItemAddedCallbacks: [], hasMore: function () {
            return e.length > 0
        }, push: function (a) {
            e.push(a), b.forEach(f.onItemAddedCallbacks, function (b) {
                try {
                    b(a)
                } catch (c) {
                    d.error("securityRetryQueue.push(retryItem): callback threw an error" + c)
                }
            })
        }, pushRetryFn: function (b, d) {
            1 === arguments.length && (d = b, b = c);
            var e = a.defer(), g = {reason: b, retry: function () {
                a.when(d()).then(function (a) {
                    e.resolve(a)
                }, function (a) {
                    e.reject(a)
                })
            }, cancel: function () {
                e.reject()
            }};
            return f.push(g), e.promise
        }, retryReason: function () {
            return f.hasMore() && e[0].reason
        }, cancelAll: function () {
            for (; f.hasMore();)e.shift().cancel()
        }, retryAll: function () {
            for (; f.hasMore();)e.shift().retry()
        }};
        return f
    }]),b.module("security.service", ["security.retryQueue", "security.login", "security.register", "security.authority", "ui.bootstrap.modal"]).factory("security", ["$rootScope", "$http", "$q", "$location", "securityRetryQueue", "$modal", "ModalService", "authority", function (b, c, d, e, f, g, h, i) {
        function j(b) {
            b = b || "/", a.location.href = b
        }

        function k() {
            if (u && (l(u, !1), u = null), s)throw new Error("Trying to open a dialog that is already open!");
            s = g.open({windowClass: "login-container", keyboard: !1, templateUrl: "security/login/form.tpl.html", controller: "LoginFormController"}), s.result.then(m, m)
        }

        function l(a, b) {
            a.close(b)
        }

        function m(a) {
            s = null, a ? ("/home/login" == e.path() && e.path("/home", !1), f.retryAll()) : (f.cancelAll(), j())
        }

        function n(a) {
            if (t)throw new Error("Trying to open a dialog that is already open!");
            t = g.open({windowClass: "login-container", keyboard: !1, templateUrl: "security/login/reset.tpl.html", controller: "ResetFormController", resolve: {resetKey: function () {
                return a
            }}}), t.result.then(function () {
                t = null
            }, function () {
                x.currentUser || e.path("/home", !1).search({}), t = null
            })
        }

        function o() {
            if (s && (l(s, !0), s = null), u)throw new Error("Trying to open a dialog that is already open!");
            u = g.open({windowClass: "login-container", keyboard: !1, templateUrl: "security/register/register.tpl.html", controller: "RegisterFormController"}), u.result.then(function () {
                u = null
            }, function () {
                "/home/register" == e.path() && e.path("/home", !1), u = null
            })
        }

        function p(a) {
            if (v)throw new Error("Trying to open a dialog that is already open!");
            v = g.open({windowClass: "login-container", keyboard: !1, templateUrl: "security/register/otherregister.tpl.html", controller: "OtherRegisterFormController", resolve: {otherRegisterInfo: function () {
                return a
            }}})
        }

        function q(a) {
            w = a
        }

        function r() {
            return w
        }

        var s = null, t = null, u = null, v = null;
        f.onItemAddedCallbacks.push(function (a) {
            f.hasMore() && ("unauthorized-server" == f.retryReason() && x.showLogin(), "down-server" == f.retryReason() && h.openMsgDialog({msg: "服务器忙碌，请稍后再试！"}))
        });
        var w = {}, x = {getLoginReason: function () {
            return f.retryReason()
        }, showLogin: function () {
            k()
        }, showRegister: function () {
            o()
        }, showOtherRegister: function () {
            p()
        }, getUserDetail: function (a, b, d) {
            var e = PREFIX_URL + "base/relUserInfo?type=" + a + "&openId=" + b + "&accessToken=" + d, f = new Date;
            return e += "&date=" + f.getTime(), c({method: "GET", url: e, withCredentials: !0})
        }, addRegisterInfo: q, getRegisterInfo: r, login: function (a) {
            var b = this,
                d = c.post(JSON_URL + "?c=user&a=login", a, {
                    withCredentials: !0, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}});
            return d.then(function (a) {
                if (200 === a.status) {
                    if (b.isValidateCodeLogin = !1, a.data.success !== !0)return a.data;
                    ("/home" == e.path() || "/home/login" == e.path()) && e.path("main"), x.requestCurrentUser(), l(s, !0)
                } else x.isAuthenticated()
            }, function (a) {
                x.isAuthenticated()
            })
        }, register: function (a) {
            var b = c.post(JSON_URL + "?c=user&a=register", a, {withCredentials: !0, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}});
            return b.then(function (a) {
                if (200 === a.status) {
							if (a.data.success !== !0) return a.data;
							alert("注册成功，请登录！");
							window.location.href='/';
						} else w.isAuthenticated()
					}, function (a) {
                x.isAuthenticated()
            })
        }, thirdPartLogin: function (a) {
            var b = c.post(PREFIX_URL + "eqs/relAccount", $.param(a), {withCredentials: !0, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}});
            return b.then(function (a) {
                if (200 === a.status) {
                    if (a.data.success !== !0)return a.data;
                    ("/home" == e.path() || "/home/login" == e.path()) && e.path("main"), x.setLoginSuccess(!0), x.requestCurrentUser(), l(v, !0)
                } else x.isAuthenticated()
            }, function (a) {
                x.isAuthenticated()
            })
        }, weiChatLogin: function (a) {
            return c.post(PREFIX_URL + "eqs/relWechatAccount?code=" + a + "&isMobile=1&time=" + (new Date).getTime(), {}, {withCredentials: !0, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}})
        }, cancelRegister: function () {
            l(u, !1), j("#/reg")
        }, hasRel: function (a) {
            u && l(u, !1);
            var b = new Date, d = PREFIX_URL + "base/user/hasRel?type=" + a.type + "&openId=" + a.openId + "&time=" + b.getTime(), f = c.get(d, {withCredentials: !0});
            f.then(function (b) {
                200 === b.status ? b.data.success === !0 ? (("/home" == e.path() || "/home/login" == e.path()) && e.path("main"), x.requestCurrentUser()) : "未关联账号" == b.data.msg && p(a) : x.isAuthenticated()
            }, function (a) {
                x.isAuthenticated()
            })
        }, cancelLogin: function () {
            l(s, !1), j()
        }, logout: function (a) {
            c({withCredentials: !0, method: "GET", url: JSON_URL + "?c=user&a=loginout"}).then(function (b) {
                x.currentUser = null, j(a)
            }, function () {
                x.currentUser = null, j(a)
            })
        }, requestCurrentUser: function () {
            if (x.isAuthenticated())return d.when(x.currentUser);
            var a = new Date;
            return c.get(JSON_URL + "?c=user&a=check&time=" + a.getTime(), {withCredentials: !0}).then(function (a) {
				if(a.data.code==1001){
							
							document.getElementById('eq_main').style.backgroundColor="transparent"
						}
                return a && (x.currentUser = a.data.obj, (!x.currentUser.roleIdList || x.currentUser.roleIdList.length <= 0) && (x.currentUser.roleIdList = [2])), x.currentUser
            })
        }, resetPassByKey: function (a, b) {
            var d = {key: b, newPwd: a};
            return c.post(PREFIX_URL + "eqs/pwd/reset", $.param(d), {withCredentials: !0, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}})
        }, currentUser: null, isAuthenticated: function () {
            return!!x.currentUser
        }, isLoginSuccess: !1, setLoginSuccess: function (a) {
            x.isLoginSuccess = a
        }, thirdPartyUrl: {weiChatUrl: "https://open.weixin.qq.com/connect/qrconnect?appid=wxc5f1bbae4bb93ced&redirect_uri=http%3A%2F%2Feqxiu.com&response_type=code&scope=snsapi_login&state=WECHAT_STATE#wechat_redirect", qqUrl: "https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=101149132&redirect_uri=http%3A%2F%2Feqxiu.com&scope=get_user_info", weiboUrl: "https://api.weibo.com/oauth2/authorize?client_id=3508809852&response_type=token&redirect_uri=http://eqxiu.com"}, isAllowToAccess: function (a) {
            var b = i.userRoleDef[x.currentUser.type];
            return(b.code & a) > 0 ? !0 : !1
        }, accessDef: i.accessDef, isEditor: function () {
            if (!x.currentUser)return!1;
            var a = x.currentUser.roleIdList;
            if (!a)return!1;
            for (var b = 0; b < a.length; b++)if ("4" == a[b])return!0;
            return!1
        }, isAdvancedUser: function () {
            return x.currentUser && "3" == x.currentUser.type ? !0 : !1
        }, isVendorUser: function () {
            return x.currentUser && "4" == x.currentUser.type ? !0 : !1
        }, requestResetPassword: function (a) {
            n(a)
        }, validateToken: function (a) {
            var b = "changepw?token=" + a;
            return c.get(PREFIX_URL + b, {withCredentials: !0})
        }, resetPassword: function (a, b) {
            var d = PREFIX_URL + "m/base/user/changePwd", e = {oldPwd: a, newPwd: b};
            return c.post(d, $.param(e), {withCredentials: !0, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}})
        }, retrievePassword: function (a, b, d, e) {
            var f = PREFIX_URL + "eqs/pwd/retrieve", g = {email: a, geetest_challenge: b, geetest_validate: d, geetest_seccode: e};
            return c.post(f, $.param(g), {withCredentials: !0, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}})
        }};
        return x
    }]),b.module("services.breadcrumbs", []),b.module("services.breadcrumbs").factory("breadcrumbs", ["$rootScope", "$location", function (a, b) {
        var c = [], d = {};
        return a.$on("$routeChangeSuccess", function (a, d) {
            var e, f = b.path().split("/"), g = [], h = function (a) {
                return"/" + f.slice(0, a + 1).join("/")
            };
            for (f.shift(), e = 0; e < f.length; e++)g.push({name: f[e], path: h(e)});
            c = g
        }), d.getAll = function () {
            return c
        }, d.getFirst = function () {
            return c[0] || {}
        }, d
    }]),b.module("services.config", []).factory("configService", ["$http", function (a) {
        var b = function () {
            var b = PREFIX_S2_URL + "eqs/image/pc/logo";
            return a({withCredentials: !0, method: "GET", url: b})
        }, c = function () {
            var b = PREFIX_S2_URL + "eqs/image/pc/banner";
            return a({withCredentials: !0, method: "GET", url: b})
        }, d = function () {
            var b = PREFIX_S2_URL + "eqs/friendlinks";
            return a({withCredentials: !0, method: "GET", url: b})
        };
        return{getLogo: b, getBanners: c, getFriendLinks: d}
    }]),b.module("services.crud", ["services.crudRouteProvider"]),b.module("services.crud").factory("crudEditMethods", function () {
        return function (a, c, d, e, f) {
            var g = {};
            return g[a] = c, g[a + "Copy"] = b.copy(c), g.save = function () {
                this[a].$saveOrUpdate(e, e, f, f)
            }, g.canSave = function () {
                return this[d].$valid && !b.equals(this[a], this[a + "Copy"])
            }, g.revertChanges = function () {
                this[a] = b.copy(this[a + "Copy"])
            }, g.canRevert = function () {
                return!b.equals(this[a], this[a + "Copy"])
            }, g.remove = function () {
                this[a].$id() ? this[a].$remove(e, f) : e()
            }, g.canRemove = function () {
                return c.$id()
            }, g.getCssClasses = function (a) {
                var b = this[d][a];
                return{error: b.$invalid && b.$dirty, success: b.$valid && b.$dirty}
            }, g.showError = function (a, b) {
                return this[d][a].$error[b]
            }, g
        }
    }),b.module("services.crud").factory("crudListMethods", ["$location", function (a) {
        return function (b) {
            var c = {};
            return c["new"] = function () {
                a.path(b + "/new")
            }, c.edit = function (c) {
                a.path(b + "/" + c)
            }, c
        }
    }]),function () {
        function a(a) {
            this.$get = b.noop, this.routesFor = function (d, e, f) {
                var g = d.toLowerCase(), h = "/" + d.toLowerCase();
                f = f || e, b.isString(e) && "" !== e && (g = e + "/" + g), null !== f && f !== c && "" !== f && (h = "/" + f + h);
                var i = function (a) {
                    return g + "/" + d.toLowerCase() + "-" + a.toLowerCase() + ".tpl.html"
                }, j = function (a) {
                    return d + a + "Ctrl"
                }, k = {whenList: function (a) {
                    return k.when(h, {templateUrl: i("List"), controller: j("List"), resolve: a}), k
                }, whenNew: function (a) {
                    return k.when(h + "/new", {templateUrl: i("Edit"), controller: j("Edit"), resolve: a}), k
                }, whenEdit: function (a) {
                    return k.when(h + "/:itemId", {templateUrl: i("Edit"), controller: j("Edit"), resolve: a}), k
                }, when: function (b, c) {
                    return a.when(b, c), k
                }, otherwise: function (b) {
                    return a.otherwise(b), k
                }, $routeProvider: a};
                return k
            }
        }

        a.$inject = ["$routeProvider"], b.module("services.crudRouteProvider", ["ngRoute"]).provider("crudRoute", a)
    }(),b.module("services.data", []),b.module("services.data").factory("dataService", ["$http", function (a) {
        var b = {};
        return b.getDataBySceneId = function (b, c, d, e) {
            c = c || 1, d = d || 10;
            var f = "?c=scenedata&a=getdata&id=" + b + "?pageNo=" + c + "&pageSize=" + d;
            e && (f += (/\?/.test(f) ? "&" : "?") + "user=" + e);
            var g = new Date;
            return f += "&time=" + g.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + f})
        }, b.getDataDetail = function (b, c) {
            var d = "?c=custom&a=detail&id=" + b;
            c && (d += (/\?/.test(d) ? "&" : "?") + "user=" + c);
            var e = new Date;
            return d += (/\?/.test(d) ? "&" : "?") + "date=" + e.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + d})
        }, b.getAllData = function (b, c) {
            var d = "?c=custom&a=getAllData&pageSize=10&pageNo=" + b;
            c && (d += (/\?/.test(d) ? "&" : "?") + "user=" + c);
            var e = new Date;
            return d += (/\?/.test(d) ? "&" : "?") + "time=" + e.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + d})
        }, b.getProspectDataAccount = function (b) {
            var c = "?c=custom&a=prospectCount&time=" + (new Date).getTime();
            return b && (c += (/\?/.test(c) ? "&" : "?") + "user=" + b), a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, b.getAllPageView = function (b) {
            var c = "?c=scene&a=pvcount&time=" + (new Date).getTime();
            return b && (c += (/\?/.test(c) ? "&" : "?") + "user=" + b), a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, b.deleteDataById = function (b) {
            var c = "m/c/delete/" + b;
            return a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, b.getAllDataCount = function (b) {
            var c = "?c=custom&a=count";
            b && (c += (/\?/.test(c) ? "&" : "?") + "user=" + b);
            var d = new Date;
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, b.getOpenCount = function (b) {
            var c = "?c=scene&a=opencount";
            b && (c += (/\?/.test(c) ? "&" : "?") + "user=" + b);
            var d = new Date;
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, b.getAllSceneDataCount = function (b) {
            var c = "?c=scenedata&a=getcount";
            b && (c += (/\?/.test(c) ? "&" : "?") + "user=" + b);
            var d = new Date;
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, b.saveData = function (b) {
            {
                var c = "m/c/save";
                new Date
            }
            return a({withCredentials: !0, method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}, url: PREFIX_URL + c, data: b})
        }, b.getSceneField = function (b) {
            var c = "?c=custom&a=formField&id=" + b, d = new Date;
            return c += "?time=" + d.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, b.getPremergeScenes = function (b) {
            var c = "?c=custom&a=newDataScene";
            b && (c += (/\?/.test(c) ? "&" : "?") + "user=" + b);
            var d = new Date;
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, b.mergeSceneData = function (b, c) {
            var d = "?c=custom&a=imps&id=" + b;
            return a({withCredentials: !0, method: "POST", url: JSON_URL + d, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}, data: $.param(c)})
        }, b.getGroups = function () {
            var b = "c-group-list.html";
            return b += "?date=" + (new Date).getTime(), a({withCredentials: !0, method: "GET", url: PREFIX_URL + b})
        }, b.assignGroup = function (b) {
            var c = "m/c/group/set?cIds=" + b.cIds + "&gIds=" + b.gIds;
            return a({withCredentials: !0, method: "POST", url: PREFIX_URL + c, headers: {"Content-Type": "text/plain; charset=UTF-8"}})
        }, b.deleteAssociation = function (b) {
            var c = "m/c/group/unset?cId=" + b.cId + "&gId=" + b.gId;
            return a({withCredentials: !0, method: "POST", url: PREFIX_URL + c, headers: {"Content-Type": "text/plain; charset=UTF-8"}})
        }, b.createGroup = function (b) {
            var c = "m/c/group/create";
            return a({withCredentials: !0, method: "POST", url: PREFIX_URL + c, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}, data: $.param(b)})
        }, b.deleteCustomer = function (b) {
            var c = "m/c/delete?ids=" + b.ids;
            return a({withCredentials: !0, method: "POST", url: PREFIX_URL + c, headers: {"Content-Type": "text/plain; charset=UTF-8"}})
        }, b.deleteGroup = function (b) {
            var c = "m/c/group/delete?id=" + b;
            return a({withCredentials: !0, method: "POST", url: PREFIX_URL + c, headers: {"Content-Type": "text/plain; charset=UTF-8"}})
        }, b
    }]),b.module("services.exceptionHandler", ["services.i18nNotifications"]),b.module("services.exceptionHandler").factory("exceptionHandlerFactory", ["$injector", function (a) {
        return function (b) {
            return function (c, d) {
                var e = a.get("i18nNotifications");
                b(c, d), e.pushForCurrentRoute("error.fatal", "error", {}, {exception: c, cause: d})
            }
        }
    }]),b.module("services.exceptionHandler").config(["$provide", function (a) {
        a.decorator("$exceptionHandler", ["$delegate", "exceptionHandlerFactory", function (a, b) {
            return b(a)
        }])
    }]),b.module("services.file", []),b.module("services.file").factory("fileService", ["$http", function (a) {
        var b = {};
        return b.listFileCategory = function (b) {
            //var c = "base/class/" + ("1" == b ? "tpType" : "bgType"),
            var c = "class-" + ("1" == b ? "tpType" : "bgType") + ".htm",
                d = new Date;
            return c += "?time=" + d.getTime(), a({withCredentials: !0, method: "GET", url: PREFIX_URL + c})
        }, b.deleteFile = function (b) {
            var c = "?c=upfile&a=delete", d = {id: b};
            return a({withCredentials: !0, method: "POST", url: JSON_URL + c, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}, data: $.param(d)})
        }, b.createCategory = function (b) {
            var c = "?c=tag&a=create", d = {tagName: b};
            return a({withCredentials: !0, method: "POST", url: JSON_URL + c, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}, data: $.param(d)})
        }, b.getCustomTags = function () {
            var b = "?c=tag&a=my&?time" + (new Date).getTime();
            return a({withCredentials: !0, method: "GET", url: JSON_URL + b})
        }, b.deleteTag = function (b) {
            var c = "?c=tag&a=delete", d = {id: b};
            return a({withCredentials: !0, method: "POST", url: JSON_URL + c, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}, data: $.param(d)})
        }, b.setCategory = function (b, c) {
            var d = "?c=tag&a=set", e = {tagId: b, fileIds: c};
            return a({withCredentials: !0, method: "POST", url: JSON_URL + d, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}, data: $.param(e)})
        }, b.getImagesByTag = function (b, c, d, e) {
            var f = "?c=upfile&a=userlist&";
            return f += "fileType=" + c, b && (f += "&tagId=" + b), f += "&pageNo=" + (d ? d : 1), f += "&pageSize=" + (e ? e : 12), f += "&time=" + (new Date).getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + f})
        }, b.getImagesBySysTag = function (b, c, d, e, f) {
            var g = "?c=upfile&a=syslist&";
            return g += "tagId=" + b, g += "&fileType=" + c, g += "&bizType=" + f, g += "&pageNo=" + (d ? d : 1), g += "&pageSize=" + (e ? e : 12), g += "&time=" + (new Date).getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + g})
        }, b.unsetTag = function (b, c) {
            var d = "m/base/file/tag/unset", e = {tagId: b, fileIds: c};
            return a({withCredentials: !0, method: "POST", url: PREFIX_URL + d, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}, data: $.param(e)})
        }, b.getChildCategory = function (b) {
            var c = "?c=upfile&a=systag&type=11";
            return b && (c += "?bizType=" + b), c += (/\?/.test(c) ? "&" : "?") + "time=" + (new Date).getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, b.getFileByCategory = function (b, c, d, e) {
            var f = "?c=upfile&a=syslist&";
            "0" === d && "2" === e && (f = "?c=upfile&a=userlist&"), f += "pageNo=" + (b ? b : 1), f += "&pageSize=" + (c ? c : 12), d && "all" != d && (f += "&bizType=" + (d ? d : -1)), f += "&fileType=" + (e ? e : -1);
            var g = new Date;
            return f += "&time=" + g.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + f})
        }, b.cropImage = function (b) {
            var c = "?c=page&a=crop&";
            return a({withCredentials: !0, method: "POST", url: JSON_URL + c, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}, data: $.param(b)})
        }, b
    }]),b.module("services.history", []).factory("historyService", ["$rootScope", function (a) {
        var b = {}, c = {}, d = {};
        return b.addPage = function (d, e) {
            return c[d] || (c[d] = {currentPos: 0, inHistory: !1, pageHistory: []}, b.addPageHistory(d, e)), a.$broadcast("history.changed"), JSON.parse(c[d].pageHistory[c[d].currentPos])
        }, b.addPageHistory = function (b, e) {
            d = c[b], d.inHistory && (d.inHistory = !1, d.pageHistory.length = d.currentPos + 1);
            var f = JSON.stringify(e);
            f != d.pageHistory[d.pageHistory.length - 1] && d.pageHistory.push(f), d.currentPos = d.pageHistory.length - 1, a.$broadcast("history.changed")
        }, b.clearHistory = function () {
            c = {}
        }, b.canBack = function (a) {
            return d = c[a], d.currentPos > 0
        }, b.canForward = function (a) {
            return d = c[a], d.currentPos < d.pageHistory.length - 1
        }, b.back = function (b) {
            if (d = c[b], d.pageHistory.length) {
                d.inHistory = !0;
                var e = 0 === d.currentPos ? d.pageHistory[0] : d.pageHistory[--d.currentPos];
                return a.$broadcast("history.changed"), JSON.parse(e)
            }
        }, b.forward = function (b) {
            if (d = c[b], d.pageHistory.length) {
                d.inHistory = !0;
                var e = d.currentPos == d.pageHistory.length - 1 ? d.pageHistory[d.currentPos] : d.pageHistory[++d.currentPos];
                return a.$broadcast("history.changed"), JSON.parse(e)
            }
        }, b
    }]),b.module("services.httpRequestTracker", []),b.module("services.httpRequestTracker").factory("httpRequestTracker", ["$http", function (a) {
        var b = {};
        return b.hasPendingRequests = function () {
            return a.pendingRequests.length > 0
        }, b
    }]),b.module("services.i18nNotifications", ["services.notifications", "services.localizedMessages"]),b.module("services.i18nNotifications").factory("i18nNotifications", ["localizedMessages", "notifications", function (a, c) {
        var d = function (c, d, e, f) {
            return b.extend({message: a.get(c, e), type: a.get(d, e)}, f)
        }, e = {pushSticky: function (a, b, e, f) {
            return c.pushSticky(d(a, b, e, f))
        }, pushForCurrentRoute: function (a, b, e, f) {
            return c.pushForCurrentRoute(d(a, b, e, f))
        }, pushForNextRoute: function (a, b, e, f) {
            return c.pushForNextRoute(d(a, b, e, f))
        }, getCurrent: function () {
            return c.getCurrent()
        }, remove: function (a) {
            return c.remove(a)
        }};
        return e
    }]),b.module("services.localizedMessages", []).factory("localizedMessages", ["$interpolate", "I18N.MESSAGES", function (a, b) {
        var c = function (a, b) {
            return a || "?" + b + "?"
        };
        return{get: function (d, e) {
            var f = b[d];
            return f ? a(f)(e) : c(f, d)
        }}
    }]),b.module("services.mine", []),b.module("services.mine").factory("MineService", ["$http", function (a, b) {
        var c = {};
        return c.getMyScenes = function (b, c, d, e) {
            var f = "?c=scene&a=my";
            b && (f += "/" + b), f += "&pageNo=" + (c ? c : 1), f += "&pageSize=" + (d ? d : 12), e && (f += "&user=" + e);
            var g = new Date;
            return f += (/\?/.test(f) ? "&" : "?") + "time=" + g.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + f})
        }, c
    }]),b.module("services.modal", ["confirm-dialog", "message-dialog", "bindemail-dialog"]).factory("ModalService", ["$modal", function (a) {
        var b = {};
        return b.openBindEmailDialog = function () {
            a.open({keyboard: !1, backdropClick: !0, windowClass: "confirm-dialog", templateUrl: "dialog/bindemail.tpl.html", controller: "BindEmailDialogCtrl"})
        }, b.openConfirmDialog = function (b, c, d) {
            a.open({backdrop: "static", keyboard: !1, backdropClick: !1, windowClass: "confirm-dialog", templateUrl: "dialog/confirm.tpl.html", controller: "ConfirmDialogCtrl", resolve: {confirmObj: function () {
                return b
            }}}).result.then(c, d)
        }, b.openMsgDialog = function (b, c, d) {
            a.open({backdrop: "static", keyboard: !1, backdropClick: !1, windowClass: "message-dialog", templateUrl: "dialog/message.tpl.html", controller: "MessageDialogCtrl", resolve: {msgObj: function () {
                return b
            }}}).result.then(c, d)
        }, b
    }]),b.module("I18N.MESSAGES", []).constant("I18N.MESSAGES", {"notify.success": "success", "notify.info": "info", "notify.danger": "danger", "notify.warning": "warning", "notify.tip": "tip", "errors.route.changeError": "Route change error", "crud.user.save.success": "A user with id '{{id}}' was saved successfully.", "crud.user.remove.success": "A user with id '{{id}}' was removed successfully.", "crud.user.remove.error": "Something went wrong when removing user with id '{{id}}'.", "crud.user.save.error": "Something went wrong when saving a user...", "crud.project.save.success": "A project with id '{{id}}' was saved successfully.", "crud.project.remove.success": "A project with id '{{id}}' was removed successfully.", "crud.project.save.error": "Something went wrong when saving a project...", "login.reason.notAuthorized": "离开久了，麻烦再登录一次吧！", "login.reason.notAuthenticated": "离开久了，麻烦再登录一次吧！", "login.error.invalidCredentials": "登录失败，请检查邮箱和密码是否正确。", "login.error.serverError": "There was a problem with authenticating: {{exception}}.", "register.error.serverError": "There was a problem with authenticating: {{exception}}.", "login.reset.notmatch": "新密码和重复密码不匹配", "register.error.match": "两次输入密码不一致", "register.error.agreement": "请先同意注册协议再完成注册", "file.bg.pageSize": "18", "scene.save.success.published": "场景已保存成功！", "scene.save.success.nopublish": "保存成功，还需要发布哦！", "scene.save.success.companyTpl": "成功生成企业样例", "scene.clear.success.companyTpl": "成功取消企业样例", "companytpl.setting.success": "成功生成企业模板", "scene.publish.success": "发布成功！", "account.success": "提交成功！", "branch.open.success": "账号打开成功！", "branch.close.success": "账号关闭成功！", "dept.create.success": "部门创建成功！", "scene.setting.success": "场景设置成功！", "data.assign.success": "分组成功！", "data.delete.success": "数据删除成功！", "group.delete.success": "分组删除成功！", "group.create.success": "分组创建成功！", "rel.tip": "您的账号还没有绑定邮箱，去用户中心->账号管理，马上绑定", "page.change.success": "页面名称修改成功！"}),b.module("services.notifications", []).factory("notifications", ["$rootScope", function (a) {
        var c = {STICKY: [], ROUTE_CURRENT: [], ROUTE_NEXT: []}, d = {}, e = function (a, c) {
            if (!b.isObject(c))throw new Error("Only object can be added to the notification service");
            return a.push(c), c
        };
        return a.$on("$routeChangeSuccess", function () {
            c.ROUTE_CURRENT.length = 0, c.ROUTE_CURRENT = b.copy(c.ROUTE_NEXT), c.ROUTE_NEXT.length = 0
        }), d.getCurrent = function () {
            return[].concat(c.STICKY, c.ROUTE_CURRENT)
        }, d.pushSticky = function (a) {
            return e(c.STICKY, a)
        }, d.pushForCurrentRoute = function (a) {
            return e(c.ROUTE_CURRENT, a)
        }, d.pushForNextRoute = function (a) {
            return e(c.ROUTE_NEXT, a)
        }, d.remove = function (a) {
            b.forEach(c, function (b) {
                var c = b.indexOf(a);
                c > -1 && b.splice(c, 1)
            })
        }, d.removeAll = function () {
            b.forEach(c, function (a) {
                a.length = 0
            })
        }, d
    }]),b.module("services.pagetpl", []),b.module("services.pagetpl").factory("pageTplService", ["$http", "$rootScope", "$modal", "$q", function (a, b, c, d) {
        var e = {};
        return e.getPageTpls = function (b) {
            var c = "?c=upfile&a=systag&type=1" + b, d = new Date;
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, e.getMyTplList = function (b) {
            var c = "/m/scene/pageList/" + b, d = new Date;
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({withCredentials: !0, method: "GET", url: PREFIX_URL + c})
        }, e.getPageTplTypes = function () {
            var b = "pageTplType.htm", c = new Date;
            return b += (/\?/.test(b) ? "&" : "?") + "time=" + c.getTime(), a({withCredentials: !0, method: "GET", url: PREFIX_URL + b})
        }, e.getPageTagLabel = function (b) {
            var c = "?c=upfile&a=systag&type=1";
            null != b && (c += (/\?/.test(c) ? "&" : "?") + "bizType=" + b);
            var d = new Date;
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, e.getPageTagLabelCheck = function (b) {
            var c = "/m/scene/tag/page/list?id=" + b, d = new Date;
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({withCredentials: !0, method: "GET", url: PREFIX_URL + c})
        }, e.getPageTplTypestemp = function (b, c) {
            var d = "?c=scene&a=syspagetpl", e = new Date;
            return null != b && (d += (/\?/.test(d) ? "&" : "?") + "tagId=" + b), null != c && (d += (/\?/.test(d) ? "&" : "?") + "bizType=" + c), d += (/\?/.test(d) ? "&" : "?") + "time=" + e.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + d})
        }, e.updataChildLabel = function (b, c) {
            var d = "/m/eqs/tag/page/set/?ids=" + b;
            null != c && (d += (/\?/.test(d) ? "&" : "?") + "pageId=" + c);
            var e = new Date;
            return d += (/\?/.test(d) ? "&" : "?") + "time=" + e.getTime(), a({withCredentials: !0, method: "POST", url: PREFIX_URL + d})
        }, e
    }]),b.module("services.sample", []).factory("sampleService", ["$rootScope", "$http", function (a, b) {
        var c = {};
        return c.getSamples = function (a, c, d) {
            var e = PREFIX_S1_URL + "?c=scene&a=promotion";
            return a && (e += "?type=" + a), c && (e += /\?/.test(e) ? "&" : "?", e += "pageNo=" + c), d && (e += /\?/.test(e) ? "&" : "?", e += "pageSize=" + d), e += (/\?/.test(e) ? "&" : "?") + "time=" + (new Date).getTime(), b({withCredentials: !0, method: "GET", url: e})
        }, c.getSamplesPV = function () {
            var a = PREFIX_S1_URL + "eqs/topThree?time=" + (new Date).getTime();
            return b({withCredentials: !0, method: "GET", url: a})
        }, c
    }]),b.module("services.scene", ["scene.create.console", "services.history", "services.select"]),b.module("services.scene").factory("sceneService", ["$http", "$rootScope", "$modal", "$q", "security", "$cacheFactory", "historyService", "selectService", "ModalService", function (a, c, d, e, f, g, h, i, j) {
        function k(a) {
            O.splice(O.indexOf(P[a]), 1), delete P[a]
        }

        function l(a) {
            N.obj.elements = a, $("#nr").empty(), M.parse({def: N.obj, appendTo: "#nr", mode: "edit"}), $("#editBG").hide();
            for (var b in a)if (3 == a[b].type) {
                $("#editBG").show();
                break
            }
            c.$broadcast("dom.changed")
        }

        function m(a) {
            P = {}, $.each(a, function (a, b) {
                P[b.id] = b
            })
        }

        function n(a, b) {
            var c = {}, d = $("#nr .edit_area"), e = d.children().last(), f = d.children(".maxIndex"), g = 0;
            if (g = f.length > 0 ? parseInt(f.css("z-index"), 10) + 1 : e.length > 0 ? parseInt(e.css("z-index"), 10) + 1 : 101, b)return b.zIndex = g, b;
            var h = e;
            return c = h.length <= 0 ? {top: "30px", left: "0px"} : h.position().top + h.outerHeight() > $("#nr .edit_area").outerHeight() - 10 ? {top: h.position().top, left: h.position().left + 10 + "px"} : {top: h.position().top + h.outerHeight() + 10 + "px", left: h.position().left + "px"}, c.zIndex = g, c
        }

        function o(a, b, c, d) {
            var e = parseInt(a.css.top, 10) + 34 * Q, f = parseInt(a.css.left, 10);
            e + 34 > $("#nr .edit_area").outerHeight() ? (b.css.top = e + "px", b.css.left = f + 10 + "px") : (b.css.top = e + 34 + "px", b.css.left = a.css.left, c == d && Q++)
        }

        function p() {
            for (var a = Math.ceil(1e3 * Math.random()), b = 0; b < O.length; b++)if (O[b].id == a)return p();
            return a
        }

        function q(a, b, c) {
            var d, e = p(), f = {};
            if (3 == ("" + a).charAt(0)) {
                if ($("#editBG:visible").length > 0) {
                    var g;
                    for (g = 0; g < O.length; g++)if (3 == O[g].type) {
                        f = O[g];
                        break
                    }
                    return f
                }
                f = {content: null, css: {}, id: e, num: 0, pageId: N.obj.id, properties: {bgColor: null, imgSrc: null}, sceneId: N.obj.sceneId, title: null, type: 3}
            }
            return 1 == ("" + a).charAt(0) && (f = {id: e, properties: {title: "提交"}, type: 1, pageId: N.obj.id, sceneId: N.obj.sceneId}), 8 == ("" + a).charAt(0) && (d = n(a, b), $.extend(!0, d, {color: "#676767", borderWidth: "1", borderStyle: "solid", borderColor: "#ccc", borderRadius: "5", backgroundColor: "#f9f9f9"}), f = {content: "", css: d, id: e, num: 1, pageId: N.obj.id, properties: {title: "一键拨号", number: ""}, sceneId: N.obj.sceneId, title: null, type: 8}), 2 == ("" + a).charAt(0) && (d = n(a, b), f = {content: "点击此处进行编辑", css: d, id: e, num: 1, pageId: N.obj.id, properties: {}, sceneId: N.obj.sceneId, title: null, type: 2}), 4 == ("" + a).charAt(0) && (d = n(a, b), d.width = "100px", d.height = "100px", f = {content: "", css: d, id: e, num: 1, pageId: N.obj.id, properties: {width: "100px", height: "100px", src: ""}, sceneId: N.obj.sceneId, title: null, type: 4}), 5 == ("" + a).charAt(0) && (d = n(a, b), $.extend(!0, d, {color: "#676767", borderWidth: "1", borderStyle: "solid", borderColor: "#ccc", borderRadius: "5", backgroundColor: "#f9f9f9"}), f = {content: "", css: d, id: e, num: 1, pageId: N.obj.id, properties: {placeholder: "请命名"}, isInput: 1, sceneId: N.obj.sceneId, title: "请命名", type: 5}), 6 == ("" + a).charAt(0) && (d = n(a, b), $.extend(!0, d, {color: "#676767", borderWidth: "1", borderStyle: "solid", borderColor: "#ccc", borderRadius: "5", backgroundColor: "#f9f9f9"}), f = {content: "", css: d, id: e, num: 1, pageId: N.obj.id, properties: {title: "提交"}, sceneId: N.obj.sceneId, title: null, type: 6}), "p" == a && (d = n(a, b), f = {content: "", css: d, id: e, num: 1, pageId: N.obj.id, properties: {title: "图集"}, sceneId: N.obj.sceneId, title: null, type: "p"}), "v" == a && (d = n(a, b), d.width = "48px", d.height = "48px", f = {content: "", css: d, id: e, num: 1, pageId: N.obj.id, properties: {src: ""}, sceneId: N.obj.sceneId, title: null, type: "v"}), c && $.extend(!0, f, c), O.push(f), P[f.id] = f, f
        }

        function r(a, b, d) {
            var e = M.wrapComp(b, "edit");
            $("#nr .edit_area").append(e);
            for (var f = M.getInterceptors(), g = 0; g < f.length; g++)f[g](e, b);
            M.getEventHandlers()[("" + a).charAt(0)](e, b), d || (h.addPageHistory(N.obj.id, N.obj.elements), c.$broadcast("dom.changed"))
        }

        function s(a, b) {
            var c = [];
            return"g101" == a && (c.push(T("501")), c.push(T("502")), c.push(T("503")), c.push(T("601"))), c
        }

        function t(a, b) {
            $(a).css("cursor", "text"), $(a).parents("li").hasClass("inside-active") || ($(a).bind("click", function (a) {
                a.stopPropagation()
            }), $(document).bind("mousedown", function (c) {
                $(a).css("cursor", "default"), $("#btn-toolbar").find("input[type=text][data-edit]").blur(), $("#btn-toolbar") && $("#btn-toolbar").remove(), $(a).unbind("click"), b.content = $(a).html(), $(a).parents("li").removeClass("inside-active").css("user-select", "none"), $(a).removeAttr("contenteditable"), $(document).unbind("mousedown")
            }), $(a).parents("li").addClass("inside-active").css("user-select", "initial"), c.$broadcast("text.click", a))
        }

        function u(a) {
            D(a, function (b) {
                a.properties.src = b.data;
                var c = b.width / b.height, d = $("#" + a.id);
                if (d.length > 0) {
                    var e = $("#inside_" + a.id).width(), f = $("#inside_" + a.id).height(), g = e / f;
                    c >= g ? (d.outerHeight(f), d.outerWidth(f * c), d.css("marginLeft", -(d.outerWidth() - e) / 2), d.css("marginTop", 0)) : (d.outerWidth(e), d.outerHeight(e / c), d.css("marginTop", -(d.outerHeight() - f) / 2), d.css("marginLeft", 0)), d.attr("src", PREFIX_FILE_HOST + b.data), a.properties.imgStyle = {}, a.properties.imgStyle.width = d.outerWidth(), a.properties.imgStyle.height = d.outerHeight(), a.properties.imgStyle.marginTop = d.css("marginTop"), a.properties.imgStyle.marginLeft = d.css("marginLeft")
                } else b.width > $("#nr .edit_area").width() && (b.width = $("#nr .edit_area").width(), b.height = b.width / c), b.height > $("#nr .edit_area").height() && (b.height = $("#nr .edit_area").height(), b.width = b.height * c), a.css.width = b.width, a.css.height = b.height, a.properties.imgStyle = {}, a.properties.imgStyle.width = b.width, a.properties.imgStyle.height = b.height, a.properties.imgStyle.marginTop = "0", a.properties.imgStyle.marginLeft = "0", r(a.type, a)
            }, function () {
                a.properties.src || k(a.id)
            })
        }

        function v(a) {
            d.open({windowClass: "console", templateUrl: "scene/console/button.tpl.html", controller: "ButtonConsoleCtrl", resolve: {obj: function () {
                return a
            }}}).result.then(function (b) {
                a.properties.title = b.title;
                var c = b.title.replace(/ /g, "&nbsp;");
                $("#" + a.id).html(c)
            })
        }

        function w(a) {
            U || (U = d.open({windowClass: "console", templateUrl: "scene/console/tel.tpl.html", controller: "TelConsoleCtrl", resolve: {obj: function () {
                return a
            }}}).result.then(function (b) {
                U = null, a.properties.title = b.title, a.properties.number = b.number;
                b.title.replace(/ /g, "&nbsp;");
                $.extend(!0, a.css, b.btnStyle), $("#" + a.id).length > 0 && $("#" + a.id).parents("li").remove(), r(a.type, a)
            }, function () {
                U = null, $("#" + a.id).length || k(a.id)
            }))
        }

        function x(a) {
            U || (U = d.open({windowClass: "console", templateUrl: "scene/console/input.tpl.html", controller: "InputConsoleCtrl", resolve: {obj: function () {
                return a
            }}}).result.then(function (b) {
                U = null, b.type && (a.type = b.type), a.properties.placeholder = b.title, a.properties.required = b.required, a.title = b.title, $("#" + a.id).length > 0 ? ($("#" + a.id).attr("placeholder", b.title), $("#" + a.id).attr("required", b.required)) : r(a.type, a)
            }, function () {
                U = null, $("#" + a.id).length || k(a.id)
            }))
        }

        function y(a) {
            U || (U = d.open({windowClass: "console", backdrop: "static", templateUrl: "scene/console/pictures.tpl.html", controller: "picturesCtrl", resolve: {obj: function () {
                return a
            }}}).result.then(function (b) {
                U = null, a.properties = b;
                var c = $("#inside_" + a.id);
                c.length && c.remove(), r(a.type, a)
            }, function () {
                U = null, $("#" + a.id).length || k(a.id)
            }))
        }

        function z(a) {
            U || (U = d.open({windowClass: "console", templateUrl: "scene/console/video.tpl.html", controller: "VideoCtrl", resolve: {obj: function () {
                return a
            }}}).result.then(function (b) {
                U = null, a.properties.src = b, $("#" + a.id).length || r(a.type, a)
            }, function () {
                U = null, $("#" + a.id).length || k(a.id)
            }))
        }

        function A(a) {
            d.open({windowClass: "console", templateUrl: "scene/console/microweb.tpl.html", controller: "MicroConsoleCtrl", resolve: {obj: function () {
                return a.properties.labels || (a.properties.labels = [
                    {id: 1, title: "栏目一", color: {backgroundColor: "#23A3D3", color: ""}, link: ""},
                    {id: 2, title: "栏目二", color: {backgroundColor: "#23A3D3", color: ""}, link: ""}
                ]), a
            }}}).result.then(function (c) {
                $("#" + a.id).length > 0 ? (a.properties.labels = [], b.forEach(c, function (b, c) {
                    delete b.selected, delete b.mousedown, delete b.$$hashKey, a.properties.labels.push(b)
                }), $("#" + a.id).parents("li").remove(), r(a.type, a)) : (a.css = {left: "0px", width: "100%", bottom: "0px", height: "50px", zIndex: 999}, a.properties.labels = [], b.forEach(c, function (b, c) {
                    delete b.selected, delete b.mousedown, delete b.$$hashKey, a.properties.labels.push(b)
                }), position = null, r(a.type, a))
            }, function () {
                $("#" + a.id).length || k(a.id), console.log(a)
            })
        }

        function B(a) {
            D(a, function (b) {
                var c = $("#nr .edit_area").parent()[0];
                if ("imgSrc" == b.type) {
                    var d = b.data;
                    c.style.backgroundImage = "url(" + PREFIX_FILE_HOST + d + ")", a.properties.bgColor = null, a.properties.imgSrc = d
                }
                "backgroundColor" == b.type && (c.style.backgroundImage = "none", c.style.backgroundColor = b.color, a.properties.imgSrc = null, a.properties.bgColor = b.color), h.addPageHistory(N.obj.id, N.obj.elements), $("#editBG").unbind("click"), $("#editBG").show().bind("click", function () {
                    B(a)
                })
            }, function () {
            })
        }

        function C() {
            U || (U = d.open({windowClass: "console", templateUrl: "scene/console/audio.tpl.html", controller: "AudioConsoleCtrl", resolve: {obj: function () {
                return N.obj.scene.image && N.obj.scene.image.bgAudio ? N.obj.scene.image.bgAudio : {}
            }}}).result.then(function (a) {
                U = null, "bgAudio" == a.compType && (N.obj.scene.image || (N.obj.scene.image = {}), N.obj.scene.image.bgAudio = a.bgAudio)
            }, function () {
                U = null
            }))
        }

        function D(a, b, c) {
            if (!U) {
                var e = "0";
                3 == a.type && (e = "0"), 4 == a.type && (e = "1"), U = d.open({windowClass: "console img_console", templateUrl: "scene/console/bg.tpl.html", controller: "BgConsoleCtrl", resolve: {obj: function () {
                    return{fileType: e, elemDef: a}
                }}}).result.then(function (a) {
                    U = null, b(a)
                }, function (a) {
                    U = null, c(a)
                })
            }
        }

        function E(a, b, d) {
            L.currentElemDef = a, c.$broadcast("showStylePanel", {activeTab: "style"})
        }

        function F(a, b, d) {
            L.currentElemDef = a, c.$broadcast("showStylePanel", {activeTab: "anim"})
        }

        function G(a, b, d) {
            L.currentElemDef = a, V = c.$broadcast("showCropPanel", a)
        }

        function H(a) {
            a.sceneId = N.obj.sceneId, d.open({windowClass: "console", templateUrl: "scene/console/link.tpl.html", controller: "LinkConsoleCtrl", resolve: {obj: function () {
                return a
            }}}).result.then(function (b) {
                b && "http://" != b ? (isNaN(b) ? a.properties.url = PREFIX_S1_URL + "index-jumpgo?id=" + a.sceneId + "&url=" + encodeURIComponent(b) : (a.properties.url = b, console.log(b)), $("#inside_" + a.id).find(".fa-link").removeClass("fa-link").addClass("fa-anchor")) : (delete a.properties.url, $("#inside_" + a.id).find(".fa-anchor").removeClass("fa-anchor").addClass("fa-link"))
            })
        }

        var I, J, K, L = {}, M = eqShow.templateParser("jsonParser"), N = null, O = null, P = {}, Q = ($("#nr .edit_area"), 0), R = !1;
        L.historyBack = function () {
            h.canBack(N.obj.id) && (O = h.back(N.obj.id), m(O), l(O))
        }, L.historyForward = function () {
            h.canForward(N.obj.id) && (O = h.forward(N.obj.id), m(O), l(O))
        };
        var S = L.createCompGroup = function (a, b) {
            for (var d = s(a), e = 0; e < d.length; e++) {
                var f = q(d[e].type, b, d[e]);
                b = null, r(d[e].type, f, !0)
            }
            h.addPageHistory(N.obj.id, N.obj.elements), c.$broadcast("dom.changed")
        }, T = function (a, b) {
            var c;
            return"501" == a && (c = {properties: {placeholder: "姓名"}, title: "姓名", type: 501}), "502" == a && (c = {properties: {placeholder: "手机"}, title: "手机", type: 502}), "503" == a && (c = {properties: {placeholder: "邮箱"}, title: "邮箱", type: 503}), "601" == a && (c = {properties: {title: "提交"}, type: 601}), c
        };
        L.createComp = function (a, b) {
            var c;
            if ("g" == ("" + a).charAt(0))return void S(a, b);
            if ("9" == ("" + a).charAt(0))return void C();
            if (1 == a)return $(".comp_title").length > 0 ? void alert("已存在一个标签") : (c = q(a, b), void A(c));
            if (c = q(a, b), 4 == a)return void u(c);
            if (5 == a)return void x(c);
            if (8 == a)return void w(c);
            if ("p" == a)return void y(c);
            if ("v" == a)return void z(c);
            if (3 == a)B(c); else {
                r(a, c)
            }
        }, L.updateCompPosition = function (a, b, d) {
            for (var e = 0; e < O.length; e++)"inside_" + O[e].id == a && (O[e].css ? (O[e].css.left = b.left, O[e].css.top = b.top, d || h.addPageHistory(N.obj.id, O)) : (O[e].css = b, d || h.addPageHistory(N.obj.id, O)));
            c.$apply()
        }, L.updateCompAngle = function (a, b) {
            for (var d = 0; d < O.length; d++)"inside_" + O[d].id == a && (O[d].css ? O[d].css.transform = "rotateZ(" + b + "deg)" : O[d].css = {}, h.addPageHistory(N.obj.id, O));
            c.$apply()
        }, L.setCopy = function (a) {
            R = a, c.$broadcast("copyState.update", a)
        }, L.getCopy = function () {
            return R
        }, L.getPageNames = function (b) {
            var c = "?c=scene&a=pageList&id=" + b + "?date=" + (new Date).getTime();
            return a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, L.changePageSort = function (b, c) {
            var d = "?c=page&a=pageSort&id=" + c + "&pos=" + b + "&date=" + (new Date).getTime();
            return a({withCredentials: !0, method: "GET", url: JSON_URL + d})
        }, L.updateCompSize = function (a, b) {
            for (var d = 0; d < O.length; d++)"inside_" + O[d].id == a && (O[d].css || (O[d].css = {}), O[d].css.width = b.width, O[d].css.height = b.height, O[d].css.top = b.top, O[d].css.left = b.left, O[d].properties.width = b.width, O[d].properties.height = b.height, b.imgStyle && (O[d].properties.imgStyle = b.imgStyle), h.addPageHistory(N.obj.id, O));
            c.$apply()
        }, L.savePageNames = function (b) {
            var c = "?c=page&a=savePageName", d = {id: b.id, sceneId: b.sceneId, name: b.name};
            return a({withCredentials: !0, method: "POST", url: JSON_URL + c, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}, data: $.param(d)})
        }, L.resetCss = function () {
            $("#nr .edit_area li").each(function (a, b) {
                var c = P[b.id.replace(/inside_/g, "")];
                c && (c.css || (c.css = {}), c.css.zIndex = b.style.zIndex ? b.style.zIndex : "0")
            })
        }, L.copyElement = function () {
            Q = 0, K = N.obj.id;
            var a = i.getElements(), c = [];
            $.each(a, function (a, b) {
                c.push(P[b])
            }), I = b.copy(c), J = b.copy(c), L.setCopy(!0)
        }, L.pasteElement = function () {
            for (var a = 0, d = 0; d < I.length; d++) {
                I[d].pageId = N.obj.id, I[d].id = p(), K == I[d].pageId ? (a++, o(J[d], I[d], a, I.length)) : (Q = 0, I[d].css = b.copy(J[d].css));
                var e = b.copy(I[d]);
                O.push(e), P[e.id] = e, r(e.type, e, !0)
            }
            K = N.obj.id, h.addPageHistory(N.obj.id, N.obj.elements), c.$broadcast("dom.changed")
        };
        var U = null, V = null;
        return M.addInterceptor(function (a, b, d) {
            function e() {
                var d = $('<ul id="popMenu" class="dropdown-menu" style="min-width: 100px; display: block;" role="menu" aria-labelledby="dropdownMenu1"><li class="edit" role="presentation"><a role="menuitem" tabindex="-1"><div class="glyphicon glyphicon-edit" style="color: #08a1ef;"></div>&nbsp;&nbsp;编辑</a></li><li class="style" role="presentation"><a role="menuitem" tabindex="-1"><div class="fa fa-paint-brush" style="color: #08a1ef;"></div>&nbsp;&nbsp;样式</a></li><li class="animation" role="presentation"><a role="menuitem" tabindex="-1"><div class="fa fa-video-camera" style="color: #08a1ef;"></div>&nbsp;&nbsp;动画</a></li><li class="link" role="presentation"><a role="menuitem" tabindex="-1"><div class="fa fa-link" style="color: #08a1ef;"></div>&nbsp;&nbsp;链接</a></li><li class="copy" role="presentation" style="margin-bottom:5px;"><a role="menuitem" tabindex="-1"><div class="fa fa-copy" style="color: #08a1ef;"></div>&nbsp;&nbsp;复制</a></li><li class="cut" role="presentation" style="margin-bottom:5px;"><a role="menuitem" tabindex="-1"><div class="fa fa-cut" style="color: #08a1ef;"></div>&nbsp;&nbsp;裁剪</a></li><li role="presentation" class="bottom_bar"><a title="上移一层"><div class="up" style="display: inline-block; width: 26px;height: 22px; background: url(http://static.parastorage.com/services/skins/2.1127.3/images/wysiwyg/core/themes/editor_web/button/fpp-buttons-icons4.png) 0px -26px no-repeat;"></div></a><a title="下移一层"><div class="down" style="display: inline-block; width: 26px;height: 22px; background: url(http://static.parastorage.com/services/skins/2.1127.3/images/wysiwyg/core/themes/editor_web/button/fpp-buttons-icons4.png) 0px -80px no-repeat;"></div></a><a title="删除"><div class="remove" style="display: inline-block; width: 26px;height: 22px; background: url(http://static.parastorage.com/services/skins/2.1127.3/images/wysiwyg/core/themes/editor_web/button/fpp-buttons-icons4.png) 0px -1px no-repeat;"></div></a></li></ul>').css({position: "absolute", "user-select": "none"});
                return R && d.find(".copy").after($('<li class="paste" role="presentation"><a role="menuitem" tabindex="-1"><div class="fa fa-paste" style="color: #08a1ef;"></div>&nbsp;&nbsp;粘贴</a></li>')), d.find(".edit").click(function (c) {
                    switch (c.stopPropagation(), b.type.toString().charAt(0)) {
                        case"1":
                            break;
                        case"2":
                            t(a.find(".element").get(0), b);
                            break;
                        case"3":
                            break;
                        case"4":
                            u(b);
                            break;
                        case"5":
                            x(b);
                            break;
                        case"6":
                            v(b);
                            break;
                        case"7":
                            break;
                        case"8":
                            w(b);
                            break;
                        case"9":
                            break;
                        case"g":
                            break;
                        case"p":
                            y(b);
                            break;
                        case"v":
                            z(b)
                    }
                    d.hide()
                }), d.find(".style").click(function (c) {
                    c.stopPropagation(), E(b, function (c) {
                        if (1 == b.type)for (var d in b.properties.labels)c.backgroundColor && (b.properties.labels[d].color.backgroundColor = c.backgroundColor, $(".label_content").css("background-color", c.backgroundColor)), c.color && (b.properties.labels[d].color.color = c.color, $(".label_content").css("color", c.color)); else $(".element-box", a).css(c), $.extend(!0, b.css, c)
                    }), d.hide()
                }), d.find(".animation").click(function (a) {
                    a.stopPropagation(), F(b, function (a) {
                        b.properties.anim = a
                    }), d.hide()
                }), d.find(".link").click(function (a) {
                    a.stopPropagation(), H(b), d.hide()
                }), d.find(".remove").click(function (e) {
                    e.stopPropagation();
                    var f = function () {
                        h.addPageHistory(N.obj.id, O), a.remove(), k(b.id), h.addPageHistory(N.obj.id, O), INTERVAL_OBJ[b.id] && (clearInterval(INTERVAL_OBJ[b.id]), delete INTERVAL_OBJ[b.id]), d.hide(), c.$apply(), c.$broadcast("hideStylePanel")
                    };
                    "5" == (b.type + "").charAt(0) ? j.openConfirmDialog({msg: "将删除已收集的数据!", confirmName: "删除", cancelName: "取消"}, function () {
                        f()
                    }) : f()
                }), d.find(".down").click(function (c) {
                    var d = a.prev();
                    if (!(d.length <= 0)) {
                        var e = a.css("zIndex");
                        a.css("zIndex", d.css("zIndex")), d.css("zIndex", e), d.before(a);
                        for (var f = 0; f < O.length; f++)if (O[f].id == b.id && f > 0) {
                            var g = O[f].css.zIndex;
                            O[f].css.zIndex = O[f - 1].css.zIndex, O[f - 1].css.zIndex = g;
                            break
                        }
                    }
                }), d.find(".up").click(function (c) {
                    var d = a.next();
                    if (!(d.length <= 0)) {
                        var e = a.css("zIndex");
                        a.css("zIndex", d.css("zIndex")), d.css("zIndex", e), d.after(a);
                        for (var f = 0; f < O.length; f++)if (O[f].id == b.id && f < O.length - 1) {
                            var g = O[f].css.zIndex;
                            O[f].css.zIndex = O[f + 1].css.zIndex, O[f + 1].css.zIndex = g;
                            break
                        }
                    }
                }), d.find(".copy").click(function (a) {
                    a.stopPropagation(), $(".modal-dialog")[0] || L.copyElement(), d.hide()
                }), d.find(".paste").click(function (a) {
                    a.stopPropagation(), $(".modal-dialog")[0] || L.pasteElement(), d.hide()
                }), d.find(".cut").click(function (a) {
                    a.stopPropagation(), G(b), d.hide()
                }), 4 != b.type && (d.find(".link").hide(), d.find(".cut").hide()), "p" == b.type && (d.find(".animation").hide(), d.find(".style").hide()), d
            }

            if ("view" != d) {
                var f = $("#eq_main");
                a.on("click contextmenu", ".element-box", function (a) {
                    if (a.stopPropagation(), "none" != $(".select-panel").css("display"))return!1;
                    $("#comp_setting:visible").length > 0 && "p" != b.type && (L.currentElemDef = b, c.$broadcast("showStylePanel"));
                    var d = e(), g = $("#popMenu");
                    return g.length > 0 && g.remove(), f.append(d), d.css({left: a.pageX + f.scrollLeft() + 15, top: a.pageY + f.scrollTop()}).show(), f.mousemove(function (a) {
                        d = $("#popMenu"), (a.pageX < d.offset().left - 20 || a.pageX > d.offset().left + d.width() + 20 || a.pageY < d.offset().top - 20 || a.pageY > d.offset().top + d.height() + 20) && (d.hide(), $(this).unbind("mousemove"))
                    }), !1
                }), a.attr("title", "按住鼠标进行拖动，点击鼠标进行编辑")
            }
        }), M.bindEditEvent("1", function (a, b) {
            $(a).unbind("dblclick"), $(a).show().bind("dblclick", function () {
                A(b)
            })
        }), M.bindEditEvent("2", function (a, b) {
            var c = $(".element", a)[0];
            $(c).mousedown(function (a) {
                $(this).parents("li").hasClass("inside-active") && a.stopPropagation()
            }), $(c).bind("contextmenu", function (a) {
                $(this).parents("li").hasClass("inside-active") ? a.stopPropagation() : $(this).blur()
            }), c.addEventListener("dblclick", function (a) {
                t(c, b), $("#popMenu").hide(), a.stopPropagation()
            })
        }), M.bindEditEvent("3", function (a, b) {
            $("#editBG").unbind("click"), $("#editBG").show().bind("click", function () {
                B(b)
            })
        }), M.bindEditEvent("v", function (a, b) {
            var c = $(".element", a)[0];
            $(c).unbind("dblclick"), $(c).bind("dblclick", function () {
                z(b), $("#popMenu").hide()
            })
        }), M.bindEditEvent("4", function (a, b) {
            var c = $(".element", a)[0];
            $(c).unbind("dblclick"), $(c).bind("dblclick", function () {
                u(b), $("#popMenu").hide()
            })
        }), M.bindEditEvent("5", function (a, b) {
            var c = $(".element", a)[0];
            $(c).unbind("dblclick"), $(c).bind("dblclick", function () {
                x(b), $("#popMenu").hide()
            })
        }), M.bindEditEvent("p", function (a, b) {
            var c = $(".element", a)[0];
            $(c).unbind("dblclick"), $(c).bind("dblclick", function () {
                y(b), $("#popMenu").hide()
            })
        }), M.bindEditEvent("6", function (a, b) {
            var c = $(".element", a)[0];
            $(c).unbind("dblclick"), $(c).bind("dblclick", function () {
                v(b), $("#popMenu").hide()
            })
        }), M.bindEditEvent("8", function (a, b) {
            var c = $(".element", a)[0];
            $(c).unbind("dblclick"), $(c).bind("dblclick", function () {
                w(b), $("#popMenu").hide()
            })
        }), M.bindEditEvent("7", function (a, b) {
            var c = $(".element", a)[0];
            c.addEventListener("click", function (a) {
                U || d.open({windowClass: "", templateUrl: "scene/console/map.tpl.html", controller: "MapConsoleCtrl"}).result.then(function (a) {
                    var c = new BMap.Map("map_" + b.id);
                    c.clearOverlays();
                    var d = new BMap.Point(a.lng, a.lat), e = new BMap.Marker(d);
                    c.addOverlay(e);
                    var f = new BMap.Label(a.address, {offset: new BMap.Size(20, -10)});
                    e.setLabel(f), c.centerAndZoom(d, 12), b.properties.pointX = a.lng, b.properties.pointY = a.lat, b.properties.x = a.lng, b.properties.y = a.lat, b.properties.markTitle = a.address
                })
            })
        }), L.templateEditor = M, L.getTplById = function (b) {
            var c = "m/scene/select?id=" + b, d = new Date;
            return c += "&time=" + d.getTime(), a({withCredentials: !0, method: "GET", url: PREFIX_URL + c})
        }, L.createByTpl = function (b) {
            //var c = PREFIX_URL + "m/scene/createByTpl";
            var c = JSON_URL + "?c=scene&a=createBySys";
            return a({withCredentials: !0, method: "POST", url: c, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}, data: $.param(b)})
        }, L.getSceneDetail = function (b, c) {
            //var d = "m/scene/detail/" + b;
            var d = "?c=scene&a=detail&id=" + b;
            return c && (d += (/\?/.test(d) ? "&" : "?") + "user=" + c), a({withCredentials: !0, method: "GET", url: JSON_URL + d})
        }, L.saveSceneSettings = function (b) {
            //var c = "m/scene/saveSettings";
            var c = "?c=scene&a=saveSettings";
            return a({withCredentials: !0, method: "POST", url: JSON_URL + c, headers: {"Content-Type": "text/plain; charset=UTF-8"}, data: JSON.stringify(b)})
        }, L.publishScene = function (b) {
            //var c = "m/scene/publish?id=" + b, d = new Date;
            var c = "?c=scene&a=publish&id=" + b, d = new Date;
            return c += "&time=" + d.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, L.closeScene = function (b) {
            //var c = "/m/scene/off?id=" + b, d = new Date;
            var c = "?c=scene&a=off&id=" + b, d = new Date;
            return c += "&time=" + d.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, L.openScene = function (b) {
            //var c = "/m/scene/on?id=" + b, d = new Date;
            var c = "?c=scene&a=on&id=" + b, d = new Date;
            return c += "&time=" + d.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, L.createBlankScene = function (b, c, d) {
            var e = {name: b, type: c, pageMode: d}, f = "?c=scene&a=create";
            return a({withCredentials: !0, method: "POST", url: JSON_URL + f, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}, data: $.param(e)})
        }, L.copySceneById = function (b) {
            //var c = "m/scene/copyScene?id=" + b;
            var c = "?c=scene&a=createByCopy&id=" + b;
            return a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, L.deleteSceneById = function (b) {
            //var c = "m/scene/delete?id=" + b;
            var c = "?c=scene&a=delscene&id=" + b;
            return a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, L.getCoverImages = function () {
            //var b = "m/base/file/list?bizType=99&fileType=1&time=" + (new Date).getTime();
            var b = "?c=upfile&a=userlist&bizType=99&fileType=1&time=" + (new Date).getTime();
            return a({withCredentials: !0, method: "GET", url: JSON_URL + b})
        }, L.getSceneByPage = function (b, c, d) {
            var f = "";
            c || d ? (f = "?c=scene&a=createPage&id=" + b, d && (f += "&copy=true")) : f = "?c=scene&a=design&id=" + b;
            var g = e.defer(), h = new Date;
            return f += (/\?/.test(f) ? "&" : "?") + "time=" + h.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + f}).then(function (a) {
                g.resolve(a), N = a.data, N.obj.elements || (N.obj.elements = []), O = N.obj.elements;
                for (var b = 0; O && b < O.length; b++)P[O[b].id] = O[b]
            }, function (a) {
                g.reject(a)
            }), g.promise
        }, L.previewSceneTpl = function (b) {
            var c = "?c=scene&a=syspageinfo&id=" + b, d = (e.defer(), new Date);
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, L.recordTplUsage = function (b) {
            var c = "?c=scene&a=usepage&id=" + b;
            return a({withCredentials: !0, method: "POST", url: JSON_URL + c})
        }, L.getSceneTpl = function (b) {
            var c = g.get("tplCache") ? g.get("tplCache") : g("tplCache"), d = e.defer();
            if (c.get(b)) {
                var f = $.extend(!0, {}, c.get(b));
                f.data.obj.scene && f.data.obj.scene.image && f.data.obj.scene.image.bgAudio && (N.obj.scene.image || (N.obj.scene.image = {}), N.obj.scene.image.bgAudio = f.data.obj.scene.image.bgAudio);
                for (var h = 0; h < f.data.obj.elements.length; h++) {
                    var i = f.data.obj.elements[h];
                    i.id = Math.ceil(100 * Math.random()), i.sceneId = N.obj.sceneId, i.pageId = N.obj.id
                }
                O = f.data.obj.elements;
                for (var j = 0; j < O.length; j++)P[O[j].id] = O[j];
                d.resolve(f)
            } else {
                var k = "?c=scene&a=syspageinfo&id=" + b, l = new Date;
                k += (/\?/.test(k) ? "&" : "?") + "time=" + l.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + k}).then(function (a) {
                    c.put(a.data.obj.id, $.extend(!0, {}, a)), a.data.obj.scene && a.data.obj.scene.image && a.data.obj.scene.image.bgAudio && (N.obj.scene.image || (N.obj.scene.image = {}), N.obj.scene.image.bgAudio = a.data.obj.scene.image.bgAudio);
                    for (var b = 0; b < a.data.obj.elements.length; b++) {
                        var e = a.data.obj.elements[b];
                        e.id = Math.ceil(100 * Math.random()), e.sceneId = N.obj.sceneId, e.pageId = N.obj.id
                    }
                    O = a.data.obj.elements;
                    for (var f = 0; f < O.length; f++)P[O[f].id] = O[f];
                    d.resolve(a)
                }, function (a) {
                    d.reject(a)
                })
            }
            return d.promise
        }, L.saveScene = function (b) {
            var c = "?c=scene&a=savepage";
            return a({withCredentials: !0, method: "POST", url: JSON_URL + c, headers: {"Content-Type": "text/plain; charset=UTF-8"}, data: JSON.stringify(b)})
        }, L.deletePage = function (b) {
            var c = "?c=scene&a=delPage&id=" + b;
            return a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, L.getBgImages = function (b) {
            var c = "m/scene/gallery/" + b, d = new Date;
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + c})
        }, L.createCustomComp = T, L.openAudioModal = C, L.getElements = function () {
            return O
        }, L.getElementsMap = function () {
            return P
        }, L.deleteElement = k, L.getSceneObj = function () {
            return N
        }, L.getTpls = function (b, c, d, e) {
            var f = "?c=scene&a=syslist";
            null != b && (f += (/\?/.test(f) ? "&" : "?") + "sceneType=" + b), f += (/\?/.test(f) ? "&" : "?") + "pageNo=" + (c ? c : 1), f += (/\?/.test(f) ? "&" : "?") + "pageSize=" + (d ? d : 12), e && (f += (/\?/.test(f) ? "&" : "?") + "orderBy=" + e);
            var g = new Date;
            return f += (/\?/.test(f) ? "&" : "?") + "time=" + g.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + f})
        }, L.getSceneType = function () {
            var b = "?c=statics&a=typelist";
            return a({withCredentials: !0, method: "GET", url: JSON_URL + b})
        }, L.getCompanyTpls = function (b, c) {
            var d = "/m/scene/tpl/company/list?pageNo=" + b + "&pageSize=" + c;
            return a({withCredentials: !0, method: "GET", url: PREFIX_URL + d})
        }, L.createCompanyTpls = function (b) {
            var c = "/m/scene/tpl/company/set?id=" + b;
            return a({withCredentials: !0, method: "POST", url: PREFIX_URL + c})
        }, L.clearCompanyTpls = function (b) {
            var c = "/m/scene/tpl/company/unset?id=" + b;
            return a({withCredentials: !0, method: "POST", url: PREFIX_URL + c})
        }, L.getPageTpls = function (b, c, d, e, f, g) {
            var h = "?c=scene&a=syslist";
            b && (h += (/\?/.test(h) ? "&" : "?") + "tplType=1"), c && (h += (/\?/.test(h) ? "&" : "?") + "bizType=" + c), d && (h += (/\?/.test(h) ? "&" : "?") + "tagId=" + d), g && (h += (/\?/.test(h) ? "&" : "?") + "orderBy=" + g);
            var i = new Date;
            return h += (/\?/.test(h) ? "&" : "?") + "pageNo=" + (e ? e : 1), h += (/\?/.test(h) ? "&" : "?") + "pageSize=" + (f ? f : 12), h += (/\?/.test(h) ? "&" : "?") + "time=" + i.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + h})
        }, L.getPageTplTypesTwo = function (b, c) {
            var d = "?c=upfile&a=systag&type=2&bizType=" + c, e = new Date;
            return d += (/\?/.test(d) ? "&" : "?") + "time=" + e.getTime(), a({withCredentials: !0, method: "GET", url: JSON_URL + d})
        }, L.saveMyTpl = function (b) {
            var c = '?c=user&a=saveMyTpl';
            return a({withCredentials: !0, method: "POST", url: JSON_URL + c, headers: {"Content-Type": "text/plain; charset=UTF-8"}, data: JSON.stringify(b)})
        }, L.saveCompanyTpl = function (b) {
            var c = "m/scene/page/companytpl/save";
            return a({withCredentials: !0, method: "POST", url: PREFIX_URL + c, headers: {"Content-Type": "text/plain; charset=UTF-8"}, data: JSON.stringify(b)})
        }, L.previewScene = function (b) {
            var c = "?c=user&a=getMyTpl&id=" + b, d = new Date;
            c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime();
            var f = e.defer();
            return a({withCredentials: !0, method: "GET", url: JSON_URL + c}).then(function (a) {
                for (var b = g.get("tplCache") ? g.get("tplCache") : g("tplCache"), c = 0; c < a.data.list.length; c++) {
                    var d = {data: {obj: {elements: a.data.list[c].elements, scene: a.data.obj}}};
                    b.put(a.data.list[c].id, $.extend(!0, {}, d))
                }
                f.resolve(a)
            }), f.promise
        }, L.transferScene = function (b, c) {
            var d = PREFIX_URL + "m/scene/transfer";
            return d += "?loginName=" + c, d += "&id=" + b, d += "&time=" + (new Date).getTime(), a({withCredentials: !0, method: "POST", url: d})
        }, L
    }]),b.module("services.select", []).factory("selectService", ["$rootScope", function (a) {
        var b = {}, c = [];
        return b.addElement = function (b) {
            c.indexOf(b) >= 0 || (c.push(b), c.length > 1 && a.$broadcast("select.more"))
        }, b.deleteElement = function (b) {
            var d = c.indexOf(b);
            0 > d || (c.splice(d, 1), c.length <= 1 && a.$broadcast("select.less"))
        }, b.clearElements = function () {
            c = [], a.$broadcast("select.less")
        }, b.getElements = function () {
            return c
        }, b
    }]),b.module("services.spread", []),b.module("services.spread").factory("SpreadService", ["$http", function (a) {
        var b = {};
        return b.getDataBySceneId = function (b, c, d, e, f, g) {
            var h = "m/scene/stat?id=" + b;
            g && (h += (/\?/.test(h) ? "&" : "?") + "user=" + g), c && (h += "&startDate=" + c), d && (h += "&endDate=" + d), e && (h += "&pageSize=" + e), f && (h += "&pageNo=" + f);
            var i = new Date;
            return h += "&time=" + i.getTime(), a({withCredentials: !0, method: "GET", url: PREFIX_URL + h})
        }, b.getActivities = function () {
            var b = new Date;
            return a({withCredentials: !0, method: "GET", url: PREFIX_URL + "m/u/promotion/list?type=pc&time=" + b.getTime()})
        }, b.getActivityDetail = function (b) {
            var c = new Date;
            return a({withCredentials: !0, method: "GET", url: PREFIX_URL + "promotion-code.htm?code=" + b + "&time=" + c.getTime()})
        }, b
    }]),b.module("services.usercenter", []).factory("usercenterService", ["$http", function (a) {
        var b = {};
        return b.getUserInfo = function () {
            var b = PREFIX_URL + "m/u/info";
            return b += "?time=" + (new Date).getTime(), a({withCredentials: !0, method: "GET", url: b})
        }, b.getCompanyScale = function () {
            var b = PREFIX_URL + "/base/class/company_scale";
            return b += "?time=" + (new Date).getTime(), a({withCredentials: !0, method: "GET", url: b})
        }, b.getCompanyIndustry = function () {
            var b = PREFIX_URL + "/base/class/company_industry";
            return b += "?time=" + (new Date).getTime(), a({withCredentials: !0, method: "GET", url: b})
        }, b.getCompanyInfo = function () {
            var b = PREFIX_URL + "m/u/company/info";
            return b += "?time=" + (new Date).getTime(), a({withCredentials: !0, method: "GET", url: b})
        }, b.saveCompanyInfo = function (b) {
            var c = PREFIX_URL + "m/u/company/save";
            return a({withCredentials: !0, method: "POST", url: c, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}, data: $.param(b)})
        }, b.saveUserInfo = function (b) {
            var c = PREFIX_URL + "m/u/save";
            return a({withCredentials: !0, method: "POST", url: c, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}, data: $.param(b)})
        }, b.getUserXd = function () {
            var b = PREFIX_URL + "m/u/xd";
            return b += "?time=" + (new Date).getTime(), a({withCredentials: !0, method: "GET", url: b})
        }, b.getgiveXd = function (b) {
            var c = PREFIX_URL + "m/u/giveXd";
            return c += "?toUser=" + b.toUser, c += "&xdCount=" + b.xdCount, c += "&time=" + (new Date).getTime(), a({withCredentials: !0, method: "POST", url: c})
        }, b.getXdlog = function (b, c) {
            var d = PREFIX_URL + "m/u/xdlog?pageNo=" + b + "&pageSize=" + c;
            return d += "?time=" + (new Date).getTime(), a({withCredentials: !0, method: "POST", url: d})
        }, b.getXdStat = function () {
            var b = PREFIX_URL + "m/u/xdStat";
            return b += "?time=" + (new Date).getTime(), a({withCredentials: !0, method: "GET", url: b})
        }, b.relAccount = function (b, c, d) {
            var e = PREFIX_URL + "eqs/bindAccount?relUser=" + b + "&loginName=" + c + "&loginPassword=" + d;
            return e += "&time=" + (new Date).getTime(), a({withCredentials: !0, method: "POST", url: e, headers: {"Content-Type": "text/plain; charset=UTF-8"}})
        }, b.setRead = function (b) {
            var c = PREFIX_URL + "m/u/markRead?ids=" + b;
            return c += "&time=" + (new Date).getTime(), a({withCredentials: !0, method: "POST", url: c, headers: {"Content-Type": "text/plain; charset=UTF-8"}})
        }, b.getNewMessage = function (b, c, d) {
            var e = JSON_URL + "?c=statics&a=all&line=7248&pageNo=" + b + "&pageSize=" + c;
            return d && (e += "&unread=" + d), e += "&time=" + (new Date).getTime(), a({withCredentials: !0, method: "GET", url: e})
        }, b.getBranches = function (b, c) {
            var d = PREFIX_URL + "m/u/sub/list";
            return b && (d += (/\?/.test(d) ? "&" : "?") + "pageSize=" + b), c && (d += (/\?/.test(d) ? "&" : "?") + "pageNo=" + c), d += (/\?/.test(d) ? "&" : "?") + "time=" + (new Date).getTime(), a({withCredentials: !0, method: "GET", url: d})
        }, b.getDepts = function () {
            var b = PREFIX_URL + "m/u/tag/list";
            return b += "?time=" + (new Date).getTime(), a({withCredentials: !0, method: "GET", url: b})
        }, b.addDept = function (b) {
            var c = PREFIX_URL + "m/u/tag/create";
            return a({withCredentials: !0, method: "POST", url: c, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}, data: $.param(b)})
        }, b.updateBranch = function (b) {
            var c = PREFIX_URL + "m/u/sub/save";
            return a({withCredentials: !0, method: "POST", url: c, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}, data: $.param(b)})
        }, b.createBranch = function (b) {
            var c = PREFIX_URL + "m/u/sub/create";
            return a({withCredentials: !0, method: "POST", url: c, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}, data: $.param(b)})
        }, b.openBranch = function (b, c) {
            var d = PREFIX_URL;
            return d += c ? "m/u/sub/turnOn?id=" + b : "m/u/sub/turnOff?id=" + b, a({withCredentials: !0, method: "POST", url: d, headers: {"Content-Type": "text/plain; charset=UTF-8"}})
        }, b
    }]),b.module("templates-app", ["about.tpl.html", "data/associateData.tpl.html", "data/edit/canedit.tpl.html", "data/edit/canread.tpl.html", "data/editData.tpl.html", "dialog/bindemail.tpl.html", "dialog/confirm.tpl.html", "dialog/message.tpl.html", "error.tpl.html", "error/error.tpl.html", "footer.tpl.html", "header.tpl.html", "help.tpl.html", "home/home.tpl.html", "main/console/group.tpl.html", "main/console/transferscene.tpl.html", "main/customer.tpl.html", "main/main.tpl.html", "main/spread.tpl.html", "main/spreadDetail.tpl.html", "main/userGuide.tpl.html", "my/myscene.tpl.html", "my/sceneSetting.tpl.html", "my/upload.tpl.html", "notifications.tpl.html", "reg/agreement.tpl.html", "reg/reg.tpl.html", "sample/sample.tpl.html", "scene/console.tpl.html", "scene/console/angle-knob.tpl.html", "scene/console/anim.tpl.html", "scene/console/audio.tpl.html", "scene/console/bg.tpl.html", "scene/console/button.tpl.html", "scene/console/category.tpl.html", "scene/console/cropimage.tpl.html", "scene/console/fake.tpl.html", "scene/console/input.tpl.html", "scene/console/link.tpl.html", "scene/console/map.tpl.html", "scene/console/microweb.tpl.html", "scene/console/pic_lunbo.tpl.html", "scene/console/pictures.tpl.html", "scene/console/setting.tpl.html", "scene/console/style.tpl.html", "scene/console/tel.tpl.html", "scene/console/video.tpl.html", "scene/create.tpl.html", "scene/createNew.tpl.html", "scene/edit/select/select.tpl.html", "scene/effect/falling.tpl.html", "scene/scene.tpl.html", "usercenter/console/branch.tpl.html", "usercenter/console/relAccount.tpl.html", "usercenter/console/upgrade_company.tpl.html", "usercenter/request_reg.tpl.html", "usercenter/tab/account.tpl.html", "usercenter/tab/message.tpl.html", "usercenter/tab/reset.tpl.html", "usercenter/tab/userinfo.tpl.html", "usercenter/tab/xd.tpl.html", "usercenter/transfer.tpl.html", "usercenter/usercenter.tpl.html"]),
    b.module("about.tpl.html", []).run(["$templateCache", function (a) {
        a.put("about.tpl.html", '<div class="about">\n    <div class="header">\n        <div class="content">\n            <div class="logo"><img ng-src="{{CLIENT_CDN}}assets/images/logo.png" alt=""></div>\n        </div>\n    </div>\n    <div class="banner">\n    	<img ng-src="{{CLIENT_CDN}}assets/images/contact1.jpg"/>\n    </div>\n    <div class="main clearfix">\n    	<h1>关于我们</h1>\n        <p>App一秀是专门为中小微企业营销人员精心打造的移动场景营销管家，旨在帮助中小微企业的营销人员通过移动互联网，轻松构建业务场景，轻量化展示产品和服务，多渠道推广，吸引沉淀客户，再营销，从而持续积累客户，提升营销效果，创造更高更好的市场业绩。</p>\n        <p>如果您需要借助移动互联网做新产品发布、客户培训会、用户沟通沙龙、移动环境中的产品演示、线上调研沟通、服务预约报名等业务活动时，就来App一秀吧，我们相信App一秀一定能帮到您。</p>\n\n        <img ng-src="{{CLIENT_CDN}}assets/images/contact2.jpg"/>\n\n        <p>联系我们：</p>\n        <p>郭鑫 18611538643 </p>\n        <p>邮件：vip@e.wesambo.com</p>\n        <p>QQ：2972881348</p>\n        <p>微信公众号： \n            <img style="display: block;" src="{{CLIENT_CDN}}assets/images/code_about.jpg"/>\n        </p>\n    </div>\n</div>\n')  //<div ng-include="\'footer.tpl.html\'"></div>')
    }]),b.module("data/associateData.tpl.html", []).run(["$templateCache", function (a) {
        a.put("data/associateData.tpl.html", '<div class="modal-header">\n    <span>导入客户</span>\n</div>\n<div class="data_associate">\n  <form class="form-horizontal" role="form">\n	<ui-select ng-model="person.selected" theme="bootstrap">\n		<ui-select-match placeholder="选择待导入场景">{{$select.selected.TITLE}}</ui-select-match>\n		<ui-select-choices repeat="person in PremergeScenes | propsFilter: {TITLE: $select.search}">\n		  <div ng-click="selectScene(person.ID)" ng-bind-html="person.TITLE | highlight: $select.search"></div>\n		</ui-select-choices>\n	</ui-select>\n\n	<div class="panel panel-default" ng-show="fields">\n	  	<div class="panel-body">	  	\n			<div class="form-group" ng-repeat="(findex, field) in fields">\n			  	<label class="col-sm-2 control-label">{{field.title}}</label>\n			  	<div class="col-sm-10">\n			  		<select class="form-control" ng-change="associate($index)" ng-model="associateMap[findex]" ng-options="staticFiled.name for staticFiled in staticFileds"></select>\n			  	</div>\n			</div>\n		</div>\n	</div>\n  </form>\n</div>\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确定</a>\n    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n</div>')
    }]),b.module("data/edit/canedit.tpl.html", []).run(["$templateCache", function (a) {
        a.put("data/edit/canedit.tpl.html", '<div class="main clearfix">\n    <div class="panel panel-default">\n      <div class="custom-detail">\n        <table width="100%" >\n          <tr><td>姓名：{{dataDetail.name}}</td><td>电话：{{dataDetail.tel}}</td><td>来源：{{dataDetail.originName}}</td></tr>\n          <tr ng-if="isAllowedToAccessGrouping">\n            <td colspan="3">分组：<span class="userList" ng-repeat="groupName in groupNames">{{groupName.name}}<em class="delete" ng-click="deleteAssociation(dataDetail.id,groupName.id)">x</em></span>\n            <div class="group-cat btn-group">\n                <em class="add dropdown-toggle" data-toggle="dropdown" title="添加分组">+</em>\n                <div class="dropdown-menu">            \n                    <ul class="group-list group-over" role="menu">\n                        <li class="group-menu" ng-repeat="group in groups" forbidden-close>\n                            <div class="select-group">\n                                <span class = "delete-group" ng-click="deleteGroup(group, $index);"></span>\n                                <div class="icheckbox_square-blue customer-check fr" ng-class="{checked: group.selected, hover: !group.selected \n                                && group.hovered == true}">\n                                    <input class="check-box" type="checkbox" ng-mouseenter="group.hovered = true;" ng-mouseleave="group.hovered = false;" ng-model="group.selected" name="iCheck">\n                                </div>\n                                <span>{{group.name}}</span>\n                            </div>\n                        </li>\n                    </ul>\n                    <ul class="group-list">\n                        <li class="group-menu" forbidden-close ng-click="addGroup();">\n                            <div class="select-group">\n                                <em>+</em>\n                                <span class="add-group">添加分组</span>\n                            </div>\n                        </li>\n                        <li>\n                            <a class="confirm-add" ng-click="assignGroup();">确定</a>\n                        </li>\n                    </ul>\n                </div>\n                <div class="confirm-group"></div>\n            </div>                  \n            </td>\n          </tr>\n        </table>\n      </div>\n      <div class="panel-body">\n        <form name="formName" class="form-horizontal" role="form">\n          <div class="form-group form-group-sm">\n            <label for="userName" class="col-sm-2 control-label">\n              姓名\n            </label>\n            <div class="col-sm-3">\n              <input type="text" name="name" ng-model="dataDetail.name" class="form-control"\n              id="userName" placeholder="姓名" show-icon callback-fn="updateData(arg1)">\n            </div>\n          </div>\n          <div class="form-group form-group-sm">\n            <label for="sex" class="col-sm-2 control-label">\n              性别\n            </label>\n            <div class="col-sm-3">\n              <select class="form-control input-sm" ng-model="sex" ng-options="sexOption.name for sexOption in sexOptions"\n              ng-change="updateSex(sex)">\n              </select>\n            </div>\n          </div>\n          <div class="form-group form-group-sm" ng-repeat="mobile in formMobiles track by $index">\n            <label for="mobile" class="col-sm-2 control-label" ng-show="$index==0">\n              手机\n            </label>\n            <label for="手机" class="col-sm-2 control-label" ng-show="$index!=0">\n            </label>\n            <div class="col-sm-3" id="mobileAddress">\n              <div class="input-group">\n                <input type="text" name="mobile" ng-model="formMobiles[$index]" class="form-control"\n                placeholder="手机" show-icon callback-fn="updateData(arg1,formMobiles)">\n                <span class="input-group-btn" >\n                  <button class="btn btn-default add-btn btn-sm" ng-click="removeInputs($index, \'mobile\', formMobiles)"\n                  type="button">\n                    <span class="fa fa-minus" >\n                    </span>\n                  </button>\n                </span>\n              </div>\n            </div>\n            <div class="col-sm-1">\n              <span ng-click="addInputs(formMobiles)" ng-show="$index==0" class="fa fa-plus add-inputs">\n              </span>\n            </div>\n          </div>\n          <div class="form-group form-group-sm" ng-repeat="email in formEmails track by $index">\n            <label for="email" class="col-sm-2 control-label" ng-show="$index==0">\n              邮箱\n            </label>\n            <label for="email" class="col-sm-2 control-label" ng-show="$index!=0">\n            </label>\n            <div class="col-sm-3" id="emailAddress">\n              <div class="input-group">\n                <input type="text" name="email" ng-model="formEmails[$index]" class="form-control"\n                placeholder="邮箱" show-icon callback-fn="updateData(arg1,formEmails, formName.emial.$invalid)">\n                <span class="input-group-btn">\n                  <button class="btn btn-default add-btn btn-sm" ng-click="removeInputs($index, \'email\', formEmails)"\n                  type="button">\n                    <span class="fa fa-minus">\n                    </span>\n                  </button>\n                </span>\n              </div>\n              <!-- /input-group -->\n            </div>\n            <div class="col-sm-1">\n              <span ng-click="addInputs(formEmails)" ng-show="$index==0" class="fa fa-plus add-inputs">\n              </span>\n            </div>\n          </div>\n          <div class="form-group form-group-sm">\n            <label for="company" class="col-sm-2 control-label">\n              公司\n            </label>\n            <div class="col-sm-3">\n              <input type="text" name="company" ng-model="dataDetail.company" class="form-control"\n              id="company" placeholder="公司" show-icon callback-fn="updateData(arg1)">\n            </div>\n          </div>\n          <div class="form-group form-group-sm">\n            <label for="job" class="col-sm-2 control-label">\n              职务\n            </label>\n            <div class="col-sm-3">\n              <input type="text" name="job" ng-model="dataDetail.job" class="form-control"\n              id="job" placeholder="职务" show-icon callback-fn="updateData(arg1)" required>\n            </div>\n          </div>\n          <div class="form-group form-group-sm" ng-repeat="tel in formTels track by $index">\n            <label for="tel" class="col-sm-2 control-label" ng-show="$index==0">\n              固定电话\n            </label>\n            <label for="tel" class="col-sm-2 control-label" ng-show="$index!=0">\n            </label>\n            <div class="col-sm-3" id="tel">\n              <div class="input-group">\n                <input type="text" name="tel" ng-model="formTels[$index]" class="form-control"\n                placeholder="固定电话" show-icon callback-fn="updateData(arg1,formTels)">\n                <span class="input-group-btn">\n                  <button class="btn btn-default add-btn btn-sm" ng-click="removeInputs($index, \'email\', formTels)"\n                  type="button">\n                    <span class="fa fa-minus">\n                    </span>\n                  </button>\n                </span>\n              </div>\n              <!-- /input-group -->\n            </div>\n            <div class="col-sm-1">\n              <span ng-click="addInputs(formTels)" ng-show="$index==0" class="fa fa-plus add-inputs">\n              </span>\n            </div>\n          </div>\n          <div class="form-group form-group-sm">\n            <label for="address" class="col-sm-2 control-label">\n              地址\n            </label>\n            <div class="col-sm-5">\n              <input type="text" name="address" ng-model="dataDetail.address" class="form-control"\n              id="address" placeholder="地址" show-icon callback-fn="updateData(arg1)">\n            </div>\n          </div>\n          <div class="form-group form-group-sm">\n            <label for="website" class="col-sm-2 control-label">\n              个人网址\n            </label>\n            <div class="col-sm-5">\n              <input type="text" name="website" ng-model="dataDetail.website" class="form-control"\n              id="website" placeholder="网址" show-icon callback-fn="updateData(arg1)">\n            </div>\n          </div>\n          <div class="form-group form-group-sm">\n            <label for="qq" class="col-sm-2 control-label">\n              QQ号\n            </label>\n            <div class="col-sm-3">\n              <input type="text" name="qq" ng-model="dataDetail.qq" class="form-control"\n              id="qq" placeholder="QQ号" show-icon callback-fn="updateData(arg1)">\n            </div>\n          </div>\n          <div class="form-group form-group-sm">\n            <label for="weixin" class="col-sm-2 control-label">\n              微信号\n            </label>\n            <div class="col-sm-3">\n              <input type="text" name="weixin" ng-model="dataDetail.weixin" class="form-control"\n              id="weixin" placeholder="微信号" show-icon callback-fn="updateData(arg1)">\n            </div>\n          </div>\n          <div class="form-group form-group-sm">\n            <label for="yixin" class="col-sm-2 control-label">\n              易信号\n            </label>\n            <div class="col-sm-3">\n              <input type="text" name="yixin" ng-model="dataDetail.yixin" class="form-control"\n              id="yixin" placeholder="易信号" show-icon callback-fn="updateData(arg1)">\n            </div>\n          </div>\n          <div class="form-group form-group-sm">\n            <label for="weibo" class="col-sm-2 control-label">\n              微博号\n            </label>\n            <div class="col-sm-3">\n              <input type="text" name="weibo" ng-model="dataDetail.weibo" class="form-control"\n              id="weibo" placeholder="微博号" show-icon callback-fn="updateData(arg1)">\n            </div>\n          </div>\n          <div class="form-group form-group-sm">\n            <label for="laiwang" class="col-sm-2 control-label">\n              来往号\n            </label>\n            <div class="col-sm-3">\n              <input type="text" name="laiwang" ng-model="dataDetail.laiwang" class="form-control"\n              id="inputEmail3" placeholder="来往号" show-icon callback-fn="updateData(arg1)">\n            </div>\n          </div>\n          <div class="form-group form-group-sm">\n            <label for="remark" class="col-sm-2 control-label">\n              其它\n            </label>\n            <div class="col-sm-3">\n              <input type="text" name="remark" ng-model="dataDetail.remark" class="form-control"\n              id="remark" placeholder="其它" show-icon callback-fn="updateData(arg1)">\n            </div>\n          </div>\n        </form>\n          <div class="edit-bar changjing_caozuo" style="padding-left:180px;">\n            <a class="btn-secondary" ng-click="saveData(dataDetail)">\n              <span>保存</span>\n            </a>\n            <a style="margin-left:20px;" ng-click="cancel()" class="btn-grey0">取消</a>\n          </div>\n      </div>\n    </div>\n</div>')
    }]),b.module("data/edit/canread.tpl.html", []).run(["$templateCache", function (a) {
        a.put("data/edit/canread.tpl.html", '<div class="main clearfix">\n    <div class="panel panel-default">\n        <div class="return">\n            <a ng-href="#/main/customer"><span class="fa fa-mail-reply">返回</span></a>\n        </div>\n        <div class="custom-detail">\n            <table width="100%" >\n                <tr><td>姓名：{{dataDetail.name}}</td><td>电话：{{dataDetail.tel}}</td><td>来源：{{dataDetail.originName}}</td></tr>\n                <tr ng-if="isAllowedToAccessGrouping">\n                  <td colspan="3">分组：<span class="userList" ng-repeat="groupName in   groupNames">{{groupName.name}}</span>                  \n                  </td>\n                </tr>\n            </table>\n        </div>\n        <div class="panel-body">\n            <form name="formName" class="form-horizontal data-detail" role="form">\n                <div class="form-group form-group-sm">\n                    <label for="userName" class="col-sm-2 control-label">\n                        姓名：\n                    </label>\n                    <div class="col-sm-3">\n                        <span>{{dataDetail.name}}</span>\n                    </div>\n                </div>\n                <div class="form-group form-group-sm">\n                    <label for="sex" class="col-sm-2 control-label">\n                        性别：\n                    </label>\n                    <div class="col-sm-3">\n                        <span>{{sex.id ? sex.name : \'\'}}</span>\n                    </div>\n                </div>\n                <div class="form-group form-group-sm">\n                    <label for="mobile" class="col-sm-2 control-label">\n                        手机：\n                    </label>\n                    <div class="col-sm-3" id="mobileAddress">\n                        <span>{{formMobiles.join()}}</span>\n                    </div>\n                </div>\n                <div class="form-group form-group-sm">\n                    <label for="email" class="col-sm-2 control-label">\n                        邮箱：\n                    </label>\n                    <div class="col-sm-3" id="emailAddress">\n                        <span>{{formEmails.join()}}</span>\n                    </div>\n                </div>\n                <div class="form-group form-group-sm">\n                    <label for="company" class="col-sm-2 control-label">\n                        公司：\n                    </label>\n                    <div class="col-sm-3">\n                      <span>{{dataDetail.company}}</span>\n                    </div>\n                </div>\n                <div class="form-group form-group-sm">\n                    <label for="job" class="col-sm-2 control-label">\n                        职务：\n                    </label>\n                    <div class="col-sm-3">\n                        {{dataDetail.job}}\n                    </div>\n                </div>\n                <div class="form-group form-group-sm">\n                    <label for="tel" class="col-sm-2 control-label">\n                        固定电话：\n                    </label>\n                    <div class="col-sm-3" id="tel">\n                        <span>{{formTels.join()}}</span>\n                    </div>\n                </div>\n                <div class="form-group form-group-sm">\n                    <label for="address" class="col-sm-2 control-label">\n                        地址：\n                    </label>\n                    <div class="col-sm-5">\n                      <span>{{dataDetail.address}}</span>\n                    </div>\n                </div>\n                <div class="form-group form-group-sm">\n                    <label for="website" class="col-sm-2 control-label">\n                        个人网址：\n                    </label>\n                    <div class="col-sm-5">\n                        <span>{{dataDetail.website}}</span>\n                    </div>\n                </div>\n                <div class="form-group form-group-sm">\n                    <label for="qq" class="col-sm-2 control-label">\n                        QQ号：\n                    </label>\n                    <div class="col-sm-3">\n                        <span>{{dataDetail.qq}}</span>\n                    </div>\n                </div>\n                <div class="form-group form-group-sm">\n                    <label for="weixin" class="col-sm-2 control-label">\n                        微信号：\n                    </label>\n                    <div class="col-sm-3">\n                        <span>{{dataDetail.weixin}}</span>\n                    </div>\n                </div>\n                <div class="form-group form-group-sm">\n                    <label for="yixin" class="col-sm-2 control-label">\n                        易信号：\n                    </label>\n                    <div class="col-sm-3">\n                        <span>{{dataDetail.yixin}}</span>\n                    </div>\n                </div>\n                <div class="form-group form-group-sm">\n                    <label for="weibo" class="col-sm-2 control-label">\n                        微博号：\n                    </label>\n                    <div class="col-sm-3">\n                        {{dataDetail.weibo}}\n                    </div>\n                </div>\n                <div class="form-group form-group-sm">\n                    <label for="laiwang" class="col-sm-2 control-label">\n                        来往号：\n                    </label>\n                    <div class="col-sm-3">\n                        <span>{{dataDetail.laiwang}}</span>\n                    </div>\n                </div>\n                <div class="form-group form-group-sm">\n                    <label for="remark" class="col-sm-2 control-label">\n                        其它：\n                    </label>\n                    <div class="col-sm-3">\n                        <span>{{dataDetail.remark}}</span>\n                    </div>\n                </div>\n            </form>\n        </div>\n    </div>\n</div>')
    }]),b.module("data/editData.tpl.html", []).run(["$templateCache", function (a) {
        a.put("data/editData.tpl.html", '<div ng-include="\'header.tpl.html\'"></div>\n<div id="main" class="min_contain" ng-if="!hideOpea">\n    <div ng-include="\'data/edit/canedit.tpl.html\'"></div>\n</div>\n<div id="main" class="min_contain" ng-if="hideOpea">\n    <div ng-include="\'data/edit/canread.tpl.html\'"></div>\n</div>')
    }]),b.module("dialog/bindemail.tpl.html", []).run(["$templateCache", function (a) {
        a.put("dialog/bindemail.tpl.html", '<div class="email-account">\n    <h1>您的账号还没有绑定邮箱</h1>\n    <p>去用户中心>账号管理，<a ng-href="#/usercenter/account?bindemail">马上绑定</a></p>\n</div>')
    }]),b.module("dialog/confirm.tpl.html", []).run(["$templateCache", function (a) {
        a.put("dialog/confirm.tpl.html", '<div class="modal-header">\n    <span class="glyphicon glyphicon-exclamation-sign"></span>\n    <span>提示</span>\n</div>\n<div class="modal-body" ng-if="confirmObj.msg">\n	<!-- confirm message -->\n	<div class="confirm-msg">{{confirmObj.msg}}</div>\n</div>\n<div class="modal-footer">\n    <a ng-click="ok();" class="btn-main"\n    style="width: 88px;">\n        {{confirmObj.confirmName || \'是\'}}\n    </a>\n    <a ng-click="cancel();" class="btn-grey0"\n    style="width: 88px;margin-left: 15px;">\n        {{confirmObj.cancelName || \'取消\'}}\n    </a>\n</div>')
    }]),b.module("dialog/message.tpl.html", []).run(["$templateCache", function (a) {
        a.put("dialog/message.tpl.html", '<div class="modal-header">\n    <span class="glyphicon glyphicon-exclamation-sign"></span>\n    <span>{{msgObj.title || \'提示\'}}</span>\n</div>\n<div class="modal-body" ng-if="msgObj.msg">\n    <div class="msg" ng-class="msgObj.title ? \'\' : \'msg-padding\'">{{msgObj.msg}}</div>\n</div>\n<div class="modal-footer">\n	<a ng-click="close();" class="btn-main"\n    style="width: 88px;">关闭</a>\n</div>')
    }]),b.module("error.tpl.html", []).run(["$templateCache", function (a) {
        a.put("error.tpl.html", '<div class="error">\n    <div class="header">\n        <div class="content">\n            <div class="logo"><img ng-src="{{CLIENT_CDN}}assets/images/logo.png" alt=""></div>\n        </div>\n    </div>\n    <div class="error_contain">\n        <div class="error_con">\n            <img ng-src="{{CLIENT_CDN}}assets/images/404_03.png" alt="" />\n            <p style="font-size:24px;margin-top:30px;margin-bottom:15px;">对不起，您想要进入的页面已经去火星了！</p>\n            <p style="text-align:left;"><a href="#/home">返回地球</a></p>\n        </div>\n    </div>\n</div>\n')  //<div ng-include="\'footer.tpl.html\'"></div>')
    }]),b.module("error/error.tpl.html", []).run(["$templateCache", function (a) {
        a.put("error/error.tpl.html", '<div class="error">\n    <div class="header">\n        <div class="content">\n            <div class="logo"><img ng-src="{{CLIENT_CDN}}assets/images/logo.png" alt="" /></div>\n        </div>\n    </div>\n    <div class="error_contain">\n        <div class="error_con">\n            <img ng-src="{{CLIENT_CDN}}assets/images/404_03.png" alt="" />\n            <p style="font-size:24px;margin-top:30px;margin-bottom:15px;">对不起，您想要进入的页面已经去火星了！</p>\n            <p style="text-align:left;"><a href="#/home">返回地球</a></p>\n        </div>\n    </div>\n</div>\n')  //<div ng-include="\'footer.tpl.html\'"></div>')
	}]), b.module("footer.tpl.html", []).run(["$templateCache", function(a) {
		a.put("footer.tpl.html", '<footer>\n	<div class="content_center">\n		<article class="footer">\n			<p class="beizhu">(c) 2015 <a href="http://e.wesambo.com">e.wesambo.com</a>. All rights reserved   粤ICP备888888</p>\n        	<p>\n				<a  target="_blank" rel="nofollow" style="margin: 0 auto;">\n					<img ng-src="{{CLIENT_CDN}}assets/images/sn.png">\n				</a>\n        		<a target="_blank" href="http://e.wesambo.com">加入我们</a>|<a href="http://e.wesambo.com" target="_blank" >意见反馈</a>|<a target="_blank" href="http://e.wesambo.com">内容举报</a>|<a target="_blank" href="http://e.wesambo.com">关于我们</a>|<a target="_blank" href="http://e.wesambo.com">论坛</a>|<a target="_blank" href="http://e.wesambo.com">帮助中心</a>\n        	</p>\n        </article>\n	</div>\n</footer>')
    }]),b.module("header.tpl.html", []).run(["$templateCache", function (a) {
        a.put("header.tpl.html", '<div class="header_tpl">\n	<div class="content clearfix">\n				<div class="head_nav" ng-if="showToolBar();">\n			<ul class="clearfix head_navs">\n				<li ng-class="{hover:isActive == \'main\'}">\n					<a href="#/main">我的场景</a>\n				</li>\n				<li ng-class="{hover:isActive == \'spread\'}">\n					<a href="#/main/spread">我的推广</a>\n				</li>\n				<li ng-class="{hover:isActive == \'customer\'}">\n					<a href="#/main/customer">我的客户</a>\n				</li>\n						\n			</ul>\n			<div ng-if="user.type == 2 && showBranchSelect" class="select-branch">\n				<select style="width:200px;" ng-model="global.branch" ng-options="branch.loginName for branch in userbranches" ng-change="selectBranch(branch)">\n					<option value="">当前账号</option>\n				</select>\n			</div>\n			<login-toolbar></login-toolbar>\n		</div>\n	    \n	</div>\n</div>	\n')
    }]),b.module("help.tpl.html", []).run(["$templateCache", function (a) {
        a.put("help.tpl.html", '<div ng-include="\'header.tpl.html\'"></div>\n<div id = "usercenter" class="min_contain">\n  <div class = "main clearfix">\n    <div class="help_content">\n        <h1>快速获得秀点</h1>\n        <p>1.场景展示得秀点</p>\n        <table>\n            <tr><th class="col-sm-3">账号属性</th><th class="col-sm-3">获取秀点条件</th><th class="col-sm-8">秀点计算</th></tr>\n            <tr><td>普通账号</td><td>分享尾页展示</td><td>5000展示=100秀点</td></tr>\n            <tr><td>高级账号</td><td>末页底标展示</td><td>10000展示=100秀点</td></tr>\n            <tr><td>服务账号</td><td>末页底标展示</td><td>10000展示=100秀点</td></tr>\n            <!-- <tr><td>企业账号</td><td>末页底标</td><td>5000展示=100秀点</td></tr> -->\n        </table>\n        <p>2.推荐会员得秀点</p>\n        <table>\n            <tr><td class="col-sm-3">推荐会员</td><td class="col-sm-3">注册会员</td><td class="col-sm-8">推荐一个会员，可以获得20个秀点</td></tr>\n        </table>\n        <h1 style="margin:20px 0;">秀点使用</h1>\n        <table>\n            <tr><th class="col-sm-3">账号属性</th><th class="col-sm-3">使用内容</th><th class="col-sm-8">所需秀点</th></tr>\n            <tr><td>普通账号</td><td>去除分享尾页</td><td>100个</td></tr>\n            <tr><td>高级账号</td><td>去除末页底标</td><td>100个</td></tr>\n            <tr><td>服务账号</td><td>去除末页底标/修改载入logo</td><td>100个/500个</td></tr>\n        </table>\n    </div>\n  </div>\n</div>\n')  //<div ng-include="\'footer.tpl.html\'"></div>')
    }]),b.module("home/home.tpl.html", []).run(["$templateCache", function (a) {
        
		//有马的模块
		//a.put("home/home.tpl.html", '<div id="home" class="min_contain" login-loading>\n    <header>\n        <div class="we_nav content_center">\n            <div class="link_list">\n                <ul class="clearfix">\n                    <li><a target="_blank" href="#/sample">用户案例</a></li>\n                   <!--  <li ng-hide="isAuthenticated()"><a href = "#/home/login">登录</a></li>\n                    <li ng-hide="isAuthenticated()" class=""><a href = "#/home/register">注册</a></li> -->\n                    <li ng-hide="isAuthenticated()"><a ng-click = "openLogin()">登录</a></li>\n                    <li ng-hide="isAuthenticated()" class=""><a ng-click = "openRegister()">注册</a></li>\n                    <li ng-show="isAuthenticated()"><a href="#/main">进入</a></li>\n                </ul>\n            </div>                  \n            <div id="logo"><img ng-src="{{CLIENT_CDN}}assets/images/logo.png" alt=""></div>\n        </div>    \n    </header>\n   <div id="example_con">\n        <div id="example">\n            <div slides id="slides">\n                <div class="slides_container"></div>\n                <a href="#" class="prev"><img ng-src="{{CLIENT_CDN}}assets/images/arrow-prev.png" width="60px" height="114px" alt="Arrow Prev"></a>\n                <a href="#" class="next"><img ng-src="{{CLIENT_CDN}}assets/images/arrow-next.png" width="60px" height="114px" alt="Arrow Next"></a>\n            </div>\n        </div>\n    </div>\n      <div class="customer_case">\n        <div class="customer_case_con content_center clearfix">\n            <div class="case_cat">\n                <h1><img ng-src="{{CLIENT_CDN}}assets/images/home/case.png" alt="" /></h1>\n                <ul>\n                    <!-- <li id="one1" ng-class="{hover:!type}" ng-click="getHomes(null, 4);type=null">全部案例</li>\n                    <li id="one2" ng-class="{hover:type==1}" ng-click="getHomes(1, 4);type=1;">企业宣传</li>\n                    <li id="one3" ng-class="{hover:type==2}" ng-click="getHomes(2, 4);type=2;">产品销售</li>\n                    <li id="one4" ng-class="{hover:type==3}" ng-click="getHomes(3, 4);type=3;">推广展示</li> -->\n                    <li id="one1" ng-class="{hover:typeindex == \'all\'}" ng-click="getHomes(\'all\', null, 1, 9);type=null">全部案例</li>\n                    <li ng-repeat = "sceneType in sceneTypes" ng-class = "{hover: typeindex == $index}" ng-click = "getHomes($index, sceneType.sort, 1, 9)">\n                        {{sceneType.name}}\n                    </li>\n                </ul>\n            </div>\n            <div class="case_img">\n                <ul class="clearfix">\n                    <li ng-repeat="home in homes" style="height:235px;"> \n                        <a ng-href="{{PREFIX_CLIENT_HOST + \'v-\' + home.code}}" target="_blank">\n                        <div ng-show="showCode == true" class="cj_img qrcode" qr-code qr-url="{{PREFIX_CLIENT_HOST + \'v-\' + home.code}}"></div>\n                        <div ng-hide="showCode == true" class="cj_img"><img ng-src="{{PREFIX_FILE_HOST + home.image.imgSrc}}" alt="" width="235px" /></div>\n                        <p class="sample_erwei"><a ng-href="{{PREFIX_CLIENT_HOST + \'v-\' + home.code}}" target="_blank" ng-mouseover="showCode = true" ng-mouseleave="showCode = false" >二维码</a></p>\n                    </a>\n                    </li> \n                </ul>\n            </div>\n        </div>\n    </div>\n        <div class="home_reg">\n        <div class="home_reg_con">\n            <div><a ng-click = "register()" alt="立即注册" title="立即注册"><img ng-src="{{CLIENT_CDN}}assets/images/home/ntb_04.png" alt="" /></a></div>\n        </div>\n    </div>   \n    <div class="contact">\n    \n</div>\n<div class="scroll" data-ng-init="load2()" ><a class="scroll_top" href="#element-id">TOP</a></div>\n<div ng-include="\'footer.tpl.html\'"></div>');}]),b.module("main/console/group.tpl.html", []).run(["$templateCache", function (a) {
		
		//以下一行是现在用的模板20150412
        a.put("home/home.tpl.html", '<div class="topButton" align="center">\n<table class="toptable" cellspacing="0"><tr> \n<td><img style="cursor:pointer;" height="45" src="/Public/css/images/logo.png" onclick="openFirstPage()" alt="HTML5在线制作" title="微场景免费在线制作"></td>\n<td id="loginc" align="right">     </td>\n       <td  class="tbutton" ng-hide="isAuthenticated()"><a  ng-click = "openLogin()"><font color="white">登录</font></a></td>\n       <td  class="tbutton" ng-hide="isAuthenticated()"><a  ng-click = "openRegister()"><font color="white">注册</font></a></td>\n<td ng-show="isAuthenticated()" class="tbutton"><a href="#/main"><font color="white">进入</font></a></td>\n</tr></table>\n </div>\n<div id="body" class="body" align="center">\n<div class="contant">\n<table class="pages" cellspacing="0">\n<tr><td valign="top">\n	<img style="margin-left:70px;margin-top:80px;" src="static/img/index/advantage.png" alt="HTML5在线制作" title="微场景免费在线制作">\n	</td></tr>\n<tr><td valign="top">\n<img style="margin-left:167px;" src="static/img/index/4.png" alt="HTML5在线制作" title="微场景免费在线制作">\n<img style="margin-left:20px;" src="static/img/index/5.png" alt="HTML5在线制作" title="微场景免费在线制作">\n<img style="margin-left:20px;" src="static/img/index/2.png" alt="HTML5在线制作" title="微场景免费在线制作">\n<img style="margin-left:20px;" src="static/img/index/1.png" alt="HTML5在线制作" title="微场景免费在线制作">	  			 \n<img style="margin-left:20px;" src="static/img/index/3.png" alt="HTML5在线制作" title="微场景免费在线制作"> 			 \n</td></tr>\n<tr><td valign="top" align="center">\n<img style="margin-top:30px;" src="static/img/index/btn-bg.png" alt="HTML5在线制作" title="微场景免费在线制作">\n</td></tr>\n<tr><td valign="top" align="right">\n<table cellspacing="0" style="width:100%;"><tr>\n<td valign="top" align="left" width="450">\n<img width="300" src="static/img/index/slide_02.png" alt="HTML5在线制作" title="微场景免费在线制作">\n</td>\n<td valign="bottom">\n<div style="color:white;">\n<h3>让您SHOW得如此精彩</h3>\n<p>海量素材，多样模板，拖拽组件，一键推广</p>\n<p>多种互动效果，满足极致交互体验</p> \n<p>图文动画，音频视频，多媒体视听感受</p> 					 \n<br>\n</div> 				 \n</td> \n<td valign="top" align="right">\n<div style="color:white;" align="left">\n<h3>BM SHOW,让移动推广变得如此简单</h3>\n<p>精美画面，社交展示，数据收集，持续营销</p>\n<p>移动时代专业级的场景制作平台</p>\n</div>\n</td>\n</tr>\n</table>\n</td></tr>\n<tr><td valign="top">\n<div style="margin-top:190px;">\n<img style="margin-left:110px;" src="static/img/index/pro_10.png" alt="HTML5在线制作" title="微场景免费在线制作">\n<img style="margin-left:30px;" src="static/img/index/pro_13.png" alt="HTML5在线制作" title="微场景免费在线制作">\n<img style="margin-left:30px;" src="static/img/index/pro_15.png" alt="HTML5在线制作" title="微场景免费在线制作">\n<br><br><br><br>\n<img style="margin-left:80px;" src="static/img/index/pro_17.png" alt="HTML5在线制作" title="微场景免费在线制作"> \n<img style="margin-left:30px;" src="static/img/index/pro_26.png" alt="HTML5在线制作" title="微场景免费在线制作">\n<img style="margin-left:30px;" src="static/img/index/pro_27.png" alt="HTML5在线制作" title="微场景免费在线制作">\n</div>\n</td></tr>\n<tr><td valign="top">\n<div id="temptest" style="width:800px;" align="right">\n<br/><br/><br/><br/><br/><br/><br/><br/>\n<p style="color:white;">业务QQ：66666666666</p>\n<p style="color:white;">业务电话：13666666666</p>\n<p style="color:white;">QQ技术群：888888</p>\n<p style="color:white;">邮箱：888888@qq.com</p>\n</div> \n</td></tr>\n<tr><td valign="top">\n</td></tr>\n</table>		\n</div>\n</div>\n<div class="foot" align="right">\n<table><tr><td style="color:white;font-family:微软雅黑;font-size:12px;" align="right">2015 one Show  微上宝科技版权所有&nbsp;&nbsp;</td></tr></table>\n</div>\n<div class="gotoBottom" onclick="godown()">联系</div>\n <div class="gotoTop" onclick="goup()">UP</div>\n   ')  //<div ng-include="\'footer.tpl.html\'"></div>
	}]), b.module("main/console/group.tpl.html", []).run(["$templateCache", function(a) {

        a.put("main/console/group.tpl.html", '<div class="group-modal" forbidden-list-close>\n    <div class="group-list">\n        <label>新建组名称</label><input type="text" ng-model="group.name" placeholder="请设置名称"/>\n    </div>\n    <div class="modal-footer">\n        <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确认</a>\n        <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n    </div>\n</div>')
    }]),b.module("main/console/transferscene.tpl.html", []).run(["$templateCache", function (a) {
        a.put("main/console/transferscene.tpl.html", '<div class="tab-contain upgrade">\n	<div class="same-head">\n		<h1>转出场景</h1>\n		<p ng-show="actionerror">{{actionerror}}</p>\n	</div>\n	<div class="same-content">\n		<form class="form-horizontal ng-pristine ng-valid" role="form">\n		    <div class="form-group">\n		        <label for="inputPassword3" class="col-sm-3 control-label">邮箱账号</label>\n		        <div class="col-sm-7">\n		            <input type="text" class="form-control" ng-model="model.toUser">\n		        </div>\n		    </div>      		      		      		      \n	        <div class="form-group sub-qx">\n	        	<div class="col-sm-offset-4 col-sm-10">\n	            	<a class="btn-main login" style="width: 88px;" ng-click="confirm()">确认</a>\n	                <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n	            </div>\n	        </div>\n		</form>		\n	</div>\n</div>')
    }]),b.module("main/customer.tpl.html", []).run(["$templateCache", function (a) {
        a.put("main/customer.tpl.html", '<div ng-include="\'header.tpl.html\'"></div>\n<div id="main" class="min_contain">\n    <div class="main clearfix">\n        <ul class="create_btn_group">\n            <li class="btn-main" ng-if="isEditor" page-tpl-types ng-href="#/scene/create/2442?pageId=1">页面模板</li>            \n        </ul>   \n\n        <div class="info">\n            <ul class="clearfix">\n                <li>\n                    <div class="shou">\n                        <h1 class="">{{allDataCount || 0 | fixnum}}</h1>\n                        <h2>已收集客户</h2>\n                    </div>\n                </li>\n                <li>\n                    <div class="wei">\n                        <h1 class="lightVioletColor">{{prospectDataAccount || 0 | fixnum}}</h1>\n                        <h2>未导入数据</h2>\n                    </div>\n                </li>\n            </ul>\n        </div> \n\n        <tabset justified="true" ng-if="!isAllowedToAccessGrouping">     \n                <!-- <div ng-show="editData" ng-include="\'data/editData.tpl.html\'"></div> -->\n            <div class="data" ng-hide="editData">\n                <div class="data_bar">\n                    <ul class="tab_head mt20" ng-init="tabcustom = \'custom\'">\n                        <li ng-class="{hover: tabcustom == \'custom\'}" ng-click="tabcustom =\'custom\'">客户信息</li><li ng-class="{hover: tabcustom == \'daoru\'}" ng-click="tabcustom = \'daoru\'">导入数据</li>\n                    </ul>\n                </div>\n                <div class="custom_contain">\n                    <div ng-show="tabcustom == \'custom\'">\n                        <div class="new_daochu clearfix">\n                            <div class="fr"><a class="btn btn-secondary hint--bottom hint--rounded daochu" style="margin-left:1px;" ng-href="{{JSON_URL + \'?c=custom&a=exp\'}}" tooltip-placement="bottom" tooltip="将数据导出为excel文件" tooltip-append-to-body="true"><span>导出Excel</span></a></div>\n                        </div> \n                        <div ng-show="customerDatas">                  \n                            <table class = "col-sm-12 table table-bordered text-center data-table" >\n                                <thead>\n                                    <tr>\n                                        <th>姓名</th>\n                                        <th>手机</th>\n                                        <th>客户群组</th>\n                                        <th>客户来源</th>\n                                        <th>管理</th>\n                                    </tr>\n                                </thead>\n                                <tbody>\n                                    <tr ng-class="{hovercolor: trIndex==$index}" ng-repeat="customerData in customerDatas" ng-mouseenter="addColor($index)" ng-mouseleave="removeColor()">\n                                        <td>{{customerData.name}}</td>\n                                        <td>{{customerData.mobile}}</td>\n                                        <td>{{customerData.groupName}}</td>\n                                        <td>{{customerData.originName}}</td>\n                                        <!-- ng-click="editCustomer(customerData)" -->\n                                        <td><a style = "" class="glyphicon glyphicon-cog" ng-click="editCustom(customerData, $index)"></a><a style="margin-left: 30px;" class="glyphicon glyphicon-trash" ng-click="removeCustomer(customerData)"></a></td>\n                                    </tr>\n                                </tbody>\n                            </table>\n                            <pagination style="float: left" first-text="首页" last-text="尾页" previous-text="上一页" next-text="下一页" max-size="10" items-per-page="10" total-items="totalItems" ng-model="model.currentPage" ng-change="pageChanged(model.currentPage)" boundary-links="true" rotate="true" num-pages="numPages"></pagination>\n                            <div class="current_page">\n                                <input type="text" ng-model="model.toPage" ng-keyup="$event.keyCode == 13 ? pageChanged(model.toPage) : null">\n                                <a ng-click="pageChanged(model.toPage)" class="go">GO</a>\n                                <span>当前: {{currentPage}} / {{numPages}} 页</span>\n                            </div>\n                        </div>\n                    </div>\n                    <div ng-show="tabcustom == \'daoru\'">\n                        <div class="new_daochu wai_daoru clearfix">\n                            <!-- <div class="newcustom fr" ng-click="addCustom()"><span>+</span>新增客户</div>  -->                               \n                            <div class="custom_data">可导入数据：<span>{{prospectDataAccount || 0 | fixnum}}</span><!-- <span>上传外部表格</span> --></div>\n\n                        </div>\n                        <div class="daoru_contain clearfix" style="text-align:center;" ng-show="importDatas">\n                            <div class="select_cj fl" style="text-align:left;">\n                                <h2>1.选择新数据场景</h2>\n                                <ul style="height:489px;">\n                                    <li ng-repeat="importData in importDatas" ng-click="selectScene(importData.ID,$index)" ng-class="{active: select == $index}"><span>{{importData.TITLE}}</span></li>\n                                </ul>\n                            </div>\n                            <div class="tuo_data ml20 mr20 fl">\n                                <h2>2.拖拽导入的数据</h2>\n                                <ul class="item_remove_droppable" style="height:489px;overflow-y:auto;width:210px;" item-remove-droppable>\n                                    <li item-draggable item-id="{{field.id}}" class="list_darggable" ng-repeat="field in fields"><span>{{field.title}}</span></li>\n                                </ul>                                    \n                            </div>\n                            <div class="nametoname fl">\n                                <h2>3.拖入对应名称</h2>\n                                <div class="clearfix tuozhuai" style="height:489px;">\n                                    <div >\n                                        <ul>\n                                            <li style="border-bottom:none;" class="clearfix" ng-repeat="staticFiled in staticFileds">\n                                                <div class="list_attribute fl" item-droppable item-id="{{staticFiled.id}}">拖拽到此处</div>\n                                                <div class="list_field fr">{{staticFiled.name}}</div>\n                                            </li>\n                                        </ul>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="action" style="text-align:right" ng-show="importDatas">\n                            <span style="padding-right:60px;">拖拽名称标签放到右侧对应名称中</span>\n                            <span style="padding-right:182px;">导入后原场景数据不会删除</span>\n                            <a type="button" class="btn btn-main" ng-click="confirm()">导入</a>\n                        </div>\n                    </div>\n                </div>\n            </div>      \n        </tabset>\n\n        <tabset justified="true" ng-if="isAllowedToAccessGrouping">     \n            <div class="data" ng-hide="editData">\n                <div class="data_bar">\n                    <ul class="tab_head mt20" ng-init="tabcustom = \'custom\'">\n                        <li ng-class="{hover: tabcustom == \'custom\'}" ng-click="tabcustom =\'custom\'">\n                            客户信息\n                        </li>\n                        <li ng-show="!hideOpea" ng-class="{hover: tabcustom == \'daoru\'}" ng-click="tabcustom = \'daoru\'">\n                            导入数据\n                        </li>\n                    </ul>\n                </div>\n                <div class="custom_contain">\n                    <div ng-show="tabcustom == \'custom\'">\n                        <div class="new_daochu clearfix">\n                            <div class="fr"><a class="btn btn-secondary hint--bottom hint--rounded daochu" style="margin-left:1px;" ng-href="{{JSON_URL + \'?c=custom&a=exp\'}}" tooltip-placement="bottom" tooltip="将数据导出为excel文件" tooltip-append-to-body="true"><span>导出Excel</span></a></div>\n                        </div>\n                        <div class="group-action clearfix" ng-if="!hideOpea">\n                            <div class="fl">\n                                <div class="icheckbox_square-blue customer-check" ng-class="{checked: allImages.selected, hover: !allImages.selected && allhovered == true}">\n                                    <input class="check-box" type="checkbox" ng-mouseenter="allhovered = true;" ng-mouseleave="allhovered = false;" ng-change="selectAll()" ng-model="allImages.selected" name="iCheck">\n                                </div>\n                            </div>\n                            <div class="group-cat btn-group">\n                                <a class="dropdown-toggle" data-toggle="dropdown">\n                                    添加到组\n                                </a>\n                                <div class="dropdown-menu">\n                                    <ul class="group-list group-item" role="menu">\n                                        <li class="group-menu" ng-repeat="group in groups" forbidden-close>\n                                            <div class="select-group">\n                                                <span class = "delete-group" ng-click = "deleteGroup(group, $index);"></span>\n                                                <div class="icheckbox_square-blue customer-check fr" ng-class="{checked: group.selected, hover: !group.selected && group.hovered == true}">\n                                                    <input class="check-box" type="checkbox" ng-mouseenter="group.hovered = true;" ng-mouseleave="group.hovered = false;" ng-model="group.selected" name="iCheck">\n                                                </div>\n                                                <span>{{group.name}}</span>\n                                            </div>\n                                        </li>\n                                    </ul>\n                                    <ul class="group-list">\n                                        <li class="group-menu" forbidden-close ng-click="addGroup();">\n                                            <div class="select-group">\n                                                <em>+</em>\n                                                <span class="add-group">添加分组</span>\n                                            </div>\n                                        </li>\n                                        <li>\n                                            <a class="confirm-add" ng-click="assignGroup();">确定</a>\n                                        </li>\n                                    </ul>\n                                </div>\n                                <div class="confirm-group"></div>\n                            </div>\n                            <span class="mul-del" ng-click="deleteCustomer();">删除</span>\n                        </div>\n                        <div ng-show="customerDatas">                  \n                            <table class="col-sm-12 table table-bordered text-center data-table" >\n                                <thead>\n                                    <tr>\n                                        <th ng-if="!hideOpea" class="col-sm-1 check-line">\n                                        </th>\n                                        <th>姓名</th>\n                                        <th>手机</th>\n                                        <th>客户群组</th>\n                                        <th>客户来源</th>\n                                        <th>管理</th>\n                                    </tr>\n                                </thead>\n                                <tbody>\n                                    <tr ng-class="{hovercolor: trIndex==$index}" ng-repeat="customerData in customerDatas" ng-mouseenter="addColor($index)" ng-mouseleave="removeColor()">\n                                        <td ng-if="!hideOpea" class="check-line">\n                                            <div class="icheckbox_square-blue table-checkbox" ng-class="{checked: customerData.selected, hover: !customerData.selected && customerData.hovered == true}">\n                                                <input class="check-box" type="checkbox" ng-mouseenter="customerData.hovered = true;" ng-mouseleave="customerData.hovered = false;" ng-model="customerData.selected" name="iCheck" ng-change="selectCustomer(customerData)">\n                                            </div>\n                                        </td>\n                                        <td>{{customerData.name}}</td>\n                                        <td>{{customerData.mobile}}</td>\n                                        <td>{{customerData.groupName}}</td>\n                                        <td>{{customerData.originName}}</td>\n                                        <td>\n                                            <a class="glyphicon glyphicon-cog" ng-click="editCustom(customerData, $index)"></a>\n                                            <a style="margin-left: 30px;" class="glyphicon glyphicon-trash" ng-click="removeCustomer(customerData)" ng-if="!hideOpea">\n                                            </a>\n                                        </td>\n                                    </tr>\n                                </tbody>\n                            </table>\n                            <pagination style="float: left" first-text="首页" last-text="尾页" previous-text="上一页" next-text="下一页" max-size="10" items-per-page="10" total-items="totalItems" ng-model="model.currentPage" ng-change="pageChanged(model.currentPage)" boundary-links="true" rotate="true" num-pages="numPages"></pagination>\n                            <div class="current_page">\n                                <input type="text" ng-model="model.toPage" ng-keyup="$event.keyCode == 13 ? pageChanged(model.toPage) : null">\n                                <a ng-click="pageChanged(model.toPage)" class="go">GO</a>\n                                <span>当前: {{currentPage}} / {{numPages}} 页</span>\n                            </div>\n                        </div>\n                    </div>\n                    <div ng-show="tabcustom == \'daoru\' && !hideOpea">\n                        <div class="new_daochu wai_daoru clearfix">\n                            <div class="custom_data">\n                                可导入数据：\n                                <span>\n                                    {{prospectDataAccount || 0 | fixnum}}\n                                </span>\n                            </div>\n                        </div>\n                        <div class="daoru_contain clearfix" style="text-align:center;" ng-show="importDatas">\n                            <div class="select_cj fl" style="text-align:left;">\n                                <h2>1.选择新数据场景</h2>\n                                <ul style="height:489px;">\n                                    <li ng-repeat="importData in importDatas" ng-click="selectScene(importData.ID,$index)" ng-class="{active: select == $index}"><span>{{importData.TITLE}}</span></li>\n                                </ul>\n                            </div>\n                            <div class="tuo_data ml20 mr20 fl">\n                                <h2>2.拖拽导入的数据</h2>\n                                <ul class="item_remove_droppable" style="height:489px;overflow-y:auto;width:210px;" item-remove-droppable>\n                                    <li item-draggable item-id="{{field.id}}" class="list_darggable" ng-repeat="field in fields"><span>{{field.title}}</span></li>\n                                </ul>                                    \n                            </div>\n                            <div class="nametoname fl">\n                                <h2>3.拖入对应名称</h2>\n                                <div class="clearfix tuozhuai" style="height:489px;">\n                                    <div >\n                                        <ul>\n                                            <li style="border-bottom:none;" class="clearfix" ng-repeat="staticFiled in staticFileds">\n                                                <div class="list_attribute fl" item-droppable item-id="{{staticFiled.id}}">拖拽到此处</div>\n                                                <div class="list_field fr">{{staticFiled.name}}</div>\n                                            </li>\n                                        </ul>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="action" style="text-align:right" ng-show="importDatas">\n                            <span style="padding-right:60px;">拖拽名称标签放到右侧对应名称中</span>\n                            <span style="padding-right:182px;">导入后原场景数据不会删除</span>\n                            <a type="button" class="btn btn-main" ng-click="confirm()">导入</a>\n                        </div>\n                    </div>\n                </div>\n            </div>      \n        </tabset>\n    </div>\n</div>\n')  //<div ng-include="\'footer.tpl.html\'"></div>')
    }]),b.module("main/main.tpl.html", []).run(["$templateCache", function (a) {
        a.put("main/main.tpl.html", '<div ng-include="\'header.tpl.html\'"></div>\n<div id="main" class="min_contain">\n    <div class="main clearfix">\n        <ul class="create_btn_group">\n            <li class="btn-main" ng-if="isEditor" page-tpl-types ng-href="#/scene/create/2442?pageId=1">页面模板</li>            \n        </ul>\n\n        <div class="info"><!-- \n            <h3>我的场景</h3> -->\n            <ul ng-show = "showScene" ng-init="showScene=true;showCustomer=false" class="clearfix">\n                <li ng-if="!branchid" style = "float:right;">\n                    <a href="#/scene" alt="创建场景" title="创建场景">\n                        <div class="chuangjian"></div>\n                    </a>\n                </li>                 \n                <li>\n                    <div class="phone" ng-click="showTip()">\n                        <h1 class="baseColor">{{allPageCount || 0 | fixnum}}</h1>\n                        <h2>场景总计</h2>\n                    </div>\n                </li>\n                <li><a href="#/main/spread">\n                    <div class="eye">\n                        <h1 class="secondaryColor"><span>{{allPageView || 0 | fixnum}}</span></h1>\n                        <h2>场景展示</h2>\n                    </div></a>\n                </li>\n                <li>\n                    <div class="show">\n                        <h1 class="secondaryColor"><span>{{allSceneDataCount || 0 | fixnum}}</span></h1>\n                        <h2>收集数据</h2>\n                    </div>\n                </li>               \n            </ul>\n        </div>        \n\n        <tabset justified="true">\n            <div class="content clearfix">\n                <div class="scene_type">\n                    <select ng-model="scene.type" ng-change="getMyScenes()" ng-options="scenetype.name for scenetype in scene.types">\n                        <option value="">全部</option>\n                    </select>\n                    <div ng-if="false">\n                        <img ng-src="{{CLIENT_CDN}}assets/images/test.gif">\n                    </div>\n                </div>\n                <div ng-hide="myScenes">\n                    该分类下还没有创建场景\n                    <span ng-if="!branchid">，请&nbsp;<a href="#/scene">创建场景</a></span>\n                </div>\n                <div class="mask fl" ng-show="myScenes">\n                    <ul class="scene_list">\n                        <li ng-repeat="scene in myScenes track by $index" ng-class="{mr0: $index%4 == 3}">\n                            <div ng-click="showDetail(scene.id)" class="scene_contain" ng-mouseover="scene.showCode = true" ng-mouseleave="scene.showCode = false">\n                                <a class="f1_container">\n                                    <div class="f1_card" style=" width: 100%; height: 235px;position:relative;" >\n                                        <!-- todo: 给发布过但未更新的场景加标志-->\n                                        <div class="pub-icon" ng-if="(!scene.publishTime || (scene.updateTime > scene.publishTime && scene.status != -1)) && !branchid" ng-click="publishScene(scene, $event);" title="点击发布场景">\n                                            <span style="" class="fa fa-refresh pub-ref"></span>\n                                        </div>\n                                        <div ng-if="!scene.showCode" class="front face" ng-style="getStyle(scene.image.imgSrc)">\n                                            <div class="check-state rejected" ng-if="scene.status == -1" style="">\n                                                <em class="fa fa-ban"></em>未通过审核\n                                            </div>\n                                            <div class="check-state checking" ng-if="scene.status == -2" style="">\n                                                <em class="fa fa-clock-o"></em>场景审核中\n                                            </div>\n                                        </div>\n                                        <div ng-if="scene.showCode" class="face front  qrcode" qr-code qr-url="{{PREFIX_CLIENT_HOST + \'v-\' + scene.code}}">\n                                        </div>\n                                    </div>\n                                </a>\n                            </div>\n                            <div class="scene_desc" title="{{scene.name}}">\n                                <span class="item_title">{{scene.name}}</span>    \n                                <div class="btn-group" ng-if="!branchid">\n                                    <div title="管理场景" class="glyphicon glyphicon-cog dropdown-toggle" data-toggle="dropdown">\n                                    </div>\n                                    <ul class="dropdown-menu" role="menu">\n                                        <li ng-click="sceneSettings(scene.id)">\n                                            <span class="set">设置</span>\n                                        </li>\n                                        <li ng-click="editScene(scene.id)">\n                                            <span class="edit">编辑</span>\n                                        </li>\n                                        <li ng-if="(!scene.publishTime || scene.updateTime > scene.publishTime && scene.status != -1) && scene.status != -1" ng-click="publishScene(scene)">\n                                            <span class="publish">发布</span>\n                                        </li>\n                                        <li ng-if="scene.status != -1 && scene.status != -2" ng-click="copyScene(scene.id)">\n                                            <span class="copy">复制</span>\n                                        </li>\n										<li ng-if="isAllowedToAccessTransfer && scene.status != -1 && scene.status != -2" ng-click="transferScene(scene.id)">\n                                            <span class="song">转送</span>\n                                        </li>\n                                        <li ng-if="scene.isTpl == 0 && userProperty.type ==2 && scene.status != -1 && scene.status != -2" ng-click="creatCompanyTpl(scene.id,$index)">\n                                            <span class="companytpl">生成企业样例</span>\n                                        </li>\n                                        <li ng-if="scene.isTpl == 3 && userProperty.type ==2 && scene.status != -1 && scene.status != -2" ng-click="clearCompanyTpl(scene.id,$index)">\n                                            <span class="companytpl">取消企业样例</span>\n                                        </li>\n                                        <li ng-click="deleteScene(scene.id)">\n                                            <span class="delete">删除</span>\n                                        </li>\n                                    </ul>\n                                </div>        \n                            </div>\n                            <div class="bottom_info">\n                                <div style = "position:relative; top:32px; float: right; margin-right: 15px; cursor: pointer;">\n                                    <div ng-if="!scene.publishTime">\n                                        未发布\n                                        <span style="color: #ff0000; display:inline;">!</span>\n                                    </div>\n                                    <div ng-if="!branchid">\n                                        <img title="点击关闭场景" ng-src="{{CLIENT_CDN}}assets/images/main/opened.png" ng-if = "scene.status == 1 && scene.publishTime" ng-click = "openScene(scene, false)"/>\n                                        <img title="点击开放场景" ng-src="{{CLIENT_CDN}}assets/images/main/closed.png" ng-click = "openScene(scene, true)" ng-if = "scene.status == 2 && scene.publishTime"/>\n                                    </div>\n                                    <div ng-if="branchid">\n                                        <span ng-if="scene.status == 1 && scene.publishTime">开放</span>\n                                        <span ng-if="scene.status == 2 && scene.publishTime">关闭</span>\n                                    </div>\n                                </div>\n                                <span>场景展示：<em class="baseColor"><a ng-href="#/main/spread/{{scene.id}}">{{scene.showCount | fixnum}}</a></em><em class="grey">&nbsp;次</em></span>\n                                <span>收集数据：<em class="baseColor"><a ng-href="#/my/scene/{{scene.id}}">{{scene.dataCount | fixnum}}</a></em><em class="grey">&nbsp;条</em></span>\n                            </div>\n                            \n                        </li>\n                    </ul>\n\n                </div>\n                <div class="clearfix fl" ng-show="myScenes">\n                    <pagination style="float: left" first-text="首页" last-text="尾页" previous-text="上一页" next-text="下一页" max-size="10" items-per-page="pageSize" total-items="totalItems" ng-model="currentPage" ng-change="pageChanged(currentPage)" boundary-links="true" rotate="true" num-pages="numPages"></pagination>\n                    <div class="current_page">\n                        <input type="text" ng-model="toPage" ng-keyup="$event.keyCode == 13 ? pageChanged(toPage) : null">\n                        <a ng-click="pageChanged(toPage)" class="go">GO</a>\n                        <span>当前: {{currentPage}} / {{numPages}} 页</span>\n                    </div>\n                </div>\n            </div>\n        </tabset>\n    </div>\n</div>\n\n<div ng-include="\'main/userGuide.tpl.html\'"></div>')//<div ng-include="\'footer.tpl.html\'"></div>
    }]),b.module("main/spread.tpl.html", []).run(["$templateCache", function (a) {
        a.put("main/spread.tpl.html", '<div ng-include="\'header.tpl.html\'"></div>\n<div id="main" class="min_contain">\n    <div class="main clearfix">\n        <ul class="create_btn_group">\n            <li class="btn-main" ng-if="isEditor" page-tpl-types ng-href="#/scene/create/2442?pageId=1">页面模板</li>            \n            <!-- <li><a class="btn-main hint--bottom hint--rounded" ng-click="createScene()" data-hint = "通过组件工具和页面模板创建">自主创建</a></li>\n            <li><a class="btn-secondary hint--rounded hint--bottom" href="#/scene" data-hint = "在推荐的样例场景上直接修改">样例创建</a></li> -->\n<!--             <li><a class="btn-main hint--bottom hint--rounded" href="#/scene" data-hint = "空白创建或通过已有样例创建场景">创建场景</a></li> -->\n        </ul>   \n\n        <div class="info">\n            <ul class="clearfix">\n                <li><a href="#/main">\n                    <!-- <span class="glyphicon glyphicon-folder-close secondaryColor"></span> -->\n                    <div class="phone">\n                        <h1 class="secondaryColor"><span>{{allPageCount || 0 | fixnum}}</span></h1>\n                        <h2>场景总计</h2>\n                    </div>\n                    </a>\n                </li>\n                <li><a href="#/main">\n                    <!-- <span class="glyphicon glyphicon-folder-open lightVioletColor"></span> -->\n                    <div class="kai">\n                        <h1 class="lightVioletColor"><span>{{openCount || 0 | fixnum}}</span></h1>\n                        <h2>开放场景</h2>\n                    </div></a>\n                </li>\n                <li>\n                    <!-- <span class="glyphicon glyphicon-eye-open baseColor"></span> -->\n                    <div class="eye">\n                        <h1 class="lightBlueColor"><span>{{allPageView || 0 | fixnum}}</span></h1>\n                        <h2>场景展示</h2>\n                    </div>\n                </li>\n                <li>\n                    <!-- <span class="glyphicon glyphicon-list-alt secondaryColor"></span> -->\n                    <div class="show">\n                        <h1 class="secondaryColor"><span>{{allSceneDataCount || 0 | fixnum}}</span></h1>\n                        <h2>已收集数据</h2>\n                    </div>\n                </li>\n            </ul>\n        </div> \n\n        <tabset justified="true">\n            <div class="content clearfix">\n                <div class="panel panel-default">\n                  <div class="panel-body">\n                    <div class="col-xs-4 text-center">\n                        <div class="circle-data" style="color: #08a1ef;"><span num-change-anim content="{{allPageView}}"><span></span></span></div>\n                        <div class="h5">场景展示</div>\n                    </div>\n                    <div class="col-xs-4 text-center">\n                        <div class="circle-data" style="color: #9ad64b;"><span num-change-anim content="{{allSceneDataCount}}"><span></span></span></div>\n                        <div class="h5">收集数据</div>\n                    </div>\n                    <div class="col-xs-4 text-center">\n                        <div class="circle-data" style="color: #68dcc7;"><span num-change-anim content="{{dataRatio}}"><span></span>%</span></div>\n                        <div class="h5">转换率</div>\n                    </div>\n                  </div>\n                </div>\n                \n                <div class="data">\n                    <!-- <div external-scopes="spreadScope" ui-grid="spreadGridOptions" class="myGrid"></div> -->\n                    <table class = "col-sm-12 table table-bordered text-center data-table" >\n                        <thead>\n                            <tr>\n                                <th>场景</th>\n                                <th>展示次数</th>\n                                <th>收集数据</th>\n                                <th>转化率</th>\n                                <th>详情</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            <tr ng-class="{hovercolor: trIndex==$index}" ng-repeat="spreadData in spreadDatas" ng-mouseenter="addColor($index)" ng-mouseleave="removeColor()">\n                                <td>{{spreadData.name}}</td>\n                                <td>{{spreadData.showCount}}</td>\n                                <td>{{spreadData.dataCount}}</td>\n                                <td>{{spreadData.showCount == 0 ? "0.00%":(spreadData.dataCount * 100/spreadData.showCount).toFixed(2) + "%"}}</td>\n                                <td><a class="glyphicon glyphicon-stats spread-detail" title="查看详情" ng-click="viewDetail(spreadData)"></a></td>\n                            </tr>\n                        </tbody>\n                    </table>\n                    <pagination style="float: left" first-text="首页" last-text="尾页" previous-text="上一页" next-text="下一页" max-size="10" items-per-page="10" total-items="totalItems" ng-model="currentPage" ng-change="pageChanged(currentPage)" boundary-links="true" rotate="true" num-pages="numPages"></pagination>\n                    <div class="current_page">\n                        <input type="text" ng-model="toPage" ng-keyup="$event.keyCode == 13 ? pageChanged(toPage) : null">\n                        <a ng-click="pageChanged(toPage)" class="go">GO</a>\n                        <span>当前: {{currentPage}} / {{numPages}} 页</span>\n                    </div>\n                    \n                </div>  \n            </div>\n        </tabset>\n    </div>\n</div>\n\n\n\n\n\n\n\n\n');//<div ng-include="\'footer.tpl.html\'"></div>

    }]),b.module("main/spreadDetail.tpl.html", []).run(["$templateCache", function (a) {
        a.put("main/spreadDetail.tpl.html", '<div ng-include="\'header.tpl.html\'"></div>\n<div id="main" class="min_contain">\n    <div id="spread" class="main clearfix">\n        <div class="spread_content">\n            <div class="panel panel-default" style="margin-top:0;">\n<!--               <div class="panel-heading" style="background-color:#FFF;"><span class="title">{{scene.name}}</span>&nbsp;&nbsp;<a style="padding-left:30px;font-size:16px;" target="_blank" ng-href="{{PREFIX_CLIENT_HOST + \'v-\' + scene.code}}">查看场景</a></div> -->\n              <div class="panel-body spread_ge">\n                <div class="fl">\n                    <img height="110px" ng-src="{{PREFIX_FILE_HOST + scene.image.imgSrc}}"/>\n                    <div class="scene_info" style="padding-left:10px;">\n                        <div class="" style="border-bottom:1px solid #e6e6e6"><a style="font-size:18px;color:#666;" target="_blank" ng-href="{{PREFIX_CLIENT_HOST + \'v-\' + scene.code}}">{{scene.name}}</a></div>\n                        <div>场景状态：<span ng-show="scene.status == \'1\'" style="color:#08a1ef">开放</span><span ng-show="scene.status == \'0\'">关闭</span></div>\n                        <div>修改时间：{{scene.updateTime | date:\'yyyy年MM月dd日\'}}</div>\n                        <div>创建时间：{{scene.createTime | date:\'yyyy年MM月dd日\'}}</div>\n                    </div>\n                    \n                </div>\n                <ul class="fr">\n                    <li><a href="#/main">\n                        <!-- <span class="glyphicon glyphicon-folder-close secondaryColor"></span> -->\n                        <div class="phone">\n                            <h1 class="secondaryColor"><span>{{scene.showCount || 0 | fixnum}}</span></h1>\n                            <h2>场景展示</h2>\n                        </div>\n                        </a>\n                    </li>  \n                    <li><a href="#/main/customer">\n                        <!-- <span class="glyphicon glyphicon-list-alt secondaryColor"></span> -->\n                        <div class="show">\n                            <h1 class="secondaryColor"><span>{{scene.dataCount || 0 | fixnum}}</span></h1>\n                            <h2>已收集数据</h2>\n                        </div></a>\n                    </li>                  \n                </ul>\n              </div>\n            </div>\n            <div class="chang_contain">\n                <div class="tab_two clearfix" ng-init="tabclass=\'tongji\'">\n                    <div ng-class="{hover: tabclass == \'tongji\'}" ng-click="tabclass=\'tongji\'">场景统计</div>\n                    <div ng-class="{hover: tabclass == \'tuiguang\'}" ng-click="tabclass= \'tuiguang\'">推广方法</div>\n                </div>\n                <div class="tab_contain">\n                    <div class="changjing_tongji clearfix" ng-show="tabclass == \'tongji\'">\n                        <div class="col-sm-2 fl">\n                            <div class="col-sm-12" style="padding: 0;">\n                              <ul class="nav nav-tabs tabs-left" ng-init="tabid=\'viewinfo\'">\n                                <li ng-class="{active: tabid == \'viewinfo\'}"><a ng-click="tabid=\'viewinfo\'">访问概况</a></li>\n                                <li ng-class="{active: tabid == \'mobileinfo\'}"><a ng-click="tabid=\'mobileinfo\'">移动访问</a></li>\n                                <li ng-class="{active: tabid == \'viewclick\'}"><a ng-click="tabid=\'viewclick\'">内容统计</a></li>\n                              </ul>\n                            </div>\n                        </div>\n                        <div class="col-xs-10 fr">\n                            <div class="view_info panel panel-default">\n                                <div class="panel-body" ng-init="interval=7">                                \n                                    <span class="btn btn-main" ng-class="{active: interval==1 }" ng-click="getLastdayStats();interval=1">昨天</span>\n                                    <span class="btn btn-main" ng-class="{active: interval==7 }" ng-click="getLast7dayStats();interval=7">7天</span>\n                                    <span class="btn btn-main" ng-class="{active: interval==30 }" ng-click="getLast30dayStats();interval=30">30天</span>\n                                </div>\n                            </div>\n                            <div class="view_info panel panel-default" ng-show="tabid == \'viewinfo\'">\n                                <div class="panel-body">\n                                    <div ng-show="spreadViewGridOptions.data && spreadViewGridOptions.data.length > 0">\n                                        <div class="title">展示次数</div>\n                                        <canvas ng-if="viewLineChartData" line-chart data="{{viewLineChartData}}" width="750" height="200"/>\n                                        <div class="title" style="margin-top:20px;">收集数据</div>\n                                        <canvas ng-if="dataLineChartData" line-chart data="{{dataLineChartData}}" width="750"  height="200"/>\n                                        <div class="data">\n                                            <div ui-grid="spreadViewGridOptions" class="myGrid1"></div>\n                                        </div>\n                                    </div>\n\n                                    <div class="data" ng-show="!spreadViewGridOptions.data || spreadViewGridOptions.data.length <= 0">\n                                        暂无数据\n                                    </div>\n                                </div>\n                            </div>\n\n                            <div class="view_info panel panel-default" ng-if="tabid == \'mobileinfo\'">\n                                <div class="panel-body">\n                                    <div ng-show="spreadMobileGridOptions.data">\n                                        <div class="col-xs-4 text-center">\n                                            <div class="circle-data" style="color: #08a1ef;">\n                                                <span num-change-anim content="{{timelineData}}"><span>\n                                            </div>\n                                        </div>                                \n                                        <div class="col-xs-4 text-center">\n                                            <div class="circle-data" style="color: #68dcc7;">\n                                                <span num-change-anim content="{{weixinGroupData}}"><span>\n                                            </div>\n                                        </div>\n                                        <div class="col-xs-4 text-center">\n                                            <div class="circle-data" style="color: #9ad64b;">\n                                                <span num-change-anim content="{{weixinData}}"><span>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div class="data" ng-show="spreadMobileGridOptions.data">\n                                        <div ui-grid="spreadMobileGridOptions" class="myGrid1"></div>\n                                    </div>\n\n                                    <div class="data" ng-show="!spreadMobileGridOptions.data || spreadMobileGridOptions.data.length <= 0">\n                                        暂无数据\n                                    </div>\n                                </div>\n                            </div>\n                              \n                            <div class="view_info panel panel-default" ng-show="tabid == \'viewclick\'">\n                                <div class="panel-body">\n                                    <div class="data" ng-show="spreadClickGridOptions.data">\n                                        <div ui-grid="spreadClickGridOptions" class="myGrid1"></div>\n                                    </div>\n                                    <div class="data" ng-show="!spreadClickGridOptions.data || spreadClickGridOptions.data.length <= 0">\n                                        暂无数据\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="tuiguang_content" ng-show="tabclass == \'tuiguang\'">\n                        <div class="weixin_title ">\n                            <ul class="clearfix" ng-init = "spreadclass = \'weixin\'">\n                                <li ng-class="{hover: spreadclass == \'weixin\'}" ng-click = "spreadclass = \'weixin\'">微信推广</li>\n                                <li ng-class="{hover: spreadclass == \'qq\'}" ng-click = "spreadclass = \'qq\'">QQ推广</li>\n                                <!-- <li ng-class="{hover: spreadclass == \'qr-code\'}" ng-click = "spreadclass = \'qr-code\'">扩展网址</li> -->\n                            </ul>\n                        </div>\n                        <div ng-show = "spreadclass == \'weixin\'">\n                            <div class="tuiguang_one tuiguang_same">\n                                <h1><span>1. 微信扫描分享到朋友圈</span></h1>\n                                <div class="weixin_friend" style="margin-bottom:40px">\n                                    <ul class="clearfix">\n                                        <li><div qr-code qr-url="{{PREFIX_CLIENT_HOST + \'v-\' + scene.code}}"></div></li>\n                                        <li><img ng-src="{{CLIENT_CDN}}assets/images/main/weixin_05.png" alt="" /></li>\n                                        <li><img ng-src="{{CLIENT_CDN}}assets/images/main/weixin_07.png" alt="" /></li>                                                                        \n                                    </ul>\n                                </div>\n                                <div class="weixin_step">\n                                    <ul class="clearfix">\n                                        <li><img ng-src="{{CLIENT_CDN}}assets/images/main/weixin_13.png" alt="" /></li>\n                                        <li><img ng-src="{{CLIENT_CDN}}assets/images/main/weixin_15.png" alt="" /></li>\n                                        <li><img ng-src="{{CLIENT_CDN}}assets/images/main/weixin_16.png" alt="" /></li>                                                                        \n                                    </ul>\n                                </div>                            \n                            </div>\n                            <div class="tuiguang_two tuiguang_same">\n                                <h1><span>2.通过微信公众号群发</span></h1>\n                                <div class="weixin_list">\n                                    <p class="medth">方法一</p>\n                                    <div class="weixin_list_con">\n                                        <p>群发消息，在微信公众账号群发消息时推广场景地址</p>\n                                        <div class="weixin_address clearfix">\n                                            <span class="" title="">{{url}}</span>\n                                            <a target="_blank" class="" ng-href="{{PREFIX_CLIENT_HOST + \'v-\' + scene.code}}">点击预览</a>\n                                        </div>\n                                        <div class="con_show clearfix">\n                                            <div style="color:#333;margin-top:20px;font-size:14px;font-weight:300;"><p style="float:left;">主动发送消息：请将这段“</p><xmp style="color:#333;font-weight:300;font-family:\'Microsoft Yahei\';margin:0px;padding:0px 0 0 0;float:left;"><a href="{{url}}">{{scene.name}}</a></xmp><p style="line-height:20px;">”修改和粘贴到群发消息中，点击下面群发</p></div>\n                                        </div>\n                                        <p style="margin-top:20px;">自动回复消息：在自动回复时设置回复内容为场景地址和场景名称。</p>\n                                    </div>\n                                </div>\n                                <div class="weixin_list">\n                                    <p class="medth">方法二</p>\n                                    <div class="weixin_list_con">\n                                        <p>群发消息，在微信公众账号群发消息时推广场景二维码</p>\n                                        <div class="weixin_erwei weixin_address clearfix">\n                                            <span>\n                                                <div qr-code qr-url="{{PREFIX_CLIENT_HOST + \'v-\' + scene.code}}"></div></span><a ng-href="{{PREFIX_SERVER_HOST + \'eqs/qrcode/\' + scene.code + \'.png\'}}" target="_blank" download>下载二维码</a>\n                                        </div>\n                                    </div>\n                                </div>                                                        \n                            </div>\n                            <div class="tuiguang_one tuiguang_same">\n                                <h1><span>3.公众号自定义菜单链接场景</span></h1>\n                                <div class="weixin_friend" style="margin-bottom:40px">\n                                    <ul class="clearfix">\n                                        <li><img ng-src="{{CLIENT_CDN}}assets/images/main/weixin_21.png" alt="" /></li>\n                                        <li><img ng-src="{{CLIENT_CDN}}assets/images/main/weixin_24.png" alt="" /></li>\n                                        <li><img ng-src="{{CLIENT_CDN}}assets/images/main/weixin_26.png" alt="" /></li>                                                                        \n                                    </ul>\n                                </div>\n                                <div class="weixin_step">\n                                    <ul class="clearfix">\n                                        <li><img ng-src="{{CLIENT_CDN}}assets/images/main/weixin_32.png" alt="" /></li>\n                                        <li><img ng-src="{{CLIENT_CDN}}assets/images/main/weixin_33.png" alt="" /></li>\n                                        <li><img ng-src="{{CLIENT_CDN}}assets/images/main/weixin_34.png" alt="" /></li>                                                                        \n                                    </ul>\n                                </div>                            \n                            </div>\n                        </div>\n                        <div ng-show = "spreadclass == \'qq\'">\n                            <div class="tuiguang_one tuiguang_same">\n                                <h1><span>1. 登录手机QQ扫描二维码</span></h1>\n                                <div class="weixin_friend" style="margin-bottom:40px">\n                                    <ul class="clearfix">\n                                        <li><div qr-code qr-url="{{PREFIX_CLIENT_HOST + \'v-\' + scene.code}}"></div></li>\n                                        <li><img ng-src="{{CLIENT_CDN}}assets/images/main/qq_03.jpg" alt="" /></li>\n                                        <li><img ng-src="{{CLIENT_CDN}}assets/images/main/qq_05.jpg" alt="" /></li>                                                                        \n                                    </ul>\n                                </div>\n                                <div class="weixin_step">\n                                    <ul class="clearfix">\n                                        <li><img ng-src="{{CLIENT_CDN}}assets/images/main/qq_10.jpg" alt="" /></li>\n                                        <li><img ng-src="{{CLIENT_CDN}}assets/images/main/qq_11.jpg" alt="" /></li>\n                                        <li><img ng-src="{{CLIENT_CDN}}assets/images/main/qq_12.jpg" alt="" /></li>                                                                        \n                                    </ul>\n                                </div>                            \n                            </div>\n                            <div class="tuiguang_two tuiguang_same">\n                                <h1><span>2.复制场景网址或二维码到QQ</span></h1>\n                                <div class="weixin_list">\n                                    <p class="medth">方法一</p>\n                                    <div class="weixin_list_con">\n                                        <p>复制场景网址， 到QQ群组或空间推广场景网址</p>\n                                        <div class="weixin_address clearfix">\n                                            <span class="" title="">{{url}}</span>\n                                            <a target="_blank" class="" ng-href="{{PREFIX_CLIENT_HOST + \'v-\' + scene.code}}">点击预览</a>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="weixin_list">\n                                    <p class="medth">方法二</p>\n                                    <div class="weixin_list_con">\n                                        <p>复制场景二维码， 到QQ群组或空间推广场景二维码</p>\n                                        <div class="weixin_erwei weixin_address clearfix">\n                                            <span>\n                                                <div qr-code qr-url="{{PREFIX_CLIENT_HOST + \'v-\' + scene.code}}"></div></span><a ng-href="{{PREFIX_SERVER_HOST + \'eqs/qrcode/\' + scene.code + \'.png\'}}" target="_blank" download>下载二维码</a>\n                                        </div>\n                                    </div>\n                                </div>                                                        \n                            </div>\n                        </div>   \n                        <div ng-show = "spreadclass == \'qr-code\'">\n                            <div class="tuiguang_two tuiguang_same">\n                                <h1><span>扩展网址</span></h1>\n                                <div class="weixin_list">\n                                    <p style="margin-bottom:20px;">生成扩展网址二维码，可以用于不同渠道，可以清晰统计每个渠道数据信息</p>\n                                    <p class="medth">场景网址</p>\n                                    <div class="weixin_list_con">\n                                        <div class="weixin_address clearfix">\n                                            <span class="" title="">{{url}}</span>\n                                            <a target="_blank" class="" ng-href="{{PREFIX_CLIENT_HOST + \'v-\' + scene.code}}">点击预览</a>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="weixin_list">\n                                    <div class="weixin_list_con">\n                                        <div class="weixin_erwei weixin_address clearfix">\n                                            <span>\n                                                <div qr-code qr-url="{{PREFIX_CLIENT_HOST + \'v-\' + scene.code}}"></div></span><a ng-href="{{PREFIX_SERVER_HOST + \'eqs/qrcode/\' + scene.code + \'.png\'}}" target="_blank" download>下载二维码</a>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="kuozhan weixin_list">\n                                    <div class="add-web" ><a ng-click="addWeb(expandWebs)"><b>+</b>增加扩展网址</a><p class="medth">扩展网址</p></div>\n                                    <div class="kuozhan-title">\n                                        <span class="name">名称</span><span>二级网址</span>\n                                    </div>\n                                    <div ng-repeat = "web in expandWebs track by $index" class="kuozhan-list clearfix">\n                                        <div class="kuozhan-name">\n                                            <input type="text" value="" placeholder="名称{{$index+1}}">\n                                        </div>\n                                        <div class="kuozhan-web">\n                                            <div>\n                                                <span class="" title="">{{url}}web{{$index}}</span>\n                                                <a target="_blank" class="" ng-href="{{PREFIX_CLIENT_HOST + \'v-\' + scene.code + $index}}">点击预览</a> \n                                            </div>\n                                            <div class="weixin_list_con">\n                                                <div class="delete-web"><a ng-click="deleteWeb($index,expandWebs)">删除扩展网址</a></div>\n                                                <div class="weixin_erwei weixin_address clearfix">\n                                                    <span>\n                                                        <div qr-code qr-url="{{PREFIX_CLIENT_HOST + \'v-\' + scene.code + \'web\' +$index}}">\n                                                        </div>\n                                                    </span>\n                                                    <a ng-href="{{PREFIX_SERVER_HOST + \'eqs/qrcode/\' + scene.code + \'web\' + $index + \'.png\'}}" target="_blank" download>下载二维码\n                                                    </a>\n                                                </div>\n                                            </div>                                 \n                                        </div>\n                                    </div>                                    \n                                </div>                                                        \n                            </div>\n                        </div>                                              \n                    </div>\n                </div> \n            </div>                 \n        </div>\n            \n    </div>\n</div>\n')  //<div ng-include="\'footer.tpl.html\'"></div>')
    }]),b.module("main/userGuide.tpl.html", []).run(["$templateCache", function (a) {
        a.put("main/userGuide.tpl.html", '<div style="position: fixed; left: 0; top: 0; bottom: 0; right: 0; background: rgba(0,0,0,0.8); z-index: 10000;" ng-show="firstLogin" ng-click="firstLogin = false;" ng-controller="userGuideCtrl">\n    <div style="width: 1000px; margin: 0 auto;">\n        <img style="margin: 109px 66px 0 30px; float: right;" src="{{CLIENT_CDN}}assets/images/chuangjian.png">\n        <img style="margin: 140px 0 0 0; float: right;" src="{{CLIENT_CDN}}assets/images/guide_main.png">\n    </div>\n</div>')
    }]),b.module("my/myscene.tpl.html", []).run(["$templateCache", function (a) {
        a.put("my/myscene.tpl.html", '<div ng-include="\'header.tpl.html\'"></div>\n<div class="myscene">\n    <div class="main clearfix">\n        <div class="content">\n            <div class="fl">\n                <iframe style="border: 0; width: 322px; height: 641px;" ng-src="{{customUrl}}"></iframe>\n            </div>  \n            <div class="rcont" data-ng-init = "init()">\n                <div class="top" style="background-color:#FFF">\n                    <div class="title">\n                        <!--添加外部div class="scen_top_title"-->\n                        <div class="scen_top_title">\n                            <h1 title="{{scene.sceneName}}">{{scene.name}}</h1>\n                            <!-- <a title="编辑场景" href="#/scene/create/{{sceneId}}?pageId=1" class="glyphicon glyphicon-edit" tooltip = "编辑场景" tooltip-placement = "right" tooltip-append-to-body = "true" ></a> -->\n                        </div>\n                        <div ng-if="!hideOpea">\n                            <a class="btn-main" tooltip = "发布场景" tooltip-placement = "right" tooltip-append-to-body = "true" ng-click="publishScene(sceneId)">发布场景</a>\n                            <a class="btn-main" ng-href = "#/my/sceneSetting/{{sceneId}}" tooltip = "修改场景设置" tooltip-placement = "right" tooltip-append-to-body = "true" >场景设置</a>\n                            <a class="btn-main" ng-click = "closeScene(sceneId)" tooltip = "关闭场景" tooltip-placement = "right" tooltip-append-to-body = "true" ng-if = "showCloseSceneBtn">关闭场景</a>\n                            <a class="btn-main" ng-click = "openScene(sceneId)" tooltip = "开放场景" tooltip-placement = "right" tooltip-append-to-body = "true" ng-if = "showOpenSceneBtn">开放场景</a>\n                        </div>\n                    </div>                  \n                    <div class="info">\n                        <div style="margin-right: 20px;">\n                            <a href="#/main/spread">\n                            <!-- <span class="glyphicon glyphicon-eye-open secondaryColor"></span> -->\n                            <div class="eye">\n                                <h1><span>{{scene.showCount >= 0 ? scene.showCount : 0 | fixnum}}</span></h1>\n                                <h2>场景展示</h2>\n                            </div></a>\n                        </div>                           \n                        <div>\n                            <a ng-click = "goData()">\n                            <!-- <span class="glyphicon glyphicon-list-alt baseColor"></span> -->\n                            <div class="show">\n                                <h1 class="baseColor"><span>{{totalItems | fixnum}}</span></h1>\n                                <h2>收集数据</h2>\n                            </div></a>\n                        </div>                                          \n                    </div>\n                </div>\n\n                <div class="bom" style="background-color:#FFF;">\n                    <div class="title">\n                        <span class="title_text">快速推广场景</span>\n                    </div>\n                    <div class="share_content">\n                        <ul>\n                            <li style="width: 250px;margin-right: 40px;">\n                                <div class="share_header" style="margin-bottom: 0;">\n                                    <span class="num">1</span>\n                                    <span class="share_title" style="width: 210px;">微信分享</span>\n                                </div>\n                                <div style="margin:17px 0 15px 40px" class="wc_code qr-code" qr-code qr-url="{{url}}"><!-- <img ng-src="{{code}}" width="240" alt=""> --></div>\n                                <p style="margin-left:40px;" style="color: #999;">现在扫一扫马上分享给朋友圈！</p>\n                            </li>\n\n                            <li style="margin-bottom: 50px;">\n                                <div class="share_header">\n                                    <span class="num">2</span>\n                                    <span class="share_title" style="width: 289px;">社交网络分享</span>\n                                </div>\n                                <div class="bdsharebuttonbox" data-tag="share_1">\n                                    <a class="bds_tsina" data-cmd="tsina"></a>\n                                    <a class="bds_tqq" data-cmd="tqq"></a>\n                                    <a class="bds_qzone" data-cmd="qzone" href="#"></a>\n                                    <a class="bds_sqq" data-cmd="sqq" href="#"></a>\n                                    <a class="bds_douban" data-cmd="douban" href="#"></a>\n                                    <a class="bds_count" data-cmd="count"></a>\n                                </div>\n                            </li>\n\n                            <li>\n                                <div class="share_header">\n                                    <span class="num">3</span>\n                                    <span class="share_title" style="width: 289px;">场景网址</span>\n                                </div>\n                                <p>\n                                    <span class="fl scene_url" title="{{url}}">{{url}}</span>\n                                    <a target="_blank" ng-href="{{url}}" class="tg_btn fl">点击预览</a>\n                                </p>\n                            </li>\n                        </ul>\n                    </div>\n                    <div class = "changjing_caozuo">\n                        <a ng-if="!branchid" href="#/scene/create/{{sceneId}}?pageId=1" class="btn-secondary" >编辑场景</a>\n                    </div>                    \n                </div>                \n            </div> \n            </div> \n            <div class="col-sm-12 export" ng-if="totalItems" id="collectData">\n                <span class="data_title">已收集数据</span>\n                <a ng-href="{{JSON_URL + \'?c=scenedata&a=excel&id=\' + sceneId}}">\n                    <span class="export_excel">导出excel</span>\n                </a>\n            </div>      \n            <div class="data">\n                <table class="header_table col-sm-12">\n                    <tr>\n                        <td class="data_header" ng-repeat="header in dataHeader track by $index">{{header}}</td>\n                    </tr>\n                </table>\n                <table>\n                    <tr ng-repeat="data in dataList">\n                        <td title="{{item}}" ng-repeat="item in data track by $index" ng-style="getTdStyle($index);">{{item}}</td>\n                    </tr>\n                </table>\n                <div ng-show="totalItems">\n                    <pagination style="float: left;" first-text="首页" last-text="尾页" previous-text="上一页" next-text="下一页" max-size="10" items-per-page="10" total-items="totalItems" ng-model="currentPage" ng-change="pageChanged(currentPage)" boundary-links="true" rotate="true" num-pages="numPages"></pagination>\n                    <div class="current_page">\n                        <input type="text" ng-model="toPage" ng-keyup="$event.keyCode == 13 ? pageChanged(toPage) : null">\n                        <a ng-click="pageChanged(toPage)" class="go">GO</a>\n                        <span>当前: {{currentPage}} / {{numPages}} 页</span>\n                    </div>\n                </div>\n            </div>\n\n        </div>\n    </div>\n</div>\n\n<script type="text/javascript">\n</script>\n')//<div ng-include="\'footer.tpl.html\'"></div>
    }]),b.module("my/sceneSetting.tpl.html", []).run(["$templateCache", function (a) {
        a.put("my/sceneSetting.tpl.html", '<div ng-include="\'header.tpl.html\'"></div>\n<div class="myscene min-contain">\n	<div class="main clearfix">\n	    <div class="content">\n	        <div class="fl">\n	            <iframe style="border: 0; width: 322px; height: 641px;" ng-src="{{customUrl}}"></iframe>\n	        </div> \n			<div class="rcont">\n			    <div class="top" style = "height: auto;">                  \n			        <div class = "setting-panel">\n			            <div class="alert alert-warning" role="alert" ng-if = "invalidText">\n			                {{invalidText}}\n			            </div>\n			            <form class="form-horizontal" role="form" name = "myForm" novalidate>\n				            <div class="form_img_input clearfix">\n						        <div class="title">\n						            <h1 title="场景基本信息设置">基本设置</h1>\n						        </div>				            	\n				                <div class="form-group form_upload col-sm-4">\n				                    <div class = "cover-panel" style = "margin-left: 20px;">\n				                        <div class = "cover-list" >\n				                          <nobr>\n				                            <ul>\n				                                <li class="cover-img" style = "" title="更换此场景封面"><a ng-click = "openImageModal()" style="display:block;"><img style = "width:190px; height:190px;" ng-src="{{PREFIX_FILE_HOST +  scene.image.imgSrc}}" /><em>更换场景封面</em></a></li>\n				                            </ul>\n				                          </nobr>\n				                    	</div>\n				                    </div>\n				                </div>				            	\n				            	<div class="form_input_groups col-sm-8">\n					                <div class="form-group control-group">\n					                    <label for="name" class="col-sm-3 control-label">场景名称</label>\n					                    <div class="col-sm-9">\n					                        <input name = "name" type="text" class="form-control" id="name" placeholder="场景名称" ng-model = "scene.name">\n					                    </div>\n					                </div>\n					                <div class="form-group">\n					                    <label for="type" class="col-sm-3 control-label">场景类型</label>\n					                    <div class="col-sm-9">\n					                        <select ng-model="scene.type" ng-options="scenetype.name for scenetype in types" id = "type" class = "form-control"></select>\n					                    </div>\n					                </div>\n					                <div class="form-group">\n					                    <label for="page_mode" class="col-sm-3 control-label">翻页方式</label>\n					                    <div class="col-sm-9">\n					                        <select ng-model="scene.pageMode" ng-options="pagemode.name for pagemode in pagemodes" id = "page_mode" class = "form-control"></select>\n					                    </div>\n					                </div>\n					                <div class="form-group">\n					                    <label for="description" class="col-sm-3 control-label">场景描述</label>\n					                    <div class="col-sm-9">\n					                        <textarea ng-model = "scene.description" class="form-control" rows="2" id = "description" name = "description" maxlength = "30" placeholder="你可以写下30字的场景描述哦！"></textarea>\n					                    </div>\n					                </div>					                \n					            </div>\n					        </div>\n					        <div class="gao_shezhi">\n						        <h1 class="gao-title" style=""></h1>\n				                <section ng-if="!scene.image.isAdvancedUser && !hideAd">\n				                    <div class="form-group">\n				                        <label for="page_mode" class="last-page control-label"></label>\n				                        <div class = "cover-panel ml-20">\n				                            <div class = "cover-list col-sm-11 last-cover" style="">\n				                              	<nobr>\n				                                	<ul>\n				                                    	<li class="cover-img1" ng-repeat="pageTpl in pageTpls" img-click\n				                                    	ng-click = "chooseLastPage(pageTpl.id)">\n				                                    		<a href="">\n				                                    			<img ng-class="{checked: scene.image.lastPageId == pageTpl.id}" class="lp-list" style = "" ng-src="{{PREFIX_FILE_HOST + pageTpl.properties.thumbSrc}}"/>\n				                                    		</a>\n				                                    	</li>\n				                                	</ul>\n				                              	</nobr>\n				                        	</div>\n				                        </div>\n				                    </div>\n				                </section>\n				                <div class="form-group" class="mt-15" ng-if="false">\n				                  <label for="start_date" class="col-sm-2 control-label">开放时间</label>\n				                  <div>\n				                    <div style = "margin-left: 130px;" class="input-group col-sm-3 col-sm-offset-2">\n				                    <input type="text" class="form-control" datepicker-popup="{{format}}" ng-model="startDate" is-open="openedmin" min-date="minDateStart" max-date="maxDateStart" datepicker-options="dateOptions" ng-required="true" close-text="关闭" clear-text = "清除" current-text = "今天" placeholder = "开放时间" readonly/>\n				                    <span class="input-group-btn">\n				                      <button type="button" class="btn btn-default" ng-click="openmin($event)" ng-disabled = "alwaysOpen"><i class="glyphicon glyphicon-calendar"></i></button>\n				                    </span>\n				                  </div>\n				                  <div class="input-group col-sm-3 col-sm-offset-6" style = "margin-top: -35px;">\n				                    <input type="text" class="form-control" datepicker-popup="{{format}}" ng-model="endDate" is-open="openedmax" min-date="minDateEnd" max-date="\'2015-06-22\'" datepicker-options="dateOptions" ng-required="true" close-text="关闭"  clear-text = "清除" current-text = "今天" placeholder = "结束时间"  readonly/>\n				                    <span class="input-group-btn">\n				                      <button type="button" class="btn btn-default" ng-click="openmax($event)" ng-disabled = "alwaysOpen"><i class="glyphicon glyphicon-calendar"></i></button>\n				                    </span>\n				                  </div>\n				                  <div class="checkbox col-sm-offset-9" style = "margin-top: -35px;">\n				                    <label style = "padding-left: 40px;">\n				                      <input type="checkbox" ng-model = "alwaysOpen" ng-change = "switchOpen()"> 不限制\n				                    </label>\n				                  </div>\n				                  </div>\n				                </div>\n				                <div ng-if = "scene.createTime > 1416502800000" class="form-group" ad-set>\n				                    <label for="description" class="col-sm-2 control-label" ng-if="!scene.image.isAdvancedUser && !hideAd"></label>\n				                    <div class="col-sm-10" ng-if="!scene.image.isAdvancedUser && !hideAd" style = "padding-left:0px;">\n				                        <label style = "padding-top: 7px;">\n				                          <input type="checkbox" ng-change = "hideAdd()" ng-model = "scene.image.hideEqAd" /><span style = "font-weight: 100;"></span>\n				                        </label>\n				                    </div>\n				                    <div class="form-group youlian-set" ng-if="scene.image.isAdvancedUser || hideAd">\n				                    	<label  for="description" style="margin-left:10px;" class="col-sm-2 control-label"></label>\n				                        <div class="my-xd" style = ""><span>{{userXd | fixnum}}</span></div>\n				                        <div class="get-xd"><a href="#" target = "_blank"></a></div>\n				                    </div>\n				                    <div class="form-group youlian-set hide-label" ng-if="!scene.image.isAdvancedUser && !hideAd">\n				                        <div class="my-xd" style = ""><span>{{userXd | fixnum}}</span></div>\n				                        <div class="get-xd"><a href="#" target = "_blank"></a></div>\n				                    </div>\n				                    <section style="margin-left: 15px;" ng-if="\n				                    scene.image.isAdvancedUser && !hideAd">\n					                    <div class="form-group">\n					                        <label for="page_mode" style="margin-left:35px;padding:5px 0;" class="control-label"></label>\n					                        <div class = "cover-panel" style = "margin-left: 20px;">\n					                            <div class = "cover-list col-sm-11 bottom-list" style="">\n					                              	<nobr>\n					                                	<ul>\n					                                		<li style = ""\n					                                    	ng-click = "chooseBottomLabel()">\n					                                    		<a href="">\n					                                    			<img class="static-img" ng-class="{checked: !scene.property.bottomLabel.id \n					                                    			&& !hideAd && !scene.image.hideEqAd}" style = "" ng-src="{{CLIENT_CDN}}assets/images/defaultBottomLabel.jpg"/>\n					                                    		</a>\n					                                    	</li>\n					                                    	<li\n					                                    	ng-click = "hideAdd(\'image\')"ng-mouseenter="showXd = true;" ng-mouseleave="showXd = false;" >\n					                                    		<a style="position:relative;" href="">\n					                                    			<span class="cost-xd"ng-if="showXd"></span>\n					                                    			<img ng-class="{checked: scene.image.hideEqAd}" ng-src="{{CLIENT_CDN}}assets/images/noBottomLabel.jpg"/>\n					                                    		</a>\n					                                    	</li>\n					                                    	<li ng-repeat="bottomPageTpl in bottomPageTpls"\n					                                    	ng-click="chooseBottomLabel(bottomPageTpl.id)">\n					                                    		<a href="">\n					                                    			<img ng-class="{checked: scene.property.bottomLabel.id == bottomPageTpl.id}" ng-src="{{PREFIX_FILE_HOST + bottomPageTpl.properties.thumbSrc}}"/>\n					                                    		</a>\n					                                    	</li>\n					                                	</ul>\n					                              	</nobr>\n					                        	</div>\n					                        </div>\n					                    </div>\n					                </section>\n				                </div>	\n			                	<div ng-if="scene.property.bottomLabel.id" class="form-group" ng-if="!hideAd && isAdvancedUser">\n				                    <label for="page_mode" class="col-sm-2 control-label"></label>\n				                    <div class="col-sm-4">\n				                        <input type="text" ng-model="scene.property.bottomLabel.name"/>\n				                    </div>\n				                    <label for="page_mode" class="col-sm-2 control-label"></label>\n				                    <div class="col-sm-4">\n				                        <input type="text" ng-model="scene.property.bottomLabel.url" ng-init="scene.property.bottomLabel.url=\'http://\'"/>\n				                    </div>\n				                </div>\n				                <div class="form-group" style = "margin-top: 25px;">\n				                    <label for="share" class="col-sm-2 control-label"></label>\n				                    <div class="checkbox col-sm-offset-2">\n				                      <label style = "tui-title">\n				                        <input id = "share" type="checkbox" ng-true-value = "1" ng-false-value = "0" ng-model = "scene.applyPromotion"/>\n				                        \n				                        <span class="samp-tip" style = ""></span>\n				                      </label>\n				                    </div>\n				                </div>\n				                <div ng-show="userProperty.type ==2 && scene.status != -1 && scene.status != -2" class="form-group" style = "margin-top: 25px;">\n				                    <label for="companytpl" class="col-sm-2 control-label"></label>\n				                    <div class="checkbox col-sm-offset-2">\n				                        <label style="tui-title">\n				                            <input id="companytpl" ng-true-value = "3" ng-false-value="0" ng-model="scene.isTpl" type="checkbox" />\n				                            \n				                            <span class="samp-tip"> </span>\n				                        </label>\n				                    </div>\n				                </div>				                \n				                <div class="checkbox col-sm-offset-2" ng-if="isVendorUser" style="margin-bottom:25px;margin-left:96px;" >\n				                    <label class="samp-title">\n				                        <input id = "share" type="checkbox" value="" ng-true-value = "1" ng-false-value = "0" ng-model = "scene.applyTemplate" />\n				                        申请作为样例\n				                        <span class="samp-tip">(审核通过后，每做一个样例送100个秀点)</span>\n				                    </label>\n				                </div>\n\n				                <div class = "changjing_caozuo">\n		            				<a href="#/scene/create/{{sceneId}}?pageId=1" class="btn-secondary" style="margin-right:10px">编辑场景</a>\n				                    <a ng-click = "saveSceneSettings(scene)" class="btn-save">保存设置</a>\n				                </div>\n					        </div>\n			            </form>                 \n			        </div>\n			    </div>\n			</div>\n		</div>\n	</div>\n</div>\n')  //<div ng-include="\'footer.tpl.html\'"></div>');

    }]),b.module("my/upload.tpl.html", []).run(["$templateCache", function (a) {
        a.put("my/upload.tpl.html", '<div nv-file-drop="" uploader="uploader">\n\n        <div class="container">\n\n            <div class="row">\n\n                <div class="col-md-3">\n                    <div ng-show="uploader.isHTML5">\n                        <!-- 3. nv-file-over uploader="link" over-class="className" -->\n                        <div ng-show="category.fileType != \'2\'" class="well my-drop-zone" nv-file-over="" uploader="uploader">\n                            拖拽图片到此区域\n                        </div>\n                        <div ng-show="category.fileType == \'2\'" class="well my-drop-zone" nv-file-over="" uploader="uploader">\n                            拖拽音乐到此区域\n                        </div>\n                    </div>\n\n                    <!-- Example: nv-file-select="" uploader="{Object}" options="{Object}" filters="{String}" -->\n                    \n                    <div id="upload_btn" class="btn-main">\n                        <span ng-show="category.fileType == \'0\' || category.fileType == \'1\'">选择图片</span>\n                        <span ng-show="category.fileType == \'2\'">选择音乐</span>\n                        <input type="file" id="uploadBtn" ng-click = "removeQueue()" nv-file-select="" uploader="uploader" multiple/>\n                    </div>\n                    <br/>\n\n                </div>\n\n                <div class="col-md-9" style="margin-bottom: 40px">\n                    <!-- <p>等待上传图片个数: {{ uploader.queue.length }}</p> -->\n                    <p ng-show="category.fileType == \'1\' && !category.headerImage && !category.coverImage">每次最多上传5张图片，上传图片建议大小在3M以内，格式为jpg\\bmp\\png\\gif</p>\n                    <p ng-show="category.fileType == \'0\'">上传图片建议像素为640px*1008px，上传图片大小在3M以内，格式为jpg\\bmp\\png\\gif</p>\n                    <p ng-show="category.fileType == \'2\'">上传音乐大小不超过3M，格式为mp3</p>\n                    <p ng-show = "category.fileType == \'1\' && (category.headerImage || category.coverImage)">上传图片建议像素为250px*250px，上传图片大小在3M以内，格式为jpg\\bmp\\png\\gif</p>\n                    <table class="table">\n                        <thead>\n                            <tr>\n                                <th width="50%">名称</th>\n                                <th ng-show="uploader.isHTML5">大小</th><!-- \n                                <th ng-show="uploader.isHTML5">进度</th>\n                                <th>操作</th> -->\n                            </tr>\n                        </thead>\n                        <tbody>\n                            <tr ng-repeat="item in uploader.queue">\n                                <td>\n                                    <strong>{{ item.file.name }}</strong>\n                                    <!-- Image preview -->\n                                    <!--auto height-->\n                                    <!--<div ng-thumb="{ file: item.file, width: 100 }"></div>-->\n                                    <!--auto width-->\n                                    <div ng-show="uploader.isHTML5" ng-thumbnail="{ file: item._file, height: 100 }"></div>\n                                    <!--<div ng-thumbnail="{ file: item._file, height: 100 }"></div>\n                                    fixed width and height -->\n                                    <!--<div ng-thumb="{ file: item.file, width: 100, height: 100 }"></div>-->\n                                </td>\n                                <td ng-show="uploader.isHTML5" nowrap>{{ item.file.size/1024/1024|number:2 }} MB</td>\n                                 <td ng-show="uploader.isHTML5">\n                                    <div class="progress" style="margin-bottom: 0;">\n                                        <div class="progress-bar" role="progressbar" ng-style="{ \'width\': item.progress + \'%\' }"></div>\n                                    </div>\n                                </td>\n                                <!--<td nowrap>\n                                    <button type="button" class="btn btn-success btn-xs" ng-click="item.upload()" ng-disabled="item.isReady || item.isUploading || item.isSuccess">\n                                        <span class="glyphicon glyphicon-upload"></span> 上传\n                                    </button>\n                                    <button type="button" class="btn btn-warning btn-xs" ng-click="item.cancel()" ng-disabled="!item.isUploading">\n                                        <span class="glyphicon glyphicon-ban-circle"></span> 取消\n                                    </button>\n                                    <button type="button" class="btn btn-danger btn-xs" ng-click="item.remove()">\n                                        <span class="glyphicon glyphicon-trash"></span> 删除\n                                    </button>\n                                </td> -->\n                            </tr>\n                        </tbody>\n                    </table>\n\n                    <div>\n                        <!-- <div>\n                            上传进度:\n                            <div class="progress" style="">\n                                <div class="progress-bar" role="progressbar" ng-style="{ \'width\': uploader.progress + \'%\' }"></div>\n                            </div>\n                        </div> -->\n                        <button type="button" class="btn btn-secondary btn-s" ng-click="uploader.uploadAll()" ng-disabled="!uploader.getNotUploadedItems().length">\n                            <span class="glyphicon glyphicon-upload"></span> 上传\n                        </button>\n                       <!--  <button type="button" class="btn btn-warning btn-s" ng-click="uploader.cancelAll()" ng-disabled="!uploader.isUploading">\n                            <span class="glyphicon glyphicon-ban-circle"></span> 取消\n                        </button> -->\n                        <button type="button" class="btn btn-danger btn-s" ng-click="uploader.clearQueue()" ng-disabled="!uploader.queue.length">\n                            <span class="glyphicon glyphicon-trash"></span> 删除\n                        </button>\n                    </div>\n\n                </div>\n\n            </div>\n\n        </div>\n\n    </div>')
    }]),b.module("notifications.tpl.html", []).run(["$templateCache", function (a) {
        a.put("notifications.tpl.html", '<div ng-class="[\'alert\', \'alert-\'+notification.type]" ng-repeat="notification in notifications.getCurrent()" notification-fadeout>\n    <button class="close" ng-click="removeNotification(notification)">x</button>\n    {{notification.message}}\n</div>\n')
    }]),b.module("reg/agreement.tpl.html", []).run(["$templateCache", function (a) {
        a.put("reg/agreement.tpl.html", '<div class="about">\n    <div class="header">\n        <div class="content">\n            <div class="logo"><img ng-src="{{CLIENT_CDN}}assets/images/logo.png" alt=""></div>\n        </div>\n    </div>\n    <div class="banner">\n        <img ng-src="{{CLIENT_CDN}}assets/images/contact1.jpg"/>\n    </div>\n    <div class="main clearfix">\n              <div class="reg_xy">\n                <p>甲方：北龙中网（北京）科技有限责任公司</p>\n                <p>乙方：“App一秀”的注册用户（以下简称用户或“您”）</p>\n                <p class="para">您确认：在您开始“App一秀”产品试用或购买前，您已充分阅读、理解并接受本协议的全部内容，一旦您选择“同意”并开始使用本服务或完成购买流程，即表示您同意遵循本协议之所有约定。不具备前述条件的，您应立即终止注册或停止使用本服务。</p>\n                <p class="para">甲方有权随时对协议内容进行单方面的变更，并以在eqshow.cn公告的方式予以公布，无需另行单独通知您；若您在本协议内容公告变更后继续使用本服务，表示您已充分阅读、理解并接受修改后的协议内容，也将遵循修改后的协议内容使用本服务；若您不同意修改后的协议内容，您应停止使用本服务。您可以访问 http://www.eqshow.cn来了解最新版本的服务条款。</p>\n                </p>\n                <p>帐户注册及条款</p>\n                <p>1.  您保证具有法律规定的完全民事权利能力和民事行为能力，能够独立承担民事责任的自然人、法人或其他组织；本协议内容不会被您所属国家或地区的法律禁止。\n                <p>2.  具体操作使用人应该是自然人。不允许采用注册机或者类似的自动化方式注册账户。\n                <p>3.  当您注册时应当按网站要求提供您真实的信息及其他必要的信息以完成注册。\n                <p>4.  您的登录信息只能用于一个人，不允许多人共享登录信息。您可以在网站允许的前提下注册多个登录用户名密码。\n                <p>5.  您应当保护好自己的用户名及密码信息不被泄露。“App一秀”无法也不会保护因为您泄露用户名或密码导致的数据风险。\n                <p>6.  同一个用户只能拥有一个免费账户。\n                <p>7.  对于您以及您的账户所创建的内容负责。\n                <p>8.  您不得恶意攻击“App一秀”服务。\n                <p>9.  您不得复制、转售或转授权任何部分或者全部的”App一秀”服务。\n                <p>10. 甲方有权但并非义务删除以下内容：非法、歧视、恐吓、诽谤、色情、淫秽或者违反中国法律的。\n                <p>11. 您不得以口头或者文字方式攻击（包括恐吓、报复等）甲方客户、员工、成员或本产品及服务的其他使用者。\n                <p>12. 您不得上传或者发布垃圾邮件，短信，或上传计算机病毒程序或者恶意代码。\n                <p>13. 如果您的账户流量使用明显超过平均用户带宽使用，我们保留停用您的账户的权利，直到您降低您的流量使用。\n                <p>14. 您在本协议期间应遵守全部中国法律、法规和规章。\n                <p>15. 如果甲方因乙方的任何触犯中国法律法规的行为或违反本协议的行为而承受任何损失或损害，乙方应该采取所有行动使甲方免于承担责任，并对由此产生的全部损失和损害对乙方承担赔偿责任。\n                <p>16. 如果乙方存在任何触犯中国法律法规的行为或违反本协议的行为，甲方有权根据行为的严重性自行决定立即暂停或终止乙方对本服务的使用，甲方无须就服务暂停或终止对乙方承担任何责任，并且无须返还乙方已支付的当月费用。\n\n                <p>付费相关条款\n                <p>1.  “App一秀”产品目前仅提供免费产品供您使用，但甲方保留未来推出“App一秀”付费产品、功能或服务的权利。\n                <p>2.  您有权自由选择决定是否使用“App一秀”中的付费产品、功能或服务。\n                <p>产品服务条款\n                <p>1.  甲方将以专业的方式提供产品及服务，但并不保证：1) 产品及服务满足您的所有需求或您的所有期待； 2) 产品及服务没有任何失误或缺陷； 或3) 产品及服务中的所有错误都会被修正。甲方无须对任何第三方提供的产品或服务负责，亦不对第三方产品或服务提供任何保证。\n                <p>2.  甲方保留不断修改调整这项服务的权利，而无需事先通知乙方。\n                知识产权条款\n                <p>1.  您提交的各种内容版权归属于您。\n                <p>2.  您应当了解并授权“App一秀”及“App一秀”许可的用户可以传播、二次编辑、分享您通过App一秀编辑生成的作品。\n                <p>3.  甲方提供的服务及产品（包括但不限于观感、设计、图标、代码等）的版权、商标权、专利权及其他知识产权均归属于甲方。除非获得甲方明确书面允许，您不得复制、重用任何HTML/CSS, JavaScript或者任何视觉设计，也不得对甲方产品进行反向工程、分解或进行编译或其他修改。\n                <p>4.  本协议中未明确授予您的权利将由甲方保留。\n                <p>责任限制\n                在任何情况下、甲方均无须对任何间接性、后果性、惩戒性、偶然性、特殊性或刑罚性的损害(包括但不限于乙方因使用甲方服务而遭受的利润、收入损失、或预期的节约成本的损失或商誉损失等）承担责任，即使乙方已被告知该等损失的可能性。甲方对乙方承担的全部责任总额，无论因何原因（基于合同法、侵权法或其他法规）或何种行为方式产生，始终不超过乙方在当月服务期内因使用甲方服务而已经支付给甲方的费用。\n                服务取消与终止条款\n                <p>1.  您清楚的了解终止服务的后果。无需邮件或者电话确认，您可以在任何时候通过点击账户链接并执行相应操作来终止您的账户及相应的所有信息。\n                <p>2.  一旦终止，所有隶属于这个账户的数据及信息将由甲方作删除处理，并且无法恢复。\n                <p>3.  一旦终止账户，账户之下的用户将无法访问任何相关的服务。\n                <p>其他条款\n                <p>1.  您了解甲方使用第三方的运营商和网络提供商提供必要的硬件、软件、存储或网络来运行App一秀服务。甲方无需因为第三方的、或者不在甲方控制范围内的原因（如不可抗力）造成的运行问题（如服务中断、停顿、中止等）负责。\n                <p>2.  如果本协议的某一条款或某一条款的一部分无效或不可执行，不影响本协议其他条款的有效性，无效或不可执行的条款将被视作已从本协议中删除。\n                <p>3.  本协议受中华人民共和国法律管辖。 在执行本协议过程中如发生纠纷，双方应及时协商解决。协商不成时，任何一方均应向甲方所在地人民法院提起诉讼。\n                <p>4.  若有任何疑问，请通过浏览http://www.e.wesambo.com网站下方的联系方式与我们联系。\n\n            </div>\n        </div>\n    </div>\n</div>\n')  //<div ng-include="\'footer.tpl.html\'"></div>')
    }]),b.module("reg/reg.tpl.html", []).run(["$templateCache", function (a) {
        a.put("reg/reg.tpl.html", '<div><a ng-href="{{weiChatUrl}}">登录测试</a></div>')
    }]),b.module("sample/sample.tpl.html", []).run(["$templateCache", function (a) {
        a.put("sample/sample.tpl.html", '<div class="sample contain min_contain">	\n	    <header>\n	        <div class="we_nav content_center">\n	            <div class="link_list">\n	                <ul class="clearfix">\n	                    <li class="bg_hover"><a>用户案例</a></li>\n	                    <li ng-hide="isAuthenticated()"><a ng-click = "login()">登录</a></li>\n	                    <li ng-hide="isAuthenticated()" class=""><a ng-click = "register()">注册</a></li>\n	                    <li ng-show="isAuthenticated()"><a href="#/main">进入</a></li>\n	                </ul>\n	            </div>                  \n	            <div id="logo"><a href="#/home"><img ng-src="{{CLIENT_CDN}}assets/images/logo.png" alt=""></a></div>\n	        </div>    \n	    </header>\n	    <div class="content_center">\n<!-- 		    <div class="pv_contain clearfix">\n		    	<div class="img_pv_contain">\n			    	<div class="pv_images" >\n						<ul>\n							<li  class="con_list" ng-repeat="dayTop in dayTop" ng-show="page == \'day\'">\n							<a ng-href="{{PREFIX_CLIENT_HOST + \'v-\' + dayTop.code}}" target="_blank">\n								<div class="pv_images_cont">\n									<div ng-hide="showCode2 == true"><img ng-src="{{PREFIX_FILE_HOST + dayTop.image.imgSrc}}" alt="" width="235px" /></div>\n									<div ng-show="showCode2 == true" qr-code qr-url="{{PREFIX_FILE_HOST + dayTop.image.imgSrc}}" class="qrcode">\n									\n									</div>\n									<p class="anli_name" title="{{dayTop.name}}">{{dayTop.name}}</p>\n								</div>\n							</a>\n							<p class="changj_pv"><span class="er_name"><em>{{dayTop.userName}}</em><a ng-mouseover="showCode2 = true" ng-mouseleave="showCode2 = false" href="">二维码</a></span><span class="changj_show_num">展示:{{dayTop.showCount | fixnum}}</span></p>\n							\n						</li>\n						</ul>\n						<ul>\n							<li class="con_list" ng-repeat="monthTop in monthTop" ng-show="page == \'month\'">\n							<a ng-href="{{PREFIX_CLIENT_HOST + \'v-\' + monthTop.code}}" target="_blank">\n								<div class="pv_images_cont">\n									<div ng-hide="showCode1 == true"><img ng-src="{{PREFIX_FILE_HOST + monthTop.image.imgSrc}}" alt="" width="235px" /></div>\n									<div ng-show="showCode1 == true" qr-code qr-url="{{PREFIX_CLIENT_HOST + \'v-\' + monthTop.code}}" class="qrcode">\n									</div>\n								</div>\n								<p class="anli_name" title="{{monthTop.name}}">{{monthTop.name}}</p>\n							</a>\n							<p class="changj_pv"><span class="er_name"><em>{{monthTop.userName}}</em><a ng-mouseover="showCode1 = true" ng-mouseleave="showCode1 = false" href="">二维码</a></span><span class="changj_show_num">展示:{{monthTop.showCount | fixnum}}</span></p>\n							\n							</li>\n						</ul>\n						<ul>\n							<li class="con_list" ng-repeat="weekTop in weekTop" ng-show="page == \'week\'">\n							<a ng-href="{{PREFIX_CLIENT_HOST + \'v-\' + weekTop.code}}" target="_blank">\n								<div class="pv_images_cont" >\n									<div ng-hide="showCode3 == true"><img ng-src="{{PREFIX_FILE_HOST + weekTop.image.imgSrc}}" alt="" width="235px" /></div>\n									<div ng-show="showCode3 == true" qr-code qr-url="{{PREFIX_CLIENT_HOST + \'v-\' + weekTop.code}}" class="qrcode">\n									</div>\n									<p class="anli_name" title="{{weekTop.name}}">{{weekTop.name}}</p>\n								</div>\n\n							</a>\n							<p class="changj_pv"><span class="er_name"><em>{{weekTop.userName}}</em><a ng-mouseover="showCode3 = true" ng-mouseleave="showCode3 = false" href="">二维码</a></span><span class="changj_show_num">展示:{{weekTop.showCount | fixnum}}</span></p>\n							\n						</li>\n						</ul>\n			    	</div>		    			    			    			    	\n		 		</div>\n		    	<div class="pv_nav">\n		    		<h1><img ng-src="{{CLIENT_CDN}}assets/images/sample/desr.png" alt="" /></h1>\n		    		<ul class="clearfix">\n		    			<li ng-class="{hover:page == \'month\'}" ng-click="page = \'month\'">本月排名</li><li ng-class="{hover:page == \'week\'}" ng-click="page = \'week\'">本周排名</li><li ng-click="page = \'day\'" ng-class="{hover:page == \'day\'}">昨日排名</li>\n		    		</ul>\n		    	</div>\n		    </div> -->\n		    <div class="header_con">	\n			    <div class="sample_cat clearfix" data-ng-init="load()">\n			    	<div class="sample_images mains">\n			    		<div class="clearfix">\n							<div class="con_list" ng-repeat = "home in homes">\n								<a ng-href="{{PREFIX_CLIENT_HOST + \'v-\' + home.code}}" target="_blank">\n									<div ng-show="showCode == true" class="cj_img qrcode" qr-code qr-url="{{PREFIX_CLIENT_HOST + \'v-\' + home.code}}">\n										<!-- <img ng-src="{{PREFIX_SERVER_HOST + \'eqs/qrcode/\' + home.code + \'.png\'}}" alt="" width="235px" /> -->\n									</div>\n									<div ng-hide="showCode == true" class="cj_img"><img ng-src="{{PREFIX_FILE_HOST + home.image.imgSrc}}" alt="" width="235px" /></div>\n									<p class="anli_name" title="{{home.name}}">{{home.name}}</p>\n								</a>\n								<p class="clearfix"><span class="er_name"><em>{{home.userName}}</em><a ng-mouseover="showCode = true" ng-mouseleave="showCode = false" href="">二维码</a></span>场景展示:{{home.showCount | fixnum}}</p>\n							</div>\n						</div>\n						<div class="mores" ng-init = "showMoreButton = true;" ng-hide = \'homes.length < 9\'>\n					    	<a ng-click="showMore(type)" ng-show = \'showMoreButton\'>查看更多</a>\n					    	<p ng-show = "!showMoreButton" style="font-size:16px;">没有更多了</p>\n					    </div>\n					    <p style="text-align:center;margin-top:100px;" ng-show = \'homes.length <= 0\'>该分类下暂无场景</p>\n			    	</div>\n			    	<div class="sample_cats">\n				    	<div class="sample_fix fixed">\n				    		<h1><img ng-src="{{CLIENT_CDN}}assets/images/sample/case.png" alt="" /></h1>\n				    		<ul class="clearfix">\n			                    <li id="one1" ng-class="{hover:typeindex == \'all\'}" ng-click="getHomes(\'all\', null, 1, 9);type=null">全部案例</li>\n			                    <li ng-repeat = "sceneType in sceneTypes" ng-class = "{hover: typeindex == $index}" ng-click = "getHomes($index, sceneType.value, 1, 9)">\n			                        {{sceneType.name}}\n			                    </li>\n				    		</ul>\n				    	</div>\n			    	</div>	\n			    </div>    \n			</div>\n		</div>	\n</div>\n')  //<div ng-include="\'footer.tpl.html\'"></div>\n\n')
    }]),b.module("scene/console.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console.tpl.html", '<div>\n<div ng-show="comp_type==\'bg\'" ng-include="\'scene/console/bg.tpl.html\'" ng-controller="BgConsoleCtrl"></div>\n</div>')
    }]),b.module("scene/console/angle-knob.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/angle-knob.tpl.html", '<div class="sliderContainer">\n	<div class="sliderKnob"></div>\n</div>')
    }]),b.module("scene/console/anim.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/anim.tpl.html", '<div ng-if="activeTab == \'anim\'" ng-controller="AnimConsoleCtrl">\n	<div class="anim_area">\n		<div class="anim-panels" ng-if="animations.length">\n			<section ng-repeat="animation in animations track by $index">\n				<div class="style_list" ng-init="opea.show=true" ng-click="opea.show=!opea.show">\n			        <b class="caret" ng-if="opea.show"></b>\n			        <b class="caret off" ng-if="!opea.show"></b>\n			        动画&nbsp;{{$index+1}}\n			        <span style="padding-right: 10px;cursor:pointer;" class="fr" ng-click="removeAnim($index, $event)"><img title="删除此动画" ng-src="{{CLIENT_CDN + \'assets/images/delete.png\'}}" ></span>\n			    </div>\n			    <div ng-if="opea.show" class="style_list_angel clearfix">\n			        <label>方式</label>\n		        	<div class="flo_lef touming">\n		        		<select style="width:100px;border:1px solid #C9C9C9;" ng-model="types[$index]" ng-change="animation.type=types[$index].id; changeAnimation(animation, $index)" ng-options="animType.name group by animType.cat for animType in animTypeEnum">\n		            		<option value="-1">无</option>\n		        		</select>	        		\n		    		</div>\n			    </div>\n			    <div ng-if="opea.show && animation.type == 7" class="style_list_angel clearfix">\n			        <label>速度</label>\n		        	<div class="clearfix touming">\n			        	<div class="num" style="text-align:right;margin-top:4px;">\n			        		<input type="checkbox" value="" ng-model="animation.linear" ng-true-value="1" style="margin-right:2px;margin-top:0px;"/>匀速\n			        	</div>		        			        		\n		    		</div>\n			    </div>			    \n			    <div class="row" ng-if="animation.type != -1 && animation.type != null && opea.show">            \n			        <form role="form">\n			            <div class="style_list_angel clearfix" ng-show="animation.type == 1 || animation.type == 2">\n			                <label>方向</label>\n			                <div class="flo_lef touoming"><select style="color:#999" class="form-control" ng-model="directions[$index]" ng-change="animation.direction=directions[$index].id;changeAnimation(animation, $index)" ng-options="animDirection.name for animDirection in animDirectionEnum">\n			                </select></div>\n			            </div>\n			            <div class="style_list_angel">\n			                <label>时间</label>\n			                <div class="touming clearfix">\n			                    <p class="num"><input limit-input class="input_kuang short" type="number" step="0.1" min="0" max="20" ng-model="animation.duration" /></p>\n			                    <div class="num" style="width:100px;" ui-slider min="0" max="20" use-decimals step="0.1" ng-model="animation.duration"></div>\n			                </div>\n			            </div>              \n			            <div class="style_list_angel">\n			                <label>延迟</label>\n			                <div class="touming clearfix">\n			                    <p class="num"><input limit-input class="input_kuang short" type="number" step="0.1" min="0" max="20" class="form-control" ng-model="animation.delay"/></p>\n			                    <div class="num" style="width:100px;" ui-slider min="0" max="20" use-decimals step="0.1" ng-model="animation.delay"></div>\n			                </div>\n			            </div>\n			            <div class="style_list_angel">\n			                <label>次数</label>\n			                <div class="touming clearfix">\n			                    <p class="num" style="float:left;margin-right:10px;"><input ng-disabled  = "animation.count" limit-input class="input_kuang short" type="number" min="1" max="10" class="form-control" ng-model="animation.countNum" /></p>\n			                    <div class="num" style="text-align:right;margin-top:0px;"><input type="checkbox" value="" id="xunhuan" ng-model="animation.count" style="margin-right:2px;margin-top:0px;" />循环</div>\n			                </div>\n			                              \n			            </div>\n			        </form>                 \n			    </div>\n			</section>\n		</div>\n		<div class="add-anim">\n			<a ng-click="addAnim()" class="add-anims">添加动画</a>\n			<a style="margin-top:10px;" ng-click="previewAnim()" class="broad-anim">播放动画</a>\n		</div>\n	</div>\n</div>')
    }]),b.module("scene/console/audio.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/audio.tpl.html", '<div class="input_console">\n	<div class="modify_area">\n		<form class="form-horizontal" role="form">\n			<div class="category_list" style="padding-left:198px;">\n				<ul class="category_list_container clearfix">\n					<li ng-class="{active: category.value == model.bgAudio.type}" class="category_item" ng-repeat="category in categoryList" ng-click="model.bgAudio.type = category.value">\n						{{category.name}}\n					</li>\n				</ul>\n			</div>\n			<div ng-if="model.bgAudio.type == \'1\'" class="audio_area clearfix">\n				<span class="control-label" style="padding-top:12px;padding-right:5px;">链接地址</span>\n				<input class="" type="text" ng-model="model.type1" placeholder="请输入mp3文件链接" style="width:280px;height:35px;line-height:35px;border:1px solid #E7E7E7;border-radius:0px;padding-left:5px;font-size:12px;" />\n			</div>\n			<div ng-if="model.bgAudio.type == \'2\'" class="audio_area clearfix" style="height:auto;">\n				<select class="float-lf selectcartoon" ng-change="selectAudio(2)" ng-model="model.selectedMyAudio" ng-options="myAudio.name for myAudio in myAudios" id="nb_musicurl" style="padding-left:5px;width:280px;">\n	     			<option value="">选择我的音乐</option>\n	         	</select>\n	         	<span class="btn-main" ng-click="goUpload()">上传音乐</span>\n	         	<!-- <span ng-show="model.type2">\n					<a class="glyphicon glyphicon-play" ng-click="playAudio(1);" title="试听">\n		         		<audio id="audition1" ng-src="{{model.type2}}"></audio>\n		         	</a>\n		         	<a class="glyphicon glyphicon-pause" ng-click="pauseAudio(1);" title="暂停">\n		         	</a>  \n	         	</span> -->\n	         	<div ng-if = "model.type2" style = "margin-top:10px;">\n	         		<audio ng-src="{{model.type2}}" controls="controls">\n					</audio>								\n	         	</div>\n				<!-- <span class="btn-main" ng-click="goUpload()">上传音乐</span> -->\n			</div>\n			<div ng-if="model.bgAudio.type == \'3\'" class="audio_area clearfix">\n				<select class="float-lf selectcartoon" ng-change="selectAudio(3)" ng-model="model.selectedAudio" ng-options="reservedAudio.name for reservedAudio in reservedAudios" id="nb_musicurl" style="padding-left:5px;width:280px;height:35px;line-height:35px;border:1px solid #E7E7E7;">\n	     			<option value="">选择音乐库文件</option>\n	         	</select>\n	         	<!-- <span ng-show="model.type3">\n		         	<a class="glyphicon glyphicon-play" ng-click="playAudio(2);" title="试听">\n		         		<audio id="audition2" ng-src="{{model.type3}}"></audio>\n		         	</a>\n		         	<a class="glyphicon glyphicon-pause" ng-click="pauseAudio(2);" title="暂停">\n		         	</a>\n		        </span>   -->  	\n		        <div ng-if = "model.type3" style = "margin-top:10px;">\n	         		<audio  ng-src="{{model.type3}}" controls="controls">\n					</audio>								\n	         	</div>\n			</div>\n		</form>\n	</div>\n</div>\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确定</a>\n    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n</div>')
    }]),b.module("scene/console/bg.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/bg.tpl.html", '<div class="bg_console clearfix" style="background-color:#E7E7E7;">\n	<div class="fl" style="width:188px;">\n		 <ul class="nav nav-tabs tabs-left" style="padding-top:0px;"><!-- \'tabs-right\' for right tabs -->\n    		<li class="active" ng-click="changeCategory(\'0\')">\n    			<a href="" ng-show="fileType == \'0\'" ng-click="systemImages = false;" data-toggle="tab">我的背景</a>\n    			<a href="" ng-show="fileType == \'1\'" ng-click="systemImages = false;" data-toggle="tab">我的图片</a>\n    		</li>\n		    <li>\n		    	<a href="" ng-show="fileType == \'0\'" ng-click="systemImages = true; changeCategory(\'all\')" data-toggle="tab">背景库</a>\n		    	<a href="" ng-show="fileType == \'1\'" ng-click="systemImages = true; changeCategory(\'all\')" data-toggle="tab">图片库</a>\n		    </li>\n		  </ul>\n	</div>\n	<div class="fl" style="width:710px;padding:0 10px;background-color:#FFF;">\n		<div class="tab-content" id="bg_contain">\n	        <div class="tab-pane active" ng-show="!systemImages">\n	        	<div class="img_list" style="padding-bottom: 0px;">\n	        		<div class="category_list clearfix">\n						<ul class="category_list_container clearfix" style="width:610px;float:left;">\n							<li ng-class="{active: tagIndex == -1}" class="category_item" ng-click="changeCategory(\'0\');">\n								全部\n							</li>\n							<li ng-class="{active: tagIndex == $index}" class="category_item" ng-repeat="myTag in myTags" ng-mouseenter="hoverTag(myTag)" ng-mouseleave="hoverTag(myTag)" ng-click="getImagesByTag(myTag.id, $index)">\n								{{myTag.name}}<span ng-if="myTag.hovered" ng-click="deleteTag(myTag.id, $index, $event)">x</span>\n							</li>						\n						</ul>\n						<div class="category_item active" ng-click="createCategory();" style="float:right;">\n							创建分类\n						</div>						\n					</div>\n					<div class="edit">\n						<input type="checkbox" ng-model="allImages.checked" ng-change="selectAll()"/>&nbsp;&nbsp;<span ng-click="deleteImage()"><a href="">删除</a></span>\n						<div class="btn-group">\n							<div class="dropdown-toggle"  data-toggle="dropdown" ng-click="setIndex($event);">分类到</div>\n							<div class="dropdown-menu" role="menu">\n								<ul forbidden-close>\n			                        <li ng-class="{selecttag: dropTagIndex == $index}" ng-repeat="myTag in myTags" ng-click="selectTag(myTag, $index)"><span>{{myTag.name}}</span></li>\n			                        <li ng-click="createCategory();" class="add_cate clearfix"><em>+</em><span>添加分类</span></li>\n		                      	</ul>\n		                      	<div class="fl btn-main" style="width:100%;" ng-click="setCategory(dropTagIndex)"><a href="" style="color:#FFF;">确定</a></div>\n		                    </div>\n						</div>\n						<div ng-if="tagIndex > -1" style="display: inline-block; margin-left: 20px;"><a href="" ng-click="unsetTag()">取消分类</a></div>\n					</div>\n	        	</div>\n	        </div>\n	        <div class="tab-pane" ng-class="{active: systemImages}" ng-show="systemImages">\n	        	<div class="img_list">\n	        		<div class="category_list">				\n						<ul class="category_list_container clearfix">\n							<li class="category_item"  ng-click="changeCategory(\'all\')" ng-class="{active: \'all\' == categoryId}">\n							最新\n							</li>\n							<li ng-class="{active: category.value == categoryId}" class="category_item" ng-repeat="category in categoryList" ng-click="changeCategory(category.value); getChildCategory(category.value);sysTagIndex = -1;">\n								{{category.name}}\n							</li>\n							<li ng-show="fileType == \'0\'" class="category_item"  ng-click="changeCategory(\'c\');numPages=2;" ng-class="{active: \'c\' == categoryId}">\n							纯色背景\n							</li>\n						</ul>	\n					</div>\n		        	<div class="cat_two_list clearfix" ng-if="\'c\' != categoryId && \'all\' != categoryId">\n		        		<ul>\n		        			<li ng-class="{active: sysTagIndex == $index}" ng-repeat = "childCatrgory in childCatrgoryList" ng-click="getImagesBySysTag(childCatrgory.id, $index, 1, categoryId)" style="cursor:pointer;">\n		        				{{childCatrgory.name}}\n		        			</li>\n		        		</ul>\n		        	</div>\n	        	</div>\n	        </div>\n	    </div>\n	    <div class="img_list" style="padding-top:0px;">\n	    	<div class="img_list_container" ng-class="{photo_list: fileType == \'1\', bg_list: fileType == \'0\'}">\n				<ul class="img_box clearfix">\n					<li ng-show="categoryId == \'0\'" class="upload" title="上传图片" ng-click="goUpload(img.path)">\n						<span class=""><img ng-src="{{CLIENT_CDN}}assets/images/bg_15.jpg" alt="" /></span>\n					</li>\n					<li class="imageList" ng-show="fileType == \'0\' && \'c\' != categoryId" ng-repeat="img in imgList track by $index" ng-click="switchSelect(img, $event)" ng-mouseenter="hover(img)" ng-mouseleave="hover(img)" ng-class="{hovercolor: img.showOp || img.selected}" right-click>\n						<img ng-src="{{PREFIX_FILE_HOST + img.tmbPath}}" />\n						<div class="edit_content" ng-if="(img.showOp || img.selected) && categoryId == \'0\'">\n							<div class="select" ng-if="!img.selected && categoryId == \'0\'"><img ng-src="{{CLIENT_CDN}}assets/images/nocheck.jpg"/></div>\n							<div class="select" ng-if="img.selected && categoryId == \'0\'"><img ng-src="{{CLIENT_CDN}}assets/images/checked.png"/></div>\n							<div class="del" ng-click="deleteImage(img.id, $event)"><img ng-src="{{CLIENT_CDN}}assets/images/bg_07.png" /></div>\n							<div ng-if="categoryId == \'0\'" class="set btn-group" class="dropdown-toggle"  data-toggle="dropdown" ng-click="prevent(img, $event)">\n								<img id="{{img.id}}" ng-src="{{CLIENT_CDN}}assets/images/bg_19.png" />\n							</div>	\n							<div class="dropdown-menu set_category" id="{{img.id}}" role="menu">\n								<ul forbidden-close id="cat_tab">\n			                        <li ng-class="{selecttag: dropTagIndex == $index}" ng-repeat="myTag in myTags" ng-click="selectTag(myTag, $index)"><span>{{myTag.name}}</span></li>\n			                        <li ng-click="createCategory();" class="add_cate clearfix"><em>+</em><span>添加分类</span></li>\n		                      	</ul>\n		                      	<div class="fl btn-main" style="width:100%;"><a href="" style="color:#FFF;" ng-click="setCategory(dropTagIndex, img.id)">确定</a></div>\n		                    </div>\n								\n						</div>\n					</li>\n					<li class="imageList" ng-show="fileType == \'1\'"  ng-repeat="img in imgList track by $index" ng-click="switchSelect(img, $event)" ng-mouseenter="hover(img)" ng-mouseleave="hover(img)" ng-class="{hovercolor: img.showOp || img.selected}" right-click>\n						<img ng-src="{{PREFIX_FILE_HOST + img.tmbPath}}"/>\n						<div class="edit_content" ng-show="(img.showOp || img.selected) \n						&& categoryId == \'0\'">\n							<div class="select" ng-if="!img.selected && categoryId == \'0\'"><img ng-src="{{CLIENT_CDN}}assets/images/nocheck.jpg"/></div>\n							<div class="select" ng-if="img.selected && categoryId == \'0\'"><img ng-src="{{CLIENT_CDN}}assets/images/checked.png"/></div>\n							<div class="del" ng-click="deleteImage(img.id, $event)" ng-click="deleteImg()"><img ng-src="{{CLIENT_CDN}}assets/images/bg_07.png" /></div>\n							<div class="set btn-group" ng-if="categoryId == \'0\'" class="dropdown-toggle" ng-click="prevent(img, $event)" data-toggle="dropdown">\n								<img id="{{img.id}}" ng-src="{{CLIENT_CDN}}assets/images/bg_19.png" />\n							</div>\n							<div class="dropdown-menu set_category" role="menu">\n								<ul forbidden-close id="cat_tab">\n			                        <li ng-class="{selecttag: dropTagIndex == $index}" ng-repeat="myTag in myTags" ng-click="selectTag(myTag, $index)"><span>{{myTag.name}}</span></li>\n			                        <li ng-click="createCategory()" class="add_cate clearfix"><em>+</em><span>添加分类</span></li>\n		                      	</ul>\n		                      	<div class="fl btn-main" ng-click="setCategory(dropTagIndex, img.id)" style="width:100%;"><a href="" style="color:#FFF;">确定</a></div>\n		                    </div>\n						</div>\n					</li>\n					<li class="photo_item" style="background-color: {{img.color}}" ng-show="fileType == \'0\' && \'c\' == categoryId" ng-mouseenter="hover(img)" ng-mouseleave="hover(img)" ng-class="{hovercolor: img.showOp || img.selected, mr0: $index%9 == 8}" ng-click="switchSelect(img, $event)"  ng-repeat="img in imgList track by $index">\n					</li>\n				</ul>\n			</div>\n			<div class="fanye_foot clearfix" style="margin-top: 20px;">\n				<div class="fr btn-main" ng-click="replaceImage();"><a href="" style="color:#FFF;">确定</a></div>\n				<div class="pagination_container fl">\n					<pagination style="float: left" class="pagination-sm" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;" max-size="5" items-per-page="pageSize" total-items="totalItems" ng-model="currentPage" ng-change="getImagesByPage(categoryId, currentPage)" boundary-links="true" rotate="true" num-pages="numPages"></pagination>\n			        <div class="current_page">\n			            <input type="text" ng-model="toPage" ng-keyup="$event.keyCode == 13 ? getImagesByPage(categoryId, toPage) : null">\n			            <a ng-click="getImagesByPage(categoryId,toPage)" class="go">GO</a>\n			            <span>当前: {{currentPage}} / {{numPages}} 页</span>\n			        </div>\n			    </div>\n			</div>\n	    </div>\n	</div>\n</div>');

    }]),b.module("scene/console/button.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/button.tpl.html", '<div class="button_console">\n	<div class="modify_area">\n		<span class="label">按钮名称：</span>\n		<input type="text" maxlength="15" ng-model="model.title" ng-keyup="$event.keyCode == 13 ? confirm() : null"/>\n	</div>\n	\n</div>\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确定</a>\n    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n</div>')
    }]),b.module("scene/console/category.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/category.tpl.html", '<div class="category_input">\n	<input type="text" ng-model="category.name" placeholder="分类名称" />\n</div>\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确定</a>\n</div>')
    }]),b.module("scene/console/cropimage.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/cropimage.tpl.html", '<div class="cropimage">\n	<div class="crop-control">\n		<ul>\n			<li ng-class="{active: !fit}">\n				<div class="pl">\n					<div class="check" ng-click="fit = false"></div>\n					<div class="cha text-center">自定义</div>\n				</div>\n				<div class="pr">\n					<div class="kuan cha" ng-show="!fit">宽度: <span class="cropWidth"></span></div>\n					<div class="kuan cha" ng-show="!fit">高度: <span class="cropHeight"></span></div>\n					<div class="kuan cha"><input type="checkbox" ng-disabled="fit" ng-model="lockRatio"/>锁定当前比例</div>\n				</div>\n			</li>\n			<li ng-class="{active: fit}">\n				<div class="pl">\n					<div class="check" ng-click="fit = true"></div>\n					<div class="cha text-center">匹配当前</div>\n				</div>\n				<div class="pr">\n					<div class="kuan cha" ng-show="fit">宽度: <span class="cropWidth"></span></div>\n					<div class="kuan cha" ng-show="fit">高度: <span class="cropHeight"></span></div>\n					<div class="kuan cha">匹配当前图片框比例</div>\n				</div>\n			</li>\n			<li class="crop-btn fr">\n				<a class=" btn-main" href="" ng-click="crop()">确定</a>\n				<a class=" btn-grey0" style="margin-top:20px;" href="" ng-click="cancel()">取消</a>\n			</li>\n		</ul>\n	</div>\n	<div class="image_crop">\n		<img id="target"></img>\n	</div>\n</div>')
    }]),b.module("scene/console/fake.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/fake.tpl.html", '<div class="modal-footer">\n	<div class="alert alert-info" role="alert">此功能为高级账号功能，点击按钮免费申请成为高级账号！</div>\n    <a class="btn-main login" target="_blank" style="width: 188px;" ng-href="http://bbs.e.wesambo.com/forum.php?mod=viewthread&tid=77">免费成为高级账号</a>\n</div>\n<div class="anim_area" style="padding: 0 20px 20px;">\n	<img title="点击上方按钮成为高级账号" ng-show="type==\'style\'" src="{{CLIENT_CDN}}assets/images/create/fakestyle.png"/>\n	<img title="点击上方按钮成为高级账号" ng-show="type==\'anim\'" src="{{CLIENT_CDN}}assets/images/create/fakeanim.png"/>\n</div>')
    }]),b.module("scene/console/input.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/input.tpl.html", '<div class="input_console">\n	<div class="modify_area">\n		<span class="label">输入框名称：</span>\n		<input type="text" maxlength="15" ng-model="model.title" ng-keyup="$event.keyCode == 13 ? confirm() : null"/>\n		<input type="checkbox" id="checkbox_required" ng-model="model.required" ng-true-value="required" style="margin-top:0;margin-left:5px;" />\n		<label for="checkbox_required" style="font-weight: lighter; margin:0;font-size:12px;">必填</label>\n	\n		<div class="customized_container">\n			<input type="radio" id="input_name" ng-model="model.type" ng-change="model.title=\'姓名\'" value="501" /><label for="input_name" style="font-weight: lighter; margin: 0;">姓名</label>\n			<input type="radio" id="input_phone" ng-model="model.type" ng-change="model.title=\'手机\'" value="502" /><label for="input_phone" style="font-weight: lighter; margin: 0;" />手机</label>\n			<input type="radio" id="input_email" ng-model="model.type" ng-change="model.title=\'邮箱\'" value="503" /><label for="input_email" style="font-weight: lighter; margin: 0;">邮箱</label>\n			<input type="radio" id="input_text" ng-model="model.type" ng-change="model.title=\'文本\'" value="5" /><label for="input_text" style="font-weight: lighter; margin: 0;">文本</label>\n		</div>\n	</div>\n</div>\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确定</a>\n    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n</div>')
    }]),b.module("scene/console/link.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/link.tpl.html", '<div class = "link-modal">	\n	<div class = "row" style = "font-size: 14px; text-align:center;">\n		<div class="input_console">\n			<div class = "modify_area" style="text-align:left;padding-left:110px;">\n				<div style="margin-bottom:20px;">\n					<input type="radio" name="externalRadio" id="externalRadio" ng-model = "url.link" value="external" ng-change = "changed()" style="margin:0px;">\n					    网站地址：\n					<input class = "" style="height:35px;width:280px;" type="text" ng-model = "url.externalLink" name="externalLink" id="externalLink" placeholder = "网站地址" ng-disabled = "url.link == \'internal\'" ng-change = "selectRadio(\'external\')"/>\n					<a style = "font-size: 16px;display: inline-block; margin-top: 5px;background-image: url(\'assets/images/create/delete.png\'); width: 14px; height: 14px;" ng-show = "url.link == \'external\'" class = "delete-link" ng-click = "removeLink(\'external\')"></a>\n				</div>\n				<div class = "" >\n					<input type="radio" name="internalRadio" id="internalRadio" value="internal" ng-model = "url.link" ng-change = "changed()" style="margin:0px;">\n		    			场景页面：\n					<select style = "border:1px solid #E7E7E7; height: 35px;width:280px;" ng-model = "url.internalLink" ng-options = "page.name for page in pageList" ng-disabled = "url.link == \'external\'" ng-change = "selectRadio(\'internal\')"></select>\n					<a style = "display: inline-block;font-size: 16px; background-image: url(\'assets/images/create/delete.png\'); width: 14px; height: 14px;" ng-show = "url.link == \'internal\'" ng-click = "removeLink(\'internal\')"></a>\n				</div>\n			</div>\n		</div>\n		<div class = "modal-footer">\n			<a type = "button" style="width:88px" class = "btn  btn-main" ng-click = "confirm()">确定</a>\n			<a type = "button" style="width:88px" class = "btn  btn-grey0" ng-click = "cancel()">取消</a>\n		</div>\n	</div>\n</div>')
    }]),b.module("scene/console/map.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/map.tpl.html", '<div class="map_console">\n	<div id="l-map"></div>\n	<div class="search_area">\n		<div class="input-group">\n		  <input type="text" class="form-control" ng-model="search.address" ng-keyup="$event.keyCode == 13 ? searchAddress() : null" placeholder="请输入地名">\n		  <span class="input-group-btn">\n		    <button ng-click="searchAddress()" class="btn btn-default" type="button">搜索</button>\n		  </span>\n		</div><!-- /input-group -->\n		<div id="r-result">\n			<ul class="list-group">\n				<li class="list-group-item" ng-repeat="address in searchResult" ng-click="setPoint(address.point.lat, address.point.lng, address.address)">\n					{{address.address}}	\n				</li>\n			</ul>\n		</div>\n	</div>\n</div>\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="resetAddress()">确定</a>\n    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n</div>')
    }]),b.module("scene/console/microweb.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/microweb.tpl.html", '<div class="button_console">\n	<div class="modify_area">\n		<div>导航样式:\n			<ul>\n				<li ng-click = "selectColor(color)" ng-class = "{colorborder: model.color == color.backgroundColor}" style = "display: inline-block; margin: 10px;" ng-repeat = "color in backgroundColors"><div style = "width: 50px; height: 30px; margin: 10px; cursor:pointer;" ng-style = "color"></div></li>\n			</ul>\n		</div>\n	</div>\n	<div class = "divider" style = "margin-top: 10px; height: 1px; background: #ccc;"></div>\n	<div class="modify_area">\n		<div>\n			<ul class="clearfix" style="left:50%;margin-left:-160px;position:relative;height:65px;">\n				<li class = "title_color" ng-class = "{colorborder:labelIndex == $index && labelName.mousedown,selectedcolor: labelName.selected,whitecolor: labelName.color.backgroundColor == \'#fafafa\'}" ng-click = "switchLabel(labelName, $index)" style = "display: inline-block;float:left;" ng-repeat = "labelName in labelNames"><div style = "margin: 10px; width:50px; height: 30px;line-height:30px; border: 1px solid #ccc; cursor: pointer;" ng-style = "labelName.color">{{labelName.title}}</div></li>\n			</ul>\n		</div>\n		<span class="label">导航名称：</span>\n		<input type="text" ng-model="model.title" ng-change = "changeLabelName()" ng-keyup="$event.keyCode == 13 ? confirm() : null" placeholder = "导航名称" maxlength = "4"/>\n	</div>\n\n	<div class="modify_area">\n		<span class="label">链接页面：</span>\n		<select style = "width: 181px; height: 30px; display: inline-block;" ng-model = "model.link" ng-options = "page.name for page in pageList" ng-change = "selectLink(model.link)"></select>\n	</div>\n\n	<div class="modify_area" style = "color: #ff0000">\n		至少选择两个标签，并分别添加链接\n	</div>\n	\n</div>\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确定</a>\n    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n</div>')
    }]),b.module("scene/console/pic_lunbo.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/pic_lunbo.tpl.html", '<div class="pic_lunbo_console input_console">\n    <div class="modify_area">\n        <div class="row">\n            <div class="col-sm-7">\n                <div class="row" style="margin:0px -15px 10px -15px;">\n                    <div class="col-sm-5" style="line-height: 35px; vertical-align: middle; text-align: center;">图集样式</div>\n                    <div class="col-sm-7">\n                        <select class="" style="font-size:12px;padding-left:3px;width:150px;">\n                            <option value="1">图片轮播</option>\n                        </select>\n                    </div>\n                </div>\n                <div class="row" style="margin:10px -15px;">\n                    <div class="col-sm-5" style="line-height: 35px; vertical-align: middle; text-align: center;">自动播放</div>\n                    <div class="col-sm-7" style="font-size: 30px; color: #9ad64b;text-align:left;">\n                        <span class="fa fa-toggle-on" style="cursor: pointer;" ng-show="isAutoPlay" ng-click="autoPlay(false)"></span>\n                        <span class="fa fa-toggle-off" style="cursor: pointer;" ng-hide="isAutoPlay" ng-click="autoPlay(true)"></span>\n                    </div>\n                </div>\n                <div class="row" style="margin: 10px -15px;">\n                    <div class="col-sm-5" style="text-align: center;">\n                        <a style="border-radius:3px;width:88px;" class="btn-main btn-success" ng-click="choosePic()">选择图片</a>\n                    </div>\n                    <div class="col-sm-7" style="font-size:12px; line-height: 35px;text-align:left;">\n                        <div>最多可选择6张图片</div>\n                    </div>\n                </div>\n            </div>\n            <div class="col-sm-5">\n                <div class="well" style="margin-bottom: 0;">\n                    <img class="scratch" style="height: 100px; width: 100%;" ng-src="{{CLIENT_CDN}}assets/images/u2462.png">\n                </div>\n            </div>\n        </div>\n        <div class="row" style="margin-top: 20px;" ng-hide="imgList.length">\n            <div class="col-sm-12">\n                <div class="divider" style="height: 1px; background: #ddd;"></div>\n            </div>\n        </div>\n        <div class="panel panel-default lunbo_upload" style="margin:20px 15px 0 15px;" ng-show="imgList.length">\n            <div class="panel-body">\n                <div style="margin: 10px 0; height: 66px;" ng-repeat="img in imgList track by $index">\n                    <div style="border-radius: 5px; overflow: hidden; width: 66px; height: 66px; float: left;">\n                        <img style="width: 100%; height: 100%;" ng-src="{{fileDomain + img.src}}">\n                    </div>\n                    <textarea placeholder="添加描述功能暂不开放" rows="4" disabled style="width: 75%; float: left; margin: 0 10px;" maxlength="150" ng-model="img.desc">{{img.desc}}</textarea>\n                    <div style="line-height: 66px; text-align: center; float: right;">\n                        <span class="glyphicon glyphicon-remove-circle" style="font-size: 30px; vertical-align: middle; cursor: pointer; color: orange;" ng-click="remove($index)"></span>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="ok()">确定</a>\n    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n</div>')
    }]),b.module("scene/console/pictures.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/pictures.tpl.html", '<div class="pic-contain">\n    <div class="pic-head clearfix pic-same">\n        <div class="select-img">\n            <a ng-click="choosePic()">选择图片</a>\n            <span>最多可选择6张图片</span>\n        </div>\n        <div class="select-style clearfix">\n            <select>\n                <option value ="">图片轮播</option>\n                <!--<option value ="">翻书效果</option>-->\n                <!--<option value="">轮播效果</option>-->\n                <!--<option value="">上下效果</option>-->\n            </select>\n            <span class="bg-color" ng-style="{\'background-color\': properties.bgColor}"></span>\n            <span class="select-bg-color" colorpicker="rgba" ng-model="properties.bgColor">背景颜色</span>\n        </div>\n    </div> \n    <div class="pic-img-list pic-same">\n        <ul class="clearfix">\n            <li eqx-pictures-image-click ng-class="{hover: currentImageIndex === $index}" ng-repeat="img in properties.children track by $index">\n                <img class="pic-img" ng-src="{{PREFIX_FILE_HOST + img.src}}"/>\n                <i class="delete-img"><img ng-src="{{CLIENT_CDN}}assets/images/bg_07.png" /></i>\n            </li>\n        </ul>\n    </div>\n    <div class="pic-preview" ng-style="{\'background-color\': properties.bgColor, width: position.width, height: position.height}">\n        <!--<img eqx-image-crop ng-src="{{CLIENT_CDN}}assets/images/scene6.jpg" />\n        <div class="operation">\n            <a class="quxiao ">取消</a><a class="finish">完成</a>\n        </div>\n        <div class="shape">\n            <span><a>自由裁切</a>|<a>正方形</a>|<a>标准</a></span>\n        </div>-->\n    </div>\n    <div class="operation-pre">\n        <!--<a class="enhance">增强</a><a class="rotation">旋转</a>--><a class="cut" eqx-pictures-image-crop>裁切</a>\n    </div>\n    <div class="pic-same pic-play clearfix">\n        <div class="set-play clearfix">\n           <!--  class=on  开启 off 关闭 -->\n            <span ng-show="properties.autoPlay"><span class="button on" ng-click="properties.autoPlay = false"><i></i></span>已开启自动播放</span>\n            <span ng-show="!properties.autoPlay"><span class="button off" ng-click="properties.autoPlay = true"><i></i></span>已关闭自动播放</span>\n        </div>\n        <div class="btn-content">\n            <a class="btn-main login" ng-click="ok()">确定</a>\n            <a class="btn-grey0 cancel" ng-click="cancel()">取消</a>\n        </div>\n    </div>\n</div>')
    }]),b.module("scene/console/setting.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/setting.tpl.html", '<div panel-draggable id="comp_setting">\n	<div class="cancel"><a href="" title="关闭" ng-click="cancel()">x</a></div>\n	<div class="style_head clearfix">\n		<ul class="clearfix">\n			<li><a ng-click="activeTab = \'style\'" ng-class="{hover:activeTab == \'style\'}">样式</a></li>\n			<li><a ng-click="activeTab = \'anim\'" ng-class="{hover:activeTab == \'anim\'}">动画</a></li>\n		</ul>\n	</div>\n	<div class="style_content">\n		<div ng-include="\'scene/console/anim.tpl.html\'"></div>\n		<div ng-include="\'scene/console/style.tpl.html\'"></div>\n		\n	</div>		\n	\n</div>')
    }]),b.module("scene/console/style.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/style.tpl.html", '<div ng-if="activeTab == \'style\'" ng-controller="StyleConsoleCtrl">\n	<div class="yangshi">\n		<section>\n			<div class="style_list" ng-init="showBasic=true" ng-click="showBasic = !showBasic; showBorder = false; showShadow = false;">\n				<b class="caret" ng-show="showBasic"></b><b class="caret off" ng-show="!showBasic"></b>基础样式\n			</div>\n			<div ng-show="showBasic"  class="style_con_hei">\n				<div class="style_list_angel clearfix">\n					<label>背景颜色</label>\n					<div class="color_select clearfix">\n						<a class="input_kuang flo_lef" ng-style="{backgroundColor: model.backgroundColor}" ng-model="model.backgroundColor" colorpicker="rgba" ></a>\n			    		<input class=" flo_right" style="width:115px;" style-input elem-id="{{elemDef.id}}" ng-model="model.backgroundColor" css-item="backgroundColor" type="text" />\n			    	</div>\n				</div>\n				<div class="style_list_angel clearfix" ng-show="elemDef.type == \'2\' ||elemDef.type == \'8\' || (\'\'+elemDef.type).charAt(0) == \'6\'">\n			  		<label>文字颜色</label>\n			  		<div class="color_select clearfix">\n			  			<a class="input_kuang flo_lef" ng-style="{backgroundColor: model.color}" ng-model="model.color" colorpicker="rgba" ></a>\n			  			<input class=" flo_right" style="width:115px;" style-input elem-id="{{elemDef.id}}" ng-model="model.color" css-item="color" type="text" />\n			    	</div>\n			  	</div>\n				<div class="style_list_angel clearfix">\n					<label>透明度</label>\n					<div class="touming clearfix">\n				  		<p class="num"><input class="short" type="number" min="0" max="100" limit-input style-input elem-id="{{elemDef.id}}" css-item="opacity" ng-model="model.opacity"/></p>\n						<div style="width: 100px;" ui-slider min="0" max="100" ng-model="model.opacity"></div>\n				  	</div>\n			  	</div>				  	\n			  	<div class="style_list_angel clearfix" ng-show="elemDef.type == \'8\' || (\'\'+elemDef.type).charAt(0) == \'6\' || elemDef.type == \'2\' || (\'\'+elemDef.type).charAt(0) == \'5\'">\n			  		<div>\n						<label>边距</label>\n						<div class="touming clearfix">\n					  		<p class="num"><input class="short" min="0" max="20" limit-input class="input_kuang short" type="number" style-input css-item="padding" ng-model="model.paddingTop"/></p>				\n					  		<div style="width: 100px;" ui-slider min="0" max="20" ng-model="model.paddingTop"></div>\n					  	</div>\n					</div>\n				</div>\n				<div class="style_list_angel clearfix" ng-show="elemDef.type == \'8\' || (\'\'+elemDef.type).charAt(0) == \'6\' || elemDef.type == \'2\' || (\'\'+elemDef.type).charAt(0) == \'5\'">\n					<div>\n						<label>行高</label>\n						<div class="touming clearfix">\n					  		<p class="num"><input class="short" min="0" max="3" limit-input step="0.1" class="input_kuang short" type="number" style-input css-item="lineHeight" ng-model="model.lineHeight"/></p>			\n					  		<div style="width: 100px;" use-decimals step="0.1" ui-slider min="0" max="3" ng-model="model.lineHeight"></div>\n					  	</div>\n					</div>\n				</div>								\n			</div>\n		</section>\n		<section>\n			<div class="style_list" ng-click="showBorder = !showBorder; showBasic=false;showShadow=false;">\n				<b class="caret" ng-show="showBorder"></b><b class="caret off" ng-show="!showBorder"></b>边框样式\n			</div>\n			<div ng-show="showBorder" class="style_con_hei">\n				<div class="style_list_angel clearfix">\n					<label>边框尺寸</label>\n					<div class="touming clearfix">\n				  		<p class="num"><input class="input_kuang short" limit-input type="number" min="0" max="20" style-input css-item="borderWidth" ng-model="model.borderWidth"/></p>				\n				  		<div style="width: 100px;" ui-slider min="0" max="20" ng-model="model.borderWidth"></div>\n				  	</div>\n				</div>\n				<div class="style_list_angel clearfix">\n			  		<label>边框弧度</label>\n			    	<div class="touming clearfix">\n			    		<p class="num"><input class="input_kuang short" type="number" min="0" max="{{maxRadius}}" limit-input style-input css-item="borderRadius" ng-model="model.borderRadius" /></p>  		\n				  		<div class="num" style="width:100px;" ui-slider min="0" max="{{maxRadius}}" ng-model="model.borderRadius"></div>\n			    	</div>\n			  	</div>	\n				<div class="style_list_angel clearfix">\n					<label>边框样式</label>\n					<div class="touming">\n						<select style="border:1px solid #ccc;height:20px;" style-input css-item="borderStyle" ng-model="model.borderStyle">\n							<option value="solid">直线</option>\n							<option value="dashed">破折线</option>\n							<option value="dotted">点状线</option>\n							<option value="double">双划线</option>\n							<option value="groove">3D凹槽</option>\n							<option value="ridge">3D垄状</option>\n							<option value="inset">3D内嵌</option>\n							<option value="outset">3D外嵌</option>\n						</select>\n					</div>\n			  	</div>\n				<div class="style_list_angel clearfix">\n					<label>边框颜色</label>\n					<div class="color_select clearfix">\n						<input class="flo_right short"  style="width:115px;" style-input ng-model="model.borderColor" css-item="borderColor" type="text" />\n						<a class="input_kuang flo_lef" ng-style="{backgroundColor: model.borderColor}" ng-model="model.borderColor" colorpicker="rgba"></a>\n						\n			    	</div>\n			  	</div>\n			  	<div class="style_list_angel clearfix">\n					<div>\n						<label>旋转</label>\n						<div class="touming clearfix">\n					  		<p class="num"><input min="0" max="360" limit-input style-input css-item="transform" class="input_kuang short" type="number"  ng-model="model.transform"/></p>			\n					  		<div style="width: 100px;" ui-slider min="0" max="360" ng-model="model.transform"></div>\n					  	</div>\n					</div>\n				</div>			  	\n			</div>\n		</section>\n		<section>\n			<div class="style_list" ng-click="showShadow = !showShadow; showBasic=false;showBorder=false;">\n				<b class="caret" ng-show="showShadow"></b><b class="caret off" ng-show="!showShadow"></b>阴影样式\n			</div>\n			<div ng-show="showShadow" class="style_con_hei">\n				<div class="style_list_angel clearfix">\n					<label>大小</label>\n					<div class="touming clearfix">\n						<div style="width: 100px;" ui-slider min="0" max="20" ng-model="tmpModel.boxShadowSize"></div>\n						<p class="num"><input limit-input class="input_kuang short" min="0" max="20" type="number" style-input css-item="boxShadow" ng-model="tmpModel.boxShadowSize"/></p>\n					</div>\n			  	</div>\n			  	<div class="style_list_angel clearfix">\n					<label>模糊</label>\n					<div class="touming clearfix">\n						<div style="width: 100px;" ui-slider min="0" max="20" ng-model="tmpModel.boxShadowBlur"></div>\n						<p class="num"><input limit-input class="input_kuang short" min="0" max="20" type="number" style-input css-item="boxShadow" ng-model="tmpModel.boxShadowBlur"/></p>\n					</div>\n			  	</div>\n			  	<div class="style_list_angel clearfix">\n					<label>颜色</label>\n					<div class="clearfix color_select">\n			    		<input class=" flo_right short" style="width:115px;" style-input  ng-model="tmpModel.boxShadowColor" css-item="boxShadow" type="text" />	\n						<a class="input_kuang flo_lef" ng-style="{backgroundColor: tmpModel.boxShadowColor}" ng-model="tmpModel.boxShadowColor" colorpicker="rgba" colorpicker-fixed-position="true"></a>\n			    	</div>\n				</div>	\n			  	<div class="style_list_angel clearfix">\n					<label>方向</label>\n					<div class="clearfix">\n				  		<div class="fr">\n				  			<p class="num" style="margin-top:18px;"><input style="width:58px;margin-right:5px;padding:0;" min="0" max="359" limit-input class="input_kuang" type="number" style-input css-item="boxShadow" ng-model="tmpModel.boxShadowDirection" /></p></div>					\n				  		<angle-knob class="flo_lef" style="display: block;position: relative;height: 55px;margin-left:28px;margin-top:5px;"></angle-knob>\n				  	</div>\n				</div>\n			</div>\n		</section>\n		<div class="modal-footer">\n		    <a class="btn-main login" style="width: 120px;" ng-click="clear()">清除全部样式</a>\n		</div>\n	</div>\n</div>\n')
    }]),b.module("scene/console/tel.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/tel.tpl.html", '<div class="button_console">\n	<div class="modify_area  tel_title">\n		<span ng-repeat = "button in buttons track by $index" ng-class = "{spanborder: $index == btnIndex}">\n			<!-- <a ng-class = "{btn1: $index==0, btn2: $index == 1, btn3: $index ==2, btn4: $index ==3}" ng-click = "chooseTelButton(button, $index, $event)" selected><span class = "glyphicon glyphicon-earphone"></span>{{button.text}}</a> -->\n			<a ng-style = "button.btnStyle" ng-click = "chooseTelButton(button, $index, $event)" selected>{{button.text}}</a>\n		</span>\n	</div>\n	<div class = "divider" style = "margin-top: 10px; height: 1px; background: #ccc;"></div>\n	<div class="modify_area">\n		<span class="label" style="font-weight:lighter;">按钮名称：&nbsp;</span>\n		<input type="text" ng-model="model.title" ng-keyup="$event.keyCode == 13 ? confirm() : null"/>\n	</div>\n\n	<div class="modify_area">\n		<span class="label" style="font-weight:lighter;">手机/电话：</span>\n		<input class = "tel-button" type="text" placeholder = "010-88888888" ng-model="model.number" ng-keyup="$event.keyCode == 13 ? confirm() : null" ng-focus = "removePlaceHolder($event)" ng-blur = "addPlaceHolder()"/>\n	</div>\n	\n</div>\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确定</a>\n    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n</div>')
    }]),b.module("scene/console/video.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/console/video.tpl.html", '<div class="video_console">\n	<div class="modify_area" style="height:auto">\n		<div>\n			<span class="label">视频通用代码：</span>\n			<span class="video_code"><a href="http://bbs.e.wesambo.com/forum.php?mod=viewthread&tid=678&page=1&extra=#pid2706" target="_blank"><ins>什么是视频通用代码？</ins></a></span>\n		</div>\n		<div class="video_tip">\n			<textarea style="border-radius:0px;" class = "video_src" ng-model="model.src" ng-keyup="$event.keyCode == 13 ? confirm() : null"/>\n		</div>\n		<div class="video_tip">将视频的通用代码粘贴到文本框里即可。<a href="http://bbs.e.wesambo.com/forum.php?mod=viewthread&tid=678&page=1&extra=#pid2706" target="_blank"><ins>查看帮助</ins></a></div>\n		<div class="video_tip">支持的视频：<a href="http://www.youku.com/" target="_blank"><ins>优酷</ins></a>、<a href="http://www.tudou.com/" target="_blank"><ins>土豆</ins></a>、<a href="http://v.qq.com/" target="_blank"><ins>腾讯视频</ins></a></div>\n	</div>	\n</div>\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确定</a>\n    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n</div>')
    }]),b.module("scene/create.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/create.tpl.html", '<div class="creat_head" eqx-keymap>\n  <div class="creat_head_con clearfix">\n	<div class="creat_logo"><a href="#/main" ng-click="stopCopy()"><img ng-src="{{CLIENT_CDN}}assets/images/logo-white.png" /></a></div>\n	<div class="creat_con clearfix">\n		<ul class="comp_panel clearfix">\n		  <li comp-draggable="panel" ctype="2" class="comp-draggable text" title="请拖动到编辑区域" ng-click="createComp(\'2\');">\n			<span>文本</span>\n		  </li>\n		  <li comp-draggable="panel" ctype="3" class="comp-draggable bg" title="请拖动到编辑区域" ng-click="createComp(\'3\');">\n			<span>背景</span>\n		  </li>\n		  <li comp-draggable="panel" ctype="9" class="comp-draggable music" title="请拖动到编辑区域" ng-click="createComp(\'9\');">\n			<span>音乐</span>\n		  </li>  \n		  <li comp-draggable="panel" ctype="v" class="comp-draggable vedio" title="请拖动到编辑区域" ng-click="createComp(\'v\');">\n			<span>视频</span>\n		  </li>        \n		  <li comp-draggable="panel" ctype="4" class="comp-draggable image" title="请拖动到编辑区域" ng-click="createComp(\'4\');">\n			<span>图片</span>\n		  </li>\n		  <li comp-draggable="panel" ctype="5" class="comp-draggable textarea" title="请拖动到编辑区域" ng-click="createComp(\'5\');">\n			<span>输入框</span>\n		  </li>\n		  <li comp-draggable="panel" ctype="6" class="comp-draggable button" title="请拖动到编辑区域" ng-click="createComp(\'6\');">\n			<span>按钮</span>\n		  </li>\n		  <li comp-draggable="panel" ctype="p" class="comp-draggable images" title="请拖动到编辑区域" ng-click="createComp(\'p\');">\n			<span>图集</span>\n		  </li>\n		  <li comp-draggable="panel" ctype="8" class="comp-draggable phone" title="请拖动到编辑区域" ng-click="createComp(\'8\');">\n			<span>电话</span>\n		  </li>          \n		  <li comp-draggable="panel" ctype="g101" class="comp-draggable contact" title="请拖动到编辑区域" ng-click="createCompGroup(\'g101\');">\n			<span>联系人</span>\n		  </li>          \n		  <li ng-click="openPageSetPanel()" class="texiao">\n			<span><a id = "toggle_button" class="page_effect" >特效</a></span></li>\n		</ul>\n  </div>\n	<div class="create-action">\n		<ul>\n			<li class="act-border save"><span class="create-save" ng-click="saveScene(true)">保存</span></li>\n			<li class="publish"><span class="create-publish" ng-click="publishScene()">发布</span></li>\n			<li class="act-border quit"><span class="create-quit" ng-click="exitScene()">退出</span></li> \n		</ul>\n	</div>\n	<div ng-hide="showToolBar();">\n		<div ng-show="isEditor" style="position: absolute;right: -200px;top: 20px;">\n			<select ng-model="tpl.obj.scene.isTpl">\n				<option value="0">非模板</option>\n				<option value="1">保存为pc模板</option>\n				<option value="2">保存为移动端模板</option>\n			</select>\n		</div>\n	</div>\n</div>\n</div>\n<div class="create_scene">\n  <div class="main clearfix">\n	  <div class="content">\n		  <div class="create_left">\n			<tabset justified="true">\n			  <tab heading="页面模版" class="hint--bottom hint--rounded" style = "width: 290px;">\n				  <tabset justified="true" class="tpl_tab">\n					<tab ng-repeat="pageTplType in pageTplTypes" heading="{{pageTplType.name}}" ng-click="getPageTplsByType(pageTplType.value)">\n					  <div class="nav2 clearfix" dropdown >\n						<div class="others dropdown-toggle" ng-show="otherCategory.length > 0"><span></span></div>\n						<ul class="clearfix nav2_list">\n						  <li ng-class="{active:childCat.id == categoryId}" ng-click="getPageTplTypestemp(childCat.id ,bizType)" ng-repeat="childCat in childCatrgoryList">{{childCat.name}}</li>\n						</ul>\n						<ul class="clearfix nav2_other dropdown-menu">\n						  <li ng-class="{active:othercat.id == categoryId}" ng-click="getPageTplTypestemp(othercat.id ,bizType)" ng-repeat="othercat in otherCategory">{{othercat.name}}</li>\n						</ul>                        \n					  </div>\n					  <ul class="page_tpl_container clearfix">\n						<li class="page_tpl_item" ng-repeat="pageTpl in pageTpls" class="comp-draggable" title="点击插入编辑区域" ng-click="insertPageTpl(pageTpl.id);">\n						  <img ng-src="{{PREFIX_FILE_HOST + pageTpl.properties.thumbSrc}}" />\n						</li>\n					  </ul>\n					</tab>\n					<tab ng-repeat="myname in myName" heading="{{myName[0].name}}" active="myname.active" ng-if = "pageTplTypes" ng-click = "getPageTplsByMyType()">\n					  <div style="padding:10px;" ng-hide="myPageTpls">在页面管理中选中页面，点击生成模板，即可生成我的页面模板！</div>\n					  <ul class="page_tpl_container clearfix">\n						<li thumb-tpl my-tpl="pageTpl" style="position: relative;" id="my-tpl" class="nr page_tpl_item comp-draggable my-tpl" ng-repeat="pageTpl in myPageTpls" title="点击插入编辑区域" ng-click="insertPageTpl(pageTpl.id);">                          \n						</li>\n					  </ul>\n					</tab>\n					<!-- 获取企业模板 -->\n					<tab ng-repeat="mycompany in myCompany" heading="{{myCompany[0].name}}" active="mycompany.active" ng-if = "pageTplTypes" ng-click = "getPageTplsByCompanyType()" ng-show="userProperty.type ==2 || userProperty.type ==21">\n						<div style="padding:10px;" ng-hide="myCompanyTpls">在页面管理中选中页面，点击企业模板，即可生成企业页面模板！</div>\n						<ul class="page_tpl_container clearfix">\n							<li thumb-tpl my-tpl="pageTpl" style="position: relative;" id="company-tpl" class="nr page_tpl_item comp-draggable my-tpl" ng-repeat="pageTpl in myCompanyTpls" title="点击插入编辑区域" ng-click="insertPageTpl(pageTpl.id);">\n							</li>\n						</ul>\n					</tab>                    \n				  </tabset>\n			  </tab>\n			</tabset>\n		  </div> \n		  <div class="phoneBox">\n			<div >\n				<div class="top"></div>\n				<div class = "phone_menubar"></div>\n				<div class="scene_title_baner">\n				  <div ng-bind="tpl.obj.scene.name" class="scene_title"></div>\n				</div>\n				<div class="nr sortable" id="nr"></div>\n				<div class="bottom"></div>\n				<div class = "tips">为了获得更好的使用，建议使用谷歌浏览器（chrome）、360浏览器、IE11浏览器。</div>\n			</div>\n			<div class="phone_texiao">\n				<div id="editBG" style="display: none;">\n					<span class="hint--right hint--rounded" data-hint="选择新背景">背景</span><div style="margin:10px 0;border-bottom: 2px solid #666;"></div><a style = "color: #666;" class="hint--bottom hint--rounded" data-hint="删除当前页面的背景"><span ng-click="removeBG($event)" class="glyphicon glyphicon-remove"></span></a>\n				</div>\n				<div id="editBGAudio" ng-click="openAudioModal()" ng-show="tpl.obj.scene.image.bgAudio">\n					<span class="hint--right hint--rounded" data-hint="选择新音乐">音乐</span><div style="margin:10px 0;border-bottom: 2px solid #666;"></div><a style = "color: #666;" class="hint--bottom hint--rounded" data-hint="删除当前页面的音乐"><span ng-click="removeBGAudio($event)" class="glyphicon glyphicon-remove"></span></a>\n				</div>\n				<div id="editScratch" ng-click="openOneEffectPanel(tpl.obj.properties)" ng-show="tpl.obj.properties">\n					<span class="hint--right hint--rounded" data-hint="选择新特效">{{effectName}}</span><div style="margin:10px 0;border-bottom: 2px solid #666;"></div><a style = "color: #666;" class="hint--bottom hint--rounded" data-hint="删除当前页面特效"><span ng-click="removeScratch($event)" class="glyphicon glyphicon-remove"></span></a>\n				</div>\n			</div>\n			<div class="history">\n				<a title="撤销(ctrl+z)" ng-click="back()"><i class="fa fa-reply" ng-class="{active: canBack}"></i></a>\n				<a title="恢复(ctrl+y)" ng-click="forward()"><i class="fa fa-share" ng-class="{active: canForward}"></i></a>\n				<a title="刷新预览" style="margin-top:10px;" ng-click="refreshPage(tpl.obj, pageNum, $event)"><i class="fa refresh"></i></a>				\n			</div>\n		  </div>\n		  <div id = "containment" class="create_right"> \n			<div class="guanli">页面管理</div>\n			<div class = "nav_top">\n			  <div class="nav_top_list">\n				<a ng-click="duplicatePage()" class="">复制</a>\n				<a ng-click = "creatMyTemplate()">我的模版</a>\n				<a ng-click = "creatCompanyTemplate()" ng-show="userProperty.type ==2">企业模版</a>\n				<a class="" ng-click = "deletePage($event)" ng-show = "pages.length != 1">删除</a>\n			  </div>\n			  <div class = "btn-group">\n				<div class="dropdown">\n				  <div id = "page_panel" ng-show="showPageEffect" class="dropdown-menu1 panel panel-default">\n					<ul class = "effect_list">\n					  <li class = "effect" ng-repeat = "effect in effectList" ng-click = "openOneEffectPanel(effect)">\n						<div class = "effect_img"><img ng-src="{{effect.src}}"></div>\n						<div class = "effect_info">{{effect.name}}</div>\n					  </li>\n					</ul>\n				  </div>\n				  <div id = "page_panel" ng-if="effectType == \'scratch\'" class="dropdown-menu1 panel panel-default">\n					<div class="panel-heading">涂抹设置</div>\n					<div class="panel-body">\n					  <form class="form-horizontal" role="form">\n						<div class="form-group form-group-sm clearfix" style="margin-bottom:0;">\n						  <label class="col-sm-5 control-label">覆盖特效</label>\n						  <div class="col-sm-7">\n							<select ng-model = "scratch.image" ng-options = "scracthImage.name for scracthImage in scratches"  style="width:115px;">\n							</select>\n						  </div>\n						</div>\n						<div class="form-group form-group-sm" style="margin-bottom:0px;margin-top:5px;">\n						  <label class="col-sm-5 control-label" style="padding-top:6px;">覆盖图片</label>\n						  <div class="col-sm-7">\n							<a ng-click = "openUploadModal()" class = "auto_img btn-main btn-success ">自定义图片</a>\n						  </div>\n						</div>\n						<div class = "divider" style="margin-top:6px;"></div>\n						<div class = "well" style="margin-bottom:0px;">\n						  <img class = "scratch" ng-src="{{scratch.image.path}}"/>\n						</div>\n						<div class = "divider"></div>\n						<div class="form-group form-group-sm" style="margin-bottom:10px;">\n						  <label for="inputEmail3" class="col-sm-5 control-label">涂抹比例</label>\n						  <div class="col-sm-7">\n							<select ng-model = "scratch.percentage" ng-options = "percentage.name for percentage in percentages">\n							</select>\n						  </div>\n						</div>\n						 <div class="form-group form-group-sm" style="margin-bottom:10px;">\n						  <label for="inputEmail3" class="col-sm-5 control-label">提示文字</label>\n						  <div class="col-sm-7">\n							<input type="text" ng-model = "scratch.tip" id="inputEmail3" placeholder="提示文字" maxlength = "15">\n						  </div>\n						</div>\n						<div class="form-group form-group-sm" style="margin-bottom:0px;">\n						  <div class="modal-footer" style="padding-bottom:0px;padding-top:0px;">\n							<a dropdown-toggle type="button" ng-click = "saveEffect(scratch)" class="btn-main" style="width:88px;border:none;">保存</a>\n							<a dropdown-toggle type="button" ng-click = "cancelEffect()" class="btn-grey0" style="width:88px;">取消</a>\n						  </div>\n						</div>\n					  </form>\n					</div>\n				  </div>\n\n				  <div id = "page_panel" ng-if="effectType==\'finger\'" class="dropdown-menu1 panel panel-default">\n\n					<div class="panel-heading">指纹设置</div>\n					<div class="panel-body">\n					  <form class="form-horizontal" role="form">\n						<div class="form-group form-group-sm" style="margin-bottom:10px;">\n						  <label class="col-sm-5 control-label">背景图片</label>\n						  <div class="col-sm-7">\n							<select ng-model = "finger.bgImage" ng-options = "bgImage.name for bgImage in fingerBackgrounds">\n							</select>\n						  </div>\n						</div>\n						<div class="form-group form-group-sm" style="margin-bottom:10px;">\n						  <label class="col-sm-5 control-label">指纹图片</label>\n						  <div class="col-sm-7">\n							<select ng-model = "finger.zwImage" ng-options = "zwImage.name for zwImage in fingerZws">\n							</select>\n						  </div>\n						</div>\n						<div class = "divider"></div>\n						<div class = "well" style="margin-bottom:15px;">\n						  <img class = "finger_bg" ng-src="{{finger.bgImage.path}}"/>\n							\n							<img class = "finger_zw" ng-src="{{finger.zwImage.path}}"/>\n						  					\n						</div>\n						<div class="form-group form-group-sm" style="margin-bottom:0px;">\n						  <div class="modal-footer" style="padding-bottom:0px;padding-top:0px;">\n							<a class="btn-main" dropdown-toggle type="button" ng-click = "saveEffect(finger)" class="btn btn-success btn-sm btn-main login" style="width:88px;">保存</a>\n							<a dropdown-toggle type="button" ng-click = "cancelEffect()" class="btn-grey0" style="width:88px;">取消</a>\n						  </div>\n						</div>\n					  </form>\n					</div>\n				  </div>\n				  <div id = "page_panel" ng-show="effectType == \'money\'" class="dropdown-menu1 panel panel-default">\n					<div class="panel-heading">数钱设置</div>\n					<div class="panel-body">\n					  <div class = "well" style="margin-bottom:15px;">\n						  <img ng-src="{{CLIENT_CDN + \'assets/images/create/money_thumb2.jpg\'}}"/>      \n					  </div>\n					  <div>\n						<span>文字提示：</span>\n						<span class="fr" style="width: 140px;"><input type="text" ng-model="money.tip" placeholder="让你数到手抽筋"></span>\n					  </div>\n					  <div class="form-group form-group-sm" style="margin-bottom:0px;">\n						<div class="modal-footer" style="padding-bottom:0px;padding-top:0px;">\n						  <a class="btn-main" dropdown-toggle type="button" ng-click = "saveEffect(money)" class="btn btn-success btn-sm btn-main login" style="width:88px;">保存</a>\n						  <a dropdown-toggle type="button" ng-click = "cancelEffect()" class="btn-grey0" style="width:88px;">取消</a>\n						</div>\n					  </div>\n					</div>\n				  </div>\n				  <div ng-include="\'scene/effect/falling.tpl.html\'"></div>\n				</div>\n			  </div>\n			</div>\n\n			<div class="nav_content">\n			  <ul id = "pageList" ui-sortable = "sortableOptions" ng-model="pages">\n				<li class = "blurClass" ng-repeat="page in pages track by $index" ng-click="navTo(page, $index, $event)" ng-init = "editableStatus[$index] = false" ng-class="{current: pageNum-1 == $index}" blur-children>\n					<span style = "float: left; margin-top: 17px; background: #fff; color: #666; font-weight: 200;border-radius:9px;width:18px;height:18px;padding:0px;text-align:center;line-height:18px;" class = "badge">{{$index+1}}</span>\n					<span style = "margin-left: 17px;font-size:14px;" ng-click = "editableStatus[$index] = true" ng-show = "!editableStatus[$index]">{{page.name}}</span>\n					<input style = "width: 80px; height: 25px;line-height: 25px; margin-top: 8px; margin-left: 10px; color: #999;" type = "text" ng-model = "page.name" ng-show = "editableStatus[$index]" ng-blur = "editableStatus[$index] = false;savePageNames(page, $index)" ng-focus = "getOriginPageName(page)" maxlength = "7" custom-focus/>                   \n				</li>\n			  </ul>\n			  <div class = "page-list-label" ng-show="isEditor && pageList == true">  \n				  <label ng-repeat = "allchild in pageLabelAll">\n					  <input type="checkbox" name="" value="" ng-model = "allchild.ischecked">{{allchild.name}}\n				  </label>                                                 \n				  <div class="select-labels">\n					  <a ng-click="pageChildLabel()">确定</a>\n				  </div>\n			  </div>               \n			</div>\n			<div class="nav_bottom">\n			  <a ng-click="insertPage()" class="" title="增加一页">+</a>\n			 <!--  <a ng-click="duplicatePage()" class="duplicate_page">复制一页</a> -->\n			</div>\n\n			<div ng-show="isEditor">\n			  <div class="btn-main" ng-click="chooseThumb()">选择本页缩略图</div>\n			  <img width="100" ng-src="{{PREFIX_FILE_HOST + tpl.obj.properties.thumbSrc}}"></img>\n			</div>\n		  </div>\n		  <div ng-include="\'scene/edit/select/select.tpl.html\'" ng-controller="selectCtrl">\n	  </div>\n  </div>\n</div>\n</div>\n');

    }]),b.module("scene/createNew.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/createNew.tpl.html", '<div class="modal-header">\n    <span class="glyphicon glyphicon-exclamation-sign"></span>\n    <span>新建场景</span>\n</div>\n<form name="resetForm" novalidate class="login-form">\n    <div class="login_form">\n        <div class="alert alert-warning" role="alert" ng-show="authReason">\n            {{authReason}}\n        </div>\n        <div class="alert alert-danger" role="alert" ng-show="authError">\n            {{authError}}\n        </div>\n        <div class="input-wrap">\n            <input name="name" placeholder="请填写场景名称" type="text" ng-model="scene.name" required autofocus>            \n        </div>\n        \n        <div class="input-wrap">\n            <select ng-model="scene.type" ng-options="scenetype.name for scenetype in scene.types" >\n            </select>\n        </div>\n        <div class="input-wrap" ng-show = "false">\n            <select ng-model="scene.pageMode" ng-options="pagemode.name for pagemode in pagemodes"></select>\n        </div>\n\n        <div class="modal-footer">\n            <div class="btn-main" ng-click="create()" ng-disabled=\'form.$invalid\'>创&nbsp;&nbsp;建</div>\n            <div class="btn-grey0" ng-click="cancel()" ng-disabled=\'form.$invalid\'>取&nbsp;&nbsp;消</div>\n        </div>\n\n        <p>特别说明：根据相关部门要求，暂不允许药品，医疗机构，医疗器械场景内容发布，请您理解。<a target="_blank" href="http://bbs.e.wesambo.com/forum.php?mod=viewthread&tid=890&extra=" style="font-weight: 400; color: red;">请查看审核规则</a></p>\n    </div>\n</form>\n')
    }]),b.module("scene/edit/select/select.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/edit/select/select.tpl.html", '<div class="select-panel" ng-show="showSelectPanel" panel-draggable>\n    <div class="select-header">多选操作</div>\n    <div class="select-content">\n        <ul>\n            <li><a title="左对齐" eqx-align-left><img ng-src="{{CLIENT_CDN}}assets/images/select/scene-all-left.png" alt="左对齐"/></a></li>\n            <li><a title="水平居中对齐" eqx-align-horizontal-center><img ng-src="{{CLIENT_CDN}}assets/images/select/scene-all-middle-horizontal.png" alt="水平居中对齐"/></a></li>\n            <li><a title="右对齐" eqx-align-right><img ng-src="{{CLIENT_CDN}}assets/images/select/scene-all-right.png" alt="右对齐"/></a></li>\n            <li><a title="上对齐" eqx-align-top><img ng-src="{{CLIENT_CDN}}assets/images/select/scene-all-top.png" alt="上对齐"/></a></li>\n            <li><a title="垂直居中对齐" eqx-align-vertical-center><img ng-src="{{CLIENT_CDN}}assets/images/select/scene-all-middle-vertical.png" alt="垂直居中对齐"/></a></li>\n            <li><a title="下对齐" eqx-align-bottom><img ng-src="{{CLIENT_CDN}}assets/images/select/scene-all-bottom.png" alt="下对齐"/></a></li>\n        </ul>\n        <ul>\n            <li><a title="复制" eqx-copy><img ng-src="{{CLIENT_CDN}}assets/images/select/scene-all-copy.png" alt="复制"></a></li>\n            <li><a title="粘贴" eqx-paste ng-style="{opacity: pasteOpacity}"><img ng-src="{{CLIENT_CDN}}assets/images/select/scene-all-paste.png" alt="粘贴"></a></li>\n            <li><a title="删除" eqx-delete-more><img ng-src="{{CLIENT_CDN}}assets/images/select/scene-all-delete.png" alt="删除"></a></li>\n        </ul>\n    </div>\n</div>')
    }]),b.module("scene/effect/falling.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/effect/falling.tpl.html", '<div id = "page_panel" ng-if="effectType == \'fallingObject\'" class="dropdown-menu1 panel panel-default">\n    <div class="panel-heading">落物设置</div>\n    <div class="panel-body">\n      <form class="form-horizontal" role="form">\n        <div class="form-group form-group-sm" style="margin-bottom:10px;">\n          <label class="col-sm-5 control-label">环境图片</label>\n          <div class="col-sm-7">\n            <select ng-model = "falling.src" ng-options = "fallingObj.name for fallingObj in fallings">\n            </select>\n          </div>\n        </div>\n        <div class = "divider"></div>\n        <div class = "well" style="margin-bottom:15px;text-align: center;background-color: #ddd">\n          <img ng-src="{{falling.src.path}}"/>\n        </div>\n        <div class = "divider"></div>\n        <div class="form-group form-group-sm" style="margin-bottom:10px;">\n          <label class="col-sm-5 control-label">环境氛围</label>\n          <div class="col-sm-7">\n          	<div style="line-height: 24px;font-size: 12px;"><span style="margin-right:39px;">弱</span><span style="margin-right:37px;">中</span><span>强</span></div>\n          	<div style="width: 100px;" ui-slider min="1" max="3" ng-model="falling.density"></div>\n\n          </div>\n        </div>\n        \n        <div class="form-group form-group-sm" style="margin-bottom:0px;">\n          <div class="modal-footer" style="padding-bottom:0px;padding-top:0px;">\n            <a class="btn-main" dropdown-toggle type="button" ng-click = "saveEffect(falling)" class="btn btn-success btn-sm btn-main login" style="width:88px;">保存</a>\n            <a dropdown-toggle type="button" ng-click = "cancelEffect()" class="btn-grey0" style="width:88px;">取消</a>\n          </div>\n        </div>\n      </form>\n    </div>\n  </div>')
    }]),b.module("scene/scene.tpl.html", []).run(["$templateCache", function (a) {
        a.put("scene/scene.tpl.html", '\n<div ng-include="\'header.tpl.html\'"></div>\n<div class="choose_template min_contain">\n    <div class="main clearfix">\n        <div class="title">\n            空白自主创建，或者选择一个样例\n            <!-- <a class="btn-secondary" ng-click="createScene()">or自主创建</a> -->\n        </div>\n\n        <div class="scene_type clearfix">\n            <div class="new_hot"><a ng-class="{hover: order==\'new\'}" ng-click="tplnew(\'new\')">最新场景</a><a ng-class="{hover: order==\'hot\'}" ng-click="tplnew(\'hot\')">热门场景</a></div>\n            <div class="scene_list">\n                <ul class="clearfix scene_cat">\n                    <li ng-class="{active : 0 == childcat}" ng-click="allpage(null,null)">全部</li>\n                    <li ng-class="{active : pageTplType.value == childcat}" ng-click="getPageTplsByType(pageTplType.value,pageTplType.id)" ng-repeat="pageTplType in pageTplTypes">{{pageTplType.name}}</li>\n                    <li ng-class="{active: 1 == childcat}" ng-click="getCompanyTpl()" ng-show="userProperty.type ==2 || userProperty.type ==21">企业样例</li>\n                </ul>\n                <ul class="clearfix child_cat">\n                    <li ng-click="getPageTpls(type,childCat.bizType,childCat.id)" ng-class="{active:childCat.id == categoryId}" ng-repeat="childCat in childCatrgoryList">{{childCat.name}}</li>\n                </ul>                \n            </div>\n        </div>\n        \n        <div class="content clearfix">\n            <div class="mask">\n                <ul>\n                    <li ng-click = "createScene()" title="创建一个空白场景">                        \n                        <div style="height:240px; background-color:#bdd5ef;"><i class = "fa fa-plus"></i></div>\n                        <p style="height:100px;">自主创建<i class="add_icon"></i></p>                  \n                    </li>\n                    <li ng-repeat="tpl in tpls track by $index" ng-class="{mr0:$index%4 == 2}">         \n                        <div class = "roll" ng-hover>\n                            <div class = "mask-floor" style = "display: none">\n                            </div>\n                            <img style="width:235px;height:240px;" ng-src="{{PREFIX_FILE_HOST + tpl.image.imgSrc}}" alt="" />\n                            <div class="my_xinxi"><p>{{tpl.name}}<i class="add_icon"></i></p>\n                                <p style="background-color:#FFF;color:#999;padding-right:10px;">作者：{{tpl.userName}}</p>\n                            </div>\n                            <a class = "preview_scene btn" href="{{PREFIX_CLIENT_HOST + \'v-\' + tpl.code}}" target="_blank">预览</a>\n                            <a class = "preview_scene edit_scene btn" ng-click="createScene(tpl)">就这个了</a>\n                        </div>                \n                    </li>\n                </ul>\n            </div>\n        </div>\n        <div class="clearfix fl" ng-show="tpls.length > 0">\n            <pagination style="float: left" first-text="首页" last-text="尾页" previous-text="上一页" next-text="下一页" max-size="10" items-per-page="11" total-items="totalItems" ng-model="currentPage" ng-change="pageChanged(currentPage)" boundary-links="true" rotate="true" num-pages="numPages"></pagination>\n            <div class="current_page">\n                <input type="text" ng-model="toPage" ng-keyup="$event.keyCode == 13 ? pageChanged(toPage) : null">\n                <a ng-click="pageChanged(toPage)" class="go">GO</a>\n                <span>当前: {{currentPage}} / {{numPages}} 页</span>\n            </div>\n        </div>\n    </div>\n</div>\n\n</script>')//<div ng-include="\'footer.tpl.html\'"></div>
    }]),b.module("usercenter/console/branch.tpl.html", []).run(["$templateCache", function (a) {
        a.put("usercenter/console/branch.tpl.html", '<div class="branch-modal">\n    <div class="branch-list">\n        <label>分账号</label><input type="text" ng-model="branch.loginName" placeholder="请设置邮箱账号" ng-readonly="originData"/> <span>默认密码为eqxiu</span>\n    </div>\n    <div class="branch-list">\n        <label>用户名</label><input type="text" ng-model="branch.name" placeholder="请填写用户名"/>\n    </div>\n    <div class="branch-list">\n        <label>部门</label>\n        <select style="width:260px;margin-left:-5px;" ng-model="branch.dept" ng-options="dept.name for dept in depts">\n            <option value="">全部</option>\n        </select>\n    </div>\n    <div ng-show="!showAddSec">\n        <span class="fa fa-plus-circle add-dept" ng-click="showAddSec = true;">&nbsp;添加部门</span>\n    </div>\n    <div ng-show="showAddSec" class="dept-list">\n        <input class="dept-name" type="text" ng-model="dept.name"/>\n        <span>输入部门名称</span>\n        <span class="btn add" ng-click="addDept();">添加</span>\n        <span class="btn cancel" ng-click="showAddSec = false;">取消</span>\n    </div>\n    <div class="modal-footer">\n        <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确认</a>\n        <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n    </div>\n</div>')
    }]),b.module("usercenter/console/relAccount.tpl.html", []).run(["$templateCache", function (a) {
        a.put("usercenter/console/relAccount.tpl.html", '<div class="transfer">\n	<div class="clearfix">\n		<div class="alert" style="text-align: center;background-color: #f0f0f0;" ng-show="relErr">{{relErr}}</div>\n		<div class="transfer_list">\n			<label>登录账号</label><input type="text" ng-model="user.email" ng-blur="checkUpperCase();" placeholder="输入邮箱"/>\n		</div>\n		<div class="transfer_list">\n			<label>密码</label><input type="password" style="float:right;" maxlength = "12" ng-model="user.password" placeholder="输入密码"/>\n		</div>	\n		<div class="modal-footer">\n		    <a class="btn-main login" style="width: 88px;" ng-click="relAccount()">立即绑定</a>\n		    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n		</div>\n	</div>\n</div>')
    }]),b.module("usercenter/console/upgrade_company.tpl.html", []).run(["$templateCache", function (a) {
        a.put("usercenter/console/upgrade_company.tpl.html", '<div class="tab-contain upgrade">\n	<div class="same-head">\n		<h1>企业信息</h1>\n		<p ng-show="!authError">完善你的企业信息后，才能申请企业账号！</p>\n		<p ng-show="authError">{{authError}}</p>\n	</div>\n	<div class="same-content">\n		<form class="form-horizontal ng-pristine ng-valid" role="form">\n		    <div class="form-group">\n		        <label for="inputPassword3" class="col-sm-3 control-label">企业</label>\n		        <div class="col-sm-7">\n		            <input type="text" class="form-control" ng-model="companyInfo.name" placeholder="企业名称"><span>必填</span>\n		        </div>\n		    </div>\n		    <div class="form-group">\n		        <label for="inputPassword3" class="col-sm-3 control-label">企业规模</label>\n		        <div class="col-sm-7">\n		            <select style="width:90%" ng-model="companyInfo.scale" ng-options="scale.name for scale in scales">\n		            	<option value="">无</option>\n		            </select>\n		            <span>必填</span>\n		        </div>\n		    </div>	\n		    <div class="form-group">\n		        <label for="inputPassword3" class="col-sm-3 control-label">所属行业</label>\n		        <div class="col-sm-7">\n		            <select style="width:90%" ng-model="companyInfo.industry" ng-options="industry.name for industry in industries">\n		            	<option value="">无</option>\n		            </select>\n		            <span>必填</span>\n		        </div>\n		    </div>	\n	        <div class="form-group">\n	            <label for="inputPassword3" class="col-sm-3 control-label">部门</label>\n	            <div class="col-sm-7">\n	                <input type="text" class="form-control" ng-model="companyInfo.department" placeholder="部门"><span>必填</span>\n	            </div>\n	        </div>	\n	        <div class="form-group">\n	            <label for="inputPassword3" class="col-sm-3 control-label">企业邮箱</label>\n	            <div class="col-sm-7">\n	                <input type="text" class="form-control" ng-model="companyInfo.email" placeholder="企业邮箱"><span>必填</span>\n	            </div>\n	        </div>	        	    	    	    \n	        <div class="form-group">\n	            <label for="inputPassword3" class="col-sm-3 control-label">网址</label>\n	            <div class="col-sm-7">\n	                <input type="text" class="form-control" ng-model="companyInfo.website" placeholder="网址"><span>必填</span>\n	            </div>\n	        </div>\n	        <div class="form-group">\n	            <label for="inputPassword3" class="col-sm-3 control-label">地址</label>\n	            <div class="col-sm-7">\n	                <input type="text" class="form-control" ng-model="companyInfo.address"  placeholder="地址"><span>必填</span>\n	            </div>\n	        </div>\n	        <div class="form-group">\n	            <label for="inputPassword3" class="col-sm-3 control-label">联系人</label>\n	            <div class="col-sm-7">\n	                <input type="text" class="form-control" ng-model="companyInfo.contacts" placeholder="联系人"><span>必填</span>\n	            </div>\n	        </div>\n	        <div class="form-group">\n	            <label for="inputPassword3" class="col-sm-3 control-label">手机</label>\n	            <div class="col-sm-7">\n	                <input type="type" class="form-control" ng-model="companyInfo.tel" placeholder="手机"><span>必填</span>\n	            </div>\n	        </div>\n	        <div class="form-group">\n	            <label for="inputPassword3" class="col-sm-3 control-label">电话</label>\n	            <div class="col-sm-7">\n	                <input type="type" class="form-control" ng-model="companyInfo.mobile" placeholder="电话" maxlength = \'12\'><span>必填</span>\n	            </div>\n	        </div>	        \n	        <div class="form-group clearfix">\n	            <div class="col-sm-7 upload-company">\n					<img class="upload-img" ng-show="companyInfo.license" style="margin-left:-15px;padding-top:0" ng-model="companyInfo.license" ng-src="{{companyImg ||(PREFIX_FILE_HOST + companyInfo.license)}}" width="220px" height="160px" />\n	            	<a ng-hide="companyInfo.license" class="upload-com-con" ng-click="goUpload()">\n		                <img ng-src="{{CLIENT_CDN}}assets/images/upload_03.png" >\n		                <p>点击上传企业营业照片</p>\n		                <p style="padding-left:45px;">将优先审核</p>\n		            </a>\n	            </div>\n	            <div ng-show="companyInfo.license" class="updata-img"><a ng-click="goUpload()">更改图片</a></div>\n	        </div>\n	        <div class="form-group">\n	            <div class="falv">\n	                <input style="margin-top:0px;width:20px;float:none;" type="checkbox" value="  true" class="col-sm-3 ng-pristine ng-valid" checked disabled="disabled">  我确认提供信息真实可靠，并承担相关法律责任\n	            </div>\n	        </div>		      		      		      		      \n	        <div class="form-group sub-qx" style="border-top:1px solid #E6E6E6;padding-top:15px;margin-left:15px;margin-right:15px;">\n	        	<div class="col-sm-offset-4 col-sm-10">\n	            	<a class="btn-main login" style="width: 88px;" ng-click="upgradeCompanyMessage(companyInfo)">提交</a>\n	                <a class="btn-grey0 cancel" style="width: 88px;" ng-click="quXiao()">取消</a>\n	            </div>\n	        </div>\n		</form>		\n	</div>\n</div>')
    }]),b.module("usercenter/request_reg.tpl.html", []).run(["$templateCache", function (a) {
        a.put("usercenter/request_reg.tpl.html", '<div class="request_reg">\n	<div class="close" ng-click="cancel()">x</div>\n	<div class="erwei" qr-code qr-url="{{PREFIX_CLIENT_HOST + \'/m/#/wxLogin?id=\' + currentUser.id}}"></div>\n<!-- 	<div class="erwei" qr-code qr-url="{{PREFIX_CLIENT_HOST + \'/m/#/wxreg?id=\' + currentUser.id}}"></div>	 -->	\n</div>')
    }]),b.module("usercenter/tab/account.tpl.html", []).run(["$templateCache", function (a) {
        a.put("usercenter/tab/account.tpl.html", '<div class="panel panel-default">\n  <div class="panel-body">\n    <div class="account" ng-show="!showBranch">\n        <div class="login-name">登录账号：\n            <span>{{userinfo.noRel || userinfo.loginName}} <a ng-if="!userinfo.noRel" ng-click="  goReset()" style="color:#08a1ef;padding-left:5px;">修改密码</a></span>\n            <span ng-if="userinfo.noRel"><a style="display:inline-block;" href="" ng-click="  relAccount()"><img ng-src="{{CLIENT_CDN}}assets/images/bangding.png"></a></span>\n        </div>\n        <div class="company-message">\n            <span ng-show="userinfo.type ==1 && companyInfo.status != 0"><a ng-click="upgradeCompany()">升级为企业账号</a><img ng-src="{{CLIENT_CDN}}assets/images/query.png" title="  企业账号：提供企业功能，适合企业自己使用，可以按照部门创建分账号 "></span>\n            <span ng-show="companyInfo.status == 0">企业账号申请中</span>\n            <span ng-show="companyInfo.status == -1">企业账号审核被拒绝!</span>\n        </div>        \n        <!-- 绑定邮箱弹出框 -->\n        <div class="email-account" ng-show="emailAccount">\n            <h1>您的账号还没有绑定邮箱</h1>\n            <p>去用户中心>账号管理，<a ng-click="relAccount()">马上绑定</a></p>\n        </div>     \n        <div class="company-message" ng-show="userinfo.type==2">账号类型：\n            <span>企业账号</span>\n            <span><a ng-click="showBranch = true;">管理分账号</a></span>\n        </div>\n        <div class="relInfo" ng-if="!userinfo.noRel">\n          <div>账号关联后，可以通过关联账号直接登录！</div>\n          <ul class="clearfix" style="margin-top: 20px;">\n              <li class="wx" ng-class="{wxrel: wxRel}"><img ng-src="  {{CLIENT_CDN}}assets/images/wechatwhite.png">微信<span ng-if="!wxRel">未关联</span><span ng-if="wxRel">已关联</span></li>\n              <li class="qq" ng-class="{qqrel: qqRel}"><img ng-src="  {{CLIENT_CDN}}assets/images/QQwhite.png">QQ<span ng-if="!qqRel">未关联</span><span   ng-if="qqRel">已关联</span></li>\n              <li class="wb" ng-class="{wbrel: wbRel}"><img ng-src="  {{CLIENT_CDN}}assets/images/weibowhite.png">微博<span ng-if="!wbRel">未关联</span><span ng-if="wbRel">已关联</span></li>\n          </ul>\n        </div>\n    </div>\n    <div class="branches" ng-show="showBranch">\n        <div class="ctrl-opera">\n            <span class="fa fa-mail-reply" ng-click="showBranch=false;">&nbsp;&nbsp;返回</span>\n            <span class="fa fa-plus-circle fr" ng-click="manageBranch()">&nbsp;&nbsp;添加账号</span>\n        </div>\n        <div class="branch-list">\n            <table class = "col-sm-12 table table-bordered text-center branches-table" >\n                <thead>\n                    <tr>\n                        <th class="col-sm-3">&nbsp;分账号&nbsp;</th>\n                        <th class="col-sm-2">用户名</th>\n                        <th class="col-sm-2">部门</th>\n                        <th class="col-sm-2">创建时间</th>\n                        <th class="col-sm-3">管理</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr ng-repeat="branch in branches">\n                        <td>{{branch.loginName}}</td>\n                        <td>{{branch.name}}</td>\n                        <td>{{branch.deptName}}</td>\n                        <td>{{branch.regTime | date:\'yyyy-MM-dd\'}}</td>\n                        <td>\n                            <a class="branch-close" ng-show="branch.status==1" ng-click="openBranch(branch, false);"><ins>关闭</ins></a>\n                            <a class="branch-close" ng-show="branch.status==2" ng-click="openBranch(branch, true);"><ins>开放</ins></a>\n                            <a ng-click="manageBranch(branch)"><span class="glyphicon glyphicon-cog"></span></a>\n                        </td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n        <div class="clearfix fl" ng-show = "branches.length > 0">\n            <pagination style="float: left" first-text="首页" last-text="尾页" previous-text="上一页" next-text="下一页" max-size="5" items-per-page="XdpageSize" total-items="branchesCount" ng-model="currentPage.branchCurrentPage" boundary-links="true" rotate="true" num-pages="branchesNumPages"></pagination>\n            <div class="current_page">\n                <input type="text" ng-model="branchToPage" ng-keyup="$event.keyCode == 13 ? pageChanged(branchToPage, \'branchCurrentPage\') : null">\n                <a ng-click="pageChanged(branchToPage, \'branchCurrentPage\')" class="go">GO</a>\n                <span>当前: {{currentPage.branchCurrentPage}} / {{branchesNumPages}} 页</span>\n            </div>\n        </div>\n    </div>\n  </div>\n</div>')
    }]),b.module("usercenter/tab/message.tpl.html", []).run(["$templateCache", function (a) {
        a.put("usercenter/tab/message.tpl.html", '<div class="panel panel-default">\n  <div class="panel-body message-panel">\n    <div class="panel-heading" ng-show = "newMsgs.length > 0" style="padding-right:0px;">\n       <span style = "float: right;"><a style = "color: #08a1ef;" ng-click = "setRead(newMsgs)">全部设为已读</a></span>\n    </div>                \n    <div class = "clearfix" style="border-bottom: 1px solid #F0F0F0;" ng-repeat = "newMsg in newMsgs">\n      <div style="width:120px;float:left;" class = "mes_content mes_type" ng-class = "{new_msg: newMsg.status == 1,yidu_msg: newMsg.status == 2}"><span class = "glyphicon" ng-class = "{\'glyphicon-bullhorn\': newMsg.bizType==1,\'glyphicon-ban-circle\': newMsg.bizType==2, \'glyphicon-star-empty\': newMsg.bizType == 3}"></span> {{newMsg.type}}</div>\n      <div class = "mes_content xiaoxi_con" ng-bind-html="newMsg.content">\n      </div>\n      <div class = "mes_content" style="width:165px;float:left;padding-right:0px;text-align:right;">{{newMsg.sendTime | date:\'yyyy-MM-dd HH:mm:ss\'}}</div>\n    </div>\n    <div ng-show = "newMsgs.length == 0">您暂时还没有消息！</div>\n    <div class="clearfix fl" ng-show = "newMsgs.length > 0">\n          <pagination style="float: left" first-text="首页" last-text="尾页" previous-text="上一页" next-text="下一页" max-size="5" items-per-page="pageSize" total-items="msgCount" ng-model="currentPage.msgCurrentPage" boundary-links="true" rotate="true" num-pages="msgNumPages"></pagination>\n          <div class="current_page">\n              <input type="text" ng-model="toPage" ng-keyup="$event.keyCode == 13 ? pageChanged(toPage, \'msgCurrentPage\') : null">\n              <a ng-click="pageChanged(toPage, \'msgCurrentPage\')" class="go">GO</a>\n              <span>当前: {{currentPage.msgCurrentPage}} / {{msgNumPages}} 页</span>\n          </div>\n      </div>\n    </div>\n</div>')
    }]),b.module("usercenter/tab/reset.tpl.html", []).run(["$templateCache", function (a) {
        a.put("usercenter/tab/reset.tpl.html", '<div class="tab-contain ">\n    <div class="same-head">\n        <h1>修改密码</h1>\n        <p ng-show="!authError">信息提示中心</p>\n        <p ng-show="authError">{{authError}}</p>\n    </div>\n    <div class="same-content">\n        <form class="form-horizontal" role="form" style = "margin-top: 25px;">\n            <div class="form-group" style="margin-bottom: 22px;">\n                <label for="inputPassword3" class="col-sm-3 control-label">登录账号</label>\n                <div class="col-sm-6" style="top: 6px;">{{userinfo.noRel || userinfo.loginName}}</div>\n            </div>\n            <div class="form-group">\n                <label for="inputPassword3" class="col-sm-3 control-label">原始密码</label>\n                <div class="col-sm-6">\n                    <input type="password" class="form-control" ng-model = "password.old" id="inputPassword3" placeholder="原始密码">\n                </div>\n            </div>\n            <div class="form-group">\n                <label for="inputPassword3" class="col-sm-3 control-label">新密码</label>\n                <div class="col-sm-6">\n                    <input type="password" class="form-control" ng-model = "password.newPw" id="    inputPassword3" placeholder="新密码">\n                </div>\n            </div>\n            <div class="form-group">\n                <label for="inputPassword3" class="col-sm-3 control-label">重复密码</label>\n                <div class="col-sm-6">\n                    <input type="password" class="form-control" ng-model = "password.confirm" id="inputPassword3" placeholder="重复密码">\n                </div>\n            </div>\n            <div class="form-group">\n                <div class="col-sm-offset-3 col-sm-10" style="margin-top:14px;padding-bottom:15px;">\n                    <a class="btn-main login" style="width: 88px;" ng-click="reset()">保存</a>\n                    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="quXiao()">取消</a>\n                </div>\n            </div>\n        </form>     \n    </div>\n</div>')
    }]),b.module("usercenter/tab/userinfo.tpl.html", []).run(["$templateCache", function (a) {
        a.put("usercenter/tab/userinfo.tpl.html", '<div class="panel panel-default">\n  <div class="panel-body">\n    <fieldset ng-disabled  = "!editInfo.isEditable">                 \n      <form class="form-horizontal" role="form" style="margin-left:220px;margin-top:25px;">\n        <div class="form-group" style="margin-bottom: 22px;">\n          <label for="inputPassword3" class="col-sm-2 control-label">登录账号</label>\n          <div class="col-sm-6" style="top: 6px;">{{userinfo.noRel || userinfo.loginName}}</div>\n        </div>\n        <div ng-show="userProperty.type !==2">\n            <div class="form-group">\n              <label for="inputEmail3" class="col-sm-2 control-label">用户名</label>\n              <div class="col-sm-6">\n                <input type="text" class="form-control" ng-model = "userinfo.name" id="inputEmail3" placeholder="用户名" maxlength = "12">\n              </div>\n            </div>\n            <div class="form-group">\n              <label class="col-sm-2 control-label">性别</label>\n              <div class="col-sm-6">\n                <label class="radio-inline">\n                  <input type="radio" ng-model = "userinfo.sex" id="inlineRadio1" value="1"> 男\n                </label>\n                <label class="radio-inline">\n                  <input type="radio" ng-model = "userinfo.sex" id="inlineRadio2" value="2"> 女\n                </label>\n              </div>\n            </div>\n            <div class="form-group">\n              <label for="inputEmail3" class="col-sm-2 control-label">手机</label>\n              <div class="col-sm-6">\n                <input type="text" class="form-control" ng-model = "userinfo.phone" id="inputEmail3" placeholder="手机">\n              </div>\n            </div>\n            <div class="form-group">\n              <label for="inputPassword3" class="col-sm-2 control-label">QQ</label>\n              <div class="col-sm-6">\n                <input type="text" class="form-control" ng-model = "userinfo.qq" id="inputPassword3" placeholder="QQ">\n              </div>\n            </div>\n            <div class="form-group">\n              <label for="inputPassword3" class="col-sm-2 control-label">座机</label>\n              <div class="col-sm-6">\n                <input type="text" class="form-control" ng-model = "userinfo.tel" id="inputPassword3" placeholder="座机">\n              </div>\n            </div>\n      </div>\n      <div ng-show="userProperty.type ==2">\n          <div class="form-group">\n            <label for="inputCompany" class="col-sm-2 control-label">企业</label>\n            <div class="col-sm-6">\n              <input type="text" class="form-control" ng-model = "companyInfo.name" id="inputCompany" placeholder="企业">\n            </div>\n          </div> \n          <div class="form-group">\n            <label for="inputWeb" class="col-sm-2 control-label">网址</label>\n            <div class="col-sm-6">\n              <input type="text" class="form-control" ng-model = "companyInfo.website" id="inputWeb" placeholder="网址">\n            </div>\n          </div> \n          <div class="form-group">\n            <label for="inputAddress" class="col-sm-2 control-label">地址</label>\n            <div class="col-sm-6">\n              <input type="text" class="form-control" ng-model = "companyInfo.address" id="inputAddress" placeholder="地址">\n            </div>\n          </div>\n          <div class="form-group">\n            <label for="inputcontacts" class="col-sm-2 control-label">联系人</label>\n            <div class="col-sm-6">\n              <input type="text" class="form-control" ng-model = "companyInfo.contacts" id="inputcontacts" placeholder="联系人" maxlength = "12">\n            </div>\n          </div> \n          <div class="form-group">\n            <label for="inputEmail3" class="col-sm-2 control-label">手机</label>\n            <div class="col-sm-6">\n              <input type="text" class="form-control" ng-model = "companyInfo.tel" id="inputEmail3" placeholder="手机">\n            </div>\n          </div>  \n          <div class="form-group">\n            <label for="inputEmail3" class="col-sm-2 control-label">座机</label>\n            <div class="col-sm-6">\n              <input type="text" class="form-control" ng-model = "companyInfo.mobile" id="inputEmail3" placeholder="座机">\n            </div>\n          </div>                                                        \n      </div>     \n      <div class="form-group">\n        <div>\n          <script type="text/javascript" src="http://api.geetest.com/get.php?gt=1ebc844c9e3a8c23e2ea4b567a8afd2d"></script>\n        </div>\n      </div>\n      <div class="form-group">\n        <div class="col-sm-offset-2 col-sm-10">\n          <a class="btn-main" ng-show = "editInfo.isEditable && userProperty.type !==2" ng-click = "saveUserInfo(userinfo)">保存</a>\n          <a class="btn-main" ng-show = "editInfo.isEditable && userProperty.type ==2" ng-click = "saveCompanyInfo(companyInfo)">保存</a>          \n          <a class="btn-grey0" ng-click = "cancel();" ng-show = "editInfo.isEditable">取消</a>\n        </div>\n        <div class="col-sm-offset-2 col-sm-10"><a class="btn-main" ng-click = "editInfo.isEditable = true;" ng-show="!editInfo.isEditable"><span>编辑</span></a></div> \n      </div>\n    </form>\n    </fieldset>\n  </div>\n</div>')
    }]),b.module("usercenter/tab/xd.tpl.html", []).run(["$templateCache", function (a) {
        a.put("usercenter/tab/xd.tpl.html", '<div class="panel panel-default">\n  <div class="panel-body">\n    <div style="border-bottom:1px solid #E7E7E7;padding-bottom:20px;">\n      <p style="float:right;padding-top:12px;"><a href="http://bbs.e.wesambo.com/forum.php?mod=viewthread&tid=297&extra=page%3D1" target="_blank">什么是秀点？</a></p>\n      <div style = "display: inline-block; width: auto;">我的秀点: <span style = "font-size: 26px; font-weight: 500;color:#08a1ef;">{{xdCounts}}</span>个&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span ng-click="openReg()" class="yaoqing" ng-show="sendXd.state"><em>邀请注册得秀点</em></span></div>\n    </div>\n    <div class="xiudian clearfix">\n      <div class="zhuansong"><img ng-click="openXd()" ng-src="{{CLIENT_CDN}}assets/images/zengsong.png" title="转送秀点" /></div>\n      <div class="shiyong_xd">\n        <ul class="clearfix">\n          <li class="huode">获得秀点<p>{{getXdStat.add | fixnum}}</p></li>\n          <li class="song">转送秀点<p>{{getXdStat.give | fixnum}}</p></li>\n          <li class="shiyong">使用秀点<p>{{getXdStat.pay | fixnum}}</p></li>\n        </ul>\n      </div>\n    </div>\n    <div class = "cols-sm-10 text-center" style = "margin-top: 30px;">\n      <p style="text-align:left;padding-bottom:20px;">秀点详情：</p>\n      <table class = "table table-bordered col-sm-12 table-striped">\n        <thead class = "text-center">\n          <tr>\n            <th class = "col-sm-2">类型</th>\n            <th class = "col-sm-2">时间</th>\n            <th class = "col-sm-2">数量</th>\n            <th class = "col-sm-6">使用详情</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr ng-repeat = "xd in xdLogs" style = "text-valign:middle;">\n            <td>{{xd.bizTitle}}</td>\n            <td>{{xd.optTime | date:\'yyyy-MM-dd HH:mm:ss\'}}</td>\n            <!-- <td>{{xd.bizType}}<a style = "height: 30px;" ng-href="{{PREFIX_CLIENT_HOST + \'/view.html?sceneId=\' + xd.sceneId}}">查看详情</a></td> -->\n            <td>{{xd.xd | fixnum}}</td>\n            <td>{{xd.remark}}</td>\n          </tr>\n        </tbody>\n      </table>\n      <div class="clearfix fl" ng-show = "xdLogs.length > 0">\n            <pagination style="float: left" first-text="首页" last-text="尾页" previous-text="上一页" next-text="下一页" max-size="5" items-per-page="XdpageSize" total-items="XdCount" ng-click="XdpageChanged(XdcurrentPage)" ng-model="XdcurrentPage" boundary-links="true" rotate="true" num-pages="XdNumPages"></pagination>\n            <div class="current_page">\n                <input type="text" ng-model="XdcurrentPage" ng-keyup="$event.keyCode == 13 ? XdpageChanged(XdcurrentPage) : null">\n                <a ng-click="XdpageChanged(XdcurrentPage)" class="go">GO</a>\n                <span>当前: {{XdcurrentPage}} / {{XdNumPages}} 页</span>\n            </div>\n        </div>                                    \n    </div>\n  </div>\n</div>');

    }]),b.module("usercenter/transfer.tpl.html", []).run(["$templateCache", function (a) {
        a.put("usercenter/transfer.tpl.html", '<div class="transfer">\n	<div  ng-show="transfer">\n		<p>我的秀点<span>{{xdCount | fixnum}}</span>个</p>\n		<div class="transfer_list">\n			<label>转送账号</label><input type="text" ng-model="userXd.toUser" /><!-- <span ng-hide="actionerror || !submit" class="right"><img ng-src="{{CLIENT_CDN}}assets/images/dui.png" /></span> --><span ng-show="actionerror" class="error"><img ng-src="{{CLIENT_CDN}}assets/images/wrong.png" /></span>\n			<div ng-show="actionerror">{{actionerror}}</div>\n		</div>\n		<div class="transfer_list">\n			<label>转送数目</label><input type="text" maxlength = "12" ng-model="userXd.xdCount" /><!-- <span ng-hide="retrieverror || !submit" class="right"><img ng-src="{{CLIENT_CDN}}assets/images/dui.png" /></span> --><span ng-show="retrieverror" class="error"><img ng-src="{{CLIENT_CDN}}assets/images/wrong.png" /></span>\n			<div ng-show="retrieverror">{{retrieverror}}</div>\n		</div>	\n		<div class="modal-footer">\n		    <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确认</a>\n		    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n		</div>\n		<div class="action" style="text-align:center;background-color:#CCC;padding:3px 0;"><a style="font-size:12px;" href="http://bbs.e.wesambo.com/forum.php?mod=viewthread&tid=1959&extra=page%3D1" target="_blank" >秀点转送是用户个人行为，请注意防范风险！</a></div>\n	</div>\n	<div ng-hide="transfer" style="text-align:center;" id="transfer_mes">\n		<p>你已为<span style="padding:0 15px">{{userXd.toUser}}</span>成功转送<span style="padding:0 15px">{{userXd.xdCount | fixnum}}</span>个秀点！</p>\n		<a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">关闭</a>\n	</div>\n</div>')
    }]),b.module("usercenter/usercenter.tpl.html", []).run(["$templateCache", function (a) {
        a.put("usercenter/usercenter.tpl.html", '<div ng-include="\'header.tpl.html\'"></div>\n<div id = "usercenter" class="min_contain">\n  <div class = "main clearfix">\n    <div class = "content">\n        <div class = "user_contain clearfix">\n          <div class = "user_img" ng-mouseover = "showCustomButton=true" ng-mouseleave = "showCustomButton=false;">\n            <img ng-src="{{headImg ||(PREFIX_FILE_HOST + userinfo.headImg)}}" width="160px" height="160px" />\n            <div ng-show = "showCustomButton" class = "upload_button" ng-click = "customerUpload()">上传头像</div>\n          </div>\n          <div class="user_message">\n            <p>用户名：{{userinfo.name}}</p>\n            <p>我的秀点：{{xdCounts}}个 <a href="http://bbs.e.wesambo.com/forum.php?mod=viewthread&tid=297&extra=page%3D1" target="_blank" style="padding-left:5px;">获取秀点</a></p>\n            <p>站内信息：<a href="#/usercenter/message">{{msgCount}}</a>条</p>\n          </div>\n        </div>\n        <div class="tab_user" style = "padding: 0;">\n          <ul class="nav nav-tabs tabs-left clearfix">\n            <li ng-class="{active: tabid == \'userinfo\'}"><a ng-click="goBaseInfo()">基础信息</a></li>\n            <li ng-class="{active: tabid == \'account\'}"><a ng-click="goAccount()">账号管理</a></li>\n            <li ng-class="{active: tabid == \'xd\'}"><a ng-click="goXd()">我的秀点</a></li>\n<!--              <li ng-class="{active: tabid == \'reset\'}" ng-if="!userinfo.noRel"><a ng-click="goReset()">修改密码</a></li> -->\n             <li ng-class="{active: tabid == \'message\'}"><a ng-click="goMessage()">站内消息</a></li>\n          </ul>\n        </div>        \n      <div class="">\n        <div class="tab-content">\n          <div class="tab-pane" ng-class="{active: tabid == \'userinfo\'}" id="home">\n            <div ng-include="\'usercenter/tab/userinfo.tpl.html\'"></div>\n          </div>\n          <div class="tab-pane" ng-class="{active: tabid == \'account\'}" id="account">\n            <div ng-include="\'usercenter/tab/account.tpl.html\'"></div>\n          </div>\n          <div class="tab-pane" ng-class="{active: tabid == \'xd\'}" id="profile">\n            <div ng-include="\'usercenter/tab/xd.tpl.html\'"></div>\n          </div>\n<!--           <div class="tab-pane" ng-class="{active: tabid == \'reset\'}" ng-if="!userinfo.noRel" id="profile">\n            <div ng-include="\'usercenter/tab/reset.tpl.html\'"></div>\n          </div> -->\n          <div class="tab-pane" ng-class="{active: tabid == \'message\'}" id="profile" style = "background-color: #fff">\n            <div ng-include="\'usercenter/tab/message.tpl.html\'"></div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n')  //<div ng-include="\'footer.tpl.html\'"></div>')
    }]),b.module("templates-common", ["directives/lineChart.tpl.html", "directives/mapeditor.tpl.html", "directives/page-tpl-types.tpl.html", "directives/pieChart.tpl.html", "directives/toolbar.tpl.html", "security/login/form.tpl.html", "security/login/reset.tpl.html", "security/login/toolbar.tpl.html", "security/register/otherregister.tpl.html", "security/register/register.tpl.html"]),b.module("directives/lineChart.tpl.html", []).run(["$templateCache", function (a) {
        a.put("directives/lineChart.tpl.html", '<canvas id="chart-area" width="300" height="300"/>')
    }]),b.module("directives/mapeditor.tpl.html", []).run(["$templateCache", function (a) {
        a.put("directives/mapeditor.tpl.html", '\n\n<div class="col-lg-6">\n	<div class="input-group">\n	  <input type="text" class="form-control" ng-model="address" placeholder="请输入地名">\n	  <span class="input-group-btn">\n	    <button ng-click="searchAddress()" class="btn btn-default" type="button">搜索</button>\n	  </span>\n	</div><!-- /input-group -->\n</div><!-- /.col-lg-6 -->\n<div id="r-result"></div>')
    }]),b.module("directives/page-tpl-types.tpl.html", []).run(["$templateCache", function (a) {
        a.put("directives/page-tpl-types.tpl.html", '<div class="btn-group" style="padding: 0;">\n    <div class="dropdown">\n        <a class="btn dropdown-toggle first-child" data-toggle="dropdown" title="页面模板" style=" color: #fff;">\n            页面模板\n            &nbsp;\n            <b class="caret">\n            </b>\n        </a>\n        <ul class="dropdown-menu size-menu">\n            <li ng-repeat="type in pageTplTypes">\n                <a ng-href="#/scene/create/{{type.value}}?pageId=1">\n                    {{type.name}}\n                </a>\n            </li>\n        </ul>\n    </div>\n</div>')
    }]),b.module("directives/pieChart.tpl.html", []).run(["$templateCache", function (a) {
        a.put("directives/pieChart.tpl.html", '<canvas id="chart-area" width="300" height="300"/>')
    }]),b.module("directives/toolbar.tpl.html", []).run(["$templateCache", function (a) {
        a.put("directives/toolbar.tpl.html", '<div class="btn-toolbar" id="btn-toolbar"  data-role="editor-toolbar">\n    <div class="btn-group">\n        <div class="dropdown">\n            <a class="btn dropdown-toggle first-child" data-toggle="dropdown" title="文字大小">\n                <i class="glyphicon glyphicon-text-width">\n                </i>\n                &nbsp;\n                <b class="caret">\n                </b>\n            </a>\n            <ul class="dropdown-menu size-menu">\n                <li>\n                    <a dropdown-toggle data-edit="fontSize 7">\n                        48px\n                    </a>\n                </li>\n                <li>\n                    <a dropdown-toggle data-edit="fontSize 6">\n                        32px\n                    </a>\n                </li>\n                <li>\n                    <a dropdown-toggle data-edit="fontSize 5">\n                        24px\n                    </a>\n                </li>\n                <li>\n                    <a dropdown-toggle data-edit="fontSize 4">\n                        18px\n                    </a>\n                </li>\n                <li>\n                    <a dropdown-toggle data-edit="fontSize 3">\n                        16px\n                    </a>\n                </li>\n                <li>\n                    <a dropdown-toggle data-edit="fontSize 2">\n                        13px\n                    </a>\n                </li>\n                <li>\n                    <a dropdown-toggle data-edit="fontSize 1">\n                        12px\n                    </a>\n                </li>\n            </ul>\n        </div>\n    </div>\n    <div class="btn-group">\n        <div class="dropdown">\n            <a class="btn dropdown-toggle" data-toggle="dropdown" title="文字颜色">\n                <i class="glyphicon glyphicon-font color-btn">\n                </i>\n                &nbsp;\n                <b class="caret">\n                </b>\n            </a>\n            <ul class="dropdown-menu color-menu">\n            </ul>\n        </div>\n    </div>\n    <div class="btn-group">\n        <div class="dropdown">\n            <a class="btn dropdown-toggle" data-toggle="dropdown" title="文字背景颜色">\n                <i class="glyphicon glyphicon-font bgcolor-btn">\n                </i>\n                &nbsp;\n                <b class="caret">\n                </b>\n            </a>\n            <ul class="dropdown-menu bgcolor-menu">\n            </ul>\n        </div>\n    </div>\n    <div class="btn-group">\n        <a class="btn" data-edit="bold" title="文字加粗">\n            <i class="glyphicon glyphicon-bold">\n            </i>\n        </a>\n    </div>\n    <div class="btn-group">\n        <a class="btn" data-edit="justifyleft" title="文字居左">\n            <i class="glyphicon glyphicon-align-left">\n            </i>\n        </a>\n        <a class="btn" data-edit="justifycenter" title="文字居中">\n            <i class="glyphicon glyphicon-align-center">\n            </i>\n        </a>\n        <a class="btn" data-edit="justifyright" title="文字居右">\n            <i class="glyphicon glyphicon-align-right">\n            </i>\n        </a>\n    </div>\n    <div class="btn-group">\n        <div class="dropdown">\n            <a class="btn dropdown-toggle createLink" data-toggle="dropdown" sceneid = "{{sceneId}}" title="先选中要加连接的文字"><i class="fa fa-link"></i></a>\n            <div class="dropdown-menu input-append" style="min-width: 335px;padding:4px 4px 14px 19px;">\n                <div class = "span4" style="margin-top:10px;">\n                    <input name = "external" ng-model = "link" class = "span2" type = "radio" value = "external" style="vertical-align:middle;margin:0px;"> 网站地址：\n                    <input class="span2" placeholder="URL" sceneid="{{sceneId}}" type="text" data-edit="createLink" value = "http://" style="border-radius:0px;width:200px;height:35px;" />\n                </div>\n                <!-- <input class="span2" placeholder="URL" sceneid="{{sceneId}}" type="text" data-edit="createLink" value="http://"/>   --> \n                <div class = "span4" style = "margin-top: 10px;">\n                     <input name = "internal" ng-model = "link" class = "span2" type = "radio" value = "internal" style="vertical-align:middle;margin:0px;"> 场景页面：\n                    <select class = "span2" style = "width: 200px;height:35px;" ng-options = "page.name for page in internalLinks" sceneid="{{sceneId}}" data-edit = "createLink" pageid="{{internalLink.id}}" ng-model = "internalLink"></select> \n                </div>           \n                <div style="text-align:center"><a class="btn-main" style="color:#FFF; margin-top:20px;" dropdown-toggle>确定</a></div>\n            </div>\n        </div>        \n    </div>\n    <div class="btn-group">\n        <a class="btn" data-edit="unlink" title="清除超链接"><i class="fa fa-unlink"></i></a>\n    </div>\n    <div class="btn-group">\n        <a class="btn last-child" data-edit="RemoveFormat" title="清除样式">\n            <i class="fa fa-eraser">\n            </i>\n        </a>\n    </div>\n</div>')
    }]),b.module("security/login/form.tpl.html", []).run(["$templateCache", function (a) {
        a.put("security/login/form.tpl.html", '<div class = "login-form-section">\n  <div class = "login-content">\n    <form class = "loginForm" novalidate ng-show = "showLogin && !sendPassword">\n      <div class = "section-title">\n        <h3>登录</h3>\n      </div>\n      <div class="error-wrap">\n        <div class="alert alert-danger" role="alert" ng-show="authReason">\n            {{authReason}}\n        </div>\n        <div class="alert alert-danger" role="alert" ng-show="authError">\n            {{authError}}\n        </div>\n      </div>\n      <div class="textbox-wrap">\n        <div class="input-group">\n          <span class="input-group-addon "><i class="fa fa-envelope"></i></span>\n          <input class = "form-control" id = "username" name="userEmail" placeholder="邮箱 " type="text" ng-model="user.email" ng-keyup="$event.keyCode == 13 ? login() : null" required autofocus add-class/>\n        </div>\n      </div>\n      <div class="textbox-wrap">\n        <div class="input-group">\n          <span class="input-group-addon "><i class="fa fa-key"></i></span>\n          <input class = "form-control" name="pass" placeholder="密码" type="password" ng-model="user.password" ng-keyup="$event.keyCode == 13 ? login() : null" required add-class/>\n        </div>\n      </div>\n      <div class="textbox-wrap validate clearfix" ng-if="isValidateCodeLogin">\n        <div>\n          <script type="text/javascript" load-script ng-src="{{validateCodeUrl}}"></script>\n        </div>\n        <!-- <label class="input-label mid" for="validateCode">验证码</label>&nbsp;\n        <div class = "input-group" style = "display:inline-block;">\n          <input name="validateCode" id="validateCode" ng-model="user.validateCode" style="width: 100px; font-weight: bold; display: inline-block; height: 32px;" type="text" ng-keyup="$event.keyCode == 13 ? login() : null" add-class>\n        </div>&nbsp;\n        <img class="mid validateCode" onclick="$(\'.validateCodeRefresh\').click();" ng-src="{{validateCodeSrc}}">&nbsp;\n        <a class="mid validateCodeRefresh" onclick="$(\'.validateCode\').attr(\'src\', PREFIX_URL + \'servlet/validateCodeServlet?\'+new Date().getTime());" href="javascript:">看不清楚</a> -->\n      </div>\n      <div class="login-form-action clearfix">\n        <div class = "pull-left">\n          <!-- <a ng-click = "openRegister()"><ins>还没注册？</ins></a> -->\n          <input style="margin-top:0px;"  name="rememberMe" ng-model="user.rememberMe" type="checkbox" value="true" />&nbsp;记住密码\n        </div>\n        <div class = "pull-right">\n          <!-- <a ng-click = "showLogin = false;"><ins>忘记密码?</ins></a> -->\n                </div>\n      </div>\n      <!-- <div class="forget login-form-action"><input style="margin-top:0px;"  name="rememberMe" ng-model="user.rememberMe" type="checkbox" value="true" />&nbsp;记住密码</div> -->\n      <div class="login-form-action clearfix">\n        <button type="button" class="btn btn-success pull-left blue-btn" ng-click="login()">登录</button>\n        <button type="button" class="btn btn-success pull-right reset-btn" ng-click="openRegister()">注册</button>\n      </div>\n      <div class="login-form-action clearfix third-party" style="line-height:30px;">\n        <span>第三方账号登录</span>\n        <a ng-href="{{weiChatUrl}}" class="wx_login"><span class="wx_title"></span></a>\n        <a ng-href="{{qqUrl}}" class="qq_login"><span class="qq_title"></span></a>\n        <!-- <a ng-href="{{weiboUrl}}" class="weibo_login"><span class="weibo_title"></span></a> -->\n      </div>\n    </form>\n    <form class = "retrieveForm" ng-show = "!showLogin && !sendPassword" novalidate>\n      <div class = "section-title">\n        <h3>找回密码</h3>\n      </div>\n      <div class="error-wrap">\n        <div class="alert alert-danger" role="alert" ng-show="retrieveError">\n            {{retrieveError}}\n        </div>\n      </div>\n      <div class="textbox-wrap">\n        <div class="input-group">\n          <span class="input-group-addon "><i class="fa fa-envelope"></i></span>\n          <input class = "form-control" id = "retrieveUsername" name="userEmail" placeholder="邮箱 " type="text" ng-model="retrieve.email" ng-keyup="$event.keyCode == 13 ? retrievePassword() : null" required autofocus add-class/>\n        </div>\n      </div>\n      <!-- <div class="textbox-wrap validate">\n        <label class="input-label mid" for="validateCode">验证码</label>&nbsp;\n        <div class = "input-group" style = "display:inline-block;">\n          <input name="validateCode" id="retrieveretrieveValidateCode" ng-model="retrieveretrieve.validateCode" style="width: 100px; font-weight: bold; display: inline-block; height: 32px;" type="text" ng-keyup="$event.keyCode == 13 ? retrieveretrievePassword() : null" add-class>\n        </div>&nbsp;\n        <img class="mid validateCode" onclick="$(\'.validateCodeRefresh\').click();" ng-src="{{validateCodeSrc}}">&nbsp;\n        <a class="mid validateCodeRefresh" onclick="$(\'.validateCode\').attr(\'src\', PREFIX_URL + \'servlet/validateCodeServlet?\'+new Date().getTime());" href="javascript:">看不清楚</a>\n      </div> -->\n      <div class="login-form-action clearfix">\n        <div>\n          <script type="text/javascript" load-script ng-src="{{validateCodeUrl}}"></script>\n        </div>\n        <div class = "pull-right" style = "padding-top: 5px;">\n          <a ng-click = "rotate(showLogin)"><ins>我想起来了</ins></a>\n        </div>\n      </div>\n      <div class="login-form-action clearfix">\n        <button type="button" class="btn btn-success pull-left blue-btn" ng-click="retrievePassword()">找回密码</button>\n        <button type="button" class="btn btn-success pull-right reset-btn" ng-click="reset()">重置</button>\n      </div>\n    </form>\n    <div ng-show = "sendPassword" class = "section-title text-center">\n        <h3>恭喜你，找回密码成功。</h3>\n    </div>\n    <div class = "send_email" ng-show = "sendPassword">\n      重置密码的链接已发送到你的 {{retrieve.email}}邮箱，登录邮箱重置密码吧！\n    </div>\n    <div class = "login-form-tip" ng-show = "!sendPassword && !unExist">\n      <h6>为了获得更好的使用，建议使用谷歌浏览器（chrome）、360浏览器、IE11浏览器。</h6>\n    </div>\n  </div>\n</div>')
    }]),b.module("security/login/reset.tpl.html", []).run(["$templateCache", function (a) {
        a.put("security/login/reset.tpl.html", '<!-- <div class="modal-header">\n    <span class="glyphicon glyphicon-exclamation-sign"></span>\n    <span>修改密码</span>\n</div>\n<form name="resetForm" novalidate class="login-form">\n    <div class="login_form">\n        <div class="alert alert-warning" role="alert" ng-show="authReason">\n            {{authReason}}\n        </div>\n        <div class="alert alert-danger" role="alert" ng-show="authError">\n            {{authError}}\n        </div>\n        <div class="input-wrap">\n            <input name="oldPassword" placeholder="旧密码 " type="password" ng-model="password.old" required autofocus>            \n        </div>\n        \n        <div class="input-wrap">\n            <input name="newPassword" placeholder="新密码" type="password" ng-model="password.newPw" required equals="{{password.confirm}}">\n        </div>\n\n        <div class="input-wrap">\n            <input name="confirmPassword" placeholder="重复密码" type="password" ng-model="password.confirm" required equals="{{password.newPw}}">\n        </div>\n        <div class="modal-footer">\n            <div class="btn-main" ng-click="reset()" ng-disabled=\'form.$invalid\'>确&nbsp;&nbsp;定</div>\n            <div class="btn-grey0" ng-click="cancel()" ng-disabled=\'form.$invalid\'>取&nbsp;&nbsp;消</div>\n        </div>\n    </div>\n</form>\n -->\n<div class = "login-form-section">\n  <div class = "login-content">\n    <form class = "loginForm" novalidate>\n      <div class = "section-title">\n        <h3>重设密码</h3>\n      </div>\n      <div class="error-wrap">\n        <div class="alert alert-danger" role="alert" ng-show="authReason">\n            {{authReason}}\n        </div>\n        <div class="alert alert-danger" role="alert" ng-show="authError">\n            {{authError}}\n        </div>\n      </div>\n      <div class="textbox-wrap">\n        <div class="input-group">\n          <span class="input-group-addon "><i class="fa fa-key"></i></span>\n          <input class = "form-control" name="pass" placeholder="新密码" type="password" ng-model="password.newPw" ng-keyup="$event.keyCode == 13 ? reset() : null" required add-class/>\n        </div>\n      </div>\n      <div class="textbox-wrap">\n        <div class="input-group">\n          <span class="input-group-addon "><i class="fa fa-key"></i></span>\n          <input class = "form-control" name="confirmPassword" placeholder="确认密码" type="password" ng-model="password.confirm" ng-keyup="$event.keyCode == 13 ? reset() : null" required add-class/>\n        </div>\n      </div>\n      <div class="login-form-action clearfix">\n        <button type="button" class="btn btn-success pull-left blue-btn" ng-click="reset()">确认</button>\n        <button type="button" class="btn btn-success pull-right reset-btn" ng-click="cancel()">取消</button>\n      </div>\n    </form>\n    <div class = "login-form-tip">\n      <h6>为了获得更好的使用，建议使用谷歌浏览器（chrome）、360浏览器、IE11浏览器。</h6>\n    </div>\n  </div>\n</div>')
    }]),b.module("security/login/toolbar.tpl.html", []).run(["$templateCache", function (a) {
        a.put("security/login/toolbar.tpl.html", '<ul class="nav pull-right" style="margin-right:0px;"><!-- \n    <li class="divider-vertical" ng-click="goCats =!goCats" ></li> -->\n    <li class="" style="width:150px;margin-top:-2px;cursor:pointer;" ng-show="sendXd.state"><img ng-click="openReg()" ng-src="{{CLIENT_CDN}}assets/images/xiudianyaoqing.png" /></li>\n    <li class="mes_con dropdown-toggle">\n       <span class = "mes_count" ng-if = "newMsgCount">{{newMsgCount}}</span>\n        <div class="dropdown-menu msg_pannel" role="menu" forbidden-close>\n            <div class = "clearfix">\n                <div class = "panel_title pull-left">\n                您有<span class = "mes_new">{{count}}</span>新消息\n            </div>\n            <div class = "panel_title text-right" style = "margin-left:0px;">\n                <a ng-click = "setRead()" ng-if = "false">设为已读消息</a>\n            </div>\n            </div>\n            <div class = "panel_content head_list_newMsg" ng-class = "{content_status_new: newMsg.status == 1,content_status_yidu: newMsg.status == 2}" ng-repeat = "newMsg in newMsgs"><a href="#/usercenter/message" ng-bind-html="newMsg.content"></a></div>\n            <div class = "panel_more text-center">\n                <a href="#/usercenter/message">查看全部消息 >></a>\n            </div>\n        </div>\n    </li>\n    <!-- <li class="mes_con">\n        <div style="height:200px;" class="head_hover">\n            <div class="vip_c"><span style="text-align:center;"><img ng-src="{{headImg ||(PREFIX_FILE_HOST + currentUser.headImg)}}" style = "width: 30px; height: 30px;"/></span><span class="vip_po" style = "top:0px;" ng-show = "isVendorUser"><img ng-src="{{CLIENT_CDN}}assets/images/main/fuwushang.png" style = "width:18px; height: 23px;"/></span></div>\n        </div>\n    </li> -->\n    <li ng-show="isAuthenticated()" class="custom_img">\n        <div style="height:200px;" class="head_hover" ng-mouseover="showCode = true" ng-mouseleave="showCode = false"><!-- <span>{{currentUser.loginName}}</span> -->\n            <div class="vip_c"><span style="text-align:right;"><img ng-src="{{headImg ||(PREFIX_FILE_HOST + currentUser.headImg)}}" style = "width: 30px; height: 30px;"/></span><span class="vip_po" style = "top:0px;" ng-show = "isVendorUser"><img ng-src="{{CLIENT_CDN}}assets/images/main/fuwushang.png" style = "width:18px; height: 23px;"/></span></div>\n            <div class="head_click" style="z-index:10000;" ng-show="showCode == true"> \n                                       <div><a href="/index.php?c=user&a=logout">退出</a></div> \n            </div>\n        </div>\n    </li>\n</ul>  ')
    }]),b.module("security/register/otherregister.tpl.html", []).run(["$templateCache", function (a) {
        a.put("security/register/otherregister.tpl.html", '<form name="formName" novalidate class="login-form">\n    <div class = "text-center">\n        <div style = "position: relative; top: 0px; font-size: 15px;">第三方账号已授权</div>\n        <div style = "margin-top: 15px;">欢迎您&nbsp;<code>{{otherUserInfo.nickname}}</code>&nbsp;<img ng-src = "{{otherUserInfo.figureUrl}}"/>，完善以下信息，就可以使用我们的服务!</div>\n    </div>\n    <div class="login_form">\n        <div class="alert alert-danger" role="alert" ng-show="regErr">\n            {{regErr}}\n        </div>\n\n        <div class="input-wrap">\n            <input name="userEmail" placeholder="邮箱 " type="email" ng-model="user.email" ng-keyup="$event.keyCode == 13 ? fullfil() : null"  required autofocus>       \n        </div>\n        \n        <div class="input-wrap">\n            <input name="pass" placeholder="密码" type="password" ng-model="user.password" ng-keyup="$event.keyCode == 13 ? fullfil() : null" required>\n        </div>\n\n        <div class="input-wrap">\n            <input name="repeatPass" placeholder="确认密码" type="password" ng-model="user.repeatPassword" ng-keyup="$event.keyCode == 13 ? fullfil() : null" required>\n        </div>\n\n        <div class="checkbox">\n          <label>\n            <input type="checkbox" ng-model = "user.agreement"> 我已阅读并同意         </label>\n        </div>\n\n        <div class="login-btn btn-main" ng-click="fullfil()" ng-disabled=\'form.$invalid\'>完&nbsp;&nbsp;善</div>\n        \n    </div>\n</form>\n    \n')
    }]),b.module("security/register/register.tpl.html", []).run(["$templateCache", function (a) {
        a.put("security/register/register.tpl.html", '<div class = "login-form-section">\n  <div class = "login-content">\n    <form novalidate>\n      <div class = "section-title">\n        <h3>注册</h3>\n      </div>\n      <div class="error-wrap">\n        <div class="alert alert-danger" role="alert" ng-show="regErr">\n            {{regErr}}\n        </div>\n      </div>\n      <div class="textbox-wrap">\n        <div class="input-group">\n          <span class="input-group-addon "><i class="fa fa-user"></i></span>\n          <input class = "form-control" id = "username1" name="userEmail" placeholder="邮箱 " type="text" ng-model="user.email" ng-keyup="$event.keyCode == 13 ? register() : null" ng-blur="checkUpperCase();" required autofocus add-class/>\n        </div>\n      </div>\n      <div class="textbox-wrap">\n        <div class="input-group">\n          <span class="input-group-addon "><i class="fa fa-key"></i></span>\n          <input class = "form-control" name="pass" placeholder="密码" type="password" ng-model="user.password" ng-keyup="$event.keyCode == 13 ? register() : null" required add-class/>\n        </div>\n      </div>\n      <div class="textbox-wrap">\n        <div class="input-group">\n          <span class="input-group-addon "><i class="fa fa-key"></i></span>\n          <input class = "form-control" name="repeatPass" placeholder="确认密码" type="password" ng-model="user.repeatPassword" ng-keyup="$event.keyCode == 13 ? register() : null" required add-class/>\n        </div>\n      </div>\n      <div class="login-form-action clearfix">\n        <div class="checkbox pull-left">\n          <div class="custom-checkbox">\n            <div class="icheckbox_square-blue" ng-class = "{checked: user.agreement == true, hover: user.agreement == false && hovered == true}">\n              <input class="check-box" type="checkbox" ng-mouseenter = "hovered = true;" ng-mouseleave = "hovered = false;" ng-model = "user.agreement" name="iCheck">\n            </div>\n          </div>\n          <span class="checkbox-text pull-left">&nbsp;我已阅读并同意</span>\n        </div>\n        <div class = "checkbox pull-right">\n          <a ng-click = "openLogin()"><ins>已有账户?</ins></a>\n        </div>\n      </div>\n      <div class = "login-form-action clearfix">\n        <button type="submit" ng-click="register()" class="btn btn-success pull-left blue-btn">注册</button>\n        <button type="button" ng-click="openLogin()" class="btn btn-success pull-right reset-btn">登录</button>\n      </div>\n      <div class="login-form-action clearfix third-party" style="line-height:30px;">\n        <span>第三方账号登录</span>\n        <a ng-href="{{weiChatUrl}}" class="wx_login"><span class="wx_title"></span></a>\n        <a href="{{qqUrl}}" class="qq_login"><span class="qq_title"></span></a>\n        <!-- <a ng-href="{{weiboUrl}}" class="weibo_login"><span class="weibo_title"></span></a> -->\n      </div>\n      <div class = "login-form-tip">\n        <h6>为了获得更好的使用，建议使用谷歌浏览器（chrome）、360浏览器、IE11浏览器。</h6>\n      </div>\n    </form>\n  </div>\n</div>')
    }])
}(window, window.angular);
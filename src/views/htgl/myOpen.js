"use strict";
			var varNtkoGUID = Math.random().toString(36);
			var userAgent = navigator.userAgent, 
				rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
				rFirefox = /(firefox)\/([\w.]+)/,
				rOpera = /(opera).+version\/([\w.]+)/, 
				rChrome = /(chrome)\/([\w.]+)/,
				rSafari = /version\/([\w.]+).*(safari)/;
			var browser;
			var version;
			var ua = userAgent.toLowerCase();
			
			function uaMatch(ua) {
				var match = rMsie.exec(ua);
				if (match != null) {
					return {browser: "IE", version: match[2] || "0"}
				}
				var match = rFirefox.exec(ua);
				if (match != null) {
					return {browser: match[1] || "", version: match[2] || "0"}
				}
				var match = rOpera.exec(ua);
				if (match != null) {
					return {browser: match[1] || "", version: match[2] || "0"}
				}
				var match = rChrome.exec(ua);
				if (match != null) {
					return {browser: match[1] || "", version: match[2] || "0"}
				}
				var match = rSafari.exec(ua);
				if (match != null) {
					return {browser: match[2] || "", version: match[1] || "0"}
				}
				if (match != null) {
					return {browser: "", version: "0"}
				}
			}
			
			var browserMatch = uaMatch(userAgent.toLowerCase());
			if (browserMatch.browser) {
				browser = browserMatch.browser;
				version = browserMatch.version;
			}
			
			function ntkoClose(strURL) {
				var testurl = window.location.search;
				if ((null === strURL) || ("" === strURL)) {
					alert(" The Param strURL of openWindow() is NULL or empty. ");
					return
				}
				var strLowser = strURL.toLowerCase();
				if ("file://" === strLowser.substr(0, 7)) {
				} else {
					if ("/" != strURL.charAt(0)) {
						if (("http://" === strLowser.substr(0, 7)) || ("https://" === strLowser.substr(0, 8))) {
						} else {
							if (strURL.indexOf("../") == -1) {
								var pathName = window.location.href;
								var varLength = pathName.lastIndexOf("/");
								strURL = pathName.substr(0, varLength + 1) + strURL
							} else {
								var pathName = window.location.href;
								var varLength = pathName.lastIndexOf("/");
								var strURLLength = strURL.split("/");
								var ntkostrURL = "";
								var ntkolengthi = 0;
								for (var i = 0; i < strURLLength.length; i++) {
									if (strURLLength[i] == "..") {
									} else {
										if (pathName.indexOf(strURLLength[i]) == -1) {
											ntkostrURL = ntkostrURL + "/" + strURLLength[i]
										}
									}
								}
								strURL = pathName.substr(0, varLength) + ntkostrURL
							}
						}
					} else {
						var pathName = window.location.href;
						var varLength = pathName.lastIndexOf("/");
						strURL = pathName.substr(0, varLength + 1) + strURL
					}
				}
				if (strURL.indexOf(testurl) == -1) {
					strURL += testurl
				}
				var jsonValue = '{"Close":1,"GUID":"';
				jsonValue += varNtkoGUID;
				jsonValue += '","URLMD5":"';
				jsonValue += b64_md5(strURL);
				jsonValue += '"}';
				if (browser == "IE") {
					window.close()
				}
				if (browser == "firefox") {
					if (version >= "50") {
						window.postMessage({type: "FROM_NTKO_PAGE", text: jsonValue}, "*")
					} else {
						window.close()
					}
				}
				if (browser == "chrome") {
					if (version >= "45") {
						window.postMessage({type: "FROM_NTKO_PAGE", text: jsonValue}, "*")
					} else {
						window.close()
					}
				}
			}
export const myOpen = function openWindow(strURL, strProductCaption, strProductKey, strNoExpireKey, strOptions) {
				var testurl = window.location.search;
				if ((null === strURL) || ("" === strURL)) {
					alert(" The Param strURL of openWindow() is NULL or empty. ");
					return
				}
				var strLowser = strURL.toLowerCase();
				if ("file://" === strLowser.substr(0, 7)) {
				} else {
					if ("/" != strURL.charAt(0)) {
						if (("http://" === strLowser.substr(0, 7)) || ("https://" === strLowser.substr(0, 8))) {
						} else {
							if (strURL.indexOf("../") == -1) {
								var pathName = window.location.href;
								var varLength = pathName.lastIndexOf("/");
								strURL = pathName.substr(0, varLength + 1) + strURL
							} else {
								var pathName = window.location.href;
								var varLength = pathName.lastIndexOf("/");
								var strURLLength = strURL.split("/");
								var ntkostrURL = "";
								var ntkolengthi = 0;
								for (var i = 0; i < strURLLength.length; i++) {
									if (strURLLength[i] == "..") {
									} else {
										if (pathName.indexOf(strURLLength[i]) == -1) {
											ntkostrURL = ntkostrURL + "/" + strURLLength[i]
										}
									}
								}
								strURL = pathName.substr(0, varLength) + ntkostrURL
							}
						}
					} else {
						var pathName = window.location.href;
						var varLength = pathName.lastIndexOf("/");
						strURL = pathName.substr(0, varLength + 1) + strURL
					}
				}
				if (strURL.indexOf(testurl) == -1) {
					strURL += testurl
				}
				var pathName = window.location.href;
				var jsonValue = '{"OpenWindow":1,"URL":"';
				jsonValue += strURL;
				jsonValue += '","GUID":"';
				jsonValue += varNtkoGUID;
				jsonValue += '","URLMD5":"';
				jsonValue += b64_md5(strURL);
				jsonValue += '","SessionURL":"';
				jsonValue += pathName;
				jsonValue += '"';
				if ((typeof strProductCaption != "undefined") && ((null != strProductCaption) && ("" != strProductCaption))) {
					jsonValue += ',"ProductCaption":"';
					jsonValue += strProductCaption;
					jsonValue += '"'
				}
				if ((typeof strProductKey != "undefined") && ((null != strProductKey) && ("" != strProductKey))) {
					jsonValue += ',"ProductKey":"';
					jsonValue += strProductKey;
					jsonValue += '"'
				}
				if ((typeof strNoExpireKey != "undefined") && ((null != strNoExpireKey) && ("" != strNoExpireKey))) {
					jsonValue += ',"NoExpireKey":"';
					jsonValue += strNoExpireKey;
					jsonValue += '"'
				}
				if (typeof strOptions != "undefined" && ((null != strOptions) && ("" != strOptions))) {
					jsonValue += ',"Options":"';
					jsonValue += strOptions;
					jsonValue += '"'
				}
				jsonValue += "}";
				if (window != window.parent) {
					window.parent.location.reload(true)
				}
				if (browser == "IE") {
					window.open(strURL, "", "height=880, width=1440, toolbar =no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no,fullscreen=yes")
				}
				if (browser == "firefox") {
					if (version >= "50") {
						window.postMessage({type: "FROM_NTKO_PAGE", text: jsonValue}, "*")
					} else {
						window.open(strURL, "", "height=880, width=1440, toolbar =no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no,fullscreen=yes")
					}
				}
				if (browser == "chrome") {
					if (version >= "45") {
						window.postMessage({type: "FROM_NTKO_PAGE", text: jsonValue}, "*")
					} else {
						window.open(strURL, "", "height=880, width=1440, toolbar =no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no,fullscreen=yes")
					}
				}
			}
			
			
			var hexcase = 0;
			var b64pad = "";
			var chrsz = 8;
			
			function b64_md5(s) {
				return binl2b64(core_md5(str2binl(s), s.length * chrsz))
			}
			
			function core_md5(x, len) {
				x[len >> 5] |= 128 << ((len) % 32);
				x[(((len + 64) >>> 9) << 4) + 14] = len;
				var a = 1732584193;
				var b = -271733879;
				var c = -1732584194;
				var d = 271733878;
				for (var i = 0; i < x.length; i += 16) {
					var olda = a;
					var oldb = b;
					var oldc = c;
					var oldd = d;
					a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
					d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
					c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
					b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
					a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
					d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
					c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
					b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
					a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
					d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
					c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
					b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
					a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
					d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
					c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
					b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
					a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
					d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
					c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
					b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
					a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
					d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
					c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
					b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
					a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
					d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
					c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
					b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
					a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
					d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
					c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
					b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
					a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
					d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
					c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
					b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
					a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
					d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
					c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
					b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
					a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
					d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
					c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
					b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
					a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
					d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
					c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
					b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
					a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
					d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
					c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
					b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
					a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
					d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
					c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
					b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
					a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
					d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
					c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
					b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
					a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
					d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
					c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
					b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
					a = safe_add(a, olda);
					b = safe_add(b, oldb);
					c = safe_add(c, oldc);
					d = safe_add(d, oldd)
				}
				return Array(a, b, c, d)
			}
			
			function md5_cmn(q, a, b, x, s, t) {
				return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
			}
			
			function md5_ff(a, b, c, d, x, s, t) {
				return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
			}
			
			function md5_gg(a, b, c, d, x, s, t) {
				return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
			}
			
			function md5_hh(a, b, c, d, x, s, t) {
				return md5_cmn(b ^ c ^ d, a, b, x, s, t)
			}
			
			function md5_ii(a, b, c, d, x, s, t) {
				return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
			}
			
			function safe_add(x, y) {
				var lsw = (x & 65535) + (y & 65535);
				var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
				return (msw << 16) | (lsw & 65535)
			}
			
			function bit_rol(num, cnt) {
				return (num << cnt) | (num >>> (32 - cnt))
			}
			
			function str2binl(str) {
				var bin = Array();
				var mask = (1 << chrsz) - 1;
				for (var i = 0; i < str.length * chrsz; i += chrsz) {
					bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32)
				}
				return bin
			}
			
			function binl2str(bin) {
				var str = "";
				var mask = (1 << chrsz) - 1;
				for (var i = 0; i < bin.length * 32; i += chrsz) {
					str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask)
				}
				return str
			}
			
			function binl2hex(binarray) {
				var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
				var str = "";
				for (var i = 0; i < binarray.length * 4; i++) {
					str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 15) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 15)
				}
				return str
			}
			
			function binl2b64(binarray) {
				var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
				var str = "";
				for (var i = 0; i < binarray.length * 4; i += 3) {
					var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 255) << 16) | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 255) << 8) | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 255);
					for (var j = 0; j < 4; j++) {
						if (i * 8 + j * 6 > binarray.length * 32) {
							str += b64pad
						} else {
							str += tab.charAt((triplet >> 6 * (3 - j)) & 63)
						}
					}
				}
				return str
			}
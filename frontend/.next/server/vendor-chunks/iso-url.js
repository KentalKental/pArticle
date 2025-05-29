"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/iso-url";
exports.ids = ["vendor-chunks/iso-url"];
exports.modules = {

/***/ "(ssr)/../../../../../node_modules/iso-url/index.js":
/*!****************************************************!*\
  !*** ../../../../../node_modules/iso-url/index.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst {\n    URLWithLegacySupport,\n    format,\n    URLSearchParams,\n    defaultBase\n} = __webpack_require__(/*! ./src/url */ \"(ssr)/../../../../../node_modules/iso-url/src/url.js\");\nconst relative = __webpack_require__(/*! ./src/relative */ \"(ssr)/../../../../../node_modules/iso-url/src/relative.js\");\n\nmodule.exports = {\n    URL: URLWithLegacySupport,\n    URLSearchParams,\n    format,\n    relative,\n    defaultBase\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2lzby11cmwvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsRUFBRSxtQkFBTyxDQUFDLHVFQUFXO0FBQ3ZCLGlCQUFpQixtQkFBTyxDQUFDLGlGQUFnQjs7QUFFekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teS12MC1wcm9qZWN0Ly4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9pc28tdXJsL2luZGV4LmpzP2RjNTciXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB7XG4gICAgVVJMV2l0aExlZ2FjeVN1cHBvcnQsXG4gICAgZm9ybWF0LFxuICAgIFVSTFNlYXJjaFBhcmFtcyxcbiAgICBkZWZhdWx0QmFzZVxufSA9IHJlcXVpcmUoJy4vc3JjL3VybCcpO1xuY29uc3QgcmVsYXRpdmUgPSByZXF1aXJlKCcuL3NyYy9yZWxhdGl2ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBVUkw6IFVSTFdpdGhMZWdhY3lTdXBwb3J0LFxuICAgIFVSTFNlYXJjaFBhcmFtcyxcbiAgICBmb3JtYXQsXG4gICAgcmVsYXRpdmUsXG4gICAgZGVmYXVsdEJhc2Vcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/../../../../../node_modules/iso-url/index.js\n");

/***/ }),

/***/ "(ssr)/../../../../../node_modules/iso-url/src/relative.js":
/*!***********************************************************!*\
  !*** ../../../../../node_modules/iso-url/src/relative.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst { URLWithLegacySupport, format } = __webpack_require__(/*! ./url */ \"(ssr)/../../../../../node_modules/iso-url/src/url.js\");\n\nmodule.exports = (url, location = {}, protocolMap = {}, defaultProtocol) => {\n    let protocol = location.protocol ?\n        location.protocol.replace(':', '') :\n        'http';\n\n    // Check protocol map\n    protocol = (protocolMap[protocol] || defaultProtocol || protocol) + ':';\n    let urlParsed;\n\n    try {\n        urlParsed = new URLWithLegacySupport(url);\n    } catch (err) {\n        urlParsed = {};\n    }\n\n    const base = Object.assign({}, location, {\n        protocol: protocol || urlParsed.protocol,\n        host: location.host || urlParsed.host\n    });\n\n    return new URLWithLegacySupport(url, format(base)).toString();\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2lzby11cmwvc3JjL3JlbGF0aXZlLmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViLFFBQVEsK0JBQStCLEVBQUUsbUJBQU8sQ0FBQyxtRUFBTzs7QUFFeEQsb0NBQW9DLGtCQUFrQjtBQUN0RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL215LXYwLXByb2plY3QvLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2lzby11cmwvc3JjL3JlbGF0aXZlLmpzPzIwOTQiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB7IFVSTFdpdGhMZWdhY3lTdXBwb3J0LCBmb3JtYXQgfSA9IHJlcXVpcmUoJy4vdXJsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKHVybCwgbG9jYXRpb24gPSB7fSwgcHJvdG9jb2xNYXAgPSB7fSwgZGVmYXVsdFByb3RvY29sKSA9PiB7XG4gICAgbGV0IHByb3RvY29sID0gbG9jYXRpb24ucHJvdG9jb2wgP1xuICAgICAgICBsb2NhdGlvbi5wcm90b2NvbC5yZXBsYWNlKCc6JywgJycpIDpcbiAgICAgICAgJ2h0dHAnO1xuXG4gICAgLy8gQ2hlY2sgcHJvdG9jb2wgbWFwXG4gICAgcHJvdG9jb2wgPSAocHJvdG9jb2xNYXBbcHJvdG9jb2xdIHx8IGRlZmF1bHRQcm90b2NvbCB8fCBwcm90b2NvbCkgKyAnOic7XG4gICAgbGV0IHVybFBhcnNlZDtcblxuICAgIHRyeSB7XG4gICAgICAgIHVybFBhcnNlZCA9IG5ldyBVUkxXaXRoTGVnYWN5U3VwcG9ydCh1cmwpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB1cmxQYXJzZWQgPSB7fTtcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlID0gT2JqZWN0LmFzc2lnbih7fSwgbG9jYXRpb24sIHtcbiAgICAgICAgcHJvdG9jb2w6IHByb3RvY29sIHx8IHVybFBhcnNlZC5wcm90b2NvbCxcbiAgICAgICAgaG9zdDogbG9jYXRpb24uaG9zdCB8fCB1cmxQYXJzZWQuaG9zdFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBVUkxXaXRoTGVnYWN5U3VwcG9ydCh1cmwsIGZvcm1hdChiYXNlKSkudG9TdHJpbmcoKTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/../../../../../node_modules/iso-url/src/relative.js\n");

/***/ }),

/***/ "(ssr)/../../../../../node_modules/iso-url/src/url.js":
/*!******************************************************!*\
  !*** ../../../../../node_modules/iso-url/src/url.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst { URL, URLSearchParams, format } = __webpack_require__(/*! url */ \"url\");\n\n// https://github.com/nodejs/node/issues/12682\nconst defaultBase = 'http://localhost';\n\nclass URLWithLegacySupport extends URL {\n    constructor(url = '', base = defaultBase) {\n        super(url, base);\n        this.path = this.pathname + this.search;\n        this.auth =\n            this.username && this.password ?\n                this.username + ':' + this.password :\n                null;\n        this.query =\n            this.search && this.search.startsWith('?') ?\n                this.search.slice(1) :\n                null;\n    }\n\n    format() {\n        return this.toString();\n    }\n}\n\nmodule.exports = {\n    URLWithLegacySupport,\n    URLSearchParams,\n    format,\n    defaultBase\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2lzby11cmwvc3JjL3VybC5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYixRQUFRLCtCQUErQixFQUFFLG1CQUFPLENBQUMsZ0JBQUs7O0FBRXREO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbXktdjAtcHJvamVjdC8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvaXNvLXVybC9zcmMvdXJsLmpzP2QzNWQiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB7IFVSTCwgVVJMU2VhcmNoUGFyYW1zLCBmb3JtYXQgfSA9IHJlcXVpcmUoJ3VybCcpO1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvaXNzdWVzLzEyNjgyXG5jb25zdCBkZWZhdWx0QmFzZSA9ICdodHRwOi8vbG9jYWxob3N0JztcblxuY2xhc3MgVVJMV2l0aExlZ2FjeVN1cHBvcnQgZXh0ZW5kcyBVUkwge1xuICAgIGNvbnN0cnVjdG9yKHVybCA9ICcnLCBiYXNlID0gZGVmYXVsdEJhc2UpIHtcbiAgICAgICAgc3VwZXIodXJsLCBiYXNlKTtcbiAgICAgICAgdGhpcy5wYXRoID0gdGhpcy5wYXRobmFtZSArIHRoaXMuc2VhcmNoO1xuICAgICAgICB0aGlzLmF1dGggPVxuICAgICAgICAgICAgdGhpcy51c2VybmFtZSAmJiB0aGlzLnBhc3N3b3JkID9cbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJuYW1lICsgJzonICsgdGhpcy5wYXNzd29yZCA6XG4gICAgICAgICAgICAgICAgbnVsbDtcbiAgICAgICAgdGhpcy5xdWVyeSA9XG4gICAgICAgICAgICB0aGlzLnNlYXJjaCAmJiB0aGlzLnNlYXJjaC5zdGFydHNXaXRoKCc/JykgP1xuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoLnNsaWNlKDEpIDpcbiAgICAgICAgICAgICAgICBudWxsO1xuICAgIH1cblxuICAgIGZvcm1hdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFVSTFdpdGhMZWdhY3lTdXBwb3J0LFxuICAgIFVSTFNlYXJjaFBhcmFtcyxcbiAgICBmb3JtYXQsXG4gICAgZGVmYXVsdEJhc2Vcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/../../../../../node_modules/iso-url/src/url.js\n");

/***/ })

};
;
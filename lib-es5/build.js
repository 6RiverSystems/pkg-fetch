'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var gitClone = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var args, promise;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _log.log.info('Cloning Node.js repository from GitHub...');
            args = ['clone', '--bare', '--progress', nodeRepo, 'node/.git'];
            promise = (0, _spawn.spawn)('git', args, { cwd: buildPath });

            (0, _spawn.progress)(promise, (0, _thresholds2.default)('clone'));
            _context.next = 6;
            return promise;

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function gitClone() {
    return _ref.apply(this, arguments);
  };
}();

var gitResetHard = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(nodeVersion) {
    var patches, commit, args;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _log.log.info('Checking out ' + nodeVersion);
            patches = _patches2.default[nodeVersion];
            commit = patches.commit || nodeVersion;
            args = ['--work-tree', '.', 'reset', '--hard', commit];
            _context2.next = 6;
            return (0, _spawn.spawn)('git', args, { cwd: nodePath });

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function gitResetHard(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var applyPatches = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(nodeVersion) {
    var patches, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, patch, patchPath, args;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _log.log.info('Applying patches');
            patches = _patches2.default[nodeVersion];

            patches = patches.patches || patches;
            if (patches.sameAs) patches = _patches2.default[patches.sameAs];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context3.prev = 7;
            _iterator = (0, _getIterator3.default)(patches);

          case 9:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context3.next = 18;
              break;
            }

            patch = _step.value;
            patchPath = _path2.default.join(patchesPath, patch);
            args = ['-p1', '-i', patchPath];
            _context3.next = 15;
            return (0, _spawn.spawn)('patch', args, { cwd: nodePath });

          case 15:
            _iteratorNormalCompletion = true;
            _context3.next = 9;
            break;

          case 18:
            _context3.next = 24;
            break;

          case 20:
            _context3.prev = 20;
            _context3.t0 = _context3['catch'](7);
            _didIteratorError = true;
            _iteratorError = _context3.t0;

          case 24:
            _context3.prev = 24;
            _context3.prev = 25;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 27:
            _context3.prev = 27;

            if (!_didIteratorError) {
              _context3.next = 30;
              break;
            }

            throw _iteratorError;

          case 30:
            return _context3.finish(27);

          case 31:
            return _context3.finish(24);

          case 32:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[7, 20, 24, 32], [25,, 27, 31]]);
  }));

  return function applyPatches(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var compileOnWindows = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(nodeVersion, targetArch) {
    var args, promise;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            args = [];

            args.push('/c', 'vcbuild.bat', targetArch, 'nosign');
            promise = (0, _spawn.spawn)('cmd', args, { cwd: nodePath });

            (0, _spawn.progress)(promise, (0, _thresholds2.default)('vcbuild', nodeVersion));
            _context4.next = 6;
            return promise;

          case 6:
            return _context4.abrupt('return', _path2.default.join(nodePath, 'Release/node.exe'));

          case 7:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function compileOnWindows(_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();

var compileOnUnix = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(nodeVersion, targetArch) {
    var args, makeArgs, cpu, major, make, promise, output;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            args = [];
            makeArgs = [];
            cpu = { x86: 'ia32', x64: 'x64',
              armv6: 'arm', armv7: 'arm', arm64: 'arm64' }[targetArch];

            args.push('--dest-cpu', cpu);
            if (process.env.BUILD_CPUS) {
              makeArgs.push('-j' + process.env.BUILD_CPUS);
            }
            // first of all v8_inspector introduces the use
            // of `prime_rehash_policy` symbol that requires
            // GLIBCXX_3.4.18 on some systems
            // also we don't support any kind of debugging
            // against packaged apps, hence v8_inspector is useless
            major = nodeVersion.match(/^v?(\d+)/)[1] | 0;

            if (major >= 6) args.push('--without-inspector');
            // https://github.com/mhart/alpine-node/blob/base-7.4.0/Dockerfile#L33
            if (_system.hostPlatform === 'alpine') args.push('--without-snapshot');
            // TODO same for windows?
            _context5.next = 10;
            return (0, _spawn.spawn)('./configure', args, { cwd: nodePath });

          case 10:
            make = _system.hostPlatform === 'freebsd' ? 'gmake' : 'make';
            promise = (0, _spawn.spawn)(make, makeArgs, { cwd: nodePath });

            (0, _spawn.progress)(promise, (0, _thresholds2.default)('make', nodeVersion));
            _context5.next = 15;
            return promise;

          case 15:
            output = _path2.default.join(nodePath, 'out/Release/node');
            // https://github.com/mhart/alpine-node/blob/base-7.4.0/Dockerfile#L36

            if (!(_system.hostPlatform === 'alpine')) {
              _context5.next = 19;
              break;
            }

            _context5.next = 19;
            return (0, _spawn.spawn)('paxctl', ['-cm', output]);

          case 19:
            return _context5.abrupt('return', output);

          case 20:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function compileOnUnix(_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();

var compile = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(nodeVersion, targetArch) {
    var win;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _log.log.info('Compiling Node.js from sources...');
            win = _system.hostPlatform === 'win';

            if (!win) {
              _context6.next = 6;
              break;
            }

            _context6.next = 5;
            return compileOnWindows(nodeVersion, targetArch);

          case 5:
            return _context6.abrupt('return', _context6.sent);

          case 6:
            _context6.next = 8;
            return compileOnUnix(nodeVersion, targetArch);

          case 8:
            return _context6.abrupt('return', _context6.sent);

          case 9:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function compile(_x7, _x8) {
    return _ref6.apply(this, arguments);
  };
}();

var _fsExtra = require('fs-extra');

var _spawn = require('./spawn.js');

var _copyFile = require('./copy-file.js');

var _system = require('./system.js');

var _log = require('./log.js');

var _patches = require('../patches/patches.json');

var _patches2 = _interopRequireDefault(_patches);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _tempPath = require('./temp-path.js');

var _thresholds = require('./thresholds.js');

var _thresholds2 = _interopRequireDefault(_thresholds);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildPath = void 0;
if (process.env.GITHUB_USERNAME) {
  buildPath = _path2.default.join(__dirname, '..', 'precompile');
} else {
  buildPath = (0, _tempPath.tempPath)();
}

var nodePath = _path2.default.join(buildPath, 'node');
var patchesPath = _path2.default.resolve(__dirname, '../patches');
var nodeRepo = 'https://github.com/nodejs/node';

exports.default = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(nodeVersion, targetArch, local) {
    var output;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return (0, _fsExtra.remove)(buildPath);

          case 2:
            _context7.next = 4;
            return (0, _fsExtra.mkdirp)(buildPath);

          case 4:
            _context7.next = 6;
            return gitClone();

          case 6:
            _context7.next = 8;
            return gitResetHard(nodeVersion);

          case 8:
            _context7.next = 10;
            return applyPatches(nodeVersion);

          case 10:
            _context7.next = 12;
            return compile(nodeVersion, targetArch);

          case 12:
            output = _context7.sent;
            _context7.next = 15;
            return (0, _fsExtra.mkdirp)(_path2.default.dirname(local));

          case 15:
            _context7.next = 17;
            return (0, _copyFile.copyFile)(output, local);

          case 17:
            _context7.next = 19;
            return (0, _fsExtra.remove)(buildPath);

          case 19:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  function build(_x9, _x10, _x11) {
    return _ref7.apply(this, arguments);
  }

  return build;
}();
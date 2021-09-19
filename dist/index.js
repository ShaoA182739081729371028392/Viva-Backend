"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var express_1 = __importDefault(require("express"));
var typeorm_1 = require("typeorm");
var Account_entity_1 = require("./entity/Account.entity");
var tts_1 = __importDefault(require("./tts"));
var stt_1 = __importDefault(require("./stt"));
var fs_1 = __importDefault(require("fs"));
var app = (0, express_1.default)();
var port = Number(process.env.PORT || 80);
app.use(express_1.default.json());
var connection = null;
var accountRepo = null;
app.get('/tts/:text/audio.mp3', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var text;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                text = String(req.params.text);
                return [4 /*yield*/, (0, tts_1.default)(text)];
            case 1:
                _a.sent();
                res.setHeader('content-type', 'audio/mp3');
                res.setHeader("accept-ranges", "bytes");
                res.status(200);
                fs_1.default.exists('output.mp3', function (exists) {
                    if (exists) {
                        var rstream = fs_1.default.createReadStream('output.mp3');
                        rstream.pipe(res);
                    }
                    else {
                        res.end("Its a 404");
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
app.post('/stt', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var audioBytes, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Must be in Base64
                console.log(req.body);
                audioBytes = req.body.data;
                console.log(audioBytes);
                return [4 /*yield*/, (0, stt_1.default)(audioBytes)];
            case 1:
                data = _a.sent();
                res.status(200).json(data);
                return [2 /*return*/];
        }
    });
}); });
app.post('/person-exists', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, accountRepo.findOne({ username: req.body.username })];
            case 1:
                data = _a.sent();
                res.json({
                    exists: Boolean(data)
                });
                return [2 /*return*/];
        }
    });
}); });
app.post('/get-person', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body);
                return [4 /*yield*/, accountRepo.findOne({ username: req.body.username })];
            case 1:
                data = _a.sent();
                if (data) {
                    if (req.body.password === data.password) {
                        res.json(__assign({}, data));
                    }
                    else {
                        res.status(403).json({
                            error: "Wrong password."
                        });
                    }
                }
                else {
                    res.status(403).json({
                        error: "No such user."
                    });
                }
                return [2 /*return*/];
        }
    });
}); });
app.post('/add-person', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, newAcc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body);
                return [4 /*yield*/, accountRepo.findOne({ username: req.body.username })];
            case 1:
                data = _a.sent();
                if (data) {
                    res.status(400).json({
                        error: "User already exists."
                    });
                }
                else {
                    newAcc = new Account_entity_1.Account();
                    newAcc.username = req.body.username;
                    newAcc.password = req.body.password;
                    newAcc.progress = 0;
                    accountRepo.save(newAcc);
                    res.status(200).json({ status: 200 });
                }
                return [2 /*return*/];
        }
    });
}); });
app.post('/set-progress', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, accountRepo.findOne({ username: req.body.username })];
            case 1:
                data = _a.sent();
                if (!data) return [3 /*break*/, 3];
                data.progress = req.body.progress;
                return [4 /*yield*/, accountRepo.save(data)];
            case 2:
                _a.sent();
                res.status(200).json({
                    status: 200
                });
                return [3 /*break*/, 4];
            case 3:
                res.status(403).json({
                    error: "No such user."
                });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var allAccounts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(process.env);
                return [4 /*yield*/, (0, typeorm_1.createConnection)()];
            case 1:
                connection = _a.sent();
                accountRepo = connection.getRepository(Account_entity_1.Account);
                return [4 /*yield*/, accountRepo.find()];
            case 2:
                allAccounts = _a.sent();
                // tslint:disable-next-line:no-console
                console.log(allAccounts);
                app.listen(port, "0.0.0.0", function () {
                    // tslint:disable-next-line:no-console
                    console.log("Example app listening at http://localhost:" + port);
                });
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=index.js.map
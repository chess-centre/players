"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _url;
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const decko_1 = require("decko");
const AdmZip = require("adm-zip");
const parser = require("fast-xml-parser");
class Fide {
    constructor() {
        _url.set(this, 'http://ratings.fide.com/download/standard_rating_list_xml.zip');
    }
    constructUrl({ ratingType, month, year }) {
        if (year < 2015 || (year === 2015 && month === "Jan"))
            throw new Error("The rating list does not go back this far!");
        return `http://ratings.fide.com/download/${ratingType}_${month}${year - 2000}frl_xml.zip`;
    }
    getPlayers(url = __classPrivateFieldGet(this, _url)) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(url, { responseType: 'arraybuffer' });
            const zip = new AdmZip(response.data);
            const zipEntries = zip.getEntries();
            const xml = zipEntries[0].getData().toString();
            const { playerslist: { player }, } = parser.parse(xml);
            return player;
        });
    }
    getPreviousPlayersList(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = this.constructUrl(options);
                return this.getPlayers(url);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
_url = new WeakMap();
__decorate([
    decko_1.memoize
], Fide.prototype, "getPlayers", null);
__decorate([
    decko_1.memoize
], Fide.prototype, "getPreviousPlayersList", null);
exports.default = Fide;

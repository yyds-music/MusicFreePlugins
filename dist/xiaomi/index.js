"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const searchRows = 20;
const headers = {
    "User-Agent": "Android_migu",
    host: "pd.musicapp.migu.cn",
    Accept: "application/json, text/plain, */*",
};
async function searchMusic(query, page) {
    var _a, _b, _c, _d;
    try {
        const url = `https://pd.musicapp.migu.cn/MIGUM2.0/v1.0/content/search_all.do?text=${encodeURIComponent(query)}&pageNo=${page}&pageSize=${searchRows}&searchSwitch=%7B%22song%22%3A1%7D`;
        const res = await axios_1.default.get(url, { headers });
        const songData = (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.songResultData) !== null && _b !== void 0 ? _b : {};
        const rawList = (_c = songData.result) !== null && _c !== void 0 ? _c : [];
        const musics = rawList.map((item) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            return ({
                id: item.contentId || item.id,
                title: (_a = item.name) !== null && _a !== void 0 ? _a : "",
                artist: (item.singers || []).map((s) => s.name).join(", "),
                album: (_d = (_c = (_b = item.albums) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "",
                artwork: (_g = (_f = (_e = item.imgItems) === null || _e === void 0 ? void 0 : _e[item.imgItems.length - 1]) === null || _f === void 0 ? void 0 : _f.img) !== null && _g !== void 0 ? _g : "",
                copyrightId: item.copyrightId,
                singerId: (_k = (_j = (_h = item.singers) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.id) !== null && _k !== void 0 ? _k : "",
                rawLrc: (_l = item.lyricUrl) !== null && _l !== void 0 ? _l : "",
            });
        });
        const totalCount = Number((_d = songData.totalCount) !== null && _d !== void 0 ? _d : 0);
        return {
            isEnd: page * searchRows >= totalCount,
            data: musics,
        };
    }
    catch (e) {
        return {
            isEnd: true,
            data: [],
        };
    }
}
async function searchAlbum(query, page) {
    var _a, _b, _c, _d;
    try {
        const url = `https://pd.musicapp.migu.cn/MIGUM2.0/v1.0/content/search_all.do?text=${encodeURIComponent(query)}&pageNo=${page}&pageSize=${searchRows}&searchSwitch=%7B%22album%22%3A1%7D`;
        const res = await axios_1.default.get(url, { headers });
        const albumData = (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.albumResultData) !== null && _b !== void 0 ? _b : {};
        const rawList = (_c = albumData.result) !== null && _c !== void 0 ? _c : [];
        const albums = rawList.map((item) => {
            var _a, _b, _c, _d, _e, _f, _g;
            return ({
                id: item.id,
                title: (_a = item.name) !== null && _a !== void 0 ? _a : "",
                artwork: (_d = (_c = (_b = item.imgItems) === null || _b === void 0 ? void 0 : _b[item.imgItems.length - 1]) === null || _c === void 0 ? void 0 : _c.img) !== null && _d !== void 0 ? _d : "",
                date: (_e = item.publishDate) !== null && _e !== void 0 ? _e : "",
                artist: (_f = item.singer) !== null && _f !== void 0 ? _f : "",
                description: (_g = item.desc) !== null && _g !== void 0 ? _g : "",
            });
        });
        const totalCount = Number((_d = albumData.totalCount) !== null && _d !== void 0 ? _d : 0);
        return {
            isEnd: page * searchRows >= totalCount,
            data: albums,
        };
    }
    catch (e) {
        return {
            isEnd: true,
            data: [],
        };
    }
}
async function searchArtist(query, page) {
    var _a, _b, _c, _d;
    try {
        const url = `https://pd.musicapp.migu.cn/MIGUM2.0/v1.0/content/search_all.do?text=${encodeURIComponent(query)}&pageNo=${page}&pageSize=${searchRows}&searchSwitch=%7B%22singer%22%3A1%7D`;
        const res = await axios_1.default.get(url, { headers });
        const singerData = (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.singerResultData) !== null && _b !== void 0 ? _b : {};
        const rawList = (_c = singerData.result) !== null && _c !== void 0 ? _c : [];
        const artists = rawList.map((item) => {
            var _a, _b, _c, _d;
            return ({
                name: (_a = item.name) !== null && _a !== void 0 ? _a : "",
                id: item.id,
                avatar: (_d = (_c = (_b = item.imgItems) === null || _b === void 0 ? void 0 : _b[item.imgItems.length - 1]) === null || _c === void 0 ? void 0 : _c.img) !== null && _d !== void 0 ? _d : "",
            });
        });
        const totalCount = Number((_d = singerData.totalCount) !== null && _d !== void 0 ? _d : 0);
        return {
            isEnd: page * searchRows >= totalCount,
            data: artists,
        };
    }
    catch (e) {
        return {
            isEnd: true,
            data: [],
        };
    }
}
async function searchMusicSheet(query, page) {
    var _a, _b, _c, _d;
    try {
        const url = `https://pd.musicapp.migu.cn/MIGUM2.0/v1.0/content/search_all.do?text=${encodeURIComponent(query)}&pageNo=${page}&pageSize=${searchRows}&searchSwitch=%7B%22songlist%22%3A1%7D`;
        const res = await axios_1.default.get(url, { headers });
        const sheetData = (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.songListResultData) !== null && _b !== void 0 ? _b : {};
        const rawList = (_c = sheetData.result) !== null && _c !== void 0 ? _c : [];
        const musicsheets = rawList.map((item) => {
            var _a, _b, _c, _d, _e;
            return ({
                title: (_a = item.name) !== null && _a !== void 0 ? _a : "",
                id: item.id,
                artist: (_b = item.userId) !== null && _b !== void 0 ? _b : "",
                artwork: (_c = item.musicListPicUrl) !== null && _c !== void 0 ? _c : "",
                playCount: (_d = item.playNum) !== null && _d !== void 0 ? _d : 0,
                worksNum: (_e = item.musicNum) !== null && _e !== void 0 ? _e : 0,
                description: item.summary || item.intro || "",
            });
        });
        const totalCount = Number((_d = sheetData.totalCount) !== null && _d !== void 0 ? _d : 0);
        return {
            isEnd: page * searchRows >= totalCount,
            data: musicsheets,
        };
    }
    catch (e) {
        return {
            isEnd: true,
            data: [],
        };
    }
}
const qualityLevels = {
    low: "128k",
    standard: "320k",
    high: "320k",
    super: "320k",
};
async function getMediaSource(musicItem, quality) {
    const q = qualityLevels[quality] || "320k";
    const id = musicItem.copyrightId || musicItem.id;
    try {
        const res = (await axios_1.default.get(`https://lxmusicapi.onrender.com/url/mg/${id}/${q}`, {
            headers: {
                "X-Request-Key": "share-v3",
            },
            timeout: 8000,
        })).data;
        return {
            url: (res === null || res === void 0 ? void 0 : res.url) || "",
        };
    }
    catch (e) {
        return {
            url: "",
        };
    }
}
async function getLyric(musicItem) {
    try {
        if (musicItem.rawLrc && typeof musicItem.rawLrc === "string" && musicItem.rawLrc.startsWith("http")) {
            const res = await axios_1.default.get(musicItem.rawLrc, { timeout: 6000 });
            return {
                rawLrc: typeof res.data === "string" ? res.data : "",
            };
        }
    }
    catch (e) { }
    return {
        rawLrc: "",
    };
}
module.exports = {
    platform: "小蜜音乐",
    author: "Huibq",
    version: "0.3.1",
    appVersion: ">0.1.0-alpha.0",
    hints: {
        importMusicSheet: [
            "咪咕APP：自建歌单-分享-复制链接，直接粘贴即可",
            "H5/PC端：复制URL并粘贴，或者直接输入纯数字歌单ID即可",
            "导入时间和歌单大小有关，请耐心等待",
        ],
    },
    primaryKey: ["id", "copyrightId"],
    cacheControl: "cache",
    srcUrl: "https://raw.githubusercontent.com/yyds-music/MusicFreePlugins/master/dist/xiaomi/index.js",
    supportedSearchType: ["music", "album", "sheet", "artist"],
    getMediaSource,
    getLyric,
    async search(query, page, type) {
        if (type === "music") {
            return await searchMusic(query, page);
        }
        if (type === "album") {
            return await searchAlbum(query, page);
        }
        if (type === "artist") {
            return await searchArtist(query, page);
        }
        if (type === "sheet") {
            return await searchMusicSheet(query, page);
        }
        return {
            isEnd: true,
            data: [],
        };
    },
};

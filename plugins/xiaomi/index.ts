import axios from "axios";

const searchRows = 20;

const headers = {
  "User-Agent": "Android_migu",
  host: "pd.musicapp.migu.cn",
  Accept: "application/json, text/plain, */*",
};

async function searchMusic(query: string, page: number) {
  try {
    const url = `https://pd.musicapp.migu.cn/MIGUM2.0/v1.0/content/search_all.do?text=${encodeURIComponent(
      query
    )}&pageNo=${page}&pageSize=${searchRows}&searchSwitch=%7B%22song%22%3A1%7D`;
    const res = await axios.get(url, { headers });
    const songData = res.data?.songResultData ?? {};
    const rawList = songData.result ?? [];

    const musics = rawList.map((item: any) => ({
      id: item.contentId || item.id,
      title: item.name ?? "",
      artist: (item.singers || []).map((s: any) => s.name).join(", "),
      album: item.albums?.[0]?.name ?? "",
      artwork: item.imgItems?.[item.imgItems.length - 1]?.img ?? "",
      copyrightId: item.copyrightId,
      singerId: item.singers?.[0]?.id ?? "",
      rawLrc: item.lyricUrl ?? "",
    }));

    const totalCount = Number(songData.totalCount ?? 0);
    return {
      isEnd: page * searchRows >= totalCount,
      data: musics,
    };
  } catch (e) {
    return {
      isEnd: true,
      data: [],
    };
  }
}

async function searchAlbum(query: string, page: number) {
  try {
    const url = `https://pd.musicapp.migu.cn/MIGUM2.0/v1.0/content/search_all.do?text=${encodeURIComponent(
      query
    )}&pageNo=${page}&pageSize=${searchRows}&searchSwitch=%7B%22album%22%3A1%7D`;
    const res = await axios.get(url, { headers });
    const albumData = res.data?.albumResultData ?? {};
    const rawList = albumData.result ?? [];

    const albums = rawList.map((item: any) => ({
      id: item.id,
      title: item.name ?? "",
      artwork: item.imgItems?.[item.imgItems.length - 1]?.img ?? "",
      date: item.publishDate ?? "",
      artist: item.singer ?? "",
      description: item.desc ?? "",
    }));

    const totalCount = Number(albumData.totalCount ?? 0);
    return {
      isEnd: page * searchRows >= totalCount,
      data: albums,
    };
  } catch (e) {
    return {
      isEnd: true,
      data: [],
    };
  }
}

async function searchArtist(query: string, page: number) {
  try {
    const url = `https://pd.musicapp.migu.cn/MIGUM2.0/v1.0/content/search_all.do?text=${encodeURIComponent(
      query
    )}&pageNo=${page}&pageSize=${searchRows}&searchSwitch=%7B%22singer%22%3A1%7D`;
    const res = await axios.get(url, { headers });
    const singerData = res.data?.singerResultData ?? {};
    const rawList = singerData.result ?? [];

    const artists = rawList.map((item: any) => ({
      name: item.name ?? "",
      id: item.id,
      avatar: item.imgItems?.[item.imgItems.length - 1]?.img ?? "",
    }));

    const totalCount = Number(singerData.totalCount ?? 0);
    return {
      isEnd: page * searchRows >= totalCount,
      data: artists,
    };
  } catch (e) {
    return {
      isEnd: true,
      data: [],
    };
  }
}

async function searchMusicSheet(query: string, page: number) {
  try {
    const url = `https://pd.musicapp.migu.cn/MIGUM2.0/v1.0/content/search_all.do?text=${encodeURIComponent(
      query
    )}&pageNo=${page}&pageSize=${searchRows}&searchSwitch=%7B%22songlist%22%3A1%7D`;
    const res = await axios.get(url, { headers });
    const sheetData = res.data?.songListResultData ?? {};
    const rawList = sheetData.result ?? [];

    const musicsheets = rawList.map((item: any) => ({
      title: item.name ?? "",
      id: item.id,
      artist: item.userId ?? "",
      artwork: item.musicListPicUrl ?? "",
      playCount: item.playNum ?? 0,
      worksNum: item.musicNum ?? 0,
      description: item.summary || item.intro || "",
    }));

    const totalCount = Number(sheetData.totalCount ?? 0);
    return {
      isEnd: page * searchRows >= totalCount,
      data: musicsheets,
    };
  } catch (e) {
    return {
      isEnd: true,
      data: [],
    };
  }
}

const qualityLevels: Record<string, string> = {
  low: "128k",
  standard: "320k",
  high: "320k",
  super: "320k",
};

async function getMediaSource(musicItem: any, quality: string) {
  const q = qualityLevels[quality] || "320k";
  const id = musicItem.copyrightId || musicItem.id;
  try {
    const res = (
      await axios.get(
        `https://lxmusicapi.onrender.com/url/mg/${id}/${q}`,
        {
          headers: {
            "X-Request-Key": "share-v3",
          },
          timeout: 8000,
        }
      )
    ).data;

    return {
      url: res?.url || "",
    };
  } catch (e) {
    return {
      url: "",
    };
  }
}

async function getLyric(musicItem: any) {
  try {
    if (musicItem.rawLrc && typeof musicItem.rawLrc === "string" && musicItem.rawLrc.startsWith("http")) {
      const res = await axios.get(musicItem.rawLrc, { timeout: 6000 });
      return {
        rawLrc: typeof res.data === "string" ? res.data : "",
      };
    }
  } catch (e) {}

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
  srcUrl:
    "https://raw.githubusercontent.com/yyds-music/MusicFreePlugins/master/dist/xiaomi/index.js",
  supportedSearchType: ["music", "album", "sheet", "artist"],
  getMediaSource,
  getLyric,
  async search(query: string, page: number, type: string) {
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

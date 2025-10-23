// Mock playlist data for demo purposes
const playlists = [
  {
    id: "1",
    title: "Nhạc Việt Hay Nhất",
    description: "Tuyển tập những bài hát Việt Nam hay nhất",
    tracks: [
      {
        id: "1",
        title: "Nắng ấm xa dần",
        artist: "Sơn Tùng M-TP",
        src: "/demo/demo.mp3",
        coverUrl: "/next.svg",
        lrcUrl: "/demo/demo.lrc",
        genre_name: "Pop",
        genre_color: "#3B82F6",
        release_year: "2023",
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: "2",
    title: "Electronic Mix",
    description: "Electronic music collection",
    tracks: [
      {
        id: "2", 
        title: "HLS Sample",
        artist: "Demo Artist",
        src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        coverUrl: "/next.svg",
        lrcUrl: null,
        genre_name: "Electronic",
        genre_color: "#8B5CF6",
        release_year: "2024",
        created_at: new Date().toISOString()
      }
    ]
  }
];

export function getPlaylistById(id: string) {
  return playlists.find(playlist => playlist.id === id);
}

export function getAllPlaylists() {
  return playlists;
}

export const demoPlaylists = playlists;
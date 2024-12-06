export type Song = {
  id: number;
  title: string;
  artist: string;
};

export type CatalogSong = Song & { selctedForKaraoke: boolean };

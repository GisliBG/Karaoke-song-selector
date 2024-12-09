import { useQuery } from "@tanstack/react-query";
import { SongList, SongListItem } from "../components/SongList";
import { Song } from "shared/dist/karaoke";

const Playlist = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["playlist"],
    queryFn: fetchPlaylist,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <SongList>
      {data.playlist.map((song: Song) => (
        <SongListItem
          key={`${song.artist}-${song.title}`}
          artist={song.artist}
          title={song.title}
        />
      ))}
    </SongList>
  );
};

async function fetchPlaylist() {
  const response = await fetch("/api/playlist", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch the playlist");

  return response.json();
}

export default Playlist;

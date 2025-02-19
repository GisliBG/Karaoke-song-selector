import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CatalogSong } from "shared/dist/karaoke";
import { Button } from "./ui/Button";
import { Checkbox } from "./ui/Checkbox";

async function fetchSongs() {
  const response = await fetch("/api/catalog/", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch songs from the catalog");

  return response.json();
}

async function setSongForNextKaraoke(data: { id: number; checked: boolean }) {
  const response = await fetch(`/api/catalog/${data.id}`, {
    method: "PUT",
    body: JSON.stringify({ checked: data.checked }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to update a song in the catalog");

  return response.json();
}

async function removeSong(id: number) {
  const response = await fetch(`/api/catalog/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to delete a song from the catalog");

  return response.json();
}

export default function CatalogList() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["catalog"],
    queryFn: fetchSongs,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th className='text-left'>Artist</th>
          <th className='text-left'>Title</th>
          <th className='text-left'>Remove</th>
          <th className='text-left'>Available</th>
        </tr>
      </thead>
      <tbody>
        {data.songs.map((song: CatalogSong) => (
          <tr key={song.id}>
            <td>{song.artist}</td>
            <td>{song.title}</td>

            <td>
              <div className='flex justify-center'>
                <RemoveSongFromCatalogButton songId={song.id} />
              </div>
            </td>
            <td>
              <div className='flex justify-center'>
                <SelectedForKaraokeCheckbox
                  songId={song.id}
                  selected={song.selctedForKaraoke}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SelectedForKaraokeCheckbox(props: {
  songId: number;
  selected: boolean;
}) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: setSongForNextKaraoke,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <Checkbox
      defaultChecked={props.selected}
      onChange={(event) => {
        mutate({ id: props.songId, checked: event.target.checked });
      }}
    />
  );
}

function RemoveSongFromCatalogButton(props: { songId: number }) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id: number) => removeSong(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return (
    <RemoveButton
      onRemove={function removeSong() {
        mutate(props.songId);
      }}
    />
  );
}

function RemoveButton(props: { onRemove: () => void }) {
  return (
    <Button
      className='p-2 rounded-full text-gray-600 hover:text-blue-500 focus:outline-none'
      onClick={props.onRemove}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth='1.5'
        stroke='currentColor'
        className='size-6'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
        />
      </svg>
    </Button>
  );
}

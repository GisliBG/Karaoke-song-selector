import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
//import { Song } from "shared/dist/karaoke";

const Input = (
  props: React.PropsWithChildren<{
    title: string;
  }>
) => {
  return (
    <div className='flex gap-4 '>
      <label className='flex-grow' htmlFor={props.title}>
        {props.title}
      </label>
      {props.children}
    </div>
  );
};

const addSong = async (song: { artist: string; title: string }) => {
  if (song.artist && song.title) {
    const response = await fetch("/api/catalog/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ artist: song.artist, title: song.title }),
    });
    if (!response.ok) throw new Error("Failed to add a song to the catalog");

    return response.json();
  }
};

const AddSongsForm = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<{
    artist: string;
    title: string;
  }>();
  const { mutate } = useMutation({
    mutationFn: (values: { artist: string; title: string }) => addSong(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit: SubmitHandler<{ artist: string; title: string }> = (data) => {
    // Call the mutate function with the form data
    mutate(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-2 w-3/4'>
          <Input title='Artist'>
            <input id='Artist' {...register("artist")} />
          </Input>
          <Input title='Title'>
            <input id='title' {...register("title")} />
          </Input>
          <div className='self-end'>
            <button
              className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
              type='submit'
            >
              Add to catalog
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddSongsForm;

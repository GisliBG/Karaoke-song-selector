import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

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
          <div className='flex gap-2'>
            <Input label='Artist' {...register("artist")} />
            <Input label='Title' {...register("title")} />
          </div>

          <div className='self-end'>
            <Button
              className='bg-blue-500 hover:bg-blue-600 font-semibold py-1 px-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
              type='submit'
            >
              Add to catalog
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddSongsForm;

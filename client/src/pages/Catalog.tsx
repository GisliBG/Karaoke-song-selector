import AddSongsForm from "../components/AddSongsForm";
import CatalogList from "../components/CatalogList";

const Catalog = () => {
  return (
    <div className='flex flex-col gap-2'>
      <AddSongsForm />
      <CatalogList />
    </div>
  );
};

export default Catalog;

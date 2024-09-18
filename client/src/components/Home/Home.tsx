import { useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import ImageUploadModal from "./UploadModal";
import {
  useDeleteImagesMutation,
  useGetImagesQuery,
  useGetUserQuery,
  useUpdateOrderMutation,
} from "../../store/reducers/userSlice";
import { notifyError, notifySuccess } from "../../pages/Toast";
import EditModal from "./EditModal";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./Items";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";

const Home = () => {
  const { data, refetch } = useGetImagesQuery(undefined);
  const { data: users } = useGetUserQuery(undefined);
  const [deleteImage] = useDeleteImagesMutation();
  const [updateOrder] = useUpdateOrderMutation();

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageToView, setImageToView] = useState("");
  const [images, setImages] = useState<any>([]);
  const [editData, setEditData] = useState({
    id: "",
    title: "",
    url: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (data) {
      const sortedImages = [...data.userImages]?.sort(
        (a, b) => a.order - b.order
      );
      setImages(sortedImages);
    }
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((item: any) => item._id === active.id);
    const newIndex = images.findIndex((item: any) => item._id === over.id);
    const reorderedImages = arrayMove(images, oldIndex, newIndex);
    setImages(reorderedImages);

    const updatedImages = reorderedImages.map((image: any, index: number) => ({
      _id: image._id,
      order: index + 1,
    }));

    try {
      const res = await updateOrder({ updatedImages }).unwrap();
      if (res.status) {
        console.log("Order updated successfully");
      }
    } catch (error) {
      console.error("Error updating order", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteImage(id).unwrap();
      if (res.status) {
        refetch();
        notifySuccess(res.message);
      }
    } catch (error) {
      notifyError("something went wrong");
      console.log(error);
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    location.href = "/";
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleEdit = (id: string, title: string, url: string) => {
    setEditData({ id, title, url });
    setIsEditModalOpen(true);
  };

  const handleView = (url: string) => {
    setImageToView(url);
    setIsImageModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1e0026] via-[#4d0260] to-[#1e0026] text-[#e6c0ff]">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 bg-[#2a0036] p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4 sm:mb-0">
            <img
              src={users?.profilePic || "https://via.placeholder.com/100"}
              alt="Users Profile"
              className="w-20 h-20 rounded-full border-4 border-[#8f35a5]"
            />
            <div className="ml-4">
              <h2 className="text-2xl font-bold">{users?.name}</h2>
              <p className="text-[#b388cc]">{users?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="flex items-center space-x-2 bg-[#8f35a5] hover:bg-[#a13dbd] text-white px-6 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              onClick={handleAdd}
            >
              <FiPlusCircle className="text-xl" />
              <span className="text-lg font-semibold">Add Image</span>
            </button>
            <button
              className="flex items-center space-x-2 bg-[#8f35a5] hover:bg-[#a13dbd] text-white px-6 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              onClick={logOut}
            >
              <FiPlusCircle className="text-xl" />
              <span className="text-lg font-semibold">Log Out</span>
            </button>
          </div>
        </div>
        {images?.length === 0 || !images ? (
          <p className="text-[#c89be2] text-center text-xl font-light animate-fade-in">
            No images available. Let's add some memories!
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((img: any) => img._id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {images.map((image: any, index: number) => (
                  <div key={image._id} className="  relative group">
                    <SortableItem image={image} index={index} />

                    <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                      <button
                        onClick={() => handleView(image.url)}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-200"
                        title="View"
                      >
                        <HiEye className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={() =>
                          handleEdit(image._id, image.title, image.url)
                        }
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-200"
                        title="Edit"
                      >
                        <HiPencil className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(image._id)}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-200"
                        title="Delete"
                      >
                        <HiTrash className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
      <div className="fixed bottom-8 right-8 sm:hidden">
        <button
          className="flex items-center justify-center bg-gradient-to-r from-[#8f35a5] to-[#a13dbd] text-white w-16 h-16 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#a13dbd] focus:ring-opacity-50"
          onClick={handleAdd}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>
      {isModalOpen && (
        <ImageUploadModal
          onClose={() => setIsModalOpen(false)}
          refetch={refetch}
        />
      )}
      {isEditModalOpen && (
        <EditModal
          onClose={() => setIsEditModalOpen(false)}
          refetch={refetch}
          data={editData}
        />
      )}

      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={`${
                import.meta.env.VITE_URL || "http://localhost:5000"
              }/uploads/${imageToView}`}
              alt="Full screen"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              className="absolute top-2 right-2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition-all duration-300"
              onClick={() => setIsImageModalOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

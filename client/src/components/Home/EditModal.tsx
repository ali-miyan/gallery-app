import React, { useState } from "react";
import { FiX, FiSave, FiImage } from "react-icons/fi";
import { useUpdateImageMutation } from "../../store/reducers/userSlice";
import { notifySuccess, notifyError } from "../../pages/Toast";

interface EditModalProps {
  onClose: () => void;
  refetch: () => void;
  data: { id: string; title: string; url: string };
}

const EditModal: React.FC<EditModalProps> = ({ onClose, refetch, data }) => {
  console.log(data, "data");

  const [title, setTitle] = useState(data.title);
  const [imagePreview, setImagePreview] = useState(data.url);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);


  const [updateImage, { isLoading }] = useUpdateImageMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(title.trim() === ""){
      setError("please add a title")
      return
    }
    try {
      const formData = new FormData();
      formData.append("id", data.id);
      formData.append("title", title);
      if (file) {
        formData.append("images", file);
      }

      await updateImage(formData).unwrap();
      notifySuccess("Image updated successfully");
      refetch();
      onClose();
    } catch (error) {
      console.log(error);

      notifyError("Failed to update image");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg shadow-2xl w-11/12 max-w-md p-8 relative">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800 transition-colors duration-200"
          onClick={onClose}
        >
          <FiX />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center text-[#5d1670]">
          Edit Image
        </h2>
        {error && (
          <p className="text-center text-[#e63232] bg-[#ffcbcb] p-3 my-2     rounded-md">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="title"
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image
            </label>
            <div className="relative">
              <img
                src={
                  imagePreview === data.url
                    ? `${import.meta.env.VITE_URL || 'http://localhost:5000'}/uploads/${imagePreview}`
                    : imagePreview
                }
                alt="Preview"
                className="w-full h-48 object-cover rounded-md shadow-md"
              />
              <label
                htmlFor="image-upload"
                className="absolute bottom-2 right-2 bg-white bg-opacity-75 hover:bg-opacity-100 text-indigo-600 rounded-full p-2 cursor-pointer transition-all duration-200 shadow-md"
              >
                <FiImage className="w-6 h-6" />
              </label>
              <input
                type="file"
                id="image-upload"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5d1670] hover:bg-[#32123b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <FiSave className="w-5 h-5 mr-2" />
            )}
            {isLoading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditModal;

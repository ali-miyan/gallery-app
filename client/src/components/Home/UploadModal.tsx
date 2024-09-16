import React, { useState } from "react";
import { FiX, FiTrash } from "react-icons/fi";
import { useUploadImagesMutation } from "../../store/reducers/userSlice";
import { notifySuccess } from "../../pages/Toast";

interface ImageUploadModalProps {
  onClose: () => void;
  refetch: () => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  onClose,
  refetch,
}) => {
  const [uploadImages, { isLoading }] = useUploadImagesMutation();

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = event.target.files;
    if (files) {
      const validFiles: File[] = [];
      const fileArray = Array.from(files).map((file) => {
        if (!file.type.startsWith("image/")) {
          setError("Only image files are allowed.");
          return null;
        }
        return URL.createObjectURL(file);
      });

      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          validFiles.push(file);
        }
      });

      if (selectedImages.length + validFiles.length > 12) {
        setError("You can only upload up to 12 images.");
      } else {
        setSelectedImages((prevImages: any) => [...prevImages, ...fileArray]);
        setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
        setImageNames((prevNames) => [
          ...prevNames,
          ...Array(validFiles.length).fill(""),
        ]);
      }
    }
  };

  const handleRemove = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setImageNames(imageNames.filter((_, i) => i !== index));
  };

  const handleNameChange = (index: number, value: string) => {
    setImageNames((prevNames) => {
      const newNames = [...prevNames];
      newNames[index] = value;
      return newNames;
    });
  };

  const handleUpload = async () => {
    setError(null);

    if (selectedFiles.length === 0) {
      setError("Please select at least one image to upload.");
      return;
    }

    if (selectedFiles.length > 12) {
      setError("You can only upload up to 12 images.");
      return;
    }

    if (imageNames.some((name) => name.trim() === "")) {
      setError("Please provide a name for each image.");
      return;
    }

    try {
      const formData = new FormData();
      selectedFiles.forEach((file   ) => {
        formData.append("images", file);
      });

      formData.append("titles", JSON.stringify(imageNames));

      const res = await uploadImages(formData).unwrap();
      console.log(res, "ressssss");

      if (res.status) {
        refetch();
        notifySuccess("successfully uploaded");
      }
      onClose();
    } catch (error) {
      setError("Failed to upload images. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-4/12 p-6 relative">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <FiX />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Add Images</h2>
        {error && (
          <p className="text-center text-[#e63232] bg-[#ffcbcb] p-3 my-2     rounded-md">
            {error}
          </p>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 mb-4"
        />
        <div className="grid grid-cols-4 gap-4 mb-4">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image || ""}
                alt={`Selected ${index}`}
                className="w-full h-28 object-cover rounded-lg"
              />
              <button
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                onClick={() => handleRemove(index)}
              >
                <FiTrash />
              </button>
              <input
                type="text"
                value={imageNames[index] || ""}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder="enter name"
                className="mt-2 w-full p-1 border text-xs text-black border-gray-300 rounded"
              />
            </div>
          ))}
        </div>
        <button
          className="w-full bg-[#8f35a5] hover:bg-[#a13dbd] text-white py-2 rounded-lg transition"
          onClick={handleUpload}
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload Images"}
        </button>
      </div>
    </div>
  );
};

export default ImageUploadModal;

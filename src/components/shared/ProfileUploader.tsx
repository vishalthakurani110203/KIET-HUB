import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { convertFileToUrl } from "@/lib/utils";

type ProfileUploaderProps = {
fieldChange: (files: File[]) => void;
mediaUrl: string;
};

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
  // Remove 'file' state since it's not used
const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      fieldChange(acceptedFiles); // Trigger the field change with the accepted files
      setFileUrl(convertFileToUrl(acceptedFiles[0])); // Set the file URL for the first accepted file
    },
    [fieldChange] // Only depend on 'fieldChange'
);

const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
    "image/*": [".png", ".jpeg", ".jpg"],
    },
});

return (
    <div {...getRootProps()}>
    <input {...getInputProps()} className="cursor-pointer" />
    <div className="cursor-pointer flex-center gap-4">
        <img
          src={fileUrl || "/assets/icons/profile-placeholder.svg"} // Use placeholder if no image is uploaded
        alt="Profile"
        className="h-24 w-24 rounded-full object-cover object-top"
        />
        <p className="text-primary-500 small-regular md:bbase-semibold">
        Change profile photo
        </p>
    </div>
    </div>
);
};

export default ProfileUploader;

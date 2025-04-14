import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { TextMorph } from "./ui/text-morph";
import { useAsyncDispatch, useDispatchWithToast } from "@/hooks/dispatch";
import { fetchUpdateAvatar, fetchUserDetails } from "@/feature/userSlice";

interface AvatarDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
}

function AvatarDialog({
  open,
  setOpen,
  selectedFile,
  setSelectedFile,
}: AvatarDialogProps) {
  let imageUrl;

  if (selectedFile) {
    imageUrl = URL.createObjectURL(selectedFile);
  }

  const [loading, setLoading] = React.useState(false);

  const userDetails = useAsyncDispatch(fetchUserDetails);

  const uploadAvatar = useDispatchWithToast(fetchUpdateAvatar, {
    loadingMessage: "Uploading...",
    getSuccessMessage(data) {
      userDetails();
      setLoading(false);
      setOpen(false);
      setSelectedFile(null);
      return data.message || "Avatar updated successfully";
    },
    getErrorMessage(data) {
      setLoading(false);
      return data.message || "Failed to update avatar";
    },
  });

  const handleUpload = () => {
    if (selectedFile) {
      setLoading(true);
      uploadAvatar(selectedFile);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[600px] max-h-[80h]">
        <DialogHeader>
          <DialogTitle className="mb-4">Update Avatar</DialogTitle>
          <img src={imageUrl} alt="" className="w-full h-full rounded-md" />
        </DialogHeader>
        <DialogFooter>
          <Button
            size="sm"
            variant={"outline"}
            onClick={() => {
              setOpen(false);
              setSelectedFile(null);
            }}
          >
            <X /> Cancel
          </Button>
          <Button size="sm" onClick={handleUpload}>
            {loading ? <Loader2 className="animate-spin" /> : <Upload />}
            <TextMorph>{loading ? "Uploading..." : "Upload"}</TextMorph>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AvatarDialog;

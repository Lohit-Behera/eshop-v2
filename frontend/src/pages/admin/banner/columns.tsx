import { ColumnDef } from "@tanstack/react-table";
import {
  Banner,
  fetchAllBanners,
  fetchDeleteBanner,
} from "@/feature/bannerSlice";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAsyncDispatch, useDispatchWithToast } from "@/hooks/dispatch";
import { useState } from "react";

export const columns: ColumnDef<Banner>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <img
          src={row.original.image}
          alt="image"
          className="h-20 w-20 rounded-md object-cover"
        />
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "link",
    header: () => {
      return <p className="text-center">Link</p>;
    },
    cell: ({ row }) => {
      return (
        <p className="flex justify-center text-center line-clamp-2">
          {row.original.link}
        </p>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "delete",
    header: () => {
      return <p className="text-right">Delete</p>;
    },
    cell: ({ row }) => {
      const [loading, setLoading] = useState<string | null>(null);
      const banner = useAsyncDispatch(fetchAllBanners);
      const deleteBanner = useDispatchWithToast(fetchDeleteBanner, {
        loadingMessage: "Deleting...",
        getSuccessMessage(data) {
          setLoading(null);
          banner();
          return data.message || "Banner deleted successfully";
        },
        getErrorMessage(error) {
          setLoading(null);
          return (
            error.message ||
            error ||
            "Something went wrong while deleting the banner"
          );
        },
      });
      const handleDelete = () => {
        setLoading(row.original._id);
        deleteBanner(row.original._id);
      };
      return (
        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="destructive">
                {loading === row.original._id ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Trash2 />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  Banner.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="text-destructive-foreground bg-destructive hover:bg-destructive/80"
                  onClick={handleDelete}
                >
                  DeLete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
];

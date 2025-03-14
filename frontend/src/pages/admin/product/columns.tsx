import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/feature/productSlice";
import { Button } from "@/components/ui/button";
import { LockKeyhole, Pencil, Trash2, Users2 } from "lucide-react";
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
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { useNavigate } from "react-router-dom";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => {
      return (
        <img
          src={row.original.thumbnail}
          alt={row.original.name}
          className="h-20 w-20 rounded-md object-cover"
        />
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" hideButton />;
    },
    cell: ({ row }) => {
      return (
        <p className="flex justify-center text-center line-clamp-2">
          {row.original.name}
        </p>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "originalPrice",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Original Price" />;
    },
    cell: ({ row }) => {
      return (
        <p className="flex justify-center text-center">
          {row.original.originalPrice}
        </p>
      );
    },
  },
  {
    accessorKey: "sellingPrice",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Selling Price" />;
    },
    cell: ({ row }) => {
      return (
        <p className="flex justify-center text-center">
          {row.original.sellingPrice}
        </p>
      );
    },
  },
  {
    accessorKey: "discount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Discount" />;
    },
    cell: ({ row }) => {
      return (
        <p className="flex justify-center text-center">
          {row.original.discount}%
        </p>
      );
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Stock" />;
    },

    cell: ({ row }) => {
      return (
        <p className="flex justify-center text-center">{row.original.stock}</p>
      );
    },
  },
  {
    accessorKey: "isPublic",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Public" />;
    },
    cell: ({ row }) => {
      return (
        <p className="text-center">
          {row.original.isPublic ? (
            <span className="flex items-center">
              <Users2 className="w-4 h-4 mr-1" /> Public
            </span>
          ) : (
            <span className="flex items-center">
              <LockKeyhole className="w-4 h-4 mr-1" /> Private
            </span>
          )}
        </p>
      );
    },
  },
  {
    accessorKey: "update",
    header: "Update",
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <Button
          size="icon"
          onClick={() => navigate(`/admin/product/update/${row.original._id}`)}
        >
          <Pencil />
        </Button>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "delete",
    header: "Delete",
    cell: ({ row }) => {
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="icon" variant="destructive">
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                product.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
];

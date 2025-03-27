import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Edit, Trash2, AlertTriangle, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useAsyncDispatch } from "@/hooks/dispatch";
import { fetchOrderAdminList } from "@/feature/orderSlice";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { formatPrice } from "@/lib/utils";
import { TextMorph } from "@/components/ui/text-morph";

const statusOptions = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];
const paymentStatusOptions = ["All", "Pending", "Paid", "Failed"];
const paymentMethodOptions = ["All", "Razorpay", "CashFree"];

export default function OrderAdminPage() {
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<{
    fullName: string;
    _id: string;
    paymentStatus: string;
    grandTotal: number;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const adminOrderList = useAsyncDispatch(fetchOrderAdminList);
  const orderStatus = useSelector(
    (state: RootState) => state.order.orderAdminListStatus
  );
  const orderData = useSelector(
    (state: RootState) => state.order.orderAdminList.data
  );

  const orders = orderData.docs || [];

  useEffect(() => {
    adminOrderList("");
  }, []);

  // Handle edit order
  const handleEditOrder = (orderId: string) => {
    navigate(`/admin/orders/edit/${orderId}`);
  };

  // Handle delete order
  const handleDeleteClick = (order: {
    fullName: string;
    _id: string;
    paymentStatus: string;
    grandTotal: number;
  }) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    console.log(orderToDelete);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full sm:w-auto"
        >
          <Filter className="mr-2 h-4 w-4" />
          <TextMorph>{showFilters ? "Hide Filters" : "Show Filters"}</TextMorph>
        </Button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {orders && showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Order Status</label>
                    <Select
                    // value={filters.status}
                    // onValueChange={(value) =>
                    //   handleFilterChange("status", value)
                    // }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Payment Status
                    </label>
                    <Select
                    // value={filters.paymentStatus}
                    // onValueChange={(value) =>
                    //   handleFilterChange("paymentStatus", value)
                    // }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentStatusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Payment Method
                    </label>
                    <Select
                    // value={filters.paymentMethod}
                    // onValueChange={(value) =>
                    //   handleFilterChange("paymentMethod", value)
                    // }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethodOptions.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button variant="outline" size="sm">
                  Apply Filters
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orders table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderStatus === "loading" ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading orders...
                  </div>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{order.fullName}</span>
                      <span className="text-sm text-muted-foreground">
                        {order.phoneNumber}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{format(order.createdAt, "PPP")}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "Pending"
                          ? "warning"
                          : order.status === "Processing"
                          ? "warning"
                          : order.status === "Shipped"
                          ? "shipped"
                          : order.status === "Delivered"
                          ? "success"
                          : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={
                          order.paymentStatus === "Paid"
                            ? "success"
                            : order.paymentStatus === "Pending"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {order.grandTotal}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditOrder(order._id)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() =>
                          handleDeleteClick({
                            _id: order._id,
                            fullName: order.fullName,
                            paymentStatus: order.paymentStatus,
                            grandTotal: order.grandTotal,
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this order? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {orderToDelete && (
            <div className="py-4">
              <p>Payment Status: {orderToDelete.paymentStatus}</p>
              <p>Customer: {orderToDelete.fullName}</p>
              <p>Total: {formatPrice(orderToDelete.grandTotal)}</p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Order
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

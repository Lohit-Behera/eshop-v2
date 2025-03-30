import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Loader2,
  Package,
  MapPin,
  CreditCard,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useAsyncDispatch, useDispatchWithToast } from "@/hooks/dispatch";
import { fetchGetOrder, fetchUpdateOrder } from "@/feature/orderSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { format } from "date-fns";
import { TextMorph } from "@/components/ui/text-morph";

const orderStatusOptions = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];
const paymentStatusOptions = ["Pending", "Paid", "Failed"];

export default function OrderEditForm() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const order = useSelector((state: RootState) => state.order.order.data);
  const orderStatus = useSelector(
    (state: RootState) => state.order.orderStatus
  );

  const [formData, setFormData] = useState({
    status: "",
    paymentStatus: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const getOrder = useAsyncDispatch(fetchGetOrder);

  useEffect(() => {
    if (!orderId) return;
    getOrder(orderId);
  }, [orderId]);

  useEffect(() => {
    if (order && order.status && order.paymentStatus) {
      setFormData({
        status: order.status,
        paymentStatus: order.paymentStatus,
      });
    }
  }, [order]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateOrder = useDispatchWithToast(fetchUpdateOrder, {
    loadingMessage: "Updating order...",
    getSuccessMessage(data) {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        getOrder(order._id);
      }, 2000);
      return data.message || "Order updated successfully";
    },
    getErrorMessage(error) {
      setIsSaving(false);
      return (
        error.response?.data?.message ??
        error.message ??
        "Failed to update order"
      );
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    updateOrder({
      orderId: order._id,
      status: formData.status,
      paymentStatus: formData.paymentStatus,
    });
  };
  return (
    <>
      {orderStatus === "loading" ? (
        <p>Loading</p>
      ) : orderStatus === "failed" ? (
        <p>Error</p>
      ) : orderStatus === "succeeded" ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                Order #{order._id.substring(0, 8)}...
              </h2>
              <div className="ml-auto flex flex-col md:flex-row gap-2">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="min-w-[120px]"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isSaved ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mr-2"
                    >
                      ✓
                    </motion.div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <TextMorph>
                    {isSaving
                      ? "Saving..."
                      : isSaved
                      ? "Saved"
                      : "Save Changes"}
                  </TextMorph>
                </Button>
                {order.status === "Cancellation Requested" && (
                  <Button>Cancellation Conform</Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Status
                  </CardTitle>
                  <CardDescription>
                    Update the current status of this order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Payment Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Status
                  </CardTitle>
                  <CardDescription>
                    Update the payment status for this order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.paymentStatus}
                    onValueChange={(value) =>
                      handleChange("paymentStatus", value)
                    }
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
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  Payment Method: {order.paymentMethod}
                </CardFooter>
              </Card>

              {/* Order Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order Details
                  </CardTitle>
                  <CardDescription>
                    Order placed on {format(order.createdAt, "PPP")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Order ID</p>
                    <p className="text-sm text-muted-foreground">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Customer ID</p>
                    <p className="text-sm text-muted-foreground">
                      {order.userId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Amount</p>
                    <p className="text-lg font-bold">
                      {formatPrice(order.grandTotal)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products Section */}
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>Items included in this order</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.products.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                            <img
                              src={product.thumbnail || "/placeholder.svg"}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium line-clamp-3">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          {formatPrice(product.sellingPrice)}
                        </TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell className="text-right">
                          {formatPrice(product.totalPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-medium">
                        Subtotal
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(order.totalPrice)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-medium">
                        Shipping
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(order.shippingPrice)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-medium">
                        Grand Total
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatPrice(order.grandTotal)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Shipping Address Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.pinCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="pt-2">{order.shippingAddress.phone}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      ) : null}
    </>
  );
}

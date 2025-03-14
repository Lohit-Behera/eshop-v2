import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Package,
  Truck,
  CreditCard,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAsyncDispatch } from "@/hooks/dispatch";
import { fetchGetOrder } from "@/feature/orderSlice";

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
const formatDate = (dateString: string) => {
  return format(new Date(dateString), "PPP");
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let color = "";
  let icon = null;

  switch (status) {
    case "Pending":
      color = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      icon = <Clock className="h-3 w-3 mr-1" />;
      break;
    case "Processing":
      color = "bg-blue-100 text-blue-800 hover:bg-blue-100";
      icon = <Clock className="h-3 w-3 mr-1" />;
      break;
    case "Shipped":
      color = "bg-purple-100 text-purple-800 hover:bg-purple-100";
      icon = <Truck className="h-3 w-3 mr-1" />;
      break;
    case "Delivered":
      color = "bg-green-100 text-green-800 hover:bg-green-100";
      icon = <CheckCircle2 className="h-3 w-3 mr-1" />;
      break;
    case "Cancelled":
      color = "bg-red-100 text-red-800 hover:bg-red-100";
      icon = <AlertCircle className="h-3 w-3 mr-1" />;
      break;
    case "Paid":
      color = "bg-green-100 text-green-800 hover:bg-green-100";
      icon = <CheckCircle2 className="h-3 w-3 mr-1" />;
      break;
    default:
      color = "bg-gray-100 text-gray-800 hover:bg-gray-100";
      icon = <AlertCircle className="h-3 w-3 mr-1" />;
  }

  return (
    <Badge variant="outline" className={`flex items-center ${color}`}>
      {icon}
      {status}
    </Badge>
  );
};

export default function OrderPage() {
  const { orderId } = useParams();
  const orderData = useSelector((state: RootState) => state.order.order.data);

  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const toggleProductExpand = (productId: string) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(productId);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const fetchOrder = useAsyncDispatch(fetchGetOrder);
  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Order Details
              </h1>
              <p className="text-muted-foreground">
                Order #{orderData._id.substring(orderData._id.length - 8)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <StatusBadge status={orderData.status} />
              <StatusBadge status={orderData.paymentStatus} />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-primary" />
                <CardTitle>Order Summary</CardTitle>
              </div>
              <CardDescription>
                Placed on {formatDate(orderData.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderData.products.map((product) => (
                  <motion.div
                    key={product.productId}
                    className="border rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative h-24 w-24 md:h-32 md:w-32 flex-shrink-0 overflow-hidden rounded-md border">
                          <Link to={`/product/${product.productId}`}>
                            <img
                              src={product.thumbnail || "/placeholder.svg"}
                              alt={product.name}
                              className="object-cover object-center"
                            />
                          </Link>
                        </div>
                        <div className="flex flex-col flex-grow justify-between">
                          <div>
                            <Link to={`/product/${product.productId}`}>
                              <h3 className="text-base font-medium text-foreground line-clamp-2 md:line-clamp-none">
                                {product.name}
                              </h3>
                            </Link>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Quantity: {product.cartQuantity}
                            </p>
                          </div>
                          <div className="flex justify-between items-end mt-2">
                            <div>
                              <p className="text-sm font-medium">
                                Price: {formatCurrency(product.sellingPrice)}
                              </p>
                              <p className="text-base font-bold">
                                Total: {formatCurrency(product.totalPrice)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                toggleProductExpand(product.productId)
                              }
                              className="flex items-center gap-1"
                            >
                              {expandedProduct === product.productId ? (
                                <>
                                  Less <ChevronUp className="h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  More <ChevronDown className="h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      {expandedProduct === product.productId && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium">
                                Product Details
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                Product ID: {product.productId}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Available Quantity: {product.productQuantity}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">
                                Price Breakdown
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                Unit Price:{" "}
                                {formatCurrency(product.sellingPrice)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {product.cartQuantity}
                              </p>
                              <p className="text-sm font-medium mt-1">
                                Subtotal: {formatCurrency(product.totalPrice)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Shipping Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Badge variant="outline" className="mb-2">
                      {orderData.shippingAddress.type}
                    </Badge>
                  </div>
                  <p className="font-medium">
                    {orderData.shippingAddress.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {orderData.shippingAddress.addressLine1}
                    {orderData.shippingAddress.addressLine2 &&
                      `, ${orderData.shippingAddress.addressLine2}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {orderData.shippingAddress.city},{" "}
                    {orderData.shippingAddress.state},{" "}
                    {orderData.shippingAddress.country} -{" "}
                    {orderData.shippingAddress.pinCode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Phone: {orderData.shippingAddress.phone}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Payment Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Payment Method</span>
                    <span className="font-medium">
                      {orderData.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Payment Status</span>
                    <StatusBadge status={orderData.paymentStatus} />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(orderData.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{formatCurrency(orderData.shippingPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>{formatCurrency(orderData.tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatCurrency(orderData.grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion className="w-full space-y-4">
                <AccordionItem value="order-placed">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                      <span>Order Placed</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 border-l-2 border-muted ml-4 pb-2">
                      <p className="text-sm text-muted-foreground">
                        Your order was placed on{" "}
                        {formatDate(orderData.createdAt)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Order ID: #
                        {orderData._id.substring(orderData._id.length - 8)}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="payment">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                      <span>Payment Processed</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 border-l-2 border-muted ml-4 pb-2">
                      <p className="text-sm text-muted-foreground">
                        Payment of {formatCurrency(orderData.grandTotal)} was
                        processed via {orderData.paymentMethod}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Payment status: {orderData.paymentStatus}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="processing">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <Badge className="mr-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <Clock className="h-3 w-3 mr-1" />
                        In Progress
                      </Badge>
                      <span>Order Processing</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 border-l-2 border-muted ml-4 pb-2">
                      <p className="text-sm text-muted-foreground">
                        Your order is currently being processed and prepared for
                        shipping
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <Badge className="mr-2 bg-gray-100 text-gray-800 hover:bg-gray-100">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                      <span>Shipping</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 border-l-2 border-muted ml-4 pb-2">
                      <p className="text-sm text-muted-foreground">
                        Your order will be shipped soon
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="delivery">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <Badge className="mr-2 bg-gray-100 text-gray-800 hover:bg-gray-100">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                      <span>Delivery</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 border-l-2 border-muted ml-4 pb-2">
                      <p className="text-sm text-muted-foreground">
                        Delivery status will be updated once your order ships
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter>
              <div className="w-full flex flex-col sm:flex-row justify-between gap-3">
                <Button variant="outline" className="w-full sm:w-auto">
                  Track Order
                </Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  Download Invoice
                </Button>
                <Button className="w-full sm:w-auto">Contact Support</Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

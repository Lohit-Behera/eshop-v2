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
  Loader2,
  Download,
  Ban,
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
import { useAsyncDispatch, useDispatchWithToast } from "@/hooks/dispatch";
import { fetchCancelOrder, fetchGetOrder, Order } from "@/feature/orderSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TextMorph } from "@/components/ui/text-morph";

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

// The PDF generation function
const generateInvoicePDF = (orderData: Order): void => {
  // Create a new PDF document
  const doc = new jsPDF();

  // Add company logo/header
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text("EShop", 105, 20, { align: "center" });

  // Add invoice title
  doc.setFontSize(16);
  doc.text("INVOICE", 105, 30, { align: "center" });

  // Add order information
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);

  // Left side information
  doc.text("Bill To:", 20, 50);
  doc.text(`${orderData.shippingAddress.name}`, 20, 55);
  doc.text(`${orderData.shippingAddress.addressLine1}`, 20, 60);

  let currentY = 65;
  if (orderData.shippingAddress.addressLine2) {
    doc.text(`${orderData.shippingAddress.addressLine2}`, 20, currentY);
    currentY += 5;
  }

  doc.text(
    `${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}`,
    20,
    currentY
  );
  doc.text(
    `${orderData.shippingAddress.country} - ${orderData.shippingAddress.pinCode}`,
    20,
    currentY + 5
  );
  doc.text(`Phone: ${orderData.shippingAddress.phone}`, 20, currentY + 10);

  // Right side information
  doc.text(
    `Invoice Number: INV-${orderData._id.substring(orderData._id.length - 8)}`,
    130,
    50
  );
  doc.text(
    `Order Number: #${orderData._id.substring(orderData._id.length - 8)}`,
    130,
    55
  );
  doc.text(`Order Date: ${formatDate(orderData.createdAt)}`, 130, 60);
  doc.text(`Payment Method: ${orderData.paymentMethod}`, 130, 65);
  doc.text(`Payment Status: ${orderData.paymentStatus}`, 130, 70);

  // Create product table
  const tableColumn: string[] = ["Item", "Price", "Qty", "Total"];
  const tableRows: (string | number)[][] = [];

  // Add product rows
  orderData.products.forEach((product) => {
    const productData: (string | number)[] = [
      product.name,
      formatCurrency(product.sellingPrice).replace("₹", "Rs."),
      product.quantity,
      formatCurrency(product.totalPrice).replace("₹", "Rs."),
    ];
    tableRows.push(productData);
  });

  // Generate the table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 90,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
  });

  // Get the position after the product table
  const docWithAutoTable = doc as unknown as {
    lastAutoTable: { finalY: number };
  };
  const finalY = docWithAutoTable.lastAutoTable.finalY + 10;

  // Summary table
  autoTable(doc, {
    body: [
      ["Subtotal:", formatCurrency(orderData.totalPrice).replace("₹", "Rs.")],
      [
        "Shipping:",
        formatCurrency(orderData.shippingPrice).replace("₹", "Rs."),
      ],
      ["Total:", formatCurrency(orderData.grandTotal).replace("₹", "Rs.")],
    ],
    startY: finalY,
    theme: "plain",
    styles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 150, fontStyle: "bold" },
      1: { halign: "right" },
    },
  });

  // Add footer text
  const footerY = docWithAutoTable.lastAutoTable.finalY + 20;
  doc.setFontSize(8);
  doc.text("Thank you for your purchase!", 105, footerY, { align: "center" });
  doc.text(
    "For any questions regarding this invoice, please contact support@eshop.com",
    105,
    footerY + 5,
    { align: "center" }
  );

  // Save the PDF
  doc.save(`Invoice-${orderData._id.substring(orderData._id.length - 8)}.pdf`);
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let color = "";
  let icon = null;

  switch (status) {
    case "Pending":
      color =
        "bg-yellow-100 dark:bg-yellow-600 text-yellow-800 dark:text-yellow-100 hover:bg-yellow-100";
      icon = <Clock className="h-3 w-3 mr-1" />;
      break;
    case "Processing":
      color =
        "bg-blue-100 dark:bg-blue-600 text-blue-800 dark:text-blue-100 hover:bg-blue-100";
      icon = <Clock className="h-3 w-3 mr-1" />;
      break;
    case "Shipped":
      color =
        "bg-purple-100 dark:bg-purple-600 text-purple-800 dark:text-purple-100 hover:bg-purple-100";
      icon = <Truck className="h-3 w-3 mr-1" />;
      break;
    case "Delivered":
      color =
        "bg-green-100 dark:bg-green-600 text-green-800 dark:text-green-100 hover:bg-green-100";
      icon = <CheckCircle2 className="h-3 w-3 mr-1" />;
      break;
    case "Cancelled":
      color =
        "bg-red-100 dark:bg-red-600 text-red-800 dark:text-red-100 hover:bg-red-100";
      icon = <AlertCircle className="h-3 w-3 mr-1" />;
      break;
    case "Paid":
      color =
        "bg-green-100 dark:bg-green-600 text-green-800 dark:text-green-100 hover:bg-green-100";
      icon = <CheckCircle2 className="h-3 w-3 mr-1" />;
      break;
    default:
      color =
        "bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-100";
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
  const orderStatus = useSelector(
    (state: RootState) => state.order.orderStatus
  );

  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  const cancelOrder = useDispatchWithToast(fetchCancelOrder, {
    loadingMessage: "Cancelling order...",
    getSuccessMessage(data) {
      setLoading(false);
      fetchOrder(orderData._id);
      return data.message || "Order cancelled successfully";
    },
    getErrorMessage(error) {
      setLoading(false);
      return error.message || "Something went wrong while cancelling order";
    },
  });
  const handleCancelOrder = async () => {
    cancelOrder(orderData._id);
  };
  return (
    <>
      {orderStatus === "loading" ? (
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      ) : orderStatus === "failed" ? (
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="flex items-center justify-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            <span>Error</span>
          </div>
        </div>
      ) : orderStatus === "succeeded" ? (
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
                  {orderData.status === "Processing" ||
                    orderData.status === "Shipped" ||
                    (orderData.status === "Pending" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleCancelOrder}
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Ban className="h-4 w-4" />
                        )}
                        <TextMorph>
                          {loading ? "Cancelling..." : "Cancel Order"}
                        </TextMorph>
                      </Button>
                    ))}
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
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <div className="p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative h-24 w-24 md:h-32 md:w-32 flex-shrink-0 overflow-hidden rounded-md border">
                              <Link to={`/product/${product.productId}`}>
                                <img
                                  src={product.thumbnail || "/placeholder.svg"}
                                  alt={product.name}
                                  className="object-cover object-center hover:scale-105 transition-transform duration-300 ease-in-out"
                                />
                              </Link>
                            </div>
                            <div className="flex flex-col flex-grow justify-between">
                              <div>
                                <Link to={`/product/${product.productId}`}>
                                  <h3 className="text-base font-medium text-foreground line-clamp-2 hover:underline underline-offset-2">
                                    {product.name}
                                  </h3>
                                </Link>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  Quantity: {product.quantity}
                                </p>
                              </div>
                              <div className="flex justify-between items-end mt-2">
                                <div>
                                  <p className="text-sm font-medium">
                                    Price:{" "}
                                    {formatCurrency(product.sellingPrice)}
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
                                    Price Breakdown
                                  </h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Unit Price:{" "}
                                    {formatCurrency(product.sellingPrice)}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Quantity: {product.quantity}
                                  </p>
                                  <p className="text-sm font-medium mt-1">
                                    Subtotal:{" "}
                                    {formatCurrency(product.totalPrice)}
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
                            Payment of {formatCurrency(orderData.grandTotal)}{" "}
                            was processed via {orderData.paymentMethod}
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
                            Your order is currently being processed and prepared
                            for shipping
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
                            Delivery status will be updated once your order
                            ships
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
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto flex items-center gap-2"
                      onClick={() => generateInvoicePDF(orderData)}
                    >
                      <Download className="h-4 w-4" />
                      Download Invoice
                    </Button>
                    <Button className="w-full sm:w-auto">
                      Contact Support
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      ) : null}
    </>
  );
}

import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Calculates all dashboard & analytics metrics from live Firestore collections.
 */
export const getAdminAnalyticsData = async () => {
  try {
    const productsSnap = await getDocs(collection(db, "products"));
    const ordersSnap = await getDocs(collection(db, "orders"));
    const usersSnap = await getDocs(collection(db, "users"));

    const products = productsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const orders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const users = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Valid orders for revenue
    const validOrders = orders.filter(
      (o) => o.status === "paid" || o.status === "delivered" || o.status === "shipped" || o.status === "packed"
    );

    const totalRevenue = validOrders.reduce(
      (acc, curr) => acc + Number(curr.totalAmount || curr.amount || 0),
      0
    );

    const totalOrders = orders.length;
    const totalCustomers = users.length;
    const totalProducts = products.length;

    const averageOrderValue =
      validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

    // Monthly Revenue (Last 6 months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const monthlyRevenueMap = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthlyRevenueMap[key] = { month: monthNames[d.getMonth()], label: key, revenue: 0, orders: 0 };
    }

    validOrders.forEach((order) => {
      const date = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt || Date.now());
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (monthlyRevenueMap[key]) {
        monthlyRevenueMap[key].revenue += Number(order.totalAmount || order.amount || 0);
        monthlyRevenueMap[key].orders += 1;
      }
    });

    const monthlyRevenueChart = Object.values(monthlyRevenueMap);

    // Orders this week (Last 7 days)
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyOrdersMap = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = daysOfWeek[d.getDay()];
      weeklyOrdersMap[key] = { day: key, orders: 0, revenue: 0 };
    }

    orders.forEach((order) => {
      const date = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt || Date.now());
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) {
        const key = daysOfWeek[date.getDay()];
        if (weeklyOrdersMap[key]) {
          weeklyOrdersMap[key].orders += 1;
          weeklyOrdersMap[key].revenue += Number(order.totalAmount || order.amount || 0);
        }
      }
    });

    const weeklyOrdersChart = Object.values(weeklyOrdersMap);

    // Best Selling Products & Top Categories
    const productSalesMap = {};
    const categorySalesMap = {};

    validOrders.forEach((order) => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const qty = Number(item.quantity || 1);
          const itemPrice = Number(item.price || 0);

          // Product sales
          if (!productSalesMap[item.name]) {
            productSalesMap[item.name] = { name: item.name, quantity: 0, revenue: 0, image: item.image };
          }
          productSalesMap[item.name].quantity += qty;
          productSalesMap[item.name].revenue += itemPrice * qty;

          // Find product category
          const matchedProd = products.find((p) => p.id === item.productId || p.name === item.name);
          const cat = matchedProd?.category || "Raw";
          if (!categorySalesMap[cat]) {
            categorySalesMap[cat] = { category: cat, revenue: 0, count: 0 };
          }
          categorySalesMap[cat].revenue += itemPrice * qty;
          categorySalesMap[cat].count += qty;
        });
      }
    });

    const bestSellingProducts = Object.values(productSalesMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const topCategories = Object.values(categorySalesMap).sort((a, b) => b.revenue - a.revenue);

    // Returning Customers Calculation
    const customerOrderCounts = {};
    orders.forEach((o) => {
      const customerId = o.userId || o.customerEmail || o.customerName;
      if (customerId) {
        customerOrderCounts[customerId] = (customerOrderCounts[customerId] || 0) + 1;
      }
    });

    const uniqueCustomerCount = Object.keys(customerOrderCounts).length;
    const repeatCustomers = Object.values(customerOrderCounts).filter((count) => count > 1).length;
    const returningCustomerRate =
      uniqueCustomerCount > 0 ? Math.round((repeatCustomers / uniqueCustomerCount) * 100) : 0;

    return {
      stats: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        averageOrderValue,
        returningCustomerRate,
      },
      charts: {
        monthlyRevenueChart,
        weeklyOrdersChart,
      },
      bestSellingProducts,
      topCategories,
    };
  } catch (error) {
    console.error("Error generating analytics data:", error);
    throw new Error("Failed to compile analytics: " + error.message);
  }
};

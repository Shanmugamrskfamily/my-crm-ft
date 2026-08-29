// src/store/selectors.js

// 1. Dashboard Metrics Selector
export const selectDashboardMetrics = (state) => {
  const customers = state.customers.items || [];
  const leads = state.leads.items || [];
  const tasks = state.tasks.items || [];

  const totalCustomers = customers.length;
  const totalLeads = leads.length;
  const convertedLeads = leads.filter((l) => l.status === "Converted").length;
  const pendingTasks = tasks.filter((t) => t.status !== "Completed").length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;

  const leadConversionRate =
    totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  return {
    totalCustomers,
    totalLeads,
    convertedLeads,
    pendingTasks,
    completedTasks,
    leadConversionRate,
  };
};

// 2. Recent Customers Selector (Top 5 sorted by creation date)
export const selectRecentCustomers = (state) => {
  const customers = [...(state.customers.items || [])];
  return customers
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
    .slice(0, 5);
};

// 3. Consolidated Recent Activities Selector (Top 6 latest events across all customers)
export const selectRecentActivities = (state) => {
  const customers = state.customers.items || [];
  const activities = [];

  customers.forEach((c) => {
    if (Array.isArray(c.activities)) {
      c.activities.forEach((act) => {
        activities.push({
          ...act,
          customerName: c.name,
          customerId: c.id,
        });
      });
    }
  });

  return activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 6);
};
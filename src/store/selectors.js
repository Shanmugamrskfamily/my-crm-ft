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

// 4. Leads by stage (pipeline funnel data)
export const selectLeadsByStage = (state) => {
  const leads = state.leads.items || [];
  const stages = ["New", "Contacted", "Follow-up", "Qualified", "Converted", "Lost"];
  return stages.map((stage) => ({
    stage,
    count: leads.filter((l) => l.status === stage).length,
  }));
};

// 5. Tasks by priority
export const selectTasksByPriority = (state) => {
  const tasks = state.tasks.items || [];
  return ["High", "Medium", "Low"].map((priority) => ({
    priority,
    count: tasks.filter((t) => t.priority === priority).length,
  }));
};

// 6. Customers created per month (last 6 months)
export const selectCustomerGrowth = (state) => {
  const customers = state.customers.items || [];
  const now = new Date();
  const buckets = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString(undefined, { month: "short" }),
      count: 0,
    });
  }
  const index = new Map(buckets.map((b) => [b.key, b]));
  customers.forEach((c) => {
    const d = new Date(c.createdDate);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = index.get(key);
    if (bucket) bucket.count += 1;
  });
  return buckets;
};
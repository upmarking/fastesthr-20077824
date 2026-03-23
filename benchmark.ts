import { performance } from 'perf_hooks';

type Role = 'super_admin' | 'company_admin' | 'hr_manager' | 'recruiter' | 'user';

interface NavItem {
  title: string;
  url: string;
  icon: any;
  roles: Role[]; // which roles can see this item
  subItems?: Omit<NavItem, 'icon' | 'subItems'>[];
}

const ALL_ROLES: Role[] = ['company_admin', 'hr_manager', 'recruiter', 'user'];
const ADMIN_HR: Role[] = ['company_admin', 'hr_manager'];
const ADMIN_ONLY: Role[] = ['company_admin'];

const fastBoardNav: NavItem[] = [
  { title: 'Dashboard', url: '/dashboard', icon: 'LayoutDashboard', roles: ALL_ROLES },
  { title: 'Announcements', url: '/announcements', icon: 'Megaphone', roles: ALL_ROLES },
  { title: 'Employee', url: '/employees', icon: 'Users', roles: ADMIN_HR },
  { title: 'Attendance', url: '/attendance', icon: 'Clock', roles: ALL_ROLES },
  { title: 'Leave', url: '/leave', icon: 'CalendarDays', roles: ALL_ROLES },
  { title: 'Holidays', url: '/holidays', icon: 'CalendarCheck', roles: ALL_ROLES },
  { title: 'Documents', url: '/documents', icon: 'FileText', roles: ALL_ROLES },
  { title: 'Learning', url: '/learning', icon: 'GraduationCap', roles: ALL_ROLES },
];

const managementNav: NavItem[] = [
  { title: 'Recruitment', url: '/recruitment', icon: 'Briefcase', roles: ['company_admin', 'hr_manager', 'recruiter'] },
  { title: 'Onboarding', url: '/onboarding', icon: 'UserPlus', roles: ADMIN_HR },
  { title: 'Performance', url: '/performance', icon: 'BarChart3', roles: ALL_ROLES },
  { title: 'Help Desk', url: '/helpdesk', icon: 'Headset', roles: ALL_ROLES },
  { title: 'Reports', url: '/reports', icon: 'PieChart', roles: ADMIN_HR },
  { title: 'Payroll', url: '/payroll', icon: 'DollarSign', roles: [...ADMIN_HR, 'user', 'recruiter'] },
  { title: 'Exit Management', url: '/exit-management', icon: 'UserMinus', roles: ADMIN_HR },
];

const accountNav: NavItem[] = [
  { title: 'Billing', url: '/billing', icon: 'CreditCard', roles: ADMIN_ONLY },
  { title: 'Settings', url: '/settings', icon: 'Settings', roles: ADMIN_ONLY },
];

// Baseline
function filterNavBaseline(navItems: NavItem[], userRole: Role, isSuperAdmin: boolean) {
  return isSuperAdmin
    ? navItems
    : navItems.filter(item => item.roles.includes(userRole));
}

// Optimized with Set in NavItem - wait, we shouldn't mutate types.
// Optimized with memoized hash map per nav list
function buildRoleMap(navItems: NavItem[]): Record<Role, NavItem[]> {
  const map = {} as Record<Role, NavItem[]>;
  for (const item of navItems) {
    for (const role of item.roles) {
      if (!map[role]) map[role] = [];
      map[role].push(item);
    }
  }
  return map;
}

const fastBoardMap = buildRoleMap(fastBoardNav);
const managementMap = buildRoleMap(managementNav);
const accountMap = buildRoleMap(accountNav);

function filterNavOptimized(navItems: NavItem[], userRole: Role, isSuperAdmin: boolean, roleMap: Record<Role, NavItem[]>) {
  return isSuperAdmin
    ? navItems
    : (roleMap[userRole] || []);
}

const userRoles: Role[] = ['company_admin', 'hr_manager', 'recruiter', 'user', 'super_admin'];

// Let's create a larger array to see the O(N^2) effect clearly.
// For the benchmark, we will duplicate the items to make N large.
const largeNav: NavItem[] = [];
for (let i = 0; i < 1000; i++) {
  largeNav.push(...fastBoardNav.map(item => ({ ...item, title: item.title + i })));
}
const largeNavMap = buildRoleMap(largeNav);

const ITERATIONS = 10000;

console.log("Benchmarking small arrays...");

let start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  const role = userRoles[i % userRoles.length];
  const isSuper = role === 'super_admin';
  filterNavBaseline(fastBoardNav, role, isSuper);
  filterNavBaseline(managementNav, role, isSuper);
  filterNavBaseline(accountNav, role, isSuper);
}
let end = performance.now();
console.log(`Baseline small: ${(end - start).toFixed(3)} ms`);

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  const role = userRoles[i % userRoles.length];
  const isSuper = role === 'super_admin';
  filterNavOptimized(fastBoardNav, role, isSuper, fastBoardMap);
  filterNavOptimized(managementNav, role, isSuper, managementMap);
  filterNavOptimized(accountNav, role, isSuper, accountMap);
}
end = performance.now();
console.log(`Optimized map small: ${(end - start).toFixed(3)} ms`);

console.log("Benchmarking large arrays...");

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  const role = userRoles[i % userRoles.length];
  const isSuper = role === 'super_admin';
  filterNavBaseline(largeNav, role, isSuper);
}
end = performance.now();
console.log(`Baseline large: ${(end - start).toFixed(3)} ms`);

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  const role = userRoles[i % userRoles.length];
  const isSuper = role === 'super_admin';
  filterNavOptimized(largeNav, role, isSuper, largeNavMap);
}
end = performance.now();
console.log(`Optimized map large: ${(end - start).toFixed(3)} ms`);

// Test using Set for roles (O(N) filter, O(1) includes)
const largeNavWithSets = largeNav.map(n => ({ ...n, rolesSet: new Set(n.roles) }));
function filterNavWithSet(navItems: any[], userRole: Role, isSuperAdmin: boolean) {
  return isSuperAdmin
    ? navItems
    : navItems.filter(item => item.rolesSet.has(userRole));
}

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  const role = userRoles[i % userRoles.length];
  const isSuper = role === 'super_admin';
  filterNavWithSet(largeNavWithSets, role, isSuper);
}
end = performance.now();
console.log(`Optimized Set large: ${(end - start).toFixed(3)} ms`);

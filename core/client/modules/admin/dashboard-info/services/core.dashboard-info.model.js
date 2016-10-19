DashboardInfo.$inject = ['$resource', 'dashboardInfoResources'];

export default function DashboardInfo($resource, dashboardInfoResources) {
    return $resource(dashboardInfoResources.DASHBOARD_INFO, {}, {});
}
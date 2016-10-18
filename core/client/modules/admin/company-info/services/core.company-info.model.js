CompanyInfo.$inject = ['$resource', 'companyInfoResources'];

export default function CompanyInfo($resource, companyInfoResources) {
    return $resource(companyInfoResources.COMPANY_INFO, {}, {
        update: {
            method: 'PUT'
        }
    });
}
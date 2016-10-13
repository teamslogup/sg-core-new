CompanyInfo.$inject = ['$resource', 'companyInfoResources'];

export default function CompanyInfo($resource, companyInfoResources) {
    return $resource(companyInfoResources.COMPANY_INFO + '/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        },
        query: {
            isArray: false
        }
    })
}
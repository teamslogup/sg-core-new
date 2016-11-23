export default function returnDeleteDisabled () {
    return function (terms) {
        return !(terms && terms.startDate && new Date() < new Date(terms.startDate));
    }
}
export default function returnDeleteDisabled () {
    return function (terms) {
        return (terms && terms.startDate && (new Date()).getTime()*1000 < new Date(terms.startDate));
    }
}
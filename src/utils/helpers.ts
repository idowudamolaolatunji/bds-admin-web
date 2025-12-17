import moment from "moment";

// FORMAT NUMBER
export const formatNumber = function(amount: string | number) {
	return Number(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


// CAPITALIZE FIRST LETTER
export const capFirstLetter = function(string: string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1);
}


// FORMAT DATE, BUT FOR LATER FORMAT
export const formatDate = function(givenDate: string) {
    const date = moment(givenDate);
    return date.format('DD, MMM YYYY');
}
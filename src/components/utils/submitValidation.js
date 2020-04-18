import {transformDate} from "./time";
export const validateValue = (column, value, mandatoryDependent) => {
    
    if ((column.required || column.mandatoryDependent && mandatoryDependent) && (value.length === 0 || !value) && column.type !== 'checkbox' ){
        return 'This field is mandatory';
    }
    if (column.min && value<column.min && column.type === 'numeric') {
        return 'Your value should be ' + column.min + ' or above';
    }

    if (column.min && value<column.min && column.type === 'date') {
        return 'The date should be at least ' + transformDate(column.min);
    }

    if (column.min && value.length<column.min && (column.type === 'text' || column.type === 'textarea')) {
        return 'The text should be at least ' + column.min + ' characters long';
    }

    if (column.max && value>column.max && column.type === 'numeric') {
        return 'Your value should be ' + column.max + ' or below';
    }

    if (column.max && value>column.max && column.type === 'date') {
        return 'The date should be before ' + transformDate(column.max);
    }

    if (column.max && value.length>column.max && (column.type === 'text' || column.type === 'textarea')) {
        return 'The date should be shorter than ' + column.max + ' characters';
    }

    return false;
}

export const getSameAsOperator = () => {
    return (val1, val2) => val1 === val2;
}

export const getContainsOperator = () => {
    return (val1, val2) => val1.indexOf(val2) !== -1;
}

export const getOneOfOperator = () => {
    return (val1, values) => values.indexOf(val1) !== -1;
}

export const clone = id => JSON.parse(JSON.stringify(id));

export const getErrors = error => {
    return (
        error.graphQLErrors && 
        error.graphQLErrors[0] && 
        error.graphQLErrors[0].data.errors
    ) || [error.message]
} 


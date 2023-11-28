// sum max - mi
const array2 = [1,1,1,2,10];

const array1 = [1,2,3,4,56,7,8,10];



function maxMin (array1) {
    const max = Math.max(...array1);
    const min = Math.min(...array1);

    return `El numero mayor es ${max}, el menor es ${min}, la suma de ambos es igual a: ${max + min}`;
}

console.log(maxMin(array1))
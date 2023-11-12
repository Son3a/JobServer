

const getSalary = function (str) {
    var arr = str.split('-')
    var newArr = []
    newArr[0] = parseInt(arr[0].match(/(\d+)/)[0]);
    if (arr.length == 2) {
        newArr[1] = parseInt(arr[1].match(/(\d+)/)[0]);
    }
    return newArr
}

function hasNumber(str) {
    return /\d/.test(str);
}

const checkSalary = function (strSalary, salary, unitMoney) {
    if(!strSalary){
        return true;
    }

    //Lương thỏa thuận
    if (strSalary.toLowerCase() === salary.toLowerCase()) {
        return true;
    }

    if (hasNumber(salary)) {
        // Chuyển đổi lương từ usd > vnd
        var convertSalary = parseInt(getSalary(salary)[0])

        if (salary.includes('USD')) {
            convertSalary = parseFloat(convertSalary) * parseFloat(unitMoney)
        }

        var arrSalary = getSalary(strSalary)

        //Cần tìm lương >
        if (strSalary.includes('>') && arrSalary[0] <= convertSalary) {
            return true;
        }

        //Cần tìm lương <
        if (strSalary.includes('<') && arrSalary[0] >= convertSalary) {
            return true;
        }

        //Cần tìm lương < && >
        if(arrSalary[0] <= convertSalary && arrSalary[1] >= convertSalary){
            return true;
        }
    }

    return false;
}

module.exports = { checkSalary }
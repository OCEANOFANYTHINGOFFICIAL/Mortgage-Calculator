const loanAmountInput = document.querySelector(".loan-amount");
const interestRateInput = document.querySelector(".interest-rate");
const loanTenureInput = document.querySelector(".loan-tenure");
const downPaymentInput = document.querySelector(".down-payment");
const loanEMIValue = document.querySelector(".loan-emi .value");
const totalInterestValue = document.querySelector(".total-interest .value");
const totalAmountValue = document.querySelector(".total-amount .value");
let loanAmount = parseFloat(loanAmountInput.value);
let interestRate = parseFloat(interestRateInput.value);
let loanTenure = parseFloat(loanTenureInput.value);
let downPayment = parseFloat(downPaymentInput.value)
let interest = interestRate / 12 / 100;
let myChart;


const checkValues = () => {
    let loanAmountValue = loanAmountInput.value.trim();
    let downPaymentValue = downPaymentInput.value.trim();
    let interestRateValue = interestRateInput.value.trim();
    let loanTenureValue = loanTenureInput.value.trim();

    let regexPositiveNumber = /^[0-9]+(\.\d+)?$/; // Allow positive integers and decimals

    if (loanAmountValue === '' || !regexPositiveNumber.test(loanAmountValue) || parseFloat(loanAmountValue) <= 0) {
        alert('Please enter a valid positive number for the loan amount.');
        loanAmountInput.value = '';
        return false;
    }
    if (downPaymentValue === '' || !regexPositiveNumber.test(downPaymentValue) || parseFloat(downPaymentValue) <= 0) {
        alert('Please enter a valid positive number for the loan amount.');
        downPaymentValue.value = '';
        return false;
    }
    if (
        downPaymentValue !== '' &&
        (!regexPositiveNumber.test(downPaymentValue) || parseFloat(downPaymentValue) < 0)
    ) {
        alert('Please enter a valid positive number for down payment.');
        downPaymentInput.value = '';
        return false;
    }

    if (interestRateValue === '' || !regexPositiveNumber.test(interestRateValue) || parseFloat(interestRateValue) <= 0) {
        alert('Please enter a valid positive number for the interest rate.');
        interestRateInput.value = '';
        return false;
    }

    if (loanTenureValue === '' || !regexPositiveNumber.test(loanTenureValue) || parseFloat(loanTenureValue) <= 0) {
        alert('Please enter a valid positive number for the loan tenure.');
        loanTenureInput.value = '';
        return false;
    }

    return true;
};




const calculateBtn = document.querySelector(".calculate-btn");

calculateBtn.addEventListener("click", () => {
    checkValues();
    refreshInputValues();

    if (isNaN(downPayment)) {
        downPayment = 0; // Consider downPayment as 0 if not provided
    }

    let emi =
        (loanAmount - downPayment) *
        interest *
        (Math.pow(1 + interest, loanTenure) /
            (Math.pow(1 + interest, loanTenure) - 1));

    updateData(emi);
    console.log(loanAmount, downPayment)
});


const displayDefaultChart = () => {
    const ctx = document.getElementById("myChart").getContext("2d");
    let principalPercentage = 100; // Default to 100%
    if (loanAmount > 0 && totalInterestValue > 0) {
        principalPercentage = (loanAmount / (loanAmount + totalInterestValue)) * 100;
    }
    // Create the chart with initial data
    myChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Principal Loan Amount", "Total Interest"],
            datasets: [
                {
                    data: [principalPercentage, 100 - principalPercentage],
                    backgroundColor: ["#DC4C64", "#14A44D"],
                    borderWidth: 2,
                },
            ],
        },
        options: {
            animation: {
                animateRotate: true,
                animateScale: true,
            },
        },
    });
};

// Call the function to display the default pie chart
displayDefaultChart();

const displayChart = (totalInterestPayableValue) => {
    const ctx = document.getElementById("myChart").getContext("2d");
    myChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Principal Loan Amount", "Total Interest"],
            datasets: [
                {
                    data: [loanAmount, totalInterestPayableValue],
                    backgroundColor: ["#DC4C64", "#14A44D"],
                    borderWidth: 2,
                },
            ],
        },
        options: {
            animation: {
                animateRotate: true,
                animateScale: true,
            },
        },
    });
};

const updateChart = (totalInterestPayableValue) => {
    myChart.data.datasets[0].data[0] = loanAmount;
    myChart.data.datasets[0].data[1] = totalInterestPayableValue;
    myChart.update();
};


const refreshInputValues = () => {
    loanAmount = parseFloat(loanAmountInput.value);
    downPayment = parseFloat(downPaymentInput.value);

    interestRate = parseFloat(interestRateInput.value);
    loanTenure = parseFloat(loanTenureInput.value);
    interest = interestRate / 12 / 100;
};
const updateData = (emi) => {
    if (isNaN(emi)) {
        loanEMIValue.innerHTML = ' ';
        totalInterestValue.innerHTML = ' ';
        totalAmountValue.innerHTML = ' ';
        return;
    }

    loanEMIValue.innerHTML = Math.round(emi);

    let totalAmount = Math.round(loanTenure * emi);
    totalAmountValue.innerHTML = totalAmount;

    let totalInterestPayable = Math.round(totalAmount - loanAmount + downPayment);
    totalInterestValue.innerHTML = totalInterestPayable;

    if (myChart) {
        updateChart(totalInterestPayable);
    } else {
        displayChart(totalInterestPayable);
    }
};
const resetBtn = document.querySelector(".resetBtn");
resetBtn.addEventListener("click", () => {
    // Clear input values
    loanAmountInput.value = "";
    interestRateInput.value = "";
    loanTenureInput.value = "";
    downPaymentInput.value = "";
    // Clear output values
    loanEMIValue.innerHTML = "";
    totalInterestValue.innerHTML = "";
    totalAmountValue.innerHTML = "";
    // Destroy the chart (if it exists)
    if (myChart) {
        myChart.destroy();
        myChart = null;
    }
    // Re-display the default chart
    displayDefaultChart();
});


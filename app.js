(function () {
    document.querySelector(".copyright").innerHTML = `Copyright © ${ new Date().getFullYear() } <a target="_blank" class="underline" href="https://www.brandymedia.co.uk/">Brandy Media</a>`;

    function copyCat(elem1, elem2, elem3) {
        params = new URLSearchParams(location.search);

        let elem1Input = document.querySelector(elem1);
        let elem2Input = document.querySelector(elem2);
        let elem3Input = params.get(elem3);

        window.addEventListener('load', () => {
            if (elem3Input) {
                elem1Input.value = elem3Input;
                elem2Input.value = elem3Input;
            } else {
                elem1Input.value = elem2Input.value;
            }
            calculate();
        });

        elem2Input.addEventListener('input', () => {
            elem1Input.value = elem2Input.value;
            params.set(elem3, elem2Input.value);
            window.history.replaceState({}, '', `${location.pathname}?${params}`);
            calculate();
        });
        
        elem1Input.addEventListener('input', () => {
            elem2Input.value = elem1Input.value;
            params.set(elem3, elem1Input.value);
            window.history.replaceState({}, '', `${location.pathname}?${params}`);        
            calculate();
        });

        let stepDown = document.querySelector(`${elem1}-slider-step-down`);
        let stepUp = document.querySelector(`${elem1}-slider-step-up`);

        stepDown.addEventListener('click', () => {
            elem2Input.stepDown();
            elem1Input.value = elem2Input.value;
            params.set(elem3, elem2Input.value);
            window.history.replaceState({}, '', `${location.pathname}?${params}`);
            calculate();
        });

        stepUp.addEventListener('click', () => {
            elem2Input.stepUp();
            elem1Input.value = elem2Input.value;
            params.set(elem3, elem2Input.value);
            window.history.replaceState({}, '', `${location.pathname}?${params}`);        
            calculate();
        });
    }

    function thousands_separators(num) {
        var num_parts = num.toString().split(".");
        num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return num_parts.join(".");
    }

    function calculate() {
        const feeFixed = parseFloat(document.querySelector('.fixed-fee-input').value);
        const feePercent = parseFloat(document.querySelector('.percent-fee-input').value);
        const subscriptionAmount = parseFloat(document.querySelector('.subscription-amount-input').value);
        const subscriptionAmountPeriod = document.querySelector('.subscription-amount-period');
        let subscriptionAmountPeriodOption = subscriptionAmountPeriod.options[subscriptionAmountPeriod.selectedIndex].text;
        const customerTotal = parseFloat(document.querySelector('.customer-total-input').value);
        const results = document.querySelector('.results-text');

        window.addEventListener('load',  () => {
            params = new URLSearchParams(location.search);
            let periodParam = params.get('period');
            if (periodParam) {
                subscriptionAmountPeriod.value = periodParam;
            }
            calculate();
        });

        subscriptionAmountPeriod.addEventListener('change', () => {
            params = new URLSearchParams(location.search);
            params.set('period', subscriptionAmountPeriod.options[subscriptionAmountPeriod.selectedIndex].text);
            window.history.replaceState({}, '', `${location.pathname}?${params}`);
            calculate();
        });

        let percentCost = ((subscriptionAmount / 100) * feePercent);
        let costPerCustomer = (percentCost + feeFixed);
        let monthlyRevenue;
        let annualRevenue;
        let monthlyRevenuePerCustomer;
        let annualRevenuePerCustomer;
        let monthlyCost;
        let annualCost;
        let totalMonthlyCost;
        let totalAnnualCost;
        let monthlyCostPerCustomer;
        let annualCostPerCustomer;
        let netMonthlyProfit;
        let netAnnaulProfit;
        let netMonthlyProfitPerCustomer;
        let netAnnaulProfitPerCustomer;

        if (subscriptionAmountPeriodOption === 'monthly') {
            monthlyCostPerCustomer = costPerCustomer;
            annualCostPerCustomer = costPerCustomer * 12;
            monthlyRevenue = subscriptionAmount * customerTotal;
            annualRevenue = (subscriptionAmount * customerTotal) * 12
            monthlyRevenuePerCustomer = subscriptionAmount;
            annualRevenuePerCustomer = subscriptionAmount * 12;
        } else {
            monthlyCostPerCustomer = costPerCustomer / 12;
            annualCostPerCustomer = costPerCustomer;
            monthlyRevenue = (subscriptionAmount * customerTotal) / 12;
            annualRevenue = subscriptionAmount * customerTotal;
            monthlyRevenuePerCustomer = subscriptionAmount / 12;
            annualRevenuePerCustomer = subscriptionAmount;
        }

        totalMonthlyCost = monthlyCostPerCustomer * customerTotal;
        totalAnnualCost = annualCostPerCustomer * customerTotal;

        netMonthlyProfit = monthlyRevenue - totalMonthlyCost;
        netAnnualProfit = annualRevenue - totalAnnualCost;

        netMonthlyProfitPerCustomer = netMonthlyProfit / customerTotal;
        netAnnaulProfitPerCustomer = netAnnualProfit / customerTotal;

        results.innerHTML = `
        <div class="px-5 md:px-0">
            <h3 class="text-2xl mb-5">Results</h3>
            <p class="mb-5">If you charge <strong class="text-2xl text-emerald-400">${customerTotal}</strong> customers <strong class="text-2xl text-emerald-400">$${subscriptionAmount}</strong> per ${subscriptionAmountPeriodOption === 'monthly' ? `month` : 'year'}, you will pay fees of <strong class="text-2xl text-emerald-400">$${ thousands_separators(totalMonthlyCost.toFixed(2))}</strong> per month, which is <strong class="text-2xl text-emerald-400">$${ thousands_separators(totalAnnualCost.toFixed(2))}</strong> annually.</p>
            <p>This will give you a total profit of <strong class="text-2xl text-emerald-400">$${ thousands_separators(netMonthlyProfit.toFixed(2))}</strong> per month and <strong class="text-2xl text-emerald-400">$${ thousands_separators(netAnnualProfit.toFixed(2))}</strong> per year, minus fees.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-4 mt-10">
            <div class="bg-slate-200 p-5">
                <h4 class="text-xl font-bold mb-5">Gross Revenue</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-slate-50 border border-slate-100 p-5">
                        <h5 class="text-lg mb-5 font-bold">Monthly</h5>
                        <div class="mb-5">
                            <div class="text-sm">Total</div>
                            <div class="text-emerald-400 font-bold text-base md:text-xl">$${ thousands_separators(monthlyRevenue.toFixed(2))}</div>
                        </div>
                        <div>
                            <div class="text-sm">Per Customer</div>
                            <div class="text-emerald-400 font-bold text-base md:text-xl">$${ thousands_separators(monthlyRevenuePerCustomer.toFixed(2))}</div>
                        </div>
                    </div>
                    <div class="bg-slate-50 border border-slate-100 p-5">
                        <h5 class="text-lg mb-5 font-bold">Annually</h5>
                        <div class="mb-5">
                            <div class="text-sm">Total</div>
                            <div class="text-emerald-400 font-bold text-base md:text-xl">$${ thousands_separators(annualRevenue.toFixed(2))}</div>
                        </div>
                        <div>
                            <div class="text-sm">Per Customer</div>
                            <div class="text-emerald-400 font-bold text-base md:text-xl">$${ thousands_separators(annualRevenuePerCustomer.toFixed(2))}</div>
                        </div>
                    </div>
                </div>
            </div> 
            <div class="bg-slate-200 p-5">
                <h4 class="text-xl font-bold mb-5">Net Profit</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-slate-50 border border-slate-100 p-5">
                        <h5 class="text-lg mb-5 font-bold">Monthly</h5>
                        <div class="mb-5">
                            <div class="text-sm">Total</div>
                            <div class="text-emerald-400 font-bold text-base md:text-xl">$${ thousands_separators(netMonthlyProfit.toFixed(2))}</div>
                        </div>
                        <div>
                            <div class="text-sm">Per Customer</div>
                            <div class="text-emerald-400 font-bold text-base md:text-xl">$${ thousands_separators(netMonthlyProfitPerCustomer.toFixed(2))}</div>
                        </div>
                    </div>
                    <div class="bg-slate-50 border border-slate-100 p-5">
                        <h5 class="text-lg mb-5 font-bold">Annually</h5>
                        <div class="mb-5">
                            <div class="text-sm">Total</div>
                            <div class="text-emerald-400 font-bold text-base md:text-xl">$${ thousands_separators(netAnnualProfit.toFixed(2))}</div>
                        </div>
                        <div>
                            <div class="text-sm">Per Customer</div>
                            <div class="text-emerald-400 font-bold text-base md:text-xl">$${ thousands_separators(netAnnaulProfitPerCustomer.toFixed(2))}</div>
                        </div>
                    </div>
                </div>                
            </div> 
            <div class="bg-slate-200 p-5">
                <h4 class="text-xl font-bold mb-5">Fees Payable</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-slate-50 border border-slate-100 p-5">
                        <h5 class="text-lg mb-5 font-bold">Monthly</h5>
                        <div class="mb-5">
                            <div class="text-sm">Total</div>
                            <div class="text-emerald-400 font-bold text-base md:text-xl">$${ thousands_separators(totalMonthlyCost.toFixed(2))}</div>
                        </div>
                        <div>
                            <div class="text-sm">Per Customer</div>
                            <div class="text-emerald-400 font-bold text-base md:text-xl">$${ thousands_separators(monthlyCostPerCustomer.toFixed(2))}</div>
                        </div>
                    </div>
                    <div class="bg-slate-50 border border-slate-100 p-5">
                        <h5 class="text-lg mb-5 font-bold">Annually</h5>
                        <div class="mb-5">
                            <div class="text-sm">Total</div>
                            <div class="text-emerald-400 font-bold text-base md:text-xl">$${ thousands_separators(totalAnnualCost.toFixed(2))}</div>
                        </div>
                        <div>
                            <div class="text-sm">Per Customer</div>
                            <div class="text-emerald-400 font-bold text-base md:text-xl">$${ thousands_separators(annualCostPerCustomer.toFixed(2))}</div>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
        `;
    }

    let printButton = document.querySelector('.print');

    printButton.addEventListener('click', () => {
        window.print();
    });

    let emailButton = document.querySelector('.email');

    emailButton.addEventListener('click', () => {
        let emailLink = encodeURIComponent(window.location.href);
        let subject = document.title;

        var mailToLink = `mailto:?subject=${subject}&body=${emailLink}`;
        window.location.href = mailToLink;
    });

    let shareButton = document.querySelector('.share');

    shareButton.addEventListener('click', () => {
        let tempInput = document.createElement('input');
        tempInput.style = "position: absolute; left: -1000px; top: -1000px";
        tempInput.value = window.location.href;
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, 99999);
        document.execCommand("copy");
        alert(`Copied the shareable link \n${tempInput.value} \nto your clipboard.`);
        document.body.removeChild(tempInput);
    });

    copyCat('.subscription-amount-input', '.subscription-amount-input-slider-range', 'amount');
    copyCat('.customer-total-input', '.customer-total-input-slider-range', 'customers');
    copyCat('.fixed-fee-input', '.fixed-fee-input-slider-range', 'fixed');
    copyCat('.percent-fee-input', '.percent-fee-input-slider-range', 'percent');
    calculate();
})();
/* =========================================
   DEMO DATA
========================================= */

const demoData = {

    revenue: 1248500,

    customers: 4372,

    orders: 18560,

    avgOrder: 67.27,

    countries: [

        ["United Kingdom", 100],

        ["Germany", 72],

        ["France", 61],

        ["Netherlands", 48],

        ["Spain", 39],

        ["Australia", 34]

    ]

};


/* =========================================
   LOAD PREDICTIONS
========================================= */

let predictions =
    JSON.parse(
        localStorage.getItem("ltvPredictions") || "[]"
    );


/* =========================================
   CURRENCY FORMAT
========================================= */

function formatCurrency(value) {

    return new Intl.NumberFormat(

        "en-IN",

        {

            style: "currency",

            currency: "INR",

            maximumFractionDigits: 2

        }

    ).format(value);

}


/* =========================================
   DASHBOARD
========================================= */

function renderDashboard() {


    document.getElementById(
        "totalRevenue"
    ).textContent =
        demoData.revenue.toLocaleString(
            "en-IN"
        );


    document.getElementById(
        "totalCustomers"
    ).textContent =
        demoData.customers.toLocaleString(
            "en-IN"
        );


    document.getElementById(
        "totalOrders"
    ).textContent =
        demoData.orders.toLocaleString(
            "en-IN"
        );


    document.getElementById(
        "avgOrder"
    ).textContent =
        demoData.avgOrder.toFixed(2);


    /* Country chart */

    const chart =
        document.getElementById(
            "countryChart"
        );


    chart.innerHTML =
        demoData.countries.map(
            ([name, value]) => `

                <div class="chart-row">

                    <span>
                        ${name}
                    </span>

                    <div class="chart-track">

                        <span
                            class="chart-fill"
                            style="width:${value}%">
                        </span>

                    </div>

                    <b>
                        ${value}%
                    </b>

                </div>

            `
        ).join("");


    updateSegmentCounts();

}


/* =========================================
   LTV CALCULATION
========================================= */

function calculateLTV(
    recency,
    frequency,
    monetary
) {

    /*
        IMPORTANT:

        This is a FRONT-END demonstration.

        It does NOT load your
        ltv_model.pkl file.

        Your real project should send
        these values to a Python backend/API.
    */


    const predicted = Math.max(

        0,

        500

        - (20 * recency)

        + (600 * frequency)

        + (2 * monetary)

    );


    return predicted;

}


/* =========================================
   CUSTOMER SEGMENT
========================================= */

function getSegment(
    ltv,
    frequency
) {

    if (ltv > 10000) {

        return "VIP Customer";

    }


    if (frequency > 5) {

        return "Loyal Customer";

    }


    return "Regular Customer";

}


/* =========================================
   HISTORY
========================================= */

function renderHistory() {


    const body =
        document.getElementById(
            "historyBody"
        );


    if (predictions.length === 0) {

        body.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-table">

                    No predictions yet.

                </td>

            </tr>

        `;


        updateSegmentCounts();

        renderTopCustomers();

        return;

    }


    body.innerHTML =

        predictions.map(

            item => `

                <tr>

                    <td>
                        ${escapeHtml(item.name)}
                    </td>

                    <td>
                        ${item.recency}
                    </td>

                    <td>
                        ${item.frequency}
                    </td>

                    <td>
                        ${formatCurrency(item.monetary)}
                    </td>

                    <td>
                        ${formatCurrency(item.ltv)}
                    </td>

                    <td>

                        <span
                            class="segment-badge">

                            ${item.segment}

                        </span>

                    </td>

                </tr>

            `

        ).join("");


    updateSegmentCounts();

    renderTopCustomers();

}


/* =========================================
   SEGMENT COUNTS
========================================= */

function updateSegmentCounts() {


    const counts = {

        "VIP Customer": 0,

        "Loyal Customer": 0,

        "Regular Customer": 0

    };


    predictions.forEach(

        item => {

            counts[item.segment]++;

        }

    );


    document.getElementById(
        "vipCount"
    ).textContent =
        counts["VIP Customer"];


    document.getElementById(
        "loyalCount"
    ).textContent =
        counts["Loyal Customer"];


    document.getElementById(
        "regularCount"
    ).textContent =
        counts["Regular Customer"];

}


/* =========================================
   TOP CUSTOMERS
========================================= */

function renderTopCustomers() {


    const container =
        document.getElementById(
            "topCustomers"
        );


    if (!predictions.length) {

        container.innerHTML = `

            <p style="color:#94a3b8">

                Create predictions to see
                customer insights.

            </p>

        `;

        return;

    }


    const sorted =

        [...predictions]

            .sort(
                (a, b) =>
                    b.ltv - a.ltv
            )

            .slice(0, 5);


    container.innerHTML =

        sorted.map(

            (item, index) => `

                <div class="customer-card">

                    <div>

                        <small>
                            #${index + 1}
                        </small>

                        <br>

                        <b>
                            ${escapeHtml(item.name)}
                        </b>

                    </div>


                    <span
                        class="segment-badge">

                        ${item.segment}

                    </span>


                    <strong>

                        ${formatCurrency(
                            item.ltv
                        )}

                    </strong>

                </div>

            `

        ).join("");

}


/* =========================================
   SECURITY
========================================= */

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================
   NAVIGATION
========================================= */

document
    .querySelectorAll(".nav-item")
    .forEach(

        button => {

            button.addEventListener(
                "click",
                () => {


                    const pageId =
                        button.dataset.page;


                    /*
                        Remove active
                        from navigation
                    */

                    document
                        .querySelectorAll(
                            ".nav-item"
                        )
                        .forEach(

                            item =>

                                item.classList
                                    .remove(
                                        "active"
                                    )

                        );


                    /*
                        Hide all pages
                    */

                    document
                        .querySelectorAll(
                            ".page"
                        )
                        .forEach(

                            page =>

                                page.classList
                                    .remove(
                                        "active-page"
                                    )

                        );


                    /*
                        Activate selected
                        navigation button
                    */

                    button.classList.add(
                        "active"
                    );


                    /*
                        Display selected
                        page
                    */

                    document
                        .getElementById(
                            pageId
                        )
                        .classList.add(
                            "active-page"
                        );

                }

            );

        }

    );


/* =========================================
   PREDICTION FORM
========================================= */

document
    .getElementById(
        "predictionForm"
    )
    .addEventListener(

        "submit",

        event => {

            event.preventDefault();


            /* Get input */

            const name =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


            const recency =
                Number(
                    document
                        .getElementById(
                            "recency"
                        )
                        .value
                );


            const frequency =
                Number(
                    document
                        .getElementById(
                            "frequency"
                        )
                        .value
                );


            const monetary =
                Number(
                    document
                        .getElementById(
                            "monetary"
                        )
                        .value
                );


            /* Validation */

            if (

                !name ||

                recency < 0 ||

                frequency < 1 ||

                monetary < 0

            ) {

                return;

            }


            /* Calculate LTV */

            const ltv =

                calculateLTV(

                    recency,

                    frequency,

                    monetary

                );


            /* Customer segment */

            const segment =

                getSegment(

                    ltv,

                    frequency

                );


            /* Create prediction */

            const prediction = {

                name,

                recency,

                frequency,

                monetary,

                ltv,

                segment

            };


            /* Save */

            predictions.unshift(
                prediction
            );


            localStorage.setItem(

                "ltvPredictions",

                JSON.stringify(
                    predictions
                )

            );


            /* Show result */

            document
                .getElementById(
                    "predictionResult"
                )
                .innerHTML = `

                    <div>
                        Predicted Customer LTV
                    </div>

                    <div class="result-value">

                        ${formatCurrency(
                            ltv
                        )}

                    </div>

                    <div
                        class="segment-badge">

                        ${segment}

                    </div>

                    <p
                        style="
                            margin-top:14px;
                            color:#94a3b8;
                            font-size:12px
                        ">

                        Based on:

                        Recency ${recency},

                        Frequency ${frequency},

                        Monetary
                        ${formatCurrency(
                            monetary
                        )}.

                    </p>

                `;


            renderHistory();

        }

    );


/* =========================================
   CLEAR HISTORY
========================================= */

document
    .getElementById(
        "clearHistory"
    )
    .addEventListener(

        "click",

        () => {


            predictions = [];


            localStorage.removeItem(
                "ltvPredictions"
            );


            renderHistory();


            document
                .getElementById(
                    "predictionResult"
                )
                .innerHTML =

                `

                    Prediction history cleared.

                    Enter customer details
                    to create a new prediction.

                `;

        }

    );


/* =========================================
   INITIAL LOAD
========================================= */

renderDashboard();

renderHistory();
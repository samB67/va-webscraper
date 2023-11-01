const puppeteer = require("puppeteer");

// Url to scrape
const url = 'https://travelplus.virginatlantic.com/reward-flight-finder/results/month?origin=LHR&destination=PVG&airline=VS&month=02&year=2024';

const getFlightData = async () => {
    // Start a Puppeteer session with:
    // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
    // - no default viewport (`defaultViewport: null` - website page will in full width and height)
    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: null,
    });

    // Open a new page
    const page = await browser.newPage();

    // On this new page:
    // - open the "virgin atlantic reward seat checker website" website
    // - wait until the dom content is loaded (HTML is ready)
    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });

    await page.waitForSelector('article.css-1f0ownv', { timeout: 5_000 });

    // Get page data
    const getAvailabilityData = await page.evaluate(() => {
        // Fetch the first element with class "calenderDays"
        const dataList = [];
        const calenderDays = document.querySelectorAll("article.css-1f0ownv");

        calenderDays.forEach((element) => {
            let upperClassSeatsAvailable = 0;

            if (element.querySelector("dd.typography-module_typography__tRw6N.typography-module_body__XyDQs.typography-module_body-weight--regular__BD--X.typography-module_body-size--x-small__UlSUx") !== null) {
                upperClassSeatsAvailable = +element.querySelector("dd.typography-module_typography__tRw6N.typography-module_body__XyDQs.typography-module_body-weight--regular__BD--X.typography-module_body-size--x-small__UlSUx").innerText;
            }

            if (upperClassSeatsAvailable > 0) {
                dataList.push({
                    'date': element.querySelector(".typography-module_typography__tRw6N").innerText,
                    'badge': element.querySelector(".badge-module_badge-label__L--KV").innerText,
                    'upperClassSeats': upperClassSeatsAvailable
                });
            }
        });

        return dataList;
    });

    // Display the getAvailabilityData
    console.log(getAvailabilityData);

    // Close the browser
    await browser.close();
};

// Start the scraping
getFlightData();
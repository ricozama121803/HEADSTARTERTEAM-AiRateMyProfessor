import { selectAll, selectOne } from "css-select";
import { parseDocument } from "htmlparser2";
import { chromium } from "playwright";

const adNetworkPatterns = [
    '**/*doubleclick.net/**',
    '**/*googleadservices.com/**',
    '**/*googlesyndication.com/**',
    // Add more patterns as needed
].map(pattern => {
    return new RegExp(
        pattern
            .replace(/\*\*/g, '.*')
            .replace(/\*/g, '[^/]*')
            .replace(/\./g, '\\.')
    );
});

const parseInfoHtml = async (teacherInfo) => {
    const dom = parseDocument(teacherInfo);

    const getText = (element) => {
        if (element.type === 'text') return element.data;

        if (element.children) return element.children.map(getText).join('').trim();
        return '';
    };

    // Extract professor's name
    const nameElement = selectOne('.NameTitle__Name-dowf0z-0', dom);
    const firstName = getText(selectOne('span', nameElement));
    const lastName = getText(selectOne('.NameTitle__LastNameWrapper-dowf0z-2', nameElement)).split(' ')[0];
    const fullName = `${firstName} ${lastName}`;

    // Extract average rating
    const avgRating = getText(selectOne('.RatingValue__Numerator-qw8sqy-2', dom));

    // Extract "Would take again" percentage
    const wouldTakeAgain = getText(selectOne('.FeedbackItem__FeedbackNumber-uof32n-1', dom));

    // Extract difficulty levelc
    const difficultyLevel = getText(selectAll('.FeedbackItem__FeedbackNumber-uof32n-1', dom)[1]);

    // Extract top tags
    const tags = selectAll('.Tag-bs9vf4-0', dom).map(getText);

    return {
        name: fullName,
        averageRating: avgRating,
        wouldTakeAgain: wouldTakeAgain,
        difficultyLevel: difficultyLevel,
        topTags: tags
    };
};

async function scrapeRMP(rmpLink){
    let browser;
    let teacherInfoHtml;

    console.time('scraping')
    try{
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        page.setDefaultNavigationTimeout(2 * 60 * 1000);

        // Use route() to intercept and block certain types of resources and ad network requests
        await page.route('**/*', (route) => {
            const requestUrl = route.request().url();
            const resourceType = route.request().resourceType();

            // Check if the request is for an ad network
            const isAdRequest = adNetworkPatterns.some(pattern => requestUrl.match(pattern));

            if (['image', 'stylesheet', 'font'].includes(resourceType)|| isAdRequest) {
                route.abort();
            } else {
                route.continue();
            }
        });

        await page.goto(link);
        teacherInfoHtml = await page.evaluate(async () => {
            return document.querySelector('.TeacherInfo__StyledTeacher-ti1fio-1.kFNvIp').innerHTML
        });
    } catch(e) {
        console.error('scrape-failed', e);

    } finally {
        await browser?.close();
    }
    console.timeEnd('scraping');

    console.log(teacherInfoHtml);

    console.time('parsing scraped html');
    const teacherInfo = await parseInfoHtml(teacherInfoHtml);
    console.timeEnd('parsing scraped html');

    console.log(info);
};

export default scrapeRMP;

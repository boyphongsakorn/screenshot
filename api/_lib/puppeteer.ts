import { launch, Page } from "puppeteer-core";
import chrome from "chrome-aws-lambda";
import fetch from 'node-fetch';
let _page: Page | null;

async function getPage() {
    if (_page) return _page;
    const options = {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
    };
    const browser = await launch(options);
    _page = await browser.newPage();
    return _page;
}

export async function getScreenshot(url, width, height, havelot, date) {
    const page = await getPage();
    if (havelot) {
        let datecheck
        if (date) {
            datecheck = date;
        } else {
            let date = new Date().getDate();
            let month = new Date().getMonth() + 1;
            let year = new Date().getFullYear();
            let byear = year + 543;
            let bmonth = month < 10 ? "0" + month : month;
            datecheck = date + '' + bmonth + '' + byear;
        }
        const response = await fetch('https://lotapi.pwisetthon.com/?date=' + datecheck);
        const test = await response.json();
        let monthtext;
        switch (datecheck.substring(2, 4)) {
            case '01': monthtext = "มกราคม"; break;
            case '02': monthtext = "กุมภาพันธ์"; break;
            case '03': monthtext = "มีนาคม"; break;
            case '04': monthtext = "เมษายน"; break;
            case '05': monthtext = "พฤษภาคม"; break;
            case '06': monthtext = "มิถุนายน"; break;
            case '07': monthtext = "กรกฎาคม"; break;
            case '08': monthtext = "สิงหาคม"; break;
            case '09': monthtext = "กันยายน"; break;
            case '10': monthtext = "ตุลาคม"; break;
            case '11': monthtext = "พฤศจิกายน"; break;
            case '12': monthtext = "ธันวาคม"; break;
        }
        await page.setContent('<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="https://fonts.googleapis.com/css2?family=Mitr&family=Noto+Sans+Thai&display=swap" rel="stylesheet"><style>body{font-family: \'Mitr\', \'Noto Sans Thai\', sans-serif;background-image: url(\'https://lotimg.pwisetthon.com/fbbg\');color: white;}</style></head><h1 style="margin-top: 135px;margin-left: 180px;font-size: 80px;margin-bottom: 0px;">ผลรางวัลสลากกินแบ่งรัฐบาล</h1><h2 style="font-size: 50px;margin-right: 590px;text-align: right;margin-top: -10px;margin-bottom: 0px;">เมื่อประจำวันที่ ' + parseInt(datecheck.substring(0, 2)) + ' ' + monthtext + ' ' + datecheck.substring(4, 8) + '</h2><h2 style="font-size: 80px;margin-left: 450px;margin-top: 25px;margin-bottom: 0px;">รางวัลที่ 1</h2><h2 style="font-size: 11.25vw;margin-left: 190px;margin-top: -65px;margin-right: 650px;text-align: center;margin-bottom: 0px;">' + test[0][1] + '</h2><h2 style="margin-left: 1095px;margin-top: -285px;font-size: 50px;margin-bottom: 15px;">เลขท้าย สองตัว</h2><h2 style="margin-left: 1120px;font-size: 150px;margin-top: -45px;margin-bottom: 0px;">' + test[3][1] + '</h2><h2 style="margin-top: -20px;margin-left: 325px;font-size: 60px;margin-bottom: 0px;">เลขหน้า สามตัว</h2><h2 style="font-size: 5.7vw;margin-left: 260px;margin-top: -15px;">' + test[1][1] + ' | ' + test[1][2] + '</h2><h2 style="margin-left: 875px;margin-top: -300px;font-size: 60px;margin-bottom: 0px;">เลขท้าย สามตัว</h2><h2 style="font-size: 5.7vw;margin-left: 805px;max-width: 475px;margin-top: -15px;">' + test[2][1] + ' | ' + test[2][2] + '</h2>');
    } else {
        await page.goto(url);
    }
    await page.setViewport({
        width: Number(width) || 1600,
        height: Number(height) || 1066,
    });
    let secondtowaiting = 0;
    //if havelot is true, it will wait for 5 seconds
    if (havelot) {
        secondtowaiting = 5;
    }else{
        secondtowaiting = 6;
    }
    await page.waitFor(secondtowaiting*1000);
    const file = await page.screenshot();
    return file;
}

require("dotenv").config();
const pw = require("playwright");
const cron = require("node-cron");

const day = new Date();
let today = `${(day.getMonth() + 1)}_${day.getDate()}`;

const Attendance = async (click_mode) => {

	if (click_mode !== "出勤" && click_mode !== "退勤") {
		console.log("click_mode error");
		return 0;
	}

	const browser = await pw.chromium.launch();
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("https://s2.kingtime.jp/independent/recorder/personal/");

	await page.type("#id", process.env.ID);
	await page.type("#password", process.env.PASS);
	await page.click(".btn-control-message");

	await page.click(`text=${click_mode}`);

	await page.waitForTimeout(2000);

	await page.screenshot({ path: `./img/${click_mode}_${today}.png` });

	await browser.close();
};


cron.schedule('0 55 9 * * *', () => {
  console.log("running!!");
  Attendance("出勤");
})

cron.schedule('0 05 19 * * *', () => {
  console.log("running!!");
  Attendance("退勤");
})

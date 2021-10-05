let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let driver = new webdriver.Builder().forBrowser('chrome').build();

// testing online calculator's basic arithmetic operations
// first and second numbers are generated (can be fractional)
// test cycles through all 4 basic operations
// NOTE: calculator output displays only 12 digits (not including sign)
(async function testRun() {
    let ops = ['+', '-', '*', '/'];
    let result = 'N/A';
    for (let i = 0; i < 4; i++) {
        let first = (Math.random() * 10000) + 1;
        let second = (Math.random() * 10000) + 1;
        let operation = ops[i];
        switch (operation) {
            case '+': result = first + second; break;
            case '-': result = first - second; break;
            case '*': result = first * second; break;
            case '/': result = first / second; break;
            default: throw 'Error: no operation set for testing';}
        let dotPos = result.toString().indexOf('.');
        // this rounds the result so that it's length to be <= 12 (not including sign)
        switch (result.toString()[0]) {
            case '-':
                result = Math.round((result + Number.EPSILON)
                    * Math.pow(10, (13 - dotPos - 1))) / Math.pow(10, (13 - dotPos - 1)); break;
            default:
                result = Math.round((result + Number.EPSILON)
                    * Math.pow(10, (12 - dotPos - 1))) / Math.pow(10, (12 - dotPos - 1));
        }
        await basicOps(first, second, operation);

    }

    async function basicOps(f, s, op) {
        driver.get('https://www.calculator.net/');
        let fStr = f.toString();
        let sStr = s.toString();
        for (const el of fStr) {
            switch (el) {
                case '.':
                    await driver.findElement(By.xpath("//span[@onclick=\"r('.')\"]"))
                        .click(); break;
                default:
                    await driver.findElement(By.xpath("//span[@onclick='r(" + el + ")']"))
                        .click();
            } }
        driver.findElement(By.xpath("//span[@onclick=\"r('" + op + "')\"]"))
            .click();
        for (const el of sStr) {
            switch (el) {
                case '.':
                    await driver.findElement(By.xpath("//span[@onclick=\"r('.')\"]"))
                        .click(); break;
                default:
                    await driver.findElement(By.xpath("//span[@onclick='r(" + el + ")']"))
                        .click();
            } }
        await driver.findElement(By.xpath("//span[@onclick=\"r('=')\"]"))
            .click();
        let output = driver.findElement(By.css("div#sciOutPut"));
        await driver.wait(until.elementTextIs(output, ' ' + result), 5000);
        await output.getText().then((txt) => {
            console.log(f + ' ' + op + ' ' + s + ' = ' + txt + '  | correct');
        })
    }


})();

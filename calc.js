let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let driver = new webdriver.Builder().forBrowser('chrome').build();


// testing online calculator's basic arithmetic operations (+, -, *, /)
// first and second numbers are generated as integers (1 to 9)
// test cycles through all four basic operations
(async function testRun() {
    let ops = ['+', '-', '*', '/'];
    let result = 'N/A';
    for (let i = 0; i < 4; i++) {
        let first = Math.floor((Math.random() * 9) + 1);
        let second = Math.floor((Math.random() * 9) + 1);
        let operation = ops[i];
        switch (operation) {
            case '+': result = first + second; break;
            case '-': result = first - second; break;
            case '*': result = first * second; break;
            case '/': result = first / second; break;
            default: throw 'Error: no operation set for testing';}
        result = Math.round((result + Number.EPSILON) * 10000000000) / 10000000000;
        await basicOps(first, second, operation);
    }

    async function basicOps(f, s, op) {
        driver.get('https://www.calculator.net/');
        driver.findElement(By.xpath("//span[@onclick='r(" + f + ")']"))
            .click();
        driver.findElement(By.xpath("//span[@onclick=\"r('" + op + "')\"]"))
            .click();
        driver.findElement(By.xpath("//span[@onclick='r(" + s + ")']"))
            .click();
        driver.findElement(By.xpath("//span[@onclick=\"r('=')\"]"))
            .click();
        let output = driver.findElement(By.css("div#sciOutPut"));

        await driver.wait(until.elementTextIs(output, ' ' + result), 5000);
        await output.getText().then((txt) => {
            console.log(f + ' ' + op + ' ' + s + ' = ' + txt + '  | correct');
        })
    }


})();

LOLOLOLOL


# Test Automation UI&API project

Test Automation project for testing web applications and APIs

## Project Description
This Project was done by using the `Playwright Test Automation Framework` using TypeScript for both UI E2E testing and for API testing.

The API project was done on the petstore APIs.


The UI project was done on a React Big Scheduler infinite scroll UI website.

petstore APIs - https://petstore.swagger.io/?fbclid=IwAR0IJGoXI4F2sWcQ3S-7ukN9KOdDgGp-m2V9Ih2KaCOPEFVEYBBJjK95x1Y#/
 
 React Big Scheduler examples- https://stephenchou1017.github.io/scheduler/#/infinitescroll 

## Clone Project

Clone the project by opening the terminal in your code IDE and run the following command:

```bash
  git clone https://github.com/RomarioNijimAlmond/Playwright-api-ui.git
```

Navigate to the project directory

```bash
  cd automation
```





## Installation

Install dependencies

```bash
  npm ci
```

Install Playwright browsers
```bash
  npx playwright Install
```
    
## Running Tests

To run the api tests - navigate to the api directory

```bash
  cd api
```

Inside the Api directory you have two folders

* petstore
* users

each folder contains spec files - open the desired spec file.

In order to run a specific spec folder, you have two options:

* using vscode - you can install the extension: `Playwright Test for VSCode` - you click on the play button in the relevant test file that you choose.
* open a test spec file and type .only in the test.describe hook as follows:

```bash
  test.describe.only('sanity api tests for the pet store api ', async () => {
```
* dont forget to remove the `.only` when your done!
  
open a terminal in your IDE in the same directory where the tests are located and run the following command to ru all of the tests in the correct order:
```bash
  npx playwright test --workers=1
```

To run the UI tests - navigate to the ui directory and the run the tests the same way as explanied above.
```bash
  cd ui
```

Inside the UI folder you'll have two folders:
* pages - which contains the infra of the tested app with it's page objects
* tests - where the tests are written and run

The rest of the project folders contain folders for all of the project's infra such as:
* common
* helpers
* interfaces
* navigation enums

## Contributing

Contributions are always welcome!

You can fork the project and submit a PR that will under go a code review.

## Feedback

I hope you enjoyed my project, If you have any feedback, please reach out to me at romario.nijim11@gmail.com

## Notes

* some of the API endpoints for the petstore responds with an invalid response when performing negative testing methods
* the tests that contain these invalid responses have a `fixme` keyword near the test hook - these tests will be skipped inc ase running in CI untill they are fixed, if you wanna run these tests, make sure you remove the `fixme` keyword.
* the tests that involves the React Big Schedular fails due to the fact that the website is not stable to perform automated tests on it - there were many issues found that prevented from the tests to pass due to the website's bugs, without these bugs, the tests would pass.
* issues found:
  * when first entering the month in the infinite scroll and you choose a specific month such as August - it then displays October (reproduces manually as well) - for a workaround you'll need to choose your desired date again. 
  * the cell values in the schedular in an automated environment are not clickable (you can try to reproduce it manually when the browser is in automated mode - tried different techniques such as scrolling into view, applying focus, searching if it is inside an iframe, and many more different element manipulations)
  * the schedular does not save your created events which lacks the core functionality of the scheduler.
  * the displayed date keeps between months on every movement on the page which makes very unstable - the same goes for the date view, everytime you displayt he same date it always gives you a different view which can interfere with the test validations
 


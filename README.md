# User-Wallet


## Instructions to install and configure prerequisites or dependencies, if any.
In the project directory, you can run:

`yarn install`
To install all dependencies

## Instructions to build and run source code.

`yarn start`
To run the app in the development mode.
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

`yarn test`
To launch the test runner in the interactive watch mode.

`yarn build`
To builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.


## Your thought process and assumptions you have made if any.

I have assumed that the use case of the application is to enable people send money to their friends with ease, hence all copy is targeted at friends.
The goal of this was to put together a visually appealing UI while providing the needed functionality.


## Requirements that you have not covered in your submission if any.

End-to-testing 


## Issues you have faced while completing the assignment if any.

Given that the base currency of the exchange rates API is EUR, and that of the wallet is USD, this posed a problem because the rates provided by the API couldn't be used directly. 
I solved this by converting the rates from the EUR base currency to USD, and creating a new `rates object` with my values. Afterwards I was able to use it with ease.

I struggled with selecting the right illustrations for the application, it took a while to find the ones that gave the aesthetic I was looking for.

const express = require('express');
const { ExpressError } = require('./expressError');

const app = express();

app.use(express.json());

function makeArray(nums) {
    //utilized solution https://stackoverflow.com/questions/15677869/how-to-convert-a-string-of-numbers-to-an-array-of-numbers

    let madeArray = nums.split(`,`).map(x => +x);
    return madeArray;
}

function getMean(nums) {
    let sum = 0;

    for (let num of nums) {
        sum += num;
    };

    return sum / nums.length;
};

function getMedian(nums) {
    nums.sort(function (a, b) {
        return a - b;
    });
    let middleOfNums = Math.floor(nums.length / 2);
    if (nums.length % 2 === 0) {
        return (nums[middleOfNums - 1] + nums[middleOfNums]) / 2;
    }
    else if (nums.length === 0) {
        return 0;
    }
    else {

        return nums[middleOfNums];
    }
};

//Utilized this solution: https://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
function getMode(nums) {

    return nums.slice().sort((a, b) =>
        nums.filter(v => v === a).length
        - nums.filter(v => v === b).length
    ).pop();

};


app.get('/mean', function (req, res, next) {

    let { nums } = req.query;
    let validArray = nums.split(`,`).map(x => +x);

    let valid = validArray.every((x) => !(Number.isNaN(x)));

    if (valid) {
        let numArray = makeArray(nums);

        let response = {
            operation: "mean",
            value: getMean(numArray)
        };
        return res.json(response);
    }
    else {
        const e = new ExpressError("Bad request: Not a number", 400);
        next(e);
    }
});


app.get('/median', function (req, res, next) {

    const { nums } = req.query;

    let validArray = nums.split(`,`).map(x => +x);

    let valid = validArray.every((x) => !(Number.isNaN(x)));

    if (valid) {
        let numArray = makeArray(nums);

        let response = {
            operation: "median",
            value: getMedian(numArray)
        };
        return res.json(response);
    }
    else {
        const e = new ExpressError("Bad request: Not a number", 400);
        next(e);
    }
});

app.get('/mode', function (req, res, next) {

    const { nums } = req.query;

    let validArray = nums.split(`,`).map(x => +x);

    let valid = validArray.every((x) => !(Number.isNaN(x)));

    if (valid) {
        let numArray = makeArray(nums);

        let response = {
            operation: "mode",
            value: getMode(numArray)
        };
        return res.json(response);
    }
    else {
        const e = new ExpressError("Bad request: Not a number", 400);
        next(e);
    }

});


// If no other route matches, respond with a 404
app.use((req, res, next) => {

    const e = new ExpressError("Page Not Found", 404);
    next(e);
})

// Error handler
app.use(function (err, req, res, next) { //Note the 4 parameters!
    // the default status is 500 Internal Server Error

    let status = err.status || 500;
    let message = err.msg;

    // set the status and alert the user
    return res.status(status).json({
        error: { message, status }
    });
});

app.listen(3000, function () {
    console.log('Server is listening on port 3000');
});
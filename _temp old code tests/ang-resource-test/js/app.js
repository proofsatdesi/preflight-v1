/*
	• going to need to change die-lookup to part-number lookup for sheet calc.
	
	• sheet calc will simply be a preflight task

	• anatomy of a preflightTask:
		- gets called with a single argment: jobOB, which is the base object returned by querying for a job number
		- returns an array of objects:
			{
				description: "string containing text about what task tests",
				test: function(jobOb) {
					// run all tests on jobOb here...
					// 		sheetCalc test could iterate through runs field, calculating sheets for each
					//		and return an array of objects (one for each run) that look like:
					//		{type: "info", msg: "run A requires a total of 50 sheets, which is 100 labels."}
					return [{
						type: "primary, success, info, warning, danger",
						msg: "actual text of the message goes here"
					}];
				}
			}
	• tasks is an array of preflightTask objects
	• preflight iterates over tasks, calling the test field of each element, passing in an object which encapsulates the job
	• preflight returns an array of all the message objects returned by the individual preflightTasks
	• the message array is displayed with appropriate styling in the view
*/

// disembodied die list stuff...test code:
function sheetCalcConfig(numUp, overageMultiplier, overageMinimum) {
	return {
		"numUp": numUp,
		"overageMultiplier": overageMultiplier,
		"overageMinimum": overageMinimum
	};
};
var twoUpReg = sheetCalcConfig(2, 1.17, 22);
var oneUpReg = sheetCalcConfig(1, 1.17, 22);
var fourUpReg = sheetCalcConfig(4, 1.17, 22);
var fourUpExpensive = sheetCalcConfig(4, 1.05, 5);
var twoUpGuilltine = sheetCalcConfig(2, 1.01, 15);

var dieSheetCalcConfigs = {
	"5321": twoUpReg,
	"6104": twoUpReg,
	"5427": twoUpReg,
	"6103": twoUpReg,
	"5023": twoUpReg,
	"5970": twoUpReg,
	"5741": twoUpReg,
	"5773": twoUpReg,
	"5427": twoUpReg,
	"6322": twoUpReg,
	"5321": twoUpReg,
	"6024": twoUpReg,
	"5768": twoUpReg,
	"6135": twoUpReg,
	"5375": twoUpReg,
	"5811": twoUpReg,
	"5791": twoUpReg,
	"5790": twoUpReg,
	"5789": twoUpReg,
	"5788": twoUpReg,
	"5787": twoUpReg,
	"5786": twoUpReg,
	"5785": twoUpReg,
	"5772": twoUpReg,
	"5771": twoUpReg,
	"5770": twoUpReg,
	"5769": twoUpReg,
	"6096": twoUpReg,
	"5586": twoUpReg,
	"5432": twoUpReg,
	"5493": twoUpReg,
	"5370": twoUpReg,
	"5369": twoUpReg,
	"5782": twoUpReg,
	"5473": twoUpReg,
	"5324": twoUpReg,
	"5995": twoUpReg,
	"5983": twoUpReg,
	"5980": twoUpReg,
	"5547": twoUpReg,
	"5535": twoUpReg,
	"5407": twoUpReg,
	"5888": twoUpReg,
	"5735": twoUpReg,
	"5777": twoUpReg,
	"6036": twoUpReg,
	"5852": twoUpReg,
	"5298": twoUpReg,
	"5935": twoUpReg,
	"5264": twoUpReg,
	"5265": twoUpReg,
	"5266": twoUpReg,
	"5267": twoUpReg,
	"5268": twoUpReg,
	"5269": twoUpReg,
	"5270": twoUpReg,
	"5271": twoUpReg,
	"5272": twoUpReg,
	"5273": twoUpReg,
	"5437": twoUpReg,
	"5438": twoUpReg,
	"5475": twoUpReg,
	"5311": twoUpReg,
	"5312": twoUpReg,
	"5783": twoUpReg,
	"5352": twoUpReg,
	"5355": twoUpReg,
	"5315": twoUpReg,
	"5314": twoUpReg,
	"5437": twoUpReg,
	"5373": twoUpReg,
	"5310": twoUpReg,
	"5312": twoUpReg,
	"5316": twoUpReg,
	"5313": twoUpReg,
	"5317": twoUpReg,
	"5352": twoUpReg,
	"5322": twoUpReg,
	"5323": twoUpReg,
	"5320": twoUpReg,
	"5319": twoUpReg,
	"5318": twoUpReg,
	"5349": twoUpReg,
	"5345": twoUpReg,
	"5317": twoUpReg,
	"5346": twoUpReg,
	"5373": twoUpReg,
	// 
	"6070": oneUpReg,
	"5488": oneUpReg,
	"6218": oneUpReg,
	"6218": oneUpReg,
	"6060": oneUpReg,
	"5780": oneUpReg,
	"5781": oneUpReg,
	"5579": oneUpReg,
	"6088": oneUpReg,
	"5954": oneUpReg,
	"5429": oneUpReg,
	"5661": oneUpReg,
	"5991": oneUpReg,
	"6085": oneUpReg,
	"5669": oneUpReg,
	// 
	"5983": fourUpReg,
	"5761": fourUpReg,
	// 
	"6158": fourUpExpensive,
	// 
	"0002": twoUpGuilltine
};

var calcSheetsAndLabels = function(runQty, configOb, vinyl) {
	// requires the yet-unimplemented vinyl field, which adds 3%
	var baseSheets = runQty / configOb.numUp;
	var totalSheets = configOb.overageMultiplier * baseSheets;
	var totalLabels;
	
	if (vinyl === true)
		totalSheets *= 1.03;

	if (totalSheets < (configOb.overageMinimum + baseSheets))
		totalSheets = configOb.overageMinimum + baseSheets;

	totalLabels = totalSheets * configOb.numUp;

	return {
		"sheets": totalSheets,
		"labels": totalLabels
	};

};

var jsonpUrl = function(jobNumber) {
	var baseUrl = 'https://desi.com/api/jobtracker/jobs/';
	var callbackSuffix = '?callback=JSON_CALLBACK';

	if (!(parseFloat(jobNumber) > 10000))
		throw new Error('invalid job number passed to jsonpUrl()');

	return baseUrl + jobNumber + callbackSuffix;
};

var totalLabels = function(runObject) {
	if (runObject.quantity === undefined || runObject.spares_qty === undefined) {
		window.console.log(runObject);
		throw new Error('invalid run object passed to totalLabels()');
	}
		

	return runObject.quantity + runObject.spares_qty;
};

var getDieNumber = function(runObject) {
	if (runObject.part_number === undefined)
		throw new Error('invalid runObject passed to getDieNumber');

	window.console.log('currently chris does not know how to access the list of die numbers in the master list');
	window.console.log('getDieNUmber function is just a stub right now!!!!');
	// looking for a way to get a die number from the master list
	var fakeDieNumber = "5741l06";
	return fakeDieNumber.slice(0, 4);
};

var determineVinyl = function(runOb) {
	// this function is currently just a stub!!
	if (runOb.material.search(/v.*l/gi) > -1) {
		window.console.log("vinyl detected.")
		return true;
	} else {
		window.console.log("no vinyl in run!!!")
		return false;
	}
};
var calcRunOvers = function (runOb) {
	return calcSheetsAndLabels(totalLabels(runOb), dieSheetCalcConfigs[getDieNumber(runOb)], determineVinyl(runOb))
};




angular.module('jsonpTester', ['ngResource'])
.controller('mainCtrl', ['$scope','$http', '$window', function($scope, $http, $window) {
	
	
	// 'https://desi.com/api/jobtracker/jobs?callback=JSON_CALLBACK'
	$scope.model = {};
	$scope.model.jobNumber = "";
	$scope.model.textarea = "this is a test string, before the $http service loads any dynamic data.";
	$scope.model.reqJsonp = function() {
	
		$http.jsonp(jsonpUrl($scope.model.jobNumber))

		.success(function(data) {
			var resultString = "";
			data.runs.forEach(function(runOb) {
				var needed = calcRunOvers(runOb);
				resultString += "you need " + needed.sheets + " sheets and " + needed.labels + " labels.\n";
			});
			$scope.model.textarea = resultString;
			window.console.log(data);
		})

		.error(function() {
			$window.console.log("jsonp request didn't work :(");
		});
		
	};
	
}]);
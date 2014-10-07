// TODO refactor all functions to NOT list a footnote argument....
// footnote is something that can returned by the interrogative, in the form of an array of strings.

// var returnMessages = function(runs, test, type, msg, footnote) {

// TODO: test for anybody who calls returnMesages with a footnote argument, and then fix that call!


var is9600Handset = function(runOb) {
	return (runOb.part_number.match(/hdkit/i));
};

var isTabbed = function(runOb) {
	return (runOb.description.match(/tab/i) !== null);
};

/*
The meaning of this function; that special paper and plastic layouts are required to fit an unusual phone
mold being used by VTech, now applies to more thatn just the A1210.
therefore, it seems like a good idea to rename this function from isA1210, to requiresDCHLPaperAndSpecialPlastic
var isA1210 = function(runOb) {
	window.console.log("its an A1210");
	return (	runOb.part_number.match(/C16160/i)
				|| 	runOb.part_number.match(/C16270/i)
				||	runOb.part_number.match(/C16590/i)
				||	runOb.description.match(/A1210/i));
}
*/

var requiresDCHLPaperAndSpecialPlastic = function(runOb) {
	window.console.log("its an A1210, or an A1410, or S1410, or an A1420, or S1420");
	return (	    runOb.part_number.match(/C16160/i)
				|| 	runOb.part_number.match(/C16270/i)
				||	runOb.part_number.match(/C16590/i)
				||	runOb.part_number.match(/C16150/i)
				||	runOb.part_number.match(/C16175/i)
				||	runOb.part_number.match(/C16260/i)
				||	runOb.part_number.match(/C16280/i)
				||	runOb.part_number.match(/C16155/i)
				||	runOb.part_number.match(/C16180/i)
				||	runOb.part_number.match(/C16265/i)
				||	runOb.part_number.match(/C16285/i)
			// also check for the model name being referenced in a description field
			// just in case there is a new part number added, or some odd 400000 part number is in use
				||	runOb.description.match(/A1210/i)
				||	runOb.description.match(/A1410/i)
				||	runOb.description.match(/S1410/i)
				||	runOb.description.match(/A1420/i)
				||	runOb.description.match(/S1420/i));
}

var isNotTabbed = function(runOb) {
	return !isTabbed(runOb);
};

var flaggedAsNoTabs = function(runOb) {
	return (runOb.production_notes.match(/no\s*tab/i) !== null);
};

var notFlaggedAsNoTabs = function(runOb) {
	return !flaggedAsNoTabs(runOb);
};


var is9600Base = function(runOb) {
	return (runOb.description.match(/960[02]/) && !is9600Handset(runOb));
};

var jobHasRunWithSpeedKeys = function(jobOb) {
	window.console.log(filterRuns(jobOb, isRarelyModified).length);
	return (filterRuns(jobOb, isRarelyModified).length < jobOb.runs.length);
};


var isRarelyModified = function(runOb) {
	return (isCTMHandset(runOb)
		|| runOb.description.match(/lobby/i)
		|| runOb.description.match(/lby/i) 
		|| runOb.description.match(/mwb/i)
		|| runOb.description.match(/trim/i)
		|| runOb.description.match(/mws/i)
		|| runOb.part_number.match(/80002/)
		|| runOb.part_number.match(/C16590/)
		|| runOb.part_number.match(/341591/)
		|| runOb.part_number.match(/C16520/)
		|| runOb.part_number.match(/C15455/)
		|| runOb.part_number.match(/nug31039/)
		|| runOb.part_number.match(/80102/)
		|| runOb.part_number.match(/C16490/)
		|| runOb.part_number.match(/C15245/)
		|| runOb.part_number.match(/C16440/)
		|| runOb.part_number.match(/C14300/)
		|| runOb.part_number.match(/C17355/)
		|| runOb.part_number.match(/90002/)
		|| runOb.part_number.match(/80001/)
		|| runOb.part_number.match(/80011/)
		|| runOb.part_number.match(/985591HDKIT/)
		|| runOb.part_number.match(/C16865/)
		|| runOb.part_number.match(/C14435/)
		|| runOb.part_number.match(/C16320/)
		|| runOb.part_number.match(/IPN333091/)
		|| runOb.part_number.match(/C14305/)
		|| runOb.part_number.match(/C16090/)
		|| runOb.part_number.match(/C14000/)
		|| runOb.part_number.match(/DIA65309/)
		|| runOb.part_number.match(/C14005/)
		|| runOb.part_number.match(/965591HDKIT-N/)
		|| runOb.part_number.match(/965591IPHDKIT/i)
		|| runOb.part_number.match(/80012/)
		|| runOb.part_number.match(/C16490/)
		|| runOb.part_number.match(/C13170/)
		|| runOb.part_number.match(/C16095/));
};

var equivPlastic = function(faceplatePN) {
	if (faceplatePN.part_number[0] === "C") {
		return faceplatePN.part_number.slice(1) + "P";
	}
};



var returnMessages = function(runs, test, type, msg) {
	// runs: a collection of runs
	// test: a function which accepts a run and returns a boolean
	// type: the type of message to be created
	// msg: the message to be appended after the run letter
	// footnote: the footnote details to be included in the message
	var messages = []

	if (!runs) {
		return undefined;
	}

	runs.forEach(function(run) {
		var msgOb = {};
		var returnVal = test(run);

		if (returnVal) {
			msgOb.type = type;
			msgOb.msg = "Run " + run.run_letter + ": " + msg;
		}

		// if a test returns an object with a footnote field: {footnote: [x]} that will be appended to the message as a footnote.
		if (isFootnoteOb(returnVal)) {
			msgOb.footnote = returnVal.footnote;
		}


		
		if (returnVal)  {
			messages.push(msgOb);
		}
	});

	if (messages.length > 0) {
		return messages;
	}
};

var isFootnoteOb = function(returnVal) {
	return ((returnVal !== null) && (typeof returnVal === "object") && returnVal.hasOwnProperty('footnote'));
};

// TODO create a funtion that takes a field and a list of strings and/or regexs and returns true if the field string.match() any item in the list

var hasPewterPaper = function(runOb) {
	return (runOb.material.match(/pewter/i) || runOb.material.match(/grey/i) || runOb.material.match(/gray/i) || runOb.material.match(new RegExp(escapeRegExp(stocksAndDescriptions["pewter"]), "i")));
};

var hasWhitePaper = function(runOb) {
	return (runOb.material.match(/white/i) || runOb.material.match(new RegExp(escapeRegExp(stocksAndDescriptions["white"]), "i")));
};

var hasCreamPaper = function(runOb) {
	return (runOb.material.match(/cream/i) || runOb.material.match(new RegExp(escapeRegExp(stocksAndDescriptions["cream"]), "i")));
};

var has80lbsCougarPaper = function(runOb) {
	return (runOb.material.match(/cougar/i) || runOb.material.match(new RegExp(escapeRegExp(stocksAndDescriptions["whiteEightyPoundCougar"]), "i")));
};

var isVinyled = function(runOb) {
	return (runOb.material.match(/vinyl/i) !== null);
};

var mightReferenceDCHLPart = function(runOb) {
	return runOb.description.match(/\b1\d{4}\b/);
};

var hasRoomNumbers = function(runOb) {
	return (runOb.room_numbers_qty > 0);
};

var hasColorsListed = function(runOb) {
	return runOb.colors.match(/\S/);
};

var isHGI = function(jobOb) {
	return jobOb.prop_name.match(/hilton\s*garden/i) || jobOb.prop_name.match(/hgi/i);
};

var isCourtyard = function(jobOb) {
	return jobOb.prop_name.match(/courtyard/i);
};

var isHoliday = function(jobOb) {
	return jobOb.prop_name.match(/holiday\s*inn/i);
};

var isHampton = function(jobOb) {
	return jobOb.prop_name.match(/hampton/i);
};

var isVTech = function(jobOb) {
	return fieldMatchAny(jobOb.admin_company_id, [17]);
};

var isCetis = function(jobOb) {
	return fieldMatchAny(jobOb.admin_company_id, [18, 19, 21]);
};

var isCetisUK = function(jobOb) {
	return fieldMatchAny(jobOb.admin_company_id, [19]);
};

var confirmedNORoomNumbers = function(runOb) {
	return runOb.production_notes.match(new RegExp(escapeRegExp("NO #s"), "i"));
};

var isTBDRoomNumbers = function(runOb) {
	return runOb.room_numbers_tbd;
};

var isModified = function(runOb) {
	return (
		runOb.description.match(/miss/i)
		|| runOb.description.match(/minus/i)
		|| runOb.description.match(/without/i)
		|| runOb.description.match(/remove/i)
		|| runOb.description.match(/mod/i)
		|| runOb.description.match(/\bwo\b/i)
		|| runOb.description.match(/w\\o/i)
		);
};

var qtyWithSpares = function(runOb) {
	return runOb.quantity + runOb.spares_qty;
};

var sumRunQuantities = function(runArray) {
	var combinedRunQty = 0;

	runArray.forEach(function(run) {
		combinedRunQty += qtyWithSpares(run);
	});

	return combinedRunQty;
};

var escapeRegExp = function(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

var calcTenPercentSpares = function(runOb) {
	return Math.ceil(runOb.quantity * 0.1);
};


var hasTenPercentSpares = function(runOb) {
	
	return ( ((calcTenPercentSpares(runOb) === runOb.spares_qty) || ((calcTenPercentSpares(runOb) - 1) === runOb.spares_qty)) && (runOb.spares_qty !== 0));
};

// TODO sort msgList into a new list called msgListSorted and have THAT link to the scope

var filter = function(collection, test) {
	var results = [];

	collection.forEach(function(item) {
		if (test(item)) {
			results.push(item);
		}
	});

	return results;

};

var valuesArray = function(targetOb) {
	var values = [];

	for (var k in targetOb) {
		values.push(targetOb[k]);
	}

	return values;
};

var countMatches = function(tString, matchCollection) {
	// field should contain a tString
	// matchCollection should be a collection of strings or regular expressions
	var count = 0;

	matchCollection.forEach(function(item) {
		if (tString.match(item)) {
			count += 1;
		}
	});

	return count;

};

var filterRuns = function(jobOb, test) {

	// test is a function that accepts a run as an argument and returns a boolean
	var targetRuns = [];

	jobOb.runs.forEach(function(run) {
		if (test(run)) {
			targetRuns.push(run);
		}
	});

	return targetRuns;
};

// TODO make the calcSheetsAndLabels function work!

var calcSheetsAndLabels = function(runOb) {
	
	// requires the yet-unimplemented vinyl field, which adds 3%
	// var baseSheets = qtyWithSpares(runOb) / configOb.numUp;
	try {
		if (getConfigOb(runOb.part_number)) {
			var configOb = getConfigOb(runOb.part_number);
		} else {
			throw getConfigOb(runOb.part_number) + " return undefined from getConfigOb()";
		}
	} catch(e) {
		return {
		"sheets": -1,
		"labels": -1
	};
	}
	
	var baseSheets = qtyWithSpares(runOb) / configOb.numUp;


	var totalSheets = configOb.overageMultiplier * baseSheets;
	var totalLabels;
	if (isVinyled(runOb)){
		totalSheets *= 1.03;
	}
		

	if (totalSheets < (configOb.overageMinimum + baseSheets)) {
		totalSheets = configOb.overageMinimum + baseSheets;
	}
		

	totalLabels = totalSheets * configOb.numUp;

	return {
		"sheets": Math.ceil(totalSheets),
		"labels": Math.ceil(totalLabels)
	};

};

var fieldMatchAny = function(field, values) {

	var any = false;

	values.forEach(function(val) {
		if (field === val) {
			any = true;
		};
	});
	
	return any;
};


var isCTMHandset = function(runOb) {
	return fieldMatchAny(runOb.part_number, [
		"17010",
		"C17185",
		"C17190",
		"C17195",
		"C17010",
		"C17260",
		"C17265"
	]);
};

var isA101 = function(runOb) {

	return fieldMatchAny(runOb.part_number, [
		"15605", 
		"15606", 
		"15607", 
		"300340", 
		"300341", 
		"300342", 
		"300410", 
		"300411", 
		"300412", 
		"300412", 
		"C15605", 
		"IPN330091"
		]);
};



var chooseConfigOb = function(runOb) {
	return twoUpReg;
	// partNumberToDie
	// TODO make this lookup config ob based on dieNumber, need to implement the coffeescript die to config chart...
};


var isTrayRemoval = function(runOb) {
	return fieldMatchAny(runOb.part_number, ["410001", "410009"]);
};

var listsCorrectTrayRemovalColors = function(runOb) {
	return (runOb.colors.match(/black/i) && runOb.colors.match(/green/i));
};

var listsCorrectHGIRateCardColors = function(runOb) {
	return (runOb.colors.match(/blue/i) && runOb.colors.match(/red/i));
};

var isRateCard = function(runOb) {
	return runOb.part_number === "410002";
};

var isPlastic = function(runOb) {
	// return ((runOb.part_number.search(/.+p$/i) > -1) && !runOb.part_number.match(/ip/i));
	// TODO, take another look at this, better way to detect plastics from part number?
	// 400000P
	return runOb.part_number.match(/400000P/i);
};

var isntPlastic = function(runOb) {
	return !isPlastic(runOb);
};

var isFaceplate = function(runOb) {
	return (!isTrayRemoval(runOb) && !isRateCard(runOb) && !isPlastic(runOb) && !is400000Part(runOb));
};

var jobHasFaceplateRuns = function(jobOb) {

	var interrogative = function(run) {
		return (!isTrayRemoval(run) && !isRateCard(run) && !isPlastic(run) && !is400000Part(run));
	};
	return filterRuns(jobOb, interrogative).length !== 0;
};

var jobHasPlasticRuns = function(jobOb) {
	return (returnPlasticRuns(jobOb).length > 0);
};

var returnRoomNumberedRuns = function(jobOb) {

	var interrogative = function(run) {
		return (hasRoomNumbers(run));
	};

	return filterRuns(jobOb, interrogative);

};


var returnFaceplateRuns = function(jobOb) {

	var interrogative = function(run) {
		return (!isRateCard(run) && !isPlastic(run) && !isTrayRemoval(run) && !is400000Part(run));
	};

	return filterRuns(jobOb, interrogative);

};



var returnPlasticRuns = function(jobOb) {
	return filterRuns(jobOb, isPlastic);
};



var return400000Runs = function(jobOb) {
	return filterRuns(jobOb, is400000Part);
};



var is400000Part = function(runOb) {
	return ((runOb.part_number.match(/^400/) || runOb.part_number.match(/^M400/i)) && !isPlastic(runOb));
};


// var jobIsHoliday = function (jobOb) {
// 	return jobOb.prop_name.search(/holiday/i) > -1;
// };

var jobIsDoubleTree = function(jobOb) {
	return jobOb.prop_name.search(/double\s*tree/i) > -1;
};

var jobIsBestWestern = function(jobOb) {
	return jobOb.prop_name.search(/best\s*western/i) > -1;
};



var stocksAndDescriptions = {
	"cream": "Classic Crest Natural White 65# cover (#01773)",
	"pewter": "90# Gray Exact index (#49191)",
	"whiteEightyPoundCougar": "Cougar Opaque 80# White Cover Smooth (#2986)",
	"cougar": "Cougar Opaque 80# White Cover Smooth (#2986)",
	"white": "Lynx Opaque Ultra 65# Cover (#634000)",
	"doubleTreeStock": "Mohawk Options 100% PC White 80# Cover",
	"twoPartAdhesive": "LBZ658500 label stock"
};

// TODO CLEANUP ALL these pre-module functions!

// TODO write a test suite, testing EVERY function.

angular.module('preflightTaskList', ['partnumberList'])
.constant('preflightTasks', [
	{
		statuses: ['work', 'proof', 'appr', 'prod', 'ready', 'ship', 'paid'],
		description: "test for the presence of runs",
		test: function(jobOb) {

			if (!jobOb.hasOwnProperty('runs')) {
				return [{
					type: "danger",
					msg: "Job contains no runs."
				}];
			} 
		}
	},
	{
		statuses: ['proof', 'appr', 'prod', 'ready', 'ship', 'paid'],
		description: "test for valid property name",
		test: function(jobOb) {

			if (!jobOb.prop_name || jobOb.prop_name.match(/tbd/i)) {
				return [{
					type: "danger",
					msg: "Job needs a valid property name."
				}];
			} 
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "remind to check zipcode",
		test: function(jobOb) {
			// 21 = cetis me
			// 19 = cetis europe (tmx uk)
			if (jobHasFaceplateRuns(jobOb) && (jobOb.admin_company_id !== 21) && (jobOb.admin_company_id !== 19) && (jobOb.prop_country === null || jobOb.prop_country === "US") && !jobOb.proof_company.match(/Purple Networks/i))
				return [{
					type: "info",
					msg: "Make sure the zipcode has 5 digits."
				}];

		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "remind user to check Canadian zipcodes",
		test: function(jobOb) {
			// 21 = cetis me
			// 19 = cetis europe (tmx uk)
			if (jobHasFaceplateRuns(jobOb) && (jobOb.admin_company_id !== 21) && (jobOb.admin_company_id !== 19) && (jobOb.prop_country === "CA"))
				return [{
					type: "info",
					msg: "Canadian postal codes are in the following format: A1A 1A1",
					footnote: ["where A is a letter and 1 is a digit, with a space separating the third and fourth characters"]
				}];

		}
	},



	{
		statuses: ['proof', 'appr', 'prod'],
		description: "remind to check phone numbers",
		test: function(jobOb) {
			// 21 = cetis me
			// 19 = cetis europe (tmx uk)
			if (jobHasFaceplateRuns(jobOb) && (jobOb.admin_company_id !== 21) && (jobOb.admin_company_id !== 19) && (jobOb.prop_country === null || jobOb.prop_country === "US" || jobOb.prop_country === "CA") && !jobOb.proof_company.match(/Purple Networks/i))
				return [{
					type: "info",
					msg: "Make sure the phone and fax have 10 digits."
				}];

		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "remind to spell check",
		test: function(jobOb) {
			if (jobOb.hasOwnProperty('runs'))
				return [{
					type: "info",
					msg: "Make sure to spell check each run."
				}];

		}
	},
	{
		statuses: ['proof', 'appr', 'prod', 'paid'],
		description: "remind to check icons",
		test: function(jobOb) {
			if (jobHasFaceplateRuns(jobOb) && !isHampton(jobOb) && jobHasRunWithSpeedKeys(jobOb))
				return [{
					type: "info",
					msg: "Make sure each icon makes sense with its text label."
				}];

		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "remind to check raster overlaps",
		test: function(jobOb) {
			if (jobHasFaceplateRuns(jobOb)  && !isHampton(jobOb))
				return [{
					type: "info",
					msg: "Make sure there are no dangerous raster overlaps."
				}];

		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "remind to check centering",
		test: function(jobOb) {
			if (jobHasFaceplateRuns(jobOb))
				return [{
					type: "info",
					msg: "Make sure that elements are nicely centered."
				}];

		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "remind to check bleeds",
		test: function(jobOb) {
			if (jobHasFaceplateRuns(jobOb))
				return [{
					type: "info",
					msg: "If there are bleeds, make sure they extend far enough to be practical for die cutting."
				}];

		}
	},
	{ //HERE
		statuses: ['proof', 'appr', 'prod'],
		description: "have user note run to be test fit if it is any version of an A1210",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				if (requiresDCHLPaperAndSpecialPlastic(runOb) && !runOb.production_notes.match(/test\s*fit/i)) {
					return {footnote: ["DIE CUTTING: have Melissa or Scott test fit cut labels for this run on a phone.  (China may have changed the mold.)"]};
				}
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "copy test fit note into production notes");

		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "remind to proofread",
		test: function(jobOb) {
			if (jobOb.hasOwnProperty('runs'))
				return [{
					type: "info",
					msg: "Make sure to skim each proof, looking for any glaring errors."
				}];
				// TODO refactor this test so that it returns once for any job with non plastic runs

		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "remind about Vinyl Cream background floods",
		test: function(jobOb) {
			var interrogative = function(run) {
				return ((run.material.match(/vinyl/i) || isCTMHandset(run)) && run.material.match(/cream/i));
			};

			return returnMessages(jobOb.runs, interrogative, "info", "Make sure to set Vinyl Cream BG flood: C:01, M:01, Y:19, K:00")
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "remind about Vinyl Pewter background floods",
		test: function(jobOb) {
			var interrogative = function(run) {
				return ((run.material.match(/vinyl/i) || isCTMHandset(run)) && run.material.match(/pewter/i));
			};

			return returnMessages(jobOb.runs, interrogative, "info", "This run will probably require a BG flood of: K: 11")
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "remind about mandatory tabs for vinyl Holiday Inn and DoubleTree properties",
		test: function(jobOb) {

			var interrogative = function(run) {
				return (run.material.match(/vinyl/i) && (jobOb.prop_name.match(/holiday/i) || jobOb.prop_name.match(/double\s*tree/i)));
			};

			return returnMessages(jobOb.runs, interrogative, "info", "MUST use a tabbed die, as the material being vinyled is not adhesive.");
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "remind to enter correct vinyl description into production notes (non-Holiday)",
		test: function(jobOb) {
			var interrogative = function(run) {
				return (run.material.match(/vinyl/i) && !jobOb.prop_name.match(/holiday/i));
			};

			return returnMessages(jobOb.runs, interrogative, "info", "Add this to production notes: laminate after printing with 6.5 mil matte clear overlaminate");
		}

		

	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "remind to enter correct vinyl description into production notes (Holiday)",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				return (isVinyled(runOb) && isHoliday(jobOb));
			};

			return returnMessages(jobOb.runs, interrogative, "info", "Add this to production notes: laminate after printing with 2.5 mil matte clear overlaminate");
		}

		

	},
	{
		statuses: ['appr', 'prod'],
		description: "remind to remove paper simulations before printing.",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				return ((hasCreamPaper(runOb) || hasPewterPaper(runOb)) && !runOb.material.match(/flood/i) && !isVinyled(runOb));
			};

			if (filterRuns(jobOb, interrogative).length > 0 ) {
				return [{
					type: "info",
					msg: "Remove any proof-only paper simulation floods."
				}];
			}

			

			// return returnMessages(jobOb.runs, interrogative, "info", "Remove any proof-only paper simulation floods.");

		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "if any runs list 'tab' in description, have user confirm presence of tabs",
		test: function(jobOb) {
			var interrogative = function(run) {
				return run.description.match(/tab/i);
			};

			return returnMessages(jobOb.runs, interrogative, "info", "needs to show tabs on its proof.");
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "for each 400000 part have user confirm that paper stock is valid and possibly on order",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				if (is400000Part(runOb)) {
					return {footnote: [runOb.material, "...should appear either in the common materials list or on a PO in the job folder."]};
				}
			};

			return returnMessages(jobOb.runs, interrogative, "info", "confirm that this material is valid:");
		}
	},
	
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "if job has room numbered runs, remind to print lists",
		test: function(jobOb) {
			if (returnRoomNumberedRuns(jobOb).length > 0) {
				return [{
					type: "info",
					msg: "Remember to print room number lists"
				}];
			}
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "if job is a for Cetis, and has plastic runs, have user carefully double check them",
		test: function(jobOb) {
			if (isCetis(jobOb) && jobHasPlasticRuns(jobOb)) {
				return [{
					type: "info",
					msg: "It's unusual for a Cetis job to have plastic runs, please carefully check them"
				}];
			}
		}
	},
	
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "if job is a Sheraton, make sure that Cream Paper is used for faceplates",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				return (jobOb.prop_name.match(/sheraton/i)
					&& !jobOb.prop_name.match(/four.*points/i)
					&& !hasCreamPaper(runOb)
					&& isFaceplate(runOb));
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "Sheraton faceplates should be printed on CREAM paper.");
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "if job is a Four Points by Sheraton, make sure that WHITE Paper is used for faceplates",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				return (jobOb.prop_name.match(/four.*points/i) && !hasWhitePaper(runOb) && isFaceplate(runOb));
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "Four Points faceplates should be printed on WHITE paper.");
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "If a plastic run corresponds to a modified paper faceplate, it should be in the 'see file 55555-X' format",
		test: function(jobOb) {
			var modifiedRuns = filter(jobOb.runs, isModified);
			// here cannot figure this test out, restart completely?
			window.console.log("modifiedRuns");
			window.console.log(modifiedRuns);
			var plasticRuns = returnPlasticRuns(jobOb);
			window.console.log("plasticRuns");
			window.console.log(plasticRuns);

			var interrogative = function(runOb) {
				var messages = [];
				modifiedRuns.forEach(function(modRunOb) {
					window.console.log("modRunOb.part_number");
					window.console.log(modRunOb.part_number);
					window.console.log('(runOb.description.match(new RegExp(equivPlastic(modRunOb), "i")) && !isPlastic(modRunOb))');
					window.console.log((runOb.description.match(new RegExp(equivPlastic(modRunOb), "i")) && !isPlastic(modRunOb)));
					if (runOb.description.match(new RegExp(equivPlastic(modRunOb), "i")) && !isPlastic(modRunOb) && (modRunOb.part_number.slice(0,1).toLowerCase() === "c")) {
						messages.push("Since Run " + modRunOb.run_letter + " is modified and this run needs to correspond to it... this run's description should say 'reference plastic layout " + jobOb.id + "-" + runOb.run_letter + "' ...and then you should create a modified plastic layout matching that name.");
					}
				});
				if (messages.length > 0) {
					return {footnote: messages};
				}
			};

			return returnMessages(plasticRuns, interrogative, "danger", "Plastic description is not correct.");
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "If a plastic run doesn't correspond to any faceplate run, have user confirm it",
		test: function(jobOb) {
			var faceplateRuns = returnFaceplateRuns(jobOb);
			var plasticRuns = returnPlasticRuns(jobOb);

			var interrogative = function(plasticRunOb) {
				var nonMatches = faceplateRuns.length;
				faceplateRuns.forEach(function(faceplateRunOb) {
					if (!plasticRunOb.description.match(new RegExp(equivPlastic(faceplateRunOb), "i"))
						&& !plasticRunOb.description.match(/\b\d{5}.?[a-oq-z]\b/i)) {
						nonMatches -= 1;
					}
				});

				if (nonMatches < 1) {
					return {footnote: ["it's unusual to have a plastic cover that doesn't match any of the faceplate runs on a job, please double check Run " + plasticRunOb.run_letter]};
				}
				
			};

			return returnMessages(plasticRuns, interrogative, "warning", "plastic doesn't seem to correspond to any faceplate run");
		}
	},

	// {
	// 	statuses: ['proof', 'appr', 'prod'],
	// 	description: "make sure that more than one paper name is NOT listed in the material field",
	// 	test: function(jobOb) {
	// 		var interrogative = function(run) {
	// 			return countMatches(run.material, Object.keys(stocksAndDescriptions)) > 1;
	// 		};

	// 		return returnMessages(jobOb.runs, interrogative, "danger", "references more than 1 paper stock.");
	// 	}

	// },
	/*
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "provide the full paper stock description for placement in production notes",
		test: function(jobOb) {
			var papers = [];
			var messages = [];
			// TODO add special paper descriptions here
			var stockDescription = {
				cream: "Classic Crest Natural White 65# cover  (#01773)",
				pewter: "90# Gray Exact index (#49191)",
				whiteEightyPoundCougar: "Cougar Opaque 80# White Cover Smooth (#2986)",
				white: "Lynx Opaque Ultra 65# Cover (#634000)",
				doubleTreeStock: "Mohawk Options 100% PC White 80# Cover",
				twoPartAdhesive: "LBZ658500 label stock"
			};
			// TODO refactor this whole function, and make it omit the note if the stock is already in the production notes!


			if (jobHasFaceplateRuns(jobOb)) {
				jobOb.runs.forEach(function(run) {
					
				});
			}

			if (jobOb.hasOwnProperty('runs')) {
				jobOb.runs.forEach(function(run) {
					var mat = run.material;

					var isVinyled = run.material.match(/vinyl/i);

					if (jobOb.prop_name.search(/holiday/i) > -1) {
						isHoliday = true;
					}
					

						
					if (jobIsHoliday(jobOb)) {
						papers.push({runLetter: run.run_letter, paperKey: "whiteEightyPoundCougar"});
					} else if (jobIsDoubleTree(jobOb)) {
						papers.push({runLetter: run.run_letter, paperKey: "doubleTreeStock"});
					} else if (isVinyled) {
						papers.push({runLetter: run.run_letter, paperKey: "twoPartAdhesive"});
					} else if (mat.search(/cream/i) > -1) {
						papers.push({runLetter: run.run_letter, paperKey: "cream"});
					} else if (mat.search(/pewter/i) > -1) {
						papers.push({runLetter: run.run_letter, paperKey: "pewter"});
					} else if ((mat.search(/80#\s*cougar/i) > -1) || (mat.search(/cougar\s*80#/i) > -1)) {
						papers.push({runLetter: run.run_letter, paperKey: "whiteEightyPoundCougar"});
					} else if (mat.search(/white/i) > -1) {
						papers.push({runLetter: run.run_letter, paperKey: "white"});
					} else if (mat.search(/double\s*tree/i) > -1) {
						papers.push({runLetter: run.run_letter, paperKey: "doubleTreeStock"});
						// TODO is there a guide that asks user to set all material fields in doubletree job to say doubletree stock?  what about exceptions for little vtech part
					} else {
						papers.push({runLetter: run.run_letter, paperKey: undefined});
					}
				});

				papers.forEach(function(paperOb) {
					
					if (paperOb.paperKey !== undefined) {
						messages.push({
							type: "info",
							msg: "copy this stock into run " + paperOb.runLetter + "'s production notes:",
							footnote: stockDescription[paperOb.paperKey]
						});
					} else {
						messages.push({
							type: "danger",
							msg: "could not find run " + paperOb.runLetter + "'s paper in the common materials list."
						});
					}
				});
			}
			return messages;
		}
	}, 
	*/
	// TODO if interrogratives returned objects....they could provide additional info, and would count as a TRUE return?  check in returnMessages
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "on 400000 parts, double check simplex / duplex",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				return (is400000Part(runOb) && !runOb.colors.match(/simp/i) && !runOb.colors.match(/dupl/i));
			};

			return returnMessages(jobOb.runs, interrogative, "info", "make sure colors field lists 'simplex' or 'duplex'");
		}
	},
	{
		statuses: ['setup', 'work', 'proof', 'appr', 'prod'],
		description: "throw error if HGI rate card run has incorrect colors",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				return ((isRateCard(runOb) && !listsCorrectHGIRateCardColors(runOb)));
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "Rate Cards should list the colors 'blue / red'");
		}
	},
	{
		statuses: ['setup', 'work', 'proof', 'appr', 'prod'],
		description: "throw error if HGI rate card run has incorrect stock in materials field",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				if ((isRateCard(runOb) && !has80lbsCougarPaper(runOb))) {
					return {footnote: [stocksAndDescriptions.whiteEightyPoundCougar]};
				}
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "has incorrect stock:");
		}
	},
	{
		statuses: ['setup', 'work', 'proof', 'appr', 'prod'],
		description: "throw error if tray removal run has incorrect colors",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				return (isTrayRemoval(runOb) && !listsCorrectTrayRemovalColors(runOb));
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "Tray Removals should list the colors 'black / green'");
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "throw error if faceplate run has empty color field",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				return ((isFaceplate(runOb) || is400000Part(runOb)) && !hasColorsListed(runOb));
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "fill in the colors field");
		}
	},
	{
		statuses: ['work', 'proof', 'appr', 'prod'],
		description: "If job is for Haiti Foundation of Hope, caution about indicia and return service info",
		test: function(jobOb) {
			if (jobOb.prop_name.match(/Haiti\s*Found/i) || jobOb.prop_name.match(/H\s*F\s*H/i)) {
				return [{
					type: "warning",
					msg: "If this is an HFH newsletter job it will need:",
					footnote: ["• special HFH indicia and Return Service text (pull from previous job) ** IF the run has addresses printed on it **"]
				}];
			}

		}
	},
	{
		statuses: ['work', 'proof', 'appr', 'prod'],
		description: "If job is for Inn-Phone, check and make sure approval came from Inn-Phone and not customer",
		test: function(jobOb) {
			console.log('jobOb.proof_template_id');
			console.log(jobOb.proof_template_id);
			if (jobOb.proof_company.match(/inn-phone/i) || jobOb.proof_company.match(/inn\s*phone/i) || jobOb.proof_template_id === 11) {
				return [{
					type: "warning",
					msg: "Make sure this job was approved by someone at Inn-Phone",
					footnote: ["Don't go to production if the approval is directly from the customer, contact Inn-Phone instead."]
				}];
			}

		}
	},
	{
		statuses: ['appr', 'prod'],
		description: "If job is for DCI, check and make sure approval came from DCI and not customer",
		test: function(jobOb) {
			if (jobOb.proof_company.match(/DCI/i)) {
				return [{
					type: "warning",
					msg: "Make sure this job was approved by someone at DCI",
					footnote: ["Don't go to production if the approval is directly from the customer, contact DCI instead."]
				}];
			}

		}
	},
	{
		// TODO: make this function sum all the runs color descriptions and put them in one footnote
		statuses: ['proof', 'appr', 'prod'],
		description: "make sure color description match proofs",
		test: function(jobOb) {
			var footnote = [];
			if (jobOb.runs) {
				jobOb.runs.forEach(function(runOb) {
					if ((isFaceplate(runOb) || is400000Part(runOb)) && hasColorsListed(runOb)) {
						footnote.push("• Run " + runOb.run_letter + ": " + runOb.colors);
					}
				});
			}

			if (footnote.length > 0) {
				return {
					type: "info",
					msg: "make sure colors on proof match colors in Job Tracker:",
					footnote: footnote
				}
			}
			
		}
	},
	// {
	// 	// TODO: make this function sum all the runs color descriptions and put them in one footnote
	// 	statuses: ['proof', 'appr', 'prod'],
	// 	description: "make sure color description match proofs",
	// 	test: function(jobOb) {
	// 		var interrogative = function(runOb) {
	// 			if ((isFaceplate(runOb) || is400000Part(runOb)) && hasColorsListed(runOb)) {
	// 				return {footnote: [runOb.colors]};
	// 			}
	// 		};

	// 		return returnMessages(jobOb.runs, interrogative, "info", "make sure colors on proof match colors in Job Tracker:");
	// 	}
	// },
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "make sure room number quantities for each run match room number lists.",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				if (hasRoomNumbers(runOb)) {
					return {footnote: [runOb.room_numbers_qty]};
				}
			};

			return returnMessages(jobOb.runs, interrogative, "info", "confirm that room number list matches qty listed in Job Tracker");
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "check that no run has too large of a room number quantity",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				return runOb.room_numbers_qty > qtyWithSpares(runOb);
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "room numbers exceed quantity being ordered");
		}
	},
	{ // here
		statuses: ['work', 'proof', 'appr', 'prod'],
		description: "If the job is for a hampton, and has faceplates, make sure they have an emergency dialing instruction",
		test: function(jobOb) {
			if (isHampton(jobOb) && jobHasFaceplateRuns(jobOb)) {
				return [{
					type: "info",
					msg: "Make sure this faceplates have an EMERGENCY dialing instruction.",
					footnote: ["it's a Hampton brand requirement"]
				}];
			}
		}
	},
	{
		statuses: ['appr', 'prod'],
		description: "Test to make sure that no runs list TBD in the room numbers field.",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				return isTBDRoomNumbers(runOb);
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "can't go to production with room numbers TBD");
		}
	},
	{ // here
		statuses: ['appr', 'prod'],
		description: "Test to make sure that no runs list TBD in the room numbers field AND NO #s in the description",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				return (isTBDRoomNumbers(runOb) && confirmedNORoomNumbers(runOb));
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "Room Numbers are set to TBD, but description lists 'NO #s'");
		}
	},
	{
		statuses: ['appr', 'prod'],
		description: "confirm that job doesn't need room numbers",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				return (!isCetisUK(jobOb) && !hasRoomNumbers(runOb) && !confirmedNORoomNumbers(runOb));
			};
			if ((filterRuns(jobOb, interrogative).length === jobOb.runs.length) && jobHasFaceplateRuns(jobOb)) {
				return [{
					type: "info",
					msg: "check to make sure customer doesn't want room numbers"
				}];
			}

		}
	},

	// TODO find a home for instructional notes like: "'NO #s' in a run's production notes can shut off room number double check"
	{
		statuses: ['work', 'proof', 'appr', 'prod'],
		description: "make sure that a Hampton property has either white or cream paper.",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				return (isHampton(jobOb) && isFaceplate(runOb) && !hasCreamPaper(runOb) && !hasWhitePaper(runOb));
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "needs to have White or Cream paper, per Hampton standards.");				
		}
	},
	{
		statuses: ['work', 'proof', 'appr', 'prod'],
		description: "make sure that a Holiday Inn property has 80# Cougar stock",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				return (isHoliday(jobOb) && isFaceplate(runOb) && !has80lbsCougarPaper(runOb) && !requiresDCHLPaperAndSpecialPlastic(runOb));
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "needs to have White 80# Cougar paper, per IHG standards.");				
		}
	},
	{
		statuses: ['work', 'proof', 'appr', 'prod'],
		description: "make sure that a Courtyard  property has white paper",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				return (isCourtyard(jobOb) && isFaceplate(runOb) && !hasWhitePaper(runOb));
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "needs to have White paper, per Courtyard standards.");
		}
	},
	{
		statuses: ['work', 'proof', 'appr', 'prod'],
		description: "make sure that a Hilton Garden Inn property has pewter paper",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				return (isHGI(jobOb) && isFaceplate(runOb) && !hasPewterPaper(runOb));
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "needs to have Pewter paper, per HGI standards.");
		}
	},
	{
		statuses: ['work', 'proof', 'appr', 'prod'],
		description: "make sure that if a run is a tray removal card, its quantity is listed in terms of cards, and NOT packs of 50",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				return (isHGI(jobOb) && isTrayRemoval(runOb) && (runOb.quantity < 50));
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "quantity needs to be listed in cards, NOT packages");				
		}
	},
	{
		statuses: ['work', 'proof', 'appr', 'prod'],
		description: "make sure that tray removal runs have the correct material listed",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				if (isTrayRemoval(runOb) && !runOb.material.match(/Carolina C1S 10pt/i)) {
					return {footnote: ["Carolina C1S 10pt"]};
				}
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "incorrect material listed.  Should be:");				
		}
	},
	
	{ 
		statuses: ['appr', 'prod'],
		description: "if job has faceplate quantities in excess of 1500, email production an FYI",
		test: function(jobOb) {

			if (jobOb.runs && (sumRunQuantities(returnFaceplateRuns(jobOb)) > 1500)) {
				return [{
					type: "info",
					msg: "email production@desi.com with this info:",
					footnote: ["Job " + jobOb.id + " contains " + sumRunQuantities(returnFaceplateRuns(jobOb)) + " faceplates, and is going into production."]
				}];
			}

		}
	},
	{
		statuses: ['work', 'proof', 'appr', 'prod'],
		description: "make sure that tray removal runs have the correct material listed in the production notes",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				if (isTrayRemoval(runOb) && !runOb.production_notes.match(/Carolina C1S 10pt/i)) {
					return {footnote: ["Carolina C1S 10pt"]};
				}
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "need to list stock in production notes:");				
		}
	},
	{
		statuses: ['work', 'proof', 'appr', 'prod', 'paid', 'ship'],
		description: "If job has faceplate runs and does NOT list modifications, check to make sure proof is not modified.",
		test: function(jobOb) {
			// here

			var interrogative = function(runOb) {
				return (isFaceplate(runOb) 
					&& !isModified(runOb) 
					&& !isRarelyModified(runOb));
			};

			return returnMessages(jobOb.runs, interrogative, "info", "make sure proof shows NO modifications.");			
		}
	},
	{
		statuses: ['work', 'proof', 'appr', 'prod', 'ship'],
		description: "If job DOES list modifications in a faceplate run, have user make sure mods are present.",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				if (isModified(runOb) && isFaceplate(runOb)) {
					return {footnote: [runOb.description]};
				}
			};

			return returnMessages(jobOb.runs, interrogative, "info", "lists modifications, make sure they are reflected on the proof.");
		}
	},
	{
		statuses: ['appr', 'prod'],
		description: "If job contains a total of more than 200 plastics, extend production to be 7 days and email production@desi.com.",
		test: function(jobOb) {

			if (sumRunQuantities(returnPlasticRuns(jobOb)) > 200) {
				return [{
					type: "info",
					msg: "This job contains more than 200 plastics.",
					footnote: ["Set production days to 7", "email a notification to production@desi.com"]
				}];
			}			
		}
	},
	{
		statuses: ['appr', 'prod'],
		description: "if run is for a plastic part, warn user to make sure we have a valid plastic layout",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				if (isPlastic(runOb)) {
					return {footnote: [runOb.description]};
				}
			};

			return returnMessages(jobOb.runs, interrogative, "info", "check to make sure there is a layout in the plastics folder for this run");

		}

	},
	{
		statuses: ['appr', 'prod'],
		description: "if run is for a plastic part, confirm that run has a valid plastic part number",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				window.console.log(jobOb.id + "-" + runOb.run_letter);
				if (isPlastic(runOb) && !(runOb.description.match(/\b\d{5}p\s*$/i) || runOb.description.match(jobOb.id + "-" + runOb.run_letter))) {
					return {footnote: ["correct plastic run descriptions look like '12345p' or 'see file " + jobOb.id + "-" + runOb.run_letter + "'"]};
				}
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "invalid reference to plastic part");

		}

	},
	{
		statuses: ['appr', 'prod'],
		description: "If job contains any runs with 400000 part numbers and a XXXXX number in the description, have user reference special procedure.",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				if (is400000Part(runOb) && mightReferenceDCHLPart(runOb)) {
					return {footnote: ["• make sure that each DCHL part number is a separate run in Job Tracker using the part number 400000 with the quantity being the number of packages ordered",
									   "________________________________________________________",
									   "• Change the description of the part number to the actual DCHL part number (e.g. 14000). If a non-standard DCHL, use the part number 400080.",
									   "_______________________________________________________",
									   "• Make a note on the run ticket for finishing/packaging to label the finished package(s) using the same labels used for plastics (located on the rolling laser cart)."]};
					// TODO put in the appropriate custom DCHL run instructions
				}
			};

			return returnMessages(jobOb.runs, interrogative, "info", "if this is a custom DCHL run");
			
		}
	},
	{
		statuses: ['appr', 'prod'],
		description: "Is any of the runs have UNO voice in the description, caution about magenta clearance guides.",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				return runOb.description.match(/uno.*voice/i);
			};

			return returnMessages(jobOb.runs, interrogative, "info", "make sure that there are no magenta clearance guides that are covering up art.");
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "If the job is VTech, make sure each paper faceplate run has 10% spares",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				if (isVTech(jobOb) && !hasTenPercentSpares(runOb) && isFaceplate(runOb)) {
					return {footnote: ["should be " + calcTenPercentSpares(runOb) + ", currently lists " + runOb.spares_qty]};
				}
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "The amount of spares needs to be 10%");
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "If the job is any of the Cetis companies, make sure each paper faceplate run has 10% spares",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				if (isCetis(jobOb) && !hasTenPercentSpares(runOb) && isFaceplate(runOb)) {
					return {footnote: ["should be " + calcTenPercentSpares(runOb) + ", currently lists " + runOb.spares_qty]};
				}
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "The amount of spares needs to be 10%");
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "If the job contains runs that are likely to need manually listed dimensions, ask user to confirm dimensions for that run.",
		test: function(jobOb) {

			var interrogative = function(runOb) {
				if (is400000Part(runOb) && !mightReferenceDCHLPart(runOb) && !runOb.description.match(/die/i)) {
					return {footnote: ["description: " + runOb.description]};
				}
			};

			return returnMessages(jobOb.runs, interrogative, "info", "make sure that there are dimensions listed below, and that they match the artwork:");

		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "If the property is a prop_name is Sheraton, and the model is a lobby, make sure it is modified to NOT have a speed key",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				return (isA101(runOb) 
					&& jobOb.prop_name.match(/sheraton/i)
					&& !isModified(runOb));
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "needs to be modified (remove speed key), per Sheraton standards.");
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "Is the job likely to have matrix scoring?  if so, warn user to include score marks on printouts.",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				return is400000Part(runOb) && !mightReferenceDCHLPart(runOb);
			}; 

			return returnMessages(jobOb.runs, interrogative, "info", "Add score-marks to art, if matrix-scored");
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "If the job is likely to print on the DOCUCOLOR 800, instruct user to provide 800 relevant production notes",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				if (is400000Part(runOb) && !runOb.production_notes.match("add crop-marks") && !runOb.production_notes.match("adjust dimensions")) {
					return {footnote: ["DOCUCOLOR 800: • DO/DON'T add crop-marks • DO/DON'T adjust dimensions"]};
				}
			};

			return returnMessages(jobOb.runs, interrogative, "info", "If printing on the DOCUCOLOR 800, copy relevant text to production notes.");
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "If the job is likely to print on the DOCUCOLOR 800 and references a die in the run description, instruct the user to append a production note",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				if ((is400000Part(runOb) && runOb.description.match(/die/i) && !runOb.production_notes.match("• Reference cut sample for positioning"))) {
					return {footnote: ["• Reference cut sample for positioning"]};
				}
			};
			return returnMessages(jobOb.runs, interrogative, "info", "seems to be die-cut, copy this into production notes:");
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "If the job is for a Crowne Plaza, make sure all runs separate in the correct colors.",
		test: function(jobOb) {
			if (jobOb.prop_name.match(/crowne/i)) {
				return [{
					type: "info",
					msg: "All Crowne Plaza runs need to be tested for correct separation.  All Artwork should be in one of these colors:",
					footnote: ["PANTONE 228C / PANTONE 226C"]
					// TODO update correct crowne colors
				}];
			}
		}
	},
	{ 
		statuses: ['proof', 'appr', 'prod'],
		description: "If a run is vinyled, but does not mention tabs, and does not say NO tabs in production notes, have user check on it",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				return isVinyled(runOb) && isNotTabbed(runOb) && notFlaggedAsNoTabs(runOb);
			};
			

			return returnMessages(jobOb.runs, interrogative, "info", "double check and see if this run should be tabbed")
		}
			
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "If it's a Ridgeway job, make sure there is a production note asking cleaners to bring samples to Melissa",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				if (jobOb.proof_company.match(/Ridgeway/i) && !runOb.production_notes.match(/please bring 3 samples to Melissa/i) && isFaceplate(runOb)) {
					return {footnote: ["CLEANERS: please bring 3 samples to Melissa."]};
				}
				
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "Add the following to production notes:");
		}
	},
	{ 
		statuses: ['proof', 'appr', 'prod'],
		description: "If it's a Carper Company job, make sure there is a production note asking cleaners to bring a sample to Melissa",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				if (jobOb.proof_company.match(/Carper Company/i) && !runOb.production_notes.match(/please bring 1 sample to Melissa/i) && isFaceplate(runOb)) {
					return {footnote: ["CLEANERS: please bring 1 sample to Melissa."]};
				}
				
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "Add the following to production notes:");
		}
	},
	{ 
		statuses: ['proof', 'appr', 'prod'],
		/*left off here*/
		description: "If it's a Best Western job, check for proper brand capitalization",
		test: function(jobOb) {
			if (jobIsBestWestern(jobOb))
				return [{
					type: "info",
					msg: "check to see that BEST WESTERN is capitalized, if written on the faceplate"
				}];

		}
	},
	{
		statuses: ['setup', 'work', 'proof', 'appr', 'prod'],
		description: "If any runs are of the type with the strange VTech china dies, we need them to be on DCHL paper, not regular custom label paper (for stock thickness and phone fit reasons)",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				if (!runOb.material.match(/dchl/i) 
					&& requiresDCHLPaperAndSpecialPlastic(runOb)
					&& !runOb.production_notes.match(/dchl/i)) {
					return {footnote: [
						"• the DCHL version must be referenced in the material field and in the production notes, see Mellissa with questions", 
						"• White becomes DCHL White",
						"• Cream becomes DCHL Cream",
						"• Pewter becomes DCHL Pewter",
						"• 80# Cougar becomes DCHL White",
						"• DoubleTree Stock becomes DCHL White",
					]};
				}
				
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "you must use the DCHL version of our paper stocks for this model");
		}
	},
	{
		statuses: ['setup', 'work', 'proof', 'appr', 'prod'],
		description: "If this run is being printed on DCHL paper, print it to the vinyl hot folder",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				if (!runOb.material.match(/dchl/i) 
					&& requiresDCHLPaperAndSpecialPlastic(runOb)
					&& !runOb.production_notes.match(/dchl/i)) {
					return {footnote: [
						"• This run will be printed to the **VINYL** hot folder"
					]};
				}
				
			};

			return returnMessages(jobOb.runs, interrogative, "info", "this run require special hot folder printing");
		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "If the any of the job's runs are for the little VTech adhesive square, prompt the user to add correct paper and vinyl descriptions",
		test: function(jobOb) {
			// die 6158 first four determines whether it's this part!
			var interrogative = function(runOb) {
				if (isCTMHandset(runOb) && !runOb.production_notes.match("#NY-2003") && !runOb.production_notes.match("6.5 mil")) {
					return {footnote: ["• 60# Metro semi-gloss label stock (#NY-2003) • Laminate with 6.5 mil matte clear overlaminate"]};
				}
			};

			return returnMessages(jobOb.runs, interrogative, "info", "Has special materials to be copied into the production notes:");
		}
	},
	{
		statuses: ['appr', 'prod'],
		description: "If the property is a Hyatt House, instruct user to make a backup of unexpanded art and then curve all non-roomnumber test, also warn about centering prop name and address.",
		test: function(jobOb) {
			if (jobOb.prop_name.match(/hyatt/i) && jobOb.prop_name.match(/house/i)) {
				return [{
					type: "info",
					msg: "Hyatt House jobs require some special handling before printing to the DOCUCOLOR 5000.",
					footnote: ["1. Make sure that the property name, logo, and address are nicely centered.", "2. copy all runs in the design folder and paste a backup in the history folder.", "3. On the files you are printing: convert all non-room number art to curves."]
				}];
			}

		}
	},
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "If the admin company is cetis ME, check and see if the proof contains any arabic text that might need to be converted to curves before printing.",
		test: function(jobOb) {
			if (jobOb.admin_company_id === 21) {
				return [{
					type: "info",
					msg: "Check and see if any runs on this job contain Arabic text.  If they DO:",
					footnote: ["1. copy all runs in the design folder and paste a backup in the history folder.", "2. On the files you are printing: convert all non-room number art to curves."]
				}];
			}

		}
	},

	
	// { 
	// // TODO: break this test into individual function for simplicity and better specificity
	// // or jus tmake this one more selective, like only white, not white within a larger phrase?
	// 	statuses: ['proof', 'appr', 'prod'],
	// 	description: "check material field for known stocks, make sure stock Desc goes in production notes",
	// 	test: function(jobOb) {
	// 		var interrogative = function(runOb) {
	// 			var matchedStock = undefined;
	// 			// TODO repair stockAndDescriptions object to not have duplicate 80Cougar keys, change this function to use the more flexible paper stock checker functions, instead of indexes in actual paper object
	// 			Object.keys(stocksAndDescriptions).forEach(function(stockKey) {
	// 				var re = new RegExp(stockKey, "i");
	// 				// here
	// 				if (runOb.material.match(re) && !isVinyled(runOb)) {
	// 					matchedStock = stockKey;
	// 				}
	// 			});
				
	// 			if ((matchedStock !== undefined) 
	// 				&& !isCTMHandset(runOb)
	// 				&& !isVinyled(runOb)
	// 				&& !runOb.material.match(/cougar/i)
	// 				&& !runOb.material.match(/Mohawk/i)
	// 				&& !runOb.material.match(/cover/i)
	// 				&& !runOb.material.match(new RegExp(escapeRegExp("80#"), "i"))
	// 				&& !runOb.production_notes.match(new RegExp(escapeRegExp(stocksAndDescriptions[matchedStock]), "i"))) {
	// 				return {footnote: [stocksAndDescriptions[matchedStock]]};
	// 			}
	// 		};

	// 		return returnMessages(jobOb.runs, interrogative, "danger", "needs the stock description changed to:");
	// 	}
	// },
// ------------------------------------------- here reworking paper checks into 1 test
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "check material field for known papers, and making sure correct corresponding stock description appears in production_notes",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				if (runOb.material.match(/cougar/i)
					&& !is400000Part(runOb)
					&& !runOb.material.match(/100/)
					&& !runOb.material.match(/dchl/i)
					&& !requiresDCHLPaperAndSpecialPlastic(runOb)
					&& !isCTMHandset(runOb)
					&& !runOb.production_notes.match(new RegExp(escapeRegExp(stocksAndDescriptions["cougar"]), "i"))
					) {
					return {footnote: [stocksAndDescriptions["cougar"]]};

				} else if (jobIsDoubleTree(jobOb)
					&& !is400000Part(runOb)
					&& !isCTMHandset(runOb)
					&& !requiresDCHLPaperAndSpecialPlastic(runOb)
					&& !runOb.material.match(/dchl/i)
					&& !isPlastic(runOb)
					&& !runOb.production_notes.match(new RegExp(escapeRegExp(stocksAndDescriptions["doubleTreeStock"]), "i"))
					) {
					return {footnote: [stocksAndDescriptions["doubleTreeStock"]]};

				} else if (runOb.material.match(/white/i)
					&& !jobIsDoubleTree(jobOb)
					&& !isHoliday(jobOb)
					&& !isCTMHandset(runOb)
					&& !isVinyled(runOb)
					&& !is400000Part(runOb)
					&& !requiresDCHLPaperAndSpecialPlastic(runOb)
					&& !runOb.material.match(/dchl/i)
					&& !runOb.material.match(/cougar/i)
					&& !runOb.material.match(/Mohawk/i)
					&& !runOb.material.match(/cover/i)
					&& !runOb.material.match(/LBZ658500/i)
					&& !runOb.material.match(/label\s*stock/i)
					&& !runOb.material.match(/vinyl/i)
					&& !runOb.material.match(new RegExp(escapeRegExp("80#"), "i"))
					&& !runOb.production_notes.match(new RegExp(escapeRegExp(stocksAndDescriptions["white"]), "i"))
					) {
					return {footnote: [stocksAndDescriptions["white"]]};

				} else if ((runOb.material.match(/vinyl/i)
									|| runOb.material.match(/LBZ658500/i)
									|| runOb.material.match(/label\s*stock/i))
					&& !jobIsDoubleTree(jobOb)
					&& !is400000Part(runOb)
					&& !isHoliday(jobOb)
					&& !requiresDCHLPaperAndSpecialPlastic(runOb)
					&& !runOb.material.match(/dchl/i)
					&& !isCTMHandset(runOb)
					&& !runOb.material.match(/cougar/i)
					&& !runOb.production_notes.match(new RegExp(escapeRegExp(stocksAndDescriptions["twoPartAdhesive"]), "i"))
					) {
					return {footnote: [stocksAndDescriptions["twoPartAdhesive"]]};

				} else if (runOb.material.match(/cream/i)
					&& !runOb.material.match(/white/i) //needed because otherwise a "white with cream flood" would trigger cream stock
					&& !jobIsDoubleTree(jobOb)
					&& !isHoliday(jobOb)
					&& !is400000Part(runOb)
					&& !requiresDCHLPaperAndSpecialPlastic(runOb)
					&& !runOb.material.match(/dchl/i)
					&& !isCTMHandset(runOb)
					&& !isVinyled(runOb)
					&& !runOb.production_notes.match(new RegExp(escapeRegExp(stocksAndDescriptions["cream"]), "i"))
					) {
					return {footnote: [stocksAndDescriptions["cream"]]};

				} else if (runOb.material.match(/pewter/i)
					&& !runOb.material.match(/white/i) //needed because otherwise a "white with pewter flood" would trigger cream stock
					&& !jobIsDoubleTree(jobOb)
					&& !isHoliday(jobOb)
					&& !is400000Part(runOb)
					&& !requiresDCHLPaperAndSpecialPlastic(runOb)
					&& !runOb.material.match(/dchl/i)
					&& !isCTMHandset(runOb)
					&& !isVinyled(runOb)
					&& !runOb.production_notes.match(new RegExp(escapeRegExp(stocksAndDescriptions["pewter"]), "i"))
					) {
					return {footnote: [stocksAndDescriptions["pewter"]]};

				} 
				
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "the stock description listed in the production notes should be:");
		}
	},
// ------------------------------------------- here reworking paper checks into 1 test


	// {
	// 	statuses: ['proof', 'appr', 'prod'],
	// 	description: "check material field for white paper, make sure stock Desc goes in production notes",
	// 	test: function(jobOb) {
	// 		var interrogative = function(runOb) {
	// 			window.console.log("check material field for white paper called");
	// 			if (runOb.material.match(/white/i)
	// 				&& !jobIsDoubleTree(jobOb)
	// 				&& !isHoliday(jobOb)
	// 				&& !isCTMHandset(runOb)
	// 				&& !isVinyled(runOb)
	// 				&& !runOb.material.match(/cougar/i)
	// 				&& !runOb.material.match(/Mohawk/i)
	// 				&& !runOb.material.match(/cover/i)
	// 				&& !runOb.material.match(new RegExp(escapeRegExp("80#"), "i"))
	// 				&& !runOb.production_notes.match(new RegExp(escapeRegExp(stocksAndDescriptions["white"]), "i"))
	// 				) {
	// 				return {footnote: [stocksAndDescriptions["white"]]};

	// 			}
				
	// 		};

	// 		return returnMessages(jobOb.runs, interrogative, "danger", "the stock description listed in the production notes should be:");
	// 	}
	// },

	// {
	// 	statuses: ['proof', 'appr', 'prod'],
	// 	description: "check material field for cream paper, make sure stock Desc goes in production notes",
	// 	test: function(jobOb) {
	// 		var interrogative = function(runOb) {
	// 			 // 3 spots below need manual updating!
	// 			if (runOb.material.match(/cream/i)
	// 				&& !jobIsDoubleTree(jobOb)
	// 				&& !isHoliday(jobOb)
	// 				&& !isCTMHandset(runOb)
	// 				&& !isVinyled(runOb)
	// 				&& !runOb.production_notes.match(new RegExp(escapeRegExp(stocksAndDescriptions["cream"]), "i"))
	// 				) {
	// 				return {footnote: [stocksAndDescriptions["cream"]]};

	// 			}
				
	// 		};

	// 		return returnMessages(jobOb.runs, interrogative, "danger", "the stock description listed in the production notes should be:");
	// 	}
	// },

	// {
	// 	statuses: ['proof', 'appr', 'prod'],
	// 	description: "check material field for pewter paper, make sure stock Desc goes in production notes",
	// 	test: function(jobOb) {
	// 		var interrogative = function(runOb) {
	// 			 // 3 spots below need manual updating!
	// 			if (runOb.material.match(/pewter/i)
	// 				&& !jobIsDoubleTree(jobOb)
	// 				&& !isHoliday(jobOb)
	// 				&& !isCTMHandset(runOb)
	// 				&& !isVinyled(runOb)
	// 				&& !runOb.production_notes.match(new RegExp(escapeRegExp(stocksAndDescriptions["pewter"]), "i"))
	// 				) {
	// 				return {footnote: [stocksAndDescriptions["pewter"]]};

	// 			}
				
	// 		};

	// 		return returnMessages(jobOb.runs, interrogative, "danger", "the stock description listed in the production notes should be:");
	// 	}
	// },

	// {
	// 	statuses: ['proof', 'appr', 'prod'],
	// 	description: "check material field for cougar paper, make sure stock Desc goes in production notes",
	// 	test: function(jobOb) {
	// 		var interrogative = function(runOb) {
	// 			 // 3 spots below need manual updating!
	// 			if (runOb.material.match(/cougar/i)
	// 				&& !runOb.material.match(/100/)
	// 				&& !isCTMHandset(runOb)
	// 				&& !runOb.production_notes.match(new RegExp(escapeRegExp(stocksAndDescriptions["cougar"]), "i"))
	// 				) {
	// 				return {footnote: [stocksAndDescriptions["cougar"]]};

	// 			}
				
	// 		};

	// 		return returnMessages(jobOb.runs, interrogative, "danger", "the stock description listed in the production notes should be:");
	// 	}
	// },

	// {
	// 	statuses: ['proof', 'appr', 'prod'],
	// 	description: "check material field for vinyl stock paper, make sure stock Desc goes in production notes",
	// 	test: function(jobOb) {
	// 		var interrogative = function(runOb) {
	// 			 // 3 spots below need manual updating!
	// 			if (runOb.material.match(/vinyl/i)
	// 				&& !jobIsDoubleTree(jobOb)
	// 				&& !isHoliday(jobOb)
	// 				&& !isCTMHandset(runOb)
	// 				&& !runOb.material.match(/cougar/i)
	// 				&& !runOb.production_notes.match(new RegExp(escapeRegExp(stocksAndDescriptions["twoPartAdhesive"]), "i"))
	// 				) {
	// 				return {footnote: [stocksAndDescriptions["twoPartAdhesive"]]};

	// 			}
				
	// 		};

	// 		return returnMessages(jobOb.runs, interrogative, "danger", "the stock description listed in the production notes should be:");
	// 	}
	// },


	// {
	// 	statuses: ['proof', 'appr', 'prod'],
	// 	description: "check material field for double tree paper, make sure stock Desc goes in production notes",
	// 	test: function(jobOb) {
	// 		var interrogative = function(runOb) {
	// 			 // 3 spots below need manual updating!
	// 			if (jobIsDoubleTree(jobOb)
	// 				&& !isCTMHandset(runOb)
	// 				&& !runOb.production_notes.match(new RegExp(escapeRegExp(stocksAndDescriptions["doubleTreeStock"]), "i"))
	// 				) {
	// 				return {footnote: [stocksAndDescriptions["doubleTreeStock"]]};

	// 			}
				
	// 		};

	// 		return returnMessages(jobOb.runs, interrogative, "danger", "the stock description listed in the production notes should be:");
	// 	}
	// },



	
	{
		statuses: ['proof', 'appr', 'prod'],
		description: "check material field for a stock description, if found make sure production_notes contains the same description",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				var matchedStock;
				valuesArray(stocksAndDescriptions).forEach(function(stockVal) {
					var re = new RegExp(escapeRegExp(stockVal), "i");
					if (runOb.material.match(re)) {
						matchedStock = stockVal;
					}
				});
				if ((matchedStock !== undefined) && !runOb.production_notes.match(escapeRegExp(matchedStock))) {
					return {footnote: [matchedStock]};
				}
			};

			return returnMessages(jobOb.runs, interrogative, "danger", "Copy the stock description into the production_notes:");
		}
	},
	{ // here
		statuses: ['proof', 'appr', 'prod'],
		description: "If job contains a 9600 base run, and a 9600 handset run, ask user if they can be combined for printing and cutting",
		test: function(jobOb) {
			// if 
			if ((filterRuns(jobOb, is9600Handset).length > 0) && (filterRuns(jobOb, is9600Base).length > 0)) {
				return [{
					type: "info",
					msg: "You might be able to combine 9600 handset runs with 9600 base runs for printing and cutting"
				}];
			}
		}
	},
	{
		statuses: ['proof', 'appr', 'prod', 'ready', 'ship', 'paid'],
		description: "calculate overs for each non-plastic, non-400000 part",
		test: function(jobOb) {
			var interrogative = function(runOb) {
				if (isFaceplate(runOb) || isRateCard(runOb) || isTrayRemoval(runOb)) {
					var sheetsLabelsOb = calcSheetsAndLabels(runOb);
					if (isCTMHandset(runOb)) {
						return {footnote: ["sheets: " + sheetsLabelsOb.sheets + ", and labels: " + sheetsLabelsOb.labels + "********* and prints to the Vinyl Hot Folder *******"]};
					} else {
						return {footnote: ["sheets: " + sheetsLabelsOb.sheets + ", and labels: " + sheetsLabelsOb.labels]};
					}
				}
				
			};
			// here deubg:
			window.console.log(jobOb);
			return returnMessages(jobOb.runs, interrogative, "info", "will require these amounts for production.");
		}
	}

	
// TODO 10% spares test should not show for plastic runs, and mimaki runs
// mimaki runs should show up in preflight, with a special instruction list that pops up or something...footnotes should change over to an array that lists out the specific steps in some of the more detailed instructions

	// TODO implement the task below once we can match things like plastic number to paper through die numbers
	// {
	// 	statuses: ['appr', 'prod'],
	// 	description: "If a job has a plastic run, and it doesn't correspond to a paper run, throw an error.",
	// 	test: function(jobOb) {

	// 	}
	// }

]);
// var baseDie = function(dieNumber) {
// 	return dieNumber.slice(0, 4);
// };

var getConfigOb = function(pN) {
	var base4Die;
	try {
		if (!partList[pN]) {
			throw "part number " + pN + " not found in partList";
		}
		base4Die = partList[pN].slice(0, 4);
		if (!dieList[base4Die]) {
			throw "die number " + base4Die + " is not in the dieList...add it!";
		}
		return dieList[base4Die];
	} catch (e) {
		window.console.log(e);
	}
		
	
};

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
var sixUpReg = sheetCalcConfig(6, 1.17, 22);
var fourUpExpensive = sheetCalcConfig(4, 1.11, 10);
var twoUpGuilltine = sheetCalcConfig(2, 1.01, 15);

var dieList = {
	"6055": twoUpReg,
	"5326": oneUpReg,
	"5977": oneUpReg, 
	"6102": twoUpReg,
	"5989": fourUpReg,
	"6142": sixUpReg,
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
	"5983": fourUpReg,
	"5761": fourUpReg,
	"6158": fourUpExpensive,
	"0002": twoUpGuilltine,
	"5348": twoUpReg,
	"5587": twoUpReg,
	"6077": twoUpReg,
	"6078": twoUpReg,
	"5680": twoUpReg,
	"5399": twoUpReg,
	"5354": twoUpReg,
	"5774": twoUpReg,
	"5364": twoUpReg,
	"5713": oneUpReg,
	"5742": twoUpReg,
	"6020": twoUpReg,
	"5862": twoUpReg
	// "6102": unsure of configob
};
// TODO write test so that if there is a 9600 handset run, AND a 9600 run, see if you can combine them
var partList = {
	"C15220 (Variant B)": "586201",
	"C14105": "532200",
	"C16540": "578710",
	"C15620": "578501",
	"C14370": "537503",
	"C15065": "5742",
	"C15025": "571301",
	"C15390" : "595402",
	"C14160": "532402",
	"C14010": "5346",
	"C14125": "5319",
	"C14520": "536905_!",
	"IPN96359": "579116",
	"963591IP": "599101",
	"C14650": "554704",
	"C14595": "5888",
	"C14940": "566104",
	"C15505": "608804",
	"323591": "608804",
	"333391IP": "598001",
	"32359": "608804",
	"C16700": "610401",
	"601-1517-36A001": "5323",
	"EA011000S12D": "610401",
	"C16705": "610402",
	"300055": "5323",
	"C16715": "610404",
	"EA11000S08D": "610405",
	"EA011000S08D": "610405",
	"C16755": "610405",
	"C16775": "610406",
	"EA011000S04D": "610406",
	"EA012000S12D": "610407",
	"EA012000S08D": "610408",
	"EA012000S04D": "610409",
	"EA011319S12D": "610410",
	"EA011319S08D": "610411",
	"C16710": "610411",
	"EA011318S08D": "610411",
	"EA011319S04D": "610412",
	"EA012319S12D": "610413",
	"EA012319S08D": "610414",
	"EA012319S04D": "610415",
	"C16825": "610416",
	"EA011000S00T": "610416",
	"EA012000S00T": "610417",
	"C16945": "610418",
	"EA011000S05D": "610418",
	"C16890": "610419",
	"EA011000S10D": "610419",
	"C16895": "610420",
	"EA012000S5D": "610420",
	"C16900": "610421",
	"EA012000S10D": "610421",
	"C16905": "610422",
	"EA011319S05D": "610422",
	"C16910": "610423",
	"EA011319S10D": "610423",
	"C16915": "610424",
	"EA012319S05D": "610424",
	"EA012318S05D": "610424",
	"C16920": "610425",
	"EA012319S10D": "610425",
	"EA012318S10D": "610425",
	"C17030": "610426",
	"EA011000N00L": "610426",
	"C17105": "610427",
	"C14790": "53694",
	"C14045": "5437",
	"C14645": "554703",
	"300277": "5349",
	"300275": "5349",
	"300276": "5349",
	"C14070": "5349",
	"C14085": "5437",
	"C14090": "5437",
	"C14095": "5437",
	"C14045": "5437",
	"300025": "5316",
	"300026": "5316",
	"300027": "5316",
	"601-1463-00A001": "531601",
	"DIA65239": "531601",
	"C14075": "531601",
	"C14085": "5437",
	"C14090": "5437",
	"C14095": "5437",
	"C14100": "5323",
	"C15110": "5774",
	"C15450": "585210",
	"C15200": "585215",
	"C15210": "585201",
	"C15405": "585201",
	"89102": "585201",
	"89101": "585201",
	"C15215": "585202",
	"C15410": "585202",
	"89051": "585202",
	"89052": "585202",
	"89002": "585203",
	"C15415": "585203",
	"89001": "585203",
	"88102": "585204",
	"C15420": "585204",
	"88101": "585204",
	"88052": "585205",
	"C15425": "585205",
	"88051": "585205",
	"88032": "585206",
	"88031": "585206",
	"C15430": "585206",
	"80011": "585207",
	"80012": "585207",
	"C15435": "585207",
	"81002": "585208",
	"C15440": "585208",
	"81001": "585208",
	"C15445": "585209",
	"80501": "585209",
	"C14675": "554710",
	"80502": "585209",
	"80302": "585210",
	"C15450": "585210",
	"80301": "585210",
	"80002": "585211",
	"C15455": "585211",
	"80001": "585211",
	"80101": "585212",
	"C15460": "585212",
	"80102": "585212",
	"RR35327C": "585213",
	"C15205": "585214",
	"C14565": "540703",
	"DIA657391": "531101",
	"C14025": "531300",
	"C14350": "537507",
	"C14690": "536903_!",
	"C14000": "5345",
	"C14060": "5364",




	"C16825": "610416",
	"C14490": "53701",
	"C16440": "5989",
	"C15425": "585205",
	"300056": "5323",
	"C15505": "608804",
	"C15520": "5669",
	"C15525": "5669",
	"C15245": "566911",
	"OPL76009": "54323",
	"C16365": "6078",
	"300057": "5323",
	"C15310": "566901",
	"C14525": "53702_!",
	"C16370": "6077",
	"C15780": "566913",
	"C16095": "6055",
	"C16130": "566918",
	"C12745": "568003",
	"C16145": "566914",
	"C16120": "566919",
	"C16125": "566920",
	"C17235": "621839",
	"C14775": "537002_!",
	"C17260": "615804",
	"C15255": "566912",
	"C12735": "568001",
	"C15510": "608805",
	"C17185": "615801",
	"C15290": "566917",
	"601-1900-10": "537002_!",
	"C17205": "608533",
	"C17265": "615805",
	"C12740": "568002",
	"C15790": "566914",
	"C15260": "566915",
	"C16310": "621807",
	"C17250": "608542",
	"IPN965591IP-N": "578708",
	"C15195": "566916",
	"C16505": "578708",
	"IPN96559IP-N": "578708",
	"C17255": "608543",
	"IPN331491IP-N": "578707",
	"IPN33149IP-N": "578707",
	"C16525": "578707",
	"C16445": "578706",
	"IPN33339IP-N": "578705",
	"C16405": "578705",
	"C15480": "608806",
	"C17245": "608541",
	"C16385": "578704",
	"C16495": "578703",
	"IPN33749": "578703",
	"C15630": "578702",
	"C15655": "578701",
	"C14065": "5365",
	"C14050": "5312",
	"C17240": "608540",
	"C17195": "615803",
	"C14015": "5317",
	"C14940": "C14940",
	"C14405": "566102",
	"C14945": "566102",
	"C14935": "566101",
	"C15190": "566105",
	"C14950": "566103",
	"C15340": "5935003",
	"C15225": "557905",
	"C14960": "557904",
	"C14705": "557902",
	"C14810": "5579",
	"C14765": "5579",
	"C14730": "5579",
	"C14710": "5579",
	"C15350": "5935004",
	"C15100": "5579",
	"C15330": "5935001",
	"C15370": "5935",
	"C15095": "5579",
	"C15090": "5579",
	"C15085": "5579",
	"C15080": "5579",
	"C14830": "5579",
	"C14755": "557903",
	"PRL767493": "5587",
	"300270": "5587",
	"PRL767393": "5586",
	"300267": "5586",
	"300265": "5586",
	"300266": "5586",
	"C15840": "558603",
	"C17170": "613516",
	"C17165": "613515",
	"C17160": "613514",
	"C17155": "613513",
	"C17150": "613512",
	"C17145": "613511",
	"C17125": "613508",
	"C17120": "613507",
	"C17040": "613504",
	"C16770": "613503",
	"C16760": "613501",
	"C14425": "542700",
	"C14005": "5310",
	"C14220": "536904_!",
	"C15845": "558701",
	"C14640": "554702",
	"C15475": "608803",
	"C17140": "613510",
	"C15005": "529802",
	"C14815": "557918",
	"C14155": "5321",
	"C14735": "557908",
	"C15560": "529806",
	"C15395": "595403",
	"C14825": "557914",
	"C15485": "608809",
	"C15515": "608810",
	"C15555": "5298",
	"C15010": "529807",
	"C14320": "529803",
	"C14035": "531101",
	"C15015": "529811",
	"C14335": "529806",
	"C14030": "5348",
	"C14340": "529812",
	"C14435": "529801",
	"C14745": "557908",
	"C14330": "529805",
	"C14770": "529811",
	"C14310": "529810",
	"C15500": "608802",
	"C16325": "608519",
	"C14760": "557916",
	"C16330": "608518",
	"C15495": "608807",
	"C14740": "557909",
	"C14325": "529804",
	"C14315": "529808",
	"C14300": "529802",
	"C14440": "529809",
	"C14505": "54325",
	"C17200": "608532",
	"C17050": "608522",
	"C16345": "608515",
	"C16350": "608514",
	"C14720": "557910",
	"OPL760391": "54325",
	"C14820": "557912",
	"C16315": "621806",
	"C16300": "608509",
	"C16305": "608508",
	"OPL763091": "54324",
	"C14150": "5318",
	"C14750": "557906",
	"IPN76039": "54324",
	"C15680": "542702",
	"C14510": "54326",
	"C14495": "54324",
	"C16270": "606011",
	"C14175": "5326",
	"C14725": "557907",
	"C14795": "536908_!",
	"C15540": "5977",
	"C14580": "531301",
	"nug31039": "532401",
	"80002": "585211",
	"C14390": "537501",
	"C14685": "537512",
	"C14860": "557901",
	"C15535": "5935016",
	"C15530": "5935011",
	"410009": "576102",
	"C15385": "595401",
	"C15345": "5935002",
	"C14225": "53704",
	"C17220": "621836",
	"C14140": "531505",
	"C14955": "554712",
	"C14305": "529807",
	"C15355": "5935006",
	"C15325": "5935014",
	"C16595": "621820",
	"C16590": "606001",
	"C17225": "621837",
	"C17215": "621835",
	"C17110": "621830",
	"C15365": "5888",
	"C16295": "606016",
	"C16290": "606015",
	"C16605": "621821",
	"C17210": "621834",
	"C16285": "606014",
	"C16280": "606013",
	"C15285": "566906",
	"C17055": "621829",
	"C16335": "621817",
	"C15320": "5935012",
	"C16340": "621816",
	"C16275": "606012",
	"C15360": "5935010",
	"C16355": "621812",
	"C14995": "566903",
	"C15335": "5935007",
	"C15000": "566905",
	"C16360": "621811",
	"C16320": "621803",
	"IPN330091STW": "57704",
	"C17115": "621831",
	"965591HDKIT-N": "5989",
	"C14975": "566904",
	"C13170": "5399",
	"C16490": "6096",
	"C17135": "613509",
	"C17190": "615802",
	"C17230": "621838",
	"410002": "0002",
	"IPN331491IPSTW-N": "578711",
	"410001": "576101",
	"10001": "529802",
	"10526": "545701",
	"IPN337491STW": "578712",
	"19100": "6220",
	"925591HDKIT-N": "5989",
	"20011": "529808",
	"20501": "6034",
	"20511": "529809",
	"20521": "6034",
	"31009": "608806",
	"31039": "608803",
	"31039": "608803",
	"31049": "608808",
	"31139": "608801",
	"31149": "608802",
	"31239": "608809",
	"31339": "608807",
	"32049": "608810",
	"32149": "608805",
	"32359": "608804",
	"33009": "5935011",
	"33039": "5935014",
	"33139": "5935001",
	"33149": "5935003",
	"33239": "5935007",
	"33339": "5935002",
	"33739": "5935017",
	"34049": "5935010",
	"34149": "5935004",
	"34359": "5935006",
	"34859": "602401",
	"36009": "557909",
	"36039": "557903",
	"36139": "557906",
	"36149": "557904",
	"36239": "557910",
	"36339": "557907",
	"38049": "557901",
	"38149": "557902",
	"38359": "557908",
	"55239": "557918",
	"71122": "5575",
	"71126": "5575",
	"76009": "554713",
	"76039": "554703",
	"76139": "554702",
	"76149": "554712",
	"76239": "554701",
	"76339": "554704",
	"78049": "5547",
	"78149": "554709",
	"78359": "5547",
	"80001": "585211",
	"80011": "585207",
	"80012": "585207",
	"80101": "585212",
	"80102": "585212",
	"80301": "585210",
	"80302": "585210",
	"80501": "585209",
	"80502": "585209",
	"81001": "585208",
	"81002": "585208",
	"88031": "585206",
	"88032": "585206",
	"88051": "585205",
	"88052": "585205",
	"88101": "585204",
	"88102": "585204",
	"89001": "585203",
	"89002": "585203",
	"89051": "585202",
	"89052": "585202",
	"89101": "585201",
	"89102": "585201",
	"90002": "603612",
	"90102": "603613",
	"90123": "603613",
	"90301": "603611",
	"90502": "603610",
	"92559": "595401",
	"93459": "595404",
	"96459": "595402",
	"96559": "595401",
	"98002": "603608",
	"98032": "603601",
	"98052": "603607",
	"98102": "603606",
	"98459": "595404",
	"98559": "595403",
	"99051": "603604",
	"191001": "6220",
	"310091": "608806",
	"310391": "608803",
	"311391": "608801",
	"311491": "608802",
	"312391": "608809",
	"313391": "608807",
	"320491": "608810",
	"321491": "608805",
	"323591": "608804",
	"330091": "5935011",
	"330391": "5935014",
	"330491": "5935015",
	"331191": "5983",
	"331391": "5935001",
	"331491": "5935003",
	"332391": "5935007",
	"333391": "5935002",
	"340491": "5935010",
	"341491": "5935004",
	"341591": "6020",
	"343591": "5935006",
	"360091": "557909",
	"360391": "557903",
	"361391": "557906",
	"361491": "557904",
	"362391": "557910",
	"363391": "557907",
	"380491": "557901",
	"381491": "557902",
	"383591": "557908",
	"400090": "5931",
	"691191": "5888",
	"760091": "554713",
	"760391": "554703",
	"761391": "554702",
	"761491": "554712",
	"762391": "554701",
	"763391": "554704",
	"781491": "554709",
	"783591": "5547",
	"924591": "595402",
	"935591": "595403",
	"963591": "595401",
	"964591": "595402",
	"964991": "599502",
	"965591": "595401",
	"982591": "595404",
	"984591": "595404",
	"985591": "595403",
	"10011FP": "529807",
	"10501FP": "529804",
	"330091IP": "598010",
	"330391IP": "598005",
	"331491IP": "598002",
	"341491IP": "598004",
	"343591IP": "598003",
	"361491FR": "557913",
	"36239FR": "557918",
	"36339FR": "557914",
	"38359FR": "557915",
	"963591IP-NEC": "602203",
	"964591-N": "595406",
	"964591IP": "599102",
	"965591-N": "595405",
	"965591HDKIT": "5989",
	"965591IP": "599101",
	"965591IPHDKIT": "599105",
	"965591STW-N": "595407",
	"982591IP": "599104",
	"98459-N": "595404",
	"984591-N": "595404",
	"984591IP": "599104",
	"98459IP-NEC": "6022",
	"985591-N": "595403",
	"985591HDKIT": "5989",
	"985591HDKIT-N": "5989",
	"985591IP": "599103",
	"985591IPHDKIT": "599105",
	"C12170": "5555",
	"C15435": "585207",
	"C15455": "585211",
	"C17270": "606027",
	"C16000": "603801",
	"C17045": "606026",
	"C16005": "603802",
	"C16030": "576803",
	"C16265": "606010",
	"C16070": "621801",
	"C16075": "621802",
	"C16520": "576903",
	"C16260": "606020",
	"C16100": "6057",
	"C14970": "566902",
	"C16140": "566901",
	"C15605": "57702",
	"C15600": "576901",
	"C16150": "606019",
	"C16155": "606002",
	"C16160": "606003",
	"C16165": "606004",
	"C16170": "606005",
	"C16175": "606006",
	"C16180": "606007",
	"C16185": "606008",
	"C16190": "606009",
	"C16195": "608504",
	"C16200": "608505",
	"C16205": "608501",
	"C16210": "606801",
	"C16615": "608811",
	"C16840": "610204",
	"C16865": "6142",
	"C15490": "608801",
	"C17010": "615803",
	"C17030": "610426",
	"C17080": "613505",
	"C17085": "613506",
	"C17330": "6213",
	"C17340": "6214",
	"C17355": "6142",
	"DIA65009": "5317",
	"DIA65039": "5346",
	"DIA65139": "5312",
	"DIA65149": "531301",
	"DIA65239": "531601",
	"DIA65309": "5310",
	"DIA653391": "531300",
	"DIA67059": "5320",
	"DIA67149": "5318",
	"DIA67159": "5319",
	"DIA67259": "5354",
	"DIA673591": "5321",
	"EA011000N00L": "610426",
	"EA011000S00T": "610416",
	"EA011000S04D": "610406",
	"EA011000S05D": "610418",
	"EA011000S08D": "610405",
	"EA011000S10D": "610419",
	"EA011000S12D": "610401",
	"EA011318S00H": "615901",
	"EA011318S08D": "610411",
	"EA011319S00H": "615901",
	"EA011319S04D": "610412",
	"EA011319S05D": "610422",
	"EA011319S08D": "610411",
	"EA011319S10D": "610423",
	"EA011319S12D": "610410",
	"EA012000S00T": "610417",
	"EA012000S04D": "610409",
	"EA012000S08D": "610408",
	"EA012000S10D": "610421",
	"EA012000S12D": "610407",
	"EA012000S5D": "610420",
	"EA012318S05D": "610424",
	"EA012318S10D": "610425",
	"EA012319S00H": "6159",
	"EA012319S04D": "610415",
	"EA012319S05D": "610424",
	"EA012319S08D": "610414",
	"EA012319S10D": "610425",
	"EA012319S12D": "610413",
	"EA11000S08D": "610405",
	"EV011000S00T": "610204",
	"EV011000S04D": "610207",
	"EV011000S05D": "610206",
	"EV011000S07D": "610203",
	"EV011318S05D": "610306",
	"EV011318S07D": "610302",
	"EV011319S05D": "610306",
	"EV011319S07D": "610302",
	"EV011324S07D": "610302",
	"EV012000S00T": "610202",
	"EV012000S05D": "610205",
	"EV012000S07D": "610201",
	"EV012318S05D": "610307",
	"EV012318S07D": "610304",
	"IPN33029IP-N": "576903",
	"EV012319S05D": "610307",
	"EV012319S07D": "610304",
	"EV012324S07D": "610304",
	"IPN330091": "57702",
	"IPN330291IP-N": "576903",
	"IPN330391": "578601_!",
	"IPN330491": "578706",
	"IPN331391": "578501",
	"IPN331491": "578701",
	"IPN331491IP": "579115",
	"IPN332391": "578602",
	"IPN333091": "576901",
	"IPN333391": "578702",
	"IPN33339IP": "579112",
	"IPN337391": "578502",
	"IPN338491IP": "592803",
	"IPN341491": "576815",
	"IPN341491IP-N": "579128",
	"IPN34149IP-N": "579128",
	"IPN343591": "579126",
	"IPN343591IP-N": "579124",
	"IPN347491": "576809",
	"IPN692591": "576803",
	"IPN962591": "576803",
	"IPN963591IP-N": "578710",
	"IPN964591": "576803",
	"IPN964591IP-N": "578710",
	"IPN96559": "579116",
	"IPN965591IP": "579114",
	"IPN982591": "576811",
	"IPN982591IP-N": "576814",
	"IPN983591": "579107",
	"IPN98459IP-N": "576814",
	"IPN98559": "579107",
	"IPN985591IP-N": "579122",
	"MIL788491": "5326",
	"MIL788591": "532701",
	"NUG317391": "5325",
	"C14500": "54323",
	"C14800": "537003",
	"OPL761391": "54326",
	"OPL761491": "542702",
	"C16060": "537005_!",
	"C16065": "537006_!",
	"C16055": "537004_!",
	"601-1518-11": "537005_!",
	"OPL76239": "54322",
	"300211": "537004_!",
	"OPL76339": "542700",
	"OPL767491": "542701",
	"601-1802-11": "537003",
	"OPL78149": "53694",
	"C17000": "576815",
	"C14515": "54322",
	"OPL782591": "537005_!",
	"300330": "53701",
	"C15895": "5768",
	"C15905": "5768",
	"C15915": "5768",
	"601-ND1250-00": "5768",
	"601-ND1750-00": "5768",
	"601-AC9150-00": "5768003",
	"601-ND2710-00": "5768004",
	"601-ND1710-00": "5768005",
	"C15920": "5768005",
	"C15910": "5768006",
	"C15925": "5768007",
	"601-ND2750-00": "5768007",
	"C16030": "576803",
	"IPN964591": "576803",
	"IPN692591": "576803",
	"IPN962591": "576803",
	"C15930": "576808",
	"IPN347491": "576809",
	"601-A270-00-001": "576810",
	"C15645": "576810",
	"IPN984591": "576811",
	"IPN982591": "576811",
	"601-AC9250-00": "576811",
	"C16485": "576811",
	"IPN984591IP-N": "576814",
	"C16510": "576814",
	"IPN982591IP-N": "576814",
	"C17000": "576815",
	"IPN341491": "576815",
	"C16390": "576816",
	"OPL78359": "537004",
	"C14430": "54321",
	"OPL95149": "536903_!",
	"OPL95338": "537002_!",
	"OPL95339": "537008",
	"OPL76739": "54321",
	"OPL973591": "537006"
};


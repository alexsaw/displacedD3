var countries = []
,	years = []
,	types = []
,	availableCountries = {}
,	availableYears = []
,	forceH = 400
,	forceW = 530;


// when page loads for the first time, populate all the select menus and graphs
function initializeAllDataDriven (selectedCountries, selectedYears) {

	$("#nothingHappeningMessage3").hide();
	$("#nothingHappeningMessage2").hide();
	$("#nothingHappeningMessage1").hide();

	d3.json("../json/forceChartData.json", function (d) {

		for(countryName in d){
			availableCountries[countryName] = countryName
		}

		var	countryNameBondList = [];
		
		// sort countries by name and return sorted object
		var sorted = {}
		function sortObject(o) {
		    var key, a = [];

		    for (key in o) {
		        if (o.hasOwnProperty(key)) {
		            a.push(key);
		        }
		    }

		    a.sort();

		    for (key = 0; key < a.length; key++) {
		        sorted[a[key]] = o[a[key]];
		    }
		    return sorted;
		}
		sortObject(availableCountries)

		// append country select options in alphabetical order thanks to sorting
		for(k in sorted){
			$("#countryList").append("<li class="+sorted[k].replace(/\s/g, "").replace(".", "")+"><i class=\"fa fa-circle-o\"></i>"+sorted[k]+"</li>");
		}
		
		// test fadeouts for the spinners since nothing is happening right now
		$(".loadingDataInitially").fadeOut(200)
		$(".loadingMessage").fadeOut(500)
	
	// forceGraph(forceData)
	
	}); // /completion of json load

	// add years to option menu
	var thisYear = new Date().getFullYear();

	while(thisYear-- && thisYear >= 1959){
		availableYears.push(thisYear)
		$("#yearList").append("<li><i class=\"fa fa-circle-o\"></i>"+thisYear+"</li>");
	}

	// make initial selections
	var makeSelections = {

		selectDeselectAll: function () {
			$(".selectAll").click(function () {
				var all = $(this).closest(".content").find(".scrollList").children("ul").children("li");
									
				$.each(all, function () {
					if($(all).find("i").hasClass("fa-circle-o")){
						$(all).find("i").addClass("fa-check-circle-o").removeClass("fa-circle-o")
						$(all).closest(".content").find(".selectAll i").addClass("fa-check-circle-o").removeClass("fa-circle-o")
					}
					else{
						$(all).find("i").addClass("fa-circle-o").removeClass("fa-check-circle-o")
						$(all).closest(".content").find(".selectAll i").addClass("fa-circle-o").removeClass("fa-check-circle-o")
					}
				})					

			})	
		},

		selectCountries: function () {

			$("#countryList").on("click", "li", function () {
				if($(this).children("i").hasClass("fa-circle-o")){
					$(this).children("i").addClass("fa-check-circle-o").removeClass("fa-circle-o")
				}
				else{
					$(this).children("i").addClass("fa-circle-o").removeClass("fa-check-circle-o")
					if($(this).closest(".content").find(".selectAll i").hasClass("fa-circle-o")){
						// do nothing...
					}
					else{
						$(this).closest(".content").find(".selectAll i").removeClass("fa-check-circle-o").addClass("fa-circle-o");
					}
				}
				
			});
		},
		selectYears: function() {

			$("#yearList").on("click", "li", function () {
				if($(this).children("i").hasClass("fa-circle-o")){
					$(this).children("i").addClass("fa-check-circle-o").removeClass("fa-circle-o")
				}
				else{
					$(this).children("i").addClass("fa-circle-o").removeClass("fa-check-circle-o")
					if($(this).closest(".content").find(".selectAll i").hasClass("fa-circle-o")){
						// do nothing...
					}
					else{
						$(this).closest(".content").find(".selectAll i").removeClass("fa-check-circle-o").addClass("fa-circle-o");
					}
				}
				
			});
		},

		updateDataAndPassToInitialize: function() {
			$(".updateGraphs").click(function () {
				var selectedYears = $("#yearList").find(".fa-check-circle-o").closest("li");
				
				years = []
				
				$.each(selectedYears, function () {		
					years.push($(this).text())
				})
				
				var selectedCountries = $("#countryList").find(".fa-check-circle-o").closest("li");
				
				countries = []
				
				$.each(selectedCountries, function () {		
					countries.push($(this).text())
				})

				forceGraph(countries, years)
			})
		},

		hoverOverCountryNames: function () {
			var ctryName;
			var originalColor;

			// turn circle pink if name is hovered over in list
			$("#countryList").on("mouseover", "li", function () {
				$this = $(this);
				ctryName = $(this).attr("class");
				originalColor = $("circle."+ctryName).css("fill")

				if ($("circle."+ctryName).css("fill") == originalColor){
					$("circle."+ctryName).css("fill", "#FC19CE")
				}

			});

			$("#countryList").on("mouseleave", "li", function () {
				if ($(this).hasClass(ctryName)){
					$("circle."+ctryName).css("fill", originalColor)
				}

			});å
		}
	};

	makeSelections.selectCountries();
	makeSelections.selectYears();
	makeSelections.selectDeselectAll();
	makeSelections.updateDataAndPassToInitialize();
	makeSelections.hoverOverCountryNames();
}
initializeAllDataDriven();


// draw a force graph (this should be called in the initializeAllDataDriven)
function forceGraph (selectedCountries, selectedYears) {

		// run the code
		var selectedRows = []
		,	listOfAllCountries = []
		,	forceData = { "nodes": [], "links": [] };

		// create objects for force chart
		d3.json("../json/forceChartData.json", function (d) {
			for(k in selectedCountries){
				country = selectedCountries[k]
				for (y in selectedYears){
					year = selectedYears[y]
					if(d[country] !== undefined){
						if(d[country][year] !== undefined){
							for(row in d[country][year]){
								if(d[country][year] !== undefined){
									selectedRows.push(d[country][year][row])
								}				
							}							
						}
					}
				}
			}

		// run historgram creation
		

		// create list of all origins and destination, make duplicates
		for(row in selectedRows){
			dest = selectedRows[row].dest;
			origin = selectedRows[row].origin;
			listOfAllCountries.push(dest)
			listOfAllCountries.push(origin)
		}

		// remove duplicate country names from node list
		preStructureNodes = $.unique(listOfAllCountries)

		// create a list of unique country nodes and push to final object to be used by force Chart
		for (x in preStructureNodes) {
			forceData.nodes.push({"name": preStructureNodes[x]})
		}

		// add frequency of refugee, idp, asylum, others in forceData.nodes
		for(node in forceData.nodes){
			var nodeName = forceData.nodes[node].name
			
			for(row in selectedRows){
				var fullRow = selectedRows[row];
				if(nodeName == fullRow.dest){

					// add up the different types
					if(forceData.nodes[node].total == undefined){

						// initialize objecy properties
						forceData.nodes[node].refugee = 0;
						forceData.nodes[node].idp = 0;
						forceData.nodes[node].others = 0;
						forceData.nodes[node].asylum = 0;
						forceData.nodes[node].total = 0;

						

						// add refugees
						if(fullRow.refugee >= 0 && typeof(fullRow.refugee) == "number"){
							forceData.nodes[node].refugee += parseInt(fullRow.refugee);
							var num1 = parseInt(forceData.nodes[node].refugee)
							console.log(fullRow.refugee)
						}

						// add idps
						if(fullRow.idp >= 0 && typeof(fullRow.idp) == "number"){
							forceData.nodes[node].idp += parseInt(fullRow.idp);
							var num2 = parseInt(forceData.nodes[node].idp)
							console.log(fullRow.idp)
						}

						// add others
						if(fullRow.others >= 0 && typeof(fullRow.others) == "number"){
							forceData.nodes[node].others += parseInt(fullRow.others);
							var num3 = parseInt(forceData.nodes[node].others)
							console.log(fullRow.others)
						}

						// add asylum						
						if(fullRow.asylum >= 0 && typeof(fullRow.asylum) == "number"){
							forceData.nodes[node].asylum += parseInt(fullRow.asylum);
							var num4 = parseInt(forceData.nodes[node].asylum)
							console.log(fullRow.asylum)
						}

						// add totals
						forceData.nodes[node].total = num1 + num2 + num3 + num4;

					}
					else{

						// add refugees
						if(fullRow.refugee >= 0 && typeof(fullRow.refugee) == "number"){
							forceData.nodes[node].refugee += parseInt(fullRow.refugee);
							var num1 = parseInt(forceData.nodes[node].refugee)
						}

						// add idps
						if(fullRow.idp >= 0 && typeof(fullRow.idp) == "number"){
							forceData.nodes[node].idp += parseInt(fullRow.idp);
							var num2 = parseInt(forceData.nodes[node].idp)
						}

						// add others
						if(fullRow.others >= 0 && typeof(fullRow.others) == "number"){
							forceData.nodes[node].others += parseInt(fullRow.others);
							var num3 = parseInt(forceData.nodes[node].others)
						}

						// add asylum						
						if(fullRow.asylum >= 0 && typeof(fullRow.asylum) == "number"){
							forceData.nodes[node].asylum += parseInt(fullRow.asylum);
							var num4 = parseInt(forceData.nodes[node].asylum)
						}

						// add totals
						forceData.nodes[node].total = num1 + num2 + num3 + num4;
					}
				}
				else{
					
					// add up the different types
					if(forceData.nodes[node].total == undefined){
						
						// initialize object properties for origin countries
						forceData.nodes[node].refugee = 0;
						forceData.nodes[node].idp = 0;
						forceData.nodes[node].others = 0;
						forceData.nodes[node].asylum = 0;
						forceData.nodes[node].total = 0;
					}
				}
			}
		}


		// create bonds
		for(row in selectedRows){
			forceData.links[row] = {"target": null, "source": null}
			for( x in forceData.nodes ){
				if (forceData.nodes[x].name == selectedRows[row].dest && forceData.nodes[x].name == selectedRows[row].origin){
					forceData.links[row].target = parseInt(x)
					forceData.links[row].source = parseInt(x)
				}
				else if(forceData.nodes[x].name == selectedRows[row].origin){
					forceData.links[row].source = parseInt(x)
				}
				else if (forceData.nodes[x].name == selectedRows[row].dest){
					forceData.links[row].target = parseInt(x)
				}

			}
		}
		$(".loadingMessage").fadeIn(500);

		return setTimeout(function () {distributeData(forceData, selectedRows); }, 600)
	})
	
} //end of function

function distributeData (forceData, selectedRows) {
	runGraph(forceData);
	// runBars(selectedRows);
}

function runGraph (forceData) {
console.log(forceData.nodes)
	$(".loadingMessage").fadeOut(300)
	$("svg").remove();
	
	// create force chart
	var force = d3.layout.force()
					.nodes(forceData.nodes)
					.links(forceData.links)
					.charge([-140])
					.linkDistance([130])
					.size([forceW, forceH])
					.start();

	var svg = d3.select("#forceDiv").append("svg")
					.attr("width", forceW)
					.attr("height", forceH);

	var links = svg.selectAll(".bond")
					.data(forceData.links)
					.enter()
					.append("line")
					.attr("class", "bond")
					.style("stroke-width", 1)
					.style("stroke", "lightgrey");

	var nodeScale = d3.scale.linear()
					.domain([d3.min(forceData.nodes, function (d) { return d.total; }), d3.max(forceData.nodes, function (d) { return d.total; })])
					.range([3, 40]);

	var colorScale = d3.scale.linear()
					.domain([d3.min(forceData.nodes, function (d) { return d.total; }), d3.max(forceData.nodes, function (d) { return d.total; })])
					.range([40, 80]);


	var nodes = svg.selectAll(".node")
					.data(forceData.nodes)
					.enter()
					.append("circle")
					.attr("class", function (d) { return d.name.replace(/\s/g, "").replace(".", "") + " node" })
					.attr("r", function (d) { return nodeScale(d.total);})
					.style("fill", function (d) { 
						if(d.total == 0){
							return "red";
						}
						else{
							return "hsl(231, 30%, "+(colorScale(d.total))+"%)";
						}
					})
					.call(force.drag);

	function numberWithCommas(x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

	nodes.append("title")
  				.text(function(d) { return d.name+"\n Total: "+numberWithCommas(d.total)+"\n Refugees: "+numberWithCommas(d.refugee)+"\n Asylum: "+numberWithCommas(d.asylum)+"\n IDPs: "+numberWithCommas(d.idp)+"\n Other: "+numberWithCommas(d.others); }); 

	force.on("tick", function() {
		links.attr("x1", function (d) { return d.source.x; })
			 .attr("y1", function (d) { return d.source.y; })
			 .attr("x2", function (d) { return d.target.x; })
			 .attr("y2", function (d) { return d.target.y; });

		nodes.attr("cx", function (d) { return d.x; })
			 .attr("cy", function (d) { return d.y; });
	});	

}

function runBars (selectedRows) {
	var dataset = []
	
	for (x in selectedRows){
		var row = selectedRows[x]
		
		// populate first array
		if(dataset[0] == undefined){
			dataset[0] = []
			dataset[0].push({"x": parseInt(x), "y": row.refugee});
		}
		else{
			dataset[1].push({"x": parseInt(x), "y": row.refugee});		
		}	
		
		// populate second array
		if(dataset[1] == undefined){
			dataset[1] = []
			dataset[1].push({"x": parseInt(x), "y": row.others});
		}
		else{
			dataset[2].push({"x": parseInt(x), "y": row.others});		
		}	
		
		// populate third array
		if(dataset[2] == undefined){
			dataset[2] = []
			dataset[2].push({"x": parseInt(x), "y": row.idp});
		}
		else{
			dataset[3].push({"x": parseInt(x), "y": row.idp});		
		}	
		
		// populate fourth array
		if(dataset[3] == undefined){
			dataset[3] = []
			dataset[3].push({"x": parseInt(x), "y": row.asylum});
		}
		else{
			dataset[3].push({"x": parseInt(x), "y": row.asylum});		
		}
	}

	var h = 246;
	var w = 950;

	var svg = d3.select(".histogramLayoutDiv")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

	var stack = d3.layout.stack();

	var xScale = d3.scale.linear()
				.domain([0, d3.max(dataset, function (d, i) { return d; })])
				.range([0, w]);

	var yScale = d3.scale.linear()
				.domain([0, d3.max(dataset, function (d, i) { return d[0].y0; })])
				.range([0, h]);
		
	var rects = svg.selectAll("rect")
				.data(stack(dataset))
				.enter()
				.append("rect")
				.attr("x", function (d, i) { return xScale(i) })
				.attr("y", function (d, i) { return yScale(d[i].y0) })
				.attr("height", function (d, i) { return yScale(d[i].y) })
				.attr("width", function (d, i) { return w/d.length});


}

// after every user selection, wait 2 seconds then fire off a restructuring of the data
function selectCountriesAndYears () {
	availableCountries = [];
	availableYears = [];
	
}


function loadingPleaseWait (argument) {
	// body...
}

function forceChartPopover (argument) {
	
}

function histogramPopover (argument) {
	
}
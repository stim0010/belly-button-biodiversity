url = "data/samples.json"
//intialize data with the first name and populate the dropdown menu

function init() {

    d3.json(url).then(function (jsonData) {
      let data = jsonData;
  
      //Capturing the id, which we will call names for the drop-down menu
      let dNames = data.names;
      var dropDownMenu = d3.select("#selDataset");
      
      //adding the names to the dropdown menu
      dNames.forEach(function (name) {
        dropDownMenu.append("option").text(name).property("value", name);
      });
      
      //select intial name to display
      let bbSelected = "940";
      
      //use pulldata function for ID 940
      pulldata(bbSelected);
    });
  }
  

  //-----------------PullData Function----------------------//

  function pulldata(bbSelected) {
    d3.json(url).then(function (jsonData) {
      let data = jsonData;
  
      let bbTest = data.samples.filter((val) => val.id == bbSelected);

      var bbObj = bbTest[0];
  
      let otu_ids = bbObj.otu_ids;
  
      let otu_idList = [];
      for (let i = 0; i < otu_ids.length; i++) {
        otu_idList.push(`OTU# ${otu_ids[i]}`);
      }
  
      let sample_values = bbObj.sample_values;
  
      let otu_labels = bbObj.otu_labels;
  
      let bbdemo = data.metadata.filter((val) => val.id == bbSelected);
      bbdemo = bbdemo[0];
     
      //results variable
      let results = {
        idList: otu_idList,
        ids: otu_ids,
        values: sample_values,
        labels: otu_labels,
      };

      //display the graphs with pulled data 
      barGraph(results);
      bubbleGraph(results);
      createTable(bbdemo);
    });
  }
 
//----------------------Bar Graph Function-------------------------//  
  
  function barGraph(results) {

    //determine the top 10
    let otu_ids = results.idList.slice(0, 10);
    let sample_values = results.values.slice(0, 10);
    let otu_labels = results.labels.slice(0, 10);
  
    let trace = {
      x: sample_values,
      y: otu_ids,
      mode: "markers",
      marker: {
        line: {
          width: 3,
        },
      },
      orientation: "h",
      type: "bar",
    };
  
    let plotdata = [trace];
  
    let layout = {
      hoverinfo: otu_labels,
      title: {
        text: "Top 10 Belly Button Microbes",
        font: {
          size: 30,
          xanchor: "left",
          yanchor: "top",
        },
      },
      autosize: false,
      width: 800,
      height: 550,
      margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 100,
        pad: 4,
      },
      yaxis: {
        autorange: "reversed",
        automargin: true,
      },
      xaxis: {
        title: {
          text: "Number of Belly Button Microbes",
          font: {
            size: 11,
          },
        },
      },
    };
  
    let config = {
      responsive: true,
    };
  
    Plotly.newPlot("bar", plotdata, layout, config);
  }
  
  //------------------Bubble Graph Function-----------------------//
  
  function bubbleGraph(results) {
    let otu_ids = results.ids;
    let sample_values = results.values;
    let otu_labels = results.labels;
  
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      text: otu_labels,
      marker: {
        size: sample_values,
        color: otu_ids
      },
    };
  
    var data = [trace1];
  
    var layout = {
      title: "OTU ID vs Sample Value",
      showlegend: false,
      height: 1000,
      width: 1200,
    };
  
    var config = {
      responsive: true,
    };


    Plotly.newPlot("bubble", data, layout, config);
  }
  
  //---------------------Info Table Function-------------------------//
  
  function createTable(bbdemo) {
    let body = document.getElementsByClassName("panel-body")[0];
    let table = document.createElement("table");
    table.setAttribute("id", "table");
  
    let tableBody = document.createElement("tbody");
  
    Object.entries(bbdemo).forEach(function ([key, value]) {
  
      let row = document.createElement("tr");
  
      let key_cell = document.createElement("td");
      key_cell.style.fontWeight = "bold";
      key_cell.style.padding = "5px";
      key_cell.style.fontSize = "20";
  
      let key_text = document.createTextNode(`${key}:`);
      key_cell.appendChild(key_text);
      row.appendChild(key_cell);
  
      let value_cell = document.createElement("td");
      value_cell.style.padding = "5px";
      value_cell.style.fontSize = "20";
      let value_text = document.createTextNode(`${value}`);
      value_cell.appendChild(value_text);
      row.appendChild(value_cell);
  
      tableBody.append(row);
    });
  
    table.appendChild(tableBody);
    body.appendChild(table);
  }
  
 
  //-------------------------------------------------------//

  init();
  
  d3.selectAll("#selDataset").on("change", subjectChanged);
  
  function subjectChanged() {
    let bbSelected = d3.select("#selDataset").node().value;
  
    d3.selectAll("#table").remove();
  
    pulldata(bbSelected);
  }

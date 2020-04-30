var AppView = Backbone.View.extend({

  el: '#container',

  events: {
    'change .graph-type' : 'changeGraphType'
  },

  initialize: function(){
    var thisObj = this;
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(thisObj.librayLoaded,thisObj);
    this.textObj = {
      sales: 'Sales',
      orders: 'Orders',
      pageViews: 'Page Views',
      clickThruRate: 'Click through rate'
    }
  },

  librayLoaded: function(){
    this.appView.render();
  },

  changeGraphType: function(event){
    this.plotGraph(event.target.value);
  },

  drawBasic: function(rowData,type){
    var data = new google.visualization.DataTable();
    data.addColumn('string','X');
    data.addColumn('number',this.textObj[type]);

    data.addRows(rowData);

    var options = {
      width: 1200,
      height: 500,
      pointSize: 5,
      title: type,
      legend: { position: 'top', alignment: 'center' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('graph'));

    chart.draw(data, options);
  },

  plotGraph(type){
    var thisObj = this;
    var filteredData = [];
    if(reportModel.attributes.records){
      reportModel.attributes.records.forEach((val) => {
        filteredData.push([val.date,val[type]]);
      });
      this.drawBasic(filteredData,type);
    }else{
      fetch('./report.json').then(response => { return response.json()}).then(result => {
        reportModel.set(result);
        thisObj.plotGraph(type);
      })
    }
  },

  render: function(){
    this.plotGraph($('.graph-type').val());
  }
})

var ReportModel = Backbone.Model.extend({});
var reportModel = new ReportModel();

var appView = new AppView();

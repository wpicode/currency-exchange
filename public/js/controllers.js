
var rawResults;
var app = angular.module('myApp', []);
app.controller('myCtrl',['$scope','$interval','$sce','$http', function($scope,$interval,$sce,$http) {
    $scope.sort = 'currency';
    $scope.results = [];
    $scope.highlight ='';
    $scope.headerClass ='';
    $scope.mainClass ='';
    $http.get("/api/currencies").then(function(response) {
        rawResults = response.data;

        console.log( response);
        var i = 0;
        angular.forEach( rawResults, function(item, date) {
            var ic =0;
             angular.forEach(item.rates, function(rate,key){
                rate = rate.toFixed(4);
                if(i>0){
                    var rates = $scope.results[ic].rates; rates.push(rate);
                    var dates = $scope.results[ic].dates; dates.push(date);
                     $scope.results[ic].rate = rate; 
                    //console.log(dates);
                    //$scope.results[i] = {'currency':key, 'rates':rates , 'dates':dates};
                } else {
                    $scope.results.push({'currency':key, 'rates':[rate], 'dates':[date] });
                   
                }
                ic++;
            });
            i++;
        });

        var i =0;
        var highest = -10; var lowest = 10;
        var lowestKey =0; var highestKey = 0;
        angular.forEach( $scope.results, function(val, key) {
            $scope.results[key].perc = (($scope.results[key].rates[0]-$scope.results[key].rates[1])/$scope.results[key].rates[0])*100;        
            if($scope.results[key].perc > highest){
                highest = $scope.results[key].perc ;
                highestKey = key;
            } 
            if($scope.results[key].perc <lowest){
                lowest =$scope.results[key].perc ;
                lowestKey = key;
            } 
            $scope.results[key].rate =parseFloat($scope.results[key].rates[0]);
        });
        $scope.results[highestKey].highlight = 'highlight-blue';
        $scope.results[lowestKey].highlight = 'highlight-red';
        console.log($scope.results);
    });
        
    $scope.showChart  = function(currency){
        console.log(currency);
        $scope.mainClass ='main';
        $scope.headerClass= 'open';
        setTimeout(function() {
            var key = 0; var i =0;
            angular.forEach( $scope.results, function(val, k) {
                if($scope.results[k].currency == currency)
                    key =i;
                i++;
            });
            require.config({
                paths: {
                    echarts: 'http://echarts.baidu.com/build/dist'
                }
            });
            
            // use
            require(
                [
                    'echarts',
                    'echarts/chart/line' // require the specific chart type
                ],
                function (ec) {
                    console.log(key);
                    // Initialize after dom ready
                    var myChart = ec.init(document.getElementById('main')); 
                        console.log($scope.results[key]);
                        var numbers = $scope.results[key].rates;
                        var max = Math.max(numbers);
                        var min = Math.min(numbers);
                    var option = {
                        grid:{
                            x:50,
                            y:20,
                            width:'90%'
                        },
                        tooltip: {
                            show: true,
                            formatter: 'Date: {b} <br>Exchange rate: {c}'
                        },
                        legend: {
                            show: false,
                            data:['Timeline']
                        },
                        xAxis : [
                            {
                                type : 'category',
                                data : $scope.results[key].dates,
                                axisLabel : {
                                    show:true,
                                    interval: 'auto',    // {number}
                                    rotate: -15,
                                    margin: 8,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                scale:true,
                                min: min.toFixed(4),
                                max:max.toFixed(4),
                                axisLabel : {
                                    show:true,
                                    interval: 'auto',    // {number}
                                    rotate: -15,
                                    margin: 8,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            }
                        ],
                        color:[ '#fff'],
                        series : [
                            {
                                "name":"Timeline",
                                "type":"line",
                                "data":$scope.results[key].rates
                            }
                        ]
                    };
            
                    // Load data into the ECharts instance 
                    myChart.setOption(option); 
                }
            );
        },1100);
    }

}]);


app.filter("toArray", function(){
    return function(obj) {
        var result = [];
        angular.forEach(obj, function(val, key) {
            result.push(val);
        });
         return result.reverse();
    };
});


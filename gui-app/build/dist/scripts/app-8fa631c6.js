/**
 * generator-cg-gas - Yeoman Generator for Enterprise Angular projects, with Gulp Angular Sass
 * @version v3.3.4
 * @link https://github.com/Lunatic83/generator-cg-gas
 * @license 
 */
!function(){function configure($urlRouterProvider,$locationProvider){$locationProvider.html5Mode({enabled:!1,requireBase:!1}),$urlRouterProvider.otherwise("/")}function runBlock($rootScope){$rootScope.safeApply=function(fn){var phase=$rootScope.$$phase;"$apply"===phase||"$digest"===phase?fn&&"function"==typeof fn&&fn():this.$apply(fn)}}angular.module("tsp",["ui.bootstrap","ui.utils","ui.router","ui.slider","ngAnimate","ngResource","templates","tsp.main"]).config(configure).run(runBlock),configure.$inject=["$urlRouterProvider","$locationProvider"],runBlock.$inject=["$rootScope"]}(),function(module){try{module=angular.module("templates")}catch(err){module=angular.module("templates",[])}module.run(["$templateCache",function($templateCache){"use strict";$templateCache.put("modules/main/partial/index/index.html",'<div class="row">\n    <div class="col-lg-12">\n        <h1>Solve TSP with firefly solver</h1>\n\n        <div class="row">\n            <div class="col-lg-12">\n                <form class="form-horizontal">\n                    <div class="panel panel-info">\n                        <div class="panel-heading">Main configuration</div>\n                        <div class="panel-body">\n                            <div class="form-group">\n                                <label for="fCount" class="col-sm-2 control-label">TSP input file:</label>\n\n                                <div class="col-sm-10">\n                                    <textarea class="form-control" id="fInputFile" ng-model="vm.parameters.tsplib_data"\n                                              rows="4"/>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n\n\n                    <div class="panel panel-info" ng-repeat="c in vm.configurations">\n                        <div class="panel-heading">Configuration {{$index + 1}}.</div>\n                        <div class="panel-body">\n                            <div class="form-group">\n                                <label for="fCount" class="col-sm-2 control-label">Firefly count:</label>\n\n                                <div class="col-sm-10">\n                                    <input type="number" class="form-control" id="fCount"\n                                           ng-model="c.number_of_individuals">\n                                </div>\n                            </div>\n                            <div class="form-group">\n                                <label for="fIterationsCount" class="col-sm-2 control-label">Iterations count:</label>\n\n                                <div class="col-sm-10">\n                                    <input type="number" class="form-control" id="fIterationsCount"\n                                           ng-model="c.iterations">\n                                </div>\n                            </div>\n                            <div class="form-group">\n                                <label class="col-sm-2 control-label">Heuristics configuration:</label>\n\n                                <div class="col-sm-10">\n                                    <div style="margin-top: 10px" ui-slider="{range: true}" min="0" max="1.00"\n                                         step="0.01" use-decimals ng-model="c.slider"></div>\n                                    <div style="margin-top: 10px">\n                                        <span class="label label-default">Nearest neighbour: {{c.heurestics.nearest_neighbour}}</span>\n                                        <span class="label label-default">Nearest insertion: {{c.heurestics.nearest_insertion}}</span>\n                                        <span class="label label-default">Random: {{c.heurestics.random}}</span>\n                                    </div>\n                                </div>\n                            </div>\n\n                        </div>\n                    </div>\n                    <div class="form-group">\n                        <div class="col-sm-offset-2 col-sm-10 text-center">\n                            <button type="submit" class="btn btn-default" ng-click="vm.addConfiguration()">Add\n                                configration\n                            </button>\n                            <button type="submit" class="btn btn-primary" ng-click="vm.run()"\n                                    ng-show="!vm.running && vm.configurations.length > 0">Run It\n                            </button>\n                            <button type="submit" class="btn btn-danger" ng-click="vm.stop()"\n                                    ng-show="vm.running && vm.configurations.length > 0">Stop It\n                            </button>\n                        </div>\n                    </div>\n                </form>\n            </div>\n        </div>\n        <div class="row">\n            <div class="col-lg-6" ng-repeat="r in vm.results">\n                <div class="panel panel-default">\n                    <div class="panel-heading">\n                        <span>Configuration {{$index + 1}}</span>\n                        <span class="label label-danger">Solution: {{r.route_cost}}, Iteration: {{r.iteration}}</span>\n                        <span class="label label-default" ng-show="!r.done">Running...</span>\n                    </div>\n                    <div class="panel-body">\n                        <graph nodes="r.route" class="graph-workspace"></graph>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div class="row">\n            <div class="col-lg-12">\n                <chart configurations="vm.chartConfig" results="vm.results"></chart>\n            </div>\n        </div>\n    </div>\n</div>\n')}])}(),function(){angular.module("tsp.main",["ui.bootstrap","ui.utils","ui.router","ngAnimate"]),angular.module("tsp.main").config(["$stateProvider",function($stateProvider){$stateProvider.state("main",{url:"/",templateUrl:"modules/main/partial/index/index.html",controller:"IndexCtrl",controllerAs:"vm"})}])}(),function(){function IndexCtrl(SolverService,$scope,$q){function run(){var jobs=[];vm.chartConfig=[],vm.running=!0;var i=0;_.forEach(vm.configurations,function(conf){i++;var request={tsplib_data:vm.parameters.tsplib_data,number_of_individuals:conf.number_of_individuals,iterations:conf.iterations,heurestics:conf.heurestics};vm.chartConfig.push({label:"Configuration "+i,color:colors[i-1]});var deferred=$q.defer();SolverService.run(request,function(data){deferred.resolve(data)}),jobs.push(deferred.promise)}),$q.all(jobs).then(function(result){vm.results=result,startPolling(result)})}function addConfiguration(){vm.configurations.push({number_of_individuals:25,iterations:200,slider:[.3,.6],heurestics:{nearest_neighbour:.2,nearest_insertion:.6,random:.2}})}function startPolling(confs){interval=setInterval(function(){var results=[];_.forEach(confs,function(c){var deferred=$q.defer();SolverService.state({id:c.id},function(data){deferred.resolve(data)}),results.push(deferred.promise)}),$q.all(results).then(function(results){if(vm.running){vm.results=results;var allDone=_.every(results,function(r){return r.done});allDone&&(clearInterval(interval),vm.running=!1)}})},300)}function stop(){clearInterval(interval),vm.running=!1,vm.results=[]}var vm=this;vm.run=run,vm.stop=stop,vm.addConfiguration=addConfiguration,vm.configurations=[],vm.parameters={tsplib_data:""},vm.results=[],vm.running=!1,vm.chartConfig=[];var interval=null,colors=["rgba(247,221,134,1)","rgba(235,158,104,1)","rgba(230,124,116,1)","rgba(99,98,128,1)","rgba(78,145,144,1)"];$scope.$watch("vm.configurations",function(newData){_.forEach(newData,function(c){var firstPart=c.slider[0],secondPart=c.slider[1];c.heurestics={nearest_neighbour:Math.round(100*firstPart)/100,nearest_insertion:Math.round(100*(1-secondPart))/100,random:Math.round(100*(secondPart-firstPart))/100}})},!0)}angular.module("tsp.main").controller("IndexCtrl",IndexCtrl),IndexCtrl.$inject=["SolverService","$scope","$q"]}(),function(){function SolverService($resource){return $resource("/:type/:id",{},{run:{method:"POST",isArray:!1,params:{type:"run"}},state:{method:"GET",isArray:!1,params:{type:"state"}}})}angular.module("tsp.main").factory("SolverService",SolverService),SolverService.$inject=["$resource"]}(),function(){function GraphDirective(){return{restrict:"E",scope:{nodes:"=nodes"},link:function($scope,element,attrs,fn){function tick(){path.attr("d",function(d){var sourceX=4*Number(d.source.x),sourceY=4*Number(d.source.y),targetX=4*Number(d.target.x),targetY=4*Number(d.target.y);return"M"+sourceX+","+sourceY+"A0,0 0 0,1 "+targetX+","+targetY})}function createLinks(nodes){var current,last,links=[];return _.forEach(nodes,function(node){void 0==current?current=node:(last=current,current=node,links.push({source:last,target:current}))}),links.push({source:current,target:nodes[0]}),links}var path,circle,width=$(element).width(),height=$(element).height(),svg=d3.select($(element).get(0)).append("svg:svg").attr("width",width).attr("height",height);svg.append("svg:defs").selectAll("marker").data(["suit","licensing","resolved"]).enter().append("svg:marker").attr("id",String).attr("viewBox","0 -5 10 10").attr("refX",15).attr("refY",-1.5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto").append("svg:path").attr("d","M0,-5L10,0L0,5"),$scope.$watch("nodes",function(nodes){var links=createLinks(nodes);void 0!=path&&path.remove(),void 0!=circle&&circle.remove(),path=svg.append("svg:g").selectAll("path").data(links).enter().append("svg:path").attr("class",function(d){return"link "+d.type}),circle=svg.append("svg:g").selectAll("circle").data(nodes).enter().append("svg:circle").attr("r",6).attr("cx",function(d){return 4*Number(d.x)}).attr("cy",function(d){return 4*Number(d.y)}),tick()},!0)}}}angular.module("tsp.main").directive("graph",GraphDirective)}(),function(){function chart(){return{restrict:"E",scope:{configurations:"=configurations",results:"=results"},link:function(scope,element,attrs,fn){var chart;scope.$watch("configurations",function(configurations){if(!(void 0==configurations||configurations.length<=0)){var i=0,datasets=_.map(configurations,function(conf){return i++,{label:conf.label,strokeColor:conf.color,pointHighlightStroke:conf.color,data:[]}}),data={labels:[],datasets:datasets},canvas=$("<canvas/>");canvas.width("100%"),canvas.height("350px");var ctx=canvas.get(0).getContext("2d");$(element).children().remove(),$(element).append(canvas),console.log(configurations),console.log(data),chart=new Chart(ctx).Line(data,{bezierCurve:!1,datasetFill:!1})}},!0),scope.$watch("results",function(results){if(!(void 0==results||results.length<=0)){var data=_.filter(results,function(x){return void 0!=x.route_cost}).map(function(result){return result.route_cost});void 0==data||data.length<=0||chart.addData(data,"")}},!0)}}}angular.module("tsp.main").directive("chart",chart)}();
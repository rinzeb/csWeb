module FeatureRelations { export var html = '<div style="max-width: 355px">    <style>        .relationgroup-title {            font-size: 18px;            font-weight: bold;        }        .relation-title {            font-size: 16px;        }    </style>    <h4 class="rightpanel-header">        <img data-ng-if="icon" data-ng-src="{{icon}}" width="24" height="24" style="margin-left:5px" alt="Icon" />        &nbsp;&nbsp;{{title}}    </h4>    <div class="container-fluid-rightpael-tabs" style="position:relative">        <div id="relations" class="rightpanel-content" style="top:50px; width:355px; overflow-y: auto; overflow-x: hidden" resize resize-y="150">            <div ng-repeat="group in vm.relations" style="margin-left:20px">                <div style="float: left; margin-left: -5px; margin-top: 5px" data-toggle="collapse" data-target="#relationgroup_{{group.id}}"><i class="fa fa-chevron-down togglebutton toggle-arrow-down"></i><i class="fa fa-chevron-up togglebutton toggle-arrow-up"></i></div>                <div class="relationgroup-title">{{group.title}}</div>                <div id="relationgroup_{{group.id}}" class="collapse in">                    <div ng-repeat="relation in group.relations" style="margin-bottom: 5px">                        <img data-ng-if="relation.icon" data-ng-src="{{relation.icon}}" width="24" height="24" style="margin-left:5px; " alt="Icon" />                        <a class="relation-title" ng-click="vm.selectRelation(relation)">                            {{relation.title}}                        </a>                    </div>                </div>            </div>        </div>    </div></div>'; }
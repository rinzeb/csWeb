module Timeline { export var html = '<div>    <style>        #timeline {            position: absolute;            bottom: 0;            height: 100px;            width: 100%;            background: white;        }        .callout.top::before {            left: 45%;            bottom: -20px;            border-top: 10px solid #444;        }        .callout::before {            content: "";            width: 0px;            height: 0px;            border: 0.8em solid transparent;            position: absolute;        }        .focustimeButton {            margin: 3px;            cursor: pointer;        }        #focustimeContainer {            width: 150px;            cursor: e-resize;            height: 75px;            right: 200px;            bottom: 105px;            color: white;            position: absolute;            z-index: 1000;            /* float: right; */            display: block;        }        .timelineControl {            background: black;            height: 23px;        }        .isPlaying {            background: gray;        }        .showControl {            height: 75px;        }        .focustimeText {            text-align: center;            background: #444;            bottom: 0;            position: absolute;            width: 100%;            height: 52px;        }        .pinButton {            color: red;        }    </style>    <div>        <div id="timelinecontainer">            <div id="timeline"></div>        </div>        <div class="callout top" id="focustimeContainer" ng-class="{showControl : vm.showControl}" ng-mouseenter="vm.mouseEnter()" ng-mouseleave="vm.mouseLeave()">            <div ng-show="vm.showControl" class="timelineControl" ng-class="{isPlaying : vm.isPlaying}">                <div ng-hide="vm.isPlaying" class="fa fa-play focustimeButton" ng-click="vm.start()"></div>                <div ng-show="vm.isPlaying" class="fa fa-stop focustimeButton" ng-click="vm.stop()"></div>                <div style="float:right">{{vm.$layerService.project.timeLine.levelName}}</div>                <!--<div ng-hide="vm.isPinned" class="fa fa-thumb-tack focustimeButton pinButton" ng-class="{isPinned : vm.isPinned}" ng-click="vm.pinToNow()"></div>-->            </div>            <div class="focustimeText">                <span style="font-weight: bold">{{vm.focusDate | date:"MM/dd/yyyy"}}</span><br />                <span>{{vm.focusDate | date:"h:mma"}}</span>            </div>        </div>    </div></div>'; }
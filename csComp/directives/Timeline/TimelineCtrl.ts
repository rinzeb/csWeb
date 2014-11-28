module Timeline {

    declare var links;
    
   
    export interface ITimelineScope extends ng.IScope {
        vm: TimelineCtrl;
        numberOfItems: number;
        timeline: any;        
        
    }

    

    export class TimelineCtrl {
        private scope: ITimelineScope;
        
        // $inject annotation.   
        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        public static $inject = [
            '$scope',
            'layerService',
            'mapService',
            'messageBusService'
        ];

        public focusDate: Date;
        public startDate: Date;
        public endDate: Date;

        public timer: any;
        public isPlaying: boolean;
        public showControl : boolean;
        public isPinned : boolean;


        // dependencies are injected via AngularJS $injector 
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope: ITimelineScope,
            private $layerService: csComp.Services.LayerService,
            private $mapService  : csComp.Services.MapService,
            private $messageBusService: csComp.Services.MessageBusService
            ) {
            $scope.vm = this;

            //$scope.focusDate = $layerService.project.timeLine.focusDate();

            // Options voor de timeline
            var options = {
                'width': '100%',
                'height': '100px',
                'editable': false,
                'layout': 'box'
            };
            
            $scope.timeline = new links.Timeline(document.getElementById('timeline'), options);
            this.$layerService.timeline = $scope.timeline;

            $scope.timeline.draw();
            links.events.addListener($scope.timeline, 'rangechange', _.throttle((prop) => this.onRangeChanged(prop),200));
            (<any>$("#focustimeContainer")).draggable({
                axis: "x",
                containment: "parent",
                drag: _.throttle(() => this.updateFocusTime(), 200)
        });

            this.updateFocusTime();
        }

        public onRangeChanged(properties) {            
            this.updateFocusTime();

        }

        public start() {
            this.stop();
            this.isPlaying = true;
            if (this.timer) this.timer = null;
            this.timer = setInterval(()=> { this.myTimer(); }, 500);

            
        }

        public myTimer() {
            this.$scope.timeline.move(0.005);
            this.updateFocusTime();

        }

        public mouseEnter() {
            this.showControl = true;
        }

        public mouseLeave() {
            if (!this.isPlaying) this.showControl = false;
             
        }

        public pinToNow() {
            this.isPinned = true;
            this.start();
        }

        public stop() {
            this.isPlaying = false;
            if (this.timer) clearInterval(this.timer);
            
        }

        public updateFocusTime() {
            var tl = this.$scope.timeline;
            tl.showCustomTime = true;
            tl.setCustomTime = new Date(2014,11,27,20,40,0);
            var tc1 = $("#focustimeContainer").offset().left;
            var tc2 = $("#timelinecontainer").offset().left - 15; // + 55;
            var centerX = tc1 - tc2 + $("#focustimeContainer").width() / 2;
            var end = $("#timeline").width;

            var range = this.$scope.timeline.getVisibleChartRange();

            this.focusDate = new Date(this.$scope.timeline.screenToTime(centerX));
            this.startDate = range.start; //new Date(range.start); //this.$scope.timeline.screenToTime(0));
            this.endDate = range.end; //new Date(this.$scope.timeline.screenToTime(end));


            if (this.$layerService.project != null && this.$layerService.project.timeLine != null) {
                this.$layerService.project.timeLine.setFocus(this.focusDate,this.startDate,this.endDate);
            }
            this.$messageBusService.publish("timeline", "focusChange", this.focusDate);
            //this.$layerService.focusTime = new Date(this.timelineCtrl.screenToTime(centerX));
            //this.$scope.$apply();


        }

  


    }
} 
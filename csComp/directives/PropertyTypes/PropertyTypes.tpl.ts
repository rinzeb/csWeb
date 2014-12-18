module PropertyTypes { export var html = '<div><h4 class="rightpanel-header">    &nbsp;&nbsp;Verander PropertyTypes</h4><div class="tab-content" style="top:50px; width:355px; overflow-y: auto; overflow-x: hidden" resize resize-y="150">    <table class="table table-condensed">        <tr>            <td></td>            <td>                <div class="row">                    <div class="col-md-9">                        <select ng-model="selectedFeature" ng-change="filterProperty(selectedFeature)" ng-options="key for (key, feature) in vm.$layerService.project.featureTypes" class="form-control">                            <option value="">-- Alle property types --</option>                        </select>                    </div>                    <div class="col-md-2">                        <button class="btn btn-primary" data-ng-click="searchEnabled=!searchEnabled"><i class="fa fa-search"></i></button>                    </div>                </div>            </td>        </tr>        <tr ng-show="searchEnabled">            <td></td>            <td>                <input type="text" data-ng-model="search.title" class="form-control" placeholder="Zoeken.." />            </td>        </tr>        <tr data-ng-repeat="propertyType in propertyTypes | filter:search track by $index" data-ng-init="getSections()">            <td data-ng-click="enabled=!enabled">                <a data-ng-class="enabled ? \'fa fa-caret-right makeNarrow\' : \'fa fa-caret-down makeNarrow\'" style="cursor:pointer;"></a>            </td>            <td>                <div data-ng-class="enabled ? \'bold\' : \'\'" data-ng-click="enabled=!enabled" style="cursor: pointer;">{{ propertyType.title }}</div>                <div data-ng-if="enabled">                    <div class="row">                        <div class="col-md-6">                            <div class="rightpanel-label">Titel</div>                            <input type="text" data-ng-model="propertyType.title" class=" form-control">                        </div>                        <div class="col-md-6">                            <div class="rightpanel-label">Property</div>                            <input type="text" data-ng-model="propertyType.label" class="form-control">                        </div>                    </div>                    <div class="row">                        <div class="col-md-6">                            <div class="rightpanel-label">Beschrijving</div>                            <input type="text" data-ng-model="propertyType.description" class="form-control">                        </div>                        <div class="col-md-6">                            <div class="rightpanel-label">Type</div>                            <select data-ng-model="propertyType.type" ng-options="item for item in [\'bbcode\', \'color\', \'date\', \'number\', \'text\']" class="form-control"></select>                        </div>                    </div>                    <div class="row">                        <div class="col-md-6" style="margin-left: 20px;">                            <div class="checkbox checkbox-primary">                                <input type="checkbox" data-ng-model="propertyType.canEdit" id="canEdit-{{propertyType.title}}" />                                <label for="canEdit-{{propertyType.title}}">Bewerkbaar</label>                            </div>                        </div>                        <div class="col-md-4" style="margin-left: 20px;">                            <div class="checkbox checkbox-primary">                                <input type="checkbox" data-ng-model="propertyType.isSearchable" id="isSearchable-{{propertyType.title}}" />                                <label for="isSearchable-{{propertyType.title}}">Vindbaar</label>                            </div>                        </div>                    </div>                    <div class="row">                        <div class="col-md-6" style="margin-left: 20px;">                            <div class="checkbox checkbox-primary">                                <input type="checkbox" data-ng-model="propertyType.visibleInCallOut" id="visibleInCallOut-{{propertyType.title}}" />                                <label for="visibleInCallOut-{{propertyType.title}}">Zichtbaar</label>                            </div>                        </div>                        <div class="col-md-4" style="margin-left: 20px;">                            <div class="checkbox checkbox-primary">                                <input type="checkbox" data-ng-model="propertyType.isSensor" id="isSensor-{{propertyType.title}}" />                                <label for="isSensor-{{propertyType.title}}">Sensor</label>                            </div>                        </div>                    </div>                    <div class="row">                        <div class="col-md-12">                            <form class="form-inline">                                <div class="rightpanel-label">Sectie</div>                                <input type="text" ng-enter="addSection(propertyType.section)" data-ng-model="propertyType.section" style="width: 200px;" class="form-control" />                                <div class="btn-group">                                    <button class="btn dropdown-toggle" data-toggle="dropdown">                                        <span class="caret"></span>                                    </button>                                    <ul class="dropdown-menu">                                        <div ng-repeat="section in sections track by $index">                                            <div style="cursor: pointer; margin-left: 4px;" data-ng-click="propertyType.section=section"><i class="fa fa-angle-right"></i> {{ section }}</div>                                        </div>                                    </ul>                                </div>                            </form>                        </div>                        <div class="col-md-6" style="margin-left: 20px;" ng-show="propertyType.type == \'date\'">                            <div class="checkbox checkbox-primary">                                <input type="checkbox" data-ng-model="propertyType.addToTimeline" id="addToTimeline-{{propertyType.title}}" />                                <label for="addToTimeline-{{propertyType.title}}">Tijdlijn</label>                            </div>                        </div>                        <div class="col-md-12" ng-show="propertyType.type == \'number\'">                            <div class="rightpanel-label">Min/max waarde</div>                            <div class="row">                                <div class="col-md-6">                                    <input type="number" data-ng-model="propertyType.min" class="form-control" placeholder="Min">                                </div>                                <div class="col-md-6">                                    <input type="number" data-ng-model="propertyType.max" class="form-control" placeholder="Max">                                </div>                            </div>                        </div>                    </div>                    <button class="btn btn-primary rightpanel-button" type="submit">Opslaan</button>                </div>            </td>        </tr>    </table></div></div>'; }
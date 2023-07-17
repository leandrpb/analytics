sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"./Popover1", "./Popover2", "./Popover4", "./Popover5",
	"./utilities",
	"sap/ui/core/routing/History",
	'sap/ui/model/Filter'
], function(Controller,
	JSONModel,
	MessageBox,
	Popover1,
	Popover2,
	Popover4,
	Popover5,
	utilities,
	History,
	Filter) {
	"use strict";

	return Controller.extend("com.sap.build.standard.salesOrderAnalysis.controller.Page1", {

		handleRouteMatched: function(oEvent) {
			var sAppId = "App64b04da02b8b63015356ca4e";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function(oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},

		onBarClick: function(oControlEvent)
		{

			let sCustomerNameClicked = oControlEvent.getParameters().bar.getLabel();

			let jModel = new JSONModel();

            let oModel = this.getOwnerComponent().getModel();

			let oFilter = new Array();

			oFilter[0] = new Filter("CustomerID", sap.ui.model.FilterOperator.EQ, 'USCU_L03');

			//let sCaminho = oModel.create("/CustomerSalesYearSet", {CustomerID: 'USCU_L03'});

			let oChartID = this.getView().byId("ChartID");

			debugger;

			//VER A MERDA DO RANGE AMANHA

		//	oChartID.bindPoints(oModel.read(sCaminho));
		    oChartID.bindElement({path: '/CustomerSalesYearSet', filters: oFilter});


		},

		_parseValue: function(sInformedValue) {
			
			debugger;

			return parseFloat(sInformedValue);

		},
		_onFioriAnalyticalListPageHeaderActionsSelectionChange: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var item = oEvent.getParameters();
			if (item && item.getKey) {
				var key = item.getKey();
				oModel.setProperty('/filterHeaderOption', key);
			}

		},
		_onFioriAnalyticalListPageHeaderActionsPress: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var key = oEvent.getSource().getProperty('key');
			oModel.setProperty('/filterHeaderOption', key);

		},
		_onFioriAnalyticalListPageHeaderActionsPress1: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var key = oEvent.getSource().getProperty('key');
			oModel.setProperty('/filterHeaderOption', key);

		},
		_onFioriAnalyticalListPageKpiPress: function(oEvent) {

			var sPopoverName = "Popover1";
			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];

			if (!oPopover) {
				oPopover = new Popover1(this.getView());
				this.mPopovers[sPopoverName] = oPopover;

				oPopover.getControl().setPlacement("Auto");

				// For navigation.
				oPopover.setRouter(this.oRouter);
			}

			var oSource = oEvent.getSource();

			oPopover.open(oSource);

		},
		_onFioriAnalyticalListPageVisualFilterItemDonutChartPress: function(oEvent) {

			var sPopoverName = "Popover2";
			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];

			if (!oPopover) {
				oPopover = new Popover2(this.getView());
				this.mPopovers[sPopoverName] = oPopover;

				oPopover.getControl().setPlacement("Bottom");

				// For navigation.
				oPopover.setRouter(this.oRouter);
			}

			var oSource = oEvent.getSource();

			oPopover.open(oSource);

		},
		_onFioriAnalyticalListPageContentActionsSelectionChange: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var item = oEvent.getParameters();
			if (item && item.getKey) {
				var key = item.getKey();
				oModel.setProperty('/contentView', key);
			}

		},
		_onFioriAnalyticalListPageContentActionsPress: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var oSource = oEvent.getSource();
			var key = oEvent.getSource().getProperty('key');
			oModel.setProperty('/contentView', key);

		},
		_onFioriAnalyticalListPageContentActionsPress1: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var oSource = oEvent.getSource();
			var key = oEvent.getSource().getProperty('key');
			oModel.setProperty('/contentView', key);

		},
		_onFioriAnalyticalListPageContentActionsPress2: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var oSource = oEvent.getSource();
			var key = oEvent.getSource().getProperty('key');
			oModel.setProperty('/contentView', key);

		},
		_onFioriAnalyticalListPageChartContainerPress: function(oEvent) {
			var oSource = oEvent.getSource();
			var oModel = this.getView().getModel('alpModel');
			var oChartContainer = oSource.getParent().getParent();
			var oChart = oChartContainer.getAggregation('items')[1];
			if (oChart) {
				var oVizFrame = oChart.getAggregation('_vizFrame');
				if (oVizFrame) {
					var bFlag = oModel.getProperty('/showLegendAnalyticalChart');
					oVizFrame.setLegendVisible(!bFlag);
					oModel.setProperty('/showLegendAnalyticalChart', !bFlag);
				}
			}

		},
		_onFioriAnalyticalListPageChartContainerPress1: function(oEvent) {
			var oSource = oEvent.getSource();
			var oChartContainer = oSource.getParent().getParent();
			var oChart = oChartContainer.getAggregation('items')[1];
			if (oChart) {
				var oVizFrame = oChart.getAggregation('_vizFrame');
				if (oVizFrame) {
					oVizFrame.zoom({
						direction: 'in'
					});
				}
			}

		},
		_onFioriAnalyticalListPageChartContainerPress2: function(oEvent) {
			var oSource = oEvent.getSource();
			var oChartContainer = oSource.getParent().getParent();
			var oChart = oChartContainer.getAggregation('items')[1];
			if (oChart) {
				var oVizFrame = oChart.getAggregation('_vizFrame');
				if (oVizFrame) {
					oVizFrame.zoom({
						direction: 'out'
					});
				}
			}

		},
		formatFullscreenIconAnalyticalControl: function(bExitFullscreen) {
			if (bExitFullscreen) {
				return 'sap-icon://exit-full-screen';
			}
			return 'sap-icon://full-screen';

		},
		_onFioriAnalyticalListPageChartContainerPress3: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var oSource = oEvent.getSource();
			if (!oModel.getProperty('/exitFullscreenChart')) {
				var oVBox = oSource.getParent().getParent().getParent();
				var oAnalyticalPage = oVBox.getParent().getParent().getParent();
				var oDialog = oAnalyticalPage.getDependents()[0];
				var oChartContainer = oSource.getParent().getParent();
				var index = oVBox.indexOfAggregation('items', oChartContainer);
				oModel.setProperty('/positionInParentAggregation', index);
				oVBox.removeAggregation('items', oChartContainer);
				oDialog.addContent(oChartContainer);
				oModel.setProperty('/exitFullscreenChart', true);
				oDialog.open();
			} else {
				var oAnalyticalPage = oSource.getParent().getParent().getParent().getParent();
				var oDialog = oAnalyticalPage.getDependents()[0];
				var oChartContainer = oDialog.getContent()[0];
				oDialog.removeContent(oChartContainer);
				var oVBox = oAnalyticalPage.getAggregation('content');
				var oVBox1 = oVBox.getAggregation('items')[1];
				var itemsVBox1 = oVBox1.getAggregation('items');
				for (var i = 0; i < itemsVBox1.length; i++) {
					var oVBox2 = itemsVBox1[i];
					if (jQuery(oVBox2.getFocusDomRef()).hasClass('sapSmartTemplatesAnalyticalListPageChartContainer')) {
						var index = oModel.getProperty('/positionInParentAggregation');
						oVBox2.insertAggregation('items', oChartContainer, index);
					}
				}
				oModel.setProperty('/exitFullscreenChart', false);
				oDialog.close();
			}

		},
		_onFioriAnalyticalListPageTablePress: function(oEvent) {
			var oModel = this.getView().getModel('alpModel');
			var oSource = oEvent.getSource();
			if (!oModel.getProperty('/exitFullscreenTable')) {
				var oVBox = oSource.getParent().getParent().getParent();
				var oAnalyticalPage = oVBox.getParent().getParent().getParent();
				var oDialog = oAnalyticalPage.getDependents()[0];
				var oTable = oSource.getParent().getParent();
				var index = oVBox.indexOfAggregation('items', oTable);
				oModel.setProperty('/positionInParentAggregation', index);
				oVBox.removeAggregation('items', oTable);
				oDialog.addContent(oTable);
				oModel.setProperty('/exitFullscreenTable', true);
				oDialog.open();
			} else {
				var oAnalyticalPage = oSource.getParent().getParent().getParent().getParent();
				var oDialog = oAnalyticalPage.getDependents()[0];
				var oTable = oDialog.getContent()[0];
				oDialog.removeContent(oTable);
				var oVBox = oAnalyticalPage.getAggregation('content');
				var oVBox1 = oVBox.getAggregation('items')[1];
				var itemsVBox1 = oVBox1.getAggregation('items');
				for (var i = 0; i < itemsVBox1.length; i++) {
					var oVBox2 = itemsVBox1[i];
					if (jQuery(oVBox2.getFocusDomRef()).hasClass('sapSmartTemplatesAnalyticalListPageTableContainer')) {
						var index = oModel.getProperty('/positionInParentAggregation');
						oVBox2.insertAggregation('items', oTable, index);
					}
				}
				oModel.setProperty('/exitFullscreenTable', false);
				oDialog.close();
			}

		},
		_onLinkPress: function(oEvent) {

			var sPopoverName = "Popover4";
			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];

			if (!oPopover) {
				oPopover = new Popover4(this.getView());
				this.mPopovers[sPopoverName] = oPopover;

				oPopover.getControl().setPlacement("Right");

				// For navigation.
				oPopover.setRouter(this.oRouter);
			}

			var oSource = oEvent.getSource();

			oPopover.open(oSource);

		},
		_onLinkPress1: function(oEvent) {

			var sPopoverName = "Popover5";
			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];

			if (!oPopover) {
				oPopover = new Popover5(this.getView());
				this.mPopovers[sPopoverName] = oPopover;

				oPopover.getControl().setPlacement("Right");

				// For navigation.
				oPopover.setRouter(this.oRouter);
			}

			var oSource = oEvent.getSource();

			oPopover.open(oSource);

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var oView = this.getView();
			var oModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oModel, 'alpModel');
			oModel.setProperty('/filterHeaderOption', 'visual');
			oModel.setProperty('/exitFullscreenTable', false);
			oModel.setProperty('/contentView', 'charttable');
			oModel.setProperty('/exitFullscreenChart', false);
			oModel.setProperty('/showLegendAnalyticalChart', true);

		},
		onExit: function() {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "Fiori_AnalyticalListPage_AnalyticalListPage_0-analyticalheader-Fiori_AnalyticalListPage_AnalyticalHeader-1-filterbars-Fiori_AnalyticalListPage_FilterBar-1-filters-Fiori_AnalyticalListPage_ComboBoxFilter-1544627476224---1",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_AnalyticalListPage_AnalyticalListPage_0-analyticalheader-Fiori_AnalyticalListPage_AnalyticalHeader-1-filterbars-Fiori_AnalyticalListPage_FilterBar-1-filters-Fiori_AnalyticalListPage_ComboBoxFilter-1544627494976---1",
				"groups": ["items"]
			}, {
				"controlId": "Fiori_AnalyticalListPage_AnalyticalListPage_0-analyticalheader-Fiori_AnalyticalListPage_AnalyticalHeader-1-visualfilters-Fiori_AnalyticalListPage_VisualFilterBar-1-filters-Fiori_AnalyticalListPage_VisualFilterItemBarChart-1539010126707---5",
				"groups": ["bars"]
			}, {
				"controlId": "Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-tablecontent-Fiori_AnalyticalListPage_Table-1",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = this.getView().byId(aControls[i].controlId);
				if (oControl) {
					for (var j = 0; j < aControls[i].groups.length; j++) {
						var sAggregationName = aControls[i].groups[j];
						var oBindingInfo = oControl.getBindingInfo(sAggregationName);
						if (oBindingInfo) {
							var oTemplate = oBindingInfo.template;
							oTemplate.destroy();
						}
					}
				}
			}

		},
		convertToFloat: function(sStringValue) {

            return parseFloat(sStringValue);
        }
	});
}, /* bExport= */ true);

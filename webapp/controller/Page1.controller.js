sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"./Popover1", "./Popover2", "./Popover4", "./Popover5",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
    "sap/suite/ui/microchart/InteractiveLineChartPoint",
	"sap/ui/core/CustomData",
	"sap/suite/ui/microchart/InteractiveDonutChartSegment"
], function(Controller,
	JSONModel,
	MessageBox,
	Popover1,
	Popover2,
	Popover4,
	Popover5,
	utilities,
	History,
	Filter,
	InteractiveLineChartPoint,
	CustomData,
	InteractiveDonutChartSegment) {
	"use strict";

	return Controller.extend("com.sap.build.standard.salesOrderAnalysis.controller.Page1", {

		onInit: function() {
			this.getView().byId("ChartID").removeAllPoints();
		},
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

			// Get CustomData from Clicked Bar
			let sCustomerIDClicked = oControlEvent.getParameters().bar.getCustomData()[0].getValue();
			oControlEvent.getParameters().bar.setProperty("selected", false);

			// Set Label for Graphic
			let sLabel = "Histórico Comprador: " + oControlEvent.getParameters().bar.getProperty("label");
			let oLabelModel = this.getOwnerComponent().getModel("labels");
			oLabelModel.setProperty("/historico", sLabel);
			oLabelModel.setProperty("/material", "Materiais mais comprados: ")
             
			// Get Model
            let oModel = this.getOwnerComponent().getModel();

			let oFilter = new Array();
			oFilter.push(new Filter("CustomerID", sap.ui.model.FilterOperator.EQ, sCustomerIDClicked));	

			oModel.read("/CustomerSalesYearSet", {
			   filters: oFilter,
               success: (oData) => {
				this._setPoints(oData);
			   },
			   error: (oError) => {
			   }
			});
		},

		_setPoints: function(oData) {

			let oChartID = this.getView().byId("ChartID");
			oChartID.removeAllPoints();

			let oDonutChart = this.getView().byId("DonutBar");
			oDonutChart.removeAllSegments();

			var index;
			var total = oData.results.length;

			for(index=0;index<total;index++)
			{
				let oDataItem = oData.results[index];

                let oPoint = new InteractiveLineChartPoint();

				oPoint.setLabel(oDataItem.Year);
				oPoint.setValue(this._parseValue(oDataItem.Total));
				oPoint.setSelected = false;
				oPoint.setColor("Neutral");
                
				// Store CustomerID
                let oCustomData = new CustomData();
				oCustomData.setKey("CustomerID");
				oCustomData.setValue(oDataItem.CustomerID);
				oPoint.insertCustomData(oCustomData, 0)

				// Store Year
				oCustomData = new CustomData();
				oCustomData.setKey("Year");
				oCustomData.setValue(oDataItem.Year);
				oPoint.insertCustomData(oCustomData, 1)

			    // Store Year
				oCustomData = new CustomData();
				oCustomData.setKey("CustomerName");
				oCustomData.setValue(oDataItem.CustomerName);
				oPoint.insertCustomData(oCustomData, 2)
				oChartID.addPoint(oPoint);

			}
		},
		onLineChartClicked: function(oEvent) {

			oEvent.getParameters().point.setProperty("selected", false);

			//Get Parameters from CustomData of clicked Point
			let sCustomerID   = oEvent.getParameters().point.getCustomData()[0].getValue();
			let sYear         = oEvent.getParameters().point.getCustomData()[1].getValue();
			let sCustomerName = oEvent.getParameters().point.getCustomData()[2].getValue();
			
			// Set Donutbar Label
			let sDonutLabel = "Materiais mais comprados: " + sCustomerName + '/' + sYear;
			let oModelLabel = this.getOwnerComponent().getModel("labels");
			oModelLabel.setProperty("/material", sDonutLabel);

			// Set Filter for Donut Chart
			let oArrayFilter = new Array();
           
			oArrayFilter.push(new Filter("CustomerID", sap.ui.model.FilterOperator.EQ, sCustomerID));
			oArrayFilter.push(new Filter("AnoVenda", sap.ui.model.FilterOperator.EQ, sYear));

			//Get Entries for Donut Chart
			let oModel = this.getOwnerComponent().getModel();

			oModel.read("/CustomerSalesMaterialSet", {
				filters: oArrayFilter,
				success: (oData) => {
					this._SetDonutSegments(oData);
				 },
				error: (oError) => { }
			})
		},

		_SetDonutSegments: function(oData) {

			let oDonutChart = this.getView().byId("DonutBar");

			// Clear all segments from Donut Bar
			oDonutChart.removeAllSegments();

			let iIndex;
			let iTotal = oData.results.length;

			debugger;

			for (iIndex=0;iIndex<iTotal;iIndex++)
			{
				// Add Segments to Donut Chart Bar
				let oDonutElement = new InteractiveDonutChartSegment();

				oDonutElement.setColor("Neutral");
				oDonutElement.setLabel(oData.results[iIndex].MaterialDescription);
				oDonutElement.setValue(this._parseValue(oData.results[iIndex].Total));

				oDonutChart.addSegment(oDonutElement);
			}

		},
		_parseValue: function(sInformedValue) {

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

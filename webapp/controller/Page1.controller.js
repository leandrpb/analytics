sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
    "sap/suite/ui/microchart/InteractiveLineChartPoint",
	"sap/ui/core/CustomData",
	"sap/suite/ui/microchart/InteractiveDonutChartSegment",
	"sap/m/ColumnListItem",
	"sap/ui/base/ManagedObject",
	"sap/m/Text",
	"sap/m/ObjectNumber",
	"../model/formatter",
	"sap/ui/core/format/NumberFormat"
], function(Controller,
	JSONModel,
	MessageBox,
	utilities,
	History,
	Filter,
	InteractiveLineChartPoint,
	CustomData,
	InteractiveDonutChartSegment,
	ColumnListItem,
	ManagedObject,
	Text,
	ObjectNumber,
	formatter,
	NumberFormat) {
	"use strict";

	return Controller.extend("com.sap.build.standard.salesOrderAnalysis.controller.Page1", {

		formatter: formatter,
		handleRouteMatched: function(oEvent) {
			var sAppId = "App64b04da02b8b63015356ca4e";
			debugger;

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
			oLabelModel.setProperty("/material", "Materiais mais comprados: ");
			oLabelModel.setProperty("/ordem", "Ordens de Venda para Material: ");
             
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

			let oOVTable = this.getView().byId("OVTable");
			oOVTable.removeAllItems();

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

			    // Store CustomerName
				oCustomData = new CustomData();
				oCustomData.setKey("CustomerName");
				oCustomData.setValue(oDataItem.CustomerName);
				oPoint.insertCustomData(oCustomData, 2);
				oChartID.addPoint(oPoint);

			}
		},
		onLineChartClicked: function(oEvent) {

			oEvent.getParameters().point.setProperty("selected", false);

			let oOVTable = this.getView().byId("OVTable");
			oOVTable.removeAllItems();

			//Get Parameters from CustomData of clicked Point
			let sCustomerID   = oEvent.getParameters().point.getCustomData()[0].getValue();
			let sYear         = oEvent.getParameters().point.getCustomData()[1].getValue();
			let sCustomerName = oEvent.getParameters().point.getCustomData()[2].getValue();
			
			// Set Donutbar Label
			let sDonutLabel = "Materiais mais comprados: " + sCustomerName + '/' + sYear;
			let oModelLabel = this.getOwnerComponent().getModel("labels");
			oModelLabel.setProperty("/material", sDonutLabel);
			oModelLabel.setProperty("/ordem", "Ordens de Venda para Material: ");

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

			for (iIndex=0;iIndex<iTotal;iIndex++)
			{
				// Add Segments to Donut Chart Bar
				let oDonutElement = new InteractiveDonutChartSegment();

				oDonutElement.setColor("Neutral");
				oDonutElement.setLabel(oData.results[iIndex].MaterialDescription);
				oDonutElement.setValue(this._parseValue(oData.results[iIndex].Total));
				//let oCurrencyFormat = NumberFormat.getCurrencyInstance();
				//oDonutElement.setValue(oCurrencyFormat.parse(oData.results[iIndex].Total));

				let oDataItem = oData.results[iIndex];

				// Store CustomerID
                let oCustomData = new CustomData();
				oCustomData.setKey("CustomerID");
				oCustomData.setValue(oDataItem.CustomerID);
				oDonutElement.insertCustomData(oCustomData, 0)

				// Store Year
				oCustomData = new CustomData();
				oCustomData.setKey("AnoVenda");
				oCustomData.setValue(oDataItem.AnoVenda);
				oDonutElement.insertCustomData(oCustomData, 1)

			    // Store CustomerName
				oCustomData = new CustomData();
				oCustomData.setKey("CustomerName");
				oCustomData.setValue(oDataItem.CustomerName);
				oDonutElement.insertCustomData(oCustomData, 2);				

			    // Store CustomerName
				oCustomData = new CustomData();
				oCustomData.setKey("MaterialID");
				oCustomData.setValue(oDataItem.MaterialID);
				oDonutElement.insertCustomData(oCustomData, 3);
                
				oDonutChart.addSegment(oDonutElement);
			}

		},

		onDonutClicked: function(oEvent) {

			let sCustomerID   = oEvent.getParameters().segment.getCustomData()[0].getValue();
			let sAnoVenda     = oEvent.getParameters().segment.getCustomData()[1].getValue();
			let sCustomerName = oEvent.getParameters().segment.getCustomData()[2].getValue();
			let sMaterialID   = oEvent.getParameters().segment.getCustomData()[3].getValue();

			// Set Filter for Donut Chart
			let oArrayFilter = new Array();
          
			oArrayFilter.push(new Filter("CustomerID", sap.ui.model.FilterOperator.EQ, sCustomerID));
			oArrayFilter.push(new Filter("AnoVenda", sap.ui.model.FilterOperator.EQ, sAnoVenda));
			oArrayFilter.push(new Filter("MaterialID", sap.ui.model.FilterOperator.EQ, sMaterialID));

			let oModel = this.getOwnerComponent().getModel();

			// Set Label
			let sOrderLabel = "Ordens de Venda para Material: " + sCustomerName + '/' + sAnoVenda + "/" + sMaterialID;
			let oModelLabel = this.getOwnerComponent().getModel("labels");
			oModelLabel.setProperty("/ordem", sOrderLabel);
			            

			let oOVTable = this.getView().byId("OVTable");

			// Remover todos os items
			oOVTable.removeAllItems();
			var oTemplate = new ColumnListItem ( // Celular do Tipo Agregador
				{ cells: [ new Text({text:"{SalesOrder}", width:"auto", maxLines:1, wrapping:false, textAlign:"Begin", textDirection:"Inherit", visible:true}),
				           new Text({text:"{SalesItem}", width:"auto", maxLines:1, wrapping:false, textAlign:"Begin", textDirection:"Inherit", visible:true}),
						   new Text({text:"{Tipo}", width:"auto", maxLines:1, wrapping:false, textAlign:"Begin", textDirection:"Inherit", visible:true}),
						   new ObjectNumber({number:"{path: 'Quantity', type: 'sap.ui.model.type.Float', formatOptions: { maxFractionDigits: 2 }}", unit: "{UnitMeasure}"}),
						   new ObjectNumber({number:"{path: 'Total', type: 'sap.ui.model.type.Float', formatOptions: { maxFractionDigits: 2 }}", unit:"{Moeda}"})
						 ]

				}
			);

			let oBindingInfo = new ManagedObject();
			oBindingInfo.path = "/CustomerSalesOVSet";
			oBindingInfo.template = oTemplate;
			oBindingInfo.filters  = oArrayFilter;
            
			oOVTable.bindItems(oBindingInfo);

		},
		_parseValue: function(sInformedValue) {

			return parseFloat(sInformedValue);

		},
		formatFullscreenIconAnalyticalControl: function(bExitFullscreen) {
			if (bExitFullscreen) {
				return 'sap-icon://exit-full-screen';
			}
			return 'sap-icon://full-screen';

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
			this.getView().byId("ChartID").removeAllPoints();

		},
		convertToFloat: function(sStringValue) {

            return parseFloat(sStringValue);
        }
	});
}, /* bExport= */ true);
